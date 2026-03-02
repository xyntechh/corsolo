import { useState, useEffect } from "react";

export default function LalufiBanner() {
  const [shimmer, setShimmer] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const shimmerInterval = setInterval(() => {
      setShimmer(true);
      setTimeout(() => setShimmer(false), 1000);
    }, 2800);

    const pulseInterval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 400);
    }, 3000);

    return () => {
      clearInterval(shimmerInterval);
      clearInterval(pulseInterval);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');

        .lalufi-wrap {
          width: 100%;
          padding: 6px 8px;
          box-sizing: border-box;
          font-family: 'Nunito', sans-serif;
        }

        .lalufi-banner {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          border: 2.5px solid #000;
          box-shadow: 0 4px 24px rgba(255,0,144,0.35), 0 1px 4px rgba(0,0,0,0.2);
          cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          background: linear-gradient(135deg, #ff0090 0%, #e6009e 30%, #c200dd 100%);
          width: 100%;
        }
        .lalufi-banner:hover {
          transform: scale(1.012);
          box-shadow: 0 6px 32px rgba(255,0,144,0.5), 0 2px 8px rgba(0,0,0,0.2);
        }
        .lalufi-banner:active {
          transform: scale(0.97);
        }

        /* Diagonal stripes overlay */
        .lalufi-stripes {
          position: absolute;
          inset: 0;
          opacity: 0.06;
          background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 16px,
            rgba(255,255,255,1) 16px,
            rgba(255,255,255,1) 32px
          );
        }

        /* Noise grain */
        .lalufi-grain {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 128px 128px;
          pointer-events: none;
        }

        /* Top glow */
        .lalufi-glow {
          position: absolute;
          top: -40%;
          left: 20%;
          width: 60%;
          height: 160%;
          background: radial-gradient(ellipse, rgba(255,255,255,0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Shimmer sweep */
        .lalufi-shimmer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,255,255,0.3) 50%,
            transparent 100%
          );
          will-change: transform;
        }

        /* Floating emojis */
        .lalufi-emoji {
          position: absolute;
          pointer-events: none;
          animation: floatBounce 2.2s ease-in-out infinite;
          line-height: 1;
          user-select: none;
        }
        @keyframes floatBounce {
          0%, 100% { transform: translateY(0px) rotate(-4deg); }
          50%       { transform: translateY(-4px) rotate(4deg); }
        }

        /* Inner content layout */
        .lalufi-inner {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: clamp(8px, 2vw, 24px);
          padding: clamp(7px, 1.2vw, 12px) clamp(16px, 3.5vw, 36px);
        }

        /* Left text block */
        .lalufi-left {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        /* Badge */
        .lalufi-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(0,0,0,0.28);
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 999px;
          color: #fff;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          white-space: nowrap;
          width: fit-content;
          font-size: clamp(7px, 0.7vw, 10px);
          padding: 2px clamp(8px, 1.2vw, 14px);
        }

        /* Headline */
        .lalufi-headline {
          font-weight: 900;
          color: #fff;
          margin: 0;
          line-height: 1.1;
          letter-spacing: -0.02em;
          font-size: clamp(0.72rem, 1.4vw, 1.15rem);
          text-shadow:
            2px 2px 0 #000,
            -1px -1px 0 #000,
            1px -1px 0 #000,
            -1px 1px 0 #000;
        }
        .lalufi-headline .accent {
          color: #fff700;
        }

        /* Subtext */
        .lalufi-sub {
          margin: 0;
          font-weight: 700;
          color: rgba(255,255,255,0.96);
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
          font-size: clamp(0.5rem, 0.7vw, 0.65rem);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* CTA */
        .lalufi-cta {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          border-radius: 12px;
          border: 2.5px solid #000;
          background: linear-gradient(135deg, #fff 0%, #ffe8f6 50%, #fff 100%);
          color: #cc0077;
          font-weight: 900;
          font-family: 'Nunito', sans-serif;
          letter-spacing: 0.03em;
          box-shadow: 0 3px 10px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.9);
          white-space: nowrap;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          font-size: clamp(0.62rem, 0.95vw, 0.88rem);
          padding: clamp(5px, 0.8vw, 9px) clamp(12px, 2vw, 22px);
        }
        .lalufi-banner:hover .lalufi-cta {
          transform: scale(1.04);
          box-shadow: 0 5px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.9);
        }
        .lalufi-cta .arrow {
          color: #ff0080;
          font-weight: 900;
          transition: transform 0.15s ease;
        }
        .lalufi-banner:hover .lalufi-cta .arrow {
          transform: translateX(3px);
        }
        .lalufi-cta.pulse-anim {
          animation: ctaPulse 0.4s ease;
        }
        @keyframes ctaPulse {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.07); }
          100% { transform: scale(1); }
        }

        /* Mobile: stack vertically on very small screens */
        @media (max-width: 380px) {
          .lalufi-inner {
            flex-direction: column;
            align-items: flex-start;
            padding: 10px 14px;
          }
          .lalufi-cta {
            width: 100%;
            justify-content: center;
            font-size: 0.8rem;
            padding: 7px 0;
          }
          .lalufi-sub {
            white-space: normal;
          }
        }
      `}</style>

      <div className="lalufi-wrap">
        <div
          className="lalufi-banner"
          onClick={() => window.open("https://lalufi.com", "_blank")}
        >
          {/* Background layers */}
          <div className="lalufi-stripes" />
          <div className="lalufi-grain" />
          <div className="lalufi-glow" />

          {/* Shimmer sweep */}
          <div
            className="lalufi-shimmer"
            style={{
              transform: shimmer ? "translateX(200%)" : "translateX(-120%)",
              transition: shimmer ? "transform 0.95s cubic-bezier(0.4,0,0.2,1)" : "none",
            }}
          />

          {/* Floating emojis */}
          <span className="lalufi-emoji" style={{ top: "14%", left: "2%",  fontSize: "clamp(0.7rem,1.3vw,0.9rem)", animationDelay: "0s" }}>💋</span>
          <span className="lalufi-emoji" style={{ top: "12%", right: "6%", fontSize: "clamp(0.7rem,1.3vw,0.9rem)", animationDelay: "0.35s" }}>🔥</span>
          <span className="lalufi-emoji" style={{ bottom: "10%", left: "4%", fontSize: "clamp(0.6rem,1vw,0.78rem)",  animationDelay: "0.7s" }}>💕</span>
          <span className="lalufi-emoji" style={{ bottom: "10%", right: "8%",fontSize: "clamp(0.6rem,1vw,0.78rem)",  animationDelay: "1.05s" }}>✨</span>

          {/* Content */}
          <div className="lalufi-inner">
            {/* Left */}
            <div className="lalufi-left">
              <div className="lalufi-badge">🎉 India's Most Loved Adult Store</div>
              <h1 className="lalufi-headline">
                Wanna know what your{" "}
                <span className="accent">faves are raving about? 😏</span>
              </h1>
              <p className="lalufi-sub">
                💫 Premium Quality &nbsp;•&nbsp; 🚚 Discreet Delivery &nbsp;•&nbsp; 😍 10,000+ Happy Customers
              </p>
            </div>

            {/* CTA */}
            <div className={`lalufi-cta${pulse ? " pulse-anim" : ""}`}>
              <span style={{ fontSize: "clamp(0.7rem,1vw,1rem)" }}>🛍️</span>
              <span>SHOP NOW!</span>
              <span className="arrow">→</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}