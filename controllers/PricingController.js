const Pricing = require('../models/Pricing');
const Trip = require('../models/Trip');

exports.createPricing = async (req, res) => {
    try {
        const { trip, price, effectiveDate, endDate, discount } = req.body;

        const pricing = new Pricing({
            trip,
            price,
            effectiveDate,
            endDate,
            discount
        });

        await pricing.save();

        res.status(201).json({ success: true, data: pricing });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create pricing', error: error.message });
    }
};


exports.calculateTripPrice = async (tripId, bookingDate) => {
    try {
        const pricing = await Pricing.findOne({
            trip: tripId,
            effectiveDate: { $lte: bookingDate },
            endDate: { $gte: bookingDate }
        });

        if (!pricing) {
            throw new Error('No pricing available for the selected trip');
        }

        let finalPrice = pricing.price;
        
        // Áp dụng chiết khấu theo phần trăm
        if (pricing.discount > 0) {
            finalPrice = finalPrice - (finalPrice * (pricing.discount / 100));
        }

        return finalPrice;
    } catch (error) {
        console.error('Error calculating trip price:', error.message);
        throw new Error('Failed to calculate trip price');
    }
};
