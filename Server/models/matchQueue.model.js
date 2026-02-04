// models/matchQueue.model.js
const mongoose = require("mongoose");

const MatchQueueSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lookingFor: { type: String },
  timestamp: { type: Date, default: Date.now },
  socketId: { type: String }
});

module.exports = mongoose.model("MatchQueue", MatchQueueSchema);
