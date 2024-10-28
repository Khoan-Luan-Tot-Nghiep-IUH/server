const passport = require('passport');
const jwt = require('jsonwebtoken');

const facebookLogin = (req, res, next) => {
    passport.authenticate('facebook', { scope: ['email'] })(req, res, next);
};

const facebookCallback = (req, res, next) => {
    passport.authenticate('facebook', { failureRedirect: '/login' }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Lỗi xác thực Facebook', error: err });
        }
        if (!user) {
            const errorMessage = info && info.message ? info.message : 'Xác thực Facebook thất bại';
            return res.status(400).json({ message: errorMessage });
        }

        // Kiểm tra nếu không có email
        if (!user.email) {
            return res.status(400).json({ 
                message: 'Không tìm thấy email trong tài khoản Facebook. Vui lòng nhập email để hoàn tất đăng ký.' 
            });
        }

        // Tạo JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Trả về token và thông tin người dùng cho phía client
        res.json({ token, user });
    })(req, res, next);
};



module.exports = {
    facebookLogin,
    facebookCallback
};
