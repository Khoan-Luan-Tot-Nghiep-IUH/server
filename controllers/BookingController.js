const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const Seat = require('../models/Seat');
const Booking = require('../models/Booking');
const { calculateTripPrice } = require('./PricingController');

exports.createBooking = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();


    try {
        const { tripId, seatNumbers, includeReturnTrip, returnSeatNumbers } = req.body;
        const userId = req.user._id;

        // Kiểm tra seatNumbers
        if (!seatNumbers || seatNumbers.length === 0) {
            throw new Error('Seat numbers are required for booking');
        }

        // Xử lý đặt vé cho chuyến đi chính
        const trip = await Trip.findById(tripId).session(session).lean();
        if (!trip) {
            throw new Error('Trip not found');
        }

        const seats = await Seat.find({
            trip: tripId,
            seatNumber: { $in: seatNumbers },
            isAvailable: true,
            isReserved: false
        }).session(session).lean();

        if (seats.length !== seatNumbers.length) {
            throw new Error('One or more seats are no longer available');
        }

        // Tính toán giá vé cho chuyến đi chính
        const { finalPrice } = await calculateTripPrice(tripId, new Date());

        // Cập nhật trạng thái ghế
        await Seat.updateMany(
            { _id: { $in: seats.map(seat => seat._id) } },
            { $set: { isAvailable: false, bookedBy: userId } },
            { session }
        );

        const bookings = await Promise.all(seatNumbers.map(seatNumber =>
            new Booking({
                user: userId,
                trip: tripId,
                seatNumber,
                price: finalPrice, 
                status: 'Confirmed'
            }).save({ session })
        ));

        // Xử lý đặt vé cho chuyến về (nếu có)
        if (includeReturnTrip && trip.isRoundTrip && trip.returnTripId) {
            const returnTripId = trip.returnTripId;
            const returnTrip = await Trip.findById(returnTripId).session(session).lean();

            if (!returnTrip) {
                throw new Error('Return trip not found');
            }

            // Nếu người dùng không chỉ định ghế cho lượt về, sử dụng ghế của lượt đi
            const finalReturnSeatNumbers = returnSeatNumbers && returnSeatNumbers.length > 0 ? returnSeatNumbers : seatNumbers;

            const returnSeats = await Seat.find({
                trip: returnTripId,
                seatNumber: { $in: finalReturnSeatNumbers },
                isAvailable: true,
                isReserved: false
            }).session(session).lean();

            if (returnSeats.length !== finalReturnSeatNumbers.length) {
                throw new Error('One or more return seats are no longer available');
            }

            const { finalPrice: returnPrice } = await calculateTripPrice(returnTripId, new Date());

            await Seat.updateMany(
                { _id: { $in: returnSeats.map(seat => seat._id) } },
                { $set: { isAvailable: false, bookedBy: userId } },
                { session }
            );

            await Promise.all(returnSeats.map(seat =>
                new Booking({
                    user: userId,
                    trip: returnTripId,
                    seatNumber: seat.seatNumber,
                    price: returnPrice,
                    status: 'Confirmed'
                }).save({ session })
            ));
        }

        await session.commitTransaction();
        session.endSession();

        // Phát sự kiện socket để cập nhật trạng thái chỗ ngồi
        if (req.io && typeof req.io.emit === 'function') {
            req.io.emit('seatsBooked', {
                tripId,
                seatNumbers,
                availableSeats: trip.totalSeats - seatNumbers.length
            });

            if (includeReturnTrip && trip.isRoundTrip && trip.returnTripId) {
                req.io.emit('seatsBooked', {
                    tripId: trip.returnTripId,
                    seatNumbers: returnSeatNumbers || seatNumbers,
                    availableSeats: returnTrip.totalSeats - (returnSeatNumbers || seatNumbers).length
                });
            }
        }

        res.status(201).json({ success: true, data: bookings });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error creating booking:', {
            message: error.message,
            stack: error.stack,
            data: {
                tripId,
                seatNumbers,
                includeReturnTrip,
                returnSeatNumbers,
            },
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

        // Hủy đặt chỗ
        booking.status = 'Cancelled';
        await booking.save({ session });

        // Cập nhật trạng thái chỗ ngồi
        await Seat.updateOne(
            { trip: booking.trip._id, seatNumber: booking.seatNumber },
            { $set: { isAvailable: true, bookedBy: null } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        // Phát sự kiện qua Socket.io
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

