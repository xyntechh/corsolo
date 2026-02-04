import React, { useState, useEffect, useRef, useMemo } from "react";
import { socket } from "../socket";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useUser } from "../Context/UserContext";

function ChatUI({ userData, partnerData, room, isAI }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [partnerLeft, setPartnerLeft] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [audioProgress, setAudioProgress] = useState({});

  const { user, fetchUser } = useUser();

  console.log(user);

  // Video Call States
  const [incomingCall, setIncomingCall] = useState(false);
  const [onCall, setOnCall] = useState(false);
  const [callConnecting, setCallConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [remoteStreamActive, setRemoteStreamActive] = useState(false);

  const messagesEndRef = useRef(null);
  const messageIdsRef = useRef(new Set());
  const hasRedirectedRef = useRef(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const audioRefs = useRef({});

  // WebRTC Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const iceCandidatesQueue = useRef([]);

  const navigate = useNavigate();

  const myId = useMemo(() => {
    if (userData?.id) return userData.id.toString();
    const tokenString = localStorage.getItem("authToken");
    if (!tokenString) return null;
    const decoded = jwtDecode(tokenString);
    return (decoded.userId || decoded.id)?.toString();
  }, [userData]);

  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // ==================== WebRTC Setup ====================
  const createPeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };

    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("📡 Sending ICE candidate");
        socket.emit("webrtcSignal", {
          room,
          data: { type: "ice-candidate", candidate: event.candidate },
        });
      }
    };

    pc.ontrack = (event) => {
      console.log("📺 Remote track received");
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setRemoteStreamActive(true);
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("🔗 Connection state:", pc.connectionState);
      if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed"
      ) {
        endCall();
      }
    };

    return pc;
  };

  const startCall = async () => {
    if (isAI) {
      toast.error("Video calls not available with AI");
      return;
    }

    if (!user || user.coin < 99) {
      toast.error("You need at least 99 Tokens for video call");
      return;
    }

    try {
      setCallConnecting(true);
      console.log("📞 Starting call...");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      peerConnectionRef.current = createPeerConnection();

      stream.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      socket.emit("callUser", {
        fromUserId: myId,
        toUserId: partnerData?.id,
        room,
        offer,
      });

      toast.success("Calling...", { duration: 2000 });
    } catch (error) {
      console.error("❌ Call error:", error);
      toast.error("Failed to start call");
      setCallConnecting(false);
    }
  };

  const acceptCall = async (offer) => {
    try {
      console.log("✅ Accepting call...");
      setIncomingCall(false);
      setOnCall(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      peerConnectionRef.current = createPeerConnection();

      stream.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);

      socket.emit("acceptCall", { room, answer });

      // Process queued ICE candidates
      while (iceCandidatesQueue.current.length > 0) {
        const candidate = iceCandidatesQueue.current.shift();
        await peerConnectionRef.current.addIceCandidate(candidate);
      }

      toast.success("Call connected!");
      await debitUserCoin(99);
    } catch (error) {
      console.error("❌ Accept call error:", error);
      toast.error("Failed to connect call");
      endCall();
    }
  };

  const debitUserCoin = async (coin) => {
    const token = localStorage.getItem("authToken");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/debit`,
        { coin },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(res.data);

      fetchUser();

      return res.data;
    } catch (error) {
      console.log("Error while debiting coin:", error);
    }
  };

  const rejectCall = () => {
    console.log("❌ Rejecting call");
    socket.emit("rejectCall", { room });
    setIncomingCall(false);
    toast.error("Call rejected");
  };

  const endCall = () => {
    console.log("📞 Ending call");

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    socket.emit("endCall", { room });

    setOnCall(false);
    setCallConnecting(false);
    setIncomingCall(false);
    setRemoteStreamActive(false);
    setIsMuted(false);
    setIsVideoOff(false);
    localStreamRef.current = null;
    iceCandidatesQueue.current = [];
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  // ==================== Socket Listeners ====================
  useEffect(() => {
    if (!room || !myId) return;

    const handleIncomingCall = ({ fromUserId, offer }) => {
      console.log("📞 Incoming call from:", fromUserId);
      setIncomingCall({ fromUserId, offer });
    };

    const handleCallAccepted = async ({ answer }) => {
      console.log("✅ Call accepted");
      setCallConnecting(false);
      setOnCall(true);

      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );

        while (iceCandidatesQueue.current.length > 0) {
          const candidate = iceCandidatesQueue.current.shift();
          await peerConnectionRef.current.addIceCandidate(candidate);
        }
      }
    };

    const handleCallRejected = () => {
      console.log("❌ Call rejected");
      toast.error("Call was rejected");
      endCall();
    };

    const handleCallEnded = () => {
      console.log("📞 Call ended by partner");
      endCall();
    };

    const handleWebRTCSignal = async ({ data }) => {
      if (data.type === "ice-candidate") {
        if (
          peerConnectionRef.current &&
          peerConnectionRef.current.remoteDescription
        ) {
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
        } else {
          iceCandidatesQueue.current.push(new RTCIceCandidate(data.candidate));
        }
      }
    };

    socket.on("incomingCall", handleIncomingCall);
    socket.on("callAccepted", handleCallAccepted);
    socket.on("callRejected", handleCallRejected);
    socket.on("callEnded", handleCallEnded);
    socket.on("webrtcSignal", handleWebRTCSignal);

    return () => {
      socket.off("incomingCall", handleIncomingCall);
      socket.off("callAccepted", handleCallAccepted);
      socket.off("callRejected", handleCallRejected);
      socket.off("callEnded", handleCallEnded);
      socket.off("webrtcSignal", handleWebRTCSignal);
    };
  }, [room, myId]);

  // ==================== Message Handlers (Same as before) ====================
  useEffect(() => {
    if (!room || !myId) return;

    const handleReceiveMessage = (msg) => {
      if (!msg) return;

      const messageId = `${msg.sender}-${
        msg.timestamp || Date.now()
      }-${Math.random()}`;
      if (messageIdsRef.current.has(messageId)) return;
      messageIdsRef.current.add(messageId);

      const isSentByMe = msg.sender?.toString() === myId;

      const newMsg = {
        id: Date.now() + Math.random(),
        text: msg.message || "",
        mediaUrl: msg.message || null,
        type: isSentByMe ? "sent" : "received",
        contentType: msg.type || "text",
        sender: msg.sender,
        time: getCurrentTime(),
        timestamp: msg.timestamp || Date.now(),
        duration: msg.duration || 0,
      };

      setMessages((prev) => [...prev, newMsg]);
      if (!isSentByMe) setIsTyping(false);
    };

    const handlePartnerLeft = () => {
      if (hasRedirectedRef.current) return;
      hasRedirectedRef.current = true;
      setPartnerLeft(true);
      endCall();
      toast.error("Your partner left the chat");
      setTimeout(() => navigate("/home", { replace: true }), 1500);
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("partnerLeft", handlePartnerLeft);

    if (isAI && messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            id: Date.now(),
            text: "Hi! I'm your AI assistant. How can I help you today?",
            sender: "AI",
            time: getCurrentTime(),
            timestamp: Date.now(),
            type: "received",
            contentType: "text",
          },
        ]);
      }, 500);
    }

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("partnerLeft", handlePartnerLeft);
    };
  }, [room, myId, isAI, navigate, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const uploadMedia = async (file, mediaType) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/upload-chat-media`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success && response.data?.url) {
        toast.success(
          `${mediaType === "image" ? "Image" : "Voice note"} sent!`
        );
        return {
          success: true,
          url: response.data.url,
          type: response.data.type || mediaType,
        };
      }
      throw new Error("Invalid upload response");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Failed to upload ${mediaType}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }
    const result = await uploadMedia(file, "image");
    if (result?.success && result?.url) {
      sendMediaMessage(result.url, result.type || "image");
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setRecordingTime(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        clearInterval(recordingTimerRef.current);
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, {
          type: "audio/webm",
        });
        const result = await uploadMedia(audioFile, "audio");
        if (result?.success && result?.url) {
          const audio = new Audio(URL.createObjectURL(audioBlob));
          audio.onloadedmetadata = () => {
            const duration = Math.floor(audio.duration);
            sendMediaMessage(result.url, result.type || "audio", duration);
          };
        }
        stream.getTracks().forEach((track) => track.stop());
        setRecordingTime(0);
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Recording...");
    } catch (error) {
      console.error("Recording error:", error);
      toast.error("Could not access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
    }
  };

  const toggleAudioPlay = (messageId, audioUrl) => {
    const audio = audioRefs.current[messageId];
    if (!audio) {
      const newAudio = new Audio(audioUrl);
      audioRefs.current[messageId] = newAudio;
      newAudio.addEventListener("timeupdate", () => {
        setAudioProgress((prev) => ({
          ...prev,
          [messageId]: (newAudio.currentTime / newAudio.duration) * 100,
        }));
      });
      newAudio.addEventListener("ended", () => {
        setPlayingAudio(null);
        setAudioProgress((prev) => ({ ...prev, [messageId]: 0 }));
      });
      newAudio.play();
      setPlayingAudio(messageId);
    } else {
      if (playingAudio === messageId) {
        audio.pause();
        setPlayingAudio(null);
      } else {
        Object.keys(audioRefs.current).forEach((id) => {
          if (id !== messageId) audioRefs.current[id]?.pause();
        });
        audio.play();
        setPlayingAudio(messageId);
      }
    }
  };

  const sendMediaMessage = (mediaUrl, messageType, duration = 0) => {
    if (!room || partnerLeft || !mediaUrl) return;

    const sentMsg = {
      id: Date.now() + Math.random(),
      text: "",
      mediaUrl: mediaUrl,
      contentType: messageType,
      sender: myId,
      type: "sent",
      time: getCurrentTime(),
      timestamp: Date.now(),
      duration: duration || 0,
    };

    setMessages((prev) => [...prev, sentMsg]);

    socket.emit("sendMessage", {
      room,
      sender: myId,
      reciver: partnerData?.id || "AI",
      message: mediaUrl,
      type: messageType,
      duration,
      timestamp: new Date(),
    });
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !room || partnerLeft) return;
    const messageText = newMessage.trim();
    setNewMessage("");

    const sentMsg = {
      id: Date.now() + Math.random(),
      text: messageText,
      sender: myId,
      type: "sent",
      time: getCurrentTime(),
      timestamp: Date.now(),
      contentType: "text",
    };

    setMessages((prev) => [...prev, sentMsg]);

    socket.emit("sendMessage", {
      room,
      sender: myId,
      reciver: partnerData?.id || "AI",
      message: messageText,
      type: "text",
      timestamp: new Date(),
    });

    if (isAI) setIsTyping(true);
  };

  const handleLeaveRoom = () => {
    if (!room || !myId) return;
    endCall();
    socket.emit("leaveRoom", { userId: myId, room });
    setShowModal(false);
    toast.success("Chat ended successfully");
    setTimeout(() => {
      const token = localStorage.getItem("authToken");
      navigate(token ? "/home" : "/", { replace: true });
    }, 500);
  };

  const handleFindNext = () => {
    if (room && myId) {
      endCall();
      socket.emit("leaveRoom", { userId: myId, room });
    }
    setShowModal(false);
    toast.success("Finding your next match...");
    setTimeout(() => {
      const token = localStorage.getItem("authToken");
      navigate(token ? "/home" : "/", { replace: true });
    }, 500);
  };

  const profileImg = `https://api.dicebear.com/7.x/notionists/svg?seed=${
    partnerData?.name || "stranger"
  }`;

  if (!myId) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 text-white">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 bg-purple-950/60 backdrop-blur-md border-b border-pink-600/40 shadow-lg flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <img
            src={profileImg}
            alt="profile"
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-pink-500 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h2 className="text-white font-semibold text-sm sm:text-base truncate">
              {partnerData?.name || "Stranger"}
            </h2>
            {isAI ? (
              <span className="text-purple-300 text-[10px] sm:text-xs">
                🤖 AI Assistant
              </span>
            ) : partnerLeft ? (
              <span className="text-red-400 text-[10px] sm:text-xs">
                ⚠️ Left the chat
              </span>
            ) : (
              <span className="text-green-400 text-[10px] sm:text-xs">
                🟢 Online
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Video Call Button */}
          {!isAI && !partnerLeft && !onCall && !callConnecting && (
            <button
              onClick={startCall}
              className="bg-green-500 p-2 rounded-full hover:bg-green-600 transition-colors"
              title="Start Video Call"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="text-[10px] sm:text-xs bg-red-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-white font-semibold hover:bg-red-600 transition-colors flex-shrink-0 whitespace-nowrap"
          >
            End Chat
          </button>
        </div>
      </div>

      {/* Video Call UI */}
      {(onCall || callConnecting) && (
        <div className="absolute inset-0 z-50 bg-black">
          {/* Remote Video (Full Screen) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute top-4 right-4 w-32 h-40 sm:w-40 sm:h-48 bg-gray-800 rounded-lg overflow-hidden border-2 border-white shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>

          {/* Call Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-md px-6 py-4 rounded-full">
            <button
              onClick={toggleMute}
              className={`p-4 rounded-full transition-colors ${
                isMuted ? "bg-red-500" : "bg-white/20 hover:bg-white/30"
              }`}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMuted ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                )}
              </svg>
            </button>

            <button
              onClick={endCall}
              className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"
                />
              </svg>
            </button>

            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-colors ${
                isVideoOff ? "bg-red-500" : "bg-white/20 hover:bg-white/30"
              }`}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isVideoOff ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Connecting Overlay */}
          {callConnecting && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white text-xl">Calling...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Incoming Call Modal */}
      {incomingCall && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-purple-900 rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Incoming Video Call
            </h3>
            <p className="text-purple-300 mb-6">
              {partnerData?.name || "Stranger"} is calling...
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={rejectCall}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-full text-white font-semibold transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Decline
              </button>
              <button
                onClick={() => acceptCall(incomingCall.offer)}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-full text-white font-semibold transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto px-3 sm:px-4 py-2 overscroll-contain"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex flex-col gap-2 pb-2 max-w-4xl mx-auto">
          {messages.length === 0 && room && !isAI && (
            <div className="text-center text-purple-300 text-xs sm:text-sm mt-4">
              👋 Say hi to your match!
            </div>
          )}

          {partnerLeft && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-2 sm:p-3 text-center text-red-300 text-xs sm:text-sm">
              ⚠️ Your partner has left the chat
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.type === "sent" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl shadow-md ${
                  msg.type === "sent"
                    ? "bg-pink-500 text-black rounded-br-sm"
                    : "bg-purple-700 text-white rounded-bl-sm"
                }`}
              >
                {msg.contentType === "image" && msg.mediaUrl && (
                  <div className="p-1">
                    <img
                      src={msg.mediaUrl}
                      alt="Shared"
                      className="rounded-xl max-w-full h-auto max-h-48 sm:max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(msg.mediaUrl, "_blank")}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/200?text=Failed+to+Load";
                      }}
                    />
                    <span className="text-[8px] sm:text-[9px] opacity-60 mt-1 block px-2 pb-1">
                      {msg.time}
                    </span>
                  </div>
                )}

                {msg.contentType === "audio" && msg.mediaUrl && (
                  <div className="p-2 sm:p-3 min-w-[180px] sm:min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleAudioPlay(msg.id, msg.mediaUrl)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.type === "sent"
                            ? "bg-white/20 hover:bg-white/30"
                            : "bg-purple-600 hover:bg-purple-500"
                        } transition-colors`}
                      >
                        {playingAudio === msg.id ? (
                          <svg
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M6 4h2v12H6V4zm6 0h2v12h-2V4z" />
                          </svg>
                        ) : (
                          <svg
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M6.3 4.1c-.5-.3-1 0-1 .5v10.8c0 .5.5.8 1 .5l8.6-5.4c.4-.3.4-.9 0-1.2L6.3 4.1z" />
                          </svg>
                        )}
                      </button>
                      <div className="flex-1 flex items-center gap-0.5 h-6 sm:h-8 min-w-0">
                        {[...Array(20)].map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-full transition-all ${
                              msg.type === "sent"
                                ? "bg-white/30"
                                : "bg-purple-400/40"
                            }`}
                            style={{
                              height: `${Math.random() * 60 + 40}%`,
                              opacity:
                                (audioProgress[msg.id] || 0) > i * 5 ? 1 : 0.5,
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] sm:text-xs opacity-70 min-w-[30px] sm:min-w-[35px] flex-shrink-0 text-right">
                        {msg.duration ? formatDuration(msg.duration) : "0:00"}
                      </span>
                    </div>
                    <span className="text-[8px] sm:text-[9px] opacity-60 mt-1 block">
                      {msg.time}
                    </span>
                  </div>
                )}

                {msg.contentType === "text" && msg.text && (
                  <div className="px-2.5 sm:px-3 py-1.5 sm:py-2">
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.text}
                    </p>
                    <span className="text-[8px] sm:text-[9px] opacity-60 mt-0.5 block">
                      {msg.time}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-purple-700 text-white px-3 sm:px-4 py-2 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-purple-950/40 backdrop-blur-xl border-t border-pink-600/30 flex-shrink-0">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={!room || partnerLeft || isUploading}
          className="bg-purple-600 p-2 sm:p-2.5 rounded-full hover:bg-purple-500 disabled:opacity-50 transition-all flex-shrink-0"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!room || partnerLeft || isUploading}
          className={`p-2 sm:p-2.5 rounded-full disabled:opacity-50 transition-all flex-shrink-0 ${
            isRecording
              ? "bg-red-500 animate-pulse"
              : "bg-purple-600 hover:bg-purple-500"
          }`}
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </button>

        {isRecording && (
          <div className="text-red-400 text-xs sm:text-sm font-mono animate-pulse flex-shrink-0">
            {formatDuration(recordingTime)}
          </div>
        )}

        {!isRecording && (
          <>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={
                isUploading
                  ? "Uploading..."
                  : partnerLeft
                  ? "Chat ended"
                  : "Type a message..."
              }
              disabled={!room || partnerLeft || isUploading}
              className="flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-purple-900/50 text-white text-xs sm:text-sm placeholder-purple-300/70 border border-purple-700/50 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              onClick={handleSend}
              disabled={!room || !newMessage.trim() || partnerLeft}
              className="bg-gradient-to-r from-purple-500 to-pink-500 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-black text-xs sm:text-sm font-bold disabled:opacity-50 transition-all flex-shrink-0 whitespace-nowrap"
            >
              Send
            </button>
          </>
        )}
      </div>

      {isUploading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-purple-900 rounded-xl p-4 sm:p-6 shadow-2xl mx-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white font-semibold text-sm sm:text-base">
                Uploading...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Confirm End Chat Modal */}
      {showModal && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-purple-900 rounded-2xl p-6 shadow-2xl max-w-sm mx-4">
            <h3 className="text-xl font-bold text-white mb-4">End Chat?</h3>
            <p className="text-purple-300 mb-6">
              Do you want to end this chat or find a new match?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFindNext}
                className="flex-1 px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-white font-semibold transition-colors"
              >
                Find Next
              </button>
              <button
                onClick={handleLeaveRoom}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-semibold transition-colors"
              >
                End Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatUI;
