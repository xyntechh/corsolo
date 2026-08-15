import React, { useState, useEffect } from "react";
import { Crown, X, Diamond } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PremiumPopup({setShowPremium}) {

  const handleUpgrade = () => {
    setShowPremium(true)
    
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block px-3 ">
        <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 border border-gray-700 rounded-md px-4 pt-8 pb-4">
        
          {/* Crown */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
            <Crown className="w-6 h-6 text-white fill-white" />
          </div>

          <p className="text-center text-gray-300 text-xs leading-relaxed mb-4">
            Unlock chat filters, send and receive images and videos, and enjoy
            premium features.
          </p>

          <button
            type="button"
            onClick={handleUpgrade}
            className="w-full h-10 rounded-md bg-gradient-to-r from-pink-600 to-orange-500 hover:opacity-95 text-white text-sm font-semibold transition-colors"
          >
            Get Premium
          </button>
        </div>
      </div>

      {/* Mobile */}
      <button
        type="button"
        onClick={handleUpgrade}
        className="lg:hidden w-full h-11 rounded-md bg-gradient-to-r from-pink-600 to-orange-500 hover:opacity-95 transition-all flex items-center justify-center gap-2 text-white font-semibold text-sm"
      >
        <Diamond className="w-4 h-4" strokeWidth={2.2} />
        Get Premium
      </button>
    </>
  );
}

export default PremiumPopup;
