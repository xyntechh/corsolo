import {
  Users,
  MessageCircle,
  Volume2,
  Settings,
  MoreHorizontal,
} from "lucide-react";
import PremiumPopup from "../../Banner/PremiumPopup.jsx";
import SettingsCard from "./SettingsCard.jsx";
import { useState } from "react";
import { useUser } from "../../Context/UserContext.jsx";
import FriendList from "./FriendsList.jsx";

export default function Sidebar({
  showSettingsModal,
  setshowSettingsModal,
  setShowPremium,
  onSelectChat
}) {
  const [showSettings, setShowSettings] = useState(false);

  const { user } = useUser();

  return (
    <div className="w-72 h-full bg-[#1e1e26] gap-1 text-white flex flex-col border-r border-white/10">
      {/* Tabs */}
      <div className="flex gap-2 px-3 pt-4 pb-2">
        <button className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-[#2c2c38] text-white">
          <Users size={16} /> Friends
        </button>
      </div>

      <hr className="border-[#2c2c38] mx-4 mb-1" />

      <div className="flex-1 min-h-0 bg-[#25262D] overflow-y-auto">
        <FriendList onSelectChat={onSelectChat} />
      </div>

      {/* Premium / settings popups sit just above the footer */}
      <div className="w-full relative shrink-0">
        <PremiumPopup setShowPremium={setShowPremium} />
        <SettingsCard isOpen={showSettings} />
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 px-3.5 py-3 border-t border-[#2c2c38] shrink-0">
        <div className="relative w-9 h-9 rounded-full bg-[#f4a3a3] flex items-center justify-center text-lg shrink-0">
          🐱
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#1e1e26] rounded-full" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold truncate">{user?.name}</div>
          <div className="text-[11px] text-gray-400">
            {user?.isPremium ? "Premium" : "free"}
          </div>
        </div>
        <div className="flex items-center gap-2.5 text-gray-400 shrink-0">
          <Volume2
            size={16}
            className="hover:text-white transition-colors cursor-pointer"
          />
          <button
           // onClick={() => setshowSettingsModal(true)}
            className="hover:text-white transition-colors"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={() => setShowSettings((prev) => !prev)}
            className="hover:text-white transition-colors"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
