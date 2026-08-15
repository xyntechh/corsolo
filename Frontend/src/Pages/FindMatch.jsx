import React, { useEffect, useState } from "react";
import LoadingScreen from "../Pages/LoadingScreen";
import ChatUI from "../Pages/ChatUI";
import { socket } from "../socket";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

function FindMatch() {
  const tokenString = localStorage.getItem("authToken");
  const decoded = tokenString ? jwtDecode(tokenString) : null;
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const mode = params.get("mode") || "random";

  const [screen, setScreen] = useState("home");
  const [room, setRoom] = useState(null);
  const [partner, setPartner] = useState(null);
  const [queueStatus, setQueueStatus] = useState("Searching for a match...");

  // ✅ IMPORTANT: Store userId in state to prevent re-decoding
  const [myUserId, setMyUserId] = useState(null);

  useEffect(() => {
    if (!decoded) return;

    const userId = decoded.userId || decoded.id;
    setMyUserId(userId); // Store it

    console.log("🔍 FULL TOKEN DECODED:", decoded);
    console.log("🆔 My User ID (from token):", userId);
    console.log("🔑 Token string:", tokenString.substring(0, 50) + "...");

    console.log("🔍 FindMatch: Starting matchmaking", {
      userId,
      socketConnected: socket.connected,
    });

    let lookingFor = "random";

    if (mode === "girls") lookingFor = "female";
    if (mode === "boys") lookingFor = "male";
    if (mode === "random") lookingFor = "random";

    console.log("userid", userId, "looking for", lookingFor);

    // Wait for socket connection
    const startMatching = () => {
      // 🟣 PAID GIRLS CHAT
      if (mode === "girls") {
        console.log("💰 Paid chat requested");

        socket.emit("requestGirlChat", {
          userId,
          lookingFor: "female",
        });

        return;
      }

      // 🟢 NORMAL MATCHMAKING
      console.log("🎲 Random/Boys matchmaking");

      socket.emit("joinQueue", {
        userId,
        lookingFor,
      });
    };

    if (socket.connected) startMatching();
    else socket.on("connect", startMatching);

    socket.on("startRandomQueue", ({ userId, lookingFor }) => {
      console.log("↩️ Falling back to random");

      socket.emit("joinQueue", {
        userId,
        lookingFor,
      });
    });

    // ✅ Listen for queue status
    const handleQueueStatus = (data) => {
      console.log("📊 Queue status:", data);
      setQueueStatus(data.message || "Looking for a match...");
    };

    // ✅ Listen for match found
    const handleMatchFound = (data) => {
      console.log("🎉 Match found!", data);
      console.log("🆔 MY ID (stored):", userId);
      console.log("👤 PARTNER ID from backend:", data.partner?.id);
      console.log("❓ Are they same?", userId === data.partner?.id);

      if (!data.room) {
        console.error("❌ No room in matchFound data");
        return;
      }

      // ✅ IMPORTANT: Use the correct partner ID
      const partnerId = data.partner?.id || data.partnerId;
      const partnerName =
        data.partner?.name || `User ${(partnerId || "").substring(0, 8)}`;

      console.log("Find match m se partner ka data", data);

      console.log("✅ Setting partner:", { id: partnerId, name: partnerName });

      // ⚠️ SAFETY CHECK: Partner ID should NOT be same as my ID
      if (partnerId === userId) {
        console.error("❌❌❌ CRITICAL ERROR: Partner ID is same as my ID!");
        console.error("This means backend sent wrong data!");
        alert("Error: Matched with yourself! Please refresh.");
        return;
      }

      setRoom(data.room);
      setPartner({
        id: partnerId,
        name: partnerName,
      });
      setScreen("home");
      console.log("✅ Switched to chat screen");
    };

    // ✅ Listen for AI chat
    const handleAiChatStart = (data) => {
      console.log("🤖 AI chat started", data);

      if (!data.room) {
        console.error("❌ No room in aiChatStart data");
        return;
      }

      setRoom(data.room);
      setPartner({
        id: "AI",
        name: "AI Assistant",
      });
      setScreen("ai");
      console.log("✅ Switched to AI chat screen");
    };

    // ✅ Listen for chat ready (backup)
    const handleChatReady = (data) => {
      console.log("✅ Chat ready event:", data);
    };

    // ✅ Listen for partner left
    const handlePartnerLeft = (data) => {
      toast.error("Your partner has left the chat");
      window.location.href = "/home";
      console.log(data, "Partner Left Reason Data");
    };

    // ✅ Listen for errors
    const handleError = (data) => {
      console.error("❌ Socket error:", data);
      alert(data.message || "An error occurred");
    };

    // ✅ Listen
    const girlNotAvailable = (data) => {
      console.log("⚠️ Girl chat not available, falling back to random", data);

      socket.emit("joinQueue", {
        userId,
        lookingFor: "random",
      });
    };

    // Register all listeners
    socket.on("queueStatus", handleQueueStatus);
    socket.on("matchFound", handleMatchFound);
    socket.on("aiChatStart", handleAiChatStart);
    socket.on("chatReady", handleChatReady);
    socket.on("partnerLeft", handlePartnerLeft);
    socket.on("error", handleError);
    socket.on("girlNotAvailable", girlNotAvailable); // Reuse queue status handler

    // Cleanup
    return () => {
      console.log("🧹 FindMatch: Cleaning up");
      socket.removeAllListeners("queueStatus");
      socket.removeAllListeners("matchFound");
      socket.removeAllListeners("aiChatStart");
      socket.removeAllListeners("chatReady");
      socket.removeAllListeners("partnerLeft");
      socket.removeAllListeners("error");
      socket.removeAllListeners("startRandomQueue");
      socket.removeAllListeners("girlChatStarted");
    };
  }, []); // Empty dependency - run once

  if (!decoded) {
    return (
      <div className="flex items-center justify-center h-screen text-white bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Please Login</h2>
          <p className="text-purple-300">You need to login to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {(screen === "chat" || screen === "ai") && room && partner && (
        <ChatUI
          userData={{
            id: myUserId || decoded.userId || decoded.id,
            name: decoded.name || decoded.username || "You",
          }}
          partnerData={partner}
          room={room}
          isAI={screen === "ai"}
        />
      )}
    </>
  );
}

export default FindMatch;
