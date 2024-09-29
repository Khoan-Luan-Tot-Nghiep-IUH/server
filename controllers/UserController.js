const User = require('../models/User');
const argon2 = require('argon2');
const { generalAcesstoken, generateAccessToken } = require('../middleware/authMiddleware');
const crypto = require('crypto');
const { sendOrderConfirmationEmail } = require('../config/mailer');
const moment = require('moment-timezone');
const { validationResult } = require('express-validator');

// Existing functions with updates
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
        const { email, userName, password, roleId, fullName, phoneNumber, address, birthDay } = req.body;

        if (roleId === 'admin' || roleId === 'superadmin') {
            return res.status(403).json({ success: false, msg: 'Bạn không thể tự đăng ký với vai trò này' });
        }

        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).json({ success: false, msg: 'Email đã được sử dụng' });
        }

        const existingUserByUserName = await User.findOne({ userName });
        if (existingUserByUserName) {
            return res.status(400).json({ success: false, msg: 'Tên người dùng đã được sử dụng' });
        }
        const hashPass = await argon2.hash(password);
        const newUser = new User({
            userName,
            fullName,
            phoneNumber,
            email,
            password: hashPass,
            roleId: roleId || "user",
            address,
            birthDay
        });

        await newUser.save();
        res.status(201).json({ success: true, msg: 'Đăng ký thành công' });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Đăng ký thất bại', error: error.message });
    }
};
const userLogin = async (req, res) => {
    const { userName, password } = req.body;

    try {
        const user = await User.findOne({ userName: userName });
        if (!user) {
            return res.status(401).json({ success: false, msg: 'Tên người dùng không tồn tại' });
        }

        const validPassword = await argon2.verify(user.password, password);
        if (!validPassword) {
            return res.status(401).json({ success: false, msg: 'Mật khẩu không chính xác' });
        }

        const accessToken = await generateAccessToken({
            id: user._id,
            userName: user.userName,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            email: user.email,
            roleId: user.roleId,
            address: user.address,
            birthDay: user.birthDay
        });

        user.lastLogin = moment().tz("Asia/Ho_Chi_Minh").toDate();
        await user.save();

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            sameSite: 'Strict',
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
        res.status(200).json({
            success: true,
            msg: 'Đăng nhập thành công',
            accessToken,
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Đăng nhập thất bại', error: error.message });
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
        const { fullName, phoneNumber, email, address, birthDay } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'Không tìm thấy người dùng' });
        }
        if (email && (email !== user.email)) {
            const existingUser = await User.findOne({ email: email });
            if (existingUser) {
                return res.status(400).json({ success: false, msg: 'Email đã được sử dụng' });
            }
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    fullName: fullName || user.fullName,
                    phoneNumber: phoneNumber || user.phoneNumber,
                    email: email || user.email,
                    address: address || user.address,
                    birthDay: birthDay || user.birthDay
                }
            },
            { new: true }
        ).select('-password');
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
    searchUsers
};