const User = require('../models/User');
const argon2 = require('argon2');
const {generateAccessToken } = require('../middleware/authMiddleware');
const crypto = require('crypto');
const { sendOrderConfirmationEmail, sendVerificationEmail, verifyCodeEmail } = require('../config/mailer');
const moment = require('moment-timezone');
const { validationResult } = require('express-validator');
const {sendVerificationCode, verifyCode } = require('../config/twilioConfig');
const TempUser = require('../models/TempUser');
const Voucher = require('../models/Voucher'); 
const SystemSetting = require('../models/SystemSetting'); 
const generateVoucherCode = () => {
    return 'VOUCHER-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};
const createVoucher = async (userId, discount) => {
    const code = generateVoucherCode();
    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 

    const voucher = new Voucher({
        code,
        userId,
        discount,
        expiryDate,
        isUsed: false
    });

    await voucher.save();
    return voucher;
};
const redeemPointsForVoucher = async (req, res) => {
    const userId = req.body.userId; 
    const pointsToRedeem = req.body.pointsToRedeem; 

    try {
        // Lấy thông tin người dùng
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
        }

        if (user.loyaltyPoints < pointsToRedeem) {
            return res.status(400).json({ success: false, message: 'Điểm tích lũy không đủ để đổi' });
        }
        const discount = pointsToRedeem / 10; 

        user.loyaltyPoints -= pointsToRedeem;
        await user.save();

        const voucher = await createVoucher(userId, discount);
        res.status(200).json({
            success: true,
            message: `Bạn đã đổi thành công ${pointsToRedeem} điểm để nhận mã giảm giá.`,
            voucher: voucher
        });
    } catch (error) {
        console.error('Lỗi khi đổi điểm:', error);
        res.status(500).json({ success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' });
    }
};

const sendResetPasswordEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, msg: 'Email không tồn tại' });
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000;
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();
        const htmlContent = `
            <h3>Đặt lại mật khẩu</h3>
            <p>Nhấp vào liên kết bên dưới để đặt lại mật khẩu của bạn:</p>
            <a href="${process.env.BASE_URL}/reset-password/${resetToken}">Đặt lại mật khẩu</a>
        `;
        await sendOrderConfirmationEmail(user.email, 'Đặt lại mật khẩu của bạn', htmlContent);

        res.status(200).json({ success: true, msg: 'Email reset mật khẩu đã được gửi' });

    } catch (error) {
        res.status(500).json({ success: false, msg: 'Gửi email thất bại', error: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ success: false, msg: 'Mã xác nhận không hợp lệ hoặc đã hết hạn' });
        }
        const hashPass = await argon2.hash(newPassword);
        user.password = hashPass;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();
        const htmlContent = `
            <h3>Mật khẩu đã được cập nhật</h3>
            <p>Mật khẩu của bạn đã được thay đổi thành công.</p>
        `;
        await sendOrderConfirmationEmail(user.email, 'Mật khẩu đã được cập nhật', htmlContent);
        res.status(200).json({ success: true, msg: 'Mật khẩu đã được cập nhật' });

    } catch (error) {
        res.status(500).json({ success: false, msg: 'Cập nhật mật khẩu thất bại', error: error.message });
    }
};

const userRegister = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { email, userName, password, roleId, fullName, phoneNumber, address, birthDay, verificationMethod } = req.body;
        console.log('Bắt đầu xử lý yêu cầu đăng ký với dữ liệu:', req.body);
        if (roleId === 'admin' || roleId === 'superadmin') {
            return res.status(403).json({ success: false, msg: 'Bạn không thể tự đăng ký với vai trò này' });
        }

        const existingUserByEmail = await TempUser.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).json({ success: false, msg: 'Email đã được sử dụng' });
        }

        const existingUserByUserName = await TempUser.findOne({ userName });
        if (existingUserByUserName) {
            return res.status(400).json({ success: false, msg: 'Tên người dùng đã được sử dụng' });
        }
        
        const existingUserByPhoneNumber = await TempUser.findOne({ phoneNumber });
        if (existingUserByPhoneNumber) {
            return res.status(400).json({ success: false, msg: 'Số điện thoại đã được sử dụng' });
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        let status;
        if (verificationMethod === 'phone') {
            status = await sendVerificationCode(phoneNumber, verificationCode);
        } else if (verificationMethod === 'email') {
            status = await sendVerificationEmail(email, verificationCode);
        } else {
            return res.status(400).json({ success: false, msg: 'Phương thức xác nhận không hợp lệ' });
        }

        if (status !== 'pending') {
            return res.status(500).json({ success: false, msg: 'Gửi mã xác nhận thất bại' });
        }

        const tempUser = new TempUser({
            userName,
            fullName,
            phoneNumber,
            email,
            password: await argon2.hash(password),
            address,
            birthDay
        });
        await tempUser.save();
        const setting = await SystemSetting.findOne();
        if (setting && setting.allowNewUserVoucher) {
            const voucher = new Voucher({
                code: generateVoucherCode(),
                userId: tempUser._id,
                discount: 50,
                expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                isUsed: false,
                type: 'personal'
            });
            await voucher.save();

            tempUser.vouchers = [voucher._id];
            await tempUser.save();
        }
        res.status(201).json({ success: true, msg: 'Mã xác nhận đã được gửi. Vui lòng nhập mã để hoàn tất đăng ký.' });

    } catch (error) {
        console.error('Có lỗi xảy ra:', error); 
        res.status(500).json({ success: false, msg: 'Đăng ký thất bại', error: error.message });
    }
};
const confirmRegistration = async (req, res) => {
    const { verificationMethod, phoneNumber, email, verificationCode } = req.body;

    try {
        let status;
        if (verificationMethod === 'phone') {
            status = await verifyCode(phoneNumber, verificationCode);
        } else if (verificationMethod === 'email') {
            status = await verifyCodeEmail(email, verificationCode);
        } else {
            return res.status(400).json({ success: false, msg: 'Phương thức xác nhận không hợp lệ' });
        }

        if (status !== 'approved') {
            return res.status(400).json({ success: false, msg: 'Mã xác nhận không chính xác hoặc đã hết hạn' });
        }

        // Kiểm tra người dùng tạm theo email
        const tempUser = await TempUser.findOne({ email });
        if (!tempUser) {
            return res.status(400).json({ success: false, msg: 'Email không tồn tại' });
        }

        // Tiến hành lưu người dùng chính thức
        const newUser = new User({
            userName: tempUser.userName,
            fullName: tempUser.fullName,
            phoneNumber: tempUser.phoneNumber,
            email: tempUser.email,
            password: tempUser.password,
            roleId: tempUser.roleId,
            address: tempUser.address,
            birthDay: tempUser.birthDay
        });

        await newUser.save();
        await TempUser.deleteOne({ email }); // Xóa người dùng tạm

        res.status(201).json({ success: true, msg: 'Đăng ký thành công', newUser });
    } catch (error) {
        console.error('Xác nhận đăng ký thất bại:', error);
        res.status(500).json({ success: false, msg: 'Xác nhận đăng ký thất bại', error: error.message });
    }
};
const userLogin = async (req, res) => {
    const { userName, password } = req.body;

    try {
        const user = await User.findOne({ userName: userName });
        if (!user) {
            return res.status(401).json({
                success: false,
                msg: 'Tên người dùng không tồn tại. Vui lòng kiểm tra lại tên đăng nhập của bạn.',
                errorType: 'user_not_found'
            });
        }
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                msg: 'Tài khoản hiện tại không còn hoạt động.',
                errorType: 'account_inactive'
            });
        }
        const validPassword = await argon2.verify(user.password, password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                msg: 'Mật khẩu không chính xác. Vui lòng thử lại.',
                errorType: 'invalid_password'
            });
        }
        const accessToken = await generateAccessToken({
            id: user._id,
            userName: user.userName,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            email: user.email,
            roleId: user.roleId,
            address: user.address,
            birthDay: user.birthDay,
            companyId: user.companyId 
        });

        user.lastLogin = moment().tz("Asia/Ho_Chi_Minh").toDate();
        user.currentToken = accessToken;
        await user.save();
        
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            sameSite: 'Strict',
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });

        if (user.roleId === 'companyadmin' || user.roleId === 'staff') {
            accessToken.companyId = user.companyId; 
        }
        res.status(200).json({
            success: true,
            msg: 'Đăng nhập thành công',
            accessToken,
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Đăng nhập thất bại do lỗi máy chủ. Vui lòng thử lại sau.', error: error.message });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (userId) {
            const data = await User.findOne({ _id: userId }).select('-password');
            if (data) {
                return res.status(200).json({ data: data });
            } else {
                return res.status(404).json({ err: 'Không tồn tại User' });
            }
        } else {
            return res.status(400).json({ msg: 'Không tìm thấy ID' });
        }
    } catch (error) {
        return res.status(500).json({ msg: 'Lỗi Server', error: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'Không tìm thấy người dùng' });
        }

        const isPasswordValid = await argon2.verify(user.password, currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: 'Mật khẩu hiện tại không đúng' });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ msg: 'Mật khẩu mới và xác nhận mật khẩu không khớp' });
        }

        const hashPass = await argon2.hash(newPassword);

        await User.findByIdAndUpdate(userId, { password: hashPass }, { new: true });

        return res.status(200).json({ msg: 'Cập nhật mật khẩu thành công' });
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi server', details: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { fullName, phoneNumber, email, address, birthDay, roleId, driverInfo } = req.body;
        
        // Kiểm tra vai trò không thể cập nhật
        if (roleId === 'superadmin' || roleId === 'companyadmin') {
            return res.status(403).json({ success: false, msg: 'Bạn không thể cập nhật vai trò này' });
        }   
        
        // Tìm người dùng
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'Không tìm thấy người dùng' });
        }
        
        // Kiểm tra email trùng lặp
        if (email && (email !== user.email)) {
            const existingUser = await User.findOne({ email: email });
            if (existingUser) {
                return res.status(400).json({ success: false, msg: 'Email đã được sử dụng' });
            }
        }
        
        // Cập nhật thông tin người dùng
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    fullName: fullName || user.fullName,
                    phoneNumber: phoneNumber || user.phoneNumber,
                    email: email || user.email,
                    address: address || user.address,
                    birthDay: birthDay || user.birthDay,
                    roleId: roleId || user.roleId
                }
            },
            { new: true }
        ).select('-password');

        // Nếu vai trò là Driver, cập nhật bảng Driver nếu có thông tin
        if (user.roleId === 'driver' && driverInfo) {
            const { licenseNumber, companyId, bustypeId, trips, isActive } = driverInfo;
            await Driver.findOneAndUpdate(
                { userId: userId },
                {
                    $set: {
                        licenseNumber: licenseNumber,
                    }
                },
                { new: true, upsert: true }
            );
        }

        return res.status(200).json({ success: true, msg: 'Cập nhật thông tin thành công', data: updatedUser });
    } catch (error) {
        return res.status(500).json({ success: false, msg: 'Cập nhật thông tin thất bại', error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Lấy danh sách người dùng thất bại', error: error.message });
    }
};

const getUsersByRole = async (req, res) => {
    try {
        const { roleId } = req.params;
        const users = await User.find({ roleId }).select('-password');
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Lấy danh sách người dùng theo vai trò thất bại', error: error.message });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isActive } = req.body;
        if (req.user.roleId !== 'superadmin' && req.user.roleId !== 'companyadmin') {
            return res.status(403).json({ success: false, msg: 'Yêu cầu quyền Super Admin hoặc Admin nhà xe' });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { isActive }, { new: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ success: false, msg: 'Không tìm thấy người dùng' });
        }
        res.status(200).json({ success: true, msg: 'Cập nhật trạng thái người dùng thành công', data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Cập nhật trạng thái người dùng thất bại', error: error.message });
    }
};

const addLoyaltyPoints = async (req, res) => {
    try {
        const { userId } = req.params;
        const { points } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $inc: { loyaltyPoints: points } },
            { new: true }
        ).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ success: false, msg: 'Không tìm thấy người dùng' });
        }
        res.status(200).json({ success: true, msg: 'Cập nhật điểm thưởng thành công', data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Cập nhật điểm thưởng thất bại', error: error.message });
    }
};

const searchUsers = async (req, res) => {
    try {
        const { query, page = 1, limit = 10 } = req.query;
        const users = await User.find({
            $or: [
                { userName: { $regex: query, $options: 'i' } },
                { fullName: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        })
        .select('-password')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

        const count = await User.countDocuments({
            $or: [
                { userName: { $regex: query, $options: 'i' } },
                { fullName: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        });

        res.status(200).json({
            success: true,
            data: users,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Tìm kiếm người dùng thất bại', error: error.message });
    }
};

const getAllUsersByLastLogin = async (req, res) => {
    try {
        const users = await User.find({})
            .sort({ lastLogin: -1 }) // Sắp xếp theo lastLogin giảm dần
            .exec();

        res.status(200).json({
            success: true,
            msg: 'Lấy danh sách người dùng thành công',
            users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Lỗi khi lấy danh sách người dùng. Vui lòng thử lại sau.',
            error: error.message,
        });
    }
};


module.exports = {
    sendResetPasswordEmail,
    resetPassword,
    userRegister,
    userLogin,
    getUserDetails,
    changePassword,
    updateUser,
    getAllUsers,
    getUsersByRole,
    updateUserStatus,
    addLoyaltyPoints,
    searchUsers,
    confirmRegistration,
    redeemPointsForVoucher,
    getAllUsersByLastLogin
};