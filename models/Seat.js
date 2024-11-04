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
    seatRow: {
        type: String,
        enum: ['Front', 'Middle', 'Back'], // Hàng đầu, giữa, cuối
        required: true
    },
    floor: {
        type: Number,
        enum: [1, 2], // Tầng 1, tầng 2
        required: true
    },
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reservedAt: Date,
    isLocked: {
        type: Boolean,
        default: false // Trạng thái ghế có bị tạm giữ không
    },
    lockedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // Người giữ ghế tạm thời (dùng cho realtime)
    },
    version: { type: Number, default: 0 },
    lockExpiration: Date
});

SeatSchema.index({ trip: 1, seatNumber: 1 }, { unique: true });
SeatSchema.index({ isLocked: 1, lockExpiration: 1 });
const Seat = mongoose.model('Seat', SeatSchema);
module.exports = Seat;


