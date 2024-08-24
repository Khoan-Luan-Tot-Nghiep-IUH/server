const Trip = require('../models/Trip');
const Location = require('../models/Location');
const BusType = require('../models/BusType');
const Seat = require('../models/Seat');
const Pricing = require('../models/Pricing');
const { calculateTripPrice } = require('./PricingController');
const TripRequest = require('../models/TripRequest');

exports.requestNewTrip = async (req, res) => {
    try {
        const { departureLocation, arrivalLocation, requestedDate, numberOfPassengers } = req.body;
        const userId = req.user._id;

        const newTripRequest = new TripRequest({
            user: userId,
            departureLocation,
            arrivalLocation,
            requestedDate,
            numberOfPassengers
        });

        await newTripRequest.save();

        res.status(201).json({ success: true, data: newTripRequest });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to request new trip', error: err.message });
    }
};

exports.handleTripRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const tripRequest = await TripRequest.findById(id);

        if (!tripRequest) {
            return res.status(404).json({ success: false, message: 'Trip request not found' });
        }

        tripRequest.status = status;
        await tripRequest.save();

        if (status === 'Approved') {
            const newTrip = new Trip({
                departureLocation: tripRequest.departureLocation,
                arrivalLocation: tripRequest.arrivalLocation,
                departureTime: tripRequest.requestedDate,
                arrivalTime: calculateArrivalTime(tripRequest.departureLocation, tripRequest.arrivalLocation),
                busType: determineBusType(tripRequest.numberOfPassengers),
                totalSeats: determineTotalSeats(tripRequest.numberOfPassengers),
                basePrice: basePrice
            });

            await newTrip.save();
        }

        res.status(200).json({ success: true, data: tripRequest });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to handle trip request', error: err.message });
    }
};

exports.createTrip = async (req, res) => {
    try {
        const { departureLocation, arrivalLocation, departureTime, schedule, arrivalTime, busType, basePrice, isRoundTrip, totalSeats } = req.body;

        const departureLoc = await Location.findById(departureLocation);
        const arrivalLoc = await Location.findById(arrivalLocation);
        const busTypeInfo = await BusType.findById(busType);

        if (!departureLoc || !arrivalLoc || !busTypeInfo) {
            return res.status(400).json({ success: false, message: 'Invalid location or bus type' });
        }

        // Tạo chuyến đi ban đầu
        const newTrip = new Trip({
            departureLocation,
            arrivalLocation,
            departureTime,
            arrivalTime,
            busType,
            schedule,
            totalSeats: totalSeats || busTypeInfo.seats, // Sử dụng tổng số ghế từ request hoặc từ loại xe buýt
            basePrice,
            isRoundTrip: isRoundTrip || false
        });

        await newTrip.save();

        // Tạo ghế cho chuyến đi ban đầu
        const seats = [];
        for (let i = 1; i <= newTrip.totalSeats; i++) {
            let seatPrice = basePrice;
            if (i <= busTypeInfo.vipSeats) {
                seatPrice += busTypeInfo.vipPrice;
            }

            seats.push({
                trip: newTrip._id,
                seatNumber: i,
                isAvailable: true,
                isVIP: i <= busTypeInfo.vipSeats,
                price: seatPrice
            });
        }
        await Seat.insertMany(seats);

        // Nếu là chuyến đi khứ hồi, tạo chuyến đi liên kết
        if (isRoundTrip) {
            const returnTrip = new Trip({
                departureLocation: arrivalLocation, // Điểm đi là điểm đến của chuyến đi ban đầu
                arrivalLocation: departureLocation, // Điểm đến là điểm đi của chuyến đi ban đầu
                departureTime: new Date(arrivalTime).setHours(new Date(arrivalTime).getHours() + 1), // Thời gian khởi hành của chuyến đi khứ hồi
                arrivalTime: new Date(arrivalTime).setHours(new Date(arrivalTime).getHours() + 9), // Giả định thời gian di chuyển của chuyến khứ hồi
                busType,
                schedule, // Bạn có thể thiết lập lịch trình khác cho chuyến khứ hồi nếu cần
                totalSeats: totalSeats || busTypeInfo.seats, // Sử dụng tổng số ghế từ request hoặc từ loại xe buýt
                basePrice,
                returnTripId: newTrip._id // Liên kết ngược lại với chuyến đi ban đầu
            });

            await returnTrip.save();

            // Cập nhật chuyến đi ban đầu với returnTripId
            newTrip.returnTripId = returnTrip._id;
            await newTrip.save();

            // Tạo ghế cho chuyến đi khứ hồi
            const returnSeats = [];
            for (let i = 1; i <= returnTrip.totalSeats; i++) {
                let seatPrice = basePrice;
                if (i <= busTypeInfo.vipSeats) {
                    seatPrice += busTypeInfo.vipPrice;
                }

                returnSeats.push({
                    trip: returnTrip._id,
                    seatNumber: i,
                    isAvailable: true,
                    isVIP: i <= busTypeInfo.vipSeats,
                    price: seatPrice
                });
            }
            await Seat.insertMany(returnSeats);
        }

        res.status(201).json({ success: true, data: newTrip });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create trip', error: err.message });
    }
};


exports.getTrips = async (req, res) => {
    try {
        const { departureLocation, arrivalLocation, departureTimeRange, busType } = req.query;

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

        if (busType) {
            filter.busType = busType;
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
        const { departureLocation, arrivalLocation, departureDate, returnDate } = req.query;

        let filter = {};

        if (departureLocation) {
            filter.departureLocation = departureLocation;
        }

        if (arrivalLocation) {
            filter.arrivalLocation = arrivalLocation;
        }

        if (departureDate) {
            filter.departureTime = {
                $gte: new Date(departureDate),
            };
        }

        // Tìm kiếm chuyến đi chính
        const departureTrips = await Trip.find(filter)
            .populate('departureLocation arrivalLocation busType')
            .exec();

        let returnTrips = [];

        // Tìm kiếm chuyến đi khứ hồi nếu có
        if (departureTrips.length > 0 && returnDate) {
            const returnTripIds = departureTrips.map(trip => trip.returnTripId).filter(id => id != null);

            if (returnTripIds.length > 0) {
                returnTrips = await Trip.find({
                    _id: { $in: returnTripIds },
                    departureTime: {
                        $gte: new Date(returnDate),
                    },
                })
                .populate('departureLocation arrivalLocation busType')
                .exec();
            }
        }

        res.status(200).json({ success: true, data: { departureTrips, returnTrips } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to get trips', error: err.message });
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
