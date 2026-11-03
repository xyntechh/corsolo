const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    seen: {
      type: Boolean,
      default: false,
    },

    delivered: {
      type: Boolean,
      default: false,
    },


    mediaUrl: {
      type: String,
      default: null,
    },

    messageType: { type: String, enum: ['text', 'image', 'audio', 'snap'], default: 'text' },
    snapId: { type: mongoose.Schema.Types.ObjectId, ref: 'Snap' },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);