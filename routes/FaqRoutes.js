const express = require('express');
const router = express.Router();
const faqController = require('../controllers/FaqController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/root', authMiddleware.verifyToken, faqController.getRootQuestions);
router.get('/:id', authMiddleware.verifyToken, faqController.getQuestionById);
router.post('/', authMiddleware.verifyToken, authMiddleware.isSuperAdmin, faqController.createQuestion);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isSuperAdmin, faqController.updateQuestion);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isSuperAdmin, faqController.deleteQuestion);

module.exports = router;
