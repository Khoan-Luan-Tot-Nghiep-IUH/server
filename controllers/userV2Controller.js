const CompanyRequest = require('../models/CompanyRequest');
const User = require('../models/User');
const { default: mongoose } = require('mongoose');

const TripRequest = require('../models/TripRequest');
const Location = require('../models/Location');
const Company = require('../models/Company');
const BusType = require('../models/BusType');
const moment = require('moment-timezone');
const Seat = require('../models/Seat'); 
const Trip = require('../models/Trip');


// mở + lấy + hủy yêu cầu chuyến đi gửi đến công ty
exports.createTripRequest = async (req, res) => {
    try {
        const { departureLocation, arrivalLocation, preferredDepartureTime, message, busType, companyId, seatNumbers } = req.body;
        const { _id: userId } = req.user;

        // Kiểm tra điểm khởi hành và điểm đến
        const departureLoc = await Location.findById(departureLocation);
        const arrivalLoc = await Location.findById(arrivalLocation);
        if (!departureLoc || !arrivalLoc) {
            return res.status(400).json({
                success: false,
                message: 'Điểm khởi hành hoặc điểm đến không hợp lệ.',
            });
        }

        // Kiểm tra công ty
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Công ty không tồn tại.',
            });
        }

        const busTypeInfo = await BusType.findOne({ _id: busType, companyId });
        if (!busTypeInfo) {
            return res.status(400).json({
                success: false,
                message: 'Loại xe không thuộc công ty đã chọn.',
            });
        }

        if (!seatNumbers || seatNumbers.length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Bạn phải đặt tối thiểu 3 ghế.',
            });
        }

        const maxSeats = busTypeInfo.seats;
        const invalidSeats = seatNumbers.filter(seat => seat < 1 || seat > maxSeats);
        if (invalidSeats.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Các ghế sau không hợp lệ: ${invalidSeats.join(', ')}.`,
            });
        }

        if (seatNumbers.includes(1)) {
            return res.status(400).json({
                success: false,
                message: 'Ghế số 1 không được phép đặt.'
            });
        }

        const now = moment();
        const minimumDepartureTime = now.add(5, 'days'); 
        const preferredTimeUTC = moment.tz(preferredDepartureTime, 'Asia/Ho_Chi_Minh').utc();

        if (!preferredTimeUTC.isValid()) {
            return res.status(400).json({
                success: false,
                message: 'Thời gian khởi hành mong muốn không hợp lệ.',
            });
        }

        if (preferredTimeUTC.isBefore(minimumDepartureTime)) {
            return res.status(400).json({
                success: false,
                message: `Thời gian khởi hành phải lớn hơn ngày hiện tại ít nhất 5 ngày (${minimumDepartureTime.format('YYYY-MM-DD HH:mm:ss')}).`,
            });
        }

        const duplicateRequest = await TripRequest.findOne({
            userId,
            departureLocation,
            arrivalLocation,
            preferredDepartureTime: preferredTimeUTC,
            status: 'Pending', 
        });

        if (duplicateRequest) {
            return res.status(400).json({
                success: false,
                message: 'Yêu cầu đã tồn tại. Bạn không thể gửi yêu cầu trùng lặp.',
            });
        }
        const tripRequest = new TripRequest({
            userId,
            departureLocation,
            arrivalLocation,
            preferredDepartureTime: preferredTimeUTC,
            seatNumbers,
            message: message || '',
            companyId,
            busType,
        });

        await tripRequest.save();

        res.status(201).json({
            success: true,
            message: 'Yêu cầu tạo chuyến đi đã được gửi thành công.',
            data: tripRequest,
        });
    } catch (error) {
        console.error('Error creating trip request:', error);
        res.status(500).json({
            success: false,
            message: 'Gửi yêu cầu tạo chuyến đi thất bại.',
            error: error.message,
        });
    }
};

exports.getUserTripRequests = async (req, res) => {
    try {
        const { _id: userId } = req.user;

        const tripRequests = await TripRequest.find({ userId })
            .populate('departureLocation', 'name address')
            .populate('arrivalLocation', 'name address')
            .populate('companyId', 'name')
            .populate('busType', 'name seats floorCount')
            .sort({ createdAt: -1 }); 

        res.status(200).json({
            success: true,
            data: tripRequests,
        });
    } catch (error) {
        console.error('Error fetching trip requests:', error);
        res.status(500).json({
            success: false,
            message: 'Lấy danh sách yêu cầu thất bại.',
            error: error.message,
        });
    }
};
exports.cancelTripRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { _id: userId } = req.user;
        const tripRequest = await TripRequest.findOne({ _id: requestId, userId });

        if (!tripRequest) {
            return res.status(404).json({
                success: false,
                message: 'Yêu cầu không tồn tại hoặc bạn không có quyền hủy yêu cầu này.',
            });
        }

        if (tripRequest.status !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: 'Yêu cầu này không thể hủy vì nó đã được xử lý.',
            });
        }
        await TripRequest.findByIdAndDelete(requestId);

        res.status(200).json({
            success: true,
            message: 'Yêu cầu đã được hủy thành công.',
        });
    } catch (error) {
        console.error('Error canceling trip request:', error);
        res.status(500).json({
            success: false,
            message: 'Hủy yêu cầu thất bại.',
            error: error.message,
        });
    }
};

// hàm lấy / thao tác của người dùng người dùng khi chuyến đi 
exports.getCompanyTripRequests = async (req, res) => {
    try {
        const companyId = req.user.companyId; 
        const tripRequests = await TripRequest.find({ companyId })
            .populate('departureLocation', 'name address')
            .populate('arrivalLocation', 'name address')
            .populate('userId', 'fullName email phone')
            .populate('busType', 'name seats floorCount')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: tripRequests,
        });
    } catch (error) {
        console.error('Error fetching trip requests for company:', error);
        res.status(500).json({
            success: false,
            message: 'Lấy danh sách yêu cầu chuyến đi thất bại.',
            error: error.message,
        });
    }
};

exports.approveTripRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { basePrice, pickupPoints, dropOffPoints } = req.body;

        // Tìm yêu cầu chuyến đi
        const tripRequest = await TripRequest.findById(requestId).populate('departureLocation arrivalLocation busType');
        if (!tripRequest) {
            return res.status(404).json({
                success: false,
                message: 'Yêu cầu chuyến đi không tồn tại.',
            });
        }

        if (tripRequest.status !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: 'Yêu cầu chuyến đi này đã được xử lý.',
            });
        }

        // Kiểm tra thông tin cần thiết
        if (!tripRequest.departureLocation || !tripRequest.arrivalLocation || !tripRequest.busType) {
            return res.status(400).json({
                success: false,
                message: 'Yêu cầu chuyến đi thiếu thông tin địa điểm hoặc loại xe.',
            });
        }

        if (!basePrice || !Array.isArray(pickupPoints) || !Array.isArray(dropOffPoints)) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin giá hoặc điểm đón/trả.',
            });
        }

        // Tạo chuyến đi mới từ thông tin yêu cầu
        const newTrip = new Trip({
            departureLocation: tripRequest.departureLocation._id,
            arrivalLocation: tripRequest.arrivalLocation._id,
            departureTime: tripRequest.preferredDepartureTime,
            arrivalTime: moment(tripRequest.preferredDepartureTime).add(5, 'hours').toDate(), // Giả định thời gian đến là 5 giờ
            busType: tripRequest.busType._id,
            basePrice,
            companyId: tripRequest.companyId,
            pickupPoints,
            dropOffPoints,
        });

        // Lưu chuyến đi
        await newTrip.save();

        // **Sinh ghế tự động dựa vào thông tin loại xe**
        const seats = [];
        const busType = tripRequest.busType; // Loại xe
        const totalSeats = busType.seats; // Tổng số ghế trong xe
        let seatNumber = 1;

        // Xác định số tầng và các hàng ghế
        const floorCount = busType.floorCount || 1;
        const seatRows = ['Front', 'Middle', 'Back'];

        for (let floor = 1; floor <= floorCount; floor++) {
            for (const row of seatRows) {
                const seatsInRow = Math.ceil(totalSeats / (seatRows.length * floorCount));
                for (let i = 0; i < seatsInRow; i++) {
                    if (seatNumber > totalSeats) break;

                    // Xác định thông tin ghế
                    const isVIP = [1, 2, 3, 4].includes(seatNumber); // Quy định ghế VIP
                    const isAvailable = seatNumber !== 1; // Ghế số 1 không khả dụng

                    seats.push({
                        trip: newTrip._id,
                        seatNumber: seatNumber++,
                        isAvailable,
                        isVIP,
                        price: isVIP ? basePrice * 1.5 : basePrice,
                        seatRow: row,
                        floor,
                        bookedBy: null,
                        reservedAt: null,
                        isLocked: false,
                        lockedBy: null,
                        version: 0,
                        lockExpiration: null,
                    });
                }
            }
        }

        // Lưu danh sách ghế vào bảng `Seat`
        await Seat.insertMany(seats);

        // Cập nhật trạng thái yêu cầu chuyến đi
        tripRequest.status = 'Approved';
        tripRequest.tripId = newTrip._id;
        await tripRequest.save();

        res.status(200).json({
            success: true,
            message: 'Yêu cầu chuyến đi đã được duyệt và chuyến đi đã được tạo thành công, bao gồm danh sách ghế.',
            data: {
                trip: newTrip,
                seats,
            },
        });
    } catch (error) {
        console.error('Error approving trip request:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể duyệt yêu cầu chuyến đi.',
            error: error.message,
        });
    }
};

exports.rejectTripRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { reason } = req.body;
        const companyId = req.user.companyId; 

        const tripRequest = await TripRequest.findOne({ _id: requestId, companyId });
        if (!tripRequest) {
            return res.status(404).json({
                success: false,
                message: 'Yêu cầu không tồn tại hoặc không thuộc quyền quản lý của công ty.',
            });
        }

        if (tripRequest.status !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: 'Yêu cầu này không thể từ chối vì nó đã được xử lý.',
            });
        }

        tripRequest.status = 'Rejected';
        tripRequest.rejectionReason = reason || 'Không có lý do cụ thể.';
        await tripRequest.save();

        res.status(200).json({
            success: true,
            message: 'Yêu cầu chuyến đi đã bị từ chối.',
            data: tripRequest,
        });
    } catch (error) {
        console.error('Error rejecting trip request:', error);
        res.status(500).json({
            success: false,
            message: 'Từ chối yêu cầu thất bại.',
            error: error.message,
        });
    }
};



exports.getCompanyNames = async (req, res) => {
    try {
        const companies = await Company.find({ isActive: true }).select('name _id').lean();
        if (!companies.length) {
            return res.status(404).json({
                success: false,
                message: 'Không có công ty nào được tìm thấy.'
            });
        }
        const companyData = companies.map(company => ({
            id: company._id,
            name: company.name
        }));
        return res.status(200).json({
            success: true,
            data: companyData
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

exports.getCompanyDetails = async (req, res) => {
    const { companyId } = req.params;
    try {
      const company = await Company.findById(companyId);
  
      if (!company) {
        return res.status(404).json({ success: false, message: 'Công ty không tồn tại' });
      }
  
      res.status(200).json({
        success: true,
        data: company,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
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

        // Kiểm tra trạng thái hợp lệ
        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Trạng thái không hợp lệ. Vui lòng chọn Approved hoặc Rejected.'
            });
        }

        // Kiểm tra requestId có hợp lệ không
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({
                success: false,
                message: 'ID yêu cầu không hợp lệ.'
            });
        }

        // Tìm yêu cầu theo requestId
        const request = await CompanyRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Yêu cầu không tồn tại.'
            });
        }

        // Kiểm tra trạng thái hiện tại của yêu cầu
        if (request.status !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: `Yêu cầu đã được xử lý trước đó (${request.status}).`
            });
        }

        // Cập nhật trạng thái yêu cầu
        request.status = status;
        await request.save();

        // Nếu phê duyệt yêu cầu -> Tạo công ty và cập nhật người dùng
        if (status === 'Approved') {
            // Tạo mới công ty
            const newCompany = new Company({
                name: request.name,
                address: request.address,
                contactInfo: request.contactInfo,
                phoneNumber: request.phoneNumber,
                email: request.email,
                website: request.website
            });
            await newCompany.save();

            // Tìm người dùng liên quan
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
            data: request
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái yêu cầu:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật trạng thái yêu cầu.',
            error: error.message
        });
    }
};
