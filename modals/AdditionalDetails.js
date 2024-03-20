const { default: mongoose } = require("mongoose");

const profileSchema = new mongoose.Schema({
    mobileNumber:{
        type:Number
    },
    gender:{
        type:String,
        enum: ['male', 'female', 'other']
    },
    dob:{
        type:Date
    },
    image:{
        type:String
    },
    about:{
        type:String
    },
    bio:{
        type:String
    },
    link:{
        type:String
    },
})

export default mongoose.model("Profile", profileSchema);