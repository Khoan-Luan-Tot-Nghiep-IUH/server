const mongoose = require('mongoose');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');
const Booking = require('../models/Booking');

const getDriverTrips = async (req, res) => {
    try {
        const userId = req.user._id; 
        const driver = await Driver.findOne({ userId: userId });

        if (!driver) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tài xế tương ứng với người dùng này'
            });
        }
        const driverId = driver._id;
        const trips = await Trip.find({ drivers: { $in: [driverId] } })
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
        const { tripId } = req.params;
        const { status } = req.body;


        const allowedStatuses = ['Scheduled', 'Ongoing', 'Delayed', 'Cancelled', 'Completed'];


        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ.' });
        }


        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy chuyến đi.' });
        }
        if (!trip.drivers.includes(req.user._id)) {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền cập nhật chuyến đi này.' });
        }

        // Cập nhật trạng thái chuyến đi
        trip.status = status;
        await trip.save();

        // Nếu trạng thái là 'Completed', thêm chuyến đi vào danh sách `completedTrips` của tài xế
        if (status === 'Completed') {
            await Driver.findOneAndUpdate(
                { userId: req.user._id },
                { $addToSet: { completedTrips: trip._id } }
            );
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật trạng thái chuyến đi thành công.',
            trip
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

        const passengers = await Booking.find({ trip: tripId })
            .populate('user', 'fullName email phone')
            .select('user isCheckedIn'); 

        const formattedPassengers = passengers.map(passenger => ({
            bookingId: passenger._id,
            userId: passenger.user._id,
            fullName: passenger.user.fullName,
            email: passenger.user.email,
            phone: passenger.user.phone,
            isCheckedIn: passenger.isCheckedIn
        }));

        res.status(200).json({ success: true, passengers: formattedPassengers });
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách hành khách.', error: error.message });
    }
};

//xacs nhan hanh khach da len xe
const checkInPassenger = async (req, res) => {
    try {
        const { tripId, bookingId } = req.params;


        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy chuyến đi.' });
        }

        const driverIds = trip.drivers.map(driver => driver.toString());
        if (!driverIds.includes(req.user._id.toString())) {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền xác nhận hành khách của chuyến đi này.' });
        }


        const booking = await Booking.findOne({ _id: bookingId, trip: tripId });
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy booking cho hành khách này.' });
        }

        if (booking.paymentMethod === 'OnBoard' && booking.paymentStatus === 'Unpaid') {
            booking.paymentStatus = 'Paid';
            booking.isCheckedIn = true;
            await booking.save();

            return res.status(200).json({
                success: true,
                message: 'Hành khách đã thanh toán tiền mặt và được xác nhận lên xe thành công.',
                data: {
                    bookingId: booking._id,
                    userId: booking.user,
                    isCheckedIn: booking.isCheckedIn,
                    paymentMethod: booking.paymentMethod,
                    paymentStatus: booking.paymentStatus
                }
            });
        }
        booking.isCheckedIn = true;
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Xác nhận hành khách đã lên xe thành công.',
            data: {
                bookingId: booking._id,
                userId: booking.user,
                isCheckedIn: booking.isCheckedIn,
                paymentMethod: booking.paymentMethod,
                paymentStatus: booking.paymentStatus
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

// Cập nhật thông tin cá nhân của tài xế
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
    getCompletedTripCount 
};
