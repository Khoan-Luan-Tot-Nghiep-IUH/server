const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const passport = require('passport');
const User = require('../models/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userV2Controller= require('../controllers/userV2Controller');
const FacebookStrategy = require('passport-facebook').Strategy;

const generateUserName = (email) => {
  return email.split('@')[0] + Math.floor(Math.random() * 10000);
};

const googleStrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV === 'production'
    ? 'https://server-zeym.onrender.com/api/user/google/callback'
    : 'http://localhost:5000/api/user/google/callback'
};

passport.use(new GoogleStrategy(googleStrategyOptions, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google Profile:', profile);

    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      if (!profile.emails || profile.emails.length === 0) {
        return done(new Error('Email not found in Google profile'), null);
      }

      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        fullName: profile.displayName,
        userName: generateUserName(profile.emails[0].value),
      });
    }

    return done(null, user);
  } catch (error) {
    console.error('Error in Google Strategy:', error);
    return done(error, null);
  }
}));
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  async (req, res) => {
    try {
      if (!req.user || !req.user.email) {
        throw new Error('User or email not found in request');
      }

      let userName = req.user.userName || generateUserName(req.user.email);

    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, fullName: req.user.fullName, userName },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    await User.findByIdAndUpdate(req.user._id, { currentToken: token });

    res.redirect(`${process.env.CLIENT_URL}/login?token=${token}`);
  } catch (error) {
    console.error('Error in Google callback:', error);
    res.status(500).json({ message: 'Google login failed', error: error.message });
  }
});

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.NODE_ENV === 'production'
    ? 'https://server-zeym.onrender.com/api/user/facebook/callback'
    : 'http://localhost:5000/api/user/facebook/callback',
  profileFields: ['id', 'emails', 'name'] 
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Facebook Profile:', profile);

    let user = await User.findOne({ facebookId: profile.id });
    if (!user) {
      const email = profile.emails && profile.emails[0]?.value 
      ? profile.emails[0].value 
      : `${profile.id}@facebook.com`;

      user = await User.create({
        facebookId: profile.id,
        email: email,
        fullName: `${profile.name.givenName} ${profile.name.familyName}`,
        userName: `facebook_${profile.id}`
      });
    }

    return done(null, user);
  } catch (error) {
    console.error('Error in Facebook Strategy:', error);
    return done(error, null);
  }
}));
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
  async (req, res) => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      // Nếu user không có email
      if (!req.user.email) {
        return res.status(400).json({
          message: 'Không tìm thấy email trong tài khoản Facebook. Vui lòng nhập email để hoàn tất đăng ký.'
        });
      }

      // Tạo JWT Token
      const token = jwt.sign(
        { id: req.user._id, email: req.user.email, fullName: req.user.fullName },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      await User.findByIdAndUpdate(req.user._id, { currentToken: token });
      res.redirect(`${process.env.CLIENT_URL}/login?token=${token}`);
    } catch (error) {
      res.redirect('/login');
      console.error('Error in Facebook callback:', error);
      res.status(500).json({ message: 'Facebook login failed', error: error.message });
    }
  }
);

// Public routes
router.post('/register', userController.userRegister);
router.post('/verify', userController.confirmRegistration);
router.post('/login', userController.userLogin);

router.get('/companies/names', userV2Controller.getCompanyNames);
router.get('/bustypes/:companyId',userV2Controller.getBusTypesByCompany);
router.get('/companies/:companyId/details',userV2Controller.getCompanyDetails);

// yêu cầu của người dùng đến superadmin để mở & lấy & xóa
router.post('/companies/request',authMiddleware.verifyToken,userV2Controller.createCompanyRequest);
router.get('/companies/request',authMiddleware.verifyToken,userV2Controller.getUserRequests);
router.delete('/companies/cancel',authMiddleware.verifyToken,userV2Controller.cancelUserRequest);



//gửi mã trước 
router.post('/forgot-password', userController.sendResetCode);
//xác nhận mã và nhập passmoi
router.post('/verify-reset-code', userController.verifyResetCode);


router.use(authMiddleware.verifyToken);

router.get('/profile/:userId',authMiddleware.verifyToken, authMiddleware.isUser, userController.getUserDetails);
router.put('/profile/:userId',authMiddleware.verifyToken, userController.updateUser);
router.put('/change-password', authMiddleware.isUser, userController.changePassword);
router.post('/redeem-points', authMiddleware.verifyToken,authMiddleware.isUser,userController.redeemPointsForVoucher);

router.use(authMiddleware.isCompanyAdmin);

router.get('/all', userController.getAllUsers);
router.get('/role/:roleId', userController.getUsersByRole);
router.put('/status/:userId', userController.updateUserStatus);
router.put('/loyalty/:userId', userController.addLoyaltyPoints);
router.get('/search', userController.searchUsers);


router.use(authMiddleware.isSuperAdmin);

router.get('/superadmin', (req, res) => {
  res.status(200).json({ message: 'Access granted to superadmin route' });
});
router.get('/getLastLoginUser',authMiddleware.verifyToken,authMiddleware.isSuperAdmin,userController.getAllUsersByLastLogin);
router.get('/requests', authMiddleware.verifyToken,authMiddleware.isSuperAdmin, userV2Controller.getCompanyRequests);
router.patch('/requests/update', authMiddleware.verifyToken,authMiddleware.isSuperAdmin, userV2Controller.updateCompanyRequest);
module.exports = router;
