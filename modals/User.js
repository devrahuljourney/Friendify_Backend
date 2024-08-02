const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    
    token :{
        type: String
    },
    resetPasswordExpires: {
        type:Date
    },
    additionalDetails: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile"
        }
    ,
    lastlogin: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    status: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Status"
        }
    ],
    notification: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notification"
        }
    ],
    onlineStatus : {
        type: Boolean,
        default:false
    }
});


module.exports = mongoose.model("User", userSchema);
