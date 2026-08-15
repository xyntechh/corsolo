import { Bell, Heart, MessageCircle, Star, MoreHorizontal } from "lucide-react";

// Dummy notification data — replace with real API data later
const notifications = [
  {
    id: 1,
    type: "match",
    text: "test",
    time: "2m",
    unread: true,
  },
  {
    id: 2,
    type: "message",
    text: "test",
    time: "20m",
    unread: true,
  },
];

const iconMap = {
  match: Heart,
  message: MessageCircle,
  super: Star,
};

function NotificationIcon({ type }) {
  const Icon = iconMap[type] || Bell;
  return (
    <div className="w-9 h-9 rounded-md bg-purple-500 border border-white/10 flex items-center justify-center shrink-0">
      <Icon size={16} className="text-white/90" />
    </div>
  );
}

export default function Notifications() {
  return (
    <div className="w-72 bg-[#1e1e26] text-white flex flex-col border border-white/10 rounded-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-white/70" />
          <span className="font-medium text-sm">Notifications</span>
        </div>
        <button className="text-white/50 hover:text-white transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Notification list */}
      <div className="flex-1 max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-white/40 text-sm px-6 text-center">
            <Bell size={24} className="mb-2 opacity-50" />
            Koi notification nahi hai
          </div>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-b-0"
            >
              <NotificationIcon type={n.type} />

              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs leading-snug truncate ${
                    n.unread ? "text-white/90" : "text-white/40"
                  }`}
                >
                  {n.text}
                </p>
                <span className="text-[10px] text-white/40">{n.time}</span>
              </div>

              {n.unread && (
                <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}