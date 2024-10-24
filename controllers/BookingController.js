const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const Seat = require('../models/Seat');
const Booking = require('../models/Booking');
const { calculateTripPrice } = require('./PricingController');
const User = require('../models/User');
const Passenger = require('../models/Passenger');

const PayOS = require('@payos/node');
const dotenv = require('dotenv');
dotenv.config();
const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);
const crypto = require('crypto');

function generateOrderCode(bookingId) {
    const idString = bookingId.toString();
    const hash = crypto.createHash('sha256').update(idString + Date.now()).digest('hex'); 
    const orderCode = parseInt(hash.slice(0, 15), 16);
    return Math.abs(orderCode % 9007199254740991);
}

exports.createBooking = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { tripId, seatNumbers, includeReturnTrip, returnSeatNumbers, paymentMethod } = req.body;
        const userId = req.user._id;

        const MAX_SEATS_PER_BOOKING = 4;

        // Xác thực đầu vào
        if (seatNumbers.length > MAX_SEATS_PER_BOOKING) {
            throw new Error(`Chỉ được đặt tối đa ${MAX_SEATS_PER_BOOKING} ghế trong một lần đặt`);
        }

        if (!tripId) {
            throw new Error('Mã chuyến đi là bắt buộc');
        }
        if (!seatNumbers || seatNumbers.length === 0) {
            throw new Error('Phải chọn số ghế trước khi đặt vé');
        }

        const trip = await Trip.findById(tripId).session(session).lean();
        if (!trip) {
            throw new Error('Chuyến đi không tồn tại');
        }

        // Kiểm tra booking trước đó đã được thanh toán hay chưa
        let previousBooking = await Booking.findOne({
            user: userId,
            trip: tripId,
            status: 'Confirmed',
            paymentStatus: 'Paid'
        }).session(session);

        let totalPrice = 0; // Khởi tạo tổng giá

        // Lấy thông tin ghế và tính toán tổng giá
        const seats = await Seat.find({
            trip: tripId,
            seatNumber: { $in: seatNumbers },
            isAvailable: true,
            isReserved: false
        }).session(session).lean();

        const unavailableSeats = seats.filter(seat => !seat.isAvailable || seat.isReserved);
        if (unavailableSeats.length > 0) {
            const unavailableSeatNumbers = unavailableSeats.map(seat => seat.seatNumber);
            throw new Error(`Các ghế sau đã được đặt trước: ${unavailableSeatNumbers.join(', ')}`);
        }

        // Tính tổng giá cho các ghế đã đặt
        for (const seat of seats) {
            totalPrice += seat.price; // Cộng giá của từng ghế vào tổng giá
        }

        // Nếu có booking trước đã thanh toán, tạo booking mới
        let booking;
        if (previousBooking) {
            booking = new Booking({
                user: userId,
                trip: tripId,
                seatNumbers,
                totalPrice,
                status: paymentMethod === 'Online' ? 'Pending' : 'Confirmed',
                paymentMethod,
                paymentStatus: paymentMethod === 'Online' ? 'Unpaid' : 'Paid',
            });

            await booking.save({ session });

            // Cập nhật trạng thái ghế
            await Seat.updateMany(
                { trip: tripId, seatNumber: { $in: seatNumbers } },
                { $set: { isAvailable: false, bookedBy: userId } },
                { session }
            );
        } else {
            // Nếu chưa có booking trước đó, tạo booking mới như thông thường
            booking = new Booking({
                user: userId,
                trip: tripId,
                seatNumbers,
                totalPrice,
                status: paymentMethod === 'Online' ? 'Pending' : 'Confirmed',
                paymentMethod,
                paymentStatus: paymentMethod === 'Online' ? 'Unpaid' : 'Paid',
            });

            await booking.save({ session });

            // Cập nhật trạng thái ghế
            await Seat.updateMany(
                { trip: tripId, seatNumber: { $in: seatNumbers } },
                { $set: { isAvailable: false, bookedBy: userId } },
                { session }
            );
        }

        // Cập nhật thông tin hành khách
        let passenger = await Passenger.findOne({ user: userId, trip: tripId }).session(session);

        if (passenger) {
            const newSeats = seatNumbers.filter(seat => !passenger.seatNumbers.includes(seat));
            passenger.seatNumbers = [...passenger.seatNumbers, ...newSeats];
            await passenger.save({ session });
        } else {
            passenger = new Passenger({
                name: req.user.fullName,
                email: req.user.email,
                phone: req.user.phoneNumber,
                seatNumbers,
                trip: tripId,
                user: userId
            });
            await passenger.save({ session });
        }

        // Cộng điểm thưởng cho người dùng
        const pointsToAdd = seatNumbers.length * 10;
        const user = await User.findById(userId).session(session);
        if (user) {
            user.loyaltyPoints += pointsToAdd;
            await user.save({ session });
        }

        // Xử lý chuyến khứ hồi nếu có
        if (includeReturnTrip && trip.isRoundTrip && trip.returnTripId) {
            const returnTripId = trip.returnTripId;
            const returnTrip = await Trip.findById(returnTripId).session(session).lean();
            if (!returnTrip) {
                throw new Error('Chuyến đi khứ hồi không tồn tại');
            }

            const finalReturnSeatNumbers = returnSeatNumbers && returnSeatNumbers.length > 0 ? returnSeatNumbers : seatNumbers;

            const returnSeats = await Seat.find({
                trip: returnTripId,
                seatNumber: { $in: finalReturnSeatNumbers },
                isAvailable: true,
                isReserved: false
            }).session(session).lean();

            if (returnSeats.length !== finalReturnSeatNumbers.length) {
                throw new Error('Một hoặc nhiều ghế khứ hồi không còn trống');
            }

            const returnPrice = returnSeats.reduce((acc, seat) => acc + seat.price, 0); // Tính tổng giá cho ghế khứ hồi
            await Seat.updateMany(
                { _id: { $in: returnSeats.map(seat => seat._id) } },
                { $set: { isAvailable: false, bookedBy: userId } },
                { session }
            );

            const returnBooking = new Booking({
                user: userId,
                trip: returnTripId,
                seatNumbers: finalReturnSeatNumbers,
                totalPrice: returnPrice,
                status: 'Confirmed'
            });

            await returnBooking.save({ session });
        }

        // Xử lý thanh toán nếu phương thức là Online
        if (paymentMethod === 'Online') {
            const orderCode = generateOrderCode(booking._id);
            const body = {
                orderCode, 
                amount: booking.totalPrice,
                description: `Thanh toán cho vé ${tripId.slice(17, 24)}`,
                items: seatNumbers.map(seat => {
                    const seatInfo = seats.find(s => s.seatNumber === seat);
                    if (!seatInfo) {
                        throw new Error(`Ghế số ${seat} không tồn tại trong cơ sở dữ liệu`);
                    }
                    return { name: `Ghế số ${seat}`, quantity: 1, price: seatInfo.price };
                }),
                returnUrl: `http://localhost:5000/api/payment-success`,
                cancelUrl: `http://localhost:5000/payment-cancel`,
            };

            const paymentLinkResponse = await payOS.createPaymentLink(body);
            const paymentData = paymentLinkResponse.hasOwnProperty('data') ? paymentLinkResponse.data : paymentLinkResponse;

            if (paymentData && paymentData.checkoutUrl) {
                await session.commitTransaction();
                session.endSession();

                // Sau khi thanh toán thành công, gộp booking mới với booking trước đó
                if (previousBooking) {
                    previousBooking.seatNumbers = [...previousBooking.seatNumbers, ...seatNumbers];
                    previousBooking.totalPrice += booking.totalPrice;

                    // Lưu booking cũ sau khi gộp
                    await previousBooking.save({ session });

                    // Xóa booking mới vì đã gộp vào booking cũ
                    await Booking.deleteOne({ _id: booking._id }).session(session);
                }

                return res.status(200).json({
                    success: true,
                    data: {
                        bookingId: previousBooking ? previousBooking._id : booking._id,
                        paymentLink: paymentData.checkoutUrl,
                        qrCode: paymentData.qrCode,
                    }
                });
            } else {
                throw new Error('Lỗi tạo link thanh toán PayOS');
            }
        }

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ success: false, message: error.message });
    }
};


exports.paymentSuccess = async (req, res) => {
    
    const { orderCode } = req.query;
    try {
        const booking = await Booking.findOne({ orderCode });

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking không tồn tại' });
        }
        booking.status = 'Confirmed';
        booking.paymentStatus = 'Paid';
        await booking.save();
        
        return res.status(200).json({ success: true, message: 'Thanh toán thành công', data: booking });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi khi xử lý thanh toán', error: error.message });
    }
};



exports.confirmPaymentOnBoard = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking không tồn tại' });
        }

        if (booking.paymentMethod !== 'OnBoard') {
            return res.status(400).json({ success: false, message: 'Đây không phải là booking thanh toán khi lên xe' });
        }

        booking.paymentStatus = 'Paid';
        booking.status = 'Confirmed';
        await booking.save();

        return res.status(200).json({ success: true, message: 'Thanh toán thành công', data: booking });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi xác nhận thanh toán' });
    }
};


exports.cancelBooking = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params;

        const booking = await Booking.findById(id).populate('trip').session(session);
        if (!booking) {
            throw new Error('Booking not found');
        }

        if (booking.status === 'Cancelled') {
            throw new Error('Booking is already cancelled');
        }

        booking.status = 'Cancelled';
        await booking.save({ session });

        await Seat.updateMany(
            { trip: booking.trip._id, seatNumber: { $in: booking.seatNumbers } },
            { $set: { isAvailable: true, bookedBy: null } },
            { session }
        );
        const pointsToDeduct = booking.seatNumbers.length * 10;
        const user = await User.findById(booking.user).session(session);

        if (user) {
            user.loyaltyPoints = Math.max(user.loyaltyPoints - pointsToDeduct, 0);
            await user.save({ session }); 
        }


        await session.commitTransaction();
        session.endSession();

        const bookedSeatsCount = await Booking.countDocuments({ trip: booking.trip._id, status: 'Confirmed' });
        req.io.emit('seatCancelled', {
            tripId: booking.trip._id,
            seatNumber: booking.seatNumber,
            availableSeats: booking.trip.totalSeats - bookedSeatsCount
        });

        return res.status(200).json({ success: true, message: 'Booking cancelled successfully', data: booking });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ success: false, message: 'Failed to cancel booking', error: error.message });
    }
};
exports.cancelSeatInBooking = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id, seatNumberToCancel } = req.params;
        const booking = await Booking.findById(id).populate('trip').session(session);
        if (!booking) {
            throw new Error('Booking not found');
        }

        if (booking.status === 'Cancelled') {
            throw new Error('Booking is already cancelled');
        }

        const seatIndex = booking.seatNumbers.indexOf(parseInt(seatNumberToCancel));
        if (seatIndex === -1) {
            throw new Error('Seat not found in booking');
        }

        booking.seatNumbers.splice(seatIndex, 1);
        if (booking.seatNumbers.length === 0) {
            booking.status = 'Cancelled';
        }

        await booking.save({ session });
        await Seat.updateOne(
            { trip: booking.trip._id, seatNumber: seatNumberToCancel },
            { $set: { isAvailable: true, bookedBy: null } },
            { session }
        );
        const pointsToDeduct = 10; 
        const user = await User.findById(booking.user).session(session);

        if (user) {
            user.loyaltyPoints = Math.max(user.loyaltyPoints - pointsToDeduct, 0);
            await user.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        const bookedSeatsCount = await Booking.countDocuments({ trip: booking.trip._id, status: 'Confirmed' });
        if (req.io && typeof req.io.emit === 'function') {
            req.io.emit('seatCancelled', {
                tripId: booking.trip._id,
                seatNumber: seatNumberToCancel,
                availableSeats: booking.trip.totalSeats - bookedSeatsCount
            });
        }

        return res.status(200).json({ success: true, message: 'Seat cancelled successfully', data: booking });
    } catch (error) {   
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        session.endSession();
        return res.status(500).json({ success: false, message: 'Failed to cancel seat', error: error.message });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const userId = req.user._id;
        const bookings = await Booking.find({ user: userId }).populate('trip');
        return res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to get bookings', error: error.message });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id).populate('trip');
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        return res.status(200).json({ success: true, data: booking });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to get booking', error: error.message });
    }
};

