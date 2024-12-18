import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
// Users for sidebar

export const getUsersForSidebar = async (req, res) => {

    try {
        const loggenInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggenInUserId}}).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error during fetching users: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Message history

export const getMessages = async (req, res) => {

    try {
        const {id:userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ]
        })

        res.status(200).json({messages});

    } catch (error) {
        console.error("Error during getMessage controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Send message

export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const {id: userToChatId} = req.params;
        const myId = req.user._id;

        let imageUrl;
        if(imageUrl){
            const uploadResponse = await cloudinary.uploader.upload(imageUrl);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId: myId,
            receiverId: userToChatId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        // socket.io implementation to be done here
        const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

        res.status(200).json(newMessage);

    } catch (error) {
        console.error("Error during sendMessage controller: ", error);
        res.status(500).json({message: "Internal server error"})
    }
};