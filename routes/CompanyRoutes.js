const express = require('express');
const router = express.Router();
const companyController = require('../controllers/CompanyController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware.verifyToken, authMiddleware.isSuperAdmin, companyController.createCompany);
router.post('/add-admin', authMiddleware.verifyToken, authMiddleware.isSuperAdmin, companyController.addCompanyAdmin);
router.put('/:companyId', authMiddleware.verifyToken, authMiddleware.isSuperAdmin, companyController.updateCompany);
router.patch('/:companyId/status', authMiddleware.verifyToken, authMiddleware.isSuperAdmin, companyController.toggleCompanyStatus);
router.delete('/:companyId', authMiddleware.verifyToken, authMiddleware.isSuperAdmin, companyController.deleteCompany); // Thêm route xóa công ty

// Routes dành cho Company Admin
router.post('/add-staff', authMiddleware.verifyToken, authMiddleware.isCompanyAdmin, authMiddleware.checkCompanyAccess, companyController.addStaff);
router.delete('/:companyId/remove-employee/:userId', authMiddleware.verifyToken, authMiddleware.isCompanyAdmin, authMiddleware.checkCompanyAccess, companyController.removeEmployee);

// Public Routes (Lấy danh sách công ty)
router.get('/', authMiddleware.verifyToken, companyController.getAllCompanies);
// Xem thông tin công ty 
router.get('/:companyId', authMiddleware.verifyToken, authMiddleware.checkCompanyAccess, companyController.getCompanyById);
module.exports = router;
