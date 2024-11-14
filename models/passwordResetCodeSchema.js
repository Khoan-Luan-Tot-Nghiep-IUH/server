const mongoose = require('mongoose');

const passwordResetCodeSchema = new mongoose.Schema({
    identifier: String,
    code: String,
    expiry: Date,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PasswordResetCode', passwordResetCodeSchema);
