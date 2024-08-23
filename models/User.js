const mongoose = require('mongoose');
const moment = require("moment-timezone");

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        trim: true,
        lowercase: true,
        required: function() {
            // Chỉ yêu cầu userName khi không đăng nhập bằng Google
            return !this.googleId && !this.facebookId;
        },
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        // Chỉ yêu cầu phoneNumber khi không đăng nhập bằng Google
        required: function() {
            return !this.googleId && !this.facebookId;
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} không phải là email hợp lệ!`
        }
    },
    password: {
        type: String,
        minlength: 8,
        // Chỉ yêu cầu password khi không đăng nhập bằng Google
        required: function() {
            return !this.googleId && !this.facebookId;
        },
    },
    roleId: {
        type: String,
        enum: ['admin', 'user', 'staff'],
        default: 'user',
        required: true
    },
    address: {
        type: String,
        trim: true
    },
    birthDay: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: () => moment().tz("Asia/Ho_Chi_Minh").toDate()
    },
    facebookId: {
        type: String,
        unique: true,
        sparse: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    resetToken: String,
    resetTokenExpiry: Date,
    loyaltyPoints: {
        type: Number,
        default: 0,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: Date,
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    }]
}, {
    validateBeforeSave: true,
    timestamps: true
});

UserSchema.index({ userName: 1, email: 1 });

UserSchema.methods.getFullName = function() {
    return this.fullName;
};

UserSchema.statics.findByUserName = function(userName) {
    return this.findOne({ userName: userName });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
