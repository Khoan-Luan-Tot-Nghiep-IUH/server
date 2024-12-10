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

const Expense = require('../models/Expense'); 

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
            const { userId, startDate, endDate, bonuses = 0, deductions = 0 } = req.body;
    
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
            const totalSalary = driver.baseSalary + tripEarnings + bonuses - deductions;
    
            // Lưu thông tin lương vào bảng SalaryRecord
            const salaryRecord = new SalaryRecord({
                driverId: driver._id,
                startDate,
                endDate,
                baseSalary: driver.baseSalary,
                tripEarnings,
                bonuses,
                deductions,
                totalSalary // Tính tổng lương bao gồm thưởng và khấu trừ
            });
            await salaryRecord.save();
    
            // Xóa các chuyến đi đã tính lương ra khỏi danh sách completedTrips của tài xế
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
    
            // Tính toán thời gian cho tháng hiện tại và tháng trước
            const today = new Date();
            const currentMonth = today.getMonth() + 1;
            const currentYear = today.getFullYear();
            const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
            const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    
            // Tạo khoảng thời gian với UTC
            const startOfLastMonth = new Date(Date.UTC(lastMonthYear, lastMonth - 1, 1));
            const endOfCurrentMonth = new Date(Date.UTC(currentYear, currentMonth, 0, 23, 59, 59));
    
            // Aggregation để lấy thống kê booking
            const bookingStats = await Booking.aggregate([
                {
                    $addFields: {
                        // Chuyển đổi bookingDate từ chuỗi sang Date nếu cần
                        bookingDate: {
                            $cond: {
                                if: { $eq: [{ $type: "$bookingDate" }, "string"] },
                                then: { $dateFromString: { dateString: "$bookingDate" } },
                                else: "$bookingDate"
                            }
                        }
                    }
                },
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
                        bookingDate: {
                            $gte: startOfLastMonth,
                            $lte: endOfCurrentMonth,
                        },
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
                { $sort: { '_id.year': 1, '_id.month': 1 } },
            ]);
    
            const currentMonthData =
                bookingStats.find(
                    (item) =>
                        item._id.year === currentYear && item._id.month === currentMonth
                ) || { totalBookings: 0 };
    
            const lastMonthData =
                bookingStats.find(
                    (item) =>
                        item._id.year === lastMonthYear && item._id.month === lastMonth
                ) || { totalBookings: 0 };
    
            // Query danh sách booking
            const userBookings = await Booking.aggregate([
                {
                    $addFields: {
                        // Chuyển đổi bookingDate từ chuỗi sang Date nếu cần
                        bookingDate: {
                            $cond: {
                                if: { $eq: [{ $type: "$bookingDate" }, "string"] },
                                then: { $dateFromString: { dateString: "$bookingDate" } },
                                else: "$bookingDate"
                            }
                        }
                    }
                },
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
                        bookingDate: {
                            $gte: startOfLastMonth,
                            $lte: endOfCurrentMonth,
                        },
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'userDetails',
                    },
                },
                { $unwind: '$userDetails' },
                {
                    $addFields: {
                        isToday: {
                            $eq: [
                                { $dateToString: { format: '%Y-%m-%d', date: '$bookingDate' } },
                                { $dateToString: { format: '%Y-%m-%d', date: new Date() } },
                            ],
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        'userDetails.fullName': 1,
                        'userDetails.phoneNumber': 1,
                        bookingDate: 1,
                        paymentStatus:1,
                        status: 1,
                        totalPrice: 1,
                        isToday: 1,
                        paymentMethod:1,
                    },
                },
                {
                    $sort: {
                        isToday: -1,
                        bookingDate: -1,
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
                    },
                    userBookings,
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

    getRevenueComparison: async (req, res) => {
        try {
            const companyId = req.user.companyId;
    
            if (!companyId) {
                return res.status(400).json({
                    success: false,
                    message: 'Yêu cầu phải có mã công ty hợp lệ.',
                });
            }
    
            // Tính toán thời gian cho tháng hiện tại, tháng trước và tháng trước nữa
            const today = new Date();
            const currentMonth = today.getMonth() + 1;
            const currentYear = today.getFullYear();
            const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
            const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
            const twoMonthsAgo = lastMonth === 1 ? 12 : lastMonth - 1;
            const twoMonthsAgoYear = lastMonth === 1 ? lastMonthYear - 1 : lastMonthYear;
    
            const startOfCurrentMonth = new Date(Date.UTC(currentYear, currentMonth - 1, 1));
            const endOfCurrentMonth = new Date(Date.UTC(currentYear, currentMonth, 0, 23, 59, 59));
    
            const startOfLastMonth = new Date(Date.UTC(lastMonthYear, lastMonth - 1, 1));
            const endOfLastMonth = new Date(Date.UTC(lastMonthYear, lastMonth, 0, 23, 59, 59));
    
            const startOfTwoMonthsAgo = new Date(Date.UTC(twoMonthsAgoYear, twoMonthsAgo - 1, 1));
            const endOfTwoMonthsAgo = new Date(Date.UTC(twoMonthsAgoYear, twoMonthsAgo, 0, 23, 59, 59));
    
            // Aggregation để tính doanh thu theo tháng
            const revenueStats = await Booking.aggregate([
                {
                    $addFields: {
                        bookingDate: {
                            $cond: {
                                if: { $eq: [{ $type: "$bookingDate" }, "string"] },
                                then: { $dateFromString: { dateString: "$bookingDate" } },
                                else: "$bookingDate",
                            },
                        },
                    },
                },
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
                        paymentStatus: 'Paid', // Chỉ tính doanh thu đã thanh toán
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
                        totalRevenue: { $sum: '$totalPrice' },
                    },
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } },
            ]);
    
            // Lấy doanh thu cho từng tháng
            const lastMonthData =
            revenueStats.find(
                (item) =>
                    item._id.year === lastMonthYear && item._id.month === lastMonth
            ) || { totalRevenue: 0 };
        
        const currentMonthData =
            revenueStats.find(
                (item) =>
                    item._id.year === currentYear && item._id.month === currentMonth
            ) || { totalRevenue: 0 };
    
            const twoMonthsAgoData =
                revenueStats.find(
                    (item) =>
                        item._id.year === twoMonthsAgoYear && item._id.month === twoMonthsAgo
                ) || { totalRevenue: 0 };
    
                const revenueChange = lastMonthData.totalRevenue
                ? ((currentMonthData.totalRevenue - lastMonthData.totalRevenue) /
                      lastMonthData.totalRevenue) *
                  100
                : 0;
            
    
            // Trả về kết quả
            return res.status(200).json({
                success: true,
                message: 'Thống kê doanh thu so sánh đã được tính toán thành công.',
                data: {
                    currentMonth: currentMonthData.totalRevenue,
                    previousMonth: lastMonthData.totalRevenue,
                    twoMonthsAgo: twoMonthsAgoData.totalRevenue,
                    revenueChange: revenueChange.toFixed(2), // Làm tròn 2 chữ số thập phân
                },
            });
        } catch (error) {
            console.error('Lỗi khi lấy thống kê doanh thu:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy thống kê doanh thu.',
                error: error.message,
            });
        }
    },
    getCancelledBookingsStats : async (req, res) => {
        try {
            const companyId = req.user.companyId;
    
            if (!companyId) {
                return res.status(400).json({
                    success: false,
                    message: "Yêu cầu phải có mã công ty hợp lệ.",
                });
            }
    
            // Tính thời gian cho tháng hiện tại và tháng trước
            const today = new Date();
            const currentMonth = today.getMonth() + 1;
            const currentYear = today.getFullYear();
            const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
            const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    
            const startOfCurrentMonth = new Date(Date.UTC(currentYear, currentMonth - 1, 1));
            const endOfCurrentMonth = new Date(Date.UTC(currentYear, currentMonth, 0, 23, 59, 59));
    
            const startOfLastMonth = new Date(Date.UTC(lastMonthYear, lastMonth - 1, 1));
            const endOfLastMonth = new Date(Date.UTC(lastMonthYear, lastMonth, 0, 23, 59, 59));
    
            // Aggregation để tính số lượt hủy
            const cancelledStats = await Booking.aggregate([
                {
                    $addFields: {
                        bookingDate: {
                            $cond: {
                                if: { $eq: [{ $type: "$bookingDate" }, "string"] },
                                then: { $dateFromString: { dateString: "$bookingDate" } },
                                else: "$bookingDate",
                            },
                        },
                    },
                },
                {
                    $lookup: {
                        from: "trips",
                        localField: "trip",
                        foreignField: "_id",
                        as: "tripDetails",
                    },
                },
                { $unwind: "$tripDetails" },
                {
                    $match: {
                        "tripDetails.companyId": new mongoose.Types.ObjectId(companyId),
                        status: "Cancelled", // Chỉ đếm những booking bị hủy
                    },
                },
                {
                    $facet: {
                        currentMonth: [
                            {
                                $match: {
                                    bookingDate: {
                                        $gte: startOfCurrentMonth,
                                        $lte: endOfCurrentMonth,
                                    },
                                },
                            },
                            { $count: "count" },
                        ],
                        lastMonth: [
                            {
                                $match: {
                                    bookingDate: {
                                        $gte: startOfLastMonth,
                                        $lte: endOfLastMonth,
                                    },
                                },
                            },
                            { $count: "count" },
                        ],
                    },
                },
            ]);
    
            const currentMonthCount =
                cancelledStats[0]?.currentMonth[0]?.count || 0;
            const lastMonthCount =
                cancelledStats[0]?.lastMonth[0]?.count || 0;
    
            return res.status(200).json({
                success: true,
                message: "Thống kê số lượt hủy vé đã được tính toán thành công.",
                data: {
                    currentMonth: currentMonthCount,
                    lastMonth: lastMonthCount,
                },
            });
        } catch (error) {
            console.error("Lỗi khi lấy thống kê số lượt hủy vé:", error);
            return res.status(500).json({
                success: false,
                message: "Lỗi khi lấy thống kê số lượt hủy vé.",
                error: error.message,
            });
        }
    },    
    getCompanyExpenseComparison : async (req, res) => {
        try {
            const companyId = req.user.companyId;
    
            if (!companyId) {
                return res.status(400).json({
                    success: false,
                    message: 'Công ty không tồn tại hoặc không hợp lệ.',
                });
            }
    
            // Lấy ngày hiện tại và tính toán thời gian đầu tháng
            const today = new Date();
            const currentMonth = today.getMonth(); // Tháng hiện tại (0-11)
            const currentYear = today.getFullYear(); // Năm hiện tại
    
            // Tính thời gian đầu tháng trước
            const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Nếu tháng hiện tại là 0 (tháng 1), thì tháng trước là 11 (tháng 12)
            const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
            // Tạo khoảng thời gian cần so sánh
            const startOfCurrentMonth = new Date(Date.UTC(currentYear, currentMonth, 1)); // Đầu tháng hiện tại
            const startOfLastMonth = new Date(Date.UTC(lastMonthYear, lastMonth, 1)); // Đầu tháng trước
            const endOfLastMonth = new Date(Date.UTC(currentYear, currentMonth, 0, 23, 59, 59)); // Cuối tháng trước
    
            // Aggregation để tính tổng chi phí tháng này
            const currentMonthExpenses = await Expense.aggregate([
                {
                    $lookup: {
                        from: 'drivers',
                        localField: 'driverId',
                        foreignField: '_id',
                        as: 'driverDetails',
                    },
                },
                {
                    $match: {
                        'driverDetails.companyId': new mongoose.Types.ObjectId(companyId),
                        createdAt: { $gte: startOfCurrentMonth },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalExpenses: { $sum: '$amount' },
                    },
                },
            ]);
    
            // Aggregation để tính tổng chi phí tháng trước
            const lastMonthExpenses = await Expense.aggregate([
                {
                    $lookup: {
                        from: 'drivers',
                        localField: 'driverId',
                        foreignField: '_id',
                        as: 'driverDetails',
                    },
                },
                {
                    $match: {
                        'driverDetails.companyId': new mongoose.Types.ObjectId(companyId),
                        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalExpenses: { $sum: '$amount' },
                    },
                },
            ]);
    
            // Tính toán kết quả
            const totalCurrentMonth = currentMonthExpenses[0]?.totalExpenses || 0;
            const totalLastMonth = lastMonthExpenses[0]?.totalExpenses || 0;
    
            const expenseChange = totalLastMonth
                ? ((totalCurrentMonth - totalLastMonth) / totalLastMonth) * 100
                : totalCurrentMonth > 0
                ? 100
                : 0;
    
            res.status(200).json({
                success: true,
                data: {
                    currentMonth: totalCurrentMonth,
                    lastMonth: totalLastMonth,
                    expenseChange: expenseChange.toFixed(2), // Trả về phần trăm thay đổi
                },
            });
        } catch (error) {
            console.error('Lỗi khi lấy thống kê chi phí:', error);
            res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi lấy thống kê chi phí.',
                error: error.message,
            });
        }
    },
    getTripPassengers : async (req, res) => {
        try {
            const { tripId } = req.params;
            const companyId = req.user.companyId; // Lấy companyId từ req.user
    
            if (!mongoose.Types.ObjectId.isValid(tripId)) {
                return res.status(400).json({ success: false, message: 'tripId không hợp lệ.' });
            }
    
            // Tìm chuyến đi thuộc công ty
            const trip = await Trip.findOne({ _id: tripId, companyId });
            if (!trip) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy chuyến đi này.' });
            }
    
            // Lấy danh sách hành khách từ bảng Booking
            const passengers = await Booking.aggregate([
                {
                    $match: {
                        trip: new mongoose.Types.ObjectId(tripId),
                        status: { $ne: 'Cancelled' }, // Loại bỏ các booking đã hủy
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'userDetails',
                    },
                },
                { $unwind: '$userDetails' },
                {
                    $project: {
                        _id: 1,
                        seatNumbers: 1,
                        totalPrice: 1,
                        paymentStatus: 1,
                        bookingDate: 1,
                        'userDetails.fullName': 1,
                        'userDetails.phoneNumber': 1,
                    },
                },
            ]);
    
            // Tính tổng số phải thu và đã thu rồi
            const totalDue = passengers.reduce((sum, p) => sum + p.totalPrice, 0); // Tổng số tiền của tất cả bookings
            const totalPaid = passengers.reduce(
                (sum, p) => (p.paymentStatus === 'Paid' ? sum + p.totalPrice : sum),
                0
            ); // Tổng số tiền đã thanh toán
    
            return res.status(200).json({
                success: true,
                message: 'Danh sách hành khách đã được lấy thành công.',
                data: {
                    tripId: trip._id,
                    tripName: trip.name,
                    departureTime: trip.departureTime,
                    passengers,
                    totalDue, // Tổng số phải thu
                    totalPaid, // Tổng số đã thu
                    totalUnpaid: totalDue - totalPaid, // Số tiền chưa thu
                },
            });
        } catch (error) {
            console.error('Lỗi khi lấy danh sách hành khách:', error);
            return res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi lấy danh sách hành khách.',
                error: error.message,
            });
        }
    }, 
    collectPayment : async (req, res) => {
        try {
            const { bookingId } = req.params;
    
            // Find the booking by ID
            const booking = await Booking.findById(bookingId);
    
            if (!booking) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy thông tin đặt vé.',
                });
            }
    
            // Check if the payment is already completed
            if (booking.paymentStatus === 'Paid') {
                return res.status(400).json({
                    success: false,
                    message: 'Đặt vé này đã được thanh toán.',
                });
            }
    
            // Update the payment status
            booking.paymentStatus = 'Paid';
            await booking.save();
    
            return res.status(200).json({
                success: true,
                message: 'Thanh toán đã được thực hiện thành công.',
                booking,
            });
        } catch (error) {
            console.error('Lỗi khi thu tiền:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi thu tiền.',
                error: error.message,
            });
        }
    }, 
    getMostBookedRoutes : async (req, res) => {
        try {
            const companyId = req.user.companyId; // Lấy companyId từ người dùng đăng nhập
    
            const rankedRoutes = await Booking.aggregate([
                // Ghép bảng Trip để lấy thông tin chuyến đi
                {
                    $lookup: {
                        from: "trips",
                        localField: "trip",
                        foreignField: "_id",
                        as: "tripDetails",
                    },
                },
                { $unwind: "$tripDetails" },
    
                // Lọc dữ liệu liên quan đến công ty và loại bỏ booking đã hủy
                {
                    $match: {
                        "tripDetails.companyId": new mongoose.Types.ObjectId(companyId),
                        status: { $ne: "Cancelled" }, // Loại bỏ booking đã hủy
                    },
                },
    
                // Nhóm dữ liệu theo tuyến đường
                {
                    $group: {
                        _id: {
                            route: {
                                departure: "$tripDetails.departureLocation",
                                arrival: "$tripDetails.arrivalLocation",
                            },
                        },
                        totalBookings: { $sum: 1 }, // Tổng số lượt đặt vé
                        totalSeatsBooked: { $sum: { $size: "$seatNumbers" } }, // Tổng số ghế đã đặt
                    },
                },
    
                // Sắp xếp theo số lượng ghế đặt giảm dần
                {
                    $sort: { totalSeatsBooked: -1 },
                },
    
                // Ghép thêm thông tin địa điểm
                {
                    $lookup: {
                        from: "locations",
                        localField: "_id.route.departure",
                        foreignField: "_id",
                        as: "departureDetails",
                    },
                },
                {
                    $lookup: {
                        from: "locations",
                        localField: "_id.route.arrival",
                        foreignField: "_id",
                        as: "arrivalDetails",
                    },
                },
    
                // Định dạng kết quả
                {
                    $project: {
                        route: {
                            departure: { $arrayElemAt: ["$departureDetails.name", 0] },
                            arrival: { $arrayElemAt: ["$arrivalDetails.name", 0] },
                        },
                        totalBookings: 1,
                        totalSeatsBooked: 1,
                    },
                },
            ]);
    
            // Trả về kết quả
            res.status(200).json({
                success: true,
                message: "Xếp hạng các tuyến đường theo số lượng vé đặt.",
                data: rankedRoutes,
            });
        } catch (error) {
            console.error("Lỗi khi thống kê tuyến đường:", error);
            res.status(500).json({
                success: false,
                message: "Lỗi khi thống kê tuyến đường theo số lượng vé đặt.",
                error: error.message,
            });
        }
    },
};  

module.exports = companyController;
