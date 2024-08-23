const passport = require('passport');
const jwt = require('jsonwebtoken');

const facebookLogin = (req, res, next) => {
    passport.authenticate('facebook', { scope: ['email'] })(req, res, next);
};

const facebookCallback = (req, res, next) => {
    passport.authenticate('facebook', { failureRedirect: '/login' }, (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Lỗi xác thực Facebook', error: err });
        }
        if (!user) {
            return res.status(400).json({ message: 'Xác thực Facebook thất bại' });
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
