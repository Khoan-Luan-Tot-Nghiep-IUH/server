const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const systemSettingController = require('../controllers/SystemSettingController');


router.get('/user-growth',  
    authMiddleware.verifyToken,   
    authMiddleware.isSuperAdmin,  
    systemSettingController.getUserGrowth);


router.get('/statistics/cancellations',
    authMiddleware.verifyToken,   
    authMiddleware.isSuperAdmin,  
    systemSettingController.getCancellationStatistics
  );
router.post(
    '/toggle-new-user-voucher',
    authMiddleware.verifyToken,   
    authMiddleware.isSuperAdmin,  
    systemSettingController.toggleNewUserVoucher
);
router.get(
    '/superadmin/revenue/payment-method',
    authMiddleware.verifyToken,   
    authMiddleware.isSuperAdmin,  
    systemSettingController.getRevenueByCompany
  );
  
module.exports = router;
