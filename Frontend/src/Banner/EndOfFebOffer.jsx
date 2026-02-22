import { useNavigate } from "react-router-dom";
import { Flame, ArrowRight, Crown, Sparkles, Infinity } from "lucide-react";

export default function EndOfFebOffer() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/subscription")}
      className="relative cursor-pointer overflow-hidden rounded-2xl px-4 py-3 max-w-sm mx-auto select-none"
      style={{
        background: "linear-gradient(135deg, #c850c0 0%, #9b59b6 30%, #8e44ad 60%, #e91e8c 100%)",
        boxShadow: "0 6px 24px rgba(200,80,192,0.45), 0 2px 8px rgba(0,0,0,0.3)",
        maxHeight: "10vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Glow Orb */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)" }}
      />

      {/* Left: Badge + Title */}
      <div className="flex flex-col justify-center flex-1 min-w-0 mr-3">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span
            className="flex items-center gap-1 text-white text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full flex-shrink-0"
            style={{
              background: "rgba(255,255,255,0.25)",
              border: "1px solid rgba(255,255,255,0.35)",
              animation: "badgePulse 2s ease-in-out infinite",
            }}
          >
            <Flame size={8} fill="white" />
            Feb Sale
          </span>
          <span className="text-pink-200 text-[9px] font-semibold truncate opacity-90">
            Ends 28 Feb!
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Crown size={12} fill="#ffd700" style={{ color: "#ffd700", flexShrink: 0 }} />
          <span className="text-white text-sm font-black leading-tight truncate">
            Unlimited Coins
          </span>
          <Infinity size={12} style={{ color: "#ffd700", flexShrink: 0 }} />
        </div>

        <div className="flex items-center gap-1 mt-0.5">
          <Sparkles size={9} style={{ color: "#ffd700" }} />
          <span className="text-purple-100 text-[10px] opacity-80 truncate">
            Lifetime access — pay once!
          </span>
        </div>
      </div>

      {/* Right: Price + CTA */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <div className="flex items-baseline gap-1">
          <span
            className="text-xl font-black leading-none text-white"
            style={{ textShadow: "0 0 12px rgba(255,255,255,0.5)" }}
          >
            ₹999
          </span>
          <span className="text-[10px] text-purple-200 line-through">₹2499</span>
        </div>
        <button
          className="flex items-center gap-1 text-white text-[11px] font-black px-3 py-1.5 rounded-full active:scale-95 transition-transform"
          style={{
            background: "linear-gradient(90deg, #ff3cac, #ff6a00)",
            boxShadow: "0 3px 12px rgba(255,60,172,0.55)",
            animation: "ctaGlow 2s ease-in-out infinite",
          }}
        >
          Get Now
          <ArrowRight size={11} strokeWidth={3} />
        </button>
      </div>

      <style>{`
        @keyframes badgePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.75; }
        }
        @keyframes ctaGlow {
          0%, 100% { box-shadow: 0 3px 12px rgba(255,60,172,0.55); }
          50% { box-shadow: 0 3px 20px rgba(255,60,172,0.9); }
        }
      `}</style>
    </div>
  );
}