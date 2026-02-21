import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Send,
  Mic,
  MicOff,
  PhoneOff,
  MessageCircle,
  User,
  Clock,
  CheckCheck,
  Check,
  X,
  Phone,
  Wifi,
  Heart,
  Sparkles,
  AlertCircle,
  Volume2,
  VolumeX,
  ArrowLeft,
} from "lucide-react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// ─── INCOMING REQUEST MODAL ───────────────────────────────────────────────────
function IncomingRequestModal({ request, onAccept, onDecline, countdown }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-[slideUp_0.4s_cubic-bezier(0.34,1.56,0.64,1)]">
        <div className="h-2 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400" />

        <div className="flex flex-col items-center px-6 pt-6 pb-2">
          {/* Countdown Ring */}
          <div className="relative w-20 h-20 mb-4">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#f3f4f6" strokeWidth="6" />
              <circle
                cx="40" cy="40" r="34" fill="none"
                stroke="url(#countGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 34}
                strokeDashoffset={2 * Math.PI * 34 * (1 - countdown / 20)}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="countGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-black text-gray-800">{countdown}</span>
            </div>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg mb-3">
            <User className="w-8 h-8 text-white" />
          </div>

          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-pink-500" />
            <h2 className="text-lg font-black text-gray-900">New Chat Request</h2>
            <Sparkles className="w-4 h-4 text-pink-500" />
          </div>

          <p className="text-sm text-gray-500 mb-1">User ID</p>
          <p className="font-mono text-xs bg-gray-100 rounded-lg px-3 py-1.5 text-gray-700 mb-4 max-w-full truncate">
            {request.userId}
          </p>

          <div className="flex items-center gap-2 text-xs text-orange-500 bg-orange-50 px-3 py-1.5 rounded-lg mb-5">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Auto-declines in {countdown}s if no action taken</span>
          </div>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onDecline}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
          >
            <X className="w-4 h-4" /> Decline
          </button>
          <button
            onClick={onAccept}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm shadow-lg shadow-pink-200 hover:scale-[1.02] transition-all active:scale-95"
          >
            <Heart className="w-4 h-4" /> Accept
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MESSAGE BUBBLE ───────────────────────────────────────────────────────────
function MessageBubble({ msg, isOwn }) {
  const time = msg.timestamp
    ? new Date(msg.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    : "";

  if (msg.isSystem) {
    return (
      <div className="flex justify-center my-3">
        <span className="text-xs bg-gray-100 text-gray-500 px-4 py-1.5 rounded-full border border-gray-200">
          {msg.message}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3`}>
      {!isOwn && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 self-end shadow-md">
          U
        </div>
      )}
      <div className={`max-w-[72%] flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isOwn
              ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-br-sm shadow-md shadow-blue-100"
              : "bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100"
          }`}
        >
          {msg.message}
        </div>
        <div className={`flex items-center gap-1 mt-1 px-1 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
          <span className="text-[10px] text-gray-400">{time}</span>
          {isOwn && <CheckCheck className="w-3 h-3 text-blue-400" />}
        </div>
      </div>
      {isOwn && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-green-500 flex items-center justify-center text-white text-xs font-bold ml-2 flex-shrink-0 self-end shadow-md">
          E
        </div>
      )}
    </div>
  );
}

// ─── CHAT ROOM COMPONENT ──────────────────────────────────────────────────────
// socketRef (the ref object) is passed so ChatRoom always reads latest socket
// without stale closure or re-render issues.
function ChatRoom({ socketRef, room, executiveId, userId, onLeave }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [muted, setMuted] = useState(false);
  const [chatTime, setChatTime] = useState(0);
  const [roomJoined, setRoomJoined] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // ── Join the socket room ──
  // Poll until socket.connected == true then emit joinSupportRoom
  useEffect(() => {
    let cancelled = false;

    const tryJoin = () => {
      const socket = socketRef.current;
      if (cancelled) return;

      if (socket && socket.connected) {
        console.log("🔗 Executive joining room:", room);
        socket.emit("joinSupportRoom", { room });
        if (!cancelled) setRoomJoined(true);
      } else {
        setTimeout(tryJoin, 300);
      }
    };

    tryJoin();
    return () => { cancelled = true; };
  }, [room]);

  // ── Socket message/partner listeners ──
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleMessage = (data) => {
      console.log("📨 Received msg:", data);
      setMessages((prev) => [...prev, { ...data, fromMe: false }]);
    };

    const handlePartnerLeft = ({ message }) => {
      setMessages((prev) => [
        ...prev,
        { message: message || "User has left the chat.", isSystem: true, timestamp: new Date() },
      ]);
    };

    socket.on("receiveMessage", handleMessage);
    socket.on("partnerLeft", handlePartnerLeft);

    return () => {
      socket.off("receiveMessage", handleMessage);
      socket.off("partnerLeft", handlePartnerLeft);
    };
  }, [roomJoined]); // re-bind once room is joined

  // ── Chat timer ──
  useEffect(() => {
    const t = setInterval(() => setChatTime((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // ── Auto scroll ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const sendMessage = () => {
    const text = input.trim();
    const socket = socketRef.current;
    if (!text || !socket || !roomJoined) return;

    const msgData = {
      room,
      sender: executiveId,
      reciver: userId,
      message: text,
      type: "text",
      timestamp: new Date(),
    };

    console.log("📤 Sending:", msgData);
    socket.emit("sendMessage", msgData);
    setMessages((prev) => [...prev, { ...msgData, fromMe: true }]);
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLeave = () => {
    const socket = socketRef.current;
    if (socket) socket.emit("leaveRoom", { userId: executiveId, room });
    onLeave();
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center gap-3 shadow-sm flex-shrink-0">
        <div className="relative">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md">U</div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-sm truncate">
            User <span className="font-mono text-blue-600 text-xs">{userId?.slice(-10)}</span>
          </h3>
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${roomJoined ? "bg-green-500" : "bg-orange-400"}`} />
            <span className={`text-xs font-semibold ${roomJoined ? "text-green-600" : "text-orange-500"}`}>
              {roomJoined ? "Connected" : "Joining room…"}
            </span>
            <span className="text-xs text-gray-400 ml-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />{formatTime(chatTime)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMuted(!muted)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={handleLeave}
            className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-500 rounded-xl font-semibold text-xs hover:bg-red-100 transition-all"
          >
            <PhoneOff className="w-4 h-4" />
            <span className="hidden sm:inline">End Chat</span>
          </button>
        </div>
      </div>

      {/* Room Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100 px-4 py-1.5 flex items-center gap-2 flex-shrink-0">
        <Wifi className="w-3 h-3 text-blue-400 flex-shrink-0" />
        <span className="text-[10px] text-blue-500 font-mono truncate">{room}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 bg-gradient-to-br from-gray-50 to-blue-50/20 min-h-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-40 select-none pointer-events-none">
            <MessageCircle className="w-10 h-10 text-blue-300 mb-2" />
            <p className="text-sm text-gray-400 font-semibold">
              {roomJoined ? "Say hello to start the conversation!" : "Connecting to chat room…"}
            </p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} msg={msg} isOwn={msg.fromMe} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-4 sm:px-6 py-3 flex-shrink-0">
        <div className="flex items-end gap-3 bg-gray-50 rounded-2xl px-4 py-2.5 border border-gray-200 focus-within:border-blue-400 focus-within:bg-white focus-within:shadow-sm transition-all">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={roomJoined ? "Type a message…" : "Connecting…"}
            rows={1}
            disabled={!roomJoined}
            className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-800 placeholder-gray-400 max-h-28 disabled:opacity-40"
            style={{ lineHeight: "1.6" }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || !roomJoined}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-200 hover:scale-105 transition-all disabled:opacity-40 disabled:scale-100 disabled:shadow-none flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5 text-center">
          <kbd className="bg-gray-200 px-1 rounded">Enter</kbd> send &nbsp;·&nbsp;{" "}
          <kbd className="bg-gray-200 px-1 rounded">Shift+Enter</kbd> new line
        </p>
      </div>
    </div>
  );
}

// ─── IDLE VIEW ────────────────────────────────────────────────────────────────
function IdleView({ connected, chatHistory }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-10">
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-200 mb-6 animate-[float_3s_ease-in-out_infinite]">
        <Phone className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">Waiting for Requests</h2>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
        You're online. When a user sends a chat request, a notification will pop up here.
      </p>

      <div className={`mt-6 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold ${connected ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
        <span className={`w-2.5 h-2.5 rounded-full ${connected ? "bg-green-500 animate-pulse" : "bg-red-400"}`} />
        {connected ? "Connected to Server" : "Reconnecting…"}
      </div>

      {chatHistory.length > 0 && (
        <div className="mt-8 w-full max-w-md text-left">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" /> Recent Chats
          </h3>
          <div className="space-y-2">
            {[...chatHistory].reverse().slice(0, 5).map((c, i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-green-500 flex items-center justify-center text-white text-xs font-bold">U</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono font-semibold text-gray-800 truncate">{c.userId?.slice(-14)}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(c.startedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const ExecutiveChatRoom = () => {
  // ⚠️ Replace with your auth context/store
  const executiveId = localStorage.getItem("executiveId") || "exec-demo-001";

  // Store socket in a ref — this avoids stale-closure bugs.
  // Children read socketRef.current directly, always fresh.
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  const [incomingRequest, setIncomingRequest] = useState(null);
  const [countdown, setCountdown] = useState(20);
  const [activeChat, setActiveChat] = useState(null); // { room, userId }
  const [chatHistory, setChatHistory] = useState([]);
  const countdownRef = useRef(null);

  // ── Init socket once ──
  useEffect(() => {
    if (!executiveId) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
      setConnected(true);
      socket.emit("executiveOnline", { executiveId });
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected");
      setConnected(false);
    });

    // Incoming chat request from user
    socket.on("incomingGirlRequest", ({ userId }) => {
      console.log("💘 Request from:", userId);
      setIncomingRequest({ userId });
    });

    // Server confirms chat is ready — NOW show chat room
    socket.on("girlChatStarted", ({ room, userId }) => {
      console.log("🎉 girlChatStarted → Room:", room, " User:", userId);
      clearInterval(countdownRef.current);
      setIncomingRequest(null);
      setActiveChat({ room, userId });
      setChatHistory((prev) => [...prev, { room, userId, startedAt: new Date() }]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [executiveId]);

  // ── Countdown for incoming modal ──
  useEffect(() => {
    if (!incomingRequest) return;
    setCountdown(20);
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(countdownRef.current);
          setIncomingRequest(null);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(countdownRef.current);
  }, [incomingRequest]);

  const handleAccept = useCallback(() => {
    const socket = socketRef.current;
    if (!socket || !incomingRequest) return;
    clearInterval(countdownRef.current);
    console.log("✅ acceptGirlChat emitted for:", incomingRequest.userId);
    socket.emit("acceptGirlChat", { executiveId, userId: incomingRequest.userId });
    // Do NOT clear incomingRequest here — wait for girlChatStarted from server
  }, [incomingRequest, executiveId]);

  const handleDecline = useCallback(() => {
    clearInterval(countdownRef.current);
    setIncomingRequest(null);
  }, []);

  return (
    <main className="flex-1 overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50/30 flex flex-col" style={{ height: "100dvh" }}>
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-4 shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {activeChat && (
              <button
                onClick={() => setActiveChat(null)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 sm:hidden"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-gray-900">
                {activeChat ? "Live Chat" : "Executive Dashboard"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5" />
                {activeChat ? `Room · ${activeChat.room?.slice(-16)}` : "Live Chat Support Panel"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400">Executive</p>
                <p className="text-xs font-mono font-bold text-gray-700">{executiveId?.slice(-10)}</p>
              </div>
            </div>

            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${activeChat ? "bg-orange-50 text-orange-600" : connected ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
              <span className={`w-2 h-2 rounded-full ${activeChat ? "bg-orange-400" : connected ? "bg-green-500 animate-pulse" : "bg-red-400"}`} />
              {activeChat ? "In Chat" : connected ? "Online" : "Offline"}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden max-w-7xl w-full mx-auto flex flex-col px-4 sm:px-6 lg:px-8 py-4 sm:py-6 min-h-0">
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-0">
          {activeChat ? (
            <ChatRoom
              socketRef={socketRef}
              room={activeChat.room}
              executiveId={executiveId}
              userId={activeChat.userId}
              onLeave={() => setActiveChat(null)}
            />
          ) : (
            <IdleView connected={connected} chatHistory={chatHistory} />
          )}
        </div>
      </div>

      {/* Incoming Modal */}
      {incomingRequest && (
        <IncomingRequestModal
          request={incomingRequest}
          countdown={countdown}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity:0; transform:translateY(40px) scale(0.95); }
          to   { opacity:1; transform:translateY(0)   scale(1);    }
        }
        @keyframes float {
          0%,100% { transform:translateY(0); }
          50%     { transform:translateY(-10px); }
        }
      `}</style>
    </main>
  );
};

export default ExecutiveChatRoom;