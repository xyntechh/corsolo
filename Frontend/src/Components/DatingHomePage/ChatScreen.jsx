import React, { useState, useEffect } from "react";
import { Reply, Pencil, MoreVertical } from "lucide-react";
import { socket } from "../../socket.js";
import { useUser } from "../../Context/UserContext.jsx";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import SearchingScreen from "./SearchingScreen.jsx";
import { acceptFriendRequest } from "../../Apis/friendApi.js";
import { Check, Clock, UserPlus, Home } from "lucide-react";
import axios from "axios";

function groupMessages(list) {
  const groups = [];
  for (const msg of list) {
    const last = groups[groups.length - 1];
    if (last && last.sender === msg.sender && last.name === msg.name) {
      last.items.push(msg);
    } else {
      groups.push({
        sender: msg.sender,
        name: msg.name,
        time: msg.time,
        items: [msg],
      });
    }
  }
  return groups;
}

function Avatar({ isMe }) {
  return (
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0 ${
        isMe ? "bg-[#f4a3a3]" : "bg-[#c084fc]"
      }`}
    >
      😏
    </div>
  );
}

function MessageGroup({ group }) {
  const [hoveredId, setHoveredId] = useState(null);
  const isMe = group.sender === "me";

  return (
    <div
      className={`group/row flex gap-3 px-4 sm:px-6 py-1 relative
        ${isMe ? "hover:bg-indigo-500/5" : "hover:bg-white/[0.03]"}
      `}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-[3px] ${
          isMe ? "bg-indigo-500" : "bg-fuchsia-500"
        }`}
      />

      <Avatar isMe={isMe} />

      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span
            className={`text-sm font-semibold ${
              isMe ? "text-indigo-300" : "text-fuchsia-300"
            }`}
          >
            {group.name}
          </span>
          <span className="text-[11px] text-neutral-500">{group.time}</span>
        </div>

        <div className="flex flex-col gap-0.5">
          {group.items.map((msg) => (
            <div
              key={msg.id}
              onMouseEnter={() => setHoveredId(msg.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative text-sm text-neutral-100 leading-relaxed break-words w-fit max-w-full pr-1"
            >
              {msg.text}

              <div
                className={`absolute -top-9 right-0
                  flex items-center gap-0.5 bg-[#15151f] border border-white/10 rounded-lg px-1 py-0.5 shadow-lg
                  transition-opacity duration-150
                  ${hoveredId === msg.id ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              >
                <button className="p-1.5 rounded-md hover:bg-white/10 text-neutral-300">
                  <Reply size={14} />
                </button>
                {isMe && (
                  <button className="p-1.5 rounded-md hover:bg-white/10 text-neutral-300">
                    <Pencil size={14} />
                  </button>
                )}
                <button className="p-1.5 rounded-md hover:bg-white/10 text-neutral-300">
                  <MoreVertical size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ChatScreen({
  chatId: propChatId,
  friendId: propFriendId,
  partnerName: propPartnerName,
}) {
  const [input, setInput] = useState("");
  const [messagess, setMessagess] = useState([]);
  const groups = groupMessages(messagess);
  const [roomId, setRoomId] = useState("");
  const [partnerName, setpartnerName] = useState("");
  const [partnerId, setpartnerId] = useState("");
  const [chatId, setChatId] = useState("");
  const [showSkipOptions, setShowSkipOptions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [friendRequestId, setFriendRequestId] = useState(null);
  const [friendStatus, setFriendStatus] = useState("none");
  const [isFromHistory, setIsFromHistory] = useState(false);

  const { user, chatPreferences, setIsMatched, removeFriendRequest } =
    useUser();

  const resetChatState = () => {
    setMessagess([]);
    setRoomId("");
    setpartnerName("");
    setpartnerId("");
    setChatId("");
    setFriendStatus("none");
    setFriendRequestId(null);
  };

  const goSearchAgain = () => {
    resetChatState();
    setIsSearching(true); // ✅ loading turant dikhao, guaranteed
    socket.emit("skipChat", chatPreferences);
  };

  // Load old messages if chatId is provided
  useEffect(() => {
    if (!propChatId) return;

    const fetchOldMessages = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/chat/chat-messages/${propChatId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (res.data.success) {
          const formatted = res.data.messages.map((msg) => ({
            id: msg._id,
            sender: msg.sender._id === user?._id ? "me" : "them",
            name: msg.sender._id === user?._id ? user?.name : msg.sender.name,
            time: new Date(msg.createdAt).toLocaleTimeString(),
            text: msg.message,
          }));

          setMessagess(formatted);
          setChatId(propChatId);
          setRoomId(propChatId); // 👈 YEH LINE ADD KARO
          setpartnerId(propFriendId);
          setpartnerName(propPartnerName);
          // 👇 yahi naya logic hai
          const isFriend = user?.friends?.some(
            (friendId) => friendId.toString() === propFriendId?.toString(),
          );

          setIsFromHistory(!isFriend);
          socket.emit("joinRoom", propChatId);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load chat messages.");
      }
    };

    fetchOldMessages();
  }, [propChatId]);

  useEffect(() => {
    const handleMatched = (data) => {
      setIsSearching(false);
      setRoomId(data.roomId);
      setChatId(data.chatId);
      setpartnerName(data?.partnerName);
      setpartnerId(data?.partnerId);
      setMessagess([]);
      setFriendStatus(data.friendStatus);
      setFriendRequestId(data.friendRequestId || null);
      setIsFromHistory(false);
    };

    const handleFriendRequestSent = (data) => {
      setFriendStatus("pending_sent");
      setFriendRequestId(data.requestId);
    };

    const handleNewFriendRequest = (data) => {
      setFriendStatus("pending_received");

      setFriendRequestId(data?._id);
    };

    const handleFriendRequestError = (data) => {
      toast.error(data.message);
    };

    const handlePartnerSkipped = () => {
      goSearchAgain();
    };

    const handleWaitingForMatch = () => {
      setIsSearching(true);
    };

    const handleWaitingOver = () => {
      setIsSearching(false);
      setIsMatched(false);
    };

    const handleAlreadyWaiting = () => {
      toast.error("Please wait for 30 seconds.");
    };

    socket.on("matched", handleMatched);
    socket.on("friendRequestSent", handleFriendRequestSent);
    socket.on("friendRequestError", handleFriendRequestError);
    socket.on("partnerSkipped", handlePartnerSkipped);
    socket.on("waitingForMatch", handleWaitingForMatch);
    socket.on("waitingOver", handleWaitingOver);
    socket.on("alreadyWaiting", handleAlreadyWaiting);
    socket.on("friendRequestSent", handleFriendRequestSent);
    socket.on("newFriendRequest", handleNewFriendRequest);

    return () => {
      socket.off("matched", handleMatched);
      socket.off("friendRequestSent", handleFriendRequestSent);
      socket.off("friendRequestError", handleFriendRequestError);
      socket.off("partnerSkipped", handlePartnerSkipped);
      socket.off("waitingForMatch", handleWaitingForMatch);
      socket.off("waitingOver", handleWaitingOver);
      socket.off("alreadyWaiting", handleAlreadyWaiting);
      socket.off("friendRequestSent", handleFriendRequestSent);
      socket.off("newFriendRequest", handleNewFriendRequest);
    };
  }, [chatPreferences]);

  useEffect(() => {
    const handleReceive = (msg) => {
      setMessagess((prev) => [
        ...prev,
        {
          id: msg._id,
          sender: msg.sender === user?._id ? "me" : "them",
          name: msg.sender === user?._id ? user?.name : msg.senderName,
          time: new Date(msg.createdAt).toLocaleTimeString(),
          text: msg.message,
        },
      ]);
    };

    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
    };
  }, [user]);

  const sendMessage = () => {
    if (!input.trim()) return;

    socket.emit("sendMessage", {
      roomId,
      message: input,
      senderName: user?.name,
      senderId: user?._id,
      chatId: chatId,
      receiverId: partnerId,
      receiverName: partnerName,
    });

    setInput("");
  };

  const sendFriendRequest = () => {
    socket.emit("sendFriendRequest", {
      senderId: user._id,
      receiverId: partnerId,
    });
  };

  const handleSkipConfirm = () => {
    setShowSkipOptions(false);
    goSearchAgain();
  };

  const handleExitChat = () => {
    setShowSkipOptions(false);
    socket.emit("exitChat");
    setIsMatched(false); //
  };

  console.log("friendStatus", friendStatus);
  console.log("friendRequestId", friendRequestId);

  const token = localStorage.getItem("authToken");

  const handleAcceptFriend = async () => {
    if (!friendRequestId) {
      toast.error("Friend request not found");
      return;
    }

    try {
      const res = await acceptFriendRequest(friendRequestId, token);

      if (res.success) {
        setFriendStatus("friends");
        removeFriendRequest(friendRequestId);
        toast.success("Friend request accepted");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      {isSearching ? (
        <SearchingScreen />
      ) : (
        <div className="h-full min-h-0 w-full bg-[#1e1e26] flex flex-col relative">
          <div className="flex items-center justify-between px-2 sm:px-4 min-w-0">
            <div className="min-w-0 flex-1 px-2 sm:px-4 pt-4 sm:pt-6 pb-3 sm:pb-4 text-xs sm:text-sm text-neutral-400 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1 leading-tight">
                You are now chatting with{" "}
                <span
                  className="
          inline-block
          max-w-[80px]
          sm:max-w-[150px]
          md:max-w-[200px]
          truncate
          align-bottom
          text-fuchsia-400
          font-semibold
        "
                >
                  {partnerName}
                </span>
                . Say hi!
              </div>
              {friendStatus === "friends" ? (
                <span
                  className="
      shrink-0 flex items-center gap-1
      px-2 py-1
      sm:px-3 sm:py-1.5
      rounded-md
      text-[10px] sm:text-xs
      font-semibold
      text-purple-300
      bg-purple-500/10
      border border-purple-500/20
      whitespace-nowrap
    "
                >
                  <Check
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                    strokeWidth={3}
                  />
                  Friends
                </span>
              ) : friendStatus === "pending_sent" ? (
                <button
                  disabled
                  className="
      shrink-0 flex items-center gap-1
      px-2 py-1
      sm:px-3 sm:py-1.5
      rounded-md
      text-[10px] sm:text-xs
      font-semibold
      bg-white/5
      border border-white/10
      text-neutral-500
      cursor-not-allowed
      whitespace-nowrap
    "
                >
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  Request Sent
                </button>
              ) : friendStatus === "pending_received" ? (
                <button
                  onClick={handleAcceptFriend}
                  className="
      shrink-0 flex items-center gap-1
      px-2 py-1
      sm:px-3 sm:py-1.5
      rounded-md
      text-[10px] sm:text-xs
      font-semibold
      bg-purple-500
      hover:bg-purple-600
      active:bg-purple-700
      text-white
      transition-colors duration-150
      whitespace-nowrap
    "
                >
                  <Check
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                    strokeWidth={3}
                  />
                  Accept
                </button>
              ) : (
                <button
                  onClick={sendFriendRequest}
                  className="
      shrink-0 flex items-center gap-1
      px-2 py-1
      sm:px-3 sm:py-1.5
      rounded-md
      text-[10px] sm:text-xs
      font-semibold
      border border-purple-500/50
      text-purple-300
      hover:bg-purple-500/10
      active:bg-purple-500/20
      transition-colors duration-150
      whitespace-nowrap
    "
                >
                  <UserPlus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  Add Friend
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-1.5 pb-4">
            {groups.map((group, i) => (
              <MessageGroup key={i} group={group} />
            ))}
          </div>

          <div className="shrink-0 px-4 sm:px-6 py-3 border-t border-white/10 flex items-center gap-2">
            {isFromHistory ? (
              // 👇 History se khuli chat — sirf Home button
              <button
                onClick={() => setIsMatched(false)}
                className="w-full flex justify-center items-center gap-2 px-4 py-2.5 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-semibold text-white transition-colors"
              >
                <Home className="w-4 h-4" />
                Go to Home
              </button>
            ) : (
              // 👇 Live match — purana wala skip + input + send
              <>
                {showSkipOptions && (
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSkipOptions(false)}
                  />
                )}

                <div className="relative z-50 shrink-0">
                  {showSkipOptions && (
                    <button
                      onClick={handleExitChat}
                      className="absolute flex justify-center items-center gap-1 bottom-full left-0 mb-2 px-3 py-2.5 rounded-md bg-neutral-700 hover:bg-neutral-600 text-sm font-semibold text-white transition-colors whitespace-nowrap shadow-lg"
                    >
                      <Home className="w-4 h-4 mr-1 inline-block" />
                      <div>Home</div>
                    </button>
                  )}

                  <button
                    onClick={() =>
                      showSkipOptions
                        ? handleSkipConfirm()
                        : setShowSkipOptions(true)
                    }
                    className={`px-3 py-2.5 rounded-md text-sm font-semibold text-white transition-colors whitespace-nowrap ${
                      showSkipOptions
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-orange-400 hover:bg-orange-500"
                    }`}
                  >
                    {showSkipOptions ? "CONFIRM?" : "Skip"}
                  </button>
                </div>

                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Message..."
                  className="flex-1 bg-[#2c2c38] rounded-lg px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  onClick={sendMessage}
                  className="px-5 py-2.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white transition-colors"
                >
                  Send
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
