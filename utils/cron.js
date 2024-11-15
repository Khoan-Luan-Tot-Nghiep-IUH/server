const cron = require('node-cron');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Seat = require('../models/Seat');
const Trip = require('../models/Trip'); 
const dotenv = require('dotenv');
const Location = require('../models/Location');
const Company = require('../models/Company');
const BusType = require('../models/BusType');
const moment = require('moment-timezone');
dotenv.config();

if (mongoose.connection.readyState === 0) {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Kết nối MongoDB thành công cho Cron Jobs');
    })
    .catch((err) => {
        console.error('Lỗi kết nối MongoDB cho Cron Jobs:', err);
    });
}

const cancelExpiredOnlineBookings = cron.schedule('*/10 * * * *', async () => { // Chạy mỗi 10 phút
    console.log('Cron Job: Hủy đặt vé online chưa thanh toán chạy lúc:', new Date());

    try {
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        const expiredBookings = await Booking.find({
            createdAt: { $lt: tenMinutesAgo },
            status: 'Pending',
            paymentStatus: 'Unpaid',
            paymentMethod: 'Online',
        });

        if (expiredBookings.length === 0) {
            console.log('Không có booking nào cần hủy.');
            return;
        }

        // Lấy danh sách ID booking cần xóa
        const bookingIds = expiredBookings.map(booking => booking._id);

        const deleteResult = await Booking.deleteMany({ _id: { $in: bookingIds } });
        console.log(`Đã xóa ${deleteResult.deletedCount} booking.`);

        const tripSeatMap = {};

        expiredBookings.forEach(booking => {
            if (!tripSeatMap[booking.trip]) {
                tripSeatMap[booking.trip] = [];
            }
            tripSeatMap[booking.trip].push(...booking.seatNumbers);
        });
        const seatUpdateConditions = Object.keys(tripSeatMap).map(tripId => ({
            trip: tripId,
            seatNumber: { $in: tripSeatMap[tripId] },
        }));

        const bulkOperations = seatUpdateConditions.map(condition => ({
            updateMany: {
                filter: condition,
                update: { $set: { isAvailable: true, bookedBy: null, paymentMethod: null } },
            }
        }));

        if (bulkOperations.length > 0) {
            const bulkResult = await Seat.bulkWrite(bulkOperations);
            console.log(`Đã giải phóng ${bulkResult.modifiedCount} ghế.`);
        } else {
            console.log('Không có ghế nào cần cập nhật.');
        }

    } catch (error) {
        console.error('Lỗi trong quá trình chạy Cron Job Hủy Booking:', error);
    }
}, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh",
});


const updateCompletedTrips = cron.schedule('0 */12 * * *', async () => { 
    console.log('Cron Job: Cập nhật trạng thái chuyến đi đã hoàn thành chạy lúc:', new Date());

    try {
        const now = new Date();
        const result = await Trip.updateMany(
            {
                arrivalTime: { $lt: now },
                status: { $ne: 'Completed' },
            },
            {
                $set: { status: 'Completed' },
            }
        );

        if (result.modifiedCount === 0) {
            console.log('Không có chuyến đi nào cần cập nhật.');
            return;
        }

        console.log(`Đã cập nhật ${result.modifiedCount} chuyến đi thành "Completed".`);
    } catch (error) {
        console.error('Lỗi khi chạy Cron Job Cập Nhật Chuyến Đi:', error);
    }
}, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh", 
});


const cancelUnpaidDraftBookings = cron.schedule('*/10 * * * *', async () => { // Chạy mỗi 10 phút
    console.log('Cron Job: Hủy booking Draft chưa chọn phương thức thanh toán chạy lúc:', new Date());

    try {
        const now = new Date();
        
        const expiredDraftBookings = await Booking.find({
            status: 'Draft',
            expiryTime: { $lt: now }, 
            createdAt: { $lt: new Date(now.getTime() - 10 * 60000) } 
        });

        if (expiredDraftBookings.length === 0) {
            console.log('Không có booking nào cần hủy.');
            return;
        }


        const draftBookingIds = expiredDraftBookings.map(booking => booking._id);

        const deleteResult = await Booking.deleteMany({ _id: { $in: draftBookingIds } });
        console.log(`Đã xóa ${deleteResult.deletedCount} booking Draft.`);

        const tripSeatMap = {};

        expiredDraftBookings.forEach(booking => {
            if (!tripSeatMap[booking.trip]) {
                tripSeatMap[booking.trip] = [];
            }
            tripSeatMap[booking.trip].push(...booking.seatNumbers);
        });
        
        const seatUpdateConditions = Object.keys(tripSeatMap).map(tripId => ({
            trip: tripId,
            seatNumber: { $in: tripSeatMap[tripId] },
        }));

        const bulkOperations = seatUpdateConditions.map(condition => ({
            updateMany: {
                filter: condition,
                update: { $set: { isAvailable: true, bookedBy: null, paymentMethod: null } },
            }
        }));

        if (bulkOperations.length > 0) {
            const bulkResult = await Seat.bulkWrite(bulkOperations);
            console.log(`Đã giải phóng ${bulkResult.modifiedCount} ghế.`);
        } else {
            console.log('Không có ghế nào cần cập nhật.');
        }

    } catch (error) {
        console.error('Lỗi trong quá trình chạy Cron Job Hủy Booking Draft:', error);
    }
}, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh",
});

const createDailyTrips = cron.schedule('0 */12 * * *', async () => {
    console.log('Cron Job: Tạo chuyến đi chạy thử nghiệm mỗi 10 phút lúc:', new Date());

    try {
        const companies = await Company.find({});
        
        for (const company of companies) {
            const busTypes = await BusType.find({ companyId: company._id });
            if (busTypes.length === 0) {
                console.log(`Không có loại xe nào cho công ty ${company._id}`);
                continue;
            }
            const locations = await Location.find({});
            if (locations.length < 2) {
                console.log('Không đủ địa điểm để tạo chuyến đi');
                continue;
            }
            for (let i = 0; i < locations.length; i++) {
                for (let j = 0; j < locations.length; j++) {
                    if (i === j) continue; 
                    const departureLocation = locations[i]._id;
                    const arrivalLocation = locations[j]._id;

                    for (const busType of busTypes) {
                        const departureTime = moment().tz('Asia/Ho_Chi_Minh').set({ hour: 8, minute: 0 }).toDate();
                        const arrivalTime = moment(departureTime).add(9, 'hours').toDate();

                        const newTrip = new Trip({
                            departureLocation,
                            arrivalLocation,
                            departureTime,
                            arrivalTime,
                            busType: busType._id,
                            schedule: [],
                            basePrice: 100000,
                            companyId: company._id,
                            drivers: [],
                            isRoundTrip: false,
                            status: "Scheduled"
                        });

                        await newTrip.save();
                        console.log(`Đã tạo chuyến đi cho công ty ${company._id} từ ${locations[i].name} đến ${locations[j].name} với loại xe ${busType.name}`);
                        const seats = [];
                        const totalSeats = busType.seats;
                        const floors = busType.floorCount || 1; 
                        const rows = ['Front', 'Middle', 'Back']; 
                        let seatNumber = 1;

                        for (let floor = 1; floor <= floors; floor++) {
                            for (let row of rows) {
                                const seatsInRow = Math.ceil(totalSeats / (floors * rows.length));
                                for (let i = 0; i < seatsInRow; i++) {
                                    if (seatNumber > totalSeats) break;

                                    let seatPrice = newTrip.basePrice;
                                    let isAvailable = true;
                                    let isVIP = false;
                                    if (seatNumber === 1) {
                                        isAvailable = false;
                                    }
                                    if ([2, 3, 4, 5, 6].includes(seatNumber)) {
                                        isVIP = true;
                                        seatPrice = newTrip.basePrice * 1.5;
                                    }

                                    seats.push({
                                        trip: newTrip._id,
                                        seatNumber: seatNumber++,
                                        isAvailable: isAvailable,
                                        isVIP: isVIP,
                                        price: seatPrice,
                                        seatRow: row,
                                        floor: floor
                                    });
                                }
                            }
                        }

                        await Seat.insertMany(seats);
                        console.log(`Đã tạo ${seats.length} ghế cho chuyến đi ${newTrip._id}`);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Lỗi trong quá trình chạy Cron Job Tạo Chuyến Đi Thử Nghiệm:', error);
    }
}, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh",
});

module.exports = {
    cancelExpiredOnlineBookings,
    updateCompletedTrips,
    cancelUnpaidDraftBookings,
    createDailyTrips
};
