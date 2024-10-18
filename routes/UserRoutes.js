const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const { facebookLogin, facebookCallback } = require('../controllers/facebookAuthController');
const passport = require('passport');

// Google Authentication Routes
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id, roleId: req.user.roleId, email:req.user.email , fullName: req.user.fullName }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.redirect(`${process.env.CLIENT_URL}/login?token=${token}`);
  }
);

// Facebook Authentication Routes
router.get('/facebook', facebookLogin);
router.get('/facebook/callback', facebookCallback);

// Public routes
router.post('/register', userController.userRegister);
router.post('/verify', userController.confirmRegistration);

router.post('/login', userController.userLogin);
router.post('/forgot-password', userController.sendResetPasswordEmail);
router.post('/reset-password/:token', userController.resetPassword);

// Protected routes (User must be authenticated)
router.use(authMiddleware.verifyToken);  // All routes below will require token

// User-specific routes (Authenticated users)
router.get('/profile/:userId',authMiddleware.verifyToken, authMiddleware.isUser, userController.getUserDetails);
router.put('/profile/:userId',authMiddleware.verifyToken, authMiddleware.isUser, userController.updateUser);
router.put('/change-password/:userId', authMiddleware.isUser, userController.changePassword);
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

module.exports = router;
