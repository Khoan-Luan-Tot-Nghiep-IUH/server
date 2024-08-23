const Feedback = require('../models/Feedback');
const Trip = require('../models/Trip');

// Tạo phản hồi mới cho chuyến đi
exports.createFeedback = async (req, res) => {
    try {
        const { tripId, rating, comment } = req.body;
        const userId = req.user._id;

        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ success: false, message: 'Trip not found' });
        }

        const newFeedback = new Feedback({
            user: userId,
            trip: tripId,
            rating,
            comment
        });

        await newFeedback.save();

        res.status(201).json({ success: true, data: newFeedback });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create feedback', error: error.message });
    }
};

// Lấy danh sách phản hồi theo chuyến đi
exports.getFeedbacksByTrip = async (req, res) => {
    try {
        const { tripId } = req.params;
        const feedbacks = await Feedback.find({ trip: tripId }).populate('user', 'userName fullName');

        if (!feedbacks || feedbacks.length === 0) {
            return res.status(404).json({ success: false, message: 'No feedbacks found for this trip' });
        }

        res.status(200).json({ success: true, data: feedbacks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve feedbacks', error: error.message });
    }
};

// Xóa phản hồi
exports.deleteFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;

        const feedback = await Feedback.findByIdAndDelete(feedbackId);

        if (!feedback) {
            return res.status(404).json({ success: false, message: 'Feedback not found' });
        }

        res.status(200).json({ success: true, message: 'Feedback deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete feedback', error: error.message });
    }
};
