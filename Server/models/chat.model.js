// models/chat.model.js
const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  chatRoom: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reciver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: { type: String, required: true },
  mediaUrl: String, // image / audio URL
  messageType: {
    type: String,
    enum: ["text", "image", "audio"],
    default: "text",
  },
  isAI: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Chat", ChatSchema);
