const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const { facebookLogin, facebookCallback } = require('../controllers/facebookAuthController');
const passport = require('passport');
const User = require('../models/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


const googleStrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV === 'production'
    ? 'https://server-zeym.onrender.com/api/user/google/callback'
    : 'http://localhost:5000/api/user/google/callback'
};


passport.use(new GoogleStrategy(googleStrategyOptions, async (accessToken, refreshToken, profile, done) => {
}));


router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

const generateUserName = (email) => {
  // Tạo userName từ phần trước "@" của email và một số ngẫu nhiên
  return email.split('@')[0] + Math.floor(Math.random() * 10000);
};

router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  async (req, res) => {
    try {
      let userName = req.user.userName;
      if (!userName) {
        userName = generateUserName(req.user.email);
      }

      // Tạo JWT token
      const token = jwt.sign(
        { id: req.user._id, email: req.user.email, fullName: req.user.fullName, userName },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Lưu token vào `currentToken`
      await User.findByIdAndUpdate(req.user._id, { currentToken: token });

      // Chuyển hướng về phía client với token
      res.redirect(`${process.env.CLIENT_URL}/login?token=${token}`);
    } catch (error) {
      console.error('Error in Google callback:', error); // Log lỗi chi tiết
      res.status(500).json({ message: 'Google login failed', error: error.message });
    }
  }
);


router.get('/facebook', facebookLogin);
router.get('/facebook/callback', facebookCallback);

// Public routes
router.post('/register', userController.userRegister);
router.post('/verify', userController.confirmRegistration);
router.post('/login', userController.userLogin);

//gửi mã trước 
router.post('/forgot-password', userController.sendResetCode);
//xác nhận mã và nhập passmoi
router.post('/verify-reset-code', userController.verifyResetCode);


// Protected routes (User must be authenticated)
router.use(authMiddleware.verifyToken);

// User-specific routes (Authenticated users)
router.get('/profile/:userId',authMiddleware.verifyToken, authMiddleware.isUser, userController.getUserDetails);
router.put('/profile/:userId',authMiddleware.verifyToken, userController.updateUser);
router.put('/change-password', authMiddleware.isUser, userController.changePassword);
router.post('/redeem-points', authMiddleware.verifyToken,authMiddleware.isUser,userController.redeemPointsForVoucher);

// Routes accessible by company admin or superadmin
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

module.exports = router;
