const cron = require('node-cron');
const Booking = require('../models/Booking');
const Seat = require('../models/Seat');

// Lên lịch cron job chạy mỗi 10 phút
cron.schedule('*/10 * * * *', async () => {
    console.log('Chạy cron job mỗi 10 phút để kiểm tra và hủy các đặt vé online chưa thanh toán');

    try {
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        const expiredBookings = await Booking.find({
            createdAt: { $lt: tenMinutesAgo },
            status: 'Pending',
            paymentStatus: 'Unpaid',
            paymentMethod: 'Online',
        });

        for (const booking of expiredBookings) {
            await Booking.findByIdAndDelete(booking._id);
            await Seat.updateMany(
                { trip: booking.trip, seatNumber: { $in: booking.seatNumbers } },
                { $set: { isAvailable: true, bookedBy: null, paymentMethod: null } }
            );

            console.log(`Đã hủy đặt vé online quá hạn: ${booking._id}`);
        }
    } catch (error) {
        console.error('Lỗi trong quá trình chạy cron job:', error);
    }
});
