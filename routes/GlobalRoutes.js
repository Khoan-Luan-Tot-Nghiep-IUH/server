const express = require('express');
const router = express.Router();
const { createGlobalNotification, getGlobalNotifications, disableGlobalNotification ,markAsChecked} = require('../controllers/GlobalNotificationController');
const { verifyToken, isSuperAdmin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinaryConfig');
// Route lấy danh sách thông báo cho user
router.get('/global-notifications', verifyToken,getGlobalNotifications);

router.patch('/global-notifications/:id/checked', verifyToken, markAsChecked);


// tạo thông báo và disable cho admin
router.post(
  '/global-notifications',
  verifyToken,
  isSuperAdmin,
  upload.array('images', 5),
  createGlobalNotification
);
router.patch('/global-notifications/:id', verifyToken, isSuperAdmin, disableGlobalNotification);

module.exports = router;
