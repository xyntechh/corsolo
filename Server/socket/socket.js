const { Server } = require("socket.io");
const dotenv = require("dotenv");
const queues = require("./queue.js");

const chatsNew = require("../models/chatsNew.model.js");
const Message = require("../models/message.model.js");

const { setIO, onlineUsers } = require("./socketManager");

dotenv.config();

const FriendRequest = require("../models/FriendRequest.js");
const User = require("../models/user.model.js");

const waitingUsers = new Map();
const activeChats = new Map();
const lastPartnerMap = new Map();

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.emit("onlineUsers", io.engine.clientsCount);
  setIO(io);

  // ── HELPER 1: kisi socket ko SAARI queues (random + male + female) se remove karo
  function removeFromAllQueues(socketId) {
    for (const key of Object.keys(queues)) {
      const index = queues[key].findIndex((u) => u.socketId === socketId);
      if (index !== -1) queues[key].splice(index, 1);
    }
  }

  // ── HELPER 2: user ko queue me daalo aur 30s ka timeout set karo
  function enqueueWaiting(io, socket, data) {
    const entry = { socketId: socket.id, ...data };

    // hamesha random queue me daalo
    queues.random.push(entry);

    // agar apna gender wali queue exist karti hai (male/female), usme bhi daalo
    if (queues[data.gender]) {
      queues[data.gender].push(entry);
    }

    const timeout = setTimeout(() => {
      removeFromAllQueues(socket.id);
      waitingUsers.delete(socket.id);
      socket.emit("waitingOver");
    }, 30000);

    console.log(data.gender);
    console.log(queues);

    waitingUsers.set(socket.id, { timeout });
    socket.emit("waitingForMatch", { waiting: true });
  }

  // ── HELPER 3: mutual match check — candidate bhi mujhse match karna chahta ho
  function theyWantMe(candidate, myData) {
    return candidate.mode === "random" || candidate.mode === myData.gender;
  }

  // ── MAIN MATCHING FUNCTION
  async function tryMatch(io, socket, data) {
    console.log("🔎 Trying to match:", data);

    const searchQueue =
      data.mode === "random" ? queues.random : queues[data.mode];

    if (!searchQueue || searchQueue.length === 0) {
      enqueueWaiting(io, socket, data);
      return;
    }

    const lastPartnerId = lastPartnerMap.get(socket.id);

    const candidateIndex = searchQueue.findIndex((u) => {
      if (u.socketId === socket.id) return false;
      if (u.socketId === lastPartnerId) return false;
      return theyWantMe(u, data);
    });

    if (candidateIndex === -1) {
      enqueueWaiting(io, socket, data);
      return;
    }

    const partner = searchQueue[candidateIndex];

    removeFromAllQueues(partner.socketId);

    const partnerUser = waitingUsers.get(partner.socketId);
    if (partnerUser) {
      clearTimeout(partnerUser.timeout);
      waitingUsers.delete(partner.socketId);
    }
    waitingUsers.delete(socket.id);

    const partnerSocket = io.sockets.sockets.get(partner.socketId);
    if (!partnerSocket) return;

    const chat = await chatsNew.create({
      participants: [data.userId, partner.userId],
      chatType: "random",
    });

    const roomId = chat._id.toString();
    socket.join(roomId);
    partnerSocket.join(roomId);

    const friendRequest = await FriendRequest.findOne({
      $or: [
        { sender: data.userId, receiver: partner.userId, status: "pending" },
        { sender: partner.userId, receiver: data.userId, status: "pending" },
      ],
    });

    const friend1Status = await getFriendStatus(data.userId, partner.userId);
    const friend2Status = await getFriendStatus(partner.userId, data.userId);

    socket.emit("matched", {
      roomId,
      partnerName: partner.partnerName,
      partnerId: partner.userId,
      chatId: chat._id,
      friendStatus: friend1Status,
      friendRequestId: friendRequest?._id || null,
    });

    partnerSocket.emit("matched", {
      roomId,
      partnerName: data.partnerName,
      partnerId: data.userId,
      chatId: chat._id,
      friendStatus: friend2Status,
      friendRequestId: friendRequest?._id || null,
    });

    activeChats.set(socket.id, { roomId, partnerSocketId: partner.socketId });
    activeChats.set(partner.socketId, { roomId, partnerSocketId: socket.id });

    lastPartnerMap.delete(socket.id);
    lastPartnerMap.delete(partner.socketId);
  }

  const getFriendStatus = async (userId, partnerId) => {
    const user = await User.findById(userId).select("friends");

    const isFriend = user?.friends?.some(
      (id) => id.toString() === partnerId.toString()
    );

    if (isFriend) return "friends";

    const request = await FriendRequest.findOne({
      $or: [
        { sender: userId, receiver: partnerId, status: "pending" },
        { sender: partnerId, receiver: userId, status: "pending" },
      ],
    });

    if (!request) return "none";

    if (request.sender.toString() === userId.toString()) {
      return "pending_sent";
    }
    return "pending_received";
  };

  io.on("connection", (socket) => {
    console.log("✅ User Connected");
    console.log("Socket ID:", socket.id);

    socket.on("registerUser", (userId) => {
      if (!userId) return;
      onlineUsers.set(userId, socket.id);
      io.emit("onlineStatusChanged", { userId, online: true });
    });

    socket.on("startChat", async (data) => {
      if (waitingUsers.has(socket.id)) {
        return socket.emit("alreadyWaiting");
      }

      if (["random", "male", "female"].includes(data.mode)) {
        await tryMatch(io, socket, data);
      }
    });

    socket.on("skipChat", async (data) => {
      const chat = activeChats.get(socket.id);

      if (chat) {
        socket.leave(chat.roomId);
        activeChats.delete(socket.id);

        lastPartnerMap.set(socket.id, chat.partnerSocketId);
        lastPartnerMap.set(chat.partnerSocketId, socket.id);

        const partnerSocket = io.sockets.sockets.get(chat.partnerSocketId);
        if (partnerSocket) {
          partnerSocket.leave(chat.roomId);
          activeChats.delete(chat.partnerSocketId);
          partnerSocket.emit("partnerSkipped");
        }
      }

      await tryMatch(io, socket, data);
    });

    socket.on("exitChat", () => {
      const chat = activeChats.get(socket.id);

      if (chat) {
        socket.leave(chat.roomId);
        activeChats.delete(socket.id);

        const partnerSocket = io.sockets.sockets.get(chat.partnerSocketId);
        if (partnerSocket) {
          partnerSocket.leave(chat.roomId);
          activeChats.delete(chat.partnerSocketId);
          partnerSocket.emit("partnerSkipped");
        }
      }

      removeFromAllQueues(socket.id);

      const waiting = waitingUsers.get(socket.id);
      if (waiting) clearTimeout(waiting.timeout);
      waitingUsers.delete(socket.id);
    });

    socket.on("disconnect", () => {
      const chat = activeChats.get(socket.id);

      if (chat) {
        const partnerSocket = io.sockets.sockets.get(chat.partnerSocketId);
        if (partnerSocket) {
          partnerSocket.emit("partnerDisconnected");
        }
        activeChats.delete(socket.id);
        activeChats.delete(chat.partnerSocketId);
      }

      removeFromAllQueues(socket.id);

      const user = waitingUsers.get(socket.id);
      if (user) clearTimeout(user.timeout);
      waitingUsers.delete(socket.id);

      io.emit("onlineUsers", io.engine.clientsCount);

      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          io.emit("onlineStatusChanged", { userId, online: false });
          break;
        }
      }

      lastPartnerMap.delete(socket.id);
    });

    socket.on("sendMessage", async (data) => {
      try {
        const newMessage = await Message.create({
          chat: data.chatId,
          sender: data.senderId,
          receiver: data.receiverId,
          message: data.message || "null",
          delivered: true,
          messageType: data.messageType || "text",
          mediaUrl: data.mediaUrl || null,
        });

        await chatsNew.findByIdAndUpdate(data.chatId, {
          lastMessage: data.messageType === "text" ? data.message : `📎 ${data.messageType}`,
          lastMessageSender: data.senderId,
          lastMessageAt: new Date(),
        });

        const messageObj = newMessage.toObject();

        io.to(data.roomId).emit("receiveMessage", {
          ...messageObj,
          sender: messageObj.sender.toString(),
          receiver: messageObj.receiver.toString(),
          senderName: data.senderName,
        });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("sendFriendRequest", async (data) => {
      try {
        const existingRequest = await FriendRequest.findOne({
          sender: data.senderId,
          receiver: data.receiverId,
          status: "pending",
        });

        if (existingRequest) {
          socket.emit("friendRequestError", {
            message: "Friend request already sent",
          });
          return;
        }

        const request = await FriendRequest.create({
          sender: data.senderId,
          receiver: data.receiverId,
        });

        const populatedRequest = await request.populate(
          "sender",
          "name profilePicture"
        );

        socket.emit("friendRequestSent", {
          requestId: request._id,
          receiverId: data.receiverId,
        });

        const receiverSocketId = onlineUsers.get(data.receiverId.toString());

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newFriendRequest", populatedRequest);
        }
      } catch (err) {
        console.log("sendFriendRequest:", err);
        socket.emit("friendRequestError", {
          message: "Failed to send friend request",
        });
      }
    });

    socket.on("cancelMatch", () => {
      removeFromAllQueues(socket.id);

      const waiting = waitingUsers.get(socket.id);
      if (waiting) clearTimeout(waiting.timeout);
      waitingUsers.delete(socket.id);

      socket.emit("matchCancelled");
      console.log(`❌ User ${socket.id} cancelled matchmaking`);
    });

    socket.on("joinRoom", (chatId) => {
      socket.join(chatId);
    });
  });
};