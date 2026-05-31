import React from "react";
import { User } from "lucide-react";

function FloatingProfileButton() {
  return (
    <button
      className="
        fixed
        bottom-6
        right-6
        z-50

        flex
        items-center
        gap-3

        h-14
        px-5

        rounded-full

        bg-[#6C63FF]
        hover:bg-[#7B74FF]

        border
        border-white/10

        shadow-2xl
        shadow-[#6C63FF]/30

        transition-all
        duration-300

        hover:scale-105
        active:scale-95
      "
    >
      {/* ICON */}
      <div
        className="
          w-9
          h-9
          rounded-full

          bg-white/10

          flex
          items-center
          justify-center
        "
      >
        <User size={18} className="text-white" />
      </div>

      {/* TEXT */}
      <span
        className="
          text-white
          text-sm
          md:text-base
          font-semibold
          tracking-wide
        "
      >
        My Profile
      </span>
    </button>
  );
}

export default FloatingProfileButton;