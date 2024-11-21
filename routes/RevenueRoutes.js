const express = require('express');
const { getRevenueStatistics , calculateRevenueByCompany } = require('../controllers/BookingController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/statistics/revenue', authMiddleware.verifyToken,authMiddleware.isSuperAdmin,getRevenueStatistics);
router.get('/statistics/revenue-by-company', authMiddleware.verifyToken,authMiddleware.isSuperAdmin,calculateRevenueByCompany);
module.exports = router;
