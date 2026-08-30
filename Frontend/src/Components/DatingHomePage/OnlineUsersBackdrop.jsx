import { useState } from "react";
import { MessageCircle, Coins, Loader2 } from "lucide-react";
import axios from "axios";

import { useUser } from "../../Context/UserContext";
import { socket } from "../../socket";
import toast from "react-hot-toast";

const users = [
  { name: "Aarohi", status: "live" },
  { name: "Zara", status: "online" },
  { name: "Myra", status: "live" },
  { name: "Anaya", status: "online" },
  { name: "Kiara", status: "online" },
  { name: "Ivy", status: "live" },
  { name: "Reyna", status: "online" },
  { name: "Aria", status: "live" },
  { name: "Navya", status: "online" },
  { name: "Zoya", status: "online" },
  { name: "Anvi", status: "live" },
  { name: "Kimaya", status: "online" },
];

const avatarGradients = [
  "from-rose-500/40 to-pink-600/40",
  "from-violet-500/40 to-purple-600/40",
  "from-amber-500/40 to-orange-600/40",
  "from-sky-500/40 to-blue-600/40",
  "from-emerald-500/40 to-teal-600/40",
  "from-fuchsia-500/40 to-pink-600/40",
];

const REQUIRED_COINS = 10;

function StatusBadge({ status }) {
  const isLive = status === "live";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-1.5 py-[1px] text-[10px] font-semibold tracking-wide ${
        isLive
          ? "bg-red-500/10 text-red-400"
          : "bg-emerald-500/10 text-emerald-400"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isLive ? "bg-red-400 animate-pulse" : "bg-emerald-400"
        }`}
      />
      {isLive ? "Live" : "Online"}
    </span>
  );
}

function UserRow({ rowUser, index, setShowPremium }) {
  const gradient = avatarGradients[index % avatarGradients.length];
  const isLive = rowUser.status === "live";
  const [loading, setLoading] = useState(false);

  const { user, fetchUser } = useUser();

  const handleChatbutton = async () => {
    if (loading) return;

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      if (!user?._id) {
        toast.error("User information not available");
        return;
      }

      const chatMode = "female";
      const currentCoins = user?.coin ?? 0;

      if (currentCoins < REQUIRED_COINS) {
        setShowPremium(true);
        return;
      }

      setLoading(true);

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/user/debit`,
          {
            coin: REQUIRED_COINS,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("Coin deducted successfully:", response.data);
        await fetchUser();
      } catch (error) {
        console.error(
          "Coin deduction failed:",
          error.response?.data || error.message,
        );
        toast.error(
          error.response?.data?.message || "Unable to deduct coins",
        );
        return;
      }

      const payload = {
        userId: user._id,
        gender: user.gender,
        mode: chatMode,
        lookingFor: user.lookingFor,
        partnerName: rowUser.name,
      };

      console.log("Starting chat:", payload);

      if (!socket) {
        toast.error("Connection not available");
        return;
      }

      socket.emit("startChat", payload);
    } catch (error) {
      console.error("Chat button error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while starting chat",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        group relative flex items-center justify-between gap-2.5
        bg-white/[0.025] hover:bg-white/[0.045]
        border border-white/[0.06] hover:border-white/[0.1]
        rounded-2xl px-3.5 py-3
        shadow-[0_1px_2px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.5)]
        transition-all duration-300 ease-out
        hover:-translate-y-0.5
      "
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="relative shrink-0">
          <div
            className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} bg-[#20202a] flex items-center justify-center text-white/90 font-semibold text-xs ring-1 ${
              isLive ? "ring-red-400/30" : "ring-white/10"
            }`}
          >
            {rowUser.name.charAt(0)}
          </div>
          {isLive && (
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-[#20202a] animate-pulse" />
          )}
        </div>

        <div className="min-w-0">
          <p className="text-gray-200 font-medium text-[13px] leading-tight truncate">
            {rowUser.name}
          </p>
          <div className="mt-0.5">
            <StatusBadge status={rowUser.status} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          className="flex items-center gap-1 bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.06] text-gray-400 text-[10.5px] font-medium px-2 py-1.5 rounded-lg transition-colors duration-200"
        >
          <Coins size={11} className="text-yellow-500/70" />
          10
        </button>

        <button
          onClick={handleChatbutton}
          disabled={loading}
          type="button"
          className="
            flex items-center justify-center gap-1 min-w-[58px]
            bg-purple-600/25 hover:bg-purple-600/70
            border border-purple-500/20 hover:border-purple-400/40
            text-purple-200 hover:text-white
            text-[10.5px] font-semibold
            px-2.5 py-1.5 rounded-lg
            transition-all duration-200
            hover:scale-105 active:scale-95
            hover:shadow-md hover:shadow-purple-500/25
            disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
          "
        >
          {loading ? (
            <Loader2 size={11} className="animate-spin" />
          ) : (
            <>
              <MessageCircle size={11} />
              Chat
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function OnlineUsersBackdrop({ setShowPremium, isCardOpen = true }) {
  return (
    <div className="absolute inset-0 z-0 overflow-y-auto px-4 sm:px-7 pt-4 pb-2 hide-scrollbar">
      <div
        className={`
          w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5
          transition-opacity duration-500 ease-in-out
          ${isCardOpen ? "opacity-80" : "opacity-100"}
        `}
      >
        {users.map((rowUser, index) => (
          <UserRow
            key={rowUser.name}
            rowUser={rowUser}
            index={index}
            setShowPremium={setShowPremium}
          />
        ))}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}