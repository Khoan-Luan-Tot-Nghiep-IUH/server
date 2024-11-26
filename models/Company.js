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
        phoneNumber: {
            type: String,
            trim: true,
            validate: {
                validator: function(v) {
                    return /\d{10,15}/.test(v);
                },
                message: props => `${props.value} không phải là số điện thoại hợp lệ!`
            }
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            validate: {
                validator: function(v) {
                    return /^\S+@\S+\.\S+$/.test(v);
                },
                message: props => `${props.value} không phải là địa chỉ email hợp lệ!`
            }
        },
        website: {
            type: String,
            trim: true,
        },
        averageRating: { type: Number, default: 0 },
        totalReviews: { type: Number, default: 0 }, 
        createdAt: {
            type: Date,
            default: () => moment().tz("Asia/Ho_Chi_Minh").toDate()
        },
        feedbacks: [
            {
              userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
              fullName: { type: String },
              rating: { type: Number },
              comment: { type: String },
              createdAt: { type: Date, default: Date.now },
            },
          ],
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
                enum: ['companyadmin', 'staff', 'driver'],
                required: true
            }
        }]
    }, 
    {
        timestamps: true
    });

    CompanySchema.index({ name: 1 });
    const Company = mongoose.model('Company', CompanySchema);

    module.exports = Company;
