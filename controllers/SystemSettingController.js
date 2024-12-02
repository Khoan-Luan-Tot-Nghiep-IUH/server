const SystemSetting = require('../models/SystemSetting');

const Booking = require('../models/Booking');
const Company = require('../models/Company');

const User = require('../models/User');
const mongoose = require('mongoose');

exports.getUserGrowth = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Tính số người dùng đăng ký trong khoảng thời gian từ startDate đến endDate
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Tạo nhóm theo ngày
          count: { $sum: 1 }, // Đếm số người dùng trong mỗi nhóm ngày
        },
      },
      {
        $sort: { _id: 1 }, // Sắp xếp theo ngày tăng trưởng
      },
    ]);

    res.status(200).json({
      success: true,
      data: userGrowth,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Có lỗi khi lấy thống kê người dùng.',
      error: error.message,
    });
  }
};

exports.getCancellationStatistics = async (req, res) => {
  try {
    const result = await Booking.aggregate([
      {
        $lookup: {
          from: "trips", // Collection containing trip data
          localField: "trip",
          foreignField: "_id",
          as: "tripDetails",
        },
      },
      {
        $unwind: "$tripDetails",
      },
      {
        $group: {
          _id: "$tripDetails.companyId", // Group by companyId
          totalBookings: { $sum: 1 }, // Total bookings per company
          canceledBookings: {
            $sum: {
              $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: "companies", // Collection containing company data
          localField: "_id",
          foreignField: "_id",
          as: "companyDetails",
        },
      },
      {
        $unwind: "$companyDetails",
      },
      {
        $addFields: {
          companyName: "$companyDetails.name",
          cancellationPercentage: {
            $cond: [
              { $gt: ["$totalBookings", 0] },
              { $multiply: [{ $divide: ["$canceledBookings", "$totalBookings"] }, 100] },
              0,
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          companyName: 1,
          totalBookings: 1,
          canceledBookings: 1,
          cancellationPercentage: { $round: ["$cancellationPercentage", 2] }, // Round percentage to 2 decimal places
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error retrieving cancellation statistics",
    });
  }
};

exports.getRevenueByCompany = async (req, res) => {
  try {
      const revenueData = await Booking.aggregate([
          {
              $match: {
                  status: { $ne: "Cancelled" }, // Loại bỏ các vé bị hủy
              },
          },
          {
              $lookup: {
                  from: "trips",
                  localField: "trip",
                  foreignField: "_id",
                  as: "tripDetails",
              },
          },
          { $unwind: "$tripDetails" },
          {
              $lookup: {
                  from: "companies",
                  localField: "tripDetails.companyId",
                  foreignField: "_id",
                  as: "companyDetails",
              },
          },
          { $unwind: "$companyDetails" },
          {
              $group: {
                  _id: "$tripDetails.companyId",
                  companyName: { $first: "$companyDetails.name" },
                  totalRevenue: { $sum: "$totalPrice" },
                  onlineRevenue: {
                      $sum: {
                          $cond: [{ $eq: ["$paymentMethod", "Online"] }, "$totalPrice", 0],
                      },
                  },
                  onboardRevenue: {
                      $sum: {
                          $cond: [{ $eq: ["$paymentMethod", "OnBoard"] }, "$totalPrice", 0],
                      },
                  },
                  paidRevenue: {
                      $sum: {
                          $cond: [{ $eq: ["$paymentStatus", "Paid"] }, "$totalPrice", 0],
                      },
                  },
              },
          },
          {
              $project: {
                  companyId: "$_id",
                  companyName: 1,
                  totalRevenue: 1,
                  onlineRevenue: 1,
                  onboardRevenue: 1,
                  paidRevenue: 1,
              },
          },
      ]);

      res.status(200).json({ success: true, data: revenueData });
  } catch (error) {
      console.error("Error fetching revenue data:", error);
      res.status(500).json({ success: false, message: "Error fetching revenue data." });
  }
};

exports.generateNewUserVoucher = async (user) => {
    const setting = await SystemSetting.findOne();
  
    if (setting && setting.allowNewUserVoucher) {
      const voucher = new Voucher({
        code: `NEWUSER50-${user._id}`,
        userId: user._id,
        discount: 50,
        expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        type: 'personal',
        quantity: 1,
      });
  
      await voucher.save();
    }
};

exports.toggleNewUserVoucher = async (req, res) => {
    try {
        if (req.user.roleId !== 'superadmin') {
            return res.status(403).json({ success: false,    message: 'Bạn không có quyền thực hiện thao tác này.' });
        }
        const { allowNewUserVoucher } = req.body;

        let setting = await SystemSetting.findOne();
        if (!setting) {
            setting = new SystemSetting();
        }
        setting.allowNewUserVoucher = allowNewUserVoucher;
        await setting.save();

        res.status(200).json({ success: true, message: `Đã ${allowNewUserVoucher ? 'bật' : 'tắt'} chức năng tặng voucher cho tài khoản mới.` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi cập nhật cài đặt hệ thống', error: error.message });
    }
};


