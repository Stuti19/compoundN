const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5, // The document will be automatically deleted after 5 minutes
    },
});

// Function to send verification email
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(
            email,
            "OTP Verification for CompoundN",
            otp
        );
        console.log("Email sent successfully:", mailResponse);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

// Pre-save hook to send email
OTPSchema.pre("save", async function (next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
});

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP; 