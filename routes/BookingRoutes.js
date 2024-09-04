const express = require('express');
const bookingController = require('../controllers/BookingController');
const authMiddleware = require('../middleware/authMiddleware');

module.exports = (io) => {
    const router = express.Router();
    const socketIoMiddleware = require('../middleware/socketIoMiddleware')(io);
    router.use(socketIoMiddleware);

    router.post('/bookings', authMiddleware.verifyToken, bookingController.createBooking);
    router.get('/bookings', authMiddleware.verifyToken, bookingController.getUserBookings);
    router.get('/bookings/:id', authMiddleware.verifyToken, bookingController.getBookingById);
    router.delete('/bookings/:id', authMiddleware.verifyToken, bookingController.cancelBooking);
    return router;
};