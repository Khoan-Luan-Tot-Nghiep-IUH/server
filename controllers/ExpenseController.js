const Expense = require('../models/Expense');
const Driver = require('../models/Driver');
const BusType = require('../models/BusType');

exports.createExpense = async (req, res) => {
    try {
        const driverId = req.user._id;
        const { description, amount, expenseType, busType } = req.body;

        const driver = await Driver.findOne({ userId: driverId });
        if (!driver) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tài xế.'
            });
        }

        if (busType) {
            const busTypeExists = await BusType.findById(busType);
            if (!busTypeExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Loại xe không hợp lệ.'
                });
            }
        }

        const expense = new Expense({
            driverId: driver._id,
            description,
            amount,
            expenseType,
            busType
        });

        await expense.save();

        res.status(201).json({
            success: true,
            message: 'Phiếu chi đã được tạo thành công.',
            data: expense
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi tạo phiếu chi.',
            error: error.message
        });
    }
};


exports.getDriverExpenses = async (req, res) => {
    try {
        const driverId = req.user._id;

        const driver = await Driver.findOne({ userId: driverId });
        if (!driver) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tài xế.'
            });
        }

        const expenses = await Expense.find({ driverId: driver._id })
            .populate('busType', 'name') // Lấy tên loại xe từ busType
            .lean();

        res.status(200).json({
            success: true,
            data: expenses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy danh sách phiếu chi.',
            error: error.message
        });
    }
};

exports.getCompanyExpenses = async (req, res) => {
    try {
        const companyId = req.user.companyId;

        if (!companyId) {
            return res.status(400).json({
                success: false,
                message: 'Công ty không tồn tại hoặc không hợp lệ.'
            });
        }

        const expenses = await Expense.find()
            .populate({
                path: 'driverId',
                select: 'name companyId',
                match: { companyId }
            })
            .lean();

        res.status(200).json({
            success: true,
            data: expenses.filter(expense => expense.driverId !== null)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy danh sách phiếu chi.',
            error: error.message
        });
    }
};

exports.updateExpenseStatus = async (req, res) => {
    try {
        const { expenseId } = req.params;
        const { status } = req.body;

        if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Trạng thái không hợp lệ.'
            });
        }

        const expense = await Expense.findByIdAndUpdate(
            expenseId,
            { status, updatedAt: new Date() },
            { new: true }
        );

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy phiếu chi.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật trạng thái phiếu chi thành công.',
            data: expense
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi cập nhật trạng thái phiếu chi.',
            error: error.message
        });
    }
};
