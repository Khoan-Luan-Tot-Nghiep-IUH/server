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
exports.calculateTripPrice = async (tripId, bookingDate) => {
    try {
        // Lấy thông tin chuyến đi
        const trip = await Trip.findById(tripId);
        if (!trip) {
            throw new Error('Trip not found');
        }

        // Lấy giá cơ bản từ trip
        let finalPrice = trip.basePrice;

        // Tìm tất cả các bảng giá có hiệu lực
        const pricings = await Pricing.find({
            trip: tripId,
            effectiveDate: { $lte: bookingDate },
            endDate: { $gte: bookingDate }
        });

        if (pricings && pricings.length > 0) {
            const discounts = pricings.map(pricing => pricing.discount);
            const maxDiscount = Math.max(...discounts);
            const minDiscount = Math.min(...discounts);

            const maxPrice = finalPrice - (finalPrice * (minDiscount / 100));
            const minPrice = finalPrice - (finalPrice * (maxDiscount / 100));

            console.log(`Applied a discount of ${maxDiscount}% to trip ${tripId}. Final price: ${minPrice}`);

            return {
                finalPrice: minPrice,
                maxPrice,
                minPrice
            };
        } else {
            console.log(`No discount applied to trip ${tripId}. Final price: ${finalPrice}`);
        }

        return { finalPrice };
    } catch (error) {
        console.error('Error calculating trip price:', error.message);
        throw new Error('Failed to calculate trip price');
    }
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
