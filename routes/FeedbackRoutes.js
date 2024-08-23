const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/FeedbackController');
const authMiddleware = require('../middleware/authMiddleware');

// Tạo phản hồi cho chuyến đi (Yêu cầu xác thực)
router.post('/feedbacks', authMiddleware.verifyToken, authMiddleware.isActiveUser, feedbackController.createFeedback);

// Lấy danh sách phản hồi theo chuyến đi (public)
router.get('/feedbacks/trip/:tripId', feedbackController.getFeedbacksByTrip);

// Xóa phản hồi (Yêu cầu quyền admin)
router.delete('/feedbacks/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, feedbackController.deleteFeedback);

module.exports = router;
