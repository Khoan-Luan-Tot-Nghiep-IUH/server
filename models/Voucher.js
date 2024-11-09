const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  discount: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  isUsed: { type: Boolean, default: false },
  type: { type: String, enum: ['system', 'personal'], required: true },
});

module.exports = mongoose.model('Voucher', voucherSchema);
