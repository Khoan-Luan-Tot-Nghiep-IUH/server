const express = require('express');
const router = express.Router();
const driverController = require('../controllers/DriverController');
const authMiddleware = require('../middleware/authMiddleware');
const ExpenseController = require('../controllers/ExpenseController')


router.get('/driver/salary-records', authMiddleware.verifyToken,authMiddleware.isDriver,driverController.getDriverSalaryRecords);
router.put('/driver/salary-records/:salaryRecordId/confirm', authMiddleware.verifyToken,authMiddleware.isDriver,driverController.confirmSalary);

//tạo phiếu chi phí cho tài xế 
router.post('/driver/expenses',authMiddleware.verifyToken,authMiddleware.isDriver,ExpenseController.createExpense);
router.get('/driver/expenses',authMiddleware.verifyToken,authMiddleware.isDriver,ExpenseController.getDriverExpenses);

//lấy phiếu chi từ tài xế (cho công ty)
router.get('/expenses/company',authMiddleware.verifyToken,authMiddleware.isCompanyAdmin,ExpenseController.getCompanyExpenses);
router.patch('/expenses/:expenseId',authMiddleware.verifyToken,authMiddleware.isCompanyAdmin,ExpenseController.updateExpenseStatus);

router.get('/drivers/trips', authMiddleware.verifyToken, authMiddleware.isDriver, driverController.getDriverTrips);
router.put('/trips/:tripId/status', authMiddleware.verifyToken, authMiddleware.checkCompanyAccess, driverController.updateTripStatus);
//lay danh sach hang khach da dat ve trong chuyen di
router.get('/drivers/trips/:tripId/passengers', authMiddleware.verifyToken, authMiddleware.isDriver, driverController.getTripPassengers);

//xac nhan hanh khach len xe
router.put('/drivers/:tripId/passengers/:bookingId/checkin', authMiddleware.verifyToken, authMiddleware.isDriver, driverController.checkInPassenger);

router.get('/drivers/completed-trips/count', authMiddleware.verifyToken, authMiddleware.isDriver, driverController.getCompletedTripCount);

router.post('/trips/:tripId/report', authMiddleware.verifyToken, authMiddleware.isDriver, driverController.reportTripIssue);
router.put('/profile', authMiddleware.verifyToken, authMiddleware.isDriver, driverController.updateDriverInfo);

module.exports = router;
