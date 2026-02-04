const Chat = require("../models/chat.model.js");

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
      type: isAudio ? "audio" : "image",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
};

