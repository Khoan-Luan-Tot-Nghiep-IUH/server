const cron = require('node-cron');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Seat = require('../models/Seat');
const Trip = require('../models/Trip'); // Thêm model Trip
const dotenv = require('dotenv');

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

/**
 * Cron Job 1: Hủy Đặt Vé Online Chưa Thanh Toán Sau 10 Phút
 * Chạy mỗi 10 phút
 */
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


/**
 * Cron Job 2: Cập Nhật Trạng Thái Chuyến Đi Đã Hoàn Thành
 * Chạy vào lúc 00:00 mỗi ngày
 */
const updateCompletedTrips = cron.schedule('0 0 * * *', async () => { 
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

module.exports = {
    cancelExpiredOnlineBookings,
    updateCompletedTrips,
};
