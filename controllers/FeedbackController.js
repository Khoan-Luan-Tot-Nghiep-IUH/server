const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const CompanyFeedback = require('../models/Feedback');
const Company = require('../models/Company');
const { uploadImage } = require('../config/cloudinaryConfig');
const User = require('../models/User');

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
        images.push({
          url: uploadedImage.url,
        });
      }
    }

    const feedback = new CompanyFeedback({
      companyId,
      trip: userBooking.trip._id,
      user: userId,
      rating,
      comment,
      images,
    });

    await feedback.save();
    const user = await User.findById(userId);
    if (user) {
      user.loyaltyPoints += 10; 
      await user.save();
    }
    await updateCompanyRating(companyId);

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
    const averageRating =
      feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0) / feedbacks.length;

    await Company.findByIdAndUpdate(companyId, { averageRating });

    console.log(`Cập nhật điểm trung bình cho công ty ${companyId}: ${averageRating}`);
  } catch (error) {
    console.error(`Error updating average rating for company ${companyId}:`, error.message);
  }
}
