import React, { useState } from "react";
import { Heart, Sparkles, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ValentineAdPopup({ setShowPopup }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/valantine");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-gradient-to-br from-pink-500 via-red-500 to-purple-600 rounded-3xl shadow-2xl animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/20 hover:bg-white/30 rounded-full p-1.5 sm:p-2 transition-all duration-300 group z-10"
          aria-label="Close popup"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Decorative Hearts */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
          <Heart className="absolute top-10 left-4 w-6 h-6 sm:w-8 sm:h-8 text-white/30 animate-pulse" />
          <Heart className="absolute bottom-10 right-6 w-5 h-5 sm:w-6 sm:h-6 text-white/20 animate-bounce" />
          <Heart className="absolute top-1/2 left-2 w-4 h-4 sm:w-5 sm:h-5 text-white/25" />
        </div>

        {/* Content */}
        <div className="relative px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
          {/* Top Icons */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="flex gap-2 sm:gap-3">
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white animate-pulse" fill="white" />
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-yellow-300 animate-spin-slow" />
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white animate-pulse" fill="white" />
            </div>
          </div>

          {/* Main Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-3 sm:mb-4 leading-tight">
            Impress Your Crush
            <br />
            <span className="text-yellow-300">This Valentine's Day! 💝</span>
          </h2>

          {/* Description Box */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 border border-white/20">
            <ul className="space-y-2.5 sm:space-y-3 text-white">
              <li className="flex items-start gap-2 sm:gap-3">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 text-yellow-300" fill="currentColor" />
                <span className="text-sm sm:text-base leading-relaxed">
                  Create a personalized website for your crush
                </span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 text-yellow-300" fill="currentColor" />
                <span className="text-sm sm:text-base leading-relaxed">
                  Beautiful animations and surprise effects
                </span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 text-yellow-300" fill="currentColor" />
                <span className="text-sm sm:text-base leading-relaxed">
                  Impress your crush in a unique and memorable way
                </span>
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleNavigate}
            className="w-full bg-white hover:bg-yellow-50 text-pink-600 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" />
            Impress Now
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Footer Text */}
          <p className="text-center text-yellow-200 text-xs sm:text-sm mt-4 sm:mt-6 font-medium">
            ✨ Limited Time Valentine's Special Offer ✨
          </p>
        </div>

        {/* Floating Sparkles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
          <Sparkles className="absolute top-1/4 right-8 w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 animate-ping" />
          <Sparkles className="absolute bottom-1/4 left-8 w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 animate-pulse" />
        </div>
      </div>
    </div>
  );
}