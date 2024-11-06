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
        sparse: true 
    },
    status: {
        type: String,
        enum: ['Draft', 'Pending', 'Confirmed', 'Cancelled', 'Expired'],
        default: 'Draft'
    },
    totalPrice: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['OnBoard', 'Online'],
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Unpaid'],
        default: 'Unpaid'
    },
    expiryTime: {
        type: Date,
        default: null
    },
    isCheckedIn: { type: Boolean, default: false },
});

const Booking = mongoose.model('Booking', BookingSchema);

async function updateIndexes() {
    try {
        await Booking.collection.dropIndex("orderCode_1");
        await Booking.syncIndexes(); 
        console.log("Indexes updated successfully.");
    } catch (error) {
        console.error("Error updating indexes:", error);
    }
}

updateIndexes();

module.exports = Booking;
