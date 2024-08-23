const express = require('express');
const router = express.Router();
const seatController = require('../controllers/SeatController');
const authMiddleware = require('../middleware/authMiddleware');

// Lấy thông tin tất cả chỗ ngồi của một chuyến đi
router.get('/seats/:tripId', authMiddleware.verifyToken, seatController.getSeatsByTrip);

// Cập nhật trạng thái chỗ ngồi (Yêu cầu quyền staff hoặc admin)
router.put('/seats/:seatId', authMiddleware.verifyToken, authMiddleware.isStaffOrAdmin, seatController.updateSeatStatus);

// Kiểm tra tình trạng chỗ ngồi (public)
router.get('/seats/:tripId/:seatNumber', seatController.checkSeatAvailability);

module.exports = router;
