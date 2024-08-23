const mongoose = require('mongoose');

const PricingSchema = new mongoose.Schema({
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    effectiveDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    discount: {
        type: Number,
        default: 0 
    }
});

const Pricing = mongoose.model('Pricing', PricingSchema);
module.exports = Pricing;
