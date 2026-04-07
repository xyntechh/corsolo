import { ArrowRight, Infinity, Heart } from "lucide-react";
import { useState, useEffect } from "react";

export default function SummerSaleOffer({ onClick }) {
  const [timeLeft, setTimeLeft] = useState("07:00:00:00");

  useEffect(() => {
    const end = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const pad = (n) => String(n).padStart(2, "0");
    const tick = () => {
      const d = end - Date.now();
      if (d <= 0) return;
      setTimeLeft(
        `${pad(Math.floor(d / 86400000))}:${pad(Math.floor((d % 86400000) / 3600000))}:${pad(Math.floor((d % 3600000) / 60000))}:${pad(Math.floor((d % 60000) / 1000))}`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden rounded-xl cursor-pointer select-none max-w-sm mx-auto"
      style={{
        background: "linear-gradient(110deg, #b5005b 0%, #e91e8c 50%, #7b1fa2 100%)",
        height: "10vh",
        minHeight: "64px",
        maxHeight: "80px",
        padding: "0 14px",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Glow */}
      <div className="absolute -top-4 -right-2 w-14 h-14 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,130,200,0.35), transparent 70%)" }} />

      <div className="relative flex items-center gap-2 w-full">

        {/* Left */}
        <div className="flex flex-col flex-1 min-w-0 gap-0.5">
          <div className="flex items-center gap-1">
            <Heart size={10} fill="#ffb3d1" color="#ffb3d1" />
            <span className="text-white font-black text-xs whitespace-nowrap">Unlimited Coins</span>
            <Infinity size={10} color="rgba(255,193,215,0.9)" />
          </div>
          <span className="text-[10px]" style={{ color: "rgba(255,220,235,0.85)" }}>
            Summer Sale · Lifetime access
          </span>
        </div>

        <div className="w-px h-7 bg-white/20 shrink-0" />

        {/* Price */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-baseline gap-1">
            <span className="text-white font-black text-[15px] leading-none">₹999</span>
            <span className="text-[9px] line-through" style={{ color: "rgba(255,200,225,0.8)" }}>₹2499</span>
          </div>
          <span className="text-[9px] font-black bg-white text-pink-800 rounded-full px-1.5 leading-[1.4]">
            60% OFF
          </span>
        </div>

        <div className="w-px h-7 bg-white/20 shrink-0" />

        {/* Timer + CTA */}
        <div className="flex flex-col items-end gap-1">
          <div>
            <div className="text-[8px] leading-none" style={{ color: "rgba(255,255,255,0.65)" }}>ends in</div>
            <div className="text-[10px] font-bold text-white font-mono tracking-wide leading-none mt-0.5">
              {timeLeft}
            </div>
          </div>
          <button
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-pink-800 text-[10px] font-black rounded-full flex items-center gap-0.5 leading-none"
            style={{ padding: "4px 10px" }}
          >
            Grab <ArrowRight size={9} />
          </button>
        </div>

      </div>
    </div>
  );
}