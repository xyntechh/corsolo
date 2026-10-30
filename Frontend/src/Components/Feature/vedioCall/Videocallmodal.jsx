import { useEffect } from "react";
// lucide-react icons (npm i lucide-react)
import { Video, X, Coins, Timer, ShieldCheck, Check } from "lucide-react";
import { useUser } from "../../../Context/UserContext.jsx";

/**
 * VideoCallModal  (SaaS style)
 * ------------------------------------------------------------
 * Props:
 *  - open           : boolean  -> popup dikhana hai ya nahi
 *  - onClose        : function -> popup band karne ke liye (X, Cancel, bahar click, Esc)
 *  - onStart        : function -> "Start Call" dabane par chalega (apna call logic yahan lagao)
 *  - balance        : number   -> user ke paas kitne coins hain
 *  - freeSeconds    : number (default 30) -> shuru ke free seconds
 *  - secondsPerCoin : number (default 12) -> free ke baad kitne second ka 1 coin
 *  - minCoins       : number (default 1)  -> call start karne ke liye minimum coins
 */
export default function VideoCallModal({
  open,
  onClose,
  onStart,
  balance = 0,
  freeSeconds = 30,
  secondsPerCoin = 12,
  minCoins = 1,
}) {
  const { user } = useUser();

  console.log("user", user);

  // Coins kam hain to Start Call disable hoga
  const notEnoughCoins = balance < minCoins;

  // Esc se close + popup khula ho to peeche ka page scroll lock
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    // ---------- OVERLAY ----------
    // Mobile: neeche se bottom-sheet | Desktop: screen ke beech me
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="vc-title"
    >
      {/* ---------- CARD ----------
          NOTE: icon ab card ke ANDAR hai, isliye cut nahi hoga.
          Card flex-col hai: header fixed, body scroll hoti hai, footer hamesha dikhta hai. */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92dvh] w-full flex-col rounded-t-2xl border border-white/10 bg-[#12121c] shadow-2xl sm:max-w-[440px] sm:rounded-2xl"
      >
        {/* ===== HEADER ===== */}
        <div className="flex items-start gap-3.5 px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
          {/* Video icon tile (gradient) */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-purple-600/30">
            <Video className="h-5 w-5 text-white" />
          </div>

          <div className="min-w-0 flex-1">
            <h2
              id="vc-title"
              className="text-lg font-semibold leading-tight text-white"
            >
              Start a video call
            </h2>
            <p className="mt-0.5 text-sm text-gray-400">
              Review the pricing before you connect.
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ===== BODY (chhoti screen par yahi scroll hota hai) ===== */}
        <div className="flex-1 space-y-4 overflow-y-auto border-t border-white/10 px-5 py-5 sm:px-6">
          {/* --- Pricing timeline: 2 blocks side by side --- */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Block 1: Free */}
            <div className="rounded-xl border border-green-500/25 bg-green-500/10 p-3.5">
              <p className="text-xs font-medium text-green-400">
                First {freeSeconds} seconds
              </p>
              <p className="mt-1 text-xl font-semibold text-white">Free</p>
              <p className="mt-0.5 text-xs text-gray-400">No coins used</p>
            </div>

            {/* Block 2: Paid */}
            <div className="rounded-xl border border-white/10 bg-[#1b1b2a] p-3.5">
              <p className="text-xs font-medium text-orange-400">
                After {freeSeconds} seconds
              </p>
              <p className="mt-1 text-xl font-semibold text-white">1 coin</p>
              <p className="mt-0.5 text-xs text-gray-400">
                every {secondsPerCoin} seconds
              </p>
            </div>
          </div>

          {/* --- Checklist (simple rows, bina heavy boxes ke) --- */}
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5 text-gray-300">
              <Timer className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
              <span>
                Charges apply on every call after the free {freeSeconds}{" "}
                seconds.
              </span>
            </li>
            <li className="flex items-start gap-2.5 text-gray-300">
              <Coins className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
              <span>You need at least {minCoins} coin to start a call.</span>
            </li>
            <li className="flex items-start gap-2.5 text-gray-300">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
              <span>
                Be polite and humble. Rude or abusive behaviour can get you
                banned.
              </span>
            </li>
          </ul>

          {/* --- Balance row --- */}
          <div
            className={`flex items-center justify-between rounded-xl border px-3.5 py-3 text-sm ${
              notEnoughCoins
                ? "border-red-500/30 bg-red-500/10"
                : "border-white/10 bg-[#1b1b2a]"
            }`}
          >
            <span className="text-gray-400">Your balance</span>
            <span className="flex items-center gap-1.5 font-semibold text-white">
              <Coins className="h-4 w-4 text-orange-400" />
              {user?.coin}
              {/* Coins sahi hain to green tick */}
              {!notEnoughCoins && <Check className="h-4 w-4 text-green-400" />}
            </span>
          </div>

          {/* Coins kam hain to error message */}
          {notEnoughCoins && (
            <p className="text-sm text-red-400">
              Not enough coins. Add at least {minCoins} coin to start a video
              call.
            </p>
          )}
        </div>

        {/* ===== FOOTER (hamesha niche dikhta hai) =====
            Mobile: buttons upar-niche (Start Call upar) | Desktop: side by side */}
        <div className="flex flex-col-reverse gap-2.5 border-t border-white/10 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end sm:px-6">
          {/* Cancel */}
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5 sm:py-2.5"
          >
            Cancel
          </button>

          {/* Start Call (primary) */}
          <button
            onClick={onStart}
            disabled={notEnoughCoins}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-600/20 transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none sm:py-2.5"
          >
            <Video className="h-4 w-4" />
            Start call
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   USAGE EXAMPLE
   ============================================================

   import { useState } from "react";
   import VideoCallModal from "./VideoCallModal";

   export default function Home() {
     const [showCall, setShowCall] = useState(false);
     const coins = 8900; // apne user data se lao

     return (
       <>
         <button onClick={() => setShowCall(true)}>Video Call</button>

         <VideoCallModal
           open={showCall}
           onClose={() => setShowCall(false)}
           balance={coins}
           onStart={() => {
             setShowCall(false);
             // yahan video call start karne ka logic
           }}
         />
       </>
     );
   }
*/
