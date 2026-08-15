import React, { useState, useEffect } from "react";
import { Reply, Pencil, MoreVertical } from "lucide-react";
import { socket } from "../../socket.js";
import { useUser } from "../../Context/UserContext.jsx";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import SearchingScreen from "./SearchingScreen.jsx";

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

export default function ChatScreen() {
  const [input, setInput] = useState("");
  const [messagess, setMessagess] = useState([]);
  const groups = groupMessages(messagess);
  const [roomId, setRoomId] = useState("");
  const [partnerName, setpartnerName] = useState("");
  const [partnerId, setpartnerId] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [chatId, setChatId] = useState("");
  const [showSkipOptions, setShowSkipOptions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { user, chatPreferences, setIsMatched } = useUser();

  const resetChatState = () => {
    setMessagess([]);
    setRoomId("");
    setpartnerName("");
    setpartnerId("");
    setChatId("");
    setRequestSent(false);
  };

  const goSearchAgain = () => {
    resetChatState();
    setIsSearching(true); // ✅ loading turant dikhao, guaranteed
    socket.emit("skipChat", chatPreferences);
  };

  useEffect(() => {
    const handleMatched = (data) => {
      setIsSearching(false);
      setRoomId(data.roomId);
      setChatId(data.chatId);
      setpartnerName(data?.partnerName);
      setpartnerId(data?.partnerId);
      setMessagess([]);
    };

    const handleFriendRequestSent = () => {
      setRequestSent(true);
      toast.success("Friend Request Sent");
    };

    const handlePartnerSkipped = () => {
      goSearchAgain();
    };

    const handleWaitingForMatch = () => {
      setIsSearching(true);
    };

    const handleWaitingOver = () => {
      setIsSearching(false);
      setIsMatched(false); // 30 sec me match na mile -> home
    };

    const handleAlreadyWaiting = () => {
      toast.error("Please wait for 30 seconds.");
    };

    socket.on("matched", handleMatched);
    socket.on("friendRequestSent", handleFriendRequestSent);
    socket.on("partnerSkipped", handlePartnerSkipped);
    socket.on("waitingForMatch", handleWaitingForMatch);
    socket.on("waitingOver", handleWaitingOver);
    socket.on("alreadyWaiting", handleAlreadyWaiting);

    return () => {
      socket.off("matched", handleMatched);
      socket.off("friendRequestSent", handleFriendRequestSent);
      socket.off("partnerSkipped", handlePartnerSkipped);
      socket.off("waitingForMatch", handleWaitingForMatch);
      socket.off("waitingOver", handleWaitingOver);
      socket.off("alreadyWaiting", handleAlreadyWaiting);
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

  return (
    <>
      {isSearching ? (
        <SearchingScreen />
      ) : (
        <div className="h-full min-h-0 w-full bg-[#1e1e26] flex flex-col relative">
          <div className="flex justify-between items-center px-4">
            <div className="shrink-0 px-4 sm:px-6 pt-6 pb-4 text-sm text-neutral-400 flex items-center justify-between">
              <div>
                You are now chatting with
                <span className="text-fuchsia-400 font-semibold">
                  {partnerName}
                </span>
                . Say hi!
              </div>

              <button
                disabled={requestSent}
                onClick={sendFriendRequest}
                className="ml-3 shrink-0 px-3 py-1.5 rounded-md text-xs font-semibold
               bg-purple-500 hover:bg-purple-600 active:bg-purple-700
               text-white transition-colors duration-150
               shadow-sm shadow-purple-500/30"
              >
                {requestSent ? "Request Sent" : "+ Add Friend"}
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-1.5 pb-4">
            {groups.map((group, i) => (
              <MessageGroup key={i} group={group} />
            ))}
          </div>

          <div className="shrink-0 px-4 sm:px-6 py-3 border-t border-white/10 flex items-center gap-2">
            <button
              onClick={() => setShowSkipOptions(true)}
              className="px-3 py-2.5 rounded-md bg-orange-400 text-sm font-medium text-white transition-colors"
            >
              Skip
            </button>

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
          </div>

          {showSkipOptions && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-[#1e1e26] border border-white/10 rounded-lg p-5 w-72 flex flex-col gap-3">
                <p className="text-sm text-neutral-200 text-center font-medium">
                  Kya karna chahte ho?
                </p>

                <button
                  onClick={handleSkipConfirm}
                  className="w-full py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white transition-colors"
                >
                  Skip → New Chat
                </button>

                <button
                  onClick={handleExitChat}
                  className="w-full py-2 rounded-md bg-red-500 hover:bg-red-600 text-sm font-medium text-white transition-colors"
                >
                  Exit Chat → Home
                </button>

                <button
                  onClick={() => setShowSkipOptions(false)}
                  className="w-full py-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
