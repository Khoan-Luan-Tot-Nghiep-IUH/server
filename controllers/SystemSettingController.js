const SystemSetting = require('../models/SystemSetting');

exports.toggleNewUserVoucher = async (req, res) => {
    try {
        if (req.user.roleId !== 'superadmin') {
            return res.status(403).json({ success: false,    message: 'Bạn không có quyền thực hiện thao tác này.' });
        }
        const { allowNewUserVoucher } = req.body;

        let setting = await SystemSetting.findOne();
        if (!setting) {
            setting = new SystemSetting();
        }
        setting.allowNewUserVoucher = allowNewUserVoucher;
        await setting.save();

        res.status(200).json({ success: true, message: `Đã ${allowNewUserVoucher ? 'bật' : 'tắt'} chức năng tặng voucher cho tài khoản mới.` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi cập nhật cài đặt hệ thống', error: error.message });
    }
};
