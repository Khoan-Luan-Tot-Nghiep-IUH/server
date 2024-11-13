const express = require('express');
const router = express.Router();
const busTypeController = require('../controllers/BusTypeController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Đảm bảo người dùng đã được xác thực và có quyền truy cập vào dữ liệu công ty
const checkCompanyAdmin = [authMiddleware.verifyToken, authMiddleware.isCompanyAdmin, authMiddleware.checkCompanyAccess];
const checkSuperAdminOrCompanyAdmin = [authMiddleware.verifyToken, authMiddleware.isSuperAdminOrStaffOrAdmin, authMiddleware.checkCompanyAccess];

router.get('/bus-types/get-all', busTypeController.getAllBusType);


router.post('/bus-types', checkCompanyAdmin, upload.array('images', 5), busTypeController.createBusType);


// Lấy danh sách tất cả các loại xe buýt thuộc công ty của người dùng hiện tại (Yêu cầu xác thực)
router.get('/bus-types', authMiddleware.verifyToken, authMiddleware.checkCompanyAccess, busTypeController.getBusTypes);


// Lấy chi tiết một loại xe buýt cụ thể (Yêu cầu xác thực và thuộc công ty hiện tại)
router.get('/bus-types/:id', authMiddleware.verifyToken, authMiddleware.checkCompanyAccess, busTypeController.getBusTypeById);

// Cập nhật thông tin loại xe buýt (Yêu cầu quyền Super Admin hoặc Company Admin)
router.put('/bus-types/:id', checkSuperAdminOrCompanyAdmin,upload.array('images', 5), busTypeController.updateBusType);

router.delete('/bus-types/:id', checkSuperAdminOrCompanyAdmin, busTypeController.deleteBusType);
router.get('/bus-types/names', authMiddleware.verifyToken, authMiddleware.checkCompanyAccess, busTypeController.getBusTypeNames);


module.exports = router;
