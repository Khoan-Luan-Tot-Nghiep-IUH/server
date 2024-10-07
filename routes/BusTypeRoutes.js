const express = require('express');
const router = express.Router();
const busTypeController = require('../controllers/BusTypeController');
const authMiddleware = require('../middleware/authMiddleware');

// Đảm bảo người dùng đã được xác thực và có quyền truy cập vào dữ liệu công ty
const checkCompanyAdmin = [authMiddleware.verifyToken, authMiddleware.isCompanyAdmin, authMiddleware.checkCompanyAccess];
const checkSuperAdminOrCompanyAdmin = [authMiddleware.verifyToken, authMiddleware.isSuperAdminOrStaffOrAdmin, authMiddleware.checkCompanyAccess];

// Tạo loại xe buýt mới (Yêu cầu quyền Super Admin hoặc Company Admin)
router.post('/bus-types', checkCompanyAdmin, busTypeController.createBusType);

// Lấy danh sách tất cả các loại xe buýt thuộc công ty của người dùng hiện tại (Yêu cầu xác thực)
router.get('/bus-types', authMiddleware.verifyToken, authMiddleware.checkCompanyAccess, busTypeController.getBusTypes);

// Lấy chi tiết một loại xe buýt cụ thể (Yêu cầu xác thực và thuộc công ty hiện tại)
router.get('/bus-types/:id', authMiddleware.verifyToken, authMiddleware.checkCompanyAccess, busTypeController.getBusTypeById);

// Cập nhật thông tin loại xe buýt (Yêu cầu quyền Super Admin hoặc Company Admin)
router.put('/bus-types/:id', checkSuperAdminOrCompanyAdmin, busTypeController.updateBusType);

// Xóa loại xe buýt (Yêu cầu quyền Super Admin hoặc Company Admin)
router.delete('/bus-types/:id', checkSuperAdminOrCompanyAdmin, busTypeController.deleteBusType);

// Lấy danh sách tên các loại xe buýt của công ty hiện tại (Yêu cầu xác thực)
router.get('/bus-types/names', authMiddleware.verifyToken, authMiddleware.checkCompanyAccess, busTypeController.getBusTypeNames);

module.exports = router;
