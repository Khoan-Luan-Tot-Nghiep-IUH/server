module.exports = (io) => {
    const express = require('express');
    const bookingController = require('../controllers/BookingController');
    const authMiddleware = require('../middleware/authMiddleware');

    const router = express.Router();

    const socketIoMiddleware = require('../middleware/socketIoMiddleware')(io);
    router.post('/bookings', authMiddleware.verifyToken, socketIoMiddleware, bookingController.createBooking);
    router.get('/payment-success', bookingController.paymentSuccess);
    router.get('/payment-cancel', bookingController.paymentSuccess);
    router.get('/booking-history',authMiddleware.verifyToken, bookingController.getBookingHistory);
    router.get('/bookings/:id', authMiddleware.verifyToken, bookingController.getBookingById);

    router.delete('/bookings/:id', authMiddleware.verifyToken, bookingController.cancelBooking);
    router.patch('/bookings/:id/cancelSeat/:seatNumberToCancel', authMiddleware.verifyToken,bookingController.cancelSeatInBooking);
    return router;
};
