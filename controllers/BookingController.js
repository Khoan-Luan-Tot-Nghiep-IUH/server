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
    const orderCode = parseInt(hash.slice(0, 8), 16); // Giới hạn mã orderCode
    return Math.abs(orderCode);
}
exports.createBooking = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { tripId, seatNumbers, includeReturnTrip, returnSeatNumbers, paymentMethod } = req.body;
        const userId = req.user._id;

        const MAX_SEATS_PER_BOOKING = 4;

        // Loại bỏ các ghế trùng lặp trong seatNumbers
        const uniqueSeatNumbers = [...new Set(seatNumbers)];

        // Xác thực đầu vào
        if (uniqueSeatNumbers.length > MAX_SEATS_PER_BOOKING) {
            throw new Error(`Chỉ được đặt tối đa ${MAX_SEATS_PER_BOOKING} ghế trong một lần đặt`);
        }
        if (!tripId) throw new Error('Mã chuyến đi là bắt buộc');
        if (!uniqueSeatNumbers || uniqueSeatNumbers.length === 0) throw new Error('Phải chọn số ghế trước khi đặt vé');

        // Kiểm tra chuyến đi
        const trip = await Trip.findById(tripId).session(session).lean();
        if (!trip) throw new Error('Chuyến đi không tồn tại');
        
        if (trip.status !== 'Scheduled') {
            throw new Error('Chuyến đi hiện tại không còn khả dụng để đặt vé');
        }
        let totalPrice = 0;

        // Kiểm tra trạng thái ghế đã được đặt
        const seats = await Seat.find({
            trip: tripId,
            seatNumber: { $in: uniqueSeatNumbers },
        }).session(session).lean();

        // Lọc ra các ghế đã bị đặt bởi người dùng khác hoặc bởi chính người dùng với phương thức khác
        const unavailableSeats = seats.filter(seat => {
            return (
                seat.isAvailable === false && 
                (seat.bookedBy.toString() !== userId.toString() || 
                 seat.paymentMethod !== paymentMethod) // Ghế đã được đặt bằng phương thức khác
            );
        });

        if (unavailableSeats.length > 0) {
            const unavailableSeatNumbers = unavailableSeats.map(seat => seat.seatNumber);
            throw new Error(`Các ghế sau đã được đặt trước: ${unavailableSeatNumbers.join(', ')}`);
        }

        totalPrice = seats.reduce((acc, seat) => acc + seat.price, 0);

        // Kiểm tra booking chưa thanh toán của người dùng
        let existingBooking = await Booking.findOne({
            user: userId,
            trip: tripId,
            paymentMethod: paymentMethod,
            paymentStatus: 'Unpaid'
        }).session(session);

        let booking;
        if (existingBooking) {
            // Nếu đã có booking OnBoard chưa thanh toán, gộp thêm ghế mới vào
            existingBooking.seatNumbers = [...new Set([...existingBooking.seatNumbers, ...uniqueSeatNumbers])];
            existingBooking.totalPrice += totalPrice;
            booking = existingBooking;
        } else {
            // Nếu chưa có booking hoặc phương thức thanh toán khác, tạo booking mới
            booking = new Booking({
                user: userId,
                trip: tripId,
                seatNumbers: uniqueSeatNumbers,
                totalPrice,
                status: paymentMethod === 'Online' ? 'Pending' : 'Confirmed',
                paymentMethod,
                paymentStatus: 'Unpaid',
            });
        }

        // Lưu orderCode cho booking mới
        const orderCode = generateOrderCode(booking._id);
        booking.orderCode = orderCode;
        await booking.save({ session });

        // Cập nhật trạng thái ghế đã được đặt
        await Seat.updateMany(
            { trip: tripId, seatNumber: { $in: uniqueSeatNumbers } },
            { $set: { isAvailable: false, bookedBy: userId, paymentMethod: paymentMethod } }, // Cập nhật phương thức thanh toán
            { session }
        );

        // Xử lý chuyến khứ hồi nếu có
        if (includeReturnTrip && trip.isRoundTrip && trip.returnTripId) {
            const returnTripId = trip.returnTripId;
            const returnTrip = await Trip.findById(returnTripId).session(session).lean();
            if (!returnTrip) throw new Error('Chuyến đi khứ hồi không tồn tại');

            const finalReturnSeatNumbers = returnSeatNumbers && returnSeatNumbers.length > 0 ? returnSeatNumbers : uniqueSeatNumbers;
            const returnSeats = await Seat.find({
                trip: returnTripId,
                seatNumber: { $in: finalReturnSeatNumbers },
                isAvailable: true
            }).session(session).lean();

            if (returnSeats.length !== finalReturnSeatNumbers.length) {
                throw new Error('Một hoặc nhiều ghế khứ hồi không còn trống');
            }

            const returnPrice = returnSeats.reduce((acc, seat) => acc + seat.price, 0);
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
            const body = {
                orderCode,
                amount: booking.totalPrice,
                description: `Thanh toán cho vé ${tripId.slice(17, 24)}`,
                items: uniqueSeatNumbers.map(seat => {
                    const seatInfo = seats.find(s => s.seatNumber === seat);
                    if (!seatInfo) {
                        throw new Error(`Ghế số ${seat} không tồn tại trong cơ sở dữ liệu`);
                    }
                    return { name: `Ghế số ${seat}`, quantity: 1, price: seatInfo.price };
                }),
                returnUrl: `http://localhost:5000/api/payment-success`,
                cancelUrl: `http://localhost:5000/api/payment-cancel`,
            };

            const paymentLinkResponse = await payOS.createPaymentLink(body);
            const paymentData = paymentLinkResponse.hasOwnProperty('data') ? paymentLinkResponse.data : paymentLinkResponse;

            if (paymentData && paymentData.checkoutUrl) {
                await session.commitTransaction();
                session.endSession();

                return res.status(200).json({
                    success: true,
                    data: {
                        bookingId: booking._id,
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
        return res.redirect(`${process.env.CLIENT_URL}/user/ticket-buy`);
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi khi xử lý thanh toán', error: error.message });
    }
};
exports.paymentCancel = async (req, res) => {
    const { orderCode } = req.query;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const booking = await Booking.findOne({ orderCode }).session(session);
        if (!booking) return res.status(404).json({ success: false, message: 'Booking không tồn tại' });
        booking.status = 'Canceled';
        booking.paymentStatus = 'Unpaid';
        await booking.save({ session });
        await Seat.updateMany(
            { trip: booking.trip, seatNumber: { $in: booking.seatNumbers } },
            { $set: { isAvailable: true, bookedBy: null, paymentMethod: null } },
            { session }
        );
        await session.commitTransaction();
        session.endSession();
        res.redirect(`${process.env.CLIENT_URL}/user/ticket-buy`);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ success: false, message: 'Lỗi khi hủy thanh toán', error: error.message });
    }
};

exports.getBookingHistory = async (req, res) => {
    try {
        // Lấy userId từ thông tin người dùng đăng nhập
        const userId = req.user._id;

        // Truy vấn danh sách các booking của người dùng, populate thêm thông tin chuyến đi
        const bookings = await Booking.find({ user: userId })
            .populate({
                path: 'trip',
                select: 'departureLocation arrivalLocation departureTime arrivalTime busType basePrice status', // Chọn các trường cần thiết từ trip
                populate: [
                    { path: 'departureLocation', select: 'name' }, // Lấy tên địa điểm khởi hành
                    { path: 'arrivalLocation', select: 'name' },   // Lấy tên địa điểm đến
                    { path: 'busType', select: 'name' },           // Lấy thông tin loại xe
                ]
            })
            .sort({ createdAt: -1 }); // Sắp xếp giảm dần theo thời gian tạo

        // Kiểm tra xem có lịch sử đặt vé không
        if (!bookings || bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không có lịch sử đặt vé'
            });
        }

        // Trả về danh sách booking với thông tin chuyến đi
        res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.error("Lỗi khi lấy lịch sử đặt vé:", error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy lịch sử đặt vé',
            error: error.message
        });
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

