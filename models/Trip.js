const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
    stopName: {
        type: String,
        required: true,
    },
    stopAddress: {
        type: String,
        required: true,
    },
    estimatedArrivalTime: {
        type: Date,
        required: true,
    },
    stopOrder: {
        type: Number,
        required: true,
    }
});

const TripSchema = new mongoose.Schema({
    departureLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
    arrivalLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
    departureTime: {
        type: Date,
        required: true,
        index: true
    },
    arrivalTime: {
        type: Date,
        required: true,
        index: true
    },
    busType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusType',
        required: true
    },
    basePrice: {
        type: Number,
        required: true
    },
    drivers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver'
    }],
    schedule: [ScheduleSchema],
    status: {
        type: String,
        enum: ['Scheduled', 'Ongoing', 'Delayed', 'Cancelled', 'Completed'],
        default: 'Scheduled'
    },
    totalSeats: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Trip = mongoose.model('Trip', TripSchema);
module.exports = Trip;
