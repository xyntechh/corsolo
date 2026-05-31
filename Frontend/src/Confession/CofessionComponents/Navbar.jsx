import React from "react";
import { Search, MessageCircle, Bell, SquarePen } from "lucide-react";

import { useNavigate } from "react-router-dom";
function Navbar() {
  const navigate = useNavigate();

  const handleConfessClick = () => {
    navigate("/confession/create");
  };

  const handleNotificationClick = () => {
    navigate("/confession/notifications");
  }

  return (
    <nav className="w-full sticky top-0 z-50 border-b border-white/10 bg-[#050816]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto h-16 px-4 md:px-6 flex items-center justify-between">
        {/* LEFT LOGO */}
        <div className="flex items-center gap-3 cursor-pointer">
          {/* Logo */}
          <div className="w-10 h-10 rounded-xl bg-[#6C63FF] flex items-center justify-center shadow-lg">
            <span className="text-lg">🤫</span>
          </div>

          {/* Brand */}
          <h1 className="text-white text-2xl font-bold tracking-tight">
            Confess
          </h1>
        </div>

        {/* CENTER SEARCH */}
        <div className="hidden md:flex flex-1 justify-center px-8">
          <div className="w-full max-w-2xl relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              placeholder="Search confessions..."
              className="
                w-full
                h-11
                bg-[#0B1023]
                border
                border-white/10
                rounded-full
                pl-11
                pr-4
                text-sm
                text-white
                placeholder:text-gray-500
                outline-none
                focus:border-[#6C63FF]
                focus:ring-2
                focus:ring-[#6C63FF]/20
                transition-all
              "
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3">
          {/* Message Button */}
          <button
            className="
              w-11
              h-11
              rounded-full
              border
              border-white/10
              bg-[#0B1023]
              flex
              items-center
              justify-center
              hover:border-[#6C63FF]
              hover:bg-[#11162A]
              transition-all
            "
          >
            <MessageCircle size={18} className="text-white" />
          </button>

          {/* Notification Button */}
          <button
            onClick={handleNotificationClick}
            className="
              w-11
              h-11
              rounded-full
              border
              border-white/10
              bg-[#0B1023]
              flex
              items-center
              justify-center
              hover:border-[#6C63FF]
              hover:bg-[#11162A]
              transition-all
            "
          >
            <Bell size={18} className="text-white" />
          </button>

          {/* Confess Button */}
          <button
          onClick={handleConfessClick}
            className="
              h-11
              px-5
              rounded-full
              bg-[#6C63FF]
              hover:bg-[#7C74FF]
              text-white
              text-sm
              font-semibold
              flex
              items-center
              gap-2
              transition-all
              shadow-lg
              shadow-[#6C63FF]/20
            "
          >
            <SquarePen size={18} />
            <span className="hidden sm:block">Confess</span>
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="text"
            placeholder="Search..."
            className="
              w-full
              h-11
              bg-[#0B1023]
              border
              border-white/10
              rounded-full
              pl-11
              pr-4
              text-sm
              text-white
              placeholder:text-gray-500
              outline-none
            "
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
