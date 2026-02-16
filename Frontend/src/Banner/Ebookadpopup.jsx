import React, { useState, useEffect } from "react";
import { X, Zap, Lock, RefreshCw, AlertTriangle, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes popIn {
    0%   { transform: scale(0.82) translateY(24px); opacity: 0; }
    65%  { transform: scale(1.02) translateY(-2px); opacity: 1; }
    100% { transform: scale(1) translateY(0);       opacity: 1; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes pulseRing {
    0%   { box-shadow: 0 0 0  0   rgba(236,72,153,0.5); }
    70%  { box-shadow: 0 0 0 12px rgba(236,72,153,0);   }
    100% { box-shadow: 0 0 0  0   rgba(236,72,153,0);   }
  }
  @keyframes floatBook {
    0%,100% { transform: translateY(0)    rotate(-1deg); }
    50%     { transform: translateY(-5px) rotate(-1deg); }
  }
  @keyframes ticker {
    0%   { transform: translateX(100%);  }
    100% { transform: translateX(-100%); }
  }
  @keyframes badgeBounce {
    0%,100% { transform: scale(1)    rotate(-2deg); }
    50%     { transform: scale(1.09) rotate(-2deg); }
  }
  @keyframes countFlash {
    0%,100% { color:#f87171; text-shadow:0 0 8px rgba(248,113,113,.55); }
    50%     { color:#fbbf24; text-shadow:0 0 8px rgba(251,191,36,.55);  }
  }
  @keyframes closePop {
    0%   { transform: scale(0.8) rotate(-8deg); opacity:0; }
    100% { transform: scale(1)   rotate(0deg);  opacity:1; }
  }

  .popup-enter   { animation: popIn       .45s cubic-bezier(.34,1.56,.64,1) forwards; }
  .close-pop-in  { animation: closePop    .35s cubic-bezier(.34,1.56,.64,1) forwards; }

  .btn-cta {
    background: linear-gradient(110deg,#be185d 0%,#ec4899 40%,#ff79b0 55%,#ec4899 70%,#be185d 100%);
    background-size: 250% auto;
    animation: shimmer 2.2s linear infinite;
    transition: transform .15s;
  }
  .btn-cta:hover  { animation: shimmer 1s linear infinite; transform: scale(1.025) translateY(-1px); }
  .btn-cta:active { transform: scale(0.97); }

  .pulse-ring    { animation: pulseRing   1.6s ease-out  infinite; }
  .badge-bounce  { animation: badgeBounce 1.5s ease-in-out infinite; }
  .float-book    { animation: floatBook   3s   ease-in-out infinite; }
  .count-flash   { animation: countFlash  1s   ease-in-out infinite; }

  .ticker-wrap { overflow:hidden; white-space:nowrap; }
  .ticker-text { display:inline-block; animation: ticker 15s linear infinite; }
`;

export default function EbookAdPopup({ setShowPopup }) {
  const [timeLeft, setTimeLeft] = useState({ m: 14, s: 59 });
  const [viewers, setViewers]   = useState(47);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s === 0) return prev.m === 0 ? prev : { m: prev.m - 1, s: 59 };
        return { ...prev, s: prev.s - 1 };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const v = setInterval(() => {
      setViewers(n => Math.max(40, n + (Math.random() > 0.5 ? 1 : -1)));
    }, 3200);
    return () => clearInterval(v);
  }, []);

  const pad = n => String(n).padStart(2, "0");

  return (
    <>
      <style>{style}</style>

      {/* Overlay — slightly transparent so page content peeks through */}
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
        style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(4px)" }}
      >
        {/* ── CLOSE BUTTON — outside the card, clearly floating above ── */}
        <button
          onClick={() => setShowPopup(false)}
          className="close-pop-in mb-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
          style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", fontFamily:"'DM Sans',sans-serif" }}
        >
          <X className="w-3.5 h-3.5" />
          Close
        </button>

        {/* ── CARD ── */}
        <div
          className="popup-enter relative w-full overflow-hidden rounded-2xl"
          style={{
            maxWidth: 380,
            background: "#09090f",
            border: "1px solid #1f1f32",
            boxShadow: "0 0 0 1px #2a0a1a, 0 0 40px rgba(236,72,153,0.25), 0 24px 60px rgba(0,0,0,0.85)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {/* Ticker */}
          <div
            className="ticker-wrap py-1"
            style={{ background:"linear-gradient(90deg,#be185d,#ec4899,#be185d)", fontSize:10, fontWeight:700, color:"#fff", letterSpacing:"0.05em" }}
          >
            <span className="ticker-text uppercase">
              🔥 Warning — Read Before She Does &nbsp;⚡&nbsp; 500+ Men Already Know Her Secrets &nbsp;🔥&nbsp; Warning — Read Before She Does &nbsp;⚡&nbsp; Limited Copies Left &nbsp;&nbsp;
            </span>
          </div>

          {/* Hero row */}
          <div
            className="relative flex items-center gap-4 px-4 py-4"
            style={{ background:"linear-gradient(150deg,#1a0910 0%,#0d0d18 60%,#09090f 100%)" }}
          >
            {/* Glow orb */}
            <div className="absolute" style={{ width:160,height:160,borderRadius:"50%",background:"radial-gradient(circle,rgba(236,72,153,0.18) 0%,transparent 70%)",top:-50,right:-20,pointerEvents:"none" }} />

            {/* Mini book */}
            <div className="float-book flex-shrink-0 relative" style={{ width:64,height:88 }}>
              <div
                className="w-full h-full rounded-r-lg flex flex-col items-center justify-center"
                style={{ background:"linear-gradient(150deg,#f9a8d4,#ec4899,#9d174d)", boxShadow:"4px 4px 0 #5a0b2e,0 0 22px rgba(236,72,153,0.55)" }}
              >
                <span style={{ fontSize:20 }}>🕵️</span>
                <span style={{ fontSize:"6.5px",color:"#fff",fontWeight:800,textAlign:"center",padding:"0 5px",marginTop:4,lineHeight:1.2 }}>CATCH HER CHEATING</span>
              </div>
              <div style={{ position:"absolute",left:-5,top:0,bottom:0,width:9,background:"#7b1045",borderRadius:"3px 0 0 3px",boxShadow:"-2px 2px 0 #3d0522" }} />
              <div style={{ position:"absolute",right:-2,top:3,bottom:3,width:4,background:"#f3e8ff",borderRadius:"0 2px 2px 0",opacity:.8 }} />
            </div>

            {/* Title */}
            <div className="flex-1 min-w-0 relative z-10">
              <div className="badge-bounce inline-block mb-1.5 px-2 py-0.5 rounded text-xs font-black uppercase tracking-wide" style={{ background:"#fbbf24",color:"#000" }}>
                ⚠️ Expose Her Now
              </div>
              <h2 style={{ fontFamily:"'Oswald',sans-serif",fontSize:20,fontWeight:800,color:"#fff",lineHeight:1.1,textTransform:"uppercase" }}>
                Catch Her <span style={{ color:"#ec4899" }}>Cheating</span> First
              </h2>
              <p style={{ fontSize:11,color:"#555",marginTop:3 }}>The guide she hopes you never read</p>
            </div>
          </div>

          {/* Price + Timer — compact single row */}
          <div className="mx-3 mt-2.5 rounded-xl flex items-center justify-between px-3 py-2.5" style={{ background:"#0f0f1c",border:"1px solid #1e1e35" }}>
            <div>
              <p style={{ fontSize:9,textTransform:"uppercase",letterSpacing:"0.1em",color:"#444",marginBottom:3 }}>Expires in</p>
              <div className="flex items-center gap-1">
                {[pad(timeLeft.m), pad(timeLeft.s)].map((val, i) => (
                  <React.Fragment key={i}>
                    <div className="count-flash px-2 py-0.5 rounded font-mono font-bold text-base text-center" style={{ background:"#1a0810",minWidth:36 }}>{val}</div>
                    {i === 0 && <span style={{ color:"#ec4899",fontSize:16,fontWeight:900 }}>:</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-baseline gap-1.5 justify-end">
                <span style={{ fontFamily:"'Oswald',sans-serif",fontSize:28,fontWeight:800,color:"#fff",lineHeight:1 }}>₹199</span>
                <span style={{ fontSize:12,color:"#3a3a50",textDecoration:"line-through" }}>₹2,499</span>
              </div>
              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold" style={{ background:"linear-gradient(90deg,#15803d,#16a34a)",color:"#fff" }}>92% OFF</span>
            </div>
          </div>

          {/* 3 bullets */}
          <div className="px-3 mt-2.5 space-y-1">
            {[
              { e:"🎯", t:"Spot cheating patterns within minutes" },
              { e:"📍", t:"Her Location Identifier Technique" },
              { e:"🧠", t:"Decode her behavior like a pro" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 rounded-lg px-3 py-2" style={{ background:"#0e0e1c",border:"1px solid #1a1b2e" }}>
                <span style={{ fontSize:13 }}>{item.e}</span>
                <span style={{ fontSize:12,fontWeight:500,color:"#bbb" }}>{item.t}</span>
                <ChevronRight className="ml-auto flex-shrink-0 w-3.5 h-3.5" style={{ color:"#ec4899" }} />
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="px-3 mt-3">
            <button
              onClick={() => { navigate("/eBook"); }}
              className="btn-cta pulse-ring w-full py-3.5 rounded-xl text-white flex items-center justify-center gap-2"
              style={{ fontFamily:"'Oswald',sans-serif",fontSize:17,letterSpacing:"1.2px",fontWeight:700,textTransform:"uppercase" }}
            >
              <Zap className="w-4.5 h-4.5" fill="white" />
              🔥 I WANT THIS NOW
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-1.5">
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background:"#4ade80",boxShadow:"0 0 5px #4ade80" }} />
              <span style={{ fontSize:10,color:"#444" }}>
                <span style={{ color:"#777",fontWeight:600 }}>{viewers} people</span> viewing right now
              </span>
            </div>
          </div>

          {/* Trust + footer */}
          <div className="px-3 mt-2.5 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {[
                { icon:<Lock className="w-3 h-3" />,    label:"Secure" },
                { icon:<Zap className="w-3 h-3" />,     label:"Instant" },
                { icon:<RefreshCw className="w-3 h-3" />,label:"Updates" },
              ].map((t,i) => (
                <div key={i} className="flex items-center gap-1" style={{ color:"#4ade80" }}>
                  {t.icon}
                  <span style={{ fontSize:10,color:"#555" }}>{t.label}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_,i) => <span key={i} style={{ fontSize:10,color:"#fbbf24" }}>★</span>)}
              <span style={{ fontSize:10,color:"#444",marginLeft:2 }}>4.8</span>
            </div>
          </div>

          <div className="px-3 pb-3 flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-3 h-3" style={{ color:"#fbbf24" }} />
            <span style={{ fontSize:9,color:"#fbbf24" }}>No refunds — Educational content only</span>
          </div>
        </div>

        {/* Hint text — tells user there's content behind */}
        <p className="mt-3 text-xs" style={{ color:"rgba(255,255,255,0.25)", fontFamily:"'DM Sans',sans-serif" }}>
          Tap outside or close to continue browsing
        </p>
      </div>
    </>
  );
}