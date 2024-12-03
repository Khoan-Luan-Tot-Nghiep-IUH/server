const mongoose = require('mongoose');

const SalaryRecordSchema = new mongoose.Schema({
    driverId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Driver', 
        required: true 
    },
    startDate: { 
        type: Date, 
        required: true 
    }, // Ngày bắt đầu của kỳ lương
    endDate: { 
        type: Date, 
        required: true 
    }, // Ngày kết thúc của kỳ lương
    baseSalary: { 
        type: Number, 
        required: true 
    }, // Lương cơ bản của tài xế trong kỳ lương này
    tripEarnings: { 
        type: Number, 
        default: 0 
    }, // Tổng thu nhập từ các chuyến đi hoàn thành trong kỳ tripEarnings = số_chuyến_đi_hoàn_thành * lương_mỗi_chuyến_đi
    totalSalary: { 
        type: Number, 
        required: true 
    }, // Tổng lương cho kỳ lương này (baseSalary + tripEarnings)
    bonuses: { 
        type: Number, 
        default: 0 
    }, // Khoản thưởng thêm (nếu có)
    deductions: { 
        type: Number, 
        default: 0 
    },
    confirm: { 
        type: Boolean, 
        default: false 
    }, // Khoản khấu trừ (nếu có)
}, { timestamps: true });

const SalaryRecord = mongoose.model('SalaryRecord', SalaryRecordSchema);

module.exports = SalaryRecord;
