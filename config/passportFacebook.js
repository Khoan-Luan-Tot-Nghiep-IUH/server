const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

// Cấu hình Passport với Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:5000/api/user/facebook/callback",
    profileFields: ['id', 'displayName', 'emails', 'name']
},
async (accessToken, refreshToken, profile, done) => {
    try {
        // Lấy email từ profile.emails nếu tồn tại
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        const fullName = `${profile.name.givenName || ''} ${profile.name.familyName || ''}`.trim();
        
        // Tìm user dựa trên facebookId
        let user = await User.findOne({ facebookId: profile.id });

        // Nếu user chưa tồn tại, tạo user mới
        if (!user) {
            if (!email) {
                // Nếu không có email, trả lỗi để xử lý sau
                return done(null, false, { message: 'Không tìm thấy email trong tài khoản Facebook' });
            }
            
            user = await User.create({
                facebookId: profile.id,
                fullName: fullName,
                email: email
            });
        }

        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));

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

module.exports = passport;
