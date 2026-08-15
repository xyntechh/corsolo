import React from "react";
import { X } from "lucide-react";

export default function SettingsModal({
  showSettingsModal,
  setshowSettingsModal,
}) {
  return (
    <div
      className={`
 lg:flex
 inset-0
items-center justify-center
transition-all duration-300
z-50
w-full

${
  showSettingsModal
    ? "opacity-100 visible"
    : "opacity-0 invisible pointer-events-none"
}
`}
    >
      {/* Panel: bottom sheet on mobile, centered card on desktop */}
      <div
        className="
          relative w-full bg-neutral-900 text-neutral-100 shadow-md
          flex flex-col
          rounded-t-md sm:rounded-md
          h-[70vh] sm:h-[60vh]
          sm:max-w-3xl
          animate-[slideUp_0.28s_ease-out]
          sm:animate-[fadeIn_0.2s_ease-out]
        "
      >
        {/* drag handle, mobile only */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-1">
          <div className="w-10 h-1 rounded-full bg-neutral-700" />
        </div>

        {/* Header */}
        <div className="flex  items-center justify-between px-5 sm:px-7 pt-3 sm:pt-6 pb-3 sm:pb-4 shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold">Settings</h2>
          <button onClick={() => setshowSettingsModal(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Empty body — fill this in later */}
        <div className="flex-1 border-t border-neutral-800" />
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}