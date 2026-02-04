const express = require("express");
const router = express.Router();
const { registerUser, updateUser, getUserInfo, debitUserCoin, login , signUp } = require("../controller/user.controller.js");
const authMiddleware = require("../middleware/auth.js")
const { findMatch } = require("../controller/match.controller.js");
const { fetchMessages,  uploadChatMedia } = require("../controller/chat.controller.js");
const upload = require("../middleware/upload.js")

router.post("/register", registerUser);
router.put("/update", authMiddleware, updateUser);
router.get("/getUserInfo", authMiddleware, getUserInfo)



// Find Match
router.post("/match", authMiddleware, findMatch);

// Get Chat Messages by Room ID
router.get("/chat/:roomId", authMiddleware, fetchMessages);

router.post('/debit', authMiddleware, debitUserCoin);

router.post("/login", login)

router.post("/signUp", signUp )


router.post(
  "/upload-chat-media",
  authMiddleware,
  upload.single("file"),
  uploadChatMedia
);


module.exports = router;
