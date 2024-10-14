const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true }, 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  
    discount: { type: Number, required: true }, 
    expiryDate: { type: Date },  
    isUsed: { type: Boolean, default: false }, 
});

const Voucher = mongoose.model('Voucher', voucherSchema);
