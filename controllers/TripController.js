const Trip = require('../models/Trip');
const Location = require('../models/Location');
const BusType = require('../models/BusType');
const Seat = require('../models/Seat');
const Pricing = require('../models/Pricing');
const { calculateTripPrice } = require('./PricingController');
const moment = require('moment-timezone');
const Company = require('../models/Company');


exports.getSeatsByTripId = async (req, res) => {
    try {
        const { tripId } = req.params;

        // Tìm danh sách ghế theo tripId
        const seats = await Seat.find({ trip: tripId });

        if (!seats.length) {
            return res.status(404).json({ success: false, message: 'No seats found for this trip' });
        }

        // Phân loại ghế theo tầng
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
        const { departureLocation, arrivalLocation, departureTime, schedule, arrivalTime, busType, basePrice, isRoundTrip } = req.body;

        const { companyId } = req.user;
        console.log(companyId);
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ success: false, message: 'Công ty không tồn tại.' });
        }

        const departureLoc = await Location.findById(departureLocation);
        const arrivalLoc = await Location.findById(arrivalLocation);
        const busTypeInfo = await BusType.findById(busType);

        if (!departureLoc || !arrivalLoc || !busTypeInfo) {
            return res.status(400).json({ success: false, message: 'Invalid location or bus type' });
        }

        // Đảm bảo định dạng thời gian khởi hành và thời gian đến
        const departureTimeUTC = moment.tz(departureTime, 'Asia/Ho_Chi_Minh').utc().toDate();
        const arrivalTimeUTC = moment.tz(arrivalTime, 'Asia/Ho_Chi_Minh').utc().toDate();

        // Kiểm tra tính hợp lệ của thời gian
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
            isRoundTrip: isRoundTrip || false
        });

        await newTrip.save();

        // Tạo ghế cho chuyến đi chính
        const seats = [];
        const totalSeats = busTypeInfo.seats;
        const floors = busTypeInfo.floorCount || 1; // Sử dụng số tầng từ BusType, mặc định là 1 tầng
        const rows = ['Front', 'Middle', 'Back']; // Giả định có 3 hàng ghế

        let seatNumber = 1;

        for (let floor = 1; floor <= floors; floor++) {
            for (let row of rows) {
                const seatsInRow = Math.ceil(totalSeats / (floors * rows.length)); // Chia đều số ghế giữa các hàng và tầng
                for (let i = 0; i < seatsInRow; i++) {
                    if (seatNumber > totalSeats) break; // Dừng lại nếu đã tạo đủ ghế
                    let seatPrice = basePrice;
                    seats.push({
                        trip: newTrip._id,
                        seatNumber: seatNumber++,
                        isAvailable: true,
                        price: seatPrice,
                        seatRow: row,
                        floor: floor
                    });
                }
            }
        }

        await Seat.insertMany(seats);

        // Nếu là chuyến đi khứ hồi, tạo chuyến đi về
        let returnTrip = null;
        if (isRoundTrip) {
            const returnDepartureTime = moment(arrivalTimeDate).add(1, 'hours').toDate();
            const returnArrivalTime = moment(returnDepartureTime).add(9, 'hours').toDate(); // Giả định 9 giờ cho chuyến đi về

            returnTrip = new Trip({
                departureLocation: arrivalLocation,
                arrivalLocation: departureLocation,
                departureTime: returnDepartureTime,
                arrivalTime: returnArrivalTime,
                busType,
                schedule,
                basePrice,
                companyId, 
                isRoundTrip: false, // Chuyến đi về không cần là round trip nữa
                returnTripId: newTrip._id
            });

            await returnTrip.save();

            newTrip.returnTripId = returnTrip._id;
            await newTrip.save();
            const returnSeats = [];
            seatNumber = 1; 

            for (let floor = 1; floor <= floors; floor++) {
                for (let row of rows) {
                    const seatsInRow = Math.ceil(totalSeats / (floors * rows.length));
                    for (let i = 0; i < seatsInRow; i++) {
                        if (seatNumber > totalSeats) break;
                        let seatPrice = basePrice;
                        returnSeats.push({
                            trip: returnTrip._id,
                            seatNumber: seatNumber++,
                            isAvailable: true,
                            price: seatPrice,
                            seatRow: row,
                            floor: floor
                        });
                    }
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
exports.getTripsByCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const trips = await Trip.find({ companyId }).populate('departureLocation arrivalLocation busType');
        res.status(200).json({ success: true, trips });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách chuyến đi.', error: err.message });
    }
};
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
            maxPrice
        } = req.query;

        // Tìm kiếm địa điểm khởi hành và đến từ cơ sở dữ liệu
        const [departureLoc, arrivalLoc] = await Promise.all([
            departureLocation ? Location.findOne({ name: departureLocation.trim() }) : null,
            arrivalLocation ? Location.findOne({ name: arrivalLocation.trim() }) : null
        ]);

        if ((departureLocation && !departureLoc) || (arrivalLocation && !arrivalLoc)) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy địa điểm' });
        }

        let filter = {};
        if (departureLoc) {
            filter.departureLocation = departureLoc._id;
        }
        if (arrivalLoc) {
            filter.arrivalLocation = arrivalLoc._id;
        }
        if (departureDate) {
            // Sử dụng ngày UTC trực tiếp, không chuyển đổi múi giờ
            const startOfDay = moment.utc(departureDate).startOf('day').toDate();
            const endOfDay = moment.utc(departureDate).endOf('day').toDate();
        
            console.log("Start of Day (UTC):", startOfDay);
            console.log("End of Day (UTC):", endOfDay);
        
            filter.departureTime = {
                $gte: startOfDay,
                $lte: endOfDay
            };
        
            console.log("Filter (UTC):", filter);
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
        

        // Truy vấn chuyến đi và số ghế trống đồng thời
        let [departureTrips, seatCounts] = await Promise.all([
            Trip.find(filter).populate('departureLocation arrivalLocation busType').lean().exec(),
            Seat.aggregate([
                { $match: { trip: { $in: await Trip.find(filter).distinct('_id') }, isAvailable: true } },
                { $group: { _id: "$trip", availableSeats: { $sum: 1 } } }
            ])
        ]);

        // Tạo bản đồ số ghế trống cho từng chuyến
        const availableSeatsMap = seatCounts.reduce((map, count) => {
            map[count._id] = count.availableSeats;
            return map;
        }, {});


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
                }
            })
            .populate('departureLocation arrivalLocation busType')
            .exec();

            // Đếm số ghế trống cho chuyến về
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

        res.status(200).json({ success: true, data: { departureTrips, returnTrips } });
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