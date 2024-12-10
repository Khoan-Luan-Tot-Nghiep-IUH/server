const express = require('express');
const router = express.Router();
const companyController = require('../controllers/CompanyController');
const authMiddleware = require('../middleware/authMiddleware');
const userV2Controller = require('../controllers/userV2Controller');
const ExpenseController = require('../controllers/ExpenseController')



router.get('/most-booked-route',authMiddleware.verifyToken,authMiddleware.isCompanyAdmin,authMiddleware.checkCompanyAccess,companyController.getMostBookedRoutes);


// Cập nhật trạng thái phiếu chi phí
router.get('/expenses',authMiddleware.verifyToken,authMiddleware.isCompanyAdmin,authMiddleware.checkCompanyAccess,ExpenseController.getCompanyExpenses);
router.patch('/expenses/:expenseId/status',authMiddleware.verifyToken,authMiddleware.isCompanyAdmin,authMiddleware.checkCompanyAccess,ExpenseController.updateExpenseStatus);
router.get('/expenses/comparison', authMiddleware.verifyToken, authMiddleware.isCompanyAdmin, authMiddleware.checkCompanyAccess, companyController.getCompanyExpenseComparison);

// View trip requests for the company
router.get('/trip-requests', authMiddleware.verifyToken, authMiddleware.isCompanyAdmin, authMiddleware.checkCompanyAccess, userV2Controller.getCompanyTripRequests);
router.patch('/trip-requests/:requestId/approve',authMiddleware.verifyToken,authMiddleware.isCompanyAdmin,authMiddleware.checkCompanyAccess,userV2Controller.approveTripRequest);
router.patch('/trip-requests/:requestId/reject',authMiddleware.verifyToken,authMiddleware.isCompanyAdmin,authMiddleware.checkCompanyAccess,userV2Controller.rejectTripRequest);



router.post('/', authMiddleware.verifyToken, authMiddleware.isSuperAdmin, companyController.createCompany);
router.post('/add-admin', authMiddleware.verifyToken, authMiddleware.isSuperAdmin, companyController.addCompanyAdmin);
router.put('/:companyId', authMiddleware.verifyToken, authMiddleware.isSuperAdmin, companyController.updateCompany);
router.patch('/:companyId/status', authMiddleware.verifyToken, authMiddleware.isSuperAdmin, companyController.toggleCompanyStatus);
router.delete('/:companyId', authMiddleware.verifyToken, authMiddleware.isSuperAdmin, companyController.deleteCompany); // Thêm route xóa công ty

// Routes dành cho Company Admin
router.post('/add-staff', authMiddleware.verifyToken, authMiddleware.isCompanyAdmin, authMiddleware.checkCompanyAccess, companyController.addStaff);
router.delete('/:companyId/remove-employee/:userId', authMiddleware.verifyToken, authMiddleware.isCompanyAdmin, authMiddleware.checkCompanyAccess, companyController.removeEmployee);
router.post('/add-driver', authMiddleware.verifyToken, authMiddleware.isCompanyAdmin, authMiddleware.checkCompanyAccess, companyController.createDriver);
router.delete('/drivers/:driverId', authMiddleware.verifyToken, authMiddleware.isCompanyAdmin, authMiddleware.checkCompanyAccess, companyController.deleteDriver);
router.put('/drivers/:driverId', authMiddleware.verifyToken, authMiddleware.isCompanyAdmin, authMiddleware.checkCompanyAccess, companyController.updateDriver);
router.get('/drivers', authMiddleware.verifyToken,authMiddleware.isCompanyAdmin, authMiddleware.checkCompanyAccess, companyController.getDriversByCompany);
router.get('/completed-trips-by-month', authMiddleware.verifyToken,authMiddleware.checkCompanyAccess, companyController.getCompletedTripsByMonth);
router.get('/revenue-by-payment-method', authMiddleware.verifyToken,authMiddleware.checkCompanyAccess ,companyController.getRevenueByPaymentMethod);
router.get('/revenue-by-time', authMiddleware.verifyToken, authMiddleware.checkCompanyAccess, companyController.getRevenueByTimeRange);
router.patch('/employees/:userId/disable',authMiddleware.verifyToken,authMiddleware.isCompanyAdmin, companyController.toggleDriverStatus);

router.get('/notifications', authMiddleware.verifyToken, authMiddleware.isCompanyAdmin, authMiddleware.checkCompanyAccess, companyController.getNotifications);

// Route mới: Lấy danh sách đặt vé của công ty
router.get('/bookings', authMiddleware.verifyToken, authMiddleware.isCompanyAdmin, authMiddleware.checkCompanyAccess, companyController.getBookingStatsAndUsers);
router.get('/revenue/comparison', authMiddleware.verifyToken,authMiddleware.isCompanyAdmin,authMiddleware.checkCompanyAccess,companyController.getRevenueComparison);
router.get("/cancelled-stats", authMiddleware.verifyToken,authMiddleware.isCompanyAdmin,authMiddleware.checkCompanyAccess,companyController.getCancelledBookingsStats);
router.patch('/bookings/:bookingId/collect-payment', authMiddleware.verifyToken,authMiddleware.isCompanyAdmin,authMiddleware.checkCompanyAccess,companyController.collectPayment);

router.get('/trips/:tripId/passengers', authMiddleware.verifyToken,authMiddleware.isCompanyAdmin,authMiddleware.checkCompanyAccess,companyController.getTripPassengers);

// tôi chưa gọi 3 hàm này
router.get('/export-revenue', authMiddleware.verifyToken, authMiddleware.checkCompanyAccess, companyController.exportRevenueToExcel);
router.get('/top-booking-users', authMiddleware.verifyToken, authMiddleware.checkCompanyAccess, companyController.getTopBookingUsers);
router.get('/top-booking-users-by-timeframe', authMiddleware.verifyToken, authMiddleware.checkCompanyAccess, companyController.getTopBookingUsersByTimeFrame);
router.post('/calculate-salary', authMiddleware.verifyToken, authMiddleware.checkCompanyAccess, companyController.calculateAndRecordDriverSalary);


// Public Routes (Lấy danh sách công ty)
router.get('/', authMiddleware.verifyToken, companyController.getAllCompanies);

// Xem thông tin công ty 
router.get('/:companyId', authMiddleware.verifyToken, authMiddleware.checkCompanyAccess, companyController.getCompanyById);
module.exports = router;
