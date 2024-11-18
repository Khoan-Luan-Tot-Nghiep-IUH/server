const mongoose = require('mongoose');
const moment = require('moment-timezone');

const CompanyRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
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
    phoneNumber: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                return /^[\d\+\-\(\)\s]{7,15}$/.test(v);
            },
            message: props => `${props.value} không phải là số điện thoại hợp lệ!`
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^\S+@\S+\.\S+$/.test(v);
            },
            message: props => `${props.value} không phải là email hợp lệ!`
        }
    },
    website: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                return !v || /^(http|https):\/\/[^ "]+$/.test(v);
            },
            message: props => `${props.value} không phải là website hợp lệ!`
        }
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: () => moment().tz("Asia/Ho_Chi_Minh").toDate()
    },
    updatedAt: {
        type: Date,
        default: () => moment().tz("Asia/Ho_Chi_Minh").toDate()
    }
});

const CompanyRequest = mongoose.model('CompanyRequest', CompanyRequestSchema);

module.exports = CompanyRequest;
