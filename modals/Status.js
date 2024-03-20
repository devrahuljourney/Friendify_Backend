const { default: mongoose } = require("mongoose");

const statusSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    content:[
        {
            type:String,
            required:true
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now()
    },
    expiry: {
        type: Date,
        expires: 86400 
    }
})

export default mongoose.model("Status", statusSchema);