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
        <h1>Xác nhận đăng ký của bạn</h1>
        <p>Vui lòng nhập mã xác nhận sau để hoàn tất quá trình đăng ký:</p>
        <h2>${verificationCode}</h2>
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
        <h1>Quên mật khẩu</h1>
        <p>Vui lòng nhập mã xác nhận sau để đặt lại mật khẩu của bạn:</p>
        <h2>${resetCode}</h2>
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
module.exports = { verifyPasswordResetCode,sendOrderConfirmationEmail, sendVerificationEmail,sendPasswordResetEmail ,verifyCodeEmail };
