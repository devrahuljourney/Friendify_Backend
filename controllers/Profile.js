const Profile = require("../modals/AdditionalDetails");
const User = require("../modals/User");
const { uploadToCloudinary } = require("../utils/uploader");

exports.createProfile = async (req, res) => {
    try {
        const { firstname, lastname, mobileNumber, gender, dob, about, bio, link, location } = req.body;

        const image = req.files ? req.files.profileimage : null;
        if (!image) {
         return res.status(400).json({ success: false, message: "Image file is required" });
        }

const uploadimage = await uploadToCloudinary(image, process.env.FOLDER_NAME);

        const userId = req.user.id;

        console.log("PROFILE IMAGE ", uploadimage);

        // Update user details with first name and last name
        const userDetails = await User.findByIdAndUpdate(userId, {
            $set: { firstname, lastname }
        }, { new: true });

        // Create a new profile
        const profile = new Profile({
            mobileNumber,
            gender,
            dob,
            image: uploadimage.secure_url,
            about,
            bio,
            link,
            location
        });

        await profile.save();

        // Link the profile to the user
        userDetails.additionalDetails = profile._id;
        await userDetails.save();

        res.status(201).json({
            success: true,
            message: "Profile created successfully",
            userDetails,
            profile
        });
    } catch (error) {
        console.error("Error creating profile:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create profile",
            error: error.message
        });
    }
};




exports.getProfileById = async (req,res) => {
    try {
        const {userId} = req.params;
        const userProfile = await User.findById(userId)
            .populate("additionalDetails")
            .populate("followers")
            .populate("following")
            .populate({
                path:"posts"
            });

        if (!userProfile) {
            return res.status(404).json({
                success: false,
                message: "User profile not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User profile retrieved successfully",
            profile: userProfile
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user profile",
            error: error.message
        });
    }
}

exports.deleteProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        // Delete the profile
        const user = await User.findById(userId);
        if (!user.additionalDetails) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        await Profile.findByIdAndDelete(user.additionalDetails);

        
        user.additionalDetails = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting profile:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete profile",
            error: error.message
        });
    }
};


exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const userProfile = await User.findById(userId)
            .populate("additionalDetails")
            .populate("followers")
            .populate("following")
            .populate({
                path:"posts"
            });

        if (!userProfile) {
            return res.status(404).json({
                success: false,
                message: "User profile not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User profile retrieved successfully",
            profile: userProfile
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user profile",
            error: error.message
        });
    }
};




exports.followUser = async (req, res) => {
    try {
        const  userIdToFollow  = req.params.userId;
        const userId = req.user.id;

        const user = await User.findById(userId);
        const userToFollow = await User.findById(userIdToFollow);

        if (!userToFollow) {
            return res.status(404).json({ success: false, message: 'User to follow not found' });
        }

        if (user.following.includes(userIdToFollow)) {
            return res.status(400).json({ success: false, message: 'You are already following this user' });
        }

        user.following.push(userIdToFollow);
        await user.save();

        userToFollow.followers.push(userId);
        await userToFollow.save();

        res.status(200).json({ success: true, message: 'Successfully followed user', user: user });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ success: false, message: 'Failed to follow user', error: error.message });
    }
};




exports.unfollowUser = async (req, res) => {
    try {
        const userIdToUnfollow = req.params.userId;
        const userId = req.user.id;

        const user = await User.findById(userId);
        const userToUnfollow = await User.findById(userIdToUnfollow);

        if (!userToUnfollow) {
            return res.status(404).json({ success: false, message: 'User to unfollow not found' });
        }

        
        user.following = user.following.filter(id => id.toString() !== userIdToUnfollow);
        await user.save();

        
        userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== userId);
        await userToUnfollow.save();

        res.status(200).json({ success: true, message: 'Successfully unfollowed user', user: user });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ success: false, message: 'Failed to unfollow user', error: error.message });
    }
};

exports.followSuggestions = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate("following");

        const allUsers = await User.find().populate("following").populate("additionalDetails");

        if (user.following.length === 0) {
            console.log("allUsers ", allUsers)
            return res.status(200).json({
                success: true,
                message: "User hasn't followed anyone",
                suggestions: allUsers
            });
        }
        
        const followedUserIds = user.following.map(followedUser => followedUser._id.toString());

        
        const randomUserList = user.following.sort(() => 0.5 - Math.random()).slice(0, 10);

        let suggestions = new Set();

        for (let followedUser of randomUserList) {

            const list = await User.find({
                _id: { 
                    $ne: userId, 
                    $nin: followedUserIds 
                },
                followers: followedUser._id
            });

            
            list.forEach(user => suggestions.add(user._id));
        }

        
        const uniqueUserIds = Array.from(suggestions);

        
        let finalSuggestions = await User.find({ _id: { $in: uniqueUserIds } }).populate("additionalDetails");

        
        finalSuggestions = finalSuggestions.sort(() => 0.5 - Math.random()).slice(0, 10);

        
        res.status(200).json({
            success: true,
            suggestions: finalSuggestions,
            message: "Suggestions fetched successfully"
        });

    } catch (error) {
        console.error('Error generating follow suggestions:', error);
        res.status(500).json({ success: false, message: 'Error generating follow suggestions', error: error.message });
    }
}
