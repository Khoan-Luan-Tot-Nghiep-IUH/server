module.exports = (io) => {
    const express = require('express');
    const bookingController = require('../controllers/BookingController');
    const authMiddleware = require('../middleware/authMiddleware');

    const router = express.Router();

    // Chỉ sử dụng socketIoMiddleware cho route tạo booking
    const socketIoMiddleware = require('../middleware/socketIoMiddleware')(io);

    router.post('/bookings', authMiddleware.verifyToken, socketIoMiddleware, bookingController.createBooking);
    
    router.get('/bookings', authMiddleware.verifyToken, bookingController.getUserBookings);
    router.get('/bookings/:id', authMiddleware.verifyToken, bookingController.getBookingById);
    router.delete('/bookings/:id', authMiddleware.verifyToken, bookingController.cancelBooking);

    return router;
};
