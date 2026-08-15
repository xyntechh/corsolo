const express = require("express");
const router = express.Router();
const { registerUser, updateUser, getUserInfo, debitUserCoin, login, signUp, forgetPassword, resetPassword, getFriends, acceptFriendRequest, rejectFriendRequest, pendingFriendRequest } = require("../controller/user.controller.js");
const authMiddleware = require("../middleware/auth.js")
const { findMatch } = require("../controller/match.controller.js");
const { fetchMessages, uploadChatMedia } = require("../controller/chat.controller.js");
const upload = require("../middleware/upload.js")
const { startChat, getOrCreateChat , getChatMessages , getMyChats} = require("../controller/chat.controller.js");

router.post("/start-chat/:friendId", authMiddleware, startChat);


router.get("/get-or-create-chat/:friendId", authMiddleware, getOrCreateChat);
router.get("/chat-messages/:chatId", authMiddleware, getChatMessages);
router.get("/my-chats", authMiddleware, getMyChats);
module.exports = router;
