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
router.get('/profile/:userId', authMiddleware.isActiveUser, authMiddleware.isUser, userController.getUserDetails);
router.put('/profile/:userId', authMiddleware.isActiveUser, authMiddleware.isUser, userController.updateUser);
router.put('/change-password/:userId', authMiddleware.isActiveUser, authMiddleware.isUser, userController.changePassword);

// Company Admin and Super Admin routes (Admin must be a company admin or superadmin)
router.use(authMiddleware.isCompanyAdmin);

// Routes accessible by company admin or superadmin
router.get('/all', userController.getAllUsers); // Company admin can manage users within their company
router.get('/role/:roleId', userController.getUsersByRole); // Company admin can filter users by role
router.put('/status/:userId', userController.updateUserStatus); // Company admin can update user status
router.put('/loyalty/:userId', userController.addLoyaltyPoints); // Company admin can manage loyalty points
router.get('/search', userController.searchUsers); // Company admin can search users


router.use(authMiddleware.isSuperAdmin);

router.get('/superadmin', (req, res) => {
  res.status(200).json({ message: 'Access granted to superadmin route' });
});

module.exports = router;
