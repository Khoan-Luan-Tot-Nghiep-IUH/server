const mongoose = require('mongoose');
const moment = require("moment-timezone");

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        trim: true,
        lowercase: true,
        required: function() {
            return !this.googleId && !this.facebookId;
        },
        unique: true,
    },
    fullName: {
        type: String,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: function() {
            return !this.googleId && !this.facebookId;
        },
    },
  email: {
    type: String,
    required: function() {
        return !this.googleId && !this.facebookId;
    },
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
    validate: {
        validator: function(v) {
            return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: props => `${props.value} không phải là email hợp lệ!`
    }
},
    password: {
        type: String,
        minlength: 8,
        required: function() {
            return !this.googleId && !this.facebookId;
        },
    },
    roleId: {
        type: String,
        enum: ['superadmin', 'companyadmin', 'staff', 'user','driver'],
        default: 'user',
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: function() {
            return this.roleId !== 'superadmin' && this.roleId !== 'user';
        }
    },
    driverId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: false,
        
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
    vouchers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Voucher' }],
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: Date,
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    }],
    currentToken: { type: String, default: null },
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

UserSchema.pre('save', async function (next) {
    if (!this.userName && (this.googleId || this.facebookId)) {
      this.userName = this.email ? this.email.split('@')[0] + Math.floor(Math.random() * 10000) : `user_${Math.floor(Math.random() * 10000)}`;
    }
  
    next();
  });

const User = mongoose.model('User', UserSchema);

module.exports = User;
