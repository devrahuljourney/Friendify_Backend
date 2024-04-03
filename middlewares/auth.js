const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../modals/User");

// auth 

exports.auth = async (req, res,next) => {
    console.log("Request Headers:", req.headers);

 try {
    // extract token

    
    const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");
    console.log("token", token)
    // if token is missing return res
    if(!token) {
        return res.status(401).json({
            success:false,
            message:"Token is missing"
        })
    }

    console.log("checking token")
    console.log("req body ", req.body )
    // verifying token

    try {
        const decode =  jwt.verify(token,process.env.JWT_SECRET);
        console.log("Decoded token ", decode);
        req.user = decode;
        console.log("request user data ", req.user);
    } catch (error) {
        // verification issue

        return res.status(401).json({
            success:false,
            message:"token is invalid"
        })
    }
    next();
 } catch (error) {
    console.log("Error in auth ", error)
    return res.status(401).json({
        success:false,
        message: 'Someting went wrong while validating the token',
        error: error.message
    })
 }
}