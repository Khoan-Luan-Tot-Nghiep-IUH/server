const mongoose = require('mongoose');

const PassengerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    seatNumbers: [{
        type: Number,
        required: true
    }],
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    isCheckedIn: {
        type: Boolean,
        default: false
    }
});

const Passenger = mongoose.model('Passenger', PassengerSchema);
module.exports = Passenger;
