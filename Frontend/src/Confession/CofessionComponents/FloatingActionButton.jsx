import React, { useState } from "react";
import {
  Crown,
  SquarePen,
  Plus,
  X,
} from "lucide-react";

function FloatingActionButton() {

  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">

      {/* MENU */}
      <div
        className={`
          flex
          flex-col
          items-end
          gap-3

          transition-all
          duration-300

          ${
            open
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-5 pointer-events-none"
          }
        `}
      >

        {/* PREMIUM BUTTON */}
        <button
          className="
            group

            flex
            items-center
            gap-3

            h-14
            pl-3
            pr-5

            rounded-2xl

            bg-[#0B1020]
            border
            border-yellow-500/20

            shadow-xl
            shadow-black/30

            hover:bg-[#141B34]
            hover:border-yellow-400/40

            transition-all
            duration-300
          "
        >
          {/* ICON */}
          <div
            className="
              w-10
              h-10
              rounded-xl

              bg-yellow-500/10

              flex
              items-center
              justify-center

              flex-shrink-0
            "
          >
            <Crown
              size={20}
              className="
                text-yellow-400
                group-hover:scale-110
                transition-all
                duration-300
              "
            />
          </div>

          {/* TEXT */}
          <div className="text-left">

            <p className="text-white text-sm font-bold">
              Premium
            </p>

            <p className="text-[11px] text-gray-500">
              Unlock exclusive features
            </p>
          </div>
        </button>

        {/* CREATE CONFESSION */}
        <button
          className="
            group

            flex
            items-center
            gap-3

            h-14
            pl-3
            pr-5

            rounded-2xl

            bg-[#0B1020]
            border
            border-[#6C63FF]/20

            shadow-xl
            shadow-black/30

            hover:bg-[#141B34]
            hover:border-[#6C63FF]/40

            transition-all
            duration-300
          "
        >
          {/* ICON */}
          <div
            className="
              w-10
              h-10
              rounded-xl

              bg-[#6C63FF]/10

              flex
              items-center
              justify-center

              flex-shrink-0
            "
          >
            <SquarePen
              size={20}
              className="
                text-[#8B7FFF]
                group-hover:scale-110
                transition-all
                duration-300
              "
            />
          </div>

          {/* TEXT */}
          <div className="text-left">

            <p className="text-white text-sm font-bold">
              New Confession
            </p>

            <p className="text-[11px] text-gray-500">
              Share anonymously
            </p>
          </div>
        </button>
      </div>

      {/* MAIN FAB BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
        className={`
          relative

          w-16
          h-16

          rounded-full

          flex
          items-center
          justify-center

          shadow-2xl

          transition-all
          duration-300

          active:scale-90

          ${
            open
              ? "bg-red-500 rotate-90 shadow-red-500/30"
              : "bg-[#6C63FF] rotate-0 shadow-[#6C63FF]/40"
          }
        `}
      >

        {/* PLUS ICON */}
        <Plus
          size={30}
          className={`
            absolute
            text-white

            transition-all
            duration-300

            ${
              open
                ? "opacity-0 rotate-90 scale-50"
                : "opacity-100 rotate-0 scale-100"
            }
          `}
        />

        {/* CLOSE ICON */}
        <X
          size={28}
          className={`
            absolute
            text-white

            transition-all
            duration-300

            ${
              open
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 -rotate-90 scale-50"
            }
          `}
        />
      </button>
    </div>
  );
}

export default FloatingActionButton;