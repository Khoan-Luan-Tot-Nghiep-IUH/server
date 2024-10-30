const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    seatNumbers: [{
        type: Number,
        required: true
    }],
    bookingDate: {
        type: Date,
        default: Date.now
    },
    orderCode: {
        type: String,
        unique: true,
        require:true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Pending'
    },
    totalPrice: {
        type: Number,
        required: true
    },
        paymentMethod: {
        type: String,
        enum: ['OnBoard', 'Online'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Unpaid'],
        default: 'Unpaid'
    },
    isCheckedIn: { type: Boolean, default: false },
});

const Booking = mongoose.model('Booking', BookingSchema);
module.exports = Booking;
