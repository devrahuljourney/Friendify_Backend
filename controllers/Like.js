const Like = require("../modals/Like");
const Post = require("../modals/Post");

exports.createLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        // Check if the like already exists
        const existingLike = await Like.findOne({ userId: userId, postId: postId });
        if (existingLike) {
            return res.status(400).json({
                success: false,
                message: "Like already exists for this post"
            });
        }

        // Create the like
        const like = new Like({
            userId: userId,
            postId: postId,
            createdAt: Date.now()
        });
        await like.save();

        // Add like to post
        const post = await Post.findById(postId);
        post.likes.push(like._id);
        await post.save();

        res.status(201).json({
            success: true,
            message: "Like created successfully",
            like: like
        });
    } catch (error) {
        console.error("Error creating like:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create like",
            error: error.message
        });
    }
};

exports.deleteLike = async (req, res) => {
    try {
        const { likeId } = req.params;
        const userId = req.user.id;

        // Check if the like exists
        const like = await Like.findById(likeId);
        if (!like) {
            return res.status(404).json({
                success: false,
                message: "Like not found"
            });
        }

        // Ensure that the like belongs to the authenticated user
        if (like.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You are not the owner of this like"
            });
        }

        // Delete the like
        await Like.findByIdAndDelete(likeId);

        // Remove like from post
        const post = await Post.findById(like.postId);
        post.likes = post.likes.filter(likeId => likeId.toString() !== like._id.toString());
        await post.save();

        res.status(200).json({
            success: true,
            message: "Like deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting like:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete like",
            error: error.message
        });
    }
};