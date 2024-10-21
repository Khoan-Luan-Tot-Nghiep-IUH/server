const express = require('express');
const router = express.Router();
const driverController = require('../controllers/DriverController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/trips', authMiddleware.verifyToken, authMiddleware.isDriver, driverController.getDriverTrips);
router.put('/trips/:tripId/status', authMiddleware.verifyToken, authMiddleware.isDriver, driverController.updateTripStatus);
router.get('/trips/:tripId/passengers', authMiddleware.verifyToken, authMiddleware.isDriver, driverController.getTripPassengers);
router.put('/trips/:tripId/passengers/:passengerId/checkin', authMiddleware.verifyToken, authMiddleware.isDriver, driverController.checkInPassenger);
router.post('/trips/:tripId/report', authMiddleware.verifyToken, authMiddleware.isDriver, driverController.reportTripIssue);
router.put('/profile', authMiddleware.verifyToken, authMiddleware.isDriver, driverController.updateDriverInfo);

module.exports = router;
