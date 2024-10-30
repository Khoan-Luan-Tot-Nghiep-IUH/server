const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
    licenseNumber: { 
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    companyId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    baseSalary: {
        type: Number,
        default: 5000000,
    },
    salaryRate: { 
        type: Number,
        default: 100000 
    },
    bustypeId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bustype',
    },
    completedTrips: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip'
    }],
    trips: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip'
    }],
    userId: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isActive: { 
        type: Boolean,
        default: true
    }
});

const Driver = mongoose.model('Driver', DriverSchema);

module.exports = Driver;
