const nodemailer = require('nodemailer');
const VerificationCodeModel = require('../models/verificationCodeSchema');
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
        <h1>Xác nhận đăng ký của bạn</h1>
        <p>Vui lòng nhập mã xác nhận sau để hoàn tất quá trình đăng ký:</p>
        <h2>${verificationCode}</h2>
    `;

    try {
        await sendOrderConfirmationEmail(email, subject, htmlContent);
        console.log('Email sent successfully');
        
        // Lưu mã vào cơ sở dữ liệu
        await VerificationCodeModel.create({ email, code: verificationCode });
        
        return 'pending'; // Trả về trạng thái đã gửi thành công
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


module.exports = { sendOrderConfirmationEmail, sendVerificationEmail, verifyCodeEmail };
