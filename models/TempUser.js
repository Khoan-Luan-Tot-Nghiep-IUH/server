const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TempUserSchema = new Schema({
    userName: { type: String, required: true },
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    roleId: { type: String, default: 'user' },
    address: { type: String },
    birthDay: { type: Date },
    createdAt: { type: Date, default: Date.now, expires: '5m' }
});

const TempUser = mongoose.model('TempUser', TempUserSchema);

module.exports = TempUser;
