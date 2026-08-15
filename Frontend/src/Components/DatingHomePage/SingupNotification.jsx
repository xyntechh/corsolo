import React from "react";
import { useNavigate } from "react-router-dom";

function SingupNotification() {
  const navigate = useNavigate();

  const navigateToSingup = () => {
    navigate("/signUp/basicdetails");
  };

  return (
    <div className="w-full bg-[#3A3A41] border-b border-white/10 px-3 py-2 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-yellow-400 text-base shrink-0">⚠️</span>

        <p className="text-[11px] sm:text-sm text-gray-200 leading-tight">
          You're using a{" "}
          <span className="font-semibold text-white">Guest Account</span>. Your
          progress won't be saved.
        </p>
      </div>

      <button
        onClick={navigateToSingup}
        className="
      relative overflow-hidden
      shrink-0
      rounded-md
      px-3 py-1.5
      text-xs sm:text-sm
      font-semibold text-white

      bg-gradient-to-r from-purple-600 to-indigo-600
      hover:from-orange-500 hover:to-purple-600

      transition-all duration-500

      before:absolute
      before:top-0
      before:-left-full
      before:h-full
      before:w-1/3
      before:bg-gradient-to-r
      before:from-transparent
      before:via-white/40
      before:to-transparent
      before:skew-x-[-25deg]
      before:transition-all
      before:duration-700

      hover:before:left-[140%]
    "
      >
        Sign Up
      </button>
    </div>
  );
}

export default SingupNotification;
