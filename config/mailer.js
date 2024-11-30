const nodemailer = require('nodemailer');
const VerificationCodeModel = require('../models/verificationCodeSchema');
const passwordResetCodeSchema = require('../models/passwordResetCodeSchema');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOrderConfirmationEmail = async (to, subject, htmlContent) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: htmlContent
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Gửi mã xác nhận thất bại');
    }
};

const sendVerificationEmail = async (email, verificationCode) => {
    const subject = 'Mã xác nhận đăng ký';
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background: #2474E5; padding: 20px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="148" height="40" viewBox="0 0 148 40" fill="none">
                    <g id="Logo" clip-path="url(#clip0_1108_36141)">
                        <g id="Logo_2">
                            <path xmlns="http://www.w3.org/2000/svg" id="Vector" d="M27.4086 5.03439C27.3851 5.02842 27.3619 5.02596 27.3526 5C18.7049 5 10.0569 5 1.40918 5C1.22996 5.0614 1.04099 5.09684 0.873331 5.19017C0.428174 5.43789 0.142002 5.79929 0.0328809 6.28911C0.0267383 6.31648 0.0112012 6.34209 0 6.36841C0 14.7778 0 23.1868 0 31.5962C0.105508 31.959 0.256182 32.2955 0.560782 32.5495C0.878751 32.8148 1.24514 32.9534 1.66319 32.9583C2.00573 32.9622 2.34863 32.9643 2.69081 32.9565C2.81692 32.9537 2.85269 32.9892 2.8516 33.1123C2.84546 33.7425 2.85449 34.373 2.84727 35.0032C2.83643 35.9874 3.64616 36.847 4.59465 36.9712C4.6297 36.9758 4.66294 36.9902 4.69727 37C4.85372 37 5.01054 37 5.167 37C5.54169 36.9102 5.90266 36.7937 6.20401 36.5446C6.69975 36.1347 6.96352 35.6186 6.96713 34.9842C6.97075 34.3646 6.97111 33.7449 6.96533 33.1253C6.96424 33.0025 6.9852 32.9558 7.12901 32.9558C11.939 32.96 16.7494 32.96 21.5594 32.9558C21.7003 32.9558 21.7263 32.9976 21.7249 33.1236C21.7184 33.7257 21.7216 34.3277 21.722 34.9298C21.7223 35.9681 22.4114 36.7758 23.4614 36.9705C23.4831 36.9744 23.5022 36.9898 23.5228 37C23.7035 37 23.8842 37 24.0648 37C24.0811 36.9681 24.1132 36.9716 24.1418 36.9663C25.1391 36.7856 25.8411 35.9681 25.8411 34.9881C25.8411 34.3625 25.8447 33.7369 25.8382 33.1116C25.8368 32.9867 25.8762 32.9541 26.0005 32.9569C26.3314 32.9646 26.6628 32.9597 26.9938 32.9593C27.9603 32.9586 28.6952 32.2478 28.6952 31.3053C28.696 23.0858 28.696 14.8662 28.6952 6.64665C28.6949 5.85192 28.2046 5.24105 27.4086 5.03439Z" fill="#FFD333"/>
                            <text x="40" y="25" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#FFFFFF">
                                VeXeOnline
                            </text>
                        </g>
                    </g>
                </svg>
            </div>
            <!-- Content -->
            <div style="padding: 20px; text-align: left;">
                <h1 style="color: #FFD333; text-align: center;">Mã Xác Nhận</h1>
                <p style="font-size: 16px; color: #333;">Chào mừng bạn đến với <strong>VeXeOnline</strong>!</p>
                <p style="font-size: 16px; color: #333;">Vui lòng sử dụng mã xác nhận dưới đây để hoàn tất đăng ký:</p>
                <div style="text-align: center; margin: 20px;">
                    <span style="font-size: 24px; font-weight: bold; padding: 10px 20px; border: 2px dashed #FFD333; background-color: #FFF7E5; display: inline-block;">
                        ${verificationCode}
                    </span>
                </div>
            </div>
            <!-- Footer -->
            <div style="background: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; color: #666;">
                <p>Bạn nhận được email này vì đã sử dụng dịch vụ của VeXeOnline.</p>
            </div>
        </div>
    </div>
`;

    try {
        await sendOrderConfirmationEmail(email, subject, htmlContent);
        console.log('Email sent successfully');
        await VerificationCodeModel.create({ email, code: verificationCode });
        return 'pending';
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Gửi mã xác nhận thất bại');
    }
};


const verifyCodeEmail = async (email, code) => {
    const record = await VerificationCodeModel.findOne({ email }).sort({ createdAt: -1 }).limit(1);
    
    if (record && record.code === code) {
        return 'approved';
    } else {
        return 'denied';
    }
};

const sendPasswordResetEmail = async (email, resetCode) => {
    const subject = 'Mã xác nhận quên mật khẩu';
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <div style="background: #2474E5; padding: 20px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="148" height="40" viewBox="0 0 148 40" fill="none">
                        <g id="Logo" clip-path="url(#clip0_1108_36141)">
                            <g id="Logo_2">
                                <path xmlns="http://www.w3.org/2000/svg" id="Vector" d="M27.4086 5.03439C27.3851 5.02842 27.3619 5.02596 27.3526 5C18.7049 5 10.0569 5 1.40918 5C1.22996 5.0614 1.04099 5.09684 0.873331 5.19017C0.428174 5.43789 0.142002 5.79929 0.0328809 6.28911C0.0267383 6.31648 0.0112012 6.34209 0 6.36841C0 14.7778 0 23.1868 0 31.5962C0.105508 31.959 0.256182 32.2955 0.560782 32.5495C0.878751 32.8148 1.24514 32.9534 1.66319 32.9583C2.00573 32.9622 2.34863 32.9643 2.69081 32.9565C2.81692 32.9537 2.85269 32.9892 2.8516 33.1123C2.84546 33.7425 2.85449 34.373 2.84727 35.0032C2.83643 35.9874 3.64616 36.847 4.59465 36.9712C4.6297 36.9758 4.66294 36.9902 4.69727 37C4.85372 37 5.01054 37 5.167 37C5.54169 36.9102 5.90266 36.7937 6.20401 36.5446C6.69975 36.1347 6.96352 35.6186 6.96713 34.9842C6.97075 34.3646 6.97111 33.7449 6.96533 33.1253C6.96424 33.0025 6.9852 32.9558 7.12901 32.9558C11.939 32.96 16.7494 32.96 21.5594 32.9558C21.7003 32.9558 21.7263 32.9976 21.7249 33.1236C21.7184 33.7257 21.7216 34.3277 21.722 34.9298C21.7223 35.9681 22.4114 36.7758 23.4614 36.9705C23.4831 36.9744 23.5022 36.9898 23.5228 37C23.7035 37 23.8842 37 24.0648 37C24.0811 36.9681 24.1132 36.9716 24.1418 36.9663C25.1391 36.7856 25.8411 35.9681 25.8411 34.9881C25.8411 34.3625 25.8447 33.7369 25.8382 33.1116C25.8368 32.9867 25.8762 32.9541 26.0005 32.9569C26.3314 32.9646 26.6628 32.9597 26.9938 32.9593C27.9603 32.9586 28.6952 32.2478 28.6952 31.3053C28.696 23.0858 28.696 14.8662 28.6952 6.64665C28.6949 5.85192 28.2046 5.24105 27.4086 5.03439Z" fill="#FFD333"/>
                                <text x="40" y="25" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#FFFFFF">
                                    VeXeOnline
                                </text>
                            </g>
                        </g>
                    </svg>
                </div>
                <!-- Content -->
                <div style="padding: 20px; text-align: left;">
                    <h1 style="color: #FFD333; text-align: center;">Quên Mật Khẩu</h1>
                    <p style="font-size: 16px; color: #333;">Chào bạn,</p>
                    <p style="font-size: 16px; color: #333;">Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. Vui lòng sử dụng mã xác nhận dưới đây để tiếp tục:</p>
                    <div style="text-align: center; margin: 20px;">
                        <span style="font-size: 24px; font-weight: bold; padding: 10px 20px; border: 2px dashed #FFD333; background-color: #FFF7E5; display: inline-block;">
                            ${resetCode}
                        </span>
                    </div>
                    <p style="font-size: 16px; color: #333;">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                </div>
                <!-- Footer -->
                <div style="background: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; color: #666;">
                    <p>Bạn nhận được email này vì đã sử dụng dịch vụ của VeXeOnline.</p>
                </div>
            </div>
        </div>
    `;

    try {
        await sendOrderConfirmationEmail(email, subject, htmlContent);
        await passwordResetCodeSchema.create({
            identifier: email,
            code: resetCode,
            expiry: Date.now() + 3600000
        });
        return 'pending';
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Gửi mã xác nhận thất bại');
    }
};

const verifyPasswordResetCode = async (identifier, code) => {
    const record = await passwordResetCodeSchema.findOne({
        identifier,
        code,
        expiry: { $gt: Date.now() }
    });

    if (record) {
        return 'approved';
    } else {
        return 'denied';
    }
};


const sendPurchaseConfirmationEmail = async (email, orderDetails) => {
    const subject = 'Xác nhận đơn hàng từ VeXeOnline';
    const { orderCode, departurePoint, destinationPoint, seatNumbers, totalPrice, paymentMethod, paymentLink } = orderDetails;

    const formattedTotalPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice);

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background-color: #2474E5; padding: 20px; text-align: center; color: white;">
                <h1 style="margin: 0;">Xác nhận đơn hàng</h1>
            </div>
            <!-- Content -->
            <div style="padding: 20px; text-align: left;">
                <p>Chào bạn,</p>
                <p>Cảm ơn bạn đã đặt vé tại <strong>VeXeOnline</strong>!</p>
                <p>Dưới đây là thông tin chi tiết đơn hàng của bạn:</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <tr>
                        <td style="padding: 8px; font-weight: bold; width: 150px;">Mã đơn hàng:</td>
                        <td style="padding: 8px;">${orderCode}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">Điểm đi:</td>
                        <td style="padding: 8px;">${departurePoint}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">Điểm đến:</td>
                        <td style="padding: 8px;">${destinationPoint}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">Ghế đã đặt:</td>
                        <td style="padding: 8px;">${seatNumbers.join(', ')}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">Tổng tiền:</td>
                        <td style="padding: 8px; color: #D9534F; font-weight: bold;">${formattedTotalPrice}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">Phương thức thanh toán:</td>
                        <td style="padding: 8px;">${paymentMethod === 'Online' ? 'Thanh toán trực tuyến' : 'Thanh toán trên xe'}</td>
                    </tr>
                </table>
                ${
                  paymentMethod === 'Online'
                    ? `
                    <p style="margin-top: 20px;"><strong>Trạng thái:</strong> Chờ thanh toán</p>
                    <p>Vui lòng nhấn vào link dưới đây để tiến hành thanh toán:</p>
                    <a href="${paymentLink}" style="display: inline-block; background-color: #2474E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 10px;">Thanh toán ngay</a>
                    `
                    : `
                    <p style="margin-top: 20px;"><strong>Trạng thái:</strong> Đã xác nhận</p>
                    <p>Vui lòng thanh toán trực tiếp khi lên xe.</p>
                    `
                }
                <p style="margin-top: 20px;">Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại hỗ trợ.</p>
            </div>
            <!-- Footer -->
            <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; color: #666;">
                <p>© 2024 VeXeOnline. Mọi quyền được bảo lưu.</p>
                <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
            </div>
        </div>
    </div>
    `;

    try {
        await sendOrderConfirmationEmail(email, subject, htmlContent);
        console.log('Email xác nhận mua hàng đã được gửi thành công');
    } catch (error) {
        console.error('Lỗi gửi email:', error.message);
        throw new Error('Không thể gửi email xác nhận đơn hàng.');
    }
};


module.exports = { sendPurchaseConfirmationEmail,verifyPasswordResetCode,sendOrderConfirmationEmail, sendVerificationEmail,sendPasswordResetEmail ,verifyCodeEmail };
