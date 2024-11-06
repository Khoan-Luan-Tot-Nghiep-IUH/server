const mongoose = require('mongoose');

const verificationCodeSchema = new mongoose.Schema({
    email: { type: String, required: true },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '10m' }
});

const VerificationCodeModel = mongoose.model('VerificationCode', verificationCodeSchema);

module.exports = VerificationCodeModel;