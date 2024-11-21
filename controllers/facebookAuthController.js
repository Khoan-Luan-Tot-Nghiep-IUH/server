const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Hàm bắt đầu đăng nhập với Facebook
const facebookLogin = (req, res, next) => {
    passport.authenticate('facebook', { scope: ['email'] })(req, res, next);
};

// Hàm callback xử lý sau khi Facebook xác thực
const facebookCallback = (req, res, next) => {
    passport.authenticate('facebook', { session: false, failureRedirect: '/login' }, async (err, user, info) => {
        try {
            // Xử lý lỗi xác thực
            if (err) {
                console.error('Facebook Authentication Error:', err);
                return res.status(500).json({ message: 'Lỗi xác thực Facebook', error: err });
            }

            // Trường hợp không có user trả về
            if (!user) {
                const errorMessage = info && info.message ? info.message : 'Xác thực Facebook thất bại';
                console.error('Facebook Authentication Failed:', errorMessage);
                return res.status(400).json({ message: errorMessage });
            }

            // Trường hợp user không có email
            if (!user.email) {
                console.warn('Email not found in Facebook account');
                return res.status(400).json({
                    message: 'Không tìm thấy email trong tài khoản Facebook. Vui lòng nhập email để hoàn tất đăng ký.'
                });
            }

            // Tạo JWT token
            const token = jwt.sign(
                { id: user._id, email: user.email, fullName: user.fullName },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Cập nhật token vào user (nếu cần)
            await User.findByIdAndUpdate(user._id, { currentToken: token });

            // Trả về JSON chứa token và thông tin user
            res.json({ token, user });
        } catch (error) {
            console.error('Error in Facebook callback:', error);
            res.status(500).json({ message: 'Facebook login failed', error: error.message });
        }
    })(req, res, next);
};

module.exports = {
    facebookLogin,
    facebookCallback
};
