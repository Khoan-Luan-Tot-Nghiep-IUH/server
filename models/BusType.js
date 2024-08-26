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
        default: 1 // Số tầng của xe, mặc định là 1
    }
});

const BusType = mongoose.model('BusType', BusTypeSchema);
module.exports = BusType;
