import React from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
} from "lucide-react";

function ConfessionCard() {
  return (
    <div
      className="
        w-full
        max-w-4xl
        mx-auto
        rounded-3xl
        overflow-hidden
        border
        border-white/10
        bg-[#0B1020]
        shadow-2xl
        hover:border-[#6C63FF]/40
        transition-all
        duration-300
      "
    >
      {/* TOP HEADER */}
      <div className="p-5 pb-4">

        <div className="flex items-start justify-between gap-4">

          {/* LEFT */}
          <div className="flex items-start gap-3">

            {/* Logo */}
            <div
              className="
                w-9
                h-9
                rounded-xl
                bg-[#6C63FF]
                flex
                items-center
                justify-center
                text-white
                font-bold
                text-sm
                shrink-0
              "
            >
              r/
            </div>

            {/* INFO */}
            <div>

              <div className="flex flex-wrap items-center gap-2 text-sm">

                <span className="text-white font-semibold">
                  Ayesha
                </span>

                <span className="text-gray-500">
                  • 3h ago
                </span>
              </div>

              {/* TITLE */}
              <h2
                className="
                  text-white
                  text-xl
                  md:text-3xl
                  font-bold
                  leading-snug
                  mt-4
                "
              >
                I secretly paid off my best friend's student debt
                and never told him. He thanked a "mysterious donor"
                at his wedding. I cried.
              </h2>

              {/* CATEGORY */}
              <div className="mt-4">
                <span
                  className="
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-semibold
                    bg-red-500/10
                    text-red-400
                    border
                    border-red-500/20
                    uppercase
                    tracking-wide
                  "
                >
                  Emotional
                </span>
              </div>
            </div>
          </div>

          {/* JOIN BUTTON */}
          <button
            className="
              shrink-0
              px-5
              h-10
              rounded-full
              border
              border-[#6C63FF]
              text-[#8B7FFF]
              font-semibold
              hover:bg-[#6C63FF]
              hover:text-white
              transition-all
            "
          >
            follow
          </button>
        </div>
      </div>

      {/* IMAGE */}
      <div className="w-full h-[240px] md:h-[420px] overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop"
          alt="confession"
          className="
            w-full
            h-full
            object-cover
            hover:scale-105
            transition-transform
            duration-500
          "
        />
      </div>

      {/* BOTTOM SECTION */}
      <div className="p-5">

        {/* TAGS */}
        <div className="flex flex-wrap gap-3">

          <span
            className="
              px-4
              py-1.5
              rounded-full
              bg-[#141B34]
              border
              border-[#6C63FF]/20
              text-[#9D94FF]
              text-sm
            "
          >
            friendship
          </span>

          <span
            className="
              px-4
              py-1.5
              rounded-full
              bg-[#141B34]
              border
              border-[#6C63FF]/20
              text-[#9D94FF]
              text-sm
            "
          >
            money
          </span>

          <span
            className="
              px-4
              py-1.5
              rounded-full
              bg-[#141B34]
              border
              border-[#6C63FF]/20
              text-[#9D94FF]
              text-sm
            "
          >
            anonymous
          </span>
        </div>

        {/* ACTIONS */}
        <div
          className="
            flex
            items-center
            justify-between
            mt-6
            flex-wrap
            gap-4
          "
        >
          {/* LEFT ACTIONS */}
          <div className="flex items-center gap-3 flex-wrap">

            {/* LIKE */}
            <button
              className="
                flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                bg-[#11162A]
                border
                border-white/5
                hover:border-pink-500/30
                hover:text-pink-400
                transition-all
                text-white
              "
            >
              <Heart size={18} />
              <span className="text-sm font-medium">
                14.2k
              </span>
            </button>

            {/* COMMENTS */}
            <button
              className="
                flex
                items-center
                gap-2
                text-white
                px-4
                py-2
                rounded-full
                bg-[#11162A]
                border
                border-white/5
                hover:border-blue-500/30
                hover:text-blue-400
                transition-all
              "
            >
              <MessageCircle size={18} />
              <span className="text-sm font-medium">
                847
              </span>
            </button>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3">

            {/* SHARE */}
            <button
              className="
                flex
                items-center
                gap-2
                text-white
                px-4
                py-2
                rounded-full
                bg-[#11162A]
                border
                border-white/5
                hover:border-white/20
                hover:text-white
                transition-all
              "
            >
              <Share2 size={18} />
              <span className="text-sm">
                Share
              </span>
            </button>

            {/* SAVE */}
            <button
              className="
                flex
                items-center
                gap-2
                text-white
                px-4
                py-2
                rounded-full
                bg-[#11162A]
                border
                border-white/5
                hover:border-yellow-500/30
                hover:text-yellow-400
                transition-all
              "
            >
              <Bookmark size={18} />
              <span className="text-sm">
                Save
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfessionCard;