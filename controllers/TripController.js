const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const Location = require('../models/Location');
const BusType = require('../models/BusType');
const Seat = require('../models/Seat');
const Pricing = require('../models/Pricing');
const { calculateTripPrice } = require('./PricingController');
const moment = require('moment-timezone');
const Company = require('../models/Company');
const Driver = require('../models/Driver');

exports.getSeatsByTripId = async (req, res) => {
    try {
        const { tripId } = req.params;
        const seats = await Seat.find({ trip: tripId });
        if (!seats.length) {
            return res.status(404).json({ success: false, message: 'No seats found for this trip' });
        }
        const lowerSeats = seats.filter(seat => seat.floor === 1);
        const upperSeats = seats.filter(seat => seat.floor === 2);

        res.status(200).json({
            success: true,
            data: {
                lower: lowerSeats,
                upper: upperSeats
            }
        });
    } catch (err) {
        console.error('Error fetching seats:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch seats', error: err.message });
    }
};

exports.createTrip = async (req, res) => {
    try {
        const {
            departureLocation,
            arrivalLocation,
            departureTime,
            schedule,
            arrivalTime,
            busType,
            basePrice,
            isRoundTrip,
            driverIds,
            pickupPoints,
            dropOffPoints,
        } = req.body;

        const { companyId } = req.user;

        // Kiểm tra thông tin công ty
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ success: false, message: 'Công ty không tồn tại.' });
        }

        // Kiểm tra thông tin địa điểm và loại xe
        const departureLoc = await Location.findById(departureLocation);
        const arrivalLoc = await Location.findById(arrivalLocation);
        const busTypeInfo = await BusType.findById(busType);
        const drivers = await Driver.find({ _id: { $in: driverIds } });

        if (!departureLoc || !arrivalLoc || !busTypeInfo) {
            return res.status(400).json({ success: false, message: 'Invalid location or bus type' });
        }

        // Kiểm tra thời gian
        const departureTimeUTC = moment.tz(departureTime, 'Asia/Ho_Chi_Minh').utc().toDate();
        const arrivalTimeUTC = moment.tz(arrivalTime, 'Asia/Ho_Chi_Minh').utc().toDate();

        if (!departureTimeUTC || !arrivalTimeUTC || isNaN(departureTimeUTC.getTime()) || isNaN(arrivalTimeUTC.getTime())) {
            return res.status(400).json({ success: false, message: 'Invalid date format' });
        }

        // Tạo chuyến đi mới
        const newTrip = new Trip({
            departureLocation,
            arrivalLocation,
            departureTime: departureTimeUTC,
            arrivalTime: arrivalTimeUTC,
            busType,
            schedule,
            basePrice,
            companyId,
            drivers: driverIds,
            isRoundTrip: isRoundTrip || false,
            pickupPoints,
            dropOffPoints,
        });

        await newTrip.save();

        // Tạo danh sách ghế
        const seats = [];
        const totalSeats = busTypeInfo.seats;
        const floors = busTypeInfo.floorCount || 1;

        let seatNumber = 1;
        for (let floor = 1; floor <= floors; floor++) {
            const frontSeats = 6; 
            const middleSeats = 6; 
            const backSeats = totalSeats / floors - frontSeats - middleSeats; // Ghế còn lại cho Hàng Cuối

            // Đảm bảo số ghế hàng Cuối không âm
            if (backSeats < 0) {
                throw new Error('Số ghế không hợp lệ, vui lòng kiểm tra loại xe.');
            }

            // Xử lý Hàng Đầu
            for (let i = 0; i < frontSeats; i++) {
                if (seatNumber > totalSeats) break;
                seats.push({
                    trip: newTrip._id,
                    seatNumber: seatNumber++,
                    isAvailable: seatNumber !== 1, // Ghế số 1 không khả dụng
                    isVIP: seatNumber >= 2 && seatNumber <= 6, // Ghế VIP
                    price: seatNumber >= 2 && seatNumber <= 6 ? basePrice * 1.5 : basePrice,
                    seatRow: 'Front',
                    floor: floor,
                });
            }

            // Xử lý Hàng Giữa
            for (let i = 0; i < middleSeats; i++) {
                if (seatNumber > totalSeats) break;
                seats.push({
                    trip: newTrip._id,
                    seatNumber: seatNumber++,
                    isAvailable: true,
                    isVIP: false,
                    price: basePrice,
                    seatRow: 'Middle',
                    floor: floor,
                });
            }

            // Xử lý Hàng Cuối
            for (let i = 0; i < backSeats; i++) {
                if (seatNumber > totalSeats) break;
                seats.push({
                    trip: newTrip._id,
                    seatNumber: seatNumber++,
                    isAvailable: true,
                    isVIP: false,
                    price: basePrice,
                    seatRow: 'Back',
                    floor: floor,
                });
            }
        }

        await Seat.insertMany(seats);

        // Xử lý chuyến đi khứ hồi
        let returnTrip = null;
        if (isRoundTrip) {
            const returnDepartureTime = moment(arrivalTimeUTC).add(1, 'hours').toDate();
            const returnArrivalTime = moment(returnDepartureTime).add(9, 'hours').toDate();

            returnTrip = new Trip({
                departureLocation: arrivalLocation,
                arrivalLocation: departureLocation,
                departureTime: returnDepartureTime,
                arrivalTime: returnArrivalTime,
                busType,
                schedule,
                basePrice,
                companyId,
                isRoundTrip: false,
                pickupPoints: dropOffPoints,
                dropOffPoints: pickupPoints,
                returnTripId: newTrip._id,
            });

            await returnTrip.save();

            newTrip.returnTripId = returnTrip._id;
            await newTrip.save();

            // Tạo ghế cho chuyến về
            const returnSeats = [];
            seatNumber = 1;

            for (let floor = 1; floor <= floors; floor++) {
                for (let i = 0; i < totalSeats / floors; i++) {
                    returnSeats.push({
                        trip: returnTrip._id,
                        seatNumber: seatNumber++,
                        isAvailable: true,
                        isVIP: false,
                        price: basePrice,
                        seatRow: i < frontSeats
                            ? 'Front'
                            : i < frontSeats + middleSeats
                            ? 'Middle'
                            : 'Back',
                        floor: floor,
                    });
                }
            }

            await Seat.insertMany(returnSeats);
        }

        res.status(201).json({ success: true, data: newTrip, returnTrip: returnTrip });
    } catch (err) {
        console.error('Error creating trip:', err);
        res.status(500).json({ success: false, message: 'Failed to create trip', error: err.message });
    }
};


exports.updateTripDrivers = async (req, res) => {
    try {
        const { tripId } = req.params;
        let { driverIds } = req.body;
        const { companyId } = req.user;

        // Kiểm tra định dạng tripId
        if (!mongoose.Types.ObjectId.isValid(tripId)) {
            return res.status(400).json({ success: false, message: 'Định dạng tripId không hợp lệ' });
        }

        // Đảm bảo driverIds là mảng
        if (typeof driverIds === 'string') driverIds = [driverIds];
        if (!Array.isArray(driverIds)) {
            return res.status(400).json({ success: false, message: 'driverIds phải là một mảng hoặc một id' });
        }

        // Kiểm tra định dạng từng driverId
        const invalidIds = driverIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
        if (invalidIds.length > 0) {
            return res.status(400).json({ success: false, message: 'Một số ID tài xế không đúng định dạng', invalidIds });
        }

        const driverObjectIds = driverIds.map(id => new mongoose.Types.ObjectId(id));

        // Kiểm tra chuyến đi có tồn tại và thuộc về công ty của người dùng
        const trip = await Trip.findOne({ _id: tripId, companyId: new mongoose.Types.ObjectId(companyId) });
        if (!trip) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy chuyến đi hoặc chuyến đi không thuộc về công ty của bạn' });
        }

        // Kiểm tra các tài xế có tồn tại và thuộc về công ty
        const drivers = await Driver.find({
            _id: { $in: driverObjectIds },
            companyId: new mongoose.Types.ObjectId(companyId),
            isActive: true
        });

        if (drivers.length !== driverIds.length) {
            return res.status(400).json({ success: false, message: 'Một số tài xế không tồn tại hoặc không thuộc về công ty của bạn' });
        }

        const userIds = drivers.map(driver => driver.userId);
        const tripStartTime = moment(trip.departureTime);
        const tripEndTime = moment(trip.arrivalTime);

        const overlappingTrips = await Trip.find({
            status: { $ne: 'Completed' },
            _id: { $ne: new mongoose.Types.ObjectId(tripId) },
            departureTime: { $lt: tripEndTime.toDate() },
            arrivalTime: { $gt: tripStartTime.toDate() },
            drivers: { $in: userIds }
        });

        if (overlappingTrips.length > 0) {
            console.log('Detected overlapping trips:', overlappingTrips);
        
            overlappingTrips.forEach(trip => {
                console.log(`Trip ID: ${trip._id}`);
                console.log(`Status: ${trip.status}`);
                console.log(`Departure Time: ${trip.departureTime}`);
                console.log(`Arrival Time: ${trip.arrivalTime}`);
                console.log('Drivers:', trip.drivers);
            });
            
            const overlappingDrivers = overlappingTrips.reduce((acc, trip) => {
                const overlapping = trip.drivers.filter(userId => userIds.some(id => id.equals(userId)));
                return [...acc, ...overlapping];
            }, []);
        
            const uniqueOverlappingDrivers = [...new Set(overlappingDrivers.map(id => id.toString()))];
            const conflictingDrivers = await Driver.find({
                userId: { $in: uniqueOverlappingDrivers }
            }, 'licenseNumber');
        
            return res.status(400).json({
                success: false,
                message: 'Tài xế đã được phân công cho chuyến đi khác trong khoảng thời gian này',
                conflictingDrivers: conflictingDrivers.map(d => d.licenseNumber)
            });
        }
        trip.drivers = userIds;
        await trip.save();
        if (trip.isRoundTrip && trip.returnTripId) {
            const returnTrip = await Trip.findById(trip.returnTripId);
            if (returnTrip) {
                returnTrip.drivers = userIds;
                await returnTrip.save();
            }
        }

        // Lấy chi tiết chuyến đi đã cập nhật
        const updatedTrip = await Trip.findById(tripId)
            .populate({ path: 'drivers', select: 'fullName phoneNumber email' })
            .populate('returnTripId');

        res.json({ success: true, message: 'Cập nhật tài xế thành công', data: updatedTrip });
        
    } catch (error) {
        console.error('Error updating trip drivers:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi cập nhật tài xế', error: error.message });
    }
};

exports.getTripsByCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const trips = await Trip.find({ companyId })
            .populate('departureLocation arrivalLocation busType')
            .populate({
                path: 'drivers',
                model: 'User',
                select: 'fullName phoneNumber email role',
                match: { role: 'driver' }
            })
            .sort({ departureDate: -1 });
            

        // Trả về danh sách chuyến đi
        res.status(200).json({ success: true, trips });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách chuyến đi.', error: err.message });
    }
}

exports.getTrips = async (req, res) => {
    try {
        const { 
            departureLocation, 
            arrivalLocation, 
            departureTimeRange, 
            busType, 
            seatRow, 
            floor 
        } = req.query;

        let filter = {};

        if (departureLocation) {
            filter.departureLocation = departureLocation;
        }

        if (arrivalLocation) {
            filter.arrivalLocation = arrivalLocation;
        }

        // Lọc theo giờ khởi hành (departureTimeRange)
        if (departureTimeRange) {
            const [startTime, endTime] = departureTimeRange.split(',');
            filter.departureTime = {
                $gte: new Date(startTime),
                $lte: new Date(endTime)
            };
        }

        // Lọc theo loại xe buýt
        if (busType) {
            filter.busType = busType;
        }

        // Tìm các chuyến đi có ghế theo hàng ghế và tầng cụ thể
        if (seatRow || floor) {
            const seatFilter = {};
            if (seatRow) seatFilter.seatRow = seatRow;
            if (floor) seatFilter.floor = floor;

            const tripsWithSeats = await Seat.find(seatFilter).distinct('trip');
            filter._id = { $in: tripsWithSeats };
        }

        const trips = await Trip.find(filter)
            .populate('departureLocation')
            .populate('arrivalLocation')
            .populate('busType')
            .exec();

        const tripsWithPricing = await Promise.all(trips.map(async trip => {
            const price = await calculateTripPrice(trip._id, new Date());
            return {
                ...trip.toObject(),
                price
            };
        }));

        res.status(200).json({ success: true, data: tripsWithPricing });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to get trips', error: err.message });
    }
};

exports.searchTrips = async (req, res) => {
    try {
        const { 
            departureLocation, 
            arrivalLocation, 
            departureDate, 
            returnDate, 
            ticketCount,
            departureTimeRange, 
            busType, 
            seatRow, 
            floor,
            minPrice, 
            maxPrice,
            companyId,
        } = req.query;

        // Tìm kiếm địa điểm khởi hành và đến từ cơ sở dữ liệu
        const [departureLoc, arrivalLoc] = await Promise.all([
            departureLocation ? Location.findOne({ name: departureLocation.trim() }) : null,
            arrivalLocation ? Location.findOne({ name: arrivalLocation.trim() }) : null
        ]);

        if ((departureLocation && !departureLoc) || (arrivalLocation && !arrivalLoc)) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy địa điểm' });
        }

        let filter = { status: { $ne: "Completed" } }; 
        if (departureLoc) {
            filter.departureLocation = departureLoc._id;
        }
        if (arrivalLoc) {
            filter.arrivalLocation = arrivalLoc._id;
        }
        if (companyId) {
            filter.company = companyId;
        }

        if (departureDate) {
            const startOfDay = moment.utc(departureDate).startOf('day').toDate();
            const endOfDay = moment.utc(departureDate).endOf('day').toDate();
    
        
            filter.departureTime = {
                $gte: startOfDay,
                $lte: endOfDay
            };
        }        

        // Lọc theo giờ khởi hành (departureTimeRange)
        if (departureTimeRange) {
            const [startTime, endTime] = departureTimeRange.split(',');
            filter.departureTime = {
                $gte: moment.utc(startTime).toDate(),
                $lte: moment.utc(endTime).toDate()
            };
        }

        // Lọc theo loại xe buýt
        if (busType) {
            filter.busType = busType;
        }

        // Tìm các chuyến đi có ghế theo hàng ghế và tầng cụ thể
        if (seatRow || floor) {
            const seatFilter = {};
            if (seatRow) seatFilter.seatRow = seatRow;
            if (floor) seatFilter.floor = floor;

            const tripsWithSeats = await Seat.find(seatFilter).distinct('trip');
            filter._id = { $in: tripsWithSeats };
        }

        // Lọc theo khoảng giá vé
        if (minPrice || maxPrice) {
            const pricingFilter = { trip: { $in: await Trip.find(filter).distinct('_id') } };
            if (minPrice) pricingFilter.price = { $gte: minPrice };
            if (maxPrice) pricingFilter.price = pricingFilter.price ? { ...pricingFilter.price, $lte: maxPrice } : { $lte: maxPrice };

            const tripsWithPricing = await Pricing.find(pricingFilter).distinct('trip');
            filter._id = { $in: tripsWithPricing };
        }
        

        let departureTrips = await Trip.find(filter)
            .populate('departureLocation arrivalLocation busType companyId')
            .exec();
        const tripIds = departureTrips.map(trip => trip._id);
        const seatCounts = await Seat.aggregate([
            { $match: { trip: { $in: tripIds }, isAvailable: true } },
            { $group: { _id: "$trip", availableSeats: { $sum: 1 } } }
        ]);
        if (departureTrips.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy chuyến đi phù hợp' });
        }
        if (!departureLocation && !departureDate) {
            return res.status(400).json({ success: false, message: 'Cần nhập điểm đi hoặc ngày đi để tìm kiếm' });
        }        
        const availableSeatsMap = {};
        seatCounts.forEach(count => {
            availableSeatsMap[count._id] = count.availableSeats;
        });
        

        // Thêm số ghế trống vào từng chuyến đi
        departureTrips = departureTrips.map(trip => ({
            ...trip.toObject(),
            availableSeats: availableSeatsMap[trip._id] || 0,
        }));

        let returnTrips = [];

        // Nếu có ngày về hoặc chuyến khứ hồi, tìm kiếm chuyến về
        if (departureTrips.length > 0 && returnDate) {
            const startOfReturnDay = moment(returnDate).startOf('day').utc().toDate();
            const endOfReturnDay = moment(returnDate).endOf('day').utc().toDate();

            const returnTripIds = departureTrips.map(trip => trip.returnTripId).filter(id => id != null);
            returnTrips = await Trip.find({
                _id: { $in: returnTripIds },
                departureTime: {
                    $gte: startOfReturnDay,
                    $lte: endOfReturnDay
                },
                status: { $ne: "Completed" },
            })
            .populate('departureLocation arrivalLocation busType companyId')
            .exec();
            const returnTripSeatCounts = await Seat.aggregate([
                { $match: { trip: { $in: returnTripIds }, isAvailable: true } },
                { $group: { _id: "$trip", availableSeats: { $sum: 1 } } }
            ]);

            const returnAvailableSeatsMap = {};
            returnTripSeatCounts.forEach(count => {
                returnAvailableSeatsMap[count._id] = count.availableSeats;
            });

            returnTrips = returnTrips.map(trip => ({
                ...trip.toObject(),
                availableSeats: returnAvailableSeatsMap[trip._id] || 0,
            }));
        }

        let suggestedTrips = [];

        if (departureTrips) {
            suggestedTrips = await Trip.find({
                departureLocation: departureLoc._id, // Cùng điểm khởi hành
                arrivalLocation: arrivalLoc._id,     // Cùng điểm đến
                departureTime: { $gte: moment().toDate() }, // Tìm chuyến đi trong tương lai
                status: { $ne: "Completed" },        // Lọc các chuyến không hoàn thành
                _id: { $nin: tripIds }  // Loại bỏ các chuyến đi đã được liệt kê trong `departureTrips`
            })
            .sort({ departureTime: 1 })   // Sắp xếp theo thời gian khởi hành
            .limit(5)                    // Giới hạn tối đa 5 chuyến đi
            .populate('departureLocation arrivalLocation busType companyId')
            .exec();

            const suggestedSeatCounts = await Seat.aggregate([
                { $match: { trip: { $in: suggestedTrips.map(trip => trip._id) }, isAvailable: true } },
                { $group: { _id: "$trip", availableSeats: { $sum: 1 } } }
            ]);

    
            const suggestedAvailableSeatsMap = {};
            suggestedSeatCounts.forEach(count => {
                suggestedAvailableSeatsMap[count._id] = count.availableSeats;
            });

            suggestedTrips.forEach(trip => {
                trip.availableSeats = suggestedAvailableSeatsMap[trip._id] || 0;
            });
            }
        res.status(200).json({ success: true, data: { departureTrips, returnTrips, suggestedTrips  } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Không thể tìm thấy chuyến đi', error: err.message });
    }
};

exports.getTripById = async (req, res) => {
    try {
        const { id } = req.params;
        const trip = await Trip.findById(id)
            .populate('departureLocation arrivalLocation busType')
            .exec();

        if (!trip) {
            return res.status(404).json({ success: false, message: 'Trip not found' });
        }

        const seats = await Seat.find({ trip: id }).exec();

        res.status(200).json({ success: true, data: { trip, seats } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to get trip', error: err.message });
    }
};

exports.updateTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (updates.departureLocation) {
            const departureLoc = await Location.findById(updates.departureLocation);
            if (!departureLoc) {
                return res.status(400).json({ success: false, message: 'Invalid departure location' });
            }
        }
        if (updates.arrivalLocation) {
            const arrivalLoc = await Location.findById(updates.arrivalLocation);
            if (!arrivalLoc) {
                return res.status(400).json({ success: false, message: 'Invalid arrival location' });
            }
        }

        if (updates.busType) {
            const busTypeInfo = await BusType.findById(updates.busType);
            if (!busTypeInfo) {
                return res.status(400).json({ success: false, message: 'Invalid bus type' });
            }
        }

        const updatedTrip = await Trip.findByIdAndUpdate(id, updates, { new: true })
            .populate('departureLocation arrivalLocation busType');
        if (!updatedTrip) {
            return res.status(404).json({ success: false, message: 'Trip not found' });
        }

        res.status(200).json({ success: true, data: updatedTrip });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update trip', error: err.message });
    }
};

exports.deleteTrip = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTrip = await Trip.findByIdAndDelete(id);

        if (!deletedTrip) {
            return res.status(404).json({ success: false, message: 'Trip not found' });
        }

        await Seat.deleteMany({ trip: id });

        res.status(200).json({ success: true, message: 'Trip deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete trip', error: err.message });
    }
};

exports.deleteExpiredTripsForCompany = async (req, res) => {
    try {
        const { companyId } = req.user;
        if (!companyId) {
            return res.status(400).json({ message: 'Vui lòng cung cấp ID của công ty.' });
        }
        const currentTime = moment().utc().toDate();
        const result = await Trip.deleteMany({
            arrivalTime: { $lt: currentTime },
            companyId: companyId         
        });

        if (result.deletedCount === 0) {
            return res.status(200).json({
                message: 'Không có chuyến đi nào đã quá hạn để xóa.'
            });
        }
        return res.status(200).json({
            message: `${result.deletedCount} chuyến đi đã quá hạn được xóa thành công.`
        });
    } catch (error) {
        console.error('Lỗi khi xóa các chuyến đi đã quá hạn:', error);
        return res.status(500).json({
            message: 'Có lỗi xảy ra khi xóa các chuyến đi đã quá hạn.',
            error: error.message
        });
    }
};

exports.getTripsWithPricing = async (req, res) => {
    try {
        const { departureLocation, arrivalLocation, departureTimeRange } = req.query;

        let filter = {};

        if (departureLocation) {
            filter.departureLocation = departureLocation;
        }

        if (arrivalLocation) {
            filter.arrivalLocation = arrivalLocation;
        }

        if (departureTimeRange) {
            const [startTime, endTime] = departureTimeRange.split(',');
            filter.departureTime = {
                $gte: new Date(startTime),
                $lte: new Date(endTime)
            };
        }

        const trips = await Trip.find(filter).populate('departureLocation arrivalLocation busType');

        const tripsWithPricing = await Promise.all(trips.map(async trip => {
            const pricing = await Pricing.findOne({ trip: trip._id });
            const seats = await Seat.find({ trip: trip._id });

            return {
                ...trip.toObject(),
                pricing,
                seats
            };
        }));

        res.status(200).json({ success: true, data: tripsWithPricing });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to get trips', error: err.message });
    }
};