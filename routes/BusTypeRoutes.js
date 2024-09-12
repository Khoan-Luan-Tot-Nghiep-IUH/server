const express = require('express');
const router = express.Router();
const busTypeController = require('../controllers/BusTypeController');
const authMiddleware = require('../middleware/authMiddleware');

// Tạo loại xe buýt mới (Yêu cầu quyền Super Admin hoặc Company Admin)
router.post('/bus-types', authMiddleware.verifyToken, authMiddleware.isSuperAdmin, busTypeController.createBusType);

// Lấy danh sách tất cả các loại xe buýt (public)
router.get('/bus-types', busTypeController.getBusTypes);

// Lấy chi tiết một loại xe buýt cụ thể (public)
router.get('/bus-types/:id', busTypeController.getBusTypeById);

// Cập nhật thông tin loại xe buýt (Yêu cầu quyền Super Admin hoặc Company Admin)
router.put('/bus-types/:id', authMiddleware.verifyToken, authMiddleware.isSuperAdmin, busTypeController.updateBusType);

// Xóa loại xe buýt (Yêu cầu quyền Super Admin hoặc Company Admin)
router.delete('/bus-types/:id', authMiddleware.verifyToken, authMiddleware.isSuperAdmin, busTypeController.deleteBusType);

// Lấy danh sách tên các loại xe buýt (public)
router.get('/bus-types/names', busTypeController.getBusTypeNames);

module.exports = router;
