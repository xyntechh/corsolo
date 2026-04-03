import { Sparkles, ArrowRight, Infinity } from "lucide-react";
import { useState, useEffect } from "react";

export default function SummerSaleOffer({ onClick }) {
  const [timeLeft, setTimeLeft] = useState({
    days: "07", hours: "00", mins: "00", secs: "00",
  });

  useEffect(() => {
    const endTime = Date.now() + 7 * 24 * 60 * 60 * 1000;

    const tick = () => {
      const diff = endTime - Date.now();
      if (diff <= 0) return;
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        mins: String(m).padStart(2, "0"),
        secs: String(s).padStart(2, "0"),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative cursor-pointer overflow-hidden rounded-xl px-3 py-2 max-w-sm mx-auto select-none"
      style={{
        background: "linear-gradient(135deg, #ff2d75 0%, #ff6ec7 40%, #d946ef 70%, #9333ea 100%)",
        boxShadow: "0 6px 30px rgba(255,105,180,0.45)",
      }}
    >
      {/* Pink Glow */}
      <div
        className="absolute -top-10 -right-8 w-28 h-28 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,110,199,0.55), transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative flex flex-col gap-2" style={{ zIndex: 1 }}>

        {/* Top Row */}
        <div className="flex items-center justify-between">
          <span className="text-white text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/20">
            💖 Summer Sale
          </span>
          <span className="text-pink-100 text-[9px] font-semibold">
            Limited Time
          </span>
        </div>

        {/* Mid Row */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1">
              <span className="text-white text-sm font-black">
                Unlimited Coins
              </span>
              <Infinity size={12} color="#ffd1dc" />
            </div>
            <span className="text-pink-100 text-[9px]">
              Lifetime access
            </span>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              <span className="text-lg font-black text-white">₹999</span>
              <span className="text-[10px] line-through text-pink-200">₹2499</span>
            </div>
            <span className="text-[9px] bg-white text-pink-600 px-2 rounded-full font-bold">
              60% OFF
            </span>
          </div>
        </div>

        {/* Timer */}
        <div className="flex justify-between items-center">
          <span className="text-[9px] text-white/80">Ends in:</span>
          <div className="flex gap-1 text-[10px] text-white font-mono">
            {timeLeft.days}:{timeLeft.hours}:{timeLeft.mins}:{timeLeft.secs}
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="w-full h-1 rounded-full bg-black/20">
            <div
              className="h-full rounded-full"
              style={{
                width: "68%",
                background: "linear-gradient(90deg, #ff6ec7, #ff2d75)",
              }}
            />
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onClick}
          className="w-full bg-white text-pink-600 text-xs font-bold py-2 rounded-full flex items-center justify-center gap-1"
        >
          Grab Now <ArrowRight size={12} />
        </button>

      </div>
    </div>
  );
}