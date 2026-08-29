import React, { useState, useEffect, useRef, useMemo } from "react";
import { Play, Pause } from "lucide-react";

function hashSeed(str = "") {
  let h = 7;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) % 233280;
  }
  return h || 7;
}

function useWaveform(barCount, seed) {
  return useMemo(() => {
    let s = seed;
    const rand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    return Array.from({ length: barCount }, (_, i) => {
      // shape the amplitude so it swells in the middle and tapers at
      // the ends, like a real waveform — not just flat noise.
      const t = i / Math.max(1, barCount - 1);
      const envelope = Math.sin(Math.PI * t) * 0.85 + 0.15;
      const noise = rand();
      const h = 0.15 + envelope * noise;
      return Math.max(0.12, Math.min(1, h));
    });
  }, [barCount, seed]);
}

function formatTime(secs) {
  if (!secs || isNaN(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Chat voice-message player.
 * Sized to line up with the other bubble media (matches the image bubble's
 * max-w-[220px] sm:max-w-[280px]) and themed off `isMe`, the same way the
 * rest of the chat (avatar, name, left rail) is.
 */
export default function VoiceMessageBubble({ src, isMe }) {
  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [barCount, setBarCount] = useState(28);

  const seed = useMemo(() => hashSeed(src), [src]);
  const bars = useWaveform(barCount, seed);

  // Recalculate how many bars fit the track's real width so bars are
  // always crisp and never overflow or get clipped, at any breakpoint.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const BAR_MIN_WIDTH = 2.5; // px
    const GAP = 2.5; // px, matches the gap-[2.5px] below

    const recalc = () => {
      const width = el.clientWidth;
      if (!width) return;
      const count = Math.max(
        10,
        Math.floor((width + GAP) / (BAR_MIN_WIDTH + GAP))
      );
      setBarCount(count);
    };

    recalc();
    const ro = new ResizeObserver(recalc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => setDuration(audio.duration || 0);
    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !src) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (fraction) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const clamped = Math.min(1, Math.max(0, fraction));
    audio.currentTime = clamped * duration;
    setCurrentTime(clamped * duration);
  };

  const progress = duration ? currentTime / duration : 0;
  const playedBars = Math.round(progress * bars.length);

  return (
    <div
      className={`flex items-center gap-2.5 rounded-full pl-1.5 pr-3 py-1.5 mt-1
        w-[220px] sm:w-[280px] max-w-full shadow-md
        ${isMe
          ? "bg-gradient-to-br from-indigo-500 to-indigo-700"
          : "bg-gradient-to-br from-fuchsia-500 to-fuchsia-700"
        }`}
    >
      <audio ref={audioRef} src={src || undefined} preload="metadata" className="hidden" />

      <button
        onClick={togglePlay}
        disabled={!src}
        aria-label={isPlaying ? "Pause voice message" : "Play voice message"}
        className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center
          transition-transform active:scale-90 disabled:opacity-50
          ${isMe ? "bg-indigo-100" : "bg-fuchsia-100"}`}
      >
        {isPlaying ? (
          <Pause size={15} strokeWidth={0} fill={isMe ? "#4338CA" : "#A21CAF"} />
        ) : (
          <Play
            size={15}
            strokeWidth={0}
            fill={isMe ? "#4338CA" : "#A21CAF"}
            className="ml-0.5"
          />
        )}
      </button>

      <div
        ref={containerRef}
        className="flex-1 min-w-0 flex items-center gap-[2.5px] h-7 cursor-pointer overflow-hidden"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          handleSeek((e.clientX - rect.left) / rect.width);
        }}
      >
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-full transition-colors"
            style={{
              height: `${h * 100}%`,
              background: i < playedBars ? "#FFFFFF" : "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </div>

      <span className="shrink-0 text-[10px] font-medium text-white/85 tabular-nums w-8 text-right">
        {formatTime(isPlaying || currentTime > 0 ? currentTime : duration)}
      </span>
    </div>
  );
}