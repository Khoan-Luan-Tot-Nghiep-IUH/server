const Pricing = require('../models/Pricing');
const Trip = require('../models/Trip');

// Tạo chính sách giá mới cho chuyến đi
exports.createPricing = async (req, res) => {
    try {
        const { trip, price, effectiveDate, endDate, discount } = req.body;

        // Kiểm tra xem có bảng giá nào trùng ngày không
        const overlappingPricing = await Pricing.findOne({
            trip,
            $or: [
                {
                    effectiveDate: { $lte: endDate },
                    endDate: { $gte: effectiveDate }
                }
            ]
        });

        if (overlappingPricing) {
            return res.status(400).json({ 
                success: false, 
                message: 'A pricing with overlapping dates already exists for this trip' 
            });
        }

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

// Tính toán giá của chuyến đi dựa trên thời gian đặt vé
exports.calculateTripPrice = async (tripId, seatNumbers) => {
    const trip = await Trip.findById(tripId).lean();
    if (!trip) {
        throw new Error('Chuyến đi không tồn tại');
    }

    // Tính toán giá dựa trên số ghế và chuyến đi
    const pricePerSeat = trip.basePrice; 
    return pricePerSeat;
};

// Hàng ngày kiểm tra và vô hiệu hóa các bảng giá hết hạn
const cron = require('node-cron');

cron.schedule('0 0 * * *', async () => {
    try {
        const now = new Date();
        await Pricing.updateMany(
            { endDate: { $lt: now } },
            { $set: { isActive: false } }
        );
        console.log('Pricing status updated based on end date');
    } catch (error) {
        console.error('Error updating pricing status:', error.message);
    }
});
