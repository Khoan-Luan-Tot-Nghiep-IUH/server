const Seat = require('../models/Seat');

exports.getSeatsByTrip = async (req, res) => {
    try {
        const { tripId } = req.params;
        const seats = await Seat.find({ trip: tripId });

        if (!seats || seats.length === 0) {
            return res.status(404).json({ success: false, message: 'No seats found for this trip' });
        }

        res.status(200).json({ success: true, data: seats });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve seats', error: error.message });
    }
};

// Cập nhật trạng thái của chỗ ngồi (ví dụ: Đặt chỗ, Hủy đặt chỗ)
exports.updateSeatStatus = async (req, res) => {
    try {
        const { seatId } = req.params;
        const { isAvailable, isReserved, bookedBy } = req.body;

        const seat = await Seat.findById(seatId);
        if (!seat) {
            return res.status(404).json({ success: false, message: 'Seat not found' });
        }

        seat.isAvailable = isAvailable !== undefined ? isAvailable : seat.isAvailable;
        seat.isReserved = isReserved !== undefined ? isReserved : seat.isReserved;
        seat.bookedBy = bookedBy !== undefined ? bookedBy : seat.bookedBy;

        await seat.save();
x
        res.status(200).json({ success: true, message: 'Seat status updated successfully', data: seat });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update seat status', error: error.message });
    }
};

exports.checkSeatAvailability = async (req, res) => {
    try {
        const { tripId, seatNumber } = req.params;
        const seat = await Seat.findOne({ trip: tripId, seatNumber });

        if (!seat) {
            return res.status(404).json({ success: false, message: 'Seat not found' });
        }

        res.status(200).json({
            success: true,
            data: {
                seatNumber: seat.seatNumber,
                isAvailable: seat.isAvailable,
                isReserved: seat.isReserved,
                bookedBy: seat.bookedBy
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to check seat availability', error: error.message });
    }
};
