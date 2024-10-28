const express = require('express');
const { getRevenueStatistics } = require('../controllers/BookingController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/statistics/revenue', authMiddleware.verifyToken,authMiddleware.isSuperAdmin,getRevenueStatistics);

module.exports = router;
