const mongoose = require('mongoose');

const TripRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    departureLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true,
    },
    arrivalLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true,
    },
    preferredDepartureTime: {
        type: Date,
        required: true,
    },
    seatNumbers: {
        type: [Number],
        required: true,
    },
    message: {
        type: String,
        default: '', 
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Created'],
        default: 'Pending',
    },
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        default: null,
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    busType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusType',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const TripRequest = mongoose.model('TripRequest', TripRequestSchema);

module.exports = TripRequest;
