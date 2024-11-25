const mongoose = require('mongoose');

const GlobalNotificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: false }, 
    images: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isChecked: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GlobalNotification', GlobalNotificationSchema);
