const Company = require('../models/Company');
const User = require('../models/User');

const companyController = {
    // Tạo công ty mới (chỉ superadmin mới có thể thực hiện)
    createCompany: async (req, res) => {
        try {
            const { name, address, contactInfo } = req.body;

            // Kiểm tra xem công ty đã tồn tại chưa
            const existingCompany = await Company.findOne({ name });
            if (existingCompany) {
                return res.status(400).json({ success: false, message: 'Công ty đã tồn tại.' });
            }

            // Tạo công ty mới
            const newCompany = new Company({
                name,
                address,
                contactInfo
            });

            await newCompany.save();

            return res.status(201).json({ success: true, message: 'Công ty đã được tạo thành công.', company: newCompany });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Lỗi khi tạo công ty.', error: error.message });
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
          const company = await Company.findById(req.params.companyId).populate('employees', '-password');
      
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
          res.status(500).json({ success: false, message: 'Lỗi khi lấy thông tin công ty.', error: error.message });
        }
      },
    updateCompany: async (req, res) => {
        try {
            const { companyId } = req.params;
            const { name, address, contactInfo } = req.body;

            // Tìm và cập nhật thông tin công ty
            const updatedCompany = await Company.findByIdAndUpdate(companyId, {
                name,
                address,
                contactInfo
            }, { new: true });

            if (!updatedCompany) {
                return res.status(404).json({ success: false, message: 'Công ty không tồn tại.' });
            }

            return res.status(200).json({ success: true, message: 'Cập nhật thông tin công ty thành công.', company: updatedCompany });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật công ty.', error: error.message });
        }
    },

    // Vô hiệu hóa hoặc kích hoạt công ty (chỉ superadmin)
    toggleCompanyStatus: async (req, res) => {
        try {
            const { companyId } = req.params;

            // Tìm công ty
            const company = await Company.findById(companyId);
            if (!company) {
                return res.status(404).json({ success: false, message: 'Công ty không tồn tại.' });
            }

            // Đổi trạng thái hoạt động của công ty
            company.isActive = !company.isActive;
            await company.save();

            const status = company.isActive ? 'đã được kích hoạt' : 'đã bị vô hiệu hóa';
            return res.status(200).json({ success: true, message: `Công ty ${status}.`, company });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Lỗi khi thay đổi trạng thái công ty.', error: error.message });
        }
    }
};

module.exports = companyController;
