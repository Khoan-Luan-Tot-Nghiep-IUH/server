const Trip = require('../models/Trip');
const Location = require('../models/Location');
const BusType = require('../models/BusType');
const Seat = require('../models/Seat');
const Pricing = require('../models/Pricing');
const { calculateTripPrice } = require('./PricingController');
const TripRequest = require('../models/TripRequest');
const { calculateArrivalTime, determineBusType, determineTotalSeats } = require('../utils/tripUtils');

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
        const { id } = req.params; // ID của yêu cầu mở chuyến đi
        const { status } = req.body; // 'Approved' hoặc 'Rejected'

        const tripRequest = await TripRequest.findById(id);

        if (!tripRequest) {
            return res.status(404).json({ success: false, message: 'Trip request not found' });
        }

        tripRequest.status = status;
        await tripRequest.save();

        if (status === 'Approved') {
            // Tạo chuyến đi mới dựa trên yêu cầu
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
        const { departureLocation, arrivalLocation, departureTime,schedule, arrivalTime, busType, basePrice } = req.body;
        
        const departureLoc = await Location.findById(departureLocation);
        const arrivalLoc = await Location.findById(arrivalLocation);
        const busTypeInfo = await BusType.findById(busType);

        if (!departureLoc || !arrivalLoc || !busTypeInfo) {
            return res.status(400).json({ success: false, message: 'Invalid location or bus type' });
        }

        const newTrip = new Trip({
            departureLocation,
            arrivalLocation,
            departureTime,
            arrivalTime,
            busType,
            schedule,
            totalSeats: busTypeInfo.seats,
            basePrice
        });

        await newTrip.save();

        const seats = [];
        for (let i = 1; i <= busTypeInfo.seats; i++) {
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
        const { departureLocation, arrivalLocation, departureTimeRange, busType } = req.query;

        let filter = {};

        // Handle departureLocation by name
        if (departureLocation) {
            const departureLoc = await Location.findOne({ name: departureLocation });
            if (departureLoc) {
                filter.departureLocation = departureLoc._id;
            } else {
                return res.status(404).json({ success: false, message: 'Departure location not found' });
            }
        }

        // Handle arrivalLocation by name
        if (arrivalLocation) {
            const arrivalLoc = await Location.findOne({ name: arrivalLocation });
            if (arrivalLoc) {
                filter.arrivalLocation = arrivalLoc._id;
            } else {
                return res.status(404).json({ success: false, message: 'Arrival location not found' });
            }
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

        res.status(200).json({ success: true, data: trips });
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
