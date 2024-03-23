const Post = require("../modals/Post");
const User = require("../modals/User");
const { uploadToCloudinary } = require("../utils/uploader");
const Comment = require("../modals/Comment");

exports.createPost = async (req, res) => {
    try {
        // Extract userId, caption, and location from the request
        const userId = req.user.id;
        const { caption, location } = req.body;

        // Check if the user exists
        const userFound = await User.findOne({ _id: userId });
        if (!userFound) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        // Upload the file to Cloudinary
        const file = req.files.file;
        const fileLink = await uploadToCloudinary(file, process.env.FOLDER_NAME);

        // Create a new post instance
        const post = new Post({
            caption,
            location,
            file: fileLink.secure_url,
            userId: userId
        });

        // Save the post to the database
        await post.save();

        // Update the user's post field to include the new post's ID
        await User.findByIdAndUpdate(
            { _id: userId },
            { $push: { posts: post._id } }, 
            { new: true }
        );

        // Send a success response
        res.status(201).json({
            success: true,
            message: "Post created successfully",
            post: post
        });
    } catch (error) {
        // Handle errors
        console.error("Error creating post:", error);
        res.status(500).json({ success: false, message: "Failed to create post", error: error.message });
    }
};


exports.editPost = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.postId;

        const {caption, location} = req.body;

        const post = await Post.findById(postId).populate('userId');

        if(!post)
        {
            return res.status(400).json({
                success:false,
                message:"Post not found"
            })
        }
        console.log("Retrieved post:", post);

        console.log("post user Id", post.userId._id );
        console.log("User id", userId)

        if (String(post.userId._id) !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You are not the owner of this post"
            });
        }
        

        // Update the post with the new caption and location
        post.caption = caption;
        post.location = location;
        await post.save();

        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            post: post
        });
    } catch (error) {
        console.error("Error editing post:", error);
        res.status(500).json({ success: false, message: "Failed to edit post", error: error.message });
    }
}

exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.postId; 

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Delete the post from the User's posts array
        await User.updateOne(
            { _id: post.userId }, 
            { $pull: { posts: postId } } 
        );

        // Delete the post from the database
        await Post.findByIdAndDelete(postId)

        res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ success: false, message: "Failed to delete post", error: error.message });
    }
};



exports.getPost = async (req, res) => {
    try {
        const postId = req.params.postId; 

        
        const post = await Post.findById(postId)
            .populate('userId') 
            .populate({
                path: 'comments', 
                populate: { path: 'user', select: 'username' } 
            })
            .populate('likes').sort({createdAt:-1});; 
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Post retrieved successfully",
            post: post
        });
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ success: false, message: "Failed to fetch post", error: error.message });
    }
};


exports.getFeedFromFollower = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        const following = user.following;

        const posts = await Post.find({ userId: { $in: following } }).populate("comments").populate("likes").sort({createdAt:-1});;
        res.status(200).json({
            success: true,
            message: "Feed retrieved successfully",
            posts: posts
        });
    } catch (error) {
        console.error("Error fetching feed from followers:", error);
        res.status(500).json({ success: false, message: "Failed to fetch feed from followers", error: error.message });
    }
}


exports.getFeedFromAllUsers = async (req, res) => {
    try {
        // Fetch posts from all users
        const posts = await Post.find()
            .populate('userId')
            .populate('comments.user')
            .populate('likes').sort({createdAt:-1});

        res.status(200).json({
            success: true,
            message: "Feed retrieved successfully",
            posts: posts
        });
    } catch (error) {
        console.error("Error fetching feed from all users:", error);
        res.status(500).json({ success: false, message: "Failed to fetch feed from all users", error: error.message });
    }
};

exports.getAllPostsFromUser = async (req, res) => {
    try {
        const userId = req.params.userId; 

        
        const posts = await Post.find({ userId: userId })
            // .populate('userId') 
             .populate('comments').sort({createdAt:-1});
            //  .populate('likes'); 

        res.status(200).json({
            success: true,
            message: "All posts from user retrieved successfully",
            posts: posts
        });
    } catch (error) {
        console.error("Error fetching posts from user:", error);
        res.status(500).json({ success: false, message: "Failed to fetch posts from user", error: error.message });
    }
};
