const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const Seat = require('../models/Seat');
const Booking = require('../models/Booking');
const { calculateTripPrice } = require('./PricingController');
const User = require('../models/User');


exports.createBooking = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { tripId, seatNumbers, includeReturnTrip, returnSeatNumbers } = req.body;
        const userId = req.user._id;

        const MAX_SEATS_PER_BOOKING = 4; 
        const MAX_TOTAL_SEATS_PER_USER = 10;
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
        let booking = await Booking.findOne({
            user: userId,
            trip: tripId,
            status: 'Confirmed'
        }).session(session);
        const existingBooking = await Booking.findOne({
            user: userId,
            trip: tripId,
            status: 'Confirmed'
        }).session(session);

        if (existingBooking) {
            const totalSeatsAfterBooking = existingBooking.seatNumbers.length + seatNumbers.length;
            if (totalSeatsAfterBooking > MAX_TOTAL_SEATS_PER_USER) {
                throw new Error(`Bạn chỉ được đặt tối đa ${MAX_TOTAL_SEATS_PER_USER} ghế cho chuyến đi này`);
            }
        } else if (seatNumbers.length > MAX_TOTAL_SEATS_PER_USER) {
            throw new Error(`Bạn chỉ được đặt tối đa ${MAX_TOTAL_SEATS_PER_USER} ghế cho chuyến đi này`);
        }

        if (booking) {
            const existingSeats = booking.seatNumbers;
            const newSeats = seatNumbers.filter(seat => !existingSeats.includes(seat));

            if (newSeats.length === 0) {
                throw new Error('Bạn đã đặt các ghế này rồi');
            }

            booking.seatNumbers = [...existingSeats, ...newSeats];
            const { finalPrice } = await calculateTripPrice(tripId, new Date());
            booking.totalPrice += newSeats.length * finalPrice;
        } else {
            const seats = await Seat.find({
                trip: tripId,
                seatNumber: { $in: seatNumbers },
                isAvailable: true,
                isReserved: false
            }).session(session).lean();

            const unavailableSeats = seats.filter(seat => !seat.isAvailable || seat.isReserved);
            const availableSeats = seats.filter(seat => seat.isAvailable && !seat.isReserved);
            
            if (unavailableSeats.length > 0) {
                const unavailableSeatNumbers = unavailableSeats.map(seat => seat.seatNumber);
                throw new Error(`Các ghế sau đã được đặt trước: ${unavailableSeatNumbers.join(', ')}`);
            }
            if (availableSeats.length !== seatNumbers.length) {
                throw new Error('Số lượng ghế trống không khớp với yêu cầu');
            }
            const { finalPrice } = await calculateTripPrice(tripId, new Date());
            const totalPrice = seatNumbers.length * finalPrice;

            booking = new Booking({
                user: userId,
                trip: tripId,
                seatNumbers,
                totalPrice,
                status: 'Confirmed'
            });
        }

        await booking.save({ session });
        await Seat.updateMany(
            { trip: tripId, seatNumber: { $in: seatNumbers } },
            { $set: { isAvailable: false, bookedBy: userId } },
            { session }
        );
        const pointsToAdd = seatNumbers.length * 10; 
        const user = await User.findById(userId).session(session);
        if (user) {
            user.loyaltyPoints += pointsToAdd; 
            await user.save({ session });
        }
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

            const { finalPrice: returnPrice } = await calculateTripPrice(returnTripId, new Date());

            await Seat.updateMany(
                { _id: { $in: returnSeats.map(seat => seat._id) } },
                { $set: { isAvailable: false, bookedBy: userId } },
                { session }
            );
            const returnBooking = new Booking({
                user: userId,
                trip: returnTripId,
                seatNumbers: finalReturnSeatNumbers,
                totalPrice: finalReturnSeatNumbers.length * returnPrice,
                status: 'Confirmed'
            });

            await returnBooking.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        if (req.io && typeof req.io.emit === 'function') {
            req.io.emit('seatsBooked', {
                tripId,
                seatNumbers,
                availableSeats: trip.totalSeats - booking.seatNumbers.length
            });

            if (includeReturnTrip && trip.isRoundTrip && trip.returnTripId) {
                req.io.emit('seatsBooked', {
                    tripId: trip.returnTripId,
                    seatNumbers: returnSeatNumbers || seatNumbers,
                    availableSeats: returnTrip.totalSeats - (returnSeatNumbers || seatNumbers).length
                });
            }
        }

        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Lỗi tạo booking:', {
            message: error.message,
            stack: error.stack,
            tripId: typeof tripId !== 'undefined' ? tripId : 'Chưa xác định',
            seatNumbers: typeof seatNumbers !== 'undefined' ? seatNumbers : 'Chưa xác định',
            includeReturnTrip: typeof includeReturnTrip !== 'undefined' ? includeReturnTrip : 'Chưa xác định',
            returnSeatNumbers: typeof returnSeatNumbers !== 'undefined' ? returnSeatNumbers : 'Chưa xác định'
        });
        res.status(400).json({ success: false, message: error.message });
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

