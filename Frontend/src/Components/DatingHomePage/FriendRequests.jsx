import { useEffect, useState } from "react";
import { UserPlus, Check, X, MoreHorizontal } from "lucide-react";
import { useUser } from "../../Context/UserContext";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import {
  acceptFriendRequest,
  rejectFriendRequest,
} from "../../Apis/friendApi.js";

function Avatar({ username = "" }) {
  const initial = username ? username.charAt(0).toUpperCase() : "?";
  return (
    <div className="w-9 h-9 rounded-md bg-purple-500 border border-white/10 flex items-center justify-center text-xs font-semibold text-white/90 shrink-0">
      {initial}
    </div>
  );
}

export default function FriendRequests() {
  const [requests, setRequests] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [rejectLoadingId, setRejectLoadingId] = useState(null);

  const { friendRequests, getFriendRequest, setRefreshKey , removeFriendRequest } = useUser();
  const token = localStorage.getItem("authToken");

  //GET FRINED REQUEST FROM APIS
  useEffect(() => {
    if (!friendRequests || friendRequests.length === 0) {
      setRequests([]);
      return;
    }
    const formattedRequests = friendRequests.map((request) => ({
      id: request.sender._id,
      username: request.sender.name,
      requestId: request._id,
    }));

    setRequests(formattedRequests);
  }, [friendRequests]);

  useEffect(() => {
    getFriendRequest();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      setLoadingId(requestId);

      const res = await acceptFriendRequest(requestId, token);

      if (res.success) {
        toast.success("Friend request accepted");

        removeFriendRequest(requestId); 

        getFriendRequest();
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setRejectLoadingId(requestId);

      const res = await rejectFriendRequest(requestId, token);

      if (res.success) {
        toast.success("Friend request rejected");

        setRequests((prev) =>
          prev.filter((item) => item.requestId !== requestId),
        );

        getFriendRequest();
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setRejectLoadingId(null);
    }
  };

  return (
    <div className="w-72 bg-[#1e1e26] text-white flex flex-col border border-white/10 rounded-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <UserPlus size={16} className="text-white/70" />
          <span className="font-medium text-sm">Friend Requests</span>
        </div>
        <button className="text-white/50 hover:text-white transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Request list */}
      <div className="flex-1 max-h-80 overflow-y-auto">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-white/40 text-sm px-6 text-center">
            <UserPlus size={24} className="mb-2 opacity-50" />
            No pending friend requests.
          </div>
        ) : (
          requests.map((r) => (
            <div
              key={r.id}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
            >
              <Avatar username={r.username} />

              <span className="flex-1 min-w-0 text-xs font-medium truncate">
                {r.username}
              </span>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleAccept(r.requestId)}
                  disabled={loadingId === r.requestId}
                  aria-label="Accept"
                  className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors
    ${
      loadingId === r.requestId
        ? "bg-purple-400 cursor-not-allowed"
        : "bg-purple-500 hover:bg-purple-600"
    }
  `}
                >
                  {loadingId === r.requestId ? (
                    <Loader2 size={14} className="animate-spin text-white" />
                  ) : (
                    <Check size={14} className="text-white" />
                  )}
                </button>
                <button
                  onClick={() => handleReject(r.requestId)}
                  disabled={rejectLoadingId === r.requestId}
                  aria-label="Reject"
                  className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors
    ${
      rejectLoadingId === r.requestId
        ? "bg-white/20 cursor-not-allowed"
        : "bg-white/10 hover:bg-white/20"
    }
  `}
                >
                  {rejectLoadingId === r.requestId ? (
                    <Loader2 size={14} className="animate-spin text-white" />
                  ) : (
                    <X size={14} className="text-white/70" />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
