// controllers/match.controller.js
const MatchQueue = require("../models/matchQueue.model");
const User = require("../models/user.model")
const jwt = require("jsonwebtoken");

exports.findMatch = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("gender lookingFor");

    // User ko queue me add krna
    await MatchQueue.findOneAndUpdate(
      { userId },
      { lookingFor: user.lookingFor },
      { upsert: true, new: true }
    );

    // Doosra user find krna jo is user se match ho
    const matchUser = await MatchQueue.findOne({
      userId: { $ne: userId },
      lookingFor: user.gender
    });

    if (!matchUser) {
      return res.json({ success: false, message: "Searching..." });
    }

    return res.json({
      success: true,
      message: "Match Found!",
      matchUser
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

