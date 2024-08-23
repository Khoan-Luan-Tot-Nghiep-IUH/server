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
    const { id, name, email } = profile._json;
    try {
        let user = await User.findOne({ facebookId: id });

        if (!user) {
            user = await User.create({
                facebookId: id,
                fullName: name,
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