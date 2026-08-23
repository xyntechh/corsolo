const { Server } = require("socket.io");
const dotenv = require("dotenv");
const queues = require("./queue.js");


const chatsNew = require("../models/chatsNew.model.js")
const Message = require("../models/message.model.js")

const {
  setIO,
  onlineUsers,
} = require("./socketManager");

dotenv.config();

const FriendRequest = require("../models/FriendRequest.js");
const User = require("../models/user.model.js");

const waitingUsers = new Map();
const activeChats = new Map();
const lastPartnerMap = new Map();



module.exports = (server) => {



  //CHECKING SOCKET CONNECTED AUR NOT
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.emit("onlineUsers", io.engine.clientsCount);

  setIO(io);



  function enqueueWaiting(io, socket, data) {
    queues.random.push({ socketId: socket.id, ...data });

    const timeout = setTimeout(() => {
      const index = queues.random.findIndex(u => u.socketId === socket.id);
      if (index !== -1) {
        queues.random.splice(index, 1);
        waitingUsers.delete(socket.id);
        socket.emit("waitingOver");
      }
    }, 30000);

    waitingUsers.set(socket.id, { timeout });
    socket.emit("waitingForMatch", { waiting: true });
  }

  // reusable matchmaking function
  async function tryMatch(io, socket, data) {
    if (queues.random.length === 0) {
      enqueueWaiting(io, socket, data);
      return;
    }

    // ✅ apna last partner chhod ke koi aur candidate dhundo
    const lastPartnerId = lastPartnerMap.get(socket.id);
    const candidateIndex = queues.random.findIndex(
      (u) => u.socketId !== lastPartnerId
    );

    if (candidateIndex === -1) {
      // sirf wahi purana partner available hai -> match mat karo, wait karo
      enqueueWaiting(io, socket, data);
      return;
    }

    const partner = queues.random.splice(candidateIndex, 1)[0];
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
        {
          sender: data.userId,
          receiver: partner.userId,
          status: "pending",
        },
        {
          sender: partner.userId,
          receiver: data.userId,
          status: "pending",
        },
      ],
    });

    const friend1Status = await getFriendStatus(
      data.userId,
      partner.userId
    );


    const friend2Status = await getFriendStatus(
      partner.userId,
      data.userId
    );

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

    // ✅ naya match ho gaya, purani "last partner" restriction clear kardo
    lastPartnerMap.delete(socket.id);
    lastPartnerMap.delete(partner.socketId);
  }


  const getFriendStatus = async (userId, partnerId) => {
    // 1. Already friends?
    const user = await User.findById(userId).select("friends");

    const isFriend = user?.friends?.some(
      (id) => id.toString() === partnerId.toString()
    );

    if (isFriend) {
      return "friends";
    }

    // 2. Check pending request
    const request = await FriendRequest.findOne({
      $or: [
        {
          sender: userId,
          receiver: partnerId,
          status: "pending",
        },
        {
          sender: partnerId,
          receiver: userId,
          status: "pending",
        },
      ],
    });

    if (!request) {
      return "none";
    }

    // Me -> Partner
    if (request.sender.toString() === userId.toString()) {
      return "pending_sent";
    }

    // Partner -> Me
    return "pending_received";
  };






  io.on("connection", (socket) => {
    console.log("✅ User Connected"); //USER CONTTECTED 
    console.log("Socket ID:", socket.id); // USER SOCKET ID 


    socket.on("registerUser", (userId) => {
      if (!userId) {
        return;
      }
      onlineUsers.set(userId, socket.id);

      io.emit("onlineStatusChanged", {
        userId,
        online: true,
      });
    });



    //START FIRST CHAT 
    socket.on("startChat", async (data) => {


      //validating the duplicate user in queues
      /*   if (waitingUsers.has(socket.id)) {
           return socket.emit("alreadyWaiting")
         }
   
   
         //checking the queues mode 
         if (data.mode === "random") {
   
           //cheking queues is empty aur not 
           if (queues.random.length === 0) {
   
             //if empty then adding in the queues
             queues.random.push({
               socketId: socket.id,
               ...data
             })
   
   
   
   
             //seting the limit of 30 sec after 30 sec user will automactly removed from the queues
             const timeout = setTimeout(() => {
   
               const index = queues.random.findIndex(
                 user => user.socketId === socket.id
               );
   
               if (index !== -1) {
   
                 // removed from queues
                 queues.random.splice(index, 1);
   
                 // removefrom waiting list
                 waitingUsers.delete(socket.id);
   
                 // sending a message to frontend
                 socket.emit("waitingOver");
   
               }
   
             }, 30000);
   
   
             //adiding in the watinguser validation
             waitingUsers.set(socket.id, {
   
               timeout
   
             });
   
             //sending a message to frontend like we are wating a matched
             socket.emit("waitingForMatch", {
               waiting: true
             });
   
             //if we found partner 
           } else {
             const partner = queues.random.shift();
             const partnerUser = waitingUsers.get(partner.socketId);
   
   
             if (partnerUser) {
               clearTimeout(partnerUser.timeout);
               waitingUsers.delete(partner.socketId);
             }
   
   
             waitingUsers.delete(socket.id);
   
   
   
   
   
   
             //finding a partner socket id 
             const partnerSocket = io.sockets.sockets.get(partner.socketId)
             if (!partnerSocket) {
               return;
             }
   
             //creating a new chat in the database
             const chat = await chatsNew.create({
               participants: [data.userId, partner.userId],
               chatType: "random"
             });
   
   
             //creating a RoomId
             const roomId = chat._id.toString();
   
             //joining a both patner and current user in room
   
             socket.join(roomId)
             partnerSocket.join(roomId)
   
   
             //sending a message to frontend like we found a matched
             socket.emit("matched", {
               roomId,
               partnerName: partner.partnerName,
               partnerId: partner.userId,
               chatId: chat._id,
             });
   
             partnerSocket.emit("matched", {
               roomId,
               partnerName: data.partnerName,
               partnerId: data.userId,
               chatId: chat._id,
             });
   
   
             //adding in active chat 
   
             activeChats.set(socket.id, {
               roomId,
               partnerSocketId: partner.socketId
             });
   
             activeChats.set(partner.socketId, {
               roomId,
               partnerSocketId: socket.id
             });
   
   
   
   
   
   
           }
   
         }
   
         */



      if (waitingUsers.has(socket.id)) {
        return socket.emit("alreadyWaiting");
      }

      if (data.mode === "random") {
        await tryMatch(io, socket, data);
      }

    })


    // SKIP -> current room chhodo, khud ko wapas queue me daalo, partner ko bhi bhej do
    socket.on("skipChat", async (data) => {
      const chat = activeChats.get(socket.id);

      if (chat) {
        socket.leave(chat.roomId);
        activeChats.delete(socket.id);

        // ✅ dono taraf record kar do ki abhi kiske sath the
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

    // EXIT -> room chhodo, partner ko batao, khud requeue NAHI hoga
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

      // agar khud queue me hi tha (edge case), usse bhi clean karo
      const index = queues.random.findIndex(u => u.socketId === socket.id);
      if (index !== -1) queues.random.splice(index, 1);

      const waiting = waitingUsers.get(socket.id);
      if (waiting) clearTimeout(waiting.timeout);
      waitingUsers.delete(socket.id);
    });


    //DISCONNECT
    socket.on("disconnect", () => {

      const chat = activeChats.get(socket.id);

      if (chat) {

        const partnerSocket =
          io.sockets.sockets.get(chat.partnerSocketId);

        if (partnerSocket) {
          partnerSocket.emit("partnerDisconnected");
        }

        activeChats.delete(socket.id);
        activeChats.delete(chat.partnerSocketId);
      }

      // queue remove
      const index = queues.random.findIndex(
        user => user.socketId === socket.id
      );

      if (index !== -1) {
        queues.random.splice(index, 1);
      }

      // timer clear
      const user = waitingUsers.get(socket.id);

      if (user) {
        clearTimeout(user.timeout);
      }

      waitingUsers.delete(socket.id);


      //emit if the user was disconnected
      io.emit("onlineUsers", io.engine.clientsCount);



      //removing from online user
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          io.emit("onlineStatusChanged", {
            userId,
            online: false,
          });
          break;
        }
      }


      lastPartnerMap.delete(socket.id);


    });


    // SEND MESSAGE
    socket.on("sendMessage", async (data) => {
      try {
        const newMessage = await Message.create({
          chat: data.chatId,
          sender: data.senderId,
          receiver: data.receiverId,
          message: data.message,
          delivered: true,
        });

        await chatsNew.findByIdAndUpdate(data.chatId, {
          lastMessage: data.message,
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


    //GET HOW MUCH USER ARE ONLINE
    io.on("connection", (socket) => {

      io.emit("onlineUsers", io.engine.clientsCount);

      socket.on("disconnect", () => {

        io.emit("onlineUsers", io.engine.clientsCount);

      });

    });


    //FRINED REQUEST
    socket.on("sendFriendRequest", async (data) => {
      try {
        // Duplicate check
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

        // Create request
        const request = await FriendRequest.create({
          sender: data.senderId,
          receiver: data.receiverId,
        });

        const populatedRequest = await request.populate(
          "sender",
          "name profilePicture"
        );

        // SENDER
        socket.emit("friendRequestSent", {
          requestId: request._id,
          receiverId: data.receiverId,
        });

        // RECEIVER
        const receiverSocketId = onlineUsers.get(
          data.receiverId.toString()
        );

        if (receiverSocketId) {
          io.to(receiverSocketId).emit(
            "newFriendRequest",
            populatedRequest
          );
        }
      } catch (err) {
        console.log("sendFriendRequest:", err);

        socket.emit("friendRequestError", {
          message: "Failed to send friend request",
        });
      }
    });


    // CANCEL MATCH 
    socket.on("cancelMatch", () => {
      // Queue se user remove
      const index = queues.random.findIndex(
        (user) => user.socketId === socket.id
      );

      if (index !== -1) {
        queues.random.splice(index, 1);
      }

      // Waiting timer clear karo
      const waiting = waitingUsers.get(socket.id);

      if (waiting) {
        clearTimeout(waiting.timeout);
      }

      // Waiting users map se remove
      waitingUsers.delete(socket.id);

      // Frontend ko batao ki cancel ho gaya
      socket.emit("matchCancelled");

      console.log(`❌ User ${socket.id} cancelled matchmaking`);
    });


    socket.on("joinRoom", (chatId) => {
      socket.join(chatId);
    });








  });





};