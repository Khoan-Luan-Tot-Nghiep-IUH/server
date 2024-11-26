const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const CompanyFeedback = require('../models/Feedback');
const Company = require('../models/Company');
const { uploadImage } = require('../config/cloudinaryConfig');
const User = require('../models/User');
const Feedback = require('../models/Feedback');

exports.createCompanyFeedback = async (req, res) => {
  const { companyId, rating, comment } = req.body;
  const userId = req.user._id;

  try {
    const userBooking = await Booking.findOne({
      user: userId,
    }).populate('trip');

    if (!userBooking) {
      return res.status(403).json({
        error: 'Bạn chỉ có thể đánh giá công ty mà bạn đã đặt vé trước đó!',
      });
    }

    const trip = await Trip.findOne({
      _id: userBooking.trip._id,
      companyId,
      status: 'Completed',
    });

    if (!trip) {
      return res.status(403).json({
        error: 'Bạn chỉ có thể đánh giá sau khi hoàn thành chuyến đi!',
      });
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadedImage = await uploadImage(file.path, 'feedback_images');
        images.push({ url: uploadedImage.url });
      }
    }

    const user = await User.findById(userId);
    const feedback = new Feedback({
      companyId,
      trip: userBooking.trip._id,
      user: userId,
      rating,
      comment,
      images,
    });

    await feedback.save();

    const company = await Company.findById(companyId);
    if (company) {
      company.feedbacks.push({
        userId: user._id,
        fullName: user.fullName,
        rating,
        comment,
        createdAt: feedback.createdAt,
      });
      await company.save();
      await updateCompanyRating(companyId);
    }

    if (user) {
      user.loyaltyPoints += 10;
      await user.save();
    }

    res.status(201).json({
      message: 'Đánh giá của bạn đã được ghi nhận thành công!',
      loyaltyPoints: user ? user.loyaltyPoints : null,
      feedback,
    });
  } catch (error) {
    console.error(`Error creating feedback for company ${companyId}:`, error.message);
    res.status(500).json({
      error: 'Hệ thống gặp lỗi. Không thể ghi nhận đánh giá của bạn. Vui lòng thử lại!',
    });
  }
};


async function updateCompanyRating(companyId) {
  try {
    const feedbacks = await CompanyFeedback.find({ companyId });

    if (feedbacks.length === 0) {
      // Không có đánh giá, cập nhật điểm trung bình là 0
      await Company.findByIdAndUpdate(companyId, { averageRating: 0 });
      console.log(`Cập nhật điểm trung bình cho công ty ${companyId}: 0`);
      return;
    }

    // Tính điểm trung bình
    const totalRating = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
    const averageRating = totalRating / feedbacks.length;

    // Cập nhật điểm trung bình
    await Company.findByIdAndUpdate(companyId, { averageRating });
    console.log(`Cập nhật điểm trung bình cho công ty ${companyId}: ${averageRating}`);
  } catch (error) {
    console.error(`Error updating average rating for company ${companyId}:`, error.message);
  }
}
