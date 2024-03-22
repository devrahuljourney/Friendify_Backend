const { default: mongoose } = require("mongoose");

const postSchema = new mongoose.Schema({
    file:{
        type:String
    },
    caption:{
        type:String
    },
    location:{
        type:String
    },

    // userId:
    //     {
    //         type:mongoose.Schema.Types.ObjectId,
    //         ref:"User"
    //     },
        
    
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Like"
        }
    ],
    Comments:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model("Post", postSchema);