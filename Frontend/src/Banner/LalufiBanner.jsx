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
    <div className="w-full px-2 py-1.5">
      <div
        className="relative cursor-pointer overflow-hidden rounded-2xl shadow-2xl w-full hover:scale-[1.01] active:scale-95 transition-all duration-200"
        style={{ border: "3px solid #000" }}
        onClick={() => window.open("https://lalufi.com/shop", "_blank")}
      >
        {/* BG */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #ff0090 0%, #ff4db8 35%, #cc00ee 100%)" }}
        />

        {/* Stripes */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 14px, rgba(255,255,255,1) 14px, rgba(255,255,255,1) 28px)" }}
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
        <div className="absolute top-1.5 left-3 text-base animate-bounce">💋</div>
        <div className="absolute top-1.5 right-3 text-base animate-bounce" style={{ animationDelay: "0.3s" }}>🔥</div>
        <div className="absolute bottom-1.5 left-5 text-sm animate-bounce" style={{ animationDelay: "0.6s" }}>💕</div>
        <div className="absolute bottom-1.5 right-5 text-sm animate-bounce" style={{ animationDelay: "0.9s" }}>✨</div>

        {/* Content */}
        <div className="relative z-10 px-5 py-2 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">

          {/* Left: Badge + Headline + Subtext */}
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            {/* Badge */}
            <div
              className="self-center sm:self-start text-white font-black tracking-widest uppercase w-fit"
              style={{
                fontSize: "10px",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.4)",
                padding: "2px 10px",
                borderRadius: "999px",
              }}
            >
              🎉 India's Most Loved Adult Store
            </div>

            {/* Headline */}
            <h1
              className="font-black text-white leading-tight"
              style={{
                fontSize: "clamp(1rem, 3.5vw, 1.6rem)",
                textShadow: "2px 2px 0px #000, -1px -1px 0px #000, 1px -1px 0 #000, -1px 1px 0 #000",
                letterSpacing: "-0.3px",
              }}
            >
              Wanna know what your{" "}
              <span style={{ color: "#fff700" }}>faves are raving about? 😏</span>
            </h1>

            {/* Subtext */}
            <p
              className="text-white font-bold"
              style={{ fontSize: "clamp(0.6rem, 1.5vw, 0.7rem)", textShadow: "1px 1px 1px #000" }}
            >
              💫 Premium Quality &nbsp;•&nbsp; 🚚 Discreet Delivery &nbsp;•&nbsp; 😍 10,000+ Happy Customers
            </p>
          </div>

          {/* Right: CTA Button */}
          <div
            className="shrink-0 font-black flex items-center justify-center gap-2 shadow-xl rounded-xl whitespace-nowrap"
            style={{
              background: "linear-gradient(90deg, #fff 0%, #ffe6f5 50%, #fff 100%)",
              border: "3px solid #000",
              color: "#cc0077",
              fontSize: "clamp(0.8rem, 2.5vw, 1.05rem)",
              padding: "8px 20px",
              letterSpacing: "0.5px",
            }}
          >
            <span>🛍️</span>
            <span>SHOP NOW!</span>
            <span style={{ color: "#ff0080", fontWeight: 900 }}>→</span>
          </div>
        </div>
      </div>
    </div>
  );
}