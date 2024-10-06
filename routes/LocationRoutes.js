const express = require('express');
const router = express.Router();
const locationController = require('../controllers/LocationController');
const authMiddleware = require('../middleware/authMiddleware');

router
  .route('/locations')
  .get(locationController.getLocations) 
  .post(authMiddleware.verifyToken, authMiddleware.isSuperAdmin, locationController.createLocation); // Tạo mới địa điểm (Super Admin)

router
  .route('/locations/:id')
  .get(locationController.getLocationById)
  .put(authMiddleware.verifyToken, authMiddleware.isSuperAdmin, locationController.updateLocation) // Cập nhật thông tin địa điểm (Super Admin)
  .delete(authMiddleware.verifyToken, authMiddleware.isSuperAdmin, locationController.deleteLocation); // Xóa địa điểm (Super Admin)

module.exports = router;
