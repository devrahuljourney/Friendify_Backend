const { default: mongoose } = require("mongoose");

const postSchema = new mongoose.Schema({
    content:{
        type:String
    },
    caption:{
        type:String
    },
    location:{
        type:String
    },
    userId:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        
    
    like:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Like"
        }
    ],
    Comment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }
})

export default mongoose.model("Post", postSchema);