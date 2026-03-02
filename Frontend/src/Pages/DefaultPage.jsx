import axios from "axios";
import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader"; // ADDED
import ValentineAdPopup from "../Banner/ValentineAdPopup";
import LalufiBanner from "../Banner/LalufiBanner";

function DefaultPage() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

  //TRACKING REFRAL CODE
  useEffect(() => {
    console.log("Page loaded");

    const params = new URLSearchParams(window.location.search);
    const refCode = params.get("ref");

    console.log("Referral code:", refCode);

    if (!refCode) {
      console.log("No referral code found");
      return;
    }

    const alreadyTracked = localStorage.getItem(`ref_click_${refCode}`);

    if (alreadyTracked) return;

    localStorage.setItem("referralCode", refCode);
    localStorage.setItem(`ref_click_${refCode}`, "true");

    axios
      .post(`${import.meta.env.VITE_API_URL}/api/refferal/clickCatch`, {
        code: refCode,
      })
      .then(() => console.log("Referral API hit successfully"))
      .catch((err) => console.error("Referral API error", err));
  }, []);

  const navigate = useNavigate();

  const handleGuestLogin = () => {
    navigate("/guest");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignUP = () => {
    navigate("/signUp");
  };

  const handleTelegramClick = () => {
    window.open("https://t.me/+rf1YsmQF5QMyMjI9", "_blank");
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 px-4 overflow-hidden">
      <div className="w-full max-w-md backdrop-blur-lg bg-purple-900/40 border border-purple-700 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col justify-center gap-5">
        {/* GAMING BANNER */}

        <LalufiBanner />

        <div className="flex flex-col gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-center text-white tracking-wide">
            Find Your Perfect Match
          </h1>
          <p className="text-center text-purple-200 text-xs sm:text-sm">
            Enter your details below and start connecting!
          </p>
        </div>

        <button
          onClick={handleGuestLogin}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-black font-semibold p-4 rounded-xl shadow-lg disabled:opacity-70 transition-all active:scale-95"
        >
          {loading ? <ClipLoader size={28} color="#000" /> : "Start As A Guest"}
        </button>

        <button
          onClick={handleSignUP}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-black font-semibold p-4 rounded-xl shadow-lg disabled:opacity-70 transition-all active:scale-95"
        >
          {loading ? <ClipLoader size={28} color="#000" /> : "Sign Up"}
        </button>

        <button
          onClick={handleLogin}
          className="w-full text-center text-purple-200 hover:text-white text-sm font-medium transition-colors"
        >
          Already have an account?{" "}
          <span className="text-pink-400 hover:text-pink-300 font-semibold">
            Login
          </span>
        </button>

        <div className="flex flex-wrap justify-center items-center gap-2 text-purple-300 text-[10px] sm:text-xs">
          <a href="/partner" className="hover:text-pink-400 transition-colors">
            Partner Program
          </a>
          <span>•</span>
          <a href="/contact" className="hover:text-pink-400 transition-colors">
            Contact Us
          </a>
          <span>•</span>
          <a href="/terms" className="hover:text-pink-400 transition-colors">
            Terms & Conditions
          </a>
          <span>•</span>
          <a href="/privacy" className="hover:text-pink-400 transition-colors">
            Privacy Policy
          </a>
          <span>•</span>
          <a
            href="/refundpolicy"
            className="hover:text-pink-400 transition-colors"
          >
            Refunds
          </a>
        </div>

        <div className="text-center text-purple-300 text-[10px] sm:text-xs -mt-2">
          By clicking Start Chat, you agree to our policies.
        </div>
      </div>
    </div>
  );
}

export default DefaultPage;
