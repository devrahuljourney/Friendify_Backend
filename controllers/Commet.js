const Comment = require("../modals/Comment");
const Post = require("../modals/Post");
const User = require("../modals/User");

exports.createComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;

        const { comment } = req.body;
        if (!comment) {
            return res.status(400).json({
                success: false,
                message: "Comment is required"
            });
        }

        const post = await Post.findById(postId).populate("comments").populate("likes"); 
        if (!post) {
            return res.status(400).json({
                success: false,
                message: "Post not found"
            });
        }

        const newComment = new Comment({
            postId: postId,
            userId: userId,
            comment: comment
        });
        await newComment.save();

        const user = await User.findById(userId); 
        post.comments.push(newComment._id); 

        
        await post.save();
        // req.io.emit("newComment", (data) => {
        //     console.log(data)
        // });

        res.status(200).json({
            success: true,
            message: "Comment created successfully",
            comment: newComment
        });
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create comment",
            error: error.message
        });
    }
};



exports.deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.user.id;

        
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        
        if (String(comment.userId._id) !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You are not the owner of this comment"
            });
        }

        
        const post = await Post.findById(comment.postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const index = post.comments.indexOf(commentId);
        if (index > -1) {
            post.comments.splice(index, 1);
            await post.save();
        }

        
        await Comment.findByIdAndDelete(commentId);

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete comment",
            error: error.message
        });
    }
};
