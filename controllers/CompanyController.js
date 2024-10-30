const argon2 = require('argon2');
const Company = require('../models/Company');
const User = require('../models/User');
const Driver = require('../models/Driver');
const SalaryRecord = require('../models/SalaryRecord');

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
                Driver.findOne({ licenseNumber })
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
    calculateAndRecordDriverSalary : async (req, res) => {
        try {
            const { driverId, startDate, endDate } = req.body;
    
            // Tìm tài xế và lấy danh sách các chuyến đi đã hoàn thành trong `completedTrips`
            const driver = await Driver.findById(driverId).populate('completedTrips');
            if (!driver) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy tài xế.' });
            }
    
            // Kiểm tra nếu `salaryRate` và `baseSalary` có giá trị hợp lệ
            if (typeof driver.salaryRate !== 'number' || isNaN(driver.salaryRate)) {
                return res.status(400).json({ success: false, message: 'Lương mỗi chuyến đi không hợp lệ.' });
            }
            if (typeof driver.baseSalary !== 'number' || isNaN(driver.baseSalary)) {
                return res.status(400).json({ success: false, message: 'Lương cơ bản không hợp lệ.' });
            }
    
            // Lọc các chuyến đi hoàn thành trong khoảng thời gian kỳ lương
            const tripsInPeriod = driver.completedTrips.filter(trip => {
                return trip.departureTime >= new Date(startDate) && trip.departureTime <= new Date(endDate);
            });
    
            const tripEarnings = tripsInPeriod.length * driver.salaryRate; // Thu nhập từ số chuyến đi
            const totalSalary = driver.baseSalary + tripEarnings;
    
            // Tạo một bản ghi lương trong bảng `SalaryRecord`
            const salaryRecord = new SalaryRecord({
                driverId: driver._id,
                startDate,
                endDate,
                baseSalary: driver.baseSalary,
                tripEarnings,
                totalSalary
            });
            await salaryRecord.save();
    
            // Xóa các chuyến đi đã được tính lương khỏi `completedTrips` để tránh tính lại
            const tripIdsToRemove = tripsInPeriod.map(trip => trip._id);
            await Driver.findByIdAndUpdate(driverId, {
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
};

module.exports = companyController;
