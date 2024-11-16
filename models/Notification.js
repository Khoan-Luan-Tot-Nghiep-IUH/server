const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    updatedBy: { type: String, required: true },
    status: { type: String, required: true }, 
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);
