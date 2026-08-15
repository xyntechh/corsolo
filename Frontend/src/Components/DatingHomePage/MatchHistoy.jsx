import { Users, MoreHorizontal, Circle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { socket } from "../../socket.js";
import { ClipLoader } from "react-spinners";


function Avatar({ name, online, profilePicture }) {
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  return (
    <div className="relative shrink-0">
      {profilePicture ? (
        <img
          src={profilePicture}
          alt={name}
          className="w-9 h-9 rounded-md object-cover border border-white/10"
        />
      ) : (
        <div className="w-9 h-9 rounded-md bg-purple-500 border border-white/10 flex items-center justify-center text-xs font-semibold text-white/90">
          {initial}
        </div>
      )}
      {online && (
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#1e1e26] rounded-full" />
      )}
    </div>
  );
}

export default function MatchHistory({ onSelectChat, selectedChatId }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState("");

  // socket logic
  useEffect(() => {
    socket.on("onlineUsers", (count) => {
      setOnlineUsers(count);
    });
    return () => {
      socket.off("onlineUsers");
    };
  }, []);

  const fetchChats = useCallback(async (pageNo) => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("authToken");

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/chat/my-chats`, {
        params: { page: pageNo },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data;

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch chats");
      }

      setChats(data.chats || []);
      setTotalPages(data.totalPages || 1);
      setHasNextPage(data.hasNextPage || false);
      setHasPreviousPage(data.hasPreviousPage || false);
    } catch (err) {
      console.log(err);
      setError("Something went wrong while loading chats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChats(page);
  }, [page, fetchChats]);

  const handlePrev = () => {
    if (hasPreviousPage) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (hasNextPage) setPage((p) => p + 1);
  };

  // count of currently active/online chats from API response
  const activeCount = chats.filter((chat) => chat.online).length;

  return (
    <div className="w-72 h-full bg-[#1e1e26] text-white flex flex-col border-l border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-white/70" />
          <span className="font-medium text-sm">Match History</span>
        </div>
        <button className="text-white/50 hover:text-white transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Chat list - scrollable */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full text-white/40 text-sm">
            <ClipLoader color="#fff" size={20} />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-400 text-sm px-4 text-center">
            {error}
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/40 text-sm px-6 text-center">
            <Users size={28} className="mb-2 opacity-50" />
            No matches found yet
          </div>
        ) : (
          chats.map((chat) => (
            <button
              key={chat.chatId}
              onClick={() =>
                onSelectChat({
                  friendId: chat.friendId,
                  name: chat.name,
                  chatId: chat.chatId,
                })
              }
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
            >
              <Avatar
                name={chat.name}
                online={chat.online}
                profilePicture={chat.profilePicture}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium truncate">
                    {chat.name || "Unknown"}
                  </span>
                  <span className="text-[11px] text-white/40 shrink-0">
                    {chat.lastMessageAt}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <span className="text-xs truncate text-white/40">
                    {chat.lastMessage || "No messages yet"}
                  </span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Fixed pagination */}
      <div className="shrink-0 px-4 py-2 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
        <button
          onClick={handlePrev}
          disabled={!hasPreviousPage}
          className="px-2 py-1 rounded disabled:opacity-30 hover:bg-white/10"
        >
          Prev
        </button>
        <span>
          {page} / {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={!hasNextPage}
          className="px-2 py-1 rounded disabled:opacity-30 hover:bg-white/10"
        >
          Next
        </button>
      </div>

      {/* Footer stats */}
      <div className="shrink-0 px-4 py-3 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
        <span className="flex items-center gap-1.5">
          <Circle size={8} className="fill-green-500 text-green-500" />
          {activeCount} online
        </span>
        <span>
          {chats.length} chats (page {page})
        </span>
      </div>
    </div>
  );
}
