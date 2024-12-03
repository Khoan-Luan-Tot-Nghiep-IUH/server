const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/FeedbackController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
router.post('/feedbacks', authMiddleware.verifyToken,upload.array('images', 5), feedbackController.createCompanyFeedback);

router.get('/companies/feedbacks', 
    authMiddleware.verifyToken, 
    authMiddleware.isCompanyAdmin,
    authMiddleware.checkCompanyAccess,
    feedbackController.getCompanyFeedbacks
  );

// chưa dùng hàm này
// router.delete('/feedbacks/:id', authMiddleware.verifyToken, authMiddleware.isSuperAdmin, feedbackController.deleteFeedback);

module.exports = router;
