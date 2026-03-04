import Message from '../models/chatModel.js';
import cloudinary from '../lib/cloudinary.js';
import { io, getReceiverSocketId } from '../lib/socket.js';

const getMessages = async(req, res) => {
	const { id: friendId } = req.params;
	const myid = req.user._id;
	
	try{
		const messages = await Message.find({
			$or: [
				{ senderId: myid, recieverId: friendId },
				{ senderId: friendId, recieverId: myid }
			]
		}).sort({ createdAt: 1 });

		await Message.updateMany(
			{ senderId: friendId, recieverId: myid, isRead: false },
			{ $set: { isRead: true } }
		);

		res.status(200).json(messages);
	} catch(error){
		console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
	}
};

const sendMessages = async(req, res) => {
	const { text, image } = req.body;
	const { id: recieverId } = req.params;
	const senderId = req.user._id;

	try{
		let imageUrl;
		if(image){
			const uploadResponse = await cloudinary.uploader.upload(image);
			imageUrl = uploadResponse.secure_url;
		}

		const newMessage = new Message({
			senderId,
			recieverId,
			text,
			image: imageUrl
		});

		await newMessage.save();

		const recieverSocketId = getReceiverSocketId(recieverId);
		if(recieverSocketId){
			io.to(recieverSocketId).emit("newMessage", newMessage);
		}

		res.status(200).json(newMessage);
	} catch(error){
		console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
	}
};

const getChatUsers = async(req, res) => {
	const myId = req.user._id;
	try {
		const conversations = await Message.aggregate([
			{ $match: { $or: [{ senderId: myId }, { recieverId: myId }] } },
			{ $sort: { createdAt: -1 } },
			
			{
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$senderId", myId] },
                            "$recieverId",
                            "$senderId"
                        ]
                    },
                    lastMessage: { $first: "$text" },
                    lastMessageTime: { $first: "$createdAt" },

                    unreadCount: {
                        $sum: {
                            $cond: [
                                { $and: [{ $eq: ["$recieverId", myId] }, { $eq: ["$isRead", false] }] },
                                1,
                                0
                            ]
                        }
                    }
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo"
                }
            },
            { $unwind: "$contactInfo" },

            {
                $project: {
                    _id: 1,
                    lastMessage: 1,
                    lastMessageTime: 1,
                    unreadCount: 1,
                    "contactInfo.username": 1,
                    "contactInfo.profilePic": 1,
                    "contactInfo.studentId": 1
                }
            }
        ]);

        res.status(200).json(conversations);
	} catch(error) {
		console.log("Error fetching conversations: ", error);
		res.status(500).json({ message: "Error fetching conversations" });
	}
};

const deleteMessage = async (req, res) => {
    const { id } = req.params;
    const myId = req.user._id;

    try {
        const message = await Message.findById(id);
        if (!message) return res.status(404).json({ message: "Message not found" });

        if (message.senderId.toString() !== myId.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await message.deleteOne();

        res.status(200).json({ message: "Message deleted" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export default { getMessages, sendMessages, getChatUsers, deleteMessage };