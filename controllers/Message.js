const Conversation = require("../modals/Conversation");
const Message = require("../modals/Message");
const User = require("../modals/User");
const mongoose = require("mongoose")

exports.sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, conversationId, message } = req.body;

        let convId = conversationId;

        if (!convId) {
            let conversation = await Conversation.findOne({ members: { $all: [senderId, receiverId] } });

            if (!conversation) {
                conversation = new Conversation({ members: [senderId, receiverId] });
                await conversation.save();
            }

            convId = conversation._id;
        }

        const newMessage = new Message({ conversationId: convId, senderId, receiverId, message });
        await newMessage.save();

        return res.status(200).json({
            success: true,
            message: "Message sent successfully"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error in sending message",
            error: error.message
        });
    }
};


exports.getMessage = async (req, res) => {
    try {
        const {senderId, receiverId} = req.body;
        const convId = await Conversation.findOne({members: {$all : [senderId,receiverId]}});
        if(!convId){
            return res.status(400).json({
                success:false,
                message:"You havn't started conversion yet"
            })
        }

        const message = await Message.find({conversationId:convId});
        if(!message)
        {
            return res.status(400).json({
                success:false,
                message:"There is no any message"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Message fetched successfully",
            chat : message
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error in fetching message",
            error: error.message
        });
    }
}

exports.getMessagedUser = async (req, res) => {
    try {
        const { senderId } = req.body;

        if (!senderId) {
            return res.status(400).json({
                success: false,
                message: "Sender ID is not received",
            });
        }

        
        const objectIdSenderId = new mongoose.Types.ObjectId(senderId);

        
        console.log(`Searching for conversations with senderId: ${objectIdSenderId}`);

        
        const user = await Conversation.find({ 'members.0': objectIdSenderId }).populate('members');;

        
        console.log(`Conversations found: ${JSON.stringify(user)}`);

        if (user.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No messages found for the given sender ID",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User found successfully",
            user: user,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error in fetching user",
            error: error.message,
        });
    }
};