const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const companyController = require('../controllers/CompanyController');


router.post('/companies/create',authMiddleware.verifyToken ,authMiddleware.isSuperAdmin, companyController.createCompany);

router.get('/companies/',authMiddleware.verifyToken, authMiddleware.isSuperAdmin, companyController.getAllCompanies);

router.get('/companies/:companyId', authMiddleware.verifyToken,authMiddleware.isSuperAdminOrStaffOrAdmin, companyController.getCompanyById);

router.put('/companies/:companyId',authMiddleware.verifyToken ,authMiddleware.isSuperAdminOrStaffOrAdmin, companyController.updateCompany);

router.patch('/companies/:companyId/toggle-status',authMiddleware.verifyToken ,authMiddleware.isSuperAdmin, companyController.toggleCompanyStatus);

module.exports = router;
