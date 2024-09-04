const express = require('express');
const router = express.Router();
const busTypeController = require('../controllers/BusTypeController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/bus-types', authMiddleware.verifyToken, authMiddleware.isAdmin, busTypeController.createBusType);

// Lấy danh sách tất cả các loại xe buýt (public)
router.get('/bus-types', busTypeController.getBusTypes);

// Lấy chi tiết một loại xe buýt cụ thể (public)
router.get('/bus-types/:id', busTypeController.getBusTypeById);

// Cập nhật thông tin loại xe buýt (Yêu cầu quyền admin)
router.put('/bus-types/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, busTypeController.updateBusType);

// Xóa loại xe buýt (Yêu cầu quyền admin)
router.delete('/bus-types/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, busTypeController.deleteBusType);

// Lấy danh sách tên các loại xe buýt (public)
router.get('/bus-types/names', busTypeController.getBusTypeNames);

module.exports = router;
