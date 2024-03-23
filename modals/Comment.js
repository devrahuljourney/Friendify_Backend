const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true
    }
});

const Comment = mongoose.model("Comment", commentSchema); 

module.exports = Comment;
