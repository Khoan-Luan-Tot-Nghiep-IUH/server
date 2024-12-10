const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const Seat = require('../models/Seat');
const Booking = require('../models/Booking');
const User = require('../models/User');
const PayOS = require('@payos/node');
const dotenv = require('dotenv');
dotenv.config();
const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);
const crypto = require('crypto');
const Voucher = require('../models/Voucher');
const { sendPurchaseConfirmationEmail } = require('../config/mailer');


exports.getBookingDrafts = async (req, res) => {
    try {
        const userId = req.user._id;

        const draftBookings = await Booking.find({
            user: userId,
            status: 'Draft',
            expiryTime: { $gt: new Date() } 
        })
        .populate({
            path: 'trip',
            populate: [
                { path: 'departureLocation', select: 'name address' },
                { path: 'arrivalLocation', select: 'name address' },
                { path: 'busType', select: 'type capacity features' },
                { path: 'companyId', select: 'name contactInfo' } 
            ]
        })
        .select('trip seatNumbers totalPrice expiryTime');

        res.status(200).json({
            success: true,
            data: draftBookings,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy booking Draft', error: error.message });
    }
};

exports.createBookingDraft = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { tripId, seatNumbers } = req.body;
        const userId = req.user._id;

        const MAX_SEATS_PER_BOOKING = 4;
        const uniqueSeatNumbers = [...new Set(seatNumbers)];

        if (!tripId || !uniqueSeatNumbers.length) {
            throw new Error('Thiếu thông tin cần thiết');
        }

        if (uniqueSeatNumbers.length > MAX_SEATS_PER_BOOKING) {
            throw new Error(`Chỉ được đặt tối đa ${MAX_SEATS_PER_BOOKING} ghế trong một lần đặt`);
        }

        const currentTime = new Date();
        const expiryTime = new Date(currentTime.getTime() + 10 * 60000); // 10 minutes expiry

        // Check for existing draft
        const existingDraft = await Booking.findOne({
            user: userId,
            trip: tripId,
            status: 'Draft',
            expiryTime: { $gt: currentTime }
        }).session(session);

        // Retrieve available seats based on tripId and seatNumbers
        const seats = await Seat.find({
            trip: tripId,
            seatNumber: { $in: uniqueSeatNumbers },
            isAvailable: true,
        }).session(session);

        // Check if the seats returned match the requested seats
        if (seats.length !== uniqueSeatNumbers.length) {
            throw new Error('Một số ghế đã được đặt hoặc đang được giữ chỗ');
        }

        // Calculate total price for the new seats
        const totalPrice = seats.reduce((acc, seat) => acc + (seat.price || 0), 0);

        if (existingDraft) {
            // If an existing draft is found, update the draft with new seat numbers and total price
            existingDraft.seatNumbers = [...new Set([...existingDraft.seatNumbers, ...uniqueSeatNumbers])]; // Ensure unique seat numbers
            existingDraft.totalPrice += totalPrice; // Update total price
            existingDraft.expiryTime = expiryTime; // Reset expiry time to extend the draft duration
            
            // Save the updated draft
            await existingDraft.save({ session });

            // Lock the newly added seats
            await Seat.updateMany(
                { _id: { $in: seats.map(seat => seat._id) } },
                { $set: { isLocked: true, lockedBy: userId, lockExpiration: expiryTime } },
                { session }
            );

            await session.commitTransaction();

            res.status(200).json({
                success: true,
                data: {
                    bookingId: existingDraft._id,
                    expiryTime,
                    totalPrice: existingDraft.totalPrice
                }
            });
        } else {
            // If no existing draft, create a new one
            const bookingDraft = new Booking({
                user: userId,
                trip: tripId,
                seatNumbers: uniqueSeatNumbers,
                totalPrice,
                status: 'Draft',
                expiryTime
            });

            await bookingDraft.save({ session });

            // Lock seats for the user during the booking draft period
            await Seat.updateMany(
                { _id: { $in: seats.map(seat => seat._id) } },
                { $set: { isLocked: true, lockedBy: userId, lockExpiration: expiryTime } },
                { session }
            );

            await session.commitTransaction();

            res.status(201).json({
                success: true,
                data: {
                    bookingId: bookingDraft._id,
                    expiryTime,
                    totalPrice
                }
            });
        }

    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ success: false, message: error.message });
    } finally {
        session.endSession();
    }
};

function generateOrderCode(bookingId) {
    const idString = bookingId.toString();
    const hash = crypto.createHash('sha256').update(idString + Date.now()).digest('hex');
    const orderCode = parseInt(hash.slice(0, 8), 16);
    return Math.abs(orderCode);
}
exports.createBooking = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const { bookingId, paymentMethod, voucherCode } = req.body; 
      const userId = req.user._id;
      const userEmail = req.user.email;

      
      const bookingDraft = await Booking.findOne({
        _id: bookingId,
        user: userId,
        status: 'Draft',
        expiryTime: { $gt: new Date() }
      }).session(session);
  
      if (!bookingDraft) {
        throw new Error('Đặt vé đã hết hạn hoặc không tồn tại');
      }

      let discountAmount = 0;
      if (voucherCode) {
        const voucher = await Voucher.findOne({ code: voucherCode, userId, isUsed: false });
        if (!voucher) {
          throw new Error('Voucher không tồn tại, đã hết hạn hoặc đã được sử dụng');
        }
        discountAmount = voucher.discount;
        if (voucher.quantity <= 1) {
          await Voucher.deleteOne({ _id: voucher._id }).session(session);
        } else {
          voucher.quantity -= 1;
          await voucher.save({ session });
        }
        voucher.isUsed = true;
        await voucher.save({ session });
      }
      

      
      const seats = await Seat.find({
        trip: bookingDraft.trip,
        seatNumber: { $in: bookingDraft.seatNumbers },
        isLocked: true,
        lockedBy: userId,
      }).session(session);
  
      bookingDraft.paymentMethod = paymentMethod;
      bookingDraft.status = paymentMethod === 'Online' ? 'Pending' : 'Confirmed';
      if (!bookingDraft.orderCode) {
        bookingDraft.orderCode = generateOrderCode(bookingDraft._id);
      }

      const discountedTotal = Math.round(bookingDraft.totalPrice - (bookingDraft.totalPrice * (discountAmount / 100)));
      bookingDraft.totalPrice = discountedTotal;
  
      await bookingDraft.save({ session });
  
      await Seat.updateMany(
        { 
          trip: bookingDraft.trip,
          seatNumber: { $in: bookingDraft.seatNumbers },
          lockedBy: userId
        },
        { 
          $set: { 
            isLocked: false,
            lockedBy: null,
            lockExpiration: null,
            isAvailable: false,
            bookedBy: userId
          },
          $inc: { version: 1 }
        },
        { session }
      );
  
      if (paymentMethod === 'OnBoard') {
        const user = await User.findById(userId);
        if (user) {
          const rewardPoints = bookingDraft.seatNumbers.length * 10;
          user.loyaltyPoints += rewardPoints;
          await user.save();
        }
      }
      
      let paymentLink = null; 
      const tripDetails = await Trip.findById(bookingDraft.trip)
      .populate('departureLocation') 
      .populate('arrivalLocation') 
      .exec();

  if (!tripDetails) {
      throw new Error('Không tìm thấy thông tin chuyến đi');
  }
  const departurePoint = tripDetails.departureLocation.name;
  const destinationPoint = tripDetails.arrivalLocation.name;
      if (paymentMethod === 'Online') {
        const paymentItems = bookingDraft.seatNumbers.map(seatNumber => {
          const seatInfo = seats.find(s => s.seatNumber === seatNumber);
          if (!seatInfo) {
            throw new Error(`Ghế số ${seatNumber} không tồn tại hoặc không có giá.`);
          }
          return { name: `Ghế số ${seatNumber}`, quantity: 1, price: seatInfo.price };
        });
  
        const paymentLinkRequest = {
          orderCode: Number(bookingDraft.orderCode),
          amount: discountedTotal, 
          description: `Thanh toán cho vé ${bookingDraft.trip.toString().slice(17, 24)}`,
          items: paymentItems,
         returnUrl: `${process.env.API_URL}/api/payment-success`,
        cancelUrl: `${process.env.API_URL}/api/payment-cancel`,

        };
        const paymentLinkResponse = await payOS.createPaymentLink(paymentLinkRequest);
        paymentLink = paymentLinkResponse.checkoutUrl
        if (paymentLinkResponse.checkoutUrl) {  
          await session.commitTransaction();
          await sendPurchaseConfirmationEmail(userEmail, {
            orderCode: bookingDraft.orderCode,
            trip: bookingDraft.trip,
            seatNumbers: bookingDraft.seatNumbers,
            totalPrice: bookingDraft.totalPrice,
            paymentMethod: bookingDraft.paymentMethod,
            paymentLink,
            departurePoint,
            destinationPoint 
        });
          return res.status(200).json({
            success: true,
            data: {
              bookingId: bookingDraft._id,
              paymentLink: paymentLinkResponse.checkoutUrl,
              qrCode: paymentLinkResponse.qrCode,
              discountedTotal
            }
          });
        } else {
          throw new Error('Lỗi tạo link thanh toán PayOS hoặc không có checkoutUrl trong phản hồi.');
        }
        paymentLink = paymentLinkResponse.checkoutUrl;
      }
      
      await session.commitTransaction();
      try {
        await sendPurchaseConfirmationEmail(userEmail, {
            orderCode: bookingDraft.orderCode,
            trip: bookingDraft.trip,
            seatNumbers: bookingDraft.seatNumbers,
            totalPrice: bookingDraft.totalPrice,
            paymentMethod: bookingDraft.paymentMethod,
            paymentLink,
            departurePoint,
            destinationPoint 
        });
        console.log('Payment link:', paymentLink);
    } catch (emailError) {
        console.error('Lỗi gửi email:', emailError.message);
    }

      res.status(200).json({ success: true, data: bookingDraft });
  
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      res.status(400).json({ success: false, message: error.message });
    } finally {
      session.endSession();
    }
};

exports.paymentSuccess = async (req, res) => {
    
    const { orderCode } = req.query;
    try {
        const booking = await Booking.findOne({ orderCode });

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking không tồn tại' });
        }
        booking.status = 'Confirmed';
        booking.paymentStatus = 'Paid';
        await booking.save();

        const user = await User.findById(booking.user);
        if (user) {
          const rewardPoints = booking.seatNumbers.length * 10;
          user.loyaltyPoints += rewardPoints;
          await user.save();
        }

        return res.redirect(
            `${process.env.CLIENT_URL}/user/ticket-buy?success=true&message=Thanh toán thành công!&bookingId=${booking._id}`
          );
          
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi khi xử lý thanh toán', error: error.message });
    }
};

exports.paymentCancel = async (req, res) => {
    const { orderCode } = req.query;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const booking = await Booking.findOne({ orderCode }).session(session);
        if (!booking) return res.status(404).json({ success: false, message: 'Booking không tồn tại' });
        booking.status = 'Cancelled';
        booking.paymentStatus = 'Unpaid';
        await booking.save({ session });
        await Seat.updateMany(
            { trip: booking.trip, seatNumber: { $in: booking.seatNumbers } },
            { $set: { isAvailable: true, bookedBy: null, paymentMethod: null } },
            { session }
        );
        await session.commitTransaction();
        session.endSession();
        res.redirect(`${process.env.CLIENT_URL}/user/ticket-buy`);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ success: false, message: 'Lỗi khi hủy thanh toán', error: error.message });
    }
};

exports.getBookingHistory = async (req, res) => {
    try {

        const userId = req.user._id;
        const bookings = await Booking.find({ user: userId })
            .populate({
                path: 'trip',
                select: 'departureLocation arrivalLocation departureTime arrivalTime busType basePrice status',
                populate: [
                    { path: 'departureLocation', select: 'name' }, 
                    { path: 'arrivalLocation', select: 'name' },   
                    { path: 'busType', select: 'name' },
                    {path: 'companyId' , select:"_id"},         
                ]
            })
            .sort({ createdAt: -1 }); 

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không có lịch sử đặt vé'
            });
        }
        res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.error("Lỗi khi lấy lịch sử đặt vé:", error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy lịch sử đặt vé',
            error: error.message
        });
    }
};

exports.confirmPaymentOnBoard = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking không tồn tại' });
        }

        if (booking.paymentMethod !== 'OnBoard') {
            return res.status(400).json({ success: false, message: 'Đây không phải là booking thanh toán khi lên xe' });
        }

        booking.paymentStatus = 'Paid';
        booking.status = 'Confirmed';
        await booking.save();

        return res.status(200).json({ success: true, message: 'Thanh toán thành công', data: booking });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi xác nhận thanh toán' });
    }
};

exports.cancelBooking = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params;

        // Tìm booking cần hủy
        const booking = await Booking.findById(id).populate('trip').session(session);
        if (!booking) {
            throw new Error('Booking không tồn tại');
        }

        // Kiểm tra nếu booking đã bị hủy trước đó
        if (booking.status === 'Cancelled') {
            throw new Error('Booking đã được hủy trước đó');
        }

        // Kiểm tra nếu booking đã thanh toán
        if (booking.paymentStatus === 'Paid') {
            throw new Error('Booking đã được thanh toán và không thể hủy');
        }

        // Cập nhật trạng thái booking thành "Cancelled"
        booking.status = 'Cancelled';
        booking.paymentStatus = 'Unpaid';
        await booking.save({ session });

        // Cập nhật trạng thái của tất cả các ghế liên quan về "có sẵn"
        await Seat.updateMany(
            { trip: booking.trip._id, seatNumber: { $in: booking.seatNumbers } },
            { $set: { isAvailable: true, bookedBy: null, isLocked: false, lockExpiration: null } },
            { session }
        );

        // Trừ điểm thưởng của người dùng
        const pointsToDeduct = booking.seatNumbers.length * 10; // Ví dụ: mỗi ghế trừ 10 điểm
        const user = await User.findById(booking.user).session(session);
        if (user) {
            user.loyaltyPoints = Math.max(user.loyaltyPoints - pointsToDeduct, 0); // Không trừ quá 0
            await user.save({ session });
        }

        // Cam kết thay đổi
        await session.commitTransaction();
        session.endSession();

        // Emit sự kiện để cập nhật giao diện người dùng qua socket (nếu có)
        if (req.io && typeof req.io.emit === 'function') {
            req.io.emit('bookingCancelled', {
                tripId: booking.trip._id,
                seatNumbers: booking.seatNumbers,
                availableSeats: booking.trip.totalSeats - booking.seatNumbers.length
            });
        }

        res.status(200).json({
            success: true,
            message: 'Booking đã được hủy thành công',
            data: booking
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({
            success: false,
            message: 'Lỗi khi hủy booking',
            error: error.message
        });
    }
};

exports.cancelSeatInBooking = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id, seatNumberToCancel } = req.params;
        const booking = await Booking.findById(id).populate('trip').session(session);
        if (!booking) {
            throw new Error('Booking not found');
        }

        if (booking.status === 'Cancelled') {
            throw new Error('Booking is already cancelled');
        }

        const seatIndex = booking.seatNumbers.indexOf(parseInt(seatNumberToCancel));
        if (seatIndex === -1) {
            throw new Error('Seat not found in booking');
        }

        booking.seatNumbers.splice(seatIndex, 1);
        if (booking.seatNumbers.length === 0) {
            booking.status = 'Cancelled';
        }

        await booking.save({ session });
        await Seat.updateOne(
            { trip: booking.trip._id, seatNumber: seatNumberToCancel },
            { $set: { isAvailable: true, bookedBy: null } },
            { session }
        );
        const pointsToDeduct = 10; 
        const user = await User.findById(booking.user).session(session);

        if (user) {
            user.loyaltyPoints = Math.max(user.loyaltyPoints - pointsToDeduct, 0);
            await user.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        const bookedSeatsCount = await Booking.countDocuments({ trip: booking.trip._id, status: 'Confirmed' });
        if (req.io && typeof req.io.emit === 'function') {
            req.io.emit('seatCancelled', {
                tripId: booking.trip._id,
                seatNumber: seatNumberToCancel,
                availableSeats: booking.trip.totalSeats - bookedSeatsCount
            });
        }

        return res.status(200).json({ success: true, message: 'Seat cancelled successfully', data: booking });
    } catch (error) {   
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        session.endSession();
        return res.status(500).json({ success: false, message: 'Failed to cancel seat', error: error.message });
    }
};
exports.getUserBookings = async (req, res) => {
    try {
        const userId = req.user._id;
        const bookings = await Booking.find({ user: userId }).populate('trip');
        return res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to get bookings', error: error.message });
    }
};
exports.getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id).populate('trip');
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        return res.status(200).json({ success: true, data: booking });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to get booking', error: error.message });
    }
};


//Thống kê cho supperAdmin
exports.getRevenueStatistics = async (req, res) => {
    try {
        const { fromDate, toDate, tripId } = req.query;

        const filter = { paymentStatus: 'Paid' };
        if (fromDate && toDate) {
            filter.createdAt = { $gte: new Date(fromDate), $lte: new Date(toDate) };
        }
        if (tripId) {
            filter.trip = tripId; // Lọc theo chuyến đi
        }

        const bookings = await Booking.find(filter);
        const totalRevenue = bookings.reduce((total, booking) => total + booking.totalPrice, 0);

        return res.status(200).json({
            success: true,
            data: {
                totalRevenue,
                totalBookings: bookings.length
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi khi lấy thống kê doanh thu', error: error.message });
    }
};

// thống kê doanh số và số vé bán được theo công ty
exports.calculateRevenueByCompany = async (req, res) => {
    try {
        const { startDate, endDate, companyId } = req.query;

        // Khởi tạo bộ lọc `bookingFilter` cho `bookingDate`
        const bookingFilter = {};
        if (startDate || endDate) {
            bookingFilter['bookingDate'] = {};
            if (startDate) bookingFilter['bookingDate'].$gte = new Date(startDate);
            if (endDate) bookingFilter['bookingDate'].$lte = new Date(endDate);
        }

        const revenueByCompany = await Booking.aggregate([
            // Áp dụng bộ lọc `bookingDate` ngay từ đầu trên `Booking`
            {
                $match: bookingFilter
            },
            // Liên kết `Booking` với `Trip` để lấy `companyId` từ `Trip`
            {
                $lookup: {
                    from: 'trips',
                    localField: 'trip',
                    foreignField: '_id',
                    as: 'tripDetails'
                }
            },
            // Giải nén `tripDetails` để dễ dàng truy cập `companyId`
            {
                $unwind: '$tripDetails'
            },
            // Lọc theo `companyId` nếu có, sau khi đã lọc theo `bookingDate`
            {
                $match: companyId ? { 'tripDetails.companyId': new mongoose.Types.ObjectId(companyId) } : {}
            },
            // Gom nhóm theo `companyId` và tính tổng doanh thu, số lượng booking, doanh thu trung bình
            {
                $group: {
                    _id: '$tripDetails.companyId',
                    totalRevenue: { $sum: '$totalPrice' },
                    totalBookings: { $sum: 1 },
                    averageRevenue: { $avg: '$totalPrice' }
                }
            },
            // Liên kết với `Company` để lấy thông tin chi tiết về công ty
            {
                $lookup: {
                    from: 'companies',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'companyDetails'
                }
            },
            {
                $unwind: '$companyDetails'
            },
            // Định dạng lại dữ liệu đầu ra
            {
                $project: {
                    _id: 0,
                    companyId: '$_id',
                    companyName: '$companyDetails.name',
                    totalRevenue: 1,
                    totalBookings: 1,
                    averageRevenue: { $round: ['$averageRevenue', 2] }
                }
            },
            // Sắp xếp công ty theo tổng doanh thu giảm dần
            {
                $sort: { totalRevenue: -1 }
            }
        ]);

        res.status(200).json({ success: true, data: revenueByCompany });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



