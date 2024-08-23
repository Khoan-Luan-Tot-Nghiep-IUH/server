const express = require('express');
const router = express.Router();
const locationController = require('../controllers/LocationController');
const authMiddleware = require('../middleware/authMiddleware');

// Tạo địa điểm mới (Yêu cầu quyền admin)
router.post('/locations', authMiddleware.verifyToken, authMiddleware.isAdmin, locationController.createLocation);

//public
router.get('/locations', locationController.getLocations);
router.get('/locations/:id', locationController.getLocationById);

// Cập nhật thông tin địa điểm (Yêu cầu quyền admin)
router.put('/locations/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, locationController.updateLocation);

// Xóa địa điểm (Yêu cầu quyền admin)
router.delete('/locations/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, locationController.deleteLocation);

module.exports = router;
