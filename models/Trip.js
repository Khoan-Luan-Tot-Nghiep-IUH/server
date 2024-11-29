const mongoose = require('mongoose');
const moment = require('moment-timezone');

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

const PointSchema = new mongoose.Schema({
    time: String,
    location: String,
    note: String,
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
        default: function() {
            return moment().utc().toDate();
        },
        index: true
    },
    arrivalTime: {
        type: Date,
        required: true,
        default: function() {
            return moment().utc().toDate();
        },
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
    isRoundTrip: {
        type: Boolean,
        default: false
    },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    returnTripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        default: null
    },
    pickupPoints: [PointSchema],
    dropOffPoints: [PointSchema],
}, {
    timestamps: true
});

TripSchema.virtual('departureTimeLocal').get(function() {
    return moment(this.departureTime).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
});

TripSchema.virtual('arrivalTimeLocal').get(function() {
    return moment(this.arrivalTime).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
});
const Trip = mongoose.model('Trip', TripSchema);
module.exports = Trip;
