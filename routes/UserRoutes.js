const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const { facebookLogin, facebookCallback } = require('../controllers/facebookAuthController');
const passport = require('passport');

router.get('/google', (req, res, next) => {
  console.log("Starting Google OAuth process");
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  (req, res, next) => {
    console.log("Google OAuth callback triggered");
    next();
  },
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    console.log("Google authentication successful");
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`${process.env.CLIENT_URL}/login?token=${token}`);
  }
);

// Facebook Authentication Routes
router.get('/facebook', facebookLogin);
router.get('/facebook/callback', facebookCallback);


// Public routes
router.post('/register', userController.userRegister);
router.post('/login', userController.userLogin);
router.post('/forgot-password', userController.sendResetPasswordEmail);
router.post('/reset-password/:token', userController.resetPassword);

// Protected routes (User must be authenticated)
router.use(authMiddleware.verifyToken);

// User-specific routes
router.get('/profile/:userId', authMiddleware.isActiveUser, userController.getUserDetails);
router.put('/profile/:userId', authMiddleware.isActiveUser, userController.updateUser);
router.put('/change-password/:userId', authMiddleware.isActiveUser, userController.changePassword);

// Các quyền dành cho admin
router.use(authMiddleware.isAdmin);

router.get('/all', userController.getAllUsers);
router.get('/role/:roleId', userController.getUsersByRole);
router.put('/status/:userId', userController.updateUserStatus);
router.put('/loyalty/:userId', userController.addLoyaltyPoints);
router.get('/search', userController.searchUsers);

module.exports = router;
