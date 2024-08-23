// utils/cron.js

const cron = require('node-cron');
const Trip = require('../models/Trip');



cron.schedule('0 0 * * *', async () => {
    console.log('Checking for trips to auto-complete...');

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    try {
        const trips = await Trip.find({ status: 'Ongoing', arrivalTime: { $lt: oneDayAgo } });

        for (let trip of trips) {
            trip.status = 'Completed';
            await trip.save();
        }

        console.log(`Automatically marked ${trips.length} trips as completed.`);
    } catch (err) {
        console.error('Error while completing trips:', err.message);
    }
});
