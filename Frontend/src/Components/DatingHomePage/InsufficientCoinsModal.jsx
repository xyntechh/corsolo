import { useState, useEffect } from "react";
import { X, Gem, ShoppingBag } from "lucide-react";

/**
 * Reusable "not enough coins" modal.
 *
 * Usage:
 *   const [showInsufficientCoins, setShowInsufficientCoins] = useState(false);
 *   const [requiredCoins, setRequiredCoins] = useState(10);
 *
 *   {showInsufficientCoins && (
 *     <InsufficientCoinsModal
 *       requiredCoins={requiredCoins}
 *       currentCoins={user?.coins}
 *       onClose={() => setShowInsufficientCoins(false)}
 *       onBuyCoins={() => {
 *         setShowInsufficientCoins(false);
 *         setShowPremium(true); // open your coins/premium modal
 *       }}
 *     />
 *   )}
 */
export default function InsufficientCoinsModal({
  requiredCoins = 10,
  currentCoins = 0,
  onClose,
  onBuyCoins,
  gender
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm transition-opacity duration-300 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-sm rounded-md border border-purple-900/40 bg-[#15121c] shadow-2xl transition-all duration-300 ${
          mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="relative px-5 pt-5 pb-1 text-center">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 text-neutral-500 hover:text-white transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>

          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-md bg-purple-500/10 border border-purple-500/20">
            <Gem className="w-6 h-6 text-purple-400" />
          </div>

          <h2 className="text-white font-bold text-base sm:text-lg">
            Not Enough Coins
          </h2>
          <p className="mt-1.5 text-[13px] sm:text-sm text-neutral-400 leading-relaxed">
            You need at least{" "}
            <span className="font-semibold text-purple-300">
              {requiredCoins} coins
            </span>{" "}
            to start chat with {gender}. You currently have{" "}
            <span className="font-semibold text-white">{currentCoins}</span>.
          </p>
        </div>

        <div className="flex flex-col gap-2 px-5 pt-4 pb-5">
          <button
            onClick={onBuyCoins}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-purple-500 hover:bg-purple-600 active:bg-purple-700 py-2.5 text-sm font-semibold text-white transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Buy Coins
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-md border border-white/10 py-2.5 text-sm font-medium text-neutral-400 hover:bg-white/5 transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}