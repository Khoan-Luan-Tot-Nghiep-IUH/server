const argon2 = require('argon2');
const Company = require('../models/Company');
const User = require('../models/User');
const moment = require('moment');
const Driver = require('../models/Driver');
const SalaryRecord = require('../models/SalaryRecord');
const Trip = require('../models/Trip');
const { default: mongoose } = require('mongoose');
const Booking = require('../models/Booking');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const Notification = require('../models/Notification');
const companyController = {
    createCompany: async (req, res) => {
        try {
            const { name, address, contactInfo, phoneNumber, email, website } = req.body;
            const existingCompany = await Company.findOne({ name });
            if (existingCompany) {
                return res.status(400).json({ success: false, message: 'Công ty đã tồn tại với tên này.' });
            }
            const newCompany = new Company({
                name,
                address,
                contactInfo,
                phoneNumber,
                email,
                website
            });

            await newCompany.save();
            return res.status(201).json({ success: true, message: 'Công ty đã được tạo thành công.', company: newCompany });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Lỗi khi tạo công ty.', error: error.message });
        }
    },
     addCompanyAdmin : async (req, res) => {
        try {
            const { companyId, userName, password, email, phoneNumber } = req.body;
            if (!userName || !password || !email || !phoneNumber) {
                return res.status(400).json({ success: false, message: 'Tên đăng nhập, mật khẩu, email và số điện thoại không được để trống.' });
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ success: false, message: 'Định dạng email không hợp lệ.' });
            }
            const normalizedUserName = userName.trim().toLowerCase();
            const company = await Company.findById(companyId);
            if (!company) {
                return res.status(404).json({ success: false, message: 'Công ty không tồn tại.' });
            }
            const [existingUser, existingEmail, existingPhone] = await Promise.all([
                User.findOne({ userName: normalizedUserName }),
                User.findOne({ email }),
                User.findOne({ phoneNumber })
            ]);
    
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Tên đăng nhập này đã được sử dụng.' });
            }
            if (existingEmail) {
                return res.status(400).json({ success: false, message: 'Email này đã được sử dụng.' });
            }
            if (existingPhone) {
                return res.status(400).json({ success: false, message: 'Số điện thoại này đã được sử dụng.' });
            }
            const hashedPassword = await argon2.hash(password);
            const fullName = `Admin ${company.name}`;
            const newUser = new User({
                userName: normalizedUserName,
                password: hashedPassword,
                email, 
                phoneNumber, 
                fullName: fullName,
                roleId: 'companyadmin',
                companyId: companyId
            });

            // Lưu user và cập nhật công ty
            await newUser.save();
            company.employees.push({
                userId: newUser._id,
                
                roleId: 'companyadmin'
            });
            await company.save();
    
            return res.status(201).json({ success: true, message: 'Tài khoản admin đã được tạo thành công.', user: newUser });
        } catch (error) {
            console.error('Error when adding admin:', error);
            return res.status(500).json({ success: false, message: 'Lỗi khi thêm admin cho công ty.', error: error.message });
        }
    },
    getAllCompanies: async (req, res) => {
        try {
            const companies = await Company.find();
            return res.status(200).json({ success: true, companies });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách công ty.', error: error.message });
        }
    },
    getCompanyById: async (req, res) => {
        try {
            const company = await Company.findById(req.params.companyId).populate('employees.userId', '-password');
            if (!company) {
                return res.status(404).json({ success: false, message: 'Công ty không tồn tại.' });
            }

            const companyAdmins = company.employees.filter(employee => employee.roleId === 'companyadmin');
            const staff = company.employees.filter(employee => employee.roleId === 'staff');

            res.json({
                success: true,
                company: {
                    ...company.toObject(),
                    companyAdmins,
                    staff,
                }
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Lỗi khi lấy thông tin công ty.', error: error.message });
        }
    },
    getNotifications: async (req, res) => {
        try {
            const { page = 1, limit = 10, isRead, search } = req.query;
    
            // Kiểm tra và xử lý đầu vào
            const pageNumber = parseInt(page) || 1;
            const limitNumber = parseInt(limit) || 10;
            const filters = {};
    
            // Lọc thông báo dựa trên trạng thái isRead
            if (isRead !== undefined) {
                filters.isRead = isRead === 'true';
            }
    
            // Lọc thông báo dựa trên nội dung
            if (search) {
                filters.content = new RegExp(search, 'i');
            }
    
            // Lấy danh sách thông báo
            const notifications = await Notification.find(filters)
                .sort({ timestamp: -1 })
                .skip((pageNumber - 1) * limitNumber)
                .limit(limitNumber);
    
            // Tổng số thông báo
            const totalNotifications = await Notification.countDocuments(filters);
    
            // Số lượng thông báo chưa đọc (tuỳ chọn)
            const unreadCount = await Notification.countDocuments({ isRead: false });
    
            res.status(200).json({
                success: true,
                message: 'Danh sách thông báo đã được lấy thành công.',
                data: notifications,
                pagination: {
                    currentPage: pageNumber,
                    totalPages: Math.ceil(totalNotifications / limitNumber),
                    totalNotifications,
                    limit: limitNumber,
                },
                unreadCount, // Số thông báo chưa đọc
            });
        } catch (error) {
            console.error('Lỗi khi lấy danh sách thông báo:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách thông báo.',
                error: error.message,
            });
        }
    },
    updateCompany: async (req, res) => {
        try {
            const { companyId } = req.params;
            const { name, address, contactInfo, phoneNumber, email, website } = req.body;

            // Tìm và cập nhật thông tin công ty
            const updatedCompany = await Company.findByIdAndUpdate(companyId, {
                name,
                address,
                contactInfo,
                phoneNumber,
                email,
                website
            }, { new: true });

            if (!updatedCompany) {
                return res.status(404).json({ success: false, message: 'Công ty không tồn tại.' });
            }

            return res.status(200).json({ success: true, message: 'Cập nhật thông tin công ty thành công.', company: updatedCompany });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật công ty.', error: error.message });
        }
    },
    toggleCompanyStatus: async (req, res) => {
        try {
            const { companyId } = req.params;
    
            // Tìm công ty
            const company = await Company.findById(companyId);
            if (!company) {
                return res.status(404).json({ success: false, message: 'Công ty không tồn tại.' });
            }
    
            // Đảo trạng thái của công ty
            company.isActive = !company.isActive;
            await company.save();
    
            // Nếu công ty bị vô hiệu hóa, cập nhật trạng thái của tất cả các user thuộc công ty
            if (!company.isActive) {
                await User.updateMany({ companyId }, { isActive: false });
            } else {
                // Nếu công ty được kích hoạt lại, có thể kích hoạt lại user nếu cần thiết
                await User.updateMany({ companyId }, { isActive: true });
            }
    
            const status = company.isActive ? 'đã được kích hoạt' : 'đã bị vô hiệu hóa';
            return res.status(200).json({ success: true, message: `Công ty ${status}.`, company });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Lỗi khi thay đổi trạng thái công ty.', error: error.message });
        }
    },
     deleteCompany: async (req, res) => {
        try {
            const { companyId } = req.params;
    
            // Kiểm tra công ty có tồn tại không
            const company = await Company.findById(companyId);
            if (!company) {
                return res.status(404).json({ success: false, message: 'Công ty không tồn tại.' });
            }

            await User.deleteMany({ companyId: companyId });
            await company.remove();
    
            return res.status(200).json({ success: true, message: 'Công ty đã được xóa thành công.' });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Lỗi khi xóa công ty.', error: error.message });
        }
    },
    addStaff: async (req, res) => {
        try {
            const { companyId, userName, password, email, phoneNumber } = req.body;
            if (!userName || !password || !email || !phoneNumber) {
                return res.status(400).json({ success: false, message: 'Tên đăng nhập, mật khẩu, email và số điện thoại không được để trống.' });
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ success: false, message: 'Định dạng email không hợp lệ.' });
            }
    
            const company = await Company.findById(companyId);
            if (!company) {
                return res.status(404).json({ success: false, message: 'Công ty không tồn tại.' });
            }
            const [existingUser, existingEmail, existingPhone] = await Promise.all([
                User.findOne({ userName: userName.trim().toLowerCase() }),
                User.findOne({ email }),
                User.findOne({ phoneNumber })
            ]);
    
            if (existingUser || existingEmail || existingPhone) {
                return res.status(400).json({ success: false, message: 'Người dùng với thông tin này đã tồn tại.' });
            }
            const hashedPassword = await argon2.hash(password);
            const newUser = new User({
                userName: userName.trim().toLowerCase(),
                password: hashedPassword,
                email,
                phoneNumber,
                fullName: `Nhân viên ${company.name}`,
                roleId: 'staff',
                companyId: companyId
            });
            await newUser.save();
            company.employees.push({ userId: newUser._id, roleId: 'staff' });
            await company.save();
    
            return res.status(201).json({ success: true, message: 'Nhân viên mới đã được thêm thành công.', user: newUser });
        } catch (error) {
            console.error('Lỗi khi thêm nhân viên:', error);
            return res.status(500).json({ success: false, message: 'Lỗi khi thêm nhân viên cho công ty.', error: error.message });
        }
    }, 
    removeEmployee: async (req, res) => {
        try {
            const { companyId, userId } = req.params;
    
            const company = await Company.findById(companyId);
            if (!company) {
                return res.status(404).json({ success: false, message: 'Công ty không tồn tại.' });
            }
    
            const user = await User.findById(userId);
            if (!user || user.companyId.toString() !== companyId) {
                return res.status(404).json({ success: false, message: 'Người dùng không tồn tại hoặc không thuộc công ty này.' });
            }
            company.employees = company.employees.filter(employee => employee.userId.toString() !== userId);
            await company.save();
            await user.remove();
    
            return res.status(200).json({ success: true, message: 'Nhân viên đã được xóa khỏi công ty.' });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Lỗi khi xóa nhân viên khỏi công ty.', error: error.message });
        }
    },
    
    searchCompanies: async (req, res) => {
        try {
            const { name, email, isActive } = req.query;
    
            const filter = {};
            if (name) filter.name = new RegExp(name, 'i');
            if (email) filter.email = new RegExp(email, 'i');
            if (isActive !== undefined) filter.isActive = isActive === 'true';
    
            const companies = await Company.find(filter);
            return res.status(200).json({ success: true, companies });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Lỗi khi tìm kiếm công ty.', error: error.message });
        }
    },
    createDriver: async (req, res) => {
        try {
            console.log('Dữ liệu nhận được từ frontend:', req.body); 
            const { userName, fullName, password, email, phoneNumber, licenseNumber, baseSalary, salaryRate } = req.body;
            const companyId = req.user.companyId;
    
            if (!userName || !fullName || !password || !email || !phoneNumber || !licenseNumber) {
                return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin tài xế.' });
            }
    
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ success: false, message: 'Định dạng email không hợp lệ.' });
            }
    
            const company = await Company.findById(companyId);
            if (!company) {
                return res.status(404).json({ success: false, message: 'Công ty không tồn tại.' });
            }
    
            const [existingUser, existingEmail, existingPhone] = await Promise.all([
                User.findOne({ userName: userName.trim().toLowerCase() }),
                User.findOne({ email }),
                User.findOne({ phoneNumber }),
            ]);
    
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Tên đăng nhập này đã được sử dụng.' });
            }
            if (existingEmail) {
                return res.status(400).json({ success: false, message: 'Email này đã được sử dụng.' });
            }
            if (existingPhone) {
                return res.status(400).json({ success: false, message: 'Số điện thoại này đã được sử dụng.' });
            }    
            // Mã hóa mật khẩu
            const hashedPassword = await argon2.hash(password);
    
            const newUser = new User({
                userName: userName.trim().toLowerCase(),
                password: hashedPassword,
                email,
                phoneNumber,
                fullName: fullName.trim(),
                roleId: 'driver',
                companyId: companyId
            });
    
            await newUser.save();
    
            const newDriver = new Driver({
                userId: newUser._id,
                companyId: companyId,
                licenseNumber: licenseNumber,
                baseSalary: baseSalary,  
                salaryRate: salaryRate,
                completedTrips: [],
                trips: []
            });
    
            await newDriver.save();
    
            company.employees.push({ userId: newUser._id, roleId: 'driver' });
            await company.save();
    
            const populatedDriver = await Driver.findById(newDriver._id).populate('userId', 'fullName email phoneNumber');
    
            return res.status(201).json({
                success: true,
                message: 'Tài xế mới đã được tạo thành công.',
                driver: populatedDriver
            });
        } catch (error) {
            console.error('Lỗi khi tạo tài xế:', error);
            return res.status(500).json({ success: false, message: 'Lỗi khi tạo tài xế.', error: error.message });
        }
    },
    deleteDriver: async (req, res) => {
        try {
            const { driverId } = req.params;
    
            // Tìm và xóa tài xế trong cơ sở dữ liệu
            const driver = await Driver.findByIdAndDelete(driverId);
            if (!driver) {
                return res.status(404).json({ success: false, message: 'Tài xế không tồn tại.' });
            }
    
            // Cập nhật danh sách nhân viên của công ty
            const company = await Company.findById(driver.companyId);
            if (company) {
                company.employees = company.employees.filter(emp => emp.userId.toString() !== driver.userId.toString());
                await company.save();
            }
    
            // Xóa người dùng liên quan nếu tồn tại
            await User.findByIdAndDelete(driver.userId);
    
            return res.status(200).json({ success: true, message: 'Tài xế đã được xóa thành công.' });
        } catch (error) {
            console.error('Lỗi khi xóa tài xế:', error);
            return res.status(500).json({ success: false, message: 'Lỗi khi xóa tài xế.', error: error.message });
        }
    },
    
    updateDriver: async (req, res) => {
        try {
            const { driverId } = req.params;
            const { fullName, email, phoneNumber, licenseNumber, baseSalary, salaryRate } = req.body;
    
            const driver = await Driver.findById(driverId);
            if (!driver) {
                return res.status(404).json({ success: false, message: 'Tài xế không tồn tại.' });
            }
    
            // Cập nhật thông tin tài xế
            if (licenseNumber) driver.licenseNumber = licenseNumber;
            if (baseSalary) driver.baseSalary = baseSalary;
            if (salaryRate) driver.salaryRate = salaryRate;
    
            await driver.save();
    
            // Cập nhật thông tin người dùng liên quan
            const user = await User.findById(driver.userId);
            if (user) {
                if (fullName) user.fullName = fullName;
                if (email) user.email = email;
                if (phoneNumber) user.phoneNumber = phoneNumber;
                await user.save();
            }
    
            const populatedDriver = await Driver.findById(driverId).populate('userId', 'fullName email phoneNumber');
            
            return res.status(200).json({
                success: true,
                message: 'Thông tin tài xế đã được cập nhật thành công.',
                driver: populatedDriver
            });
        } catch (error) {
            console.error('Lỗi khi cập nhật tài xế:', error);
            return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật tài xế.', error: error.message });
        }
    },        
    getDriversByCompany: async (req, res) => {
        try {
          const companyId  = req.user.companyId;

          const drivers = await Driver.find({ companyId }).populate('userId', 'fullName email phoneNumber');
          
          if (!drivers || drivers.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy tài xế cho công ty này.' });
          }
    
          return res.status(200).json({ success: true, drivers });
        } catch (error) {
          return res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách tài xế.', error: error.message });
        }
     },
    toggleDriverStatus : async (req, res) => {
        try {
            const { userId } = req.params; 
            const companyId = req.user.companyId; 
    
            
            const user = await User.findById(userId);
            if (!user || user.roleId !== 'driver' || !user.companyId.equals(companyId)) {
                return res.status(404).json({ success: false, message: 'Người dùng không tồn tại hoặc không phải là tài xế của công ty này.' });
            }
            const driver = await Driver.findOne({ userId: user._id });
            if (!driver) {
                return res.status(404).json({ success: false, message: 'Tài xế không tồn tại trong bảng Driver.' });
            }
            const newStatus = !user.isActive;
            user.isActive = newStatus;
            driver.isActive = newStatus;

            await user.save();
            await driver.save();
    
            const statusMessage = newStatus ? 'đã được kích hoạt' : 'đã bị vô hiệu hóa';
            return res.status(200).json({
                success: true,
                message: `Tài xế ${statusMessage}.`,
                isActive: newStatus,
            });
        } catch (error) {
            console.error('Error toggling driver status:', error);
            return res.status(500).json({ success: false, message: 'Lỗi khi thay đổi trạng thái tài xế.', error: error.message });
        }
    },           
    calculateAndRecordDriverSalary: async (req, res) => {
        try {
            const { userId, startDate, endDate } = req.body;
    
            // Tìm người dùng với userId được cung cấp
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
            }
    
            // Kiểm tra xem người dùng có phải là tài xế không
            if (user.roleId !== 'driver') {
                return res.status(400).json({ success: false, message: 'Người dùng này không phải là tài xế.' });
            }
    
            // Tìm tài xế dựa trên userId
            const driver = await Driver.findOne({ userId: user._id }).populate('completedTrips');
            if (!driver) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy tài xế.' });
            }
    
            if (typeof driver.salaryRate !== 'number' || isNaN(driver.salaryRate)) {
                return res.status(400).json({ success: false, message: 'Lương mỗi chuyến đi không hợp lệ.' });
            }
            if (typeof driver.baseSalary !== 'number' || isNaN(driver.baseSalary)) {
                return res.status(400).json({ success: false, message: 'Lương cơ bản không hợp lệ.' });
            }
    
            const tripsInPeriod = driver.completedTrips.filter(trip => {
                return trip.departureTime >= new Date(startDate) && trip.departureTime <= new Date(endDate);
            });
            
            const tripEarnings = tripsInPeriod.length * driver.salaryRate; 
            const totalSalary = driver.baseSalary + tripEarnings;
    
            const salaryRecord = new SalaryRecord({
                driverId: driver._id,
                startDate,
                endDate,
                baseSalary: driver.baseSalary,
                tripEarnings,
                totalSalary
            });
            await salaryRecord.save();
    
            const tripIdsToRemove = tripsInPeriod.map(trip => trip._id);
            await Driver.findByIdAndUpdate(driver._id, {
                $pull: { completedTrips: { $in: tripIdsToRemove } }
            });
    
            return res.status(200).json({
                success: true,
                message: 'Tính lương thành công và đã lưu thông tin vào bảng lương.',
                salaryRecord
            });
        } catch (error) {
            console.error('Error calculating salary:', error);
            return res.status(500).json({ success: false, message: 'Lỗi khi tính lương cho tài xế.', error: error.message });
        }
    },    
    getCompletedTripsByMonth: async (req, res) => {
        try {
            const companyId = req.user.companyId; 
            const year = new Date().getFullYear(); 
            const trips = await Trip.aggregate([
                {
                    $match: {
                        companyId: new mongoose.Types.ObjectId(companyId),
                        status: 'Completed', 
                        departureTime: {
                            $gte: new Date(`${year}-01-01`),
                            $lt: new Date(`${year + 1}-01-01`),
                        },
                    },
                },
                {
                    $group: {
                        _id: { $month: "$departureTime" },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { "_id": 1 } }, // Sắp xếp theo tháng
            ]);
    
            // Định dạng lại dữ liệu để gửi về client
            const result = Array(12).fill(0).map((_, index) => {
                const monthData = trips.find((t) => t._id === index + 1);
                return monthData ? monthData.count : 0;
            });
    
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi khi lấy số chuyến đi đã hoàn thành.', error: error.message });
        }
    },
    getRevenueByPaymentMethod : async (req, res) => {
        try {
            const companyId = req.user.companyId; // Get companyId from req.user
    
            if (!companyId) {
                return res.status(400).json({
                    success: false,
                    message: 'Yêu cầu phải có mã công ty hợp lệ.',
                });
            }
    
            const revenueData = await Booking.aggregate([
                {
                    $lookup: {
                        from: 'trips',
                        localField: 'trip',
                        foreignField: '_id',
                        as: 'tripDetails'
                    }
                },
                { $unwind: '$tripDetails' },
                {
                    $match: {
                        'tripDetails.companyId': new mongoose.Types.ObjectId(companyId),
                        paymentStatus: 'Paid'
                    }
                },
                {
                    $group: {
                        _id: "$paymentMethod", // Group by payment method
                        totalRevenue: { $sum: "$totalPrice" } // Sum total price per payment method
                    }
                }
            ]);
    
            // Format the response data
            const formattedData = revenueData.map((d) => ({
                method: d._id,
                revenue: d.totalRevenue
            }));
    
            return res.status(200).json({ success: true, data: formattedData });
        } catch (error) {
            console.error('Lỗi khi lấy doanh thu theo phương thức thanh toán:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi lấy doanh thu theo phương thức thanh toán.' });
        }
    },
     getRevenueByTimeRange : async (req, res) => {
        try {
            const { startDate, endDate, timeFrame } = req.query;
            const companyId = req.user.companyId; // Get companyId directly from req.user
    
            if (!companyId) {
                return res.status(400).json({
                    success: false,
                    message: 'Yêu cầu phải có mã công ty hợp lệ.',
                });
            }
    
            // Define the date format for grouping based on the time frame
            const start = new Date(startDate);
            const end = new Date(endDate);
            const groupFormat = timeFrame === 'year' ? '%Y' : timeFrame === 'month' ? '%Y-%m' : '%Y-%m-%d';
    
            // Aggregate revenue data for the specified company
            const revenueData = await Booking.aggregate([
                {
                    $lookup: {
                        from: 'trips',
                        localField: 'trip',
                        foreignField: '_id',
                        as: 'tripDetails'
                    }
                },
                { $unwind: '$tripDetails' },
                {
                    $match: {
                        'tripDetails.companyId': new mongoose.Types.ObjectId(companyId),
                        paymentStatus: 'Paid',
                        bookingDate: { $gte: start, $lte: end }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: groupFormat, date: "$bookingDate" } },
                        totalRevenue: { $sum: "$totalPrice" }
                    }
                },
                { $sort: { "_id": 1 } }
            ]);
            const formattedData = revenueData.map((d) => ({
                date: d._id,
                revenue: d.totalRevenue
            }));
    
            res.status(200).json({ success: true, data: formattedData });
        } catch (error) {
            console.error('Lỗi khi lấy doanh thu theo khoảng thời gian:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi lấy doanh thu theo khoảng thời gian.', error: error.message });
        }
    },
    exportRevenueToExcel: async (req, res) => {
        try {
            const { startDate, endDate, timeFrame } = req.query;
            const companyId = req.user.companyId;

            if (!companyId) {
                return res.status(400).json({
                    success: false,
                    message: 'Yêu cầu phải có mã công ty hợp lệ.',
                });
            }

            // Định dạng groupFormat dựa vào timeFrame
            const start = new Date(startDate);
            const end = new Date(endDate);
            const groupFormat = timeFrame === 'year' ? '%Y' : '%Y-%m';

            // Truy vấn dữ liệu doanh thu từ database và nhóm theo chuyến đi
            const revenueData = await Booking.aggregate([
                {
                    $lookup: {
                        from: 'trips',
                        localField: 'trip',
                        foreignField: '_id',
                        as: 'tripDetails'
                    }
                },
                { $unwind: '$tripDetails' },
                {
                    $lookup: {
                        from: 'locations',
                        localField: 'tripDetails.departureLocation',
                        foreignField: '_id',
                        as: 'departureLocationDetails'
                    }
                },
                {
                    $lookup: {
                        from: 'locations',
                        localField: 'tripDetails.arrivalLocation',
                        foreignField: '_id',
                        as: 'arrivalLocationDetails'
                    }
                },
                { $unwind: '$departureLocationDetails' },
                { $unwind: '$arrivalLocationDetails' },
                {
                    $match: {
                        'tripDetails.companyId': new mongoose.Types.ObjectId(companyId),
                        paymentStatus: 'Paid',
                        bookingDate: { $gte: start, $lte: end }
                    }
                },
                {
                    $group: {
                        _id: { 
                            time: { $dateToString: { format: groupFormat, date: "$bookingDate" } },
                            tripId: "$tripDetails._id",
                            departureLocation: "$departureLocationDetails.name",  // Chuyển từ ObjectId thành tên địa điểm
                            arrivalLocation: "$arrivalLocationDetails.name",  // Chuyển từ ObjectId thành tên địa điểm
                            departureTime: "$tripDetails.departureTime",
                            basePrice: "$tripDetails.basePrice"
                        },
                        totalRevenue: { $sum: "$totalPrice" }
                    }
                },
                { $sort: { "_id.time": 1 } }
            ]);
            
            console.log("Revenue Data:", revenueData);
            // Chuyển đổi dữ liệu doanh thu thành định dạng JSON cho Excel
            const data = revenueData.map(d => ({
                ThờiGian: d._id.time,
                MaChuyenDi: d._id.tripId.toString(),  // Chuyển tripId thành chuỗi nếu cần
                DiemDi: d._id.departureLocation,      // Tên địa điểm khởi hành
                DiemDen: d._id.arrivalLocation,       // Tên địa điểm đích
                GioKhoiHanh: moment(d._id.departureTime).format('YYYY-MM-DD HH:mm'), // Định dạng thời gian
                GiaCoBan: d._id.basePrice,
                TongDoanhThu: d.totalRevenue
            }));
            
            console.log("Data for Excel:", data);
            // Tạo workbook và worksheet
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'RevenueData');

            // Lưu file Excel tạm thời trên server
            const filePath = path.join(__dirname, `Revenue_${timeFrame}_${startDate}_${endDate}.xlsx`);
            XLSX.writeFile(workbook, filePath);
            console.log("File saved at:", filePath);
            // Gửi file Excel về client
            res.download(filePath, `Revenue_${timeFrame}_${startDate}_${endDate}.xlsx`, (err) => {
                if (err) {
                    console.error("Error downloading file: ", err);
                    res.status(500).json({ success: false, message: "Lỗi khi tải xuống file" });
                }
                // Xóa file sau khi tải về
                fs.unlinkSync(filePath);
                
            });
        } catch (error) {
            console.error('Lỗi khi xuất dữ liệu doanh thu ra Excel:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi xuất dữ liệu doanh thu ra Excel.', error: error.message });
        }
    },

    getTopBookingUsers: async (req, res) => {
        try {
            const companyId = req.user.companyId;
    
            if (!companyId) {
                return res.status(400).json({
                    success: false,
                    message: 'Yêu cầu phải có mã công ty hợp lệ.',
                });
            }
            const topUsers = await Booking.aggregate([
                {
                    $lookup: {
                        from: 'trips',
                        localField: 'trip',
                        foreignField: '_id',
                        as: 'tripDetails'
                    }
                },
                { $unwind: '$tripDetails' },
                {
                    $match: {
                        'tripDetails.companyId': new mongoose.Types.ObjectId(companyId),
                        paymentStatus: 'Paid' 
                    }
                },
                {
                    $group: {
                        _id: '$user',
                        totalBookings: { $sum: 1 },
                        totalRevenue: { $sum: '$totalPrice' }
                    }
                },
                { $sort: { totalRevenue: -1 } }, // Sắp xếp theo tổng doanh thu
                { $limit: 10 }
            ]);
            const populatedTopUsers = await User.populate(topUsers, {
                path: '_id',
                select: 'fullName email phoneNumber'
            });
    
            return res.status(200).json({
                success: true,
                message: 'Top 10 người đặt vé nhiều nhất theo doanh thu đã được lấy thành công.',
                data: populatedTopUsers
            });
        } catch (error) {
            console.error('Lỗi khi lấy top người đặt vé:', error);
            return res.status(500).json({ success: false, message: 'Lỗi khi lấy top người đặt vé.', error: error.message });
        }
    },
    getTopBookingUsersByTimeFrame: async (req, res) => {
        try {
            const companyId = req.user.companyId;
    
            if (!companyId) {
                return res.status(400).json({
                    success: false,
                    message: 'Yêu cầu phải có mã công ty hợp lệ.',
                });
            }
    
            const { year, timeFrame } = req.query;
            const selectedYear = year || new Date().getFullYear();
            
            // Định dạng nhóm theo thời gian dựa trên `timeFrame`
            const groupFormat = timeFrame === 'year' ? { year: { $year: "$bookingDate" } } :
                                timeFrame === 'month' ? { year: { $year: "$bookingDate" }, month: { $month: "$bookingDate" } } :
                                null;
    
            if (!groupFormat) {
                return res.status(400).json({ success: false, message: 'timeFrame không hợp lệ. Chọn "month" hoặc "year".' });
            }
    
            const matchConditions = {
                'tripDetails.companyId': new mongoose.Types.ObjectId(companyId),
                paymentStatus: 'Paid',
                bookingDate: {
                    $gte: new Date(`${selectedYear}-01-01`),
                    $lt: new Date(`${selectedYear + 1}-01-01`)
                }
            };
    
            const topUsers = await Booking.aggregate([
                {
                    $lookup: {
                        from: 'trips',
                        localField: 'trip',
                        foreignField: '_id',
                        as: 'tripDetails'
                    }
                },
                { $unwind: '$tripDetails' },
                { $match: matchConditions },
                {
                    $group: {
                        _id: { ...groupFormat, user: "$user" },
                        totalBookings: { $sum: 1 },
                        totalRevenue: { $sum: "$totalPrice" }
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1, totalBookings: -1 } }, // Sắp xếp theo thời gian và số vé đặt
                {
                    $group: {
                        _id: timeFrame === 'year' ? "$_id.year" : { year: "$_id.year", month: "$_id.month" },
                        topUsers: { $push: { user: "$_id.user", totalBookings: "$totalBookings", totalRevenue: "$totalRevenue" } }
                    }
                },
                { $project: { topUsers: { $slice: ["$topUsers", 10] } } } // Lấy top 10 người dùng cho mỗi nhóm thời gian
            ]);
    
            const populatedTopUsers = await Promise.all(
                topUsers.map(async (timeData) => {
                    const users = await User.populate(timeData.topUsers, {
                        path: "user",
                        select: "fullName email phoneNumber"
                    });
                    return { time: timeData._id, topUsers: users };
                })
            );
    
            const message = timeFrame === 'year'
                ? `Top 10 người đặt vé nhiều nhất theo từng năm đã được lấy thành công.`
                : `Top 10 người đặt vé nhiều nhất theo từng tháng của năm ${selectedYear} đã được lấy thành công.`;
    
            return res.status(200).json({
                success: true,
                message,
                data: populatedTopUsers
            });
        } catch (error) {
            console.error('Lỗi khi lấy top người đặt vé theo thời gian:', error);
            return res.status(500).json({ success: false, message: 'Lỗi khi lấy top người đặt vé theo thời gian.', error: error.message });
        }
    },  
    getBookingStatsAndUsers: async (req, res) => {
        try {
            const companyId = req.user.companyId;
    
            if (!companyId) {
                return res.status(400).json({
                    success: false,
                    message: 'Yêu cầu phải có mã công ty hợp lệ.',
                });
            }
    
            // Tính toán thời gian
            const today = new Date();
            const currentMonth = today.getMonth() + 1;
            const currentYear = today.getFullYear();
            const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
            const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    
            // Aggregation để gom nhóm theo tháng và năm
            const bookingStats = await Booking.aggregate([
                {
                    $lookup: {
                        from: 'trips',
                        localField: 'trip',
                        foreignField: '_id',
                        as: 'tripDetails',
                    },
                },
                { $unwind: '$tripDetails' },
                {
                    $match: {
                        'tripDetails.companyId': new mongoose.Types.ObjectId(companyId),
                    },
                },
                {
                    $addFields: {
                        month: { $month: '$bookingDate' },
                        year: { $year: '$bookingDate' },
                    },
                },
                {
                    $group: {
                        _id: { year: '$year', month: '$month' },
                        totalBookings: { $sum: 1 },
                    },
                },
                {
                    $addFields: {
                        isCurrentMonth: {
                            $and: [
                                { $eq: ['$_id.month', currentMonth] },
                                { $eq: ['$_id.year', currentYear] },
                            ],
                        },
                        isLastMonth: {
                            $and: [
                                { $eq: ['$_id.month', lastMonth] },
                                { $eq: ['$_id.year', lastMonthYear] },
                            ],
                        },
                    },
                },
            ]);
    
            // Lọc ra số liệu cho tháng hiện tại và tháng trước
            const currentMonthData = bookingStats.find((item) => item.isCurrentMonth) || { totalBookings: 0 };
            const lastMonthData = bookingStats.find((item) => item.isLastMonth) || { totalBookings: 0 };

            const userBookings = await Booking.aggregate([
                // Kết hợp với bảng trips
                {
                    $lookup: {
                        from: "trips",
                        localField: "trip",
                        foreignField: "_id",
                        as: "tripDetails",
                    },
                },
                { $unwind: "$tripDetails" },
            
                // Lọc theo companyId
                {
                    $match: {
                        "tripDetails.companyId": new mongoose.Types.ObjectId(companyId),
                    },
                },
            
                // Kết hợp với bảng users
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "userDetails",
                    },
                },
                { $unwind: "$userDetails" },
            
                // Thêm trường `isToday` để đánh dấu các bản ghi ngày hiện tại
                {
                    $addFields: {
                        isToday: {
                            $eq: [
                                {
                                    $dateToString: { format: "%Y-%m-%d", date: "$bookingDate" },
                                },
                                {
                                    $dateToString: { format: "%Y-%m-%d", date: new Date() }, // So sánh với ngày hiện tại
                                },
                            ],
                        },
                    },
                },
            
                // Lựa chọn trường cần thiết
                {
                    $project: {
                        _id: 1,
                        "userDetails.fullName": 1,
                        "userDetails.phoneNumber": 1,
                        bookingDate: 1,
                        status: 1,
                        totalPrice: 1,
                        isToday: 1, // Giữ trường isToday để sắp xếp
                    },
                },
            
                // Sắp xếp ưu tiên ngày hiện tại (29) trước, sau đó theo bookingDate
                {
                    $sort: {
                        isToday: -1, // Ưu tiên ngày hiện tại trước (29)
                        bookingDate: -1, // Sau đó sắp xếp theo ngày đặt vé giảm dần
                    },
                },
            ]);
            return res.status(200).json({
                success: true,
                message: 'Thống kê đặt vé và danh sách người dùng đã được lấy thành công.',
                data: {
                    bookingStats: {
                        currentMonth: {
                            month: currentMonth,
                            year: currentYear,
                            totalBookings: currentMonthData.totalBookings,
                        },
                        lastMonth: {
                            month: lastMonth,
                            year: lastMonthYear,
                            totalBookings: lastMonthData.totalBookings,
                        },
                        allGroupedBookings: bookingStats, // Gom nhóm theo tháng
                    },
                    userBookings: userBookings, // Danh sách người dùng và vé đã đặt
                },
            });
        } catch (error) {
            console.error('Lỗi khi lấy thống kê và danh sách đặt vé:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy thống kê và danh sách đặt vé.',
                error: error.message,
            });
        }
    },       
};

module.exports = companyController;
