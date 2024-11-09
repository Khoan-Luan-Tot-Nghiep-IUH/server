const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/VoucherController');
const authMiddleware = require ('../middleware/authMiddleware')

router.post('/create', authMiddleware.verifyToken,authMiddleware.isSuperAdmin,voucherController.createVoucher);
router.post('/redeem', authMiddleware.verifyToken,voucherController.redeemPointsForVoucher);
router.post('/apply', authMiddleware.verifyToken,voucherController.applyVoucher);
router.get('/user-vouchers',authMiddleware.verifyToken,voucherController.getAllVouchers);
router.get('/:id', voucherController.getVoucherById);
router.delete('/:id', voucherController.deleteVoucher);

module.exports = router;
