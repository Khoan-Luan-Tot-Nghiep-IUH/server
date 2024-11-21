const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateAccessToken = (user) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            user,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            }
        );
    });
};

const authMiddleware = {
    verifyToken: async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ success: false, message: 'Không tìm thấy token xác thực' });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc người dùng không tồn tại' });
            }
            if (user.currentToken !== token) {
                return res.status(401).json({
                    success: false,
                    message: 'Phiên của bạn đã bị vô hiệu hóa. Vui lòng đăng nhập lại.'
                });
            }
    
            // Kiểm tra nếu tài khoản bị vô hiệu hóa
            if (!user.isActive) {
                return res.status(403).json({ success: false, message: 'Tài khoản của bạn đã bị vô hiệu hóa.' });
            }
    
            req.user = user;
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ success: false, message: 'Token đã hết hạn.' });
            }
            return res.status(401).json({ success: false, message: 'Token không hợp lệ', error: error.message });
        }
    },
    isSuperAdmin: (req, res, next) => {
        if (req.user && req.user.roleId === 'superadmin') {
            next();
        } else {
            res.status(403).json({ success: false, message: 'Yêu cầu quyền Super Admin.' });
        }
    },

    isCompanyAdmin: (req, res, next) => {
        if (req.user.roleId === 'superadmin') {
            return next(); // Cho phép superadmin tiếp tục
        }
        if (req.user && req.user.roleId === 'companyadmin') {
            next();
        } else {
            res.status(403).json({ success: false, message: 'Yêu cầu quyền Admin nhà xe.' });
        }
    },

    isStaffOrAdmin: (req, res, next) => {
        if (req.user && (req.user.roleId === 'companyadmin' || req.user.roleId === 'staff')) {
            next();
        } else {
            res.status(403).json({ success: false, message: 'Yêu cầu quyền Staff hoặc Admin nhà xe.' });
        }
    },
    
    isSuperAdminOrStaffOrAdmin: (req, res, next) => {
        if (req.user && (req.user.roleId === 'superadmin' || req.user.roleId === 'companyadmin' || req.user.roleId === 'staff')) {
            next();
        } else {
            res.status(403).json({ success: false, message: 'Yêu cầu quyền Superadmin, Admin hoặc Staff.' });
        }
    },
    checkCompanyAccess: (req, res, next) => {


        const userCompanyId = req.user && req.user.companyId ? req.user.companyId.toString() : null;
        const requestedCompanyId = req.params.companyId || req.body.companyId || req.query.companyId;
        
        if (req.user.roleId === 'superadmin') {
            return next();
        }
        if (!requestedCompanyId) {
            return next();
        }
        if (userCompanyId !== requestedCompanyId) {
            return res.status(403).json({
                success: false,
                message: `Bạn không có quyền truy cập vào dữ liệu của công ty này (ID: ${requestedCompanyId})!`
            });
        }
    
        next();
    },
    isUser: (req, res, next) => {
        if (req.user && req.user.roleId === 'user') {
            next();
        } else {
            res.status(403).json({ success: false, message: 'Yêu cầu quyền người dùng.' });
        }
    },
    isActiveUser: (req, res, next) => {
        if (req.user && req.user.isActive) {
            next();
        } else {
            res.status(403).json({ success: false, message: 'Tài khoản của bạn đã bị vô hiệu hóa.' });
        }
    },
    isDriver: (req, res, next) => {
        if (req.user && req.user.roleId === 'driver') {
            next();
        } else {
            res.status(403).json({ success: false, message: 'Yêu cầu quyền tài xế.' });
        }
    },
    generateAccessToken
};

module.exports = authMiddleware;
