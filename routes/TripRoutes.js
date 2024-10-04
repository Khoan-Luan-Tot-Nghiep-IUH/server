const express = require('express');
const router = express.Router();
const tripController = require('../controllers/TripController');
const pricingController = require('../controllers/PricingController');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/trips/:tripId/seats', tripController.getSeatsByTripId);

router.post('/trips', authMiddleware.verifyToken,authMiddleware.checkCompanyAccess,authMiddleware.isSuperAdminOrStaffOrAdmin, tripController.createTrip);
router.get('/trips/:companyId', authMiddleware.verifyToken, authMiddleware.checkCompanyAccess, tripController.getTripsByCompany);



router.get('/trips', tripController.getTrips);

// Tìm kiếm chuyến đi (Public Access)
router.get('/trips/search', tripController.searchTrips);

// Lấy thông tin chi tiết một chuyến đi (Public Access)
router.get('/trips/:id', tripController.getTripById);

// Cập nhật thông tin chuyến đi (Yêu cầu quyền Company Admin hoặc Super Admin)
router.put('/trips/:id', authMiddleware.verifyToken, authMiddleware.isCompanyAdmin, tripController.updateTrip);

// Xóa chuyến đi (Yêu cầu quyền Company Admin hoặc Super Admin)
router.delete('/trips/:id', authMiddleware.verifyToken, authMiddleware.isCompanyAdmin, tripController.deleteTrip);

// Tạo giá cho chuyến đi (Yêu cầu quyền Company Admin hoặc Super Admin)
router.post('/pricing', authMiddleware.verifyToken, authMiddleware.isCompanyAdmin, pricingController.createPricing);

module.exports = router;
