const express = require('express');
const router = express.Router();
const tripController = require('../controllers/TripController');
const pricingController = require('../controllers/PricingController');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/trips/:tripId/seats', tripController.getSeatsByTripId);
 
// mỗi công ty tự tháo tác chuyến đi riêng của họ
router.post('/trips', authMiddleware.verifyToken,authMiddleware.checkCompanyAccess,authMiddleware.isSuperAdminOrStaffOrAdmin, tripController.createTrip);
router.get('/trips/company/:companyId', authMiddleware.verifyToken, authMiddleware.checkCompanyAccess, tripController.getTripsByCompany);
router.delete('/trips/expired-trips',authMiddleware.verifyToken,authMiddleware.checkCompanyAccess, tripController.deleteExpiredTripsForCompany);
router.put('/trips/:id', authMiddleware.verifyToken, authMiddleware.checkCompanyAccess, tripController.updateTrip);

router.put('/trips/:tripId/drivers', authMiddleware.verifyToken, authMiddleware.checkCompanyAccess, tripController.updateDriversForTrip);

// Tìm kiếm chuyến đi (Public Access)
router.get('/trips/search', tripController.searchTrips);

router.get('/trips/:id', tripController.getTripById);
router.get('/trips', tripController.getTrips);



router.delete('/trips/:id', authMiddleware.verifyToken, authMiddleware.isCompanyAdmin, tripController.deleteTrip);

// Tạo giá cho chuyến đi (Yêu cầu quyền Company Admin hoặc Super Admin)
router.post('/pricing', authMiddleware.verifyToken, authMiddleware.isCompanyAdmin, pricingController.createPricing);

module.exports = router;
