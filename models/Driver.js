const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /\d{10}/.test(v);
            },
            message: props => `${props.value} không phải là số điện thoại hợp lệ!`
        }
    },
    address: {
        type: String,
        trim: true
    },
    birthDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(v) {
                const currentYear = new Date().getFullYear();
                const birthYear = v.getFullYear();
                return currentYear - birthYear >= 18;
            },
            message: props => `Tài xế phải từ 18 tuổi trở lên!`
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    trips: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip'
    }],
    companyId: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true 
    }
});

const Driver = mongoose.model('Driver', DriverSchema);

module.exports = Driver;
