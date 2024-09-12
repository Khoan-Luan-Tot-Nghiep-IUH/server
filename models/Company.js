const mongoose = require('mongoose');
const moment = require('moment-timezone');

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    contactInfo: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: () => moment().tz("Asia/Ho_Chi_Minh").toDate()
    },
    isActive: {
        type: Boolean,
        default: true
    },
    employees: [{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    roleId: {
        type: String,
        enum: ['companyadmin', 'staff'],
        required: true
    }
}]
}, {
    timestamps: true
});

CompanySchema.index({ name: 1 });
const Company = mongoose.model('Company', CompanySchema);

module.exports = Company;
