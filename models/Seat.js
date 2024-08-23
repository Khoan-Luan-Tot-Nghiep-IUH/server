const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    seatNumber: {
        type: Number,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    isVIP: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        required: true
    },
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reservedAt: Date
});

SeatSchema.index({ trip: 1, seatNumber: 1 }, { unique: true });

const Seat = mongoose.model('Seat', SeatSchema);
module.exports = Seat;
