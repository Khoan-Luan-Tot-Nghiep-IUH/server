const Company = require('../models/Company');

const BusType = require('../models/BusType');

const CompanyRequest = require('../models/CompanyRequest');
const User = require('../models/User');
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

// người dùng gửi && lấy yêu cầu && hủy yêu cầu
exports.createCompanyRequest = async (req, res) => {
    try {
        const { name, address, contactInfo, phoneNumber, email, website } = req.body;

        // Kiểm tra xem user đã liên kết với công ty nào chưa
        const existingCompany = await Company.findOne({ 'employees.userId': req.user._id });
        if (existingCompany) {
            return res.status(400).json({
                success: false,
                message: 'Bạn đã được liên kết với một công ty. Mỗi người dùng chỉ được phép tạo một công ty.'
            });
        }

        // Kiểm tra nếu đã có yêu cầu Pending của user
        const existingRequest = await CompanyRequest.findOne({
            userId: req.user._id,
            status: 'Pending'
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: 'Bạn đã gửi một yêu cầu mở công ty. Vui lòng chờ admin phê duyệt trước khi gửi yêu cầu mới.'
            });
        }

        // Tạo yêu cầu mới
        const newRequest = new CompanyRequest({
            userId: req.user._id,
            name,
            address,
            contactInfo,
            phoneNumber,
            email,
            website
        });

        await newRequest.save();
        return res.status(201).json({
            success: true,
            message: 'Yêu cầu mở công ty đã được gửi thành công.',
            request: newRequest
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi gửi yêu cầu mở công ty.',
            error: error.message
        });
    }
};
exports.getUserRequests = async (req, res) => {
    try {
        const userRequests = await CompanyRequest.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .lean();

        if (!userRequests.length) {
            return res.status(404).json({
                success: false,
                message: 'Bạn chưa gửi bất kỳ yêu cầu nào.'
            });
        }

        return res.status(200).json({
            success: true,
            data: userRequests
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách yêu cầu của bạn.',
            error: error.message
        });
    }
};
exports.cancelUserRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        const request = await CompanyRequest.findOne({
            _id: requestId,
            userId: req.user._id,
            status: 'Pending' 
        });

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Yêu cầu không tồn tại hoặc không thể hủy.'
            });
        }
        await CompanyRequest.findByIdAndDelete(requestId);

        return res.status(200).json({
            success: true,
            message: 'Yêu cầu đã được hủy thành công.'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi hủy yêu cầu.',
            error: error.message
        });
    }
};

// dành cho supperadmin

// lấy danh sách công ty đang yêu cầu tạo
exports.getCompanyRequests = async (req, res) => {
    try {
        const requests = await CompanyRequest.find()
            .populate('userId', 'fullName email') 
            .sort({ createdAt: -1 })
            .lean();

        if (!requests.length) {
            return res.status(404).json({
                success: false,
                message: 'Không có yêu cầu nào được tìm thấy.'
            });
        }

        return res.status(200).json({
            success: true,
            data: requests
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách yêu cầu.',
            error: error.message
        });
    }
};

// cập nhật || đồng ý tạo công ty đó!
exports.updateCompanyRequest = async (req, res) => {
    try {
        const { requestId, status } = req.body;
        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Trạng thái không hợp lệ. Vui lòng chọn Approved hoặc Rejected.'
            });
        }
        const request = await CompanyRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Yêu cầu không tồn tại.'
            });
        }
        if (request.status !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: `Yêu cầu đã được xử lý trước đó (${request.status}).`
            });
        }

        request.status = status;
        await request.save();

        if (status === 'Approved') {
            const newCompany = new Company({
                name: request.name,
                address: request.address,
                contactInfo: request.contactInfo,
                phoneNumber: request.phoneNumber,
                email: request.email,
                website: request.website
            });
            await newCompany.save();

            const user = await User.findById(request.userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Người dùng liên quan đến yêu cầu không tồn tại.'
                });
            }

            user.roleId = 'companyadmin';
            user.companyId = newCompany._id;
            await user.save();
        }

        return res.status(200).json({
            success: true,
            message: `Yêu cầu đã được ${status === 'Approved' ? 'phê duyệt' : 'từ chối'}.`,
            request
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật trạng thái yêu cầu.',
            error: error.message
        });
    }
};
