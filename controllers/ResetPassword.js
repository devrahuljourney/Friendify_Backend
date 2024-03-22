const User = require("../modals/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");


exports.resetPasswordToken = async (req, res) =>
{
    try {
        const email = req.body.email;
        const user = await User.findOne({email: email});

        if(!user)
        {
            return res.status(400).json({
                success:false,
                message:"Your email is not registed"
            })
        }

        const token = crypto.randomUUID();

        const updatedDetails = await User.findOneAndUpdate({email : email}, {
            token,
            resetPasswordExpires: Date.now() + 5 * 60 * 1000
         }, {new: true})

         const url = `http://localhost:3000/update-password/${token}`;
         await mailSender(email,"Password Reset Link",
    
         `Password rest link : ${url}`)
         // return res
     
         return res.json({
             success:true,
             url:url,
             message:"Email sent successfully , please check email "
         })
    } catch (error) {
        console.log("error in reset password" , error)
        return res.status(500).json({
            success:false,
            message: 'Something went wrong while reset password',
            error: error.message
        })
    }
}



exports.resetPassword = async (req,res) => {
    // fetch data 
    // validatiin
    // get user deatils from db usig token
    // if no entry - invalid token
    // token time check
    // hash password
    // password update
    // return res

    try {
            // fetch data 

    const {password,confirmPassword,token} = req.body;
    // validatiin

    if(password !== confirmPassword)
    {
        return res.json({
            success:false,
            message:"Password is not matching"
        })
    }
    // get user deatils from db usig token

    const userDetails = await User.findOne({token:token});
    // if no entry - invalid token
    if(!userDetails)
    {
        return res.json({
            success:false,
            message:"token invalid"
        })
    }
    // token time check
    if(userDetails.resetPasswordExpires < Date.now())
    {
        return res.json({
            success:false,
            message:"Reset Linked Expires, Token is expired"
        })
    }
    // hash password

    const hashedPassword = await bcrypt.hash(password,10);
    // password update
    await User.findOneAndUpdate({token:token},
        {
            password:hashedPassword
        }, {
            new:true
        })
    // return res
    return res.json({
        success:true,
        message:"Password Reset Successfull"
    })

    } catch (error) {
        return res.json({
            success:false,
            message:"Password Reset Failed"
        })
    }
}