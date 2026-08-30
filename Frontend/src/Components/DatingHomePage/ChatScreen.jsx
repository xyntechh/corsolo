import React, { useState, useEffect, useRef } from "react";
import { Reply, Pencil, MoreVertical } from "lucide-react";
import { socket } from "../../socket.js";
import { useUser } from "../../Context/UserContext.jsx";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import SearchingScreen from "./SearchingScreen.jsx";
import { acceptFriendRequest } from "../../Apis/friendApi.js";
import VoiceMessageBubble from "./VoiceMessageBubble.jsx";
import {
  Check,
  Clock,
  UserPlus,
  Home,
  Image as ImageIcon,
  Mic,
  Square,
  Play,
  Pause,
  Trash2,
  Send,
} from "lucide-react";
import axios from "axios";

function waveBarColor(i, total) {
  const t = i / Math.max(1, total - 1);
  // 0 -> 0.5 -> 1 maps to orange(#FB923C) -> red(#EF4444) -> orange(#FB923C)
  const mix = t < 0.5 ? t * 2 : (1 - t) * 2;
  const from = [251, 146, 60]; // #FB923C
  const to = [239, 68, 68]; // #EF4444
  const r = Math.round(from[0] + (to[0] - from[0]) * mix);
  const g = Math.round(from[1] + (to[1] - from[1]) * mix);
  const b = Math.round(from[2] + (to[2] - from[2]) * mix);
  return `rgb(${r}, ${g}, ${b})`;
}


function useRecordingEnvelope(barCount) {
  return React.useMemo(() => {
    let s = 11;
    const rand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    return Array.from({ length: barCount }, (_, i) => {
      const t = i / Math.max(1, barCount - 1);
      const envelope = Math.sin(Math.PI * t) * 0.8 + 0.2;
      return Math.max(0.18, Math.min(1, envelope * (0.55 + rand() * 0.5)));
    });
  }, [barCount]);
}

function RecordingWaveform() {
  const containerRef = React.useRef(null);
  const [barCount, setBarCount] = useState(30);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const BAR_MIN_WIDTH = 3;
    const GAP = 2;
    const recalc = () => {
      const width = el.clientWidth;
      if (!width) return;
      setBarCount(
        Math.max(14, Math.floor((width + GAP) / (BAR_MIN_WIDTH + GAP))),
      );
    };
    recalc();
    const ro = new ResizeObserver(recalc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const envelope = useRecordingEnvelope(barCount);

  return (
    <div
      ref={containerRef}
      className="flex-1 min-w-0 flex items-center gap-[2px] h-6 overflow-hidden"
    >
      {envelope.map((h, i) => (
        <span
          key={i}
          className="flex-1 rounded-full"
          style={{
            height: `${h * 100}%`,
            backgroundColor: waveBarColor(i, envelope.length),
            animation: `voiceWaveSmooth ${
              0.85 + Math.abs(Math.sin(i * 1.7)) * 0.5
            }s cubic-bezier(0.45,0,0.55,1) ${i * 0.035}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

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
              {msg.messageType === "image" ? (
                <img
                  src={msg.mediaUrl}
                  alt="sent image"
                  className="max-w-[220px] sm:max-w-[280px] rounded-lg mt-1"
                />
              ) : msg.messageType === "audio" ? (
                <VoiceMessageBubble src={msg.mediaUrl} isMe={isMe} />
              ) : (
                msg.text
              )}

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
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = React.useRef(null);
  const audioChunksRef = React.useRef([]);
  const [pendingUploads, setPendingUploads] = useState([]);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const discardRecordingRef = React.useRef(false);

  //Token
  const token = localStorage.getItem("authToken");

  //context
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
            messageType: msg.messageType || "text", // 👈 add karo
            mediaUrl: msg.mediaUrl || null,
          }));

          setMessagess(formatted);
          setChatId(propChatId);
          setRoomId(propChatId); // 👈 YEH LINE ADD KARO
          setpartnerId(propFriendId);
          setpartnerName(propPartnerName);
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
      console.log(msg);
      setMessagess((prev) => [
        ...prev,
        {
          id: msg._id,
          sender: msg.sender === user?._id ? "me" : "them",
          name: msg.sender === user?._id ? user?.name : msg.senderName,
          time: new Date(msg.createdAt).toLocaleTimeString(),
          text: msg.message,
          messageType: msg.messageType || "text",
          mediaUrl: msg.mediaUrl || null,
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

  //apis
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

  const uploadAndSend = async (file, type) => {
    const tempId = `temp-${Date.now()}`;

    //Local preview of image
    const previewUrl = type === "image" ? URL.createObjectURL(file) : null;

    //showing pending upload immiditealy before uploading
    setPendingUploads((prev) => [...prev, { id: tempId, type, previewUrl }]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/upload-chat-media`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        socket.emit("sendMessage", {
          roomId,
          message: "",
          messageType: res.data.messageType, // "image" ya "audio"
          mediaUrl: res.data.url,
          senderName: user?.name,
          senderId: user?._id,
          chatId: chatId,
          receiverId: partnerId,
          receiverName: partnerName,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setPendingUploads((prev) => prev.filter((p) => p.id !== tempId));
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    }
  };

  const startRecording = async () => {
    setIsRecording(true); // optimistic — UI turant respond karta hai
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);

      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        if (discardRecordingRef.current) {
          discardRecordingRef.current = false;
          audioChunksRef.current = [];
          return;
        }
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, {
          type: "audio/webm",
        });
        uploadAndSend(audioFile, "audio");
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
    } catch (err) {
      setIsRecording(false); // permission deny hui to optimistic state revert
      toast.error("Microphone access denied.");
    }
  };

  useEffect(() => {
    if (!isRecording) return;
    setRecordingDuration(0);
    const interval = setInterval(
      () => setRecordingDuration((d) => d + 1),
      1000,
    );
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const stopRecording = () => {
    discardRecordingRef.current = false;
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const cancelRecording = () => {
    discardRecordingRef.current = true;
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
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

            {/* 👇 naya: pending uploads */}
            {pendingUploads.map((p) => (
              <div key={p.id} className="flex gap-3 px-4 sm:px-6 py-1">
                <Avatar isMe={true} />
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-indigo-300">
                      {user?.name}
                    </span>
                  </div>

                  {p.type === "image" ? (
                    <div className="relative w-[220px] h-[160px] rounded-lg overflow-hidden bg-neutral-800 mt-1">
                      {p.previewUrl && (
                        <img
                          src={p.previewUrl}
                          alt="uploading"
                          className="w-full h-full object-cover opacity-40 blur-[2px]"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <ClipLoader color="#ffffff" size={26} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-[#2c2c38] rounded-full px-3 py-2 w-[200px] mt-1">
                      <ClipLoader color="#a78bfa" size={16} />
                      <span className="text-xs text-neutral-400">
                        Sending voice note...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="shrink-0 px-3 sm:px-6 py-2.5 sm:py-3 border-t border-white/10 flex items-center gap-1.5 sm:gap-2">
            <style>{`
    @keyframes voiceWaveSmooth {
      0%, 100% { transform: scaleY(0.28); }
      50% { transform: scaleY(1); }
    }
  `}</style>

            {isFromHistory ? (
              <button
                onClick={() => setIsMatched(false)}
                className="w-full flex justify-center items-center gap-2 px-4 py-2.5 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-semibold text-white transition-colors"
              >
                <Home className="w-4 h-4" />
                Go to Home
              </button>
            ) : (
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
                    className={`px-2.5 sm:px-3 py-2.5 rounded-md text-sm font-semibold text-white transition-colors whitespace-nowrap ${
                      showSkipOptions
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-orange-400 hover:bg-orange-500"
                    }`}
                  >
                    {showSkipOptions ? "CONFIRM?" : "Skip"}
                  </button>
                </div>

                {isRecording ? (
                  <>
                    {/* Cancel — discard without sending */}
                    <button
                      onClick={cancelRecording}
                      aria-label="Cancel recording"
                      className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-neutral-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                    >
                      <Trash2 size={17} />
                    </button>

                    {/* Live recording bar — orange/red waveform, dark base like the reference */}
                    <div className="flex-1 min-w-0 flex items-center gap-2 sm:gap-3 rounded-full pl-3.5 sm:pl-4 pr-3.5 sm:pr-4 py-2.5 bg-[#1e1b2e] border border-white/5 shadow-md">
                      <span className="shrink-0 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                      <span className="shrink-0 text-xs font-medium text-neutral-300 tabular-nums">
                        {formatDuration(recordingDuration)}
                      </span>
                      <RecordingWaveform />
                    </div>

                    {/* Stop & send */}
                    <button
                      onClick={stopRecording}
                      aria-label="Stop and send voice message"
                      className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-orange-500 hover:bg-orange-400 text-white transition-colors ring-4 ring-orange-500/25"
                    >
                      <Square size={14} fill="white" />
                    </button>
                  </>
                ) : (
                  <>
                    {/* Input pill with image + mic icons embedded inside */}
                    <div className="flex-1 min-w-0 flex items-center gap-0.5 bg-[#2c2c38] rounded-lg pl-1 sm:pl-1.5 pr-1 sm:pr-1.5 py-1.5 focus-within:ring-1 focus-within:ring-indigo-500 transition-shadow">
                      <label className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors">
                        <ImageIcon size={17} />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) uploadAndSend(file, "image");
                            e.target.value = "";
                          }}
                        />
                      </label>

                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Message..."
                        className="flex-1 min-w-0 bg-transparent px-1 sm:px-1.5 text-sm text-neutral-100 placeholder-neutral-500 outline-none"
                      />

                      <button
                        onClick={startRecording}
                        aria-label="Record voice message"
                        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-teal-300 hover:bg-white/10 transition-colors"
                      >
                        <Mic size={17} />
                      </button>
                    </div>

                    <button
                      onClick={sendMessage}
                      className="shrink-0 px-4 sm:px-5 py-2.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white transition-colors"
                    >
                      Send
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
