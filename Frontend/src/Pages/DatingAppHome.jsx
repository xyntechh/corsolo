import React, { useState, useEffect, useContext } from "react";
import {
  Heart,
  MessageCircle,
  Sparkles,
  Zap,
  Users,
  TrendingUp,
  Gift,
  X,
} from "lucide-react";
import { useUser } from "../Context/UserContext";
import AddCoin from "../Components/AddCoin";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Ebook from "../Banner/Ebook";
import ValentineAdPopup from "../Banner/ValentineAdPopup";

export default function DatingAppHome() {
  const [coins, setCoins] = useState();
  const [isMatchingActive, setIsMatchingActive] = useState(false);
  const [userGender, setUserGender] = useState("male");
  const [showMatchOptions, setShowMatchOptions] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  // ✅ IMPORTANT: Store userId in state to prevent re-decoding

  const [showAddCoin, setShowAddCoin] = useState(false);
  const { user, loading, setUser, fetchUser } = useUser();

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // page load hote hi popup open
    setShowPopup(true);
  }, []);

  const matchesInfo = [
    {
      type: "random",
      icon: Sparkles,
      label: "Random Match",
      badge: "✨ Free",
      color: "from-purple-500 to-indigo-600",
      coin: 0,
    },
    {
      type: "girls",
      icon: Heart,
      label: "Chat with Girls",
      badge: "💰 10",
      color: "from-pink-500 to-rose-600",
      coin: 10,
    },
    {
      type: "boys",
      icon: MessageCircle,
      label: "Chat with Boys",
      badge: "💰 10",
      color: "from-blue-500 to-cyan-600",
      coin: 10,
    },
  ];

  //SETING USER INFORMATION
  const userCoins = user?.coin;

  const navigate = useNavigate();

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
        },
      );

      console.log(res.data);

      fetchUser();

      return res.data;
    } catch (error) {
      console.log("Error while debiting coin:", error);
    }
  };

  useEffect(() => {
    setCoins(userCoins);
  }, [user]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    const preventDefault = (e) => {
      if (e.touches && e.touches.length > 1) e.preventDefault();
    };

    const preventZoom = (e) => {
      if (e.ctrlKey || e.metaKey) e.preventDefault();
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("gesturestart", preventDefault);
    document.addEventListener("gesturechange", preventDefault);
    document.addEventListener("gestureend", preventDefault);
    document.addEventListener("wheel", preventZoom, { passive: false });
    document.addEventListener("keydown", preventZoom);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("gesturestart", preventDefault);
      document.removeEventListener("gesturechange", preventDefault);
      document.removeEventListener("gestureend", preventDefault);
      document.removeEventListener("wheel", preventZoom);
      document.removeEventListener("keydown", preventZoom);
    };
  }, []);

  const maleChats = [
    {
      id: 1,
      name: "Priya",
      message: "Hey! How are you?",
      time: "2m",
      unread: true,
      avatar: "👩",
      coins: 50,
    },
    {
      id: 2,
      name: "Ananya",
      message: "That sounds amazing!",
      time: "15m",
      unread: false,
      avatar: "👱‍♀️",
      coins: 30,
    },
    {
      id: 3,
      name: "Neha",
      message: "See you tonight!",
      time: "1h",
      unread: true,
      avatar: "👩‍🦰",
      coins: 45,
    },
    {
      id: 4,
      name: "Kajal",
      message: "Let me know when you are free",
      time: "2h",
      unread: false,
      avatar: "👸",
      coins: 25,
    },
    {
      id: 5,
      name: "Pooja",
      message: "Great to meet you!",
      time: "3h",
      unread: false,
      avatar: "👩‍💻",
      coins: 35,
    },
    {
      id: 6,
      name: "Riya",
      message: "Looking forward!",
      time: "4h",
      unread: false,
      avatar: "👩‍🎨",
      coins: 40,
    },
  ];

  const femaleChats = [
    {
      id: 1,
      name: "Rahul",
      message: "Hey! How are you?",
      time: "2m",
      unread: true,
      avatar: "👨",
      coins: 50,
    },
    {
      id: 2,
      name: "Aman",
      message: "That sounds amazing!",
      time: "15m",
      unread: false,
      avatar: "👨‍💼",
      coins: 30,
    },
    {
      id: 3,
      name: "Rohit",
      message: "See you tonight!",
      time: "1h",
      unread: true,
      avatar: "🧔",
      coins: 45,
    },
    {
      id: 4,
      name: "Kunal",
      message: "Let me know when you are free",
      time: "2h",
      unread: false,
      avatar: "👨‍🎓",
      coins: 25,
    },
    {
      id: 5,
      name: "Sandeep",
      message: "Great to meet you!",
      time: "3h",
      unread: false,
      avatar: "👨‍💻",
      coins: 35,
    },
    {
      id: 6,
      name: "Vikas",
      message: "Looking forward!",
      time: "4h",
      unread: false,
      avatar: "👨‍🎨",
      coins: 40,
    },
  ];

  const handlechat = (coin) => {
    if (userCoins < coin) {
      toast.error("You do not have enough coins");
      setIsMatchingActive(false);
      return; // <-- IMPORTANT
    }

    debitUserCoin(coin);
    navigate("/chat");
  };

  const recentChats = userGender === "male" ? maleChats : femaleChats;

  const handleFindMatch = () => setShowMatchOptions(!showMatchOptions);

  const handleMatchOption = (option, coin) => {
    setIsMatchingActive(true);

    // Random
    if (option === "random") {
      navigate("/chat?mode=random");
      return;
    }

    // Girls / Boys → need coins
    if (option === "girls" || option === "boys") {
      if (userCoins < coin) {
        toast.error("You do not have enough coins");
        setIsMatchingActive(false);
        return;
      }

      debitUserCoin(coin);
      navigate(`/chat?mode=${option}`);
      return;
    }
  };

  const toggleGender = () =>
    setUserGender(userGender === "male" ? "female" : "male");

  return (
    <>
      <style>{`
        * {
          -webkit-user-select: none;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        
        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: fixed;
        }
        
        @media (max-width: 767px) {
          html, body, #root {
            height: 100dvh;
          }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .delay-2 { animation-delay: 2s; }
        .delay-4 { animation-delay: 4s; }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer { animation: shimmer 3s infinite; }
        
        @keyframes float {
          0% { transform: translateY(100vh) rotate(0); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-20vh) rotate(360deg); opacity: 0; }
        }
        .animate-float { animation: float linear infinite; }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        
        .scrollable {
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.3) transparent;
        }
        .scrollable::-webkit-scrollbar { width: 6px; }
        .scrollable::-webkit-scrollbar-track { background: transparent; }
        .scrollable::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 10px; }
      `}</style>

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />

      <div className="fixed inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob delay-2"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob delay-4"></div>
        </div>

        {isMobile ? (
          <div className="relative gap-2 z-10 w-full h-full flex flex-col">
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="text-2xl">💝</div>
                <h2
                  className="text-white font-bold text-lg"
                  style={{ fontFamily: "cursive" }}
                >
                  Corsolo
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <div
                  onClick={() => setShowAddCoin(true)}
                  className="bg-white bg-opacity-20 backdrop-blur-lg rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-white border-opacity-30 shadow-lg"
                >
                  <span className="text-lg">💰</span>
                  <span className="text-white font-bold text-xs">{coins}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 border-2 border-white shadow-lg flex items-center justify-center text-xl cursor-pointer active:scale-95 transition-transform">
                  👤
                </div>
              </div>
            </div>

            <div>
              <Ebook />
            </div>

            <div className="flex-1 px-4 flex flex-col overflow-hidden min-h-0">
              <div className="text-center mb-1.5 flex-shrink-0">
                <h1
                  className="text-xl font-bold text-white mb-0.5"
                  style={{ textShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
                >
                  {user?.name} ✨
                </h1>
                <p className="text-white text-opacity-90 text-xs font-medium mb-1.5">
                  Your perfect match is waiting...
                </p>
              </div>

              <div className="grid grid-cols-3 gap-1.5 mb-1.5 flex-shrink-0">
                <div className="bg-white bg-opacity-15 backdrop-blur-md rounded-xl p-2 border border-white border-opacity-20 shadow-xl">
                  <Heart className="w-4 h-4 text-pink-200 mb-1 mx-auto" />
                  <p className="text-white font-bold text-base text-center">
                    {user?.likes}
                  </p>
                  <p className="text-white text-opacity-80 text-xs text-center">
                    Likes
                  </p>
                </div>
                <div className="bg-white bg-opacity-15 backdrop-blur-md rounded-xl p-2 border border-white border-opacity-20 shadow-xl">
                  <Sparkles className="w-4 h-4 text-yellow-200 mb-1 mx-auto" />
                  <p className="text-white font-bold text-base text-center">
                    {user?.likes}
                  </p>
                  <p className="text-white text-opacity-80 text-xs text-center">
                    Matches
                  </p>
                </div>
                <div className="bg-white bg-opacity-15 backdrop-blur-md rounded-xl p-2 border border-white border-opacity-20 shadow-xl">
                  <MessageCircle className="w-4 h-4 text-blue-200 mb-1 mx-auto" />
                  <p className="text-white font-bold text-base text-center">
                    {user?.chats}
                  </p>
                  <p className="text-white text-opacity-80 text-xs text-center">
                    Chats
                  </p>
                </div>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-3 border border-white border-opacity-20 shadow-2xl flex-1 mb-2 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-2 flex-shrink-0">
                  <h2 className="text-white font-bold text-sm flex items-center gap-1.5">
                    💬 Friends
                  </h2>
                  <span className="text-white text-opacity-70 text-xs">
                    View All
                  </span>
                </div>

                <div className="scrollable space-y-2 pr-1 flex-1 min-h-0">
                  {recentChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => handlechat(chat.coins)}
                      className="bg-white bg-opacity-15 backdrop-blur-sm rounded-xl p-2 border border-white border-opacity-10 cursor-pointer active:scale-95 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center text-xl shadow-md flex-shrink-0">
                          {chat.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <h3 className="text-white font-semibold text-xs">
                              {chat.name}
                            </h3>
                            <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full px-1.5 py-0.5 flex items-center gap-0.5">
                              <span className="text-xs">💰</span>
                              <span className="text-xs font-bold text-yellow-900">
                                {chat.coins}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-white text-opacity-80 text-xs truncate flex-1">
                              {chat.message}
                            </p>
                            <span className="text-white text-opacity-60 text-xs flex-shrink-0">
                              {chat.time}
                            </span>
                          </div>
                        </div>
                        {chat.unread && (
                          <div className="w-1.5 h-1.5 rounded-full bg-pink-400 shadow-lg flex-shrink-0"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 px-4 pb-3 relative">
              {showMatchOptions && (
                <div className="absolute bottom-full left-4 right-4 mb-2 animate-slide-up">
                  <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl p-3 border border-white border-opacity-30 shadow-2xl space-y-2">
                    {matchesInfo.map((opt) => (
                      <button
                        key={opt.type}
                        onClick={() => handleMatchOption(opt.type, opt.coin)}
                        className={`w-full bg-gradient-to-r ${opt.color} text-white font-bold text-sm py-2.5 px-3 rounded-2xl shadow-lg border border-white border-opacity-20 active:scale-95 transition-all flex items-center gap-2`}
                      >
                        <div className="w-7 h-7 rounded-full bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0">
                          <opt.icon className="w-4 h-4" fill="currentColor" />
                        </div>
                        <span className="flex-1 text-left">{opt.label}</span>
                        <div className="text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded-full">
                          {opt.badge}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleFindMatch}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-base py-3.5 rounded-full shadow-2xl border-2 border-white border-opacity-30 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 relative overflow-hidden"
                style={{ boxShadow: "0 20px 60px rgba(219, 39, 119, 0.5)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer"></div>
                <Zap className="w-5 h-5" fill="currentColor" />
                {isMatchingActive ? "Finding Match..." : "Find Match"}
                <Heart className="w-5 h-5" fill="currentColor" />
              </button>

              <p className="text-white text-opacity-70 text-center text-xs mt-1.5 flex items-center justify-center gap-1">
                <span>✨</span>
                Swipe right to find your soulmate
                <span>💕</span>
              </p>
            </div>

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-3xl animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${3 + Math.random() * 2}s`,
                    opacity: 0.2,
                  }}
                >
                  {i % 3 === 0 ? "💖" : i % 3 === 1 ? "✨" : "💕"}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative z-10 w-full h-full flex items-center justify-center p-6">
            <div className="w-full max-w-6xl h-full flex gap-6">
              <div className="w-80 flex flex-col gap-4">
                <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-6 border border-white border-opacity-20 shadow-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 border-4 border-white shadow-lg flex items-center justify-center text-3xl">
                      👤
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-xl mb-1">
                        {user?.name}
                      </h2>
                      <div
                        onClick={() => setShowAddCoin(true)}
                        className="bg-white bg-opacity-20 cursor-pointer rounded-full px-3 py-1 flex items-center gap-1.5"
                      >
                        <span className="text-sm">💰</span>
                        <span className="text-white font-bold text-sm">
                          {coins}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="inline-flex bg-white bg-opacity-20 rounded-full p-1 border border-white border-opacity-30 w-full">
                    <button
                      onClick={toggleGender}
                      className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        userGender === "male"
                          ? "bg-white text-purple-600 shadow-lg"
                          : "text-white"
                      }`}
                    >
                      👨 Male
                    </button>
                    <button
                      onClick={toggleGender}
                      className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        userGender === "female"
                          ? "bg-white text-purple-600 shadow-lg"
                          : "text-white"
                      }`}
                    >
                      👩 Female
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      icon: Heart,
                      count: 24,
                      label: "Likes",
                      color: "text-pink-200",
                    },
                    {
                      icon: Sparkles,
                      count: 12,
                      label: "Matches",
                      color: "text-yellow-200",
                    },
                    {
                      icon: MessageCircle,
                      count: 8,
                      label: "Chats",
                      color: "text-blue-200",
                    },
                    {
                      icon: Users,
                      count: 156,
                      label: "Views",
                      color: "text-green-200",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-4 border border-white border-opacity-20 shadow-xl"
                    >
                      <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
                      <p className="text-white font-bold text-2xl">
                        {stat.count}
                      </p>
                      <p className="text-white text-opacity-80 text-sm">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-4 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">💝</div>
                    <div>
                      <h1
                        className="text-white font-bold text-3xl"
                        style={{ fontFamily: "cursive" }}
                      >
                        Corsolo
                      </h1>
                      <p className="text-white text-opacity-80 text-sm">
                        Find your perfect match today
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-6 border border-white border-opacity-20 shadow-2xl flex flex-col min-h-0">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-white font-bold text-xl">
                      💬 Recent Conversations
                    </h2>
                    <span className="text-white text-opacity-70 text-sm cursor-pointer hover:text-opacity-100">
                      View All
                    </span>
                  </div>

                  <div className="scrollable grid grid-cols-1 gap-3 pr-2 flex-1 min-h-0">
                    {recentChats.map((chat) => (
                      <div
                        key={chat.id}
                        className="bg-white bg-opacity-15 backdrop-blur-sm rounded-2xl p-4 border border-white border-opacity-10 cursor-pointer hover:bg-opacity-25 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center text-2xl shadow-md flex-shrink-0">
                            {chat.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="text-white font-semibold text-base">
                                {chat.name}
                              </h3>
                              <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full px-2 py-1 flex items-center gap-1">
                                <span className="text-sm">💰</span>
                                <span className="text-sm font-bold text-yellow-900">
                                  {chat.coins}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-white text-opacity-80 text-sm truncate flex-1">
                                {chat.message}
                              </p>
                              <span className="text-white text-opacity-60 text-sm">
                                {chat.time}
                              </span>
                            </div>
                          </div>
                          {chat.unread && (
                            <div className="w-2 h-2 rounded-full bg-pink-400 shadow-lg flex-shrink-0"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleFindMatch}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg py-4 rounded-full shadow-2xl border-2 border-white border-opacity-30 transition-all hover:scale-105 flex items-center justify-center gap-3 relative overflow-hidden"
                  style={{ boxShadow: "0 20px 60px rgba(219, 39, 119, 0.5)" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer"></div>
                  <Zap className="w-6 h-6" fill="currentColor" />
                  {isMatchingActive
                    ? "Finding Your Match..."
                    : "Find Your Perfect Match"}
                  <Heart className="w-6 h-6" fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="w-full h-full">
          {showAddCoin && <AddCoin onClose={() => setShowAddCoin(false)} />}
        </div>

        {showPopup && <ValentineAdPopup setShowPopup={setShowPopup} />}
      </div>
    </>
  );
}
