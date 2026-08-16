import React, { useState, useEffect } from "react";
import { Menu, Users, Bell, MessageCircle, X, Gem } from "lucide-react";
import SingupNotification from "./SingupNotification";
import { useUser } from "../../Context/UserContext.jsx";
import { socket } from "../../socket.js";

function Navbar({
  title = "New Chat",
  onMenuClick,
  onlineCount = 0,
  showCard,
  setShowCard,
  setShowMatchHistoryCard,
  showMatchHistoryCard,
  showNotificationsCard,
  setShowNotificationsCard,
  showFriendRequestsCard,
  setShowFriendRequestsCard,
  setShowPremium
}) {
  const [showBadgeDot, setShowBadgeDot] = useState(true);
  const [showSignupNotification, setShowSignupNotification] = useState(false);

  const { user, friendRequests, setfriendRequests, getFriendRequest } =
    useUser();

  useEffect(() => {
    if (user?.isGuest) {
      setShowSignupNotification(true);
    } else {
      setShowSignupNotification(false);
    }
  }, [user]);

  //socket Logic

  useEffect(() => {
    const handleNewRequest = (request) => {
      setfriendRequests((prev) => {
        const alreadyExists = prev.some((item) => item._id === request._id);

        if (alreadyExists) return prev;

        return [request, ...prev];
      });
    };

    socket.on("newFriendRequest", handleNewRequest);

    return () => {
      socket.off("newFriendRequest", handleNewRequest);
    };
  }, []);

  return (
    <nav className="  bg-[#15151F] border-white/10 text-white select-none">
      <div className="flex items-center justify-between h-14 px-3 sm:px-5">
        {/* LEFT — menu + title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setShowCard(!showCard)}
            aria-label="Open menu"
            className="p-1.5 -ml-1.5 block lg:hidden rounded-lg hover:bg-white/10 active:bg-white/15 transition-colors shrink-0"
          >
            {showCard ? (
              <X size={19} strokeWidth={2.2} />
            ) : (
              <Menu size={19} strokeWidth={2.2} />
            )}
          </button>

          <h1 className="font-semibold text-sm sm:text-base text-white truncate">
            {title}
          </h1>
        </div>

        {/* RIGHT — action icons */}
        <div className="flex items-center gap-1  sm:gap-4 shrink-0">
          <button
          onClick={() => setShowPremium(true)}
            type="button"
            aria-label="Gems: 5"
            className="group flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-white/90 transition-all duration-300 hover:bg-white/10 active:scale-95"
          >
            <Gem
              size={19}
              strokeWidth={2.2}
              className="text-orange-400 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:text-orange-300 group-hover:drop-shadow-[0_0_8px_rgba(251,146,60,0.9)]"
            />

            <span className=" transition-colors duration-300 group-hover:text-orange-200">
             {user?.coins ?? 0}
            </span>
          </button>

          <button
            type="button"
            aria-label="Friend Requests"
            className="relative p-1.5 rounded-lg hover:bg-white/10 active:bg-white/15 transition-colors"
            onClick={() => {
              setShowFriendRequestsCard(!showFriendRequestsCard);

              // Optional: badge remove karna ho
              // setUnreadCount(0);
            }}
          >
            <Users size={19} strokeWidth={2.2} />

            {friendRequests?.length > 0 && (
              <span
                className="
        absolute -top-1 -right-1
        min-w-[18px] h-[18px]
        px-1
        rounded-full
        bg-red-500
        text-white
        text-[10px]
        font-bold
        flex items-center justify-center
      "
              >
                {friendRequests?.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowNotificationsCard(!showNotificationsCard)}
            aria-label="Notifications"
            className="p-1.5 rounded-lg hover:bg-white/10 active:bg-white/15 transition-colors"
          >
            <Bell size={19} strokeWidth={2.2} />
          </button>

          <button
            type="button"
            onClick={() => {
              setShowMatchHistoryCard(!showMatchHistoryCard);
            }}
            aria-label="Match History"
            className="relative p-1.5 rounded-lg hover:bg-white/10 active:bg-white/15 transition-colors"
          >
            <MessageCircle size={19} strokeWidth={2.2} />
            {showBadgeDot && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500 border border-[#241414]" />
            )}
          </button>
        </div>
      </div>

      {/* Signup Notification */}

      {showSignupNotification && <SingupNotification />}
    </nav>
  );
}

export default Navbar;
