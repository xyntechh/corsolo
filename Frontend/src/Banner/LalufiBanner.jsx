import { useState, useEffect } from "react";

export default function LalufiBanner() {
  const [shimmer, setShimmer] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShimmer(true);
      setTimeout(() => setShimmer(false), 1000);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center p-3">
      <div
        className="relative cursor-pointer overflow-hidden rounded-2xl shadow-2xl w-full max-w-xl hover:scale-[1.02] active:scale-95 transition-all duration-200"
        style={{ border: "3px solid #000" }}
        onClick={() => window.open("https://lalufi.com/shop", "_blank")}
      >
        {/* Hot Pink Gradient BG */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #ff0090 0%, #ff4db8 35%, #cc00ee 100%)",
          }}
        />

        {/* Diagonal Stripes */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 14px, rgba(255,255,255,1) 14px, rgba(255,255,255,1) 28px)",
          }}
        />

        {/* Shimmer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
            transform: shimmer ? "translateX(200%)" : "translateX(-100%)",
            transition: shimmer ? "transform 1s ease" : "none",
          }}
        />

        {/* Floating Emojis */}
        <div className="absolute top-2 left-3 text-lg animate-bounce">💋</div>
        <div className="absolute top-2 right-3 text-lg animate-bounce" style={{ animationDelay: "0.3s" }}>🔥</div>
        <div className="absolute bottom-2 left-5 text-base animate-bounce" style={{ animationDelay: "0.6s" }}>💕</div>
        <div className="absolute bottom-2 right-5 text-base animate-bounce" style={{ animationDelay: "0.9s" }}>✨</div>

        {/* Content */}
        <div className="relative z-10 px-6 py-3 flex flex-col items-center gap-2 text-center">

          {/* Top Badge */}
          <div
            className="text-xs font-black px-4 py-1 rounded-full text-white tracking-widest uppercase"
            style={{
              background: "rgba(0,0,0,0.3)",
              border: "1.5px solid rgba(255,255,255,0.4)",
            }}
          >
            🎉 India's Most Loved Adult Store
          </div>

          {/* Headline */}
          <h1
            className="font-black text-white leading-tight"
            style={{
              fontSize: "clamp(1.3rem, 4.5vw, 2rem)",
              textShadow: "3px 3px 0px #000, -1px -1px 0px #000, 1px -1px 0 #000, -1px 1px 0 #000",
              letterSpacing: "-0.5px",
            }}
          >
            Wanna know what your{" "}
            <span style={{ color: "#fff700" }}>faves are raving about? 😏</span>
          </h1>

          {/* Sub text */}
          <p
            className="text-white text-xs font-bold"
            style={{ textShadow: "1px 1px 2px #000" }}
          >
            💫 Premium Quality &nbsp;•&nbsp; 🚚 Discreet Delivery &nbsp;•&nbsp; 😍 10,000+ Happy Customers
          </p>

          {/* CTA Button */}
          <div
            className="w-full py-2.5 px-6 rounded-xl font-black flex items-center justify-center gap-2 shadow-xl"
            style={{
              background: "linear-gradient(90deg, #fff 0%, #ffe6f5 50%, #fff 100%)",
              border: "3px solid #000",
              color: "#cc0077",
              fontSize: "clamp(0.95rem, 3vw, 1.15rem)",
              letterSpacing: "0.5px",
            }}
          >
            <span>🛍️</span>
            <span>SHOP NOW !</span>
            <span className="font-black text-xl" style={{ color: "#ff0080" }}>→</span>
          </div>
        </div>
      </div>
    </div>
  );
}