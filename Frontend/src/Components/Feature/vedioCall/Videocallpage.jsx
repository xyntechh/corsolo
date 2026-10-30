import { useEffect, useRef, useState } from "react";
// lucide-react icons (npm i lucide-react)
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Gift,
  IndianRupee,
  Wallet,
  ShieldCheck,
  Timer,
  Upload,
  CameraOff,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Film,
} from "lucide-react";
import { useUser } from "../../../Context/UserContext.jsx";
import axios from "axios";

/* ============================================================
   VIDEO CALL PAGE (DUMMY - asli WebRTC nahi hai)
   ------------------------------------------------------------
   Is ek file me 2 screens hain:
     1) HOME  -> rules/pricing dikhte hain + niche "Start call" button
     2) CALL  -> timer + end button + samne tera mp4 + apna face (PiP)
   Dono ko `screen` state se switch karte hain ("home" / "call").
   ============================================================ */

/* ---------- SETTINGS (yahan se sab badal sakta hai) ---------- */
const CALL_PRICE = 20; // pehli call ke baad har call ka rate (Rs)

// Apni mp4 files ko `public/videos/` me rakho aur yahan naam likho.
// Khali chhod diya to home page par "Add mp4" se local file chun sakta hai.
const DEFAULT_VIDEOS = ["/Vedio call/v-1.mp4"];

// Seconds ko mm:ss me badalta hai (65 -> "01:05")
const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/* ============================================================
   MAIN COMPONENT - sab state yahan rehti hai
   ============================================================ */
export default function VideoCallPage() {
  const [screen, setScreen] = useState("home"); // abhi kaunsi screen dikh rahi hai
  const [wallet, setWallet] = useState(0); // Rs balance
  const [callsMade, setCallsMade] = useState(0); // ab tak kitni calls hui
  const [videos, setVideos] = useState(DEFAULT_VIDEOS); // samne chalne wale mp4 links
  const [lastCall, setLastCall] = useState(null); // pichhli call ka summary
  const { user, fetchUser } = useUser();

  console.log("user in video call page", user);
  useEffect(() => {
    setWallet(user?.coin || 0);
  }, [user?.coin]);

  const isFreeCall = user?.freeVedioCall !== 0;
  const cost = isFreeCall ? 0 : CALL_PRICE;
  const canStart = wallet >= cost;

  // "Start call" dabane par

  const startCall = async () => {
    // Prevent call if user is not eligible
    if (!canStart) return;

    try {
      const token = localStorage.getItem("authToken");

      // STEP 1: Deduct coins for paid call
      if (!isFreeCall) {
        const debitResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/user/debit`,
          {
            coin: CALL_PRICE,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // Stop if coin deduction fails
        if (!debitResponse.data.success) {
          console.error(debitResponse.data.message || "Coin deduction failed");
          return;
        }

        console.log("Coin deducted successfully:", debitResponse.data);

        // Refresh user wallet after successful deduction
        await fetchUser();

        setScreen("call");
      }

      // STEP 2: Update free video call count

      const freeCallResponse = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/user/update-free-call`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchUser();

      const { success, message, freeVedioCall } = freeCallResponse.data;

      // Stop if free call update fails
      if (!success) {
        console.error(message || "Failed to update free call");
        return;
      }


      setScreen("call");
    } catch (error) {
      // Handle API and network errors
      console.error(
        "Start call error:",
        error.response?.data?.message || error.message,
      );
    }
  };

  // Call screen se "End" dabane par (duration seconds me aata hai)
  const endCall = (duration) => {
    setCallsMade((n) => n + 1); // call count +1 (ab agli call paid hogi)
    setLastCall({ duration, paid: cost });
    setScreen("home"); // wapas main page
  };

  // Home page par mp4 file chunna (upload nahi hota, browser me hi chalti hai)
  const addVideo = (file) => {
    if (file) setVideos((v) => [...v, URL.createObjectURL(file)]);
  };

  // Screen ke hisaab se component dikhao
  if (screen === "call") {
    return (
      <CallScreen
        // Har call par agla video chalega (1st call -> video 1, 2nd -> video 2 ...)
        videoSrc={videos.length ? videos[callsMade % videos.length] : null}
        onEnd={endCall}
      />
    );
  }

  return (
    <HomeScreen
      wallet={wallet}
      isFreeCall={isFreeCall}
      cost={cost}
      canStart={canStart}
      videosCount={videos.length}
      lastCall={lastCall}
      onAddVideo={addVideo}
      onStart={startCall}
      
    />
  );
}

/* ============================================================
   SCREEN 1: HOME (info + Start call button)
   ============================================================ */
function HomeScreen({
  wallet,
  isFreeCall,
  cost,
  canStart,
  videosCount,
  lastCall,
  onAddVideo,
  onStart,
}) {
  const fileRef = useRef(null);

  return (
    // min-h-[100dvh] + flex-col: footer hamesha niche rahega
    <div className="flex min-h-[100dvh] flex-col bg-[#0b0b14] text-white">
      {/* ----- TOP BAR: logo + wallet ----- */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0b0b14]/90 px-4 py-3 backdrop-blur sm:px-8">
        {/* LEFT: Back button + logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            // onBack diya hai to wo chalega, warna browser ka previous page
            onClick={() =>  window.history.back()}
            aria-label="Go back"
            title="Back"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#12121c] text-gray-300 transition hover:bg-white/10 hover:text-white active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="text-base font-semibold sm:text-lg">
            Corsolo.com
          </span>
        </div>

        {/* RIGHT: wallet balance */}
        <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-[#12121c] px-3 py-1.5 text-sm font-semibold">
          <Wallet className="h-4 w-4 text-orange-400" />₹{wallet}
        </span>
      </header>

      {/* ----- MAIN CONTENT (scroll hota hai) ----- */}
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        {/* Hero */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-purple-600/30">
            <Video className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl font-bold sm:text-3xl">Video Call</h1>
          <p className="mt-2 max-w-md text-sm text-gray-400 sm:text-base">
            Meet someone new face to face. Read the pricing below, then start
            your call.
          </p>
        </div>

        {/* Pichhli call ka summary (sirf call ke baad dikhta hai) */}
        {lastCall && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-green-500/25 bg-green-500/10 px-4 py-3 text-sm">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" />
            <span className="text-gray-200">
              Last call ended · {fmt(lastCall.duration)} ·{" "}
              {lastCall.paid ? `₹${lastCall.paid} charged` : "Free call"}
            </span>
          </div>
        )}

        {/* ----- PRICING CARDS ----- */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {/* Card 1: pehli call free */}
          <div className="rounded-2xl border border-green-500/25 bg-green-500/10 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
              <Gift className="h-5 w-5 text-green-400" />
            </div>
            <p className="mt-3 text-sm font-medium text-green-400">
              Your first call
            </p>
            <p className="mt-1 text-3xl font-bold">Free</p>
            <p className="mt-1 text-sm text-gray-400">
              No payment needed to try it out.
            </p>
          </div>

          {/* Card 2: uske baad har call 20 Rs */}
          <div className="rounded-2xl border border-white/10 bg-[#12121c] p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/15">
              <IndianRupee className="h-5 w-5 text-orange-400" />
            </div>
            <p className="mt-3 text-sm font-medium text-orange-400">
              Every call after that
            </p>
            <p className="mt-1 text-3xl font-bold">₹{CALL_PRICE}</p>
            <p className="mt-1 text-sm text-gray-400">
              Charged once when the call starts.
            </p>
          </div>
        </div>

        {/* ----- RULES LIST ----- */}
        <ul className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-[#12121c] p-5 text-sm text-gray-300">
          <li className="flex items-start gap-3">
            <Timer className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
            You can end the call any time using the red button.
          </li>
          <li className="flex items-start gap-3">
            <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
            Keep at least ₹{CALL_PRICE} in your wallet for paid calls.
          </li>
          <li className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
            Be polite and humble. Rude or abusive behaviour can get you banned.
          </li>
        </ul>
      </main>

      {/* ----- BOTTOM: START CALL BUTTON (sticky, hamesha niche dikhta hai) ----- */}
      <footer className="sticky bottom-0 border-t border-white/10 bg-[#0b0b14]/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur sm:px-6">
        <div className="mx-auto max-w-2xl">
          {!canStart && (
            <p className="mb-2 text-center text-sm text-red-400">
              Not enough balance. Add ₹{cost - wallet} more to start a call.
            </p>
          )}
          <button
            onClick={onStart}
            disabled={!canStart}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-4 text-base font-semibold shadow-lg shadow-purple-600/25 transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Video className="h-5 w-5" />
            Start call · {isFreeCall ? "Free" : `₹${cost}`}
          </button>
        </div>
      </footer>
    </div>
  );
}

/* ============================================================
   SCREEN 2: CALL (timer + end button + dono video)
   ============================================================ */
function CallScreen({ videoSrc, onEnd }) {
  const [connected, setConnected] = useState(false); // fake connecting khatam hua?
  const [seconds, setSeconds] = useState(0); // timer
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [camError, setCamError] = useState(false);

  const localRef = useRef(null); // apne camera ka <video>
  const remoteRef = useRef(null); // samne wale ka <video>
  const streamRef = useRef(null); // camera stream (band karne ke liye)
  const secondsRef = useRef(0); // End dabate waqt latest seconds padhne ke liye

  /* 1) Apna camera chalu karo (screen khulte hi) */
  useEffect(() => {
    let cancelled = false;
    const attach = (stream) => {
      if (cancelled) return stream.getTracks().forEach((t) => t.stop());
      streamRef.current = stream;
      if (localRef.current) localRef.current.srcObject = stream; // face video me dikhega
    };
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(attach)
      .catch(() =>
        // mic nahi mila to sirf video try karo
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then(attach)
          .catch(() => setCamError(true)),
      );

    // Screen band hote hi camera ki light off
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  /* 2) Fake "Connecting..." -> 2 sec baad "Connected" */
  useEffect(() => {
    const t = setTimeout(() => setConnected(true), 2000);
    return () => clearTimeout(t);
  }, []);

  /* 3) Connected hote hi timer chalu (har 1 sec me +1) */
  useEffect(() => {
    if (!connected) return;
    const id = setInterval(() => {
      secondsRef.current += 1;
      setSeconds(secondsRef.current);
    }, 1000);
    return () => clearInterval(id);
  }, [connected]);

  /* 4) Connected hote hi samne wala mp4 play karo */
  useEffect(() => {
    if (connected) remoteRef.current?.play().catch(() => {});
  }, [connected]);

  /* Mic / camera toggle: track.enabled se on-off hota hai */
  const toggleMic = () => {
    streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = !micOn));
    setMicOn(!micOn);
  };
  const toggleCam = () => {
    streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = !camOn));
    setCamOn(!camOn);
  };

  /* End call: camera band karo aur parent ko duration batao -> home screen */
  const handleEnd = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    onEnd(secondsRef.current);
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#0b0b14] text-white">
      {/* ===== SAMNE WALA (poori screen) - tera mp4 ===== */}
      {videoSrc ? (
        <video
          ref={remoteRef}
          src={videoSrc}
          loop
          playsInline
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            connected ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : (
        connected && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center text-gray-400">
            <Film className="h-10 w-10" />
            <p className="text-sm">
              Koi mp4 add nahi hai. Call end karke home par "Add mp4" dabao.
            </p>
          </div>
        )
      )}

      {/* ===== CONNECTING OVERLAY ===== */}
      {!connected && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 bg-[#0b0b14]">
          <div className="relative flex h-28 w-28 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-purple-600/30" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
              <Video className="h-8 w-8" />
            </div>
          </div>
          <p className="flex items-center gap-2 text-lg font-semibold">
            <Loader2 className="h-4 w-4 animate-spin" /> Connecting...
          </p>
        </div>
      )}

      {/* Upar/niche dark gradient taaki timer aur buttons saaf dikhein */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-black/80 to-transparent" />

      {/* ===== TOP: TIMER ===== */}
      <div className="absolute inset-x-0 top-0 z-30 flex justify-center pt-[max(0.75rem,env(safe-area-inset-top))]">
        <span className="flex items-center gap-2 rounded-full bg-black/45 px-4 py-2 text-sm font-semibold tabular-nums backdrop-blur">
          <span
            className={`h-2 w-2 rounded-full ${connected ? "bg-green-400" : "animate-pulse bg-yellow-400"}`}
          />
          {connected ? fmt(seconds) : "Connecting"}
        </span>
      </div>

      {/* ===== APNA FACE (chhota box, neeche right) ===== */}
      <div className="absolute bottom-28 right-3 z-30 aspect-[3/4] w-28 overflow-hidden rounded-2xl border border-white/20 bg-[#1b1b2a] shadow-2xl sm:bottom-32 sm:right-5 sm:w-44 lg:w-56">
        <video
          ref={localRef}
          autoPlay
          muted // apni awaaz khud na sune (echo se bachne ke liye)
          playsInline
          className={`h-full w-full -scale-x-100 object-cover ${camOn && !camError ? "" : "hidden"}`}
        />
        {(!camOn || camError) && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-2 text-center text-gray-400">
            <CameraOff className="h-6 w-6" />
            <span className="text-[11px] leading-tight">
              {camError ? "Camera permission do" : "Camera off"}
            </span>
          </div>
        )}
        <span className="absolute bottom-1.5 left-2 text-[11px] font-medium drop-shadow">
          You
        </span>
      </div>

      {/* ===== BOTTOM: MIC / END CALL / CAMERA ===== */}
      <div className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-center gap-4 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <RoundBtn
          onClick={toggleMic}
          off={!micOn}
          label={micOn ? "Mute" : "Unmute"}
        >
          {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </RoundBtn>

        {/* END CALL - bada red button */}
        <button
          onClick={handleEnd}
          aria-label="End call"
          className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 shadow-lg shadow-red-500/40 transition hover:bg-red-600 active:scale-95"
        >
          <PhoneOff className="h-6 w-6" />
        </button>

        <RoundBtn
          onClick={toggleCam}
          off={!camOn}
          label={camOn ? "Camera off" : "Camera on"}
        >
          {camOn ? (
            <Video className="h-5 w-5" />
          ) : (
            <VideoOff className="h-5 w-5" />
          )}
        </RoundBtn>
      </div>
    </div>
  );
}

/* Chhota round button (mic / camera ke liye) */
function RoundBtn({ onClick, off, label, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-12 w-12 items-center justify-center rounded-full border transition active:scale-95 sm:h-14 sm:w-14 ${
        off
          ? "border-white bg-white text-gray-900"
          : "border-white/10 bg-white/10 text-white backdrop-blur hover:bg-white/20"
      }`}
    >
      {children}
    </button>
  );
}
