const { default: mongoose } = require("mongoose");

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
})

module.exports = mongoose.model("Comment", commentSchema);