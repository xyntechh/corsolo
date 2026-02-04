import React, { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import toast from "react-hot-toast";
import LoadingScreen from "./LoadingScreen";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../Context/UserContext";

function LookingFor() {
  const [lookingFor, setLookingFor] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  const { fetchUser } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    // Prevent body scroll and zoom
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.height = "100%";

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    };
  }, []);

  const handleFinalSubmit = async () => {
    if (!lookingFor) return toast.error("Select a preference!");

    setLoading(true);
    setShowLoadingScreen(true);

    try {
      const token = localStorage.getItem("authToken"); // token get

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/update`,
        { lookingFor },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setShowLoadingScreen(false);
        fetchUser();
        setLoading(false);
        navigate("/home");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
      setShowLoadingScreen(false);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 px-4 overflow-hidden">
      <div className="w-full max-w-md backdrop-blur-xl bg-purple-950/40 border border-purple-700/50 rounded-3xl shadow-2xl p-8 flex flex-col justify-center gap-8 relative">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute top-8 right-8 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl animate-pulse"></div>
          <div
            className="absolute bottom-8 left-8 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* Heart Icon with Animation */}
        <div className="flex justify-center z-10">
          <div className="relative">
            <div
              className="text-6xl animate-pulse"
              style={{ animationDuration: "2s" }}
            >
              💕
            </div>
            <div
              className="absolute -top-2 -right-2 text-2xl animate-bounce"
              style={{ animationDuration: "1.5s" }}
            >
              ✨
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-wide">
            Who Are You Looking For?
          </h1>
          <p className="text-purple-200 text-sm">
            Choose your preference and find your perfect match!
          </p>
        </div>

        {/* Gender Cards with Icons */}
        <div className="flex gap-4 w-full z-10">
          {[
            { value: "Male", icon: "👨", emoji: "💙" },
            { value: "Female", icon: "👩", emoji: "💖" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setLookingFor(opt.value)}
              className={`flex-1 py-6 rounded-2xl font-semibold transition-all duration-300 relative overflow-hidden group ${
                lookingFor === opt.value
                  ? "bg-gradient-to-br from-pink-500 to-pink-600 text-black shadow-2xl scale-105 border-2 border-pink-400"
                  : "bg-purple-700/50 text-white hover:bg-purple-700/70 border-2 border-purple-600/50"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">{opt.icon}</span>
                <span className="text-base font-bold">{opt.value}</span>
                {lookingFor === opt.value && (
                  <span className="text-xl animate-bounce">{opt.emoji}</span>
                )}
              </div>

              {/* Hover Effect */}
              {lookingFor !== opt.value && (
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-purple-500/0 group-hover:from-pink-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
              )}
            </button>
          ))}
        </div>

        {/* Submit Button with Heart */}
        <button
          onClick={handleFinalSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-black font-bold py-4 rounded-2xl shadow-2xl disabled:opacity-70 transition-all active:scale-95 z-10 text-base"
        >
          {loading ? (
            <ClipLoader size={24} color="#000" />
          ) : (
            <>
              <span>Start Matching</span>
              <span className="text-xl animate-pulse">💝</span>
            </>
          )}
        </button>

        {/* Footer with Hearts */}
        <div className="text-center text-purple-300 text-xs z-10 flex items-center justify-center gap-2">
          <span>💫</span>
          <span>Your perfect match is just a click away!</span>
          <span>💫</span>
        </div>
      </div>
    </div>
  );
}

export default LookingFor;
