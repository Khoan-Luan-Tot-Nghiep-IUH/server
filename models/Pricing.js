const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PricingSchema = new Schema({
    trip: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
    price: { type: Number, required: true },
    effectiveDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    discount: { type: Number, required: true },
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Pricing', PricingSchema);
