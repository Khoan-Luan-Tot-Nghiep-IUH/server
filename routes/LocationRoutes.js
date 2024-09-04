const express = require('express');
const router = express.Router();
const locationController = require('../controllers/LocationController');
const authMiddleware = require('../middleware/authMiddleware');

// Tạo địa điểm mới (Yêu cầu quyền Company Admin hoặc Super Admin)
router.post('/locations', authMiddleware.verifyToken, authMiddleware.isSuperAdmin, locationController.createLocation);

// Public routes
router.get('/locations', locationController.getLocations);
router.get('/locations/:id', locationController.getLocationById);

// Cập nhật thông tin địa điểm (Yêu cầu quyền Company Admin hoặc Super Admin)
router.put('/locations/:id', authMiddleware.verifyToken, authMiddleware.isSuperAdmin, locationController.updateLocation);

// Xóa địa điểm (Yêu cầu quyền Company Admin hoặc Super Admin)
router.delete('/locations/:id', authMiddleware.verifyToken, authMiddleware.isSuperAdmin, locationController.deleteLocation);

module.exports = router;
