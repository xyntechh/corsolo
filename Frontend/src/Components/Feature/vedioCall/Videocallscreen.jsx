import { useEffect, useRef, useState, useCallback } from "react";
// lucide-react icons (npm i lucide-react)
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, SkipForward,
  Volume2, VolumeX, Coins, FolderOpen, CameraOff, Loader2,
} from "lucide-react";

/**
 * VideoCallScreen  (DUMMY call - asli WebRTC nahi hai)
 * ------------------------------------------------------------
 * Kya hota hai:
 *  1) Screen khulte hi "Connecting..." dikhta hai (fake, 2.5 sec)
 *  2) Phir "Connected" ho jata hai aur call timer chalne lagta hai
 *  3) Tera apna camera chhote box (PiP) me dikhta hai  -> getUserMedia
 *  4) Samne wali side me tera mp4 video chalta hai     -> <video src=...>
 *  5) Pehle 30 sec free, uske baad har 12 sec par 1 coin kat'ta hai
 *
 * Props:
 *  - onEnd(coinsLeft) : call khatam hone par chalta hai (coins save karne ke liye)
 *  - onExit           : "Back" button dabane par chalta hai (screen band karne ke liye)
 *  - balance          : starting coins
 *  - remoteVideos     : mp4 links ka array, e.g. ["/videos/a.mp4", "/videos/b.mp4"]
 *                       (files ko public/videos/ folder me rakho)
 *  - freeSeconds / secondsPerCoin : pricing rules
 */

// Seconds ko mm:ss me badalne ka chhota helper
const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

// Round control button (mic, camera, etc.) - baar-baar likhna na pade
function CtrlBtn({ onClick, active = true, danger = false, label, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-12 w-12 items-center justify-center rounded-full border transition active:scale-95 sm:h-14 sm:w-14 ${
        danger
          ? "border-red-500 bg-red-500 text-white hover:bg-red-600"
          : active
          ? "border-white/10 bg-white/10 text-white backdrop-blur hover:bg-white/20"
          : "border-white/10 bg-white text-gray-900" // off state: white button
      }`}
    >
      {children}
    </button>
  );
}

export default function VideoCallScreen({
  onEnd,
  onExit,
  balance = 0,
  remoteVideos = [],
  freeSeconds = 30,
  secondsPerCoin = 12,
}) {
  /* ---------------- STATE ---------------- */
  const [phase, setPhase] = useState("connecting"); // "connecting" -> "connected" -> "ended"
  const [seconds, setSeconds] = useState(0);        // call kitne second se chal rahi hai
  const [coins, setCoins] = useState(balance);      // live coins
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [camError, setCamError] = useState(false);  // camera permission nahi mili?
  const [videos, setVideos] = useState(remoteVideos); // mp4 list (file picker se bhi add hoti hai)
  const [videoIdx, setVideoIdx] = useState(0);      // abhi kaunsa mp4 chal raha hai
  const [endReason, setEndReason] = useState("");

  /* ---------------- REFS ---------------- */
  const localVideoRef = useRef(null);   // apne camera ka <video>
  const remoteVideoRef = useRef(null);  // samne wale ka <video>
  const streamRef = useRef(null);       // camera ka MediaStream (band karne ke liye)
  const coinsRef = useRef(balance);     // interval ke andar latest coins padhne ke liye
  const fileInputRef = useRef(null);    // hidden file input

  const isFree = seconds <= freeSeconds;
  const currentVideo = videos[videoIdx];

  /* ---------------- 1) APNA CAMERA CHALU KARNA ---------------- */
  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        // Browser se camera + mic ki permission maangta hai
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (cancelled) return stream.getTracks().forEach((t) => t.stop());
        streamRef.current = stream;
        // Stream ko <video> se jod do -> tera face dikhne lagta hai
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      } catch {
        // Mic na mile to sirf video try karo
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (cancelled) return stream.getTracks().forEach((t) => t.stop());
          streamRef.current = stream;
          if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        } catch {
          setCamError(true); // permission deny / camera nahi hai
        }
      }
    }
    startCamera();

    // Cleanup: screen band hote hi camera ki light off ho jaye
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  /* ---------------- 2) FAKE CONNECTING -> CONNECTED ---------------- */
  // Jab bhi phase "connecting" ho, 2.5 sec baad "connected" kar do
  useEffect(() => {
    if (phase !== "connecting") return;
    const t = setTimeout(() => setPhase("connected"), 2500);
    return () => clearTimeout(t);
  }, [phase, videoIdx]);

  /* ---------------- 3) CALL END KARNE KA FUNCTION ---------------- */
  const endCall = useCallback(
    (reason = "") => {
      setEndReason(reason);
      setPhase("ended");
      streamRef.current?.getTracks().forEach((t) => t.stop());
      onEnd?.(coinsRef.current);
    },
    [onEnd]
  );

  /* ---------------- 4) TIMER + COIN CUTTING ---------------- */
  // Call "connected" hone par har 1 second me seconds +1 hota hai
  useEffect(() => {
    if (phase !== "connected") return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Jab bhi seconds badhe: check karo coin katna hai ya nahi
  useEffect(() => {
    if (phase !== "connected" || seconds <= freeSeconds) return;

    // Free time ke baad har 12 sec block ke shuru me 1 coin katega
    const paidSec = seconds - freeSeconds - 1;
    if (paidSec % secondsPerCoin !== 0) return;

    if (coinsRef.current < 1) {
      endCall("Coins khatam ho gaye, call end ho gayi.");
    } else {
      coinsRef.current -= 1;
      setCoins(coinsRef.current);
    }
  }, [seconds, phase, freeSeconds, secondsPerCoin, endCall]);

  /* ---------------- 5) MIC / CAMERA / SPEAKER TOGGLES ---------------- */
  const toggleMic = () => {
    // Track.enabled = false -> mic mute (stream band nahi hota)
    streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = !micOn));
    setMicOn(!micOn);
  };
  const toggleCam = () => {
    streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = !camOn));
    setCamOn(!camOn);
  };

  /* ---------------- 6) NEXT (dusra dummy match) ---------------- */
  const nextCall = () => {
    setSeconds(0);              // timer reset
    setPhase("connecting");     // phir se fake connecting
    if (videos.length > 1) setVideoIdx((i) => (i + 1) % videos.length);
  };

  /* ---------------- 7) APNI MP4 FILE CHUNNA ---------------- */
  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file); // browser ke andar temporary link
    setVideos((v) => [...v, url]);
    setVideoIdx(videos.length);            // naya video turant chalao
    e.target.value = "";
  };

  // Video ko play karwana (autoplay block ho to muted karke try)
  useEffect(() => {
    const v = remoteVideoRef.current;
    if (!v || phase !== "connected") return;
    v.play().catch(() => {
      v.muted = true;
      setSpeakerOn(false);
      v.play().catch(() => {});
    });
  }, [phase, currentVideo]);

  /* ---------------- ENDED SCREEN ---------------- */
  if (phase === "ended") {
    return (
      <div className="flex h-[100dvh] w-full flex-col items-center justify-center gap-3 bg-[#0b0b14] px-6 text-center text-white">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
          <PhoneOff className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold">Call ended</h2>
        <p className="text-sm text-gray-400">
          {endReason || `Duration ${fmt(seconds)}`} · Coins left: {coins.toLocaleString()}
        </p>
        <button
          onClick={() => onExit?.()}
          className="mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-semibold"
        >
          Back
        </button>
      </div>
    );
  }

  /* ---------------- MAIN CALL SCREEN ---------------- */
  return (
    // h-[100dvh] = mobile browser ke address bar ke saath bhi poori height
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#0b0b14] text-white">
      {/* ===== A) REMOTE VIDEO (poori screen) ===== */}
      {currentVideo ? (
        <video
          key={currentVideo}            // video badle to element naya bane
          ref={remoteVideoRef}
          src={currentVideo}
          loop
          playsInline
          muted={!speakerOn}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            phase === "connected" ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : (
        // Koi mp4 select nahi hai to ye message dikhega
        phase === "connected" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <FolderOpen className="h-10 w-10 text-gray-500" />
            <p className="text-sm text-gray-400">Koi dummy video select nahi hai</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold"
            >
              Choose mp4 video
            </button>
          </div>
        )
      )}

      {/* Hidden file input (top bar ka button isko click karta hai) */}
      <input ref={fileInputRef} type="file" accept="video/mp4,video/*" hidden onChange={onPickFile} />

      {/* ===== B) CONNECTING OVERLAY ===== */}
      {phase === "connecting" && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 bg-[#0b0b14]">
          {/* Pulse rings + avatar */}
          <div className="relative flex h-28 w-28 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-purple-600/30" />
            <span className="absolute inset-3 animate-pulse rounded-full bg-purple-600/30" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
              <Video className="h-8 w-8" />
            </div>
          </div>
          <div className="text-center">
            <p className="flex items-center justify-center gap-2 text-lg font-semibold">
              <Loader2 className="h-4 w-4 animate-spin" /> Connecting...
            </p>
            <p className="mt-1 text-sm text-gray-400">Finding someone to talk to</p>
          </div>
        </div>
      )}

      {/* Upar aur niche ka dark gradient taaki text/buttons saaf dikhein */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-black/80 to-transparent" />

      {/* ===== C) TOP BAR ===== */}
      <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-2 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5">
        {/* Left: status + timer */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium backdrop-blur">
            <span
              className={`h-2 w-2 rounded-full ${
                phase === "connected" ? "bg-green-400" : "animate-pulse bg-yellow-400"
              }`}
            />
            {phase === "connected" ? fmt(seconds) : "Connecting"}
          </span>

          {/* Free / Paid badge */}
          {phase === "connected" && (
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur ${
                isFree ? "bg-green-500/20 text-green-300" : "bg-orange-500/20 text-orange-300"
              }`}
            >
              {isFree ? `Free · ${freeSeconds - seconds}s left` : `1 coin / ${secondsPerCoin}s`}
            </span>
          )}
        </div>

        {/* Right: coins + file picker */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold backdrop-blur">
            <Coins className="h-3.5 w-3.5 text-orange-400" />
            {coins.toLocaleString()}
          </span>
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Choose mp4"
            aria-label="Choose mp4"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur hover:bg-black/60"
          >
            <FolderOpen className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ===== D) APNA CAMERA (PiP - chhota box) ===== */}
      <div className="absolute bottom-28 right-3 z-30 aspect-[3/4] w-28 overflow-hidden rounded-2xl border border-white/20 bg-[#1b1b2a] shadow-2xl sm:bottom-32 sm:right-5 sm:w-44 lg:w-56">
        <video
          ref={localVideoRef}
          autoPlay
          muted          // apni awaaz khud na sunaye (echo se bachne ke liye)
          playsInline
          className={`h-full w-full -scale-x-100 object-cover ${camOn && !camError ? "" : "hidden"}`}
          // -scale-x-100 = mirror effect (selfie jaisa)
        />
        {/* Camera off ya permission nahi mili to placeholder */}
        {(!camOn || camError) && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-2 text-center text-gray-400">
            <CameraOff className="h-6 w-6" />
            <span className="text-[11px] leading-tight">
              {camError ? "Camera permission do" : "Camera off"}
            </span>
          </div>
        )}
        <span className="absolute bottom-1.5 left-2 text-[11px] font-medium drop-shadow">You</span>
      </div>

      {/* ===== E) BOTTOM CONTROLS ===== */}
      <div className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-center gap-3 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:gap-4">
        <CtrlBtn onClick={toggleMic} active={micOn} label={micOn ? "Mute" : "Unmute"}>
          {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </CtrlBtn>

        <CtrlBtn onClick={toggleCam} active={camOn} label={camOn ? "Camera off" : "Camera on"}>
          {camOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </CtrlBtn>

        {/* End call - sabse bada aur red */}
        <CtrlBtn onClick={() => endCall()} danger label="End call">
          <PhoneOff className="h-5 w-5" />
        </CtrlBtn>

        <CtrlBtn onClick={() => setSpeakerOn(!speakerOn)} active={speakerOn} label="Speaker">
          {speakerOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </CtrlBtn>

        <CtrlBtn onClick={nextCall} label="Next">
          <SkipForward className="h-5 w-5" />
        </CtrlBtn>
      </div>
    </div>
  );
}

/* ============================================================
   USAGE EXAMPLE (popup se Start Call dabane par screen khule)
   ============================================================

   import { useState } from "react";
   import VideoCallModal from "./VideoCallModal";
   import VideoCallScreen from "./VideoCallScreen";

   export default function App() {
     const [showModal, setShowModal] = useState(true);
     const [inCall, setInCall] = useState(false);
     const [coins, setCoins] = useState(8900);

     if (inCall) {
       return (
         <VideoCallScreen
           balance={coins}
           remoteVideos={["/videos/demo1.mp4", "/videos/demo2.mp4"]} // public/videos/ me rakho
           onEnd={(left) => setCoins(left)}       // coins save
           onExit={() => setInCall(false)}        // Back dabane par wapas
         />
       );
     }

     return (
       <VideoCallModal
         open={showModal}
         onClose={() => setShowModal(false)}
         balance={coins}
         onStart={() => { setShowModal(false); setInCall(true); }}
       />
     );
   }
*/