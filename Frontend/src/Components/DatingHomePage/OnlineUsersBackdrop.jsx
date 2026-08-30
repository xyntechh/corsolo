import { MessageCircle, Coins } from "lucide-react";
import { useUser } from "../../Context/UserContext";

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

function UserRow({ rowUser, index , setShowPremium }) {
  const gradient = avatarGradients[index % avatarGradients.length];
  const { user } = useUser();

  const handleChatbutton = () =>{

    if(user?.coin < 10) {

      setShowPremium(true)

    }
   
  }

  return (
    <div className="group flex items-center justify-between gap-2.5 bg-white/[0.03] hover:bg-white/[0.05] border border-white/5 rounded-xl px-3 py-2.5 transition-colors duration-200">
      {/* Avatar + name + status */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={`w-9 h-9 shrink-0 rounded-full bg-gradient-to-br ${gradient} bg-[#20202a] flex items-center justify-center text-white/90 font-semibold text-xs ring-1 ring-white/10`}
        >
          {rowUser.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-gray-200 font-medium text-[13px] truncate">
            {rowUser.name}
          </p>
          <StatusBadge status={rowUser.status} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          className="flex items-center gap-1 bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-gray-400 text-[10.5px] font-medium px-2 py-1.5 rounded-lg transition-colors"
        >
          <Coins size={11} className="text-yellow-500/70" />
          10
        </button>
        <button
        onClick={handleChatbutton}
          type="button"
          className="flex items-center gap-1 bg-purple-600/25 hover:bg-purple-600/60 border border-purple-500/20 hover:border-purple-400/40 text-purple-200 hover:text-white text-[10.5px] font-medium px-2.5 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md hover:shadow-purple-500/20 active:scale-95"
        >
          <MessageCircle size={11} />
          Chat
        </button>
      </div>
    </div>
  );
}

export default function OnlineUsersBackdrop( {setShowPremium}) {
  return (
    <div className="absolute inset-0 z-0 overflow-y-auto px-4 sm:px-7 pt-4 pb-2 hide-scrollbar">
      {/* Poori list ko thoda dim rakha hai — background hai, hero element nahi */}
      <div className="w-100 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 gap-y-2 opacity-80">
        {users.map((rowUser, index) => (
          <UserRow key={rowUser.name} rowUser={rowUser} index={index} setShowPremium={setShowPremium} />
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
