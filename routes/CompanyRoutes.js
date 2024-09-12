const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const companyController = require('../controllers/CompanyController');

// Tạo công ty - chỉ superadmin
router.post('/create', authMiddleware.isSuperAdmin, companyController.createCompany);

// Lấy tất cả công ty - chỉ superadmin
router.get('/', authMiddleware.isSuperAdmin, companyController.getAllCompanies);

// Xem chi tiết một công ty - cho superadmin, companyadmin hoặc staff của công ty đó
router.get('/:companyId', authMiddleware.isSuperAdminOrStaffOrAdmin, companyController.getCompanyById);

// Cập nhật thông tin công ty - chỉ companyadmin hoặc staff
router.put('/:companyId', authMiddleware.isStaffOrAdmin, companyController.updateCompany);

// Kích hoạt/vô hiệu hóa công ty - chỉ superadmin
router.patch('/:companyId/toggle-status', authMiddleware.isSuperAdmin, companyController.toggleCompanyStatus);

module.exports = router;
