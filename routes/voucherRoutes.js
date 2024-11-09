const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/VoucherController');
const authMiddleware = require ('../middleware/authMiddleware')
// tạo voucher cho superadmin ( có thể tạo cho toàn bộ hệ thống hoặc riêng đơn lẻ);
router.post('/create', authMiddleware.verifyToken,authMiddleware.isSuperAdmin,voucherController.createVoucher);
//quyy đổi điểm
router.post('/redeem', authMiddleware.verifyToken,voucherController.redeemPointsForVoucher);

router.get('/user-vouchers',authMiddleware.verifyToken,voucherController.getAllVouchers);
router.get('/:id', voucherController.getVoucherById);
router.delete('/:id', voucherController.deleteVoucher);

module.exports = router;
