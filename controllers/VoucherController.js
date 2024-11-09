const Voucher = require('../models/Voucher');
const User = require('../models/User');
const slugify = require('slugify');

//đổi điểm 100 điểm = 10% voucher!
const redeemPointsForVoucher = async (req, res) => {
    try {
      const userId = req.user._id;
      const { points } = req.body;
  
      const pointsRequiredFor10Percent = 100;
      const discountAmount = Math.floor((points / pointsRequiredFor10Percent) * 10);
  
      if (discountAmount <= 0) {
        return res.status(400).json({ message: 'Số điểm không đủ để quy đổi thành voucher' });
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' });
      }
  
      if (user.loyaltyPoints < points) {
        return res.status(400).json({ message: 'Điểm thưởng không đủ để đổi voucher' });
      }
  
      user.loyaltyPoints -= points;
      await user.save();
  
      const userName = slugify(user.fullName || 'User', { lower: true, remove: /[*+~.()'"!:@]/g });
      const voucherCode = `VOUCHER${discountAmount}${userName}`.toUpperCase();
  

      const voucher = new Voucher({
        code: voucherCode,
        userId,
        discount: discountAmount,
        expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), 
        isUsed: false,
        type: 'personal',
      });
  
      await voucher.save(); 

      user.vouchers.push(voucher._id);
      await user.save();
  
      res.status(201).json({ message: 'Đổi điểm thành voucher thành công', voucher });
    } catch (error) {
      console.error('Error redeeming points:', error); 
      res.status(500).json({ message: 'Lỗi khi đổi điểm lấy voucher', error });
    }
  };
  

// Tạo voucher mới (dành cho Admin hoặc chức năng quản trị)
const createVoucher = async (req, res) => {
    try {
      const { code, userId, discount, expiryDate, type } = req.body;
  
      if (type === 'personal' && !userId) {
        return res.status(400).json({ message: 'Voucher cá nhân cần có userId' });
      }
  
      const existingVoucher = await Voucher.findOne({ code });
      if (existingVoucher) {
        return res.status(400).json({ message: 'Voucher code đã tồn tại' });
      }
  
      const voucher = new Voucher({
        code,
        userId: type === 'personal' ? userId : null,
        discount,
        expiryDate,
        isUsed: false,
        type,
      });
  
      await voucher.save();
      res.status(201).json({ message: 'Tạo voucher thành công', voucher });
    } catch (error) {
      console.error('Error creating voucher:', error); // Log chi tiết lỗi
      res.status(500).json({ message: 'Lỗi khi tạo voucher', error });
    }
  };
  

// Áp dụng voucher
const applyVoucher = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user._id;
    const voucher = await Voucher.findOne({ code, isUsed: false });

    if (!voucher) {
      return res.status(404).json({ message: 'Voucher không tồn tại hoặc đã được sử dụng' });
    }

    if (voucher.type === 'personal' && voucher.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Voucher không dành cho người dùng này' });
    }

    if (voucher.expiryDate && new Date() > voucher.expiryDate) {
      return res.status(400).json({ message: 'Voucher đã hết hạn' });
    }

    const discountAmount = voucher.discount;
    voucher.isUsed = true;
    await voucher.save();

    return res.status(200).json({ message: 'Áp dụng voucher thành công', discountAmount });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi khi áp dụng voucher', error });
  }
};

const getAllVouchers = async (req, res) => {
    try {
      const userId = req.user._id;
      const filter = {
        $or: [
          { type: 'system', isUsed: false }, 
          { type: 'personal', userId }  
        ]
      };
  
      const vouchers = await Voucher.find(filter);
      res.status(200).json(vouchers);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách voucher', error });
    }
  };
  

// Lấy voucher theo ID
const getVoucherById = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await Voucher.findById(id);

    if (!voucher) {
      return res.status(404).json({ message: 'Voucher không tồn tại' });
    }

    res.status(200).json(voucher);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy voucher', error });
  }
};

// Xóa voucher
const deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await Voucher.findByIdAndDelete(id);

    if (!voucher) {
      return res.status(404).json({ message: 'Voucher không tồn tại' });
    }

    res.status(200).json({ message: 'Xóa voucher thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa voucher', error });
  }
};

module.exports = {
  createVoucher,
  applyVoucher,
  getAllVouchers,
  getVoucherById,
  deleteVoucher,
  redeemPointsForVoucher
};
