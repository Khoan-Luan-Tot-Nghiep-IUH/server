const Driver = require('../models/Driver');
const Trip = require('../models/Trip');

// Lấy danh sách các chuyến đi của tài xế
const getDriverTrips = async (req, res) => {
    try {
        const driverId = req.user._id; 
        const trips = await Trip.find({ driverId }).populate('passengers').populate('companyId');
        
        res.status(200).json({ success: true, trips });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách chuyến đi.', error: error.message });
    }
};

const updateTripStatus = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { status } = req.body;

        // Define allowed status values
        const allowedStatuses = ['Scheduled', 'Ongoing', 'Delayed', 'Cancelled', 'Completed'];

        // Validate the status input
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ.' });
        }

        // Find the trip by ID
        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy chuyến đi.' });
        }

        // Find the driver by userId to verify if the user is a driver
        const driver = await Driver.findOne({ userId: req.user._id });
        if (!driver || !trip.drivers.includes(driver._id)) {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền cập nhật chuyến đi này.' });
        }

        // Update the trip status
        trip.status = status;
        await trip.save();

        res.status(200).json({ success: true, message: 'Cập nhật trạng thái chuyến đi thành công.', trip });
    } catch (error) {
        console.error('Error updating trip status:', error);  // Log error for debugging
        res.status(500).json({ success: false, message: 'Lỗi khi cập nhật trạng thái chuyến đi.', error: error.message });
    }
};





// Lấy danh sách hành khách của chuyến đi
const getTripPassengers = async (req, res) => {
    try {
        const { tripId } = req.params;

        const trip = await Trip.findById(tripId).populate('passengers');
        if (!trip) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy chuyến đi.' });
        }

        // Chỉ tài xế của chuyến đi mới có quyền xem hành khách
        if (trip.driverId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền xem hành khách của chuyến đi này.' });
        }

        res.status(200).json({ success: true, passengers: trip.passengers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách hành khách.', error: error.message });
    }
};

// Xác nhận hành khách đã lên xe
const checkInPassenger = async (req, res) => {
    try {
        const { tripId, passengerId } = req.params;

        const trip = await Trip.findById(tripId).populate('passengers');
        if (!trip) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy chuyến đi.' });
        }

        // Chỉ tài xế của chuyến đi mới có quyền xác nhận hành khách
        if (trip.driverId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền xác nhận hành khách của chuyến đi này.' });
        }

        const passenger = trip.passengers.find(p => p._id.toString() === passengerId);
        if (!passenger) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy hành khách.' });
        }

        passenger.isCheckedIn = true;
        await trip.save();

        res.status(200).json({ success: true, message: 'Xác nhận hành khách đã lên xe thành công.', passenger });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi xác nhận hành khách.', error: error.message });
    }
};

// Báo cáo sự cố của chuyến đi
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
    updateDriverInfo
};
