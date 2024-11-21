const mongoose = require('mongoose');
const moment = require('moment-timezone');

const ExpenseSchema = new mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    },
    busType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusType',
        required: false
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0 
    },
    expenseType: {
        type: String,
        enum: ['Fuel', 'Repair', 'Maintenance', 'Other'],
        required: true
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
}, {
    timestamps: true
});

ExpenseSchema.index({ driverId: 1, createdAt: -1 });

const Expense = mongoose.model('Expense', ExpenseSchema);

module.exports = Expense;
