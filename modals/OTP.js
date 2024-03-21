const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../mail/template/emailVerification");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required:true,
    },
    otp : {
        type: String,
        required: true,
    }
    ,
    createdAt: {
        type:Date,
        default:Date.now(),
        expires: 5 * 60
    }
})


async function sendVerificationEmail(email, otp) {
    try {
        const mailResposnse = await mailSender(email, "Verification Email", otpTemplate(otp) );
        console.log("Email sent successfully , ", mailResposnse)
    } catch (error) {
        console.log("otp sending error",error);
        throw error
    }
}


otpSchema.pre("save", async function(next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
})

module.exports = mongoose.model("OTP", otpSchema);