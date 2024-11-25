const GlobalNotification = require('../models/GlobalNotificationSchema');
const { uploadImage } = require('../config/cloudinaryConfig');
const fs = require('fs');


exports.createGlobalNotification = async (req, res) => {
    try {
      const { title, description, link } = req.body;
      const imageFiles = req.files || [];

      const imageUrls = [];
      for (const file of imageFiles) {
        const result = await uploadImage(file.path, 'global_notifications');
        imageUrls.push(result.url);
        fs.unlinkSync(file.path);
      }

      const newNotification = new GlobalNotification({
        title,
        description,
        link,
        images: imageUrls,
      });
  
      await newNotification.save();
      res.status(201).json({ message: 'Thông báo đã được tạo thành công!', notification: newNotification });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
  

exports.getGlobalNotifications = async (req, res) => {
    try {
      const notifications = await GlobalNotification.find({ isActive: true }).sort({ createdAt: -1 });
  
      if (notifications.length === 0) {
        return res.status(200).json({ message: 'Không có thông báo nào đang hoạt động.' });
      }
  
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
exports.markAsChecked = async (req, res) => {
    try {
      const { id } = req.params;
      
      const notification = await GlobalNotification.findByIdAndUpdate(
        id,
        { isChecked: true },
        { new: true }
      );
  
      if (!notification) {
        return res.status(404).json({ message: 'Thông báo không tồn tại.' });
      }
  
      res.status(200).json({ message: 'Thông báo đã được đánh dấu là đã xử lý.', notification });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

exports.disableGlobalNotification = async (req, res) => {
    try {
      const { id } = req.params;
  
      const notification = await GlobalNotification.findById(id);
      if (!notification) {
        return res.status(404).json({ message: 'Thông báo không tồn tại.' });
      }
  
      notification.isActive = false;
      await notification.save();
  
      res.status(200).json({ message: 'Thông báo đã bị vô hiệu hóa!', notification });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
  