const Company = require('../models/Company');

const BusType = require('../models/BusType');

exports.getCompanyNames = async (req, res) => {
    try {
        const companies = await Company.find({ isActive: true }).select('name').lean();
        if (!companies.length) {
            return res.status(404).json({
                success: false,
                message: 'Không có công ty nào được tìm thấy.'
            });
        }
        const companyNames = companies.map(company => company.name);
        return res.status(200).json({
            success: true,
            data: companyNames
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách tên công ty.',
            error: error.message
        });
    }
};

exports.getBusTypesByCompany = async (req, res) => {
    try {
        const { companyId } = req.params;

        if (!companyId) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp companyId.'
            });
        }
        const busTypes = await BusType.find({ companyId }).select('name description seats floorCount images').lean();

        if (!busTypes.length) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy loại xe nào cho công ty này.'
            });
        }
        res.status(200).json({
            success: true,
            data: busTypes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy danh sách xe.',
            error: error.message
        });
    }
};
