const { Server } = require("socket.io");
const MatchQueue = require("./models/matchQueue.model");
const Chat = require("./models/chat.model");
const User = require("./models/user.model");
const { aiReply } = require("./services/gemini.service");

let onlineUsers = new Map();
let userTimers = new Map();
let userRooms = new Map();
let supportExecutives = new Map(); // executiveId -> socketId
let supportRooms = new Map(); // userId -> room
let executivePointer = 1;
let waitingGirlRequests = new Map(); // userId -> timeout
let busyExecutives = new Set(); // executiveId busy
let girlRooms = new Map(); // userId -> room

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


  async function addToRandomQueue(socket, userId, lookingFor) {
    socket.emit("startRandomQueue", { userId, lookingFor });
  }


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

        } else if (room.startsWith("support-")) {
          console.log("🧑‍💼 Support message");

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

          io.to(room).emit("receiveMessage", {
            sender: sender.toString(),
            message,
            type,
            duration: duration || 0,
            timestamp: messageTimestamp
          });

          return;
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


        if (!room.startsWith("support-")) {
          socket.to(room).emit("partnerLeft", {
            message: "Your chat partner has left"
          });
        }


        if (room && room.startsWith("girl-")) {
          busyExecutives.delete(userId.toString());
        }

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


    // ==================== EXECUTIVE ONLINE ====================
    socket.on("executiveOnline", ({ executiveId }) => {
      console.log("🧑‍💼 Executive online:", executiveId);
      supportExecutives.set(executiveId.toString(), socket.id);
      busyExecutives.delete(executiveId.toString()); // mark free
    });


    // ==================== PAID GIRL CHAT REQUEST ====================
    socket.on("requestGirlChat", ({ userId, lookingFor = "female" }) => {
      console.log("💘 Girl chat requested:", userId);

      const freeExecutives = [...supportExecutives.entries()]
        .filter(([id]) => !busyExecutives.has(id));

      // no executive online
      if (freeExecutives.length === 0) {
        console.log("⚠️ No executive free -> fallback random");
        socket.emit("girlNotAvailable");
        socket.emit("joinQueue", { userId, lookingFor });
        console.log("🎲 Added to random queue:", userId);
        return;
      }

      // notify all free executives dashboard
      freeExecutives.forEach(([execId, sockId]) => {
        const execSocket = io.sockets.sockets.get(sockId);
        if (execSocket) {
          execSocket.emit("incomingGirlRequest", { userId });
        }
      });

      socket.emit("searchingGirl");

      // 20 sec fallback
      const timer = setTimeout(() => {
        console.log("⌛ No one accepted -> random", userId);
        waitingGirlRequests.delete(userId.toString());
        socket.emit("girlNotAvailable");
        socket.emit("joinQueue", { userId, lookingFor });
      }, 20000);

      waitingGirlRequests.set(userId.toString(), timer);
    });


    // ==================== EXECUTIVE ACCEPT GIRL CHAT ====================
    socket.on("acceptGirlChat", ({ executiveId, userId }) => {
      try {
        console.log("❤️ Executive accepted:", executiveId, "User:", userId);

        if (!waitingGirlRequests.has(userId.toString())) {
          console.log("⛔ Already taken by another executive");
          return;
        }

        // cancel fallback timer
        const timer = waitingGirlRequests.get(userId.toString());
        if (timer) {
          clearTimeout(timer);
          waitingGirlRequests.delete(userId.toString());
        }

        busyExecutives.add(executiveId.toString());

        const userSocketId = onlineUsers.get(userId.toString());
        if (!userSocketId) return;

        const userSocket = io.sockets.sockets.get(userSocketId);
        if (!userSocket) return;

        const room = `girl-${userId}-${Date.now()}`;
        girlRooms.set(userId.toString(), room);

        socket.join(room);
        userSocket.join(room);

        userRooms.set(userId.toString(), room);
        userRooms.set(executiveId.toString(), room);

        userSocket.emit("girlChatStarted", { room, executiveId });
        socket.emit("girlChatStarted", { room, userId });

        console.log("✅ Girl chat connected:", room);

      } catch (err) {
        console.log("acceptGirlChat error", err);
      }
    });

    // ==================== START SUPPORT CHAT ====================
    socket.on("startSupportChat", async ({ userId }) => {
      try {
        console.log("📞 User requesting support:", userId);



        const executives = [...supportExecutives.entries()];
        if (executives.length === 0) {
          socket.emit("noExecutive", { message: "No support available" });
          return;
        }

        const executiveEntry = executives[executivePointer % executives.length];
        executivePointer++;
        if (!executiveEntry) {
          socket.emit("noExecutive", { message: "No support available" });
          return;
        }

        const [executiveId, executiveSocketId] = executiveEntry;
        const room = `support-${userId}`;

        supportRooms.set(userId.toString(), room);

        userRooms.set(userId.toString(), room);
        userRooms.set(executiveId.toString(), room);

        socket.join(room);

        const executiveSocket = io.sockets.sockets.get(executiveSocketId);
        if (!executiveSocket) {
          socket.emit("noExecutive", { message: "Executive disconnected" });
          return;
        }

        executiveSocket.join(room);

        socket.emit("supportConnected", { room, executiveId });

        executiveSocket.emit("newSupportChat", {
          room,
          userId
        });

        console.log("✅ Support room created:", room);

      } catch (err) {
        console.log("❌ startSupportChat error", err);
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

        for (const [execId, sockId] of supportExecutives.entries()) {
          if (sockId === socket.id) {
            console.log("🧑‍💼 Executive offline:", execId);
            supportExecutives.delete(execId);
            busyExecutives.delete(execId); // ADD THIS
          }
        }


        const girlTimer = waitingGirlRequests.get(disconnectedUserId);
        if (girlTimer) {
          clearTimeout(girlTimer);
          waitingGirlRequests.delete(disconnectedUserId);
        }

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

    socket.on("joinSupportRoom", ({ room }) => {
      console.log("🧑‍💼 Executive rejoined:", room);
      socket.join(room);
    });

  });

  console.log("🚀 Socket.io initialized with video call support");
  return io;
};