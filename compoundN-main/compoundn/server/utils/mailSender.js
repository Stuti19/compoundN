const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        // Create email body with OTP
        const emailBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">OTP Verification</h2>
                <p style="font-size: 16px; color: #666;">Your OTP for CompoundN is:</p>
                <h1 style="color: #4285f4; font-size: 32px; letter-spacing: 5px;">${body}</h1>
                <p style="font-size: 14px; color: #999;">This OTP will expire in 5 minutes.</p>
                <p style="font-size: 14px; color: #999;">If you didn't request this OTP, please ignore this email.</p>
            </div>
        `;

        let info = await transporter.sendMail({
            from: `"CompoundN" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: title,
            html: emailBody,
        });

        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error in mailSender:", error);
        throw error; // Re-throw the error to be handled by the caller
    }
};

module.exports = mailSender; 