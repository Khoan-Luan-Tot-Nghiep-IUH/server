const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/FeedbackController');
const authMiddleware = require('../middleware/authMiddleware');

// Tạo phản hồi cho chuyến đi (Yêu cầu xác thực và là người dùng hợp lệ)
router.post('/feedbacks', authMiddleware.verifyToken, authMiddleware.isActiveUser, feedbackController.createFeedback);

// Lấy danh sách phản hồi theo chuyến đi (public)
router.get('/feedbacks/trip/:tripId', feedbackController.getFeedbacksByTrip);

// Xóa phản hồi (Yêu cầu quyền Super Admin hoặc Company Admin)
router.delete('/feedbacks/:id', authMiddleware.verifyToken, authMiddleware.isSuperAdmin, feedbackController.deleteFeedback);

module.exports = router;
