const Post = require("../modals/Post");
const User = require("../modals/User");
const { uploadToCloudinary } = require("../utils/uploader");

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
            file: fileLink.secure_url
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
