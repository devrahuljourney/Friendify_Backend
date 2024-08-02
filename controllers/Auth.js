const otpGenerator = require("otp-generator");
const OTP = require("../modals/OTP");
const User = require("../modals/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Profile = require("../modals/AdditionalDetails");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/template/passwordUpdate");




exports.sendOTP = async (req, res) => {
    try {
        // Check if user already exists
        const { email } = req.body;
        const alreadyExist = await User.findOne({ email });

        if (alreadyExist) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // Generate OTP
        let otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });

        // Check if OTP already exists (unlikely, but just in case)
        let existingOTP = await OTP.findOne({ otp });
        while (existingOTP) {
            otp = otpGenerator.generate(6);
            existingOTP = await OTP.findOne({ otp });
        }

        // Save OTP to database
        const otpPayload = { email, otp };
        const otpBody = await OTP.create(otpPayload);

        // Send OTP via email or SMS (implementation required)

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp
        });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send OTP"
        });
    }
};


exports.signup = async (req,res) => {
    try {
        

        // fetch data from body
        // validation
        // password matching
        // find recent otp and match it
        // password hashing
        //entry in db

        const {firstname , lastname , email, password, confirmPassword, otp} = req.body;
        console.log("req body ", req.body)
        if(!firstname || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All field are required"
            })
        }
        
        console.log("After validations of field")
        if(password !== confirmPassword)
        {
            return res.status(400).json({
                success:false,
                message:"Enter same password in confirmation field"
            })
        }

        const userPresent = await User.findOne({email : email});
        if(userPresent){
            return res.json({
                success:false,
                message:"User is already Registered kindly go and login"
            })
        }

        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(-1);
        console.log("Email:", email);
    console.log("Recent OTP:", recentOtp);
    
    // validate otp
    if (recentOtp.length === 0) {
        console.log("OTP not found");
        return res.status(400).json({
            success: false,
            message: "OTP not found"
        });
    } else if (otp !== recentOtp[0]?.otp) {
        console.log("Invalid OTP");
        return res.status(400).json({
            success: false,
            message: "Invalid OTP"
        });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const profileData = await Profile.create({
        gender:null,
        dob:null,
        mobileNumber:null,
        about:null,
        bio:null,
        link:null,
        image : `https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastname}`
    })


    const user = await User.create({
        firstname,
        lastname,
        email,
        password:hashedPassword,
        additionalDetails:profileData._id,
    })

    

    return res.status(200).json({
        success:true,
        message:"User is Registered Successfully",
        user
    })
    } catch (error) {
        console.log("error in signup ",error);

        return res.status(500).json({
            success:false,
            message:"User cannot be registered",
            error:error.message
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the existing user by email and populate the additionalDetails field
        const existingUser = await User.findOne({ email }).populate('additionalDetails');

        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "User is not registered"
            });
        }

        // Update the lastlogin field for the existing user
        await User.findByIdAndUpdate(existingUser._id, { lastlogin: Date.now() });
        

        console.log("Password entered by user:", password);
        console.log("Hashed password stored in database:", existingUser.password);

        if (await bcrypt.compare(password, existingUser.password)) {
            // Passwords match
            const payload = {
                email: existingUser.email,
                id: existingUser._id
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "1h"
            });

            // Clear the password field before sending the response
            existingUser.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            };

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                existingUser,
                message: 'logged in'
            });
        } else {
            // Passwords do not match
            return res.status(400).json({
                success: false,
                message: "Password is incorrect"
            });
        }
    } catch (error) {
        console.log("Error in login", error);
        return res.status(400).json({
            success: false,
            message: "Login failure",
            error: error.message
        });
    }
};



exports.changePassword = async(req, res) => {
    try {
        const {newPassword, oldPassword} = req.body;
        if(!newPassword || !oldPassword)
        {
            return res.status(400).json({
                success:false,
                message:"All the fields are required"
            })
        }


        const user = await User.findById(req.user.id);

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if(!isPasswordMatch)
        {
            return res.status(400).json({
                success:false,
                message:"The password you entered is incorrect"
            })
        }

        const encryptPassword = await bcrypt.hash(newPassword, 10);

        const updatedUserPassword = await User.findByIdAndUpdate(req.user.id , 
            {password:encryptPassword},
            {
                new :true
            }
        )

        try {
            const emailResponse = await mailSender(
                updatedUserPassword.email,
                "Password for your account has been successfully updated",
                passwordUpdated(updatedUserPassword.email),
                `Password updated successfully for ${updatedUserPassword.firstname} ${updatedUserPassword.lastname}`

            )

            console.log("Email sent successfully:", emailResponse.response)
        } catch (error) {
            console.error("Error occurred while sending email:", error)
        return res.status(500).json({
          success: false,
          message: "Error occurred while sending email",
          error: error.message,
        })
        }

        return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" })
    } catch (error) {
        console.error("Error occurred while updating password:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while updating password",
        error: error.message,
      })
    }
}