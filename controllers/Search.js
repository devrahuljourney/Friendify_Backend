const Post = require("../modals/Post");
const User = require("../modals/User");

const searchBasicOnKeywords = async (req, res) => {
    const keyword = req.query.keyword;

    try {
        if (!keyword) {
            return res.status(400).json({
                success: false,
                message: "Search box is empty!"
            });
        }

        const users = await User.find({
            $or: [
                { firstname: { $regex: keyword, $options: 'i' } },
                { lastname: { $regex: keyword, $options: 'i' } }
            ]
        });

        const posts = await Post.find({
            $or: [
                { caption: { $regex: keyword, $options: 'i' } },
                { location: { $regex: keyword, $options: 'i' } }
            ]
        });
        

        return res.status(200).json({
            success: true,
            users: users,
            posts: posts,
            message: "Search Successful"
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Failed to search",
            error: error.message
        });
    }
};

module.exports = searchBasicOnKeywords;
