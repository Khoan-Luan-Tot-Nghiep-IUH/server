const mongoose = require('mongoose');

const BusTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    seats: {
        type: Number,
        required: true,
        min: 1 
    },
    floorCount: {
        type: Number,
        default: 1
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    images: {
        type: [String], 
        validate: [arrayLimit, '{PATH} exceeds the limit of 5'] 
    }
});

function arrayLimit(val) {
  return val.length <= 5;
}

const BusType = mongoose.model('BusType', BusTypeSchema);
module.exports = BusType;
