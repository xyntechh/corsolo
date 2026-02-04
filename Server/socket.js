const { Server } = require("socket.io");
const MatchQueue = require("./models/matchQueue.model");
const Chat = require("./models/chat.model");
const User = require("./models/user.model");
const { aiReply } = require("./services/gemini.service");

let onlineUsers = new Map();
let userTimers = new Map();
let userRooms = new Map();

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000
  });

  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    // ==================== JOIN QUEUE ====================
    socket.on("joinQueue", async ({ userId, lookingFor }) => {
      try {
        console.log("🔍 joinQueue:", { userId, lookingFor });

        if (!userId) {
          socket.emit("error", { message: "No userId provided" });
          return;
        }

        onlineUsers.set(userId.toString(), socket.id);

        await User.findByIdAndUpdate(userId, {
          isOnline: true,
          socketId: socket.id
        });

        if (userTimers.has(userId.toString())) {
          clearTimeout(userTimers.get(userId.toString()));
          userTimers.delete(userId.toString());
        }

        await MatchQueue.deleteMany({ userId });

        const currentUser = await User.findById(userId).select('name age gender');
        const waitingUsers = await MatchQueue.find({ userId: { $ne: userId } })
          .populate('userId', 'name age gender')
          .sort({ createdAt: 1 });

        let partner = null;

        console.log("🔍 Waiting users:", waitingUsers.length);

        for (let user of waitingUsers) {
          if (lookingFor === "female" && user.userId.gender !== "Female") continue;
          if (lookingFor === "male" && user.userId.gender !== "Male") continue;
          partner = user;
          break;
        }

        if (partner) {
          const room = `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

          console.log("🎉 MATCH FOUND!");
          console.log("User 1:", currentUser?.name);
          console.log("User 2:", partner.userId.name);
          console.log("Room:", room);

          if (userTimers.has(partner.userId._id.toString())) {
            clearTimeout(userTimers.get(partner.userId._id.toString()));
            userTimers.delete(partner.userId._id.toString());
          }

          userRooms.set(userId.toString(), room);
          userRooms.set(partner.userId._id.toString(), room);

          const partnerSocket = io.sockets.sockets.get(partner.socketId);

          if (!partnerSocket) {
            console.log("❌ Partner socket missing");
            await MatchQueue.deleteOne({ userId: partner.userId._id });

            await MatchQueue.create({
              userId,
              socketId: socket.id,
              lookingFor,
              createdAt: new Date(),
              gender: currentUser.gender,
            });

            socket.emit("queueStatus", {
              status: "waiting",
              message: "Looking for a match..."
            });

            const timer = setTimeout(async () => {
              const stillWaiting = await MatchQueue.findOne({ userId });
              if (!stillWaiting) {
                userTimers.delete(userId.toString());
                return;
              }

              const aiRoom = `ai-${userId}-${Date.now()}`;
              userRooms.set(userId.toString(), aiRoom);

              socket.join(aiRoom);
              socket.emit("aiChatStart", {
                room: aiRoom,
                message: "No match found. Starting AI chat..."
              });

              await MatchQueue.deleteOne({ userId });
              userTimers.delete(userId.toString());
            }, 60000);

            userTimers.set(userId.toString(), timer);
            return;
          }

          socket.join(room);
          partnerSocket.join(room);
          console.log("✅ Both joined room:", room);

          const matchData1 = {
            room,
            partnerId: partner.userId._id.toString(),
            partner: {
              id: partner.userId._id.toString(),
              name: partner.userId.name || `User ${partner.userId._id.toString().substring(0, 8)}`
            }
          };

          const matchData2 = {
            room,
            partnerId: userId.toString(),
            partner: {
              id: userId.toString(),
              name: currentUser?.name || `User ${userId.toString().substring(0, 8)}`
            }
          };

          socket.emit("matchFound", matchData1);
          partnerSocket.emit("matchFound", matchData2);

          await MatchQueue.deleteMany({
            $or: [{ userId }, { userId: partner.userId._id }]
          });

        } else {
          console.log("⏳ Adding to queue:", userId);

          await MatchQueue.create({
            userId,
            socketId: socket.id,
            lookingFor,
            createdAt: new Date(),
            gender: currentUser.gender,
          });

          socket.emit("queueStatus", {
            status: "waiting",
            message: "Looking for a match..."
          });

          const timer = setTimeout(async () => {
            try {
              const stillWaiting = await MatchQueue.findOne({ userId });

              if (!stillWaiting) {
                userTimers.delete(userId.toString());
                return;
              }

              console.log("⏰ Starting AI chat:", userId);

              const aiRoom = `ai-${userId}-${Date.now()}`;
              userRooms.set(userId.toString(), aiRoom);

              socket.join(aiRoom);
              socket.emit("aiChatStart", {
                room: aiRoom,
                message: "No match found. Starting AI chat..."
              });

              await MatchQueue.deleteOne({ userId });
              userTimers.delete(userId.toString());

            } catch (error) {
              console.error("❌ Timer error:", error);
            }
          }, 60000);

          userTimers.set(userId.toString(), timer);
        }

      } catch (error) {
        console.error("❌ joinQueue error:", error);
        socket.emit("error", { message: "Failed to join queue" });
      }
    });

    // ==================== SEND MESSAGE ====================
    socket.on("sendMessage", async ({ room, sender, reciver, message, type = "text", duration, timestamp }) => {
      try {
        console.log("💬 sendMessage received:", {
          room,
          sender,
          type,
          hasMessage: !!message,
          duration
        });

        if (!room || !sender) {
          socket.emit("error", { message: "Invalid message data" });
          return;
        }

        if (!message || message.trim() === "") {
          socket.emit("error", { message: "Message content required" });
          return;
        }

        const messageTimestamp = timestamp || new Date();

        if (room.startsWith("ai-")) {
          console.log("🤖 AI chat message");

          await Chat.create({
            chatRoom: room,
            sender,
            reciver,
            message,
            type,
            duration: duration || 0,
            isAI: false,
            timestamp: messageTimestamp
          });

          const messageData = {
            sender: sender.toString(),
            message,
            type,
            duration: duration || 0,
            timestamp: messageTimestamp,
          };

          socket.to(room).emit("receiveMessage", messageData);

          if (type === "text") {
            try {
              const reply = await aiReply(message);
              console.log("🤖 AI reply generated");

              setTimeout(() => {
                socket.emit("receiveMessage", {
                  sender: "AI",
                  message: reply,
                  type: "text",
                  timestamp: new Date()
                });
              }, 1000);

              await Chat.create({
                chatRoom: room,
                message: reply,
                reciver: sender,
                type: "text",
                isAI: true
              });

            } catch (error) {
              console.error("❌ AI error:", error);
              socket.emit("receiveMessage", {
                sender: "AI",
                message: "Sorry, I'm having trouble responding.",
                type: "text",
                timestamp: new Date()
              });
            }
          }

        } else {
          console.log("👥 User-to-user message");

          await Chat.create({
            chatRoom: room,
            sender,
            reciver,
            message,
            type,
            duration: duration || 0,
            isAI: false,
            timestamp: messageTimestamp
          });

          const messageData = {
            sender: sender.toString(),
            message,
            type,
            duration: duration || 0,
            timestamp: messageTimestamp
          };

          console.log("📤 Broadcasting to room:", room);
          socket.to(room).emit("receiveMessage", messageData);
          console.log(`✅ ${type} message broadcast complete`);
        }

      } catch (error) {
        console.error("❌ sendMessage error:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // ==================== LEAVE ROOM ====================
    socket.on("leaveRoom", async ({ userId, room }) => {
      try {
        console.log("👋 Leaving room:", { userId, room });

        socket.leave(room);
        userRooms.delete(userId.toString());

        await User.findByIdAndUpdate(userId, {
          socketId: null
        });

        socket.to(room).emit("partnerLeft", {
          message: "Your chat partner has left"
        });

        console.log("✅ User left and partner notified");

      } catch (error) {
        console.error("❌ leaveRoom error:", error);
      }
    });

    // ==================== VIDEO CALL: INITIATE CALL ====================
    socket.on("callUser", ({ fromUserId, toUserId, room, offer }) => {
      try {
        console.log("📞 Call request from:", fromUserId, "to:", toUserId);

        const partnerSocketId = onlineUsers.get(toUserId.toString());

        if (!partnerSocketId) {
          socket.emit("callFailed", { message: "User is offline" });
          console.log("❌ Partner offline");
          return;
        }

        const partnerSocket = io.sockets.sockets.get(partnerSocketId);
        
        if (!partnerSocket) {
          socket.emit("callFailed", { message: "User disconnected" });
          console.log("❌ Partner socket not found");
          return;
        }

        console.log("✅ Sending call to partner");

        partnerSocket.emit("incomingCall", {
          fromUserId,
          room,
          offer
        });

      } catch (error) {
        console.error("❌ callUser error:", error);
        socket.emit("callFailed", { message: "Call failed to initiate" });
      }
    });

    // ==================== VIDEO CALL: ACCEPT CALL ====================
    socket.on("acceptCall", ({ room, answer }) => {
      try {
        console.log("✅ Call accepted in room:", room);
        
        socket.join(room);
        socket.to(room).emit("callAccepted", { answer });

        console.log("📞 Call connected successfully");

      } catch (error) {
        console.error("❌ acceptCall error:", error);
      }
    });

    // ==================== VIDEO CALL: REJECT CALL ====================
    socket.on("rejectCall", ({ room }) => {
      try {
        console.log("❌ Call rejected in room:", room);
        
        socket.to(room).emit("callRejected");

      } catch (error) {
        console.error("❌ rejectCall error:", error);
      }
    });

    // ==================== VIDEO CALL: END CALL ====================
    socket.on("endCall", ({ room }) => {
      try {
        console.log("📞 Call ended in room:", room);
        
        socket.to(room).emit("callEnded");

      } catch (error) {
        console.error("❌ endCall error:", error);
      }
    });

    // ==================== WEBRTC SIGNALING ====================
    socket.on("webrtcSignal", ({ room, data }) => {
      try {
        console.log("📡 WebRTC signal in room:", room, "Type:", data.type);
        
        socket.to(room).emit("webrtcSignal", { data });

      } catch (error) {
        console.error("❌ webrtcSignal error:", error);
      }
    });

    // ==================== DISCONNECT ====================
    socket.on("disconnect", async () => {
      try {
        console.log("🔌 Disconnected:", socket.id);

        let disconnectedUserId = null;

        onlineUsers.forEach((socketId, userId) => {
          if (socketId === socket.id) {
            disconnectedUserId = userId;
          }
        });

        if (disconnectedUserId) {
          console.log("👤 Disconnected user:", disconnectedUserId);

          const room = userRooms.get(disconnectedUserId);
          if (room) {
            socket.to(room).emit("partnerLeft", {
              message: "Your chat partner disconnected"
            });
            
            socket.to(room).emit("callEnded");
          }

          onlineUsers.delete(disconnectedUserId);

          await User.findByIdAndUpdate(disconnectedUserId, {
            isOnline: false,
            socketId: null
          });

          if (userTimers.has(disconnectedUserId)) {
            clearTimeout(userTimers.get(disconnectedUserId));
            userTimers.delete(disconnectedUserId);
          }

          userRooms.delete(disconnectedUserId);

          await MatchQueue.deleteOne({ userId: disconnectedUserId });
          console.log("🗑️ Removed from queue");
        }

      } catch (error) {
        console.error("❌ Disconnect error:", error);
      }
    });

  });

  console.log("🚀 Socket.io initialized with video call support");
  return io;
};