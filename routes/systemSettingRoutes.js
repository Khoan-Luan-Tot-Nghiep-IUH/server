const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const systemSettingController = require('../controllers/SystemSettingController');

router.post(
    '/toggle-new-user-voucher',
    authMiddleware.verifyToken,   
    authMiddleware.isSuperAdmin,  
    systemSettingController.toggleNewUserVoucher
);

module.exports = router;
