const express = require('express');
const router = express.Router();
const tripController = require('../controllers/TripController');
const princingController = require('../controllers/PricingController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/trips/request-trip', authMiddleware.verifyToken, tripController.requestNewTrip);

router.put('/trips/request-trip/:id',authMiddleware.verifyToken,authMiddleware.isAdmin,tripController.handleTripRequest);

// Tạo chuyến đi mới (Yêu cầu quyền admin)
router.post('/trips', authMiddleware.verifyToken, authMiddleware.isAdmin, tripController.createTrip);router.get('/trips', tripController.getTrips);
router.get('/trips/search', tripController.searchTrips);
router.get('/trips/:id', tripController.getTripById);

// Cập nhật thông tin chuyến đi (Yêu cầu quyền admin)
router.put('/trips/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, tripController.updateTrip);

// Xóa chuyến đi (Yêu cầu quyền admin)
router.delete('/trips/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, tripController.deleteTrip);
//tạo giá chuyến đi cho admin~~
router.post('/pricing', authMiddleware.verifyToken, authMiddleware.isAdmin, princingController.createPricing);

module.exports = router;
