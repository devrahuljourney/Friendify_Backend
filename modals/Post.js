const { default: mongoose } = require("mongoose");
const Like = require("./Like");
const Comment = require("./Comment");

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

    userId:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        
    
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Like"
        }
    ],
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now()
    }
})
postSchema.pre('remove', async function(next) {
    try {
        // Remove associated likes
        await Like.deleteMany({ postId: this._id });

        // Remove associated comments
        await Comment.deleteMany({ postId: this._id });
        delete this.createdAt;

        next();
    } catch (error) {
        next(error);
    }
});
module.exports = mongoose.model("Post", postSchema);