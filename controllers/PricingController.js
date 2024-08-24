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
        // Lấy thông tin chuyến đi
        const trip = await Trip.findById(tripId);
        if (!trip) {
            throw new Error('Trip not found');
        }

        // Lấy giá cơ bản từ trip
        let finalPrice = trip.basePrice;

        // Kiểm tra xem có pricing nào đang có hiệu lực không
        const pricing = await Pricing.findOne({
            trip: tripId,
            effectiveDate: { $lte: bookingDate },
            endDate: { $gte: bookingDate }
        });

        // Nếu có, áp dụng chiết khấu
        if (pricing && pricing.discount > 0) {
            finalPrice = finalPrice - (finalPrice * (pricing.discount / 100));
        }

        return finalPrice;
    } catch (error) {
        console.error('Error calculating trip price:', error.message);
        throw new Error('Failed to calculate trip price');
    }
};
