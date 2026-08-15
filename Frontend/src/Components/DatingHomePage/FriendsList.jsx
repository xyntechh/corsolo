import React from "react";
import { useUser } from "../../Context/UserContext.jsx";

function Avatar({ name, profilePicture }) {
  const firstLetter = name?.trim()?.charAt(0)?.toUpperCase() || "?";

  if (profilePicture) {
    return (
      <img
        src={profilePicture}
        alt={name}
        className="w-9 h-9 rounded-md object-cover shrink-0"
      />
    );
  }

  return (
    <div className="w-9 h-9 rounded-md bg-purple-500 text-white flex items-center justify-center font-semibold text-sm shrink-0">
      {firstLetter}
    </div>
  );
}

function FriendRow({ friend }) {
  const { name, profilePicture, online } = friend;

  return (
    <button
      type="button"
      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#2c2c38] transition-colors"
    >
      <div className="relative shrink-0">
        <Avatar name={name} profilePicture={profilePicture} />
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#1e1e26] ${
            online ? "bg-green-500" : "bg-gray-500"
          }`}
        />
      </div>

      <div className="flex-1 min-w-0 text-left">
        <p className="text-[13px] font-medium text-white truncate">{name}</p>
        <p className="text-[11px] text-gray-400">
          {online ? "Online" : "Offline"}
        </p>
      </div>
    </button>
  );
}

export default function FriendsList() {
  const { friendList } = useUser();

  

  console.log(friendList);
  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-2 py-1 space-y-0.5">
      {friendList.map((friend) => (
        <FriendRow key={friend._id} friend={friend} />
      ))}
    </div>
  );
}
