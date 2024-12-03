    const mongoose = require('mongoose');
    const Driver = require('../models/Driver');
    const Trip = require('../models/Trip');
    const Booking = require('../models/Booking');
    const Notification = require('../models/Notification');
    const SalaryRecord = require('../models/SalaryRecord');

    const getDriverSalaryRecords = async (req, res) => {
        try {
            const userId = req.user._id; 
   
            const driver = await Driver.findOne({ userId });
            if (!driver) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy tài xế với userId này.',
                });
            }

            const salaryRecords = await SalaryRecord.find({ driverId: driver._id }).sort({ startDate: -1 });
    
            if (!salaryRecords || salaryRecords.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy bảng lương nào cho tài xế này.',
                });
            }
    
            res.status(200).json({
                success: true,
                message: 'Lấy bảng lương tài xế thành công.',
                data: salaryRecords,
            });
        } catch (error) {
            console.error('Error fetching salary records:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy bảng lương tài xế.',
                error: error.message,
            });
        }
    };
  
    const confirmSalary = async (req, res) => {
        try {
            const { salaryRecordId } = req.params;
    
            // Tìm tài xế dựa trên userId
            const driver = await Driver.findOne({ userId: req.user._id });
            if (!driver) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy tài xế với userId này.',
                });
            }
    
            // Xác minh và cập nhật bản ghi lương
            const updatedRecord = await SalaryRecord.findOneAndUpdate(
                { _id: salaryRecordId, driverId: driver._id }, // So khớp driverId
                { confirm: true },
                { new: true }
            );
    
            if (!updatedRecord) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy bảng lương hoặc bạn không có quyền xác nhận bảng lương này.',
                });
            }
    
            return res.status(200).json({
                success: true,
                message: 'Xác nhận bảng lương thành công.',
                data: updatedRecord,
            });
        } catch (error) {
            console.error('Error confirming salary record:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi xác nhận bảng lương.',
                error: error.message,
            });
        }
    };
    

    const getDriverTrips = async (req, res) => {
        try {
            const userId = req.user._id;
            
            const trips = await Trip.find({ drivers: userId })
                .populate('departureLocation')
                .populate('arrivalLocation');

            if (!trips || trips.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Không có chuyến đi nào cho tài xế này'
                });
            }

            res.status(200).json({
                success: true,
                count: trips.length,
                trips: trips
            });

        } catch (error) {
            console.error('Error details:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách chuyến đi',
                error: error.message
            });
        }
    };  


    const updateTripStatus = async (req, res) => {
        try {
            const { status } = req.body;
    
            const allowedStatuses = ['Scheduled', 'Ongoing', 'Delayed', 'Cancelled', 'Completed'];
    
            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ.' });
            }
    
            // Tìm chuyến đi liên quan đến tài xế
            const trip = await Trip.findOne({
                drivers: req.user._id, // Chỉ các chuyến đi của tài xế hiện tại
                status: { $ne: 'Completed' }, // Lọc chuyến đi chưa hoàn thành
            }).sort({ departureTime: 1 }); // Sắp xếp theo thời gian khởi hành sớm nhất
    
            if (!trip) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy chuyến đi nào phù hợp.' });
            }
    
            // Cập nhật trạng thái chuyến đi
            trip.status = status;
            await trip.save();
    
            // Tính toán tổng tiền đã thu và tổng phải thu
            let totalAmountCollected = 0;
            let totalExpected = 0;
    
            if (status === 'Completed') {
                const bookings = await Booking.find({ trip: trip._id });
    
                // Tổng tiền phải thu từ tất cả các hành khách
                totalExpected = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
    
                // Tính tổng tiền thực tế thu được từ hành khách đã check-in
                const checkedInBookings = bookings.filter(
                    booking =>
                        booking.paymentMethod === 'OnBoard' &&
                        booking.paymentStatus === 'Paid' &&
                        booking.isCheckedIn
                );
    
                totalAmountCollected = checkedInBookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
    
                // Cập nhật số chuyến đi hoàn thành và tổng tiền thu được của tài xế
                await Driver.findOneAndUpdate(
                    { userId: req.user._id },
                    {
                        $addToSet: { completedTrips: trip._id },
                        $inc: { amountCollectedByDriver: totalAmountCollected },
                    }
                );
            }
    
            // Tạo thông báo
            const content = status === 'Completed'
                ? `Tài xế ${req.user.fullName} đã hoàn thành chuyến đi "${trip._id}". Tổng tiền phải thu: ${totalExpected.toLocaleString()} VND. Thực tế đã thu: ${totalAmountCollected.toLocaleString()} VND.`
                : `Tài xế ${req.user.fullName} đã cập nhật trạng thái chuyến đi "${trip._id}" thành "${status}".`;
    
            const notification = await Notification.create({
                updatedBy: req.user.fullName,
                status,
                content,
            });
    
            res.status(200).json({
                success: true,
                message: 'Cập nhật trạng thái chuyến đi thành công.',
                totalAmountCollected, // Số tiền thực tế thu được
                totalExpected, // Tổng tiền phải thu
                notification, // Thông báo được tạo
            });
        } catch (error) {
            console.error('Error updating trip status:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi cập nhật trạng thái chuyến đi.', error: error.message });
        }
    };
    
    
    

    const getTripPassengers = async (req, res) => {
        try {
            const { tripId } = req.params;
            const trip = await Trip.findById(tripId);
            if (!trip) {
                return res.status(404).json({ success: false, message: 'Chuyến đi không tồn tại.' });
            }
            const driverId = new mongoose.Types.ObjectId(req.user._id);
            const driverIds = trip.drivers.map(driver => driver.toString());

            if (!driverIds.includes(driverId.toString())) {
                return res.status(403).json({ success: false, message: 'Bạn không có quyền truy cập vào danh sách hành khách của chuyến đi này.' });
            }
            const passengers = await Booking.find({ trip: tripId, paymentStatus: 'Unpaid', paymentMethod: 'OnBoard' })
                .populate('user', 'fullName email phone')   
                .select('user isCheckedIn paymentStatus paymentMethod totalPrice');

            let totalAmountDue = 0; 

            const formattedPassengers = passengers.map(passenger => {
                const amountDue = passenger.totalPrice;
                totalAmountDue += amountDue;

                return {
                    bookingId: passenger._id,
                    userId: passenger.user._id,
                    fullName: passenger.user.fullName,
                    email: passenger.user.email,
                    phone: passenger.user.phone,
                    isCheckedIn: passenger.isCheckedIn,
                    paymentStatus: passenger.paymentStatus,
                    paymentMethod: passenger.paymentMethod,
                    amountDue: amountDue
                };
            });

            res.status(200).json({
                success: true,
                totalAmountDue,
                passengers: formattedPassengers
            });
        } catch (error) {
            console.error('Error details:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách hành khách.', error: error.message });
        }
    };


    const checkInPassenger = async (req, res) => {
        try {
            const { tripId, bookingId } = req.params;

            // Kiểm tra chuyến đi
            const trip = await Trip.findById(tripId);
            if (!trip) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy chuyến đi.' });
            }

            // Kiểm tra quyền tài xế
            const driverIds = trip.drivers.map(driver => driver.toString());
            if (!driverIds.includes(req.user._id.toString())) {
                return res.status(403).json({ success: false, message: 'Bạn không có quyền xác nhận hành khách của chuyến đi này.' });
            }

            // Kiểm tra thông tin booking
            const booking = await Booking.findOne({ _id: bookingId, trip: tripId });
            if (!booking) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy booking cho hành khách này.' });
            }

            // Tìm tài xế trong database
            const driver = await Driver.findOne({ userId: req.user._id });
            if (!driver) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin tài xế.' });
            }

            // Log giá trị hiện tại của amountCollectedByDriver và totalPrice trong booking
            console.log("Current amountCollectedByDriver:", driver.amountCollectedByDriver);
            console.log("Booking totalPrice:", booking.totalPrice);

            // Xử lý thanh toán nếu phương thức là 'OnBoard' và chưa thanh toán
            if (booking.paymentMethod === 'OnBoard' && booking.paymentStatus === 'Unpaid') {
                booking.paymentStatus = 'Paid';

                // Kiểm tra và cộng số tiền cần thu vào amountCollectedByDriver
                if (typeof booking.totalPrice === 'number' && booking.totalPrice > 0) {
                    driver.amountCollectedByDriver = (driver.amountCollectedByDriver || 0) + booking.totalPrice;
                    await driver.save();
                    console.log(`Updated amountCollectedByDriver after save: ${driver.amountCollectedByDriver}`);
                } else {
                    console.log("Invalid or zero totalPrice in booking:", booking.totalPrice);
                }
            } else {
                console.log("Payment not required or already paid.");
            }

            // Đánh dấu hành khách đã check-in
            booking.isCheckedIn = true;
            await booking.save();

            res.status(200).json({
                success: true,
                message: booking.paymentStatus === 'Paid'
                    ? 'Hành khách đã thanh toán tiền mặt và được xác nhận lên xe thành công.'
                    : 'Xác nhận hành khách đã lên xe thành công.',
                data: {
                    bookingId: booking._id,
                    userId: booking.user,
                    isCheckedIn: booking.isCheckedIn,
                    paymentMethod: booking.paymentMethod,
                    paymentStatus: booking.paymentStatus,
                    amountCollectedByDriver: driver.amountCollectedByDriver // Số tiền đã thu được cập nhật
                }
            });
        } catch (error) {
            console.error('Error checking in passenger:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi xác nhận hành khách.', error: error.message });
        }
    };


    const getCompletedTripCount = async (req, res) => {
        try {
            const driver = await Driver.findOne({ userId: req.user._id }).select('completedTrips');
            if (!driver) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy tài xế.' });
            }
            const completedTripCount = driver.completedTrips.length;

            res.status(200).json({
                success: true,
                message: 'Lấy số chuyến đi hoàn thành thành công.',
                completedTripCount
            });
        } catch (error) {
            console.error('Error fetching completed trip count:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi lấy số chuyến đi hoàn thành.', error: error.message });
        }
    };


    const reportTripIssue = async (req, res) => {
        try {
            const { tripId } = req.params;
            const { issueDescription } = req.body;

            const trip = await Trip.findById(tripId);
            if (!trip) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy chuyến đi.' });
            }

            // Chỉ tài xế của chuyến đi mới có quyền báo cáo sự cố
            if (trip.driverId.toString() !== req.user._id.toString()) {
                return res.status(403).json({ success: false, message: 'Bạn không có quyền báo cáo sự cố của chuyến đi này.' });
            }

            trip.issues.push({ description: issueDescription, reportedAt: new Date() });
            await trip.save();

            res.status(200).json({ success: true, message: 'Báo cáo sự cố thành công.', trip });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi khi báo cáo sự cố.', error: error.message });
        }
    };


    const updateDriverInfo = async (req, res) => {
        try {
            const driverId = req.user._id; // ID của tài xế từ token
            const { name, phoneNumber, address } = req.body;

            const driver = await Driver.findById(driverId);
            if (!driver) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy tài xế.' });
            }

            driver.name = name || driver.name;
            driver.phoneNumber = phoneNumber || driver.phoneNumber;
            driver.address = address || driver.address;

            await driver.save();

            res.status(200).json({ success: true, message: 'Cập nhật thông tin cá nhân thành công.', driver });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi khi cập nhật thông tin cá nhân.', error: error.message });
        }
    };

    module.exports = {
        getDriverTrips,
        updateTripStatus,
        getTripPassengers,
        checkInPassenger,
        reportTripIssue,
        updateDriverInfo,
        getCompletedTripCount,
        getDriverSalaryRecords,
        confirmSalary 
    };
