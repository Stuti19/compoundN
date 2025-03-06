const OTP = require("../models/OTP");
const nodemailer = require('nodemailer');

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP
exports.sendotp = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = generateOTP();

        // Send email
        await transporter.sendMail({
            from: `"CompoundN" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your OTP for CompoundN',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">OTP Verification</h2>
                    <p style="font-size: 16px; color: #666;">Your OTP for CompoundN is:</p>
                    <h1 style="color: #4285f4; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                    <p style="font-size: 14px; color: #999;">This OTP will expire in 5 minutes.</p>
                    <p style="font-size: 14px; color: #999;">If you didn't request this OTP, please ignore this email.</p>
                </div>
            `
        });

        res.json({ success: true, otp });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find the most recent OTP for this email
        const otpDoc = await OTP.findOne({ email }).sort({ createdAt: -1 });

        if (!otpDoc) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired or not found"
            });
        }

        if (otpDoc.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Delete the OTP document
        await OTP.deleteOne({ _id: otpDoc._id });

        res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });
    } catch (error) {
        console.error("Error in verifyOTP:", error);
        res.status(500).json({
            success: false,
            message: "Failed to verify OTP",
            error: error.message
        });
    }
}; 