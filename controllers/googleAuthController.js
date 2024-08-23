const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Cấu hình Passport Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/user/google/callback",
    scope: ['profile', 'email']
},
async (accessToken, refreshToken, profile, done) => {
    const { sub, name, email } = profile._json;
    try {
        let user = await User.findOne({ googleId: sub });

        if (!user) {
            user = await User.create({
                googleId: sub,
                fullName: name,
                email: email
            });
        }

        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));

// Serialize và deserialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, false);
    }
});

// Hàm đăng nhập bằng Google
const googleLogin = (req, res, next) => {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

// Hàm xử lý callback sau khi xác thực Google
const googleCallback = (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/login' }, (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Lỗi xác thực Google', error: err });
        }
        if (!user) {
            return res.status(400).json({ message: 'Xác thực Google thất bại' });
        }
        
        // Tạo JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // Trả về token và thông tin người dùng
        res.json({ token, user });
    })(req, res, next);
};

module.exports = {
    googleLogin,
    googleCallback
};