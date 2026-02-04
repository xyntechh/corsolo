import React, { useEffect } from "react";
import { HeartCrack, Heart, Sparkles } from "lucide-react";

function ConfirmEndChatModal({ open, onClose, onEndChat, onNextChat }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center px-4 z-50">

      {/* Modal Card */}
      <div className="bg-gradient-to-br from-purple-950/95 to-purple-900/95 border-2 border-pink-500/30 rounded-3xl p-6 sm:p-8 w-full max-w-sm text-center shadow-2xl animate-popup relative overflow-hidden">
        
        {/* Animated Background Glow */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-4 right-4 w-20 h-20 bg-pink-500/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
        </div>

        {/* Icon with Animation */}
        <div className="relative z-10 mb-5">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center border-2 border-pink-500/40 shadow-lg">
            <HeartCrack className="text-pink-400 animate-pulse" size={40} strokeWidth={2.5} />
          </div>
          <Sparkles className="absolute top-0 right-1/3 w-5 h-5 text-yellow-300 animate-bounce" style={{ animationDuration: '1.5s' }} />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-white mb-2 tracking-wide relative z-10">
          End This Chat?
        </h2>

        {/* Subtitle */}
        <p className="text-purple-200 text-sm mb-6 leading-relaxed relative z-10">
          Want to end this conversation or find your next match?
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3 mb-4 relative z-10">
          <button
            onClick={onNextChat}
            className="w-full px-6 py-3 rounded-full font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-black hover:from-green-400 hover:to-emerald-400 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5 fill-black" />
            <span>Find Next Match</span>
          </button>

          <button
            onClick={onEndChat}
            className="w-full px-6 py-3 rounded-full font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-400 hover:to-pink-400 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <HeartCrack className="w-5 h-5" />
            <span>End Chat</span>
          </button>
        </div>

        {/* Cancel */}
        <button
          onClick={onClose}
          className="text-purple-300 text-sm font-medium hover:text-white transition-all relative z-10 underline underline-offset-2"
        >
          Maybe Later
        </button>
      </div>

      {/* Animation */}
      <style jsx>{`
        .animate-popup {
          animation: popup 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes popup {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default ConfirmEndChatModal;