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
    follower: [
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
    post: [
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
    ]
});


module.exports = mongoose.model("User", userSchema);
