import { MessageCircle, Coins } from "lucide-react";

// Dummy data — real app mein ye backend/socket se aayega
const users = [
  { name: "Priya", status: "live" },
  { name: "Ananya", status: "online" },
  { name: "Sneha", status: "live" },
  { name: "Kavya", status: "online" },
  { name: "Riya", status: "online" },
  { name: "Isha", status: "live" },
  { name: "Meera", status: "online" },
  { name: "Tanvi", status: "live" },
  { name: "Pooja", status: "online" },
  { name: "Neha", status: "online" },
  { name: "Aisha", status: "live" },
  { name: "Divya", status: "online" },
];

// Muted, low-saturation duotones — vibrant nahi, taaki background dominant na lage
const avatarGradients = [
  "from-rose-500/40 to-pink-600/40",
  "from-violet-500/40 to-purple-600/40",
  "from-amber-500/40 to-orange-600/40",
  "from-sky-500/40 to-blue-600/40",
  "from-emerald-500/40 to-teal-600/40",
  "from-fuchsia-500/40 to-pink-600/40",
];

function StatusBadge({ status }) {
  const isLive = status === "live";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10.5px] font-medium tracking-wide ${
        isLive ? "text-red-400/80" : "text-emerald-400/80"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isLive ? "bg-red-400/80 animate-pulse" : "bg-emerald-400/80"
        }`}
      />
      {isLive ? "Live" : "Online"}
    </span>
  );
}

function UserRow({ user, index }) {
  const gradient = avatarGradients[index % avatarGradients.length];

  return (
    <div className="group flex items-center justify-between gap-3 bg-white/[0.03] hover:bg-white/[0.05] border border-white/5 rounded-2xl px-4 py-3 transition-colors duration-200">
      {/* Avatar + name + status */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-10 h-10 shrink-0 rounded-full bg-gradient-to-br ${gradient} bg-[#20202a] flex items-center justify-center text-white/90 font-semibold text-sm ring-1 ring-white/10`}
        >
          {user.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-gray-200 font-medium text-sm truncate">
            {user.name}
          </p>
          <StatusBadge status={user.status} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          className="flex items-center gap-1 bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-gray-400 text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition-colors"
        >
          <Coins size={12} className="text-yellow-500/70" />
          10
        </button>
        <button
          type="button"
          className="flex items-center gap-1 bg-purple-600/25 hover:bg-purple-600/40 border border-purple-500/20 text-purple-200 text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition-colors"
        >
          <MessageCircle size={12} />
          Chat
        </button>
      </div>
    </div>
  );
}

export default function OnlineUsersBackdrop() {
  return (
    <div className="absolute inset-0 z-0 overflow-y-auto px-4 sm:px-7 pt-4 pb-2 hide-scrollbar">
      {/* Poori list ko thoda dim rakha hai — background hai, hero element nahi */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5 opacity-80">
        {users.map((user, index) => (
          <UserRow key={user.name} user={user} index={index} />
        ))}
      </div>

      {/* Bottom fade — jahan Start Chat card baithta hai wahan list background
          colour mein ghul jaati hai, taaki aankh seedha card pe jaye */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#2E2F38] via-[#2E2F38]/80 to-transparent" />

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { scrollbar-width: none; }
      `}</style>
    </div>
  );
}