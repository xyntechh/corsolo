import React, { useEffect, useRef, useState } from "react";
import { X, Search } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "../../assets/animation.json";
import { useUser } from "../../Context/UserContext";
import { socket } from "../../socket.js";

const STATUS_MESSAGES = [
  "Waddling around for someone nice...",
  "Checking who's online...",
  "Sniffing out good vibes...",
  "Almost found someone...",
];

const BLADES = Array.from({ length: 18 }, (_, i) => ({
  left: (i / 17) * 100,
  height: 14 + ((i * 37) % 14),
  delay: (i % 6) * 0.3,
  duration: 2.4 + (i % 3) * 0.5,
}));

export default function SearchingScreen() {
  const [statusIndex, setStatusIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [cancelled, setCancelled] = useState(false);

  // status text rotation
  useEffect(() => {
    if (cancelled) return;
    const t = setInterval(() => {
      setStatusIndex((i) => (i + 1) % STATUS_MESSAGES.length);
    }, 2600);
    return () => clearInterval(t);
  }, [cancelled]);

  // elapsed timer
  useEffect(() => {
    if (cancelled) return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [cancelled]);

  const { isMatched, setIsMatched } = useUser();

  useEffect(() => {
    const handleMatchCancelled = () => {
      setIsMatched(false);  

    };

    socket.on("matchCancelled", handleMatchCancelled);

    return () => {
      socket.off("matchCancelled", handleMatchCancelled);
    };
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-6 px-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

        @keyframes sway {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(6deg); }
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes fade-cycle {
          0%, 100% { opacity: 0; transform: translateY(4px); }
          12%, 88% { opacity: 1; transform: translateY(0px); }
        }
        @keyframes sparkle-pop {
          0% { opacity: 0; transform: scale(0.5) translateY(4px); }
          40% { opacity: 1; transform: scale(1) translateY(0px); }
          100% { opacity: 0; transform: scale(0.9) translateY(-4px); }
        }
        .status-text { animation: fade-cycle 2.6s ease-in-out infinite; }
        .font-display { font-family: 'Sora', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
      `}</style>

      {cancelled ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-500/10 ring-1 ring-purple-500/30">
            <X className="h-6 w-6 text-purple-300" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-purple-50">
              You re not looking for a partner anymore
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              Come back whenever you're ready.
            </p>
          </div>
          <button
            onClick={() => {
              socket.emit("cancelMatch");
            }}
            className="mt-1 rounded-full bg-purple-500 px-6 py-2 text-sm font-medium text-white transition hover:bg-purple-600 active:scale-[0.98]"
          >
            Cancel search
          </button>
        </div>
      ) : (
        <>
          <div className="font-body text-sm text-neutral-400">
            Looking for a partner
          </div>

          {/* duck + grass scene */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36">
            <Lottie
              animationData={animationData}
              loop
              autoplay
              className="w-full h-full"
            />
          </div>

          {/* status */}
          <div className="h-5">
            <p
              key={statusIndex}
              className="status-text font-body text-sm text-purple-300"
            >
              {STATUS_MESSAGES[statusIndex]}
            </p>
          </div>

          {/* timer */}
          <div className="flex items-center gap-2 rounded-full bg-purple-500/10 px-4 py-1.5 ring-1 ring-purple-500/20">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400" />
            <span className="font-display text-sm font-medium tabular-nums text-purple-200">
              {String(Math.floor(elapsed / 60)).padStart(2, "0")}:
              {String(elapsed % 60).padStart(2, "0")}
            </span>
          </div>

          {/* cancel */}
          <button
            onClick={() => setCancelled(true)}
            className="group flex items-center gap-2 rounded-full border border-purple-500/30 px-6 py-2 text-sm font-medium text-purple-200 transition hover:border-purple-400 hover:bg-purple-500/10 active:scale-[0.98]"
          >
            <X className="h-4 w-4" />
            Cancel search
          </button>
        </>
      )}
    </div>
  );
}
