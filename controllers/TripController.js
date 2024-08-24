const Trip = require('../models/Trip');
const Location = require('../models/Location');
const BusType = require('../models/BusType');
const Seat = require('../models/Seat');
const Pricing = require('../models/Pricing');
const { calculateTripPrice } = require('./PricingController');
const moment = require('moment-timezone');

exports.createTrip = async (req, res) => {
    try {
        const { departureLocation, arrivalLocation, departureTime, schedule, arrivalTime, busType, basePrice, isRoundTrip, totalSeats } = req.body;

        const departureLoc = await Location.findById(departureLocation);
        const arrivalLoc = await Location.findById(arrivalLocation);
        const busTypeInfo = await BusType.findById(busType);

        if (!departureLoc || !arrivalLoc || !busTypeInfo) {
            return res.status(400).json({ success: false, message: 'Invalid location or bus type' });
        }

        // Ensure the departureTime and arrivalTime are properly formatted
        const departureTimeDate = moment(departureTime, moment.ISO_8601, true).tz('Asia/Ho_Chi_Minh').toDate();
        const arrivalTimeDate = moment(arrivalTime, moment.ISO_8601, true).tz('Asia/Ho_Chi_Minh').toDate();

        if (!departureTimeDate || !arrivalTimeDate || isNaN(departureTimeDate.getTime()) || isNaN(arrivalTimeDate.getTime())) {
            return res.status(400).json({ success: false, message: 'Invalid date format' });
        }

        const newTrip = new Trip({
            departureLocation,
            arrivalLocation,
            departureTime: departureTimeDate,
            arrivalTime: arrivalTimeDate,
            busType,
            schedule,
            totalSeats: totalSeats || busTypeInfo.seats, // Use totalSeats from request or busType default seats
            basePrice,
            isRoundTrip: isRoundTrip || false
        });

        await newTrip.save();

        // Create seats for the trip
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

        // If it's a round trip, create the return trip
        if (isRoundTrip) {
            const returnDepartureTime = moment(arrivalTimeDate).add(1, 'hours').toDate();
            const returnArrivalTime = moment(returnDepartureTime).add(9, 'hours').toDate(); // Assume 9 hours for the return trip

            const returnTrip = new Trip({
                departureLocation: arrivalLocation,
                arrivalLocation: departureLocation,
                departureTime: returnDepartureTime,
                arrivalTime: returnArrivalTime,
                busType,
                schedule,
                totalSeats: totalSeats || busTypeInfo.seats,
                basePrice,
                returnTripId: newTrip._id
            });

            await returnTrip.save();

            // Update the original trip with the return trip ID
            newTrip.returnTripId = returnTrip._id;
            await newTrip.save();

            // Create seats for the return trip
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
        console.error('Error creating trip:', err);
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
        const { departureLocation, arrivalLocation, departureDate, returnDate, ticketCount } = req.query;

        // Tìm kiếm địa điểm khởi hành và đến từ cơ sở dữ liệu
        const departureLoc = departureLocation ? await Location.findOne({ name: departureLocation.trim() }) : null;
        const arrivalLoc = arrivalLocation ? await Location.findOne({ name: arrivalLocation.trim() }) : null;

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
            const startOfDay = new Date(departureDate);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(departureDate);
            endOfDay.setHours(23, 59, 59, 999);

            filter.departureTime = {
                $gte: startOfDay,
                $lte: endOfDay
            };
        }

        // Tìm kiếm chuyến đi chính (chiều đi)
        const departureTrips = await Trip.find(filter)
            .populate('departureLocation arrivalLocation busType')
            .exec();

        let returnTrips = [];

        // Nếu có ngày về hoặc chuyến khứ hồi, tìm kiếm chuyến về
        if (departureTrips.length > 0) {
            const returnTripIds = departureTrips.map(trip => trip.returnTripId).filter(id => id != null);

            if (returnDate) {
                const startOfReturnDay = new Date(returnDate);
                startOfReturnDay.setHours(0, 0, 0, 0);

                const endOfReturnDay = new Date(returnDate);
                endOfReturnDay.setHours(23, 59, 59, 999);

                returnTrips = await Trip.find({
                    _id: { $in: returnTripIds },
                    departureTime: {
                        $gte: startOfReturnDay,
                        $lte: endOfReturnDay
                    }
                })
                .populate('departureLocation arrivalLocation busType')
                .exec();
            } else if (returnTripIds.length > 0) {
                returnTrips = await Trip.find({
                    _id: { $in: returnTripIds }
                })
                .populate('departureLocation arrivalLocation busType')
                .exec();
            }
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
