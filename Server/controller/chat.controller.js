const Chat = require("../models/chat.model.js");
const ChatsNew = require("../models/chatsNew.model.js")
const Message = require("../models/message.model.js");
const User = require("../models/user.model.js");
const { onlineUsers } = require("../socket/socketManager.js");


exports.fetchMessages = async (req, res) => {
  try {
    const roomId = req.params.roomId;

    const messages = await Chat.find({ chatRoom: roomId }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      messages,
    });

  } catch (error) {
    console.error("Chat fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};


exports.uploadChatMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File missing" });
    }

    const isAudio = req.file.mimetype.startsWith("audio");

    return res.status(200).json({
      success: true,
      url: req.file.path,
      messageType: isAudio ? "audio" : "image",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
};



exports.startChat = async (req, res) => {

  try {
    const userId = req.user.userId;
    const { friendId } = req.params;


    if (!friendId) {
      return res.status(400).json({
        success: false,
        message: "Friend ID is required",
      });
    }


    if (userId === friendId) {
      return res.status(400).json({
        success: false,
        message: "You cannot chat with yourself",
      });
    }

    const friend = await User.findById(friendId);


    if (!friend) {
      return res.status(404).json({
        success: false,
        message: "Friend not found",
      });
    }


    let chat = await ChatsNew.findOne({
      participants: { $all: [userId, friendId] },
    });


    if (!chat) {
      chat = await ChatsNew.create({
        participants: [userId, friendId],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Chat ready",
      chat,
    });



  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Upload failed" });

  }
}



exports.getOrCreateChat = async (req, res) => {

  try {

    const userId = req.user.userId;
    const { friendId } = req.params;


    //validation for friendId
    if (!friendId) {
      return res.status(400).json({
        success: false,
        message: "Friend ID is required",
      });
    }



    //find existing chat between the two users
    let chat = await ChatsNew.findOne({
      participants: { $all: [userId, friendId] },
    })


    //if no chat exists, create a new one
    if (!chat) {
      chat = await ChatsNew.create({
        participants: [userId, friendId],
      });
    }


    return res.status(200).json({
      success: true,
      message: "Chat ready",
      chat,
    });




  } catch (error) {


    console.error(error);
    res.status(500).json({ message: "getOrCreateChat failed" });

  }
}



exports.getChatMessages = async (req, res) => {

  try {

    const { chatId } = req.params;
    const userId = req.user.userId;

    // Validation
    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "Chat ID is required",
      });
    }

    const chat = await ChatsNew.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }


    // Check current user belongs to this chat
    if (!chat.participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }



    // Get all messages
    const messages = await Message.find({
      chat: chatId,
    })
      .populate("sender", "name profilePicture")
      .populate("receiver", "name profilePicture")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      messages,
    });



  } catch (error) {


    console.error(error);
    res.status(500).json({ message: "getChatMessages failed" });

  }
}



exports.getMyChats = async (req, res) => {
  try {
    const userId = req.user.userId;

    let { page = 1, limit = 20 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    // Validation
    if (page < 1 || isNaN(page)) {
      return res.status(400).json({
        success: false,
        message: "Invalid page number",
      });
    }

    if (limit < 1 || limit > 20 || isNaN(limit)) {
      return res.status(400).json({
        success: false,
        message: "Limit must be between 1 and 20",
      });
    }

    const totalChats = await ChatsNew.countDocuments({
      participants: userId,
    });

    const chats = await ChatsNew.find({
      participants: userId,
    })
      .populate("participants", "name profilePicture")
      .sort({ lastMessageAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const history = chats.map((chat) => {
      const friend = chat.participants.find(
        (p) => p._id.toString() !== userId.toString()
      );

      function formatWhatsAppDate(date) {
        const messageDate = new Date(date);
        const now = new Date();

        // Same day
        if (messageDate.toDateString() === now.toDateString()) {
          return messageDate.toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
        }

        // Yesterday
        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);

        if (messageDate.toDateString() === yesterday.toDateString()) {
          return "Yesterday";
        }

        // Same year
        if (messageDate.getFullYear() === now.getFullYear()) {
          return messageDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          });
        }

        // Different year
        return messageDate.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      }

      return {
        chatId: chat._id,
        friendId: friend?._id,
        name: friend?.name,
        profilePicture: friend?.profilePicture,
        online: friend
          ? onlineUsers.has(friend._id.toString())
          : false,
        lastMessage: chat.lastMessage,
        lastMessageAt: formatWhatsAppDate(chat.lastMessageAt),
      };
    });

    return res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalChats / limit),
      totalChats,
      hasNextPage: page * limit < totalChats,
      hasPreviousPage: page > 1,
      chats: history,
    });
  } catch (error) {
    console.error("getMyChats:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};