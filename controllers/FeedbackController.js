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
    // Lấy tất cả Booking của người dùng
    const userBookings = await Booking.find({ user: userId }).populate('trip');

    if (!userBookings || userBookings.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Bạn chưa đặt vé nào trong hệ thống!',
      });
    }

    // Kiểm tra xem có booking nào liên kết với companyId hay không
    const bookingWithCompany = userBookings.find(
      (booking) => booking.trip && booking.trip.companyId.toString() === companyId
    );

    if (!bookingWithCompany) {
      return res.status(403).json({
        success: false,
        message: 'Bạn chỉ có thể đánh giá công ty mà bạn đã đặt vé trước đó!',
      });
    }

    // Tạo danh sách ảnh nếu có
    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const uploadedImage = await uploadImage(file.path, 'feedback_images');
          images.push({ url: uploadedImage.url });
        } catch (error) {
          console.error(`Error uploading image: ${file.originalname}`, error.message);
          return res.status(500).json({
            success: false,
            message: `Lỗi khi tải hình ảnh: ${file.originalname}`,
          });
        }
      }
    }

    // Tạo mới feedback
    const feedback = new Feedback({
      companyId,
      trip: bookingWithCompany.trip._id, // Trip từ booking liên kết với companyId
      user: userId,
      rating,
      comment,
      images,
    });

    await feedback.save();

    // Cập nhật thông tin feedback cho công ty
    const company = await Company.findById(companyId);
    if (company) {
      company.feedbacks.push({
        userId,
        fullName: req.user.fullName,
        rating,
        comment,
        createdAt: feedback.createdAt,
      });
      await company.save();
      await updateCompanyRating(companyId);
    }

    // Cộng điểm loyalty cho user
    const user = await User.findById(userId);
    if (user) {
      user.loyaltyPoints += 10;
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: 'Đánh giá của bạn đã được ghi nhận thành công!',
      loyaltyPoints: user ? user.loyaltyPoints : null,
      feedback,
    });
  } catch (error) {
    console.error(`Error creating feedback:`, error);
    res.status(500).json({
      success: false,
      message: 'Hệ thống gặp lỗi. Không thể ghi nhận đánh giá của bạn!',
      error: error.message,
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


exports.getCompanyFeedbacks = async (req, res) => {
  try {
    const companyId = req.user.companyId; // Lấy companyId từ req.user

    if (!companyId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền truy cập vào công ty này.',
      });
    }

    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit;

    const totalFeedbacks = await Feedback.countDocuments({ companyId });

    const feedbacks = await Feedback.find({ companyId })
      .populate('user', 'fullName')
      .populate('trip', 'departure destination startTime')
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách đánh giá thành công.',
      feedbacks,
      pagination: {
        totalFeedbacks,
        currentPage: page,
        totalPages: Math.ceil(totalFeedbacks / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching company feedbacks:', error.message);
    res.status(500).json({
      success: false,
      message: 'Hệ thống gặp lỗi khi lấy danh sách đánh giá. Vui lòng thử lại sau!',
    });
  }
};


