import { Sparkles, ArrowRight, Crown, Infinity, Droplets } from "lucide-react";

export default function HoliSpecialOffer({ onClick }) {
  return (
    <div
      className="relative cursor-pointer overflow-hidden rounded-2xl px-4 py-3 max-w-sm mx-auto select-none"
      style={{
        background:
          "linear-gradient(135deg, #ff6b35 0%, #f7c59f 25%, #e83283 50%, #7b2ff7 75%, #00c9a7 100%)",
        boxShadow:
          "0 6px 28px rgba(232,50,131,0.5), 0 2px 8px rgba(0,0,0,0.3)",
        maxHeight: "10vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Color splash orbs */}
      <div
        className="absolute -top-4 -left-4 w-20 h-20 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,220,50,0.35) 0%, transparent 70%)",
          animation: "floatOrb 3s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,201,167,0.3) 0%, transparent 70%)",
          animation: "floatOrb 3s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute top-1 right-16 w-10 h-10 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(123,47,247,0.4) 0%, transparent 70%)",
        }}
      />

      {/* Left: Badge + Title */}
      <div className="flex flex-col justify-center flex-1 min-w-0 mr-3" style={{ position: "relative", zIndex: 1 }}>
        <div className="flex items-center gap-1.5 mb-0.5">
          <span
            className="flex items-center gap-1 text-white text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full flex-shrink-0"
            style={{
              background: "rgba(255,255,255,0.28)",
              border: "1px solid rgba(255,255,255,0.4)",
              animation: "badgePulse 2s ease-in-out infinite",
            }}
          >
            <Droplets size={8} fill="white" />
            Holi Sale
          </span>
          <span className="text-yellow-100 text-[9px] font-semibold truncate opacity-95">
            🎨 Limited time!
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
          <span className="text-orange-100 text-[10px] opacity-85 truncate">
            Lifetime access — pay once!
          </span>
        </div>
      </div>

      {/* Right: Price + CTA */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0" style={{ position: "relative", zIndex: 1 }}>
        <div className="flex items-baseline gap-1">
          <span
            className="text-xl font-black leading-none text-white"
            style={{ textShadow: "0 0 14px rgba(255,255,255,0.6)" }}
          >
            ₹999
          </span>
          <span className="text-[10px] text-pink-100 line-through opacity-80">
            ₹2499
          </span>
        </div>
        <button
          onClick={onClick}
          className="flex items-center gap-1 text-white text-[11px] font-black px-3 py-1.5 rounded-full active:scale-95 transition-transform"
          style={{
            background: "linear-gradient(90deg, #ff6b35, #e83283, #7b2ff7)",
            boxShadow: "0 3px 14px rgba(232,50,131,0.6)",
            animation: "ctaGlow 2s ease-in-out infinite",
          }}
        >
          Get Now
          <ArrowRight size={11} strokeWidth={3} />
        </button>
      </div>

      <style>{`
        @keyframes badgePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.03); }
        }
        @keyframes ctaGlow {
          0%, 100% { box-shadow: 0 3px 14px rgba(232,50,131,0.6); }
          50% { box-shadow: 0 3px 22px rgba(123,47,247,0.85); }
        }
        @keyframes floatOrb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(4px, -4px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}