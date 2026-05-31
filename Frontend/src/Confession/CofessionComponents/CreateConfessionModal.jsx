import React, { useState } from "react";
import {
  X,
  Image as ImageIcon,
  AlignLeft,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function CreateConfessionModal() {
  const [title, setTitle] = useState("");
  const [confession, setConfession] = useState("");
  const [community, setCommunity] = useState("");
  const [postType, setPostType] = useState("text");


  const navigate = useNavigate();

  const handleConfessClick = () => {
    navigate("/confession");
  };

  const handlechat = () =>{
    navigate("/https://www.corsolo.com/home");
  }

  return (
    <div
      className="
        min-h-screen
        w-full
        bg-[#050816]
        flex
        items-center
        justify-center
        px-4
        py-10
      "
    >
      {/* MODAL */}
      <div
        className="
          w-full
          max-w-3xl
          rounded-3xl
          border
          border-white/10
          bg-[#0B1020]
          overflow-hidden
          shadow-2xl
        "
      >
        {/* HEADER */}
        <div
          className="
            flex
            items-center
            justify-between
            px-5
            md:px-7
            py-5
            border-b
            border-white/10
          "
        >
          {/* LEFT */}
          <div className="flex items-center gap-3">

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-[#6C63FF]
                flex
                items-center
                justify-center
                text-lg
              "
            >
              🤫
            </div>

            <h2
              className="
                text-white
                text-lg
                md:text-2xl
                font-bold
              "
            >
              Post a confession
            </h2>
          </div>

          {/* CLOSE BUTTON */}
          <button
            onClick={handleConfessClick}
            className="
              w-11
              h-11
              rounded-xl
              border
              border-white/10
              flex
              items-center
              justify-center
              text-gray-400
              hover:bg-white/5
              hover:text-white
              transition-all
            "
          >
            <X size={20} />
          </button>
        </div>

        

        {/* FORM */}
        <div className="px-5 md:px-7 py-7 space-y-7">

          {/* COMMUNITY */}
          <div>

            <label
              className="
                text-xs
                uppercase
                tracking-widest
                text-[#8B7FFF]
                font-semibold
                block
                mb-3
              "
            >
              Choose Community *
            </label>

            <select
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
              className="
                w-full
                h-14
                rounded-xl
                bg-[#11162A]
                border
                border-white/10
                px-4
                text-white
                outline-none
                focus:border-[#6C63FF]
                transition-all
              "
            >
              <option value="">
                Select a community...
              </option>

              <option value="love">
                Love Confessions
              </option>

              <option value="college">
                College Secrets
              </option>

              <option value="dark">
                Dark Secrets
              </option>
            </select>
          </div>

          {/* TITLE */}
          <div>

            <label
              className="
                text-xs
                uppercase
                tracking-widest
                text-[#8B7FFF]
                font-semibold
                block
                mb-3
              "
            >
              Title *
            </label>

            <div className="relative">

              <input
                type="text"
                maxLength={200}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your confession about?"
                className="
                  w-full
                  h-14
                  rounded-xl
                  bg-[#11162A]
                  border
                  border-white/10
                  px-4
                  pr-20
                  text-white
                  placeholder:text-gray-500
                  outline-none
                  focus:border-[#6C63FF]
                  transition-all
                "
              />

              <span
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-xs
                  text-gray-500
                "
              >
                {title.length}/200
              </span>
            </div>
          </div>

          {/* CONFESSION */}
          <div>

            <label
              className="
                text-xs
                uppercase
                tracking-widest
                text-[#8B7FFF]
                font-semibold
                block
                mb-3
              "
            >
              Confession *
            </label>

            <div className="relative">

              <textarea
                rows={7}
                maxLength={2000}
                value={confession}
                onChange={(e) =>
                  setConfession(e.target.value)
                }
                placeholder="Share your truth anonymously..."
                className="
                  w-full
                  rounded-2xl
                  bg-[#11162A]
                  border
                  border-white/10
                  px-4
                  py-4
                  text-white
                  placeholder:text-gray-500
                  outline-none
                  resize-none
                  focus:border-[#6C63FF]
                  transition-all
                "
              />

              <span
                className="
                  absolute
                  right-4
                  bottom-4
                  text-xs
                  text-gray-500
                "
              >
                {confession.length}/2000
              </span>
            </div>
          </div>

          {/* POST TYPE */}
          <div>

            <label
              className="
                text-xs
                uppercase
                tracking-widest
                text-[#8B7FFF]
                font-semibold
                block
                mb-4
              "
            >
              Post Type
            </label>

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-4
              "
            >
              {/* TEXT */}
              <button
                onClick={() => setPostType("text")}
                className={`
                  rounded-2xl
                  border
                  p-5
                  text-left
                  transition-all
                  ${
                    postType === "text"
                      ? "border-[#6C63FF] bg-[#6C63FF]/10"
                      : "border-white/10 bg-[#0F1428]"
                  }
                `}
              >
                <div className="flex items-start gap-4">

                  <div
                    className="
                      w-11
                      h-11
                      rounded-xl
                      bg-[#1A2140]
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <AlignLeft
                      size={20}
                      className="text-[#8B7FFF]"
                    />
                  </div>

                  <div>
                    <h3 className="text-white font-semibold">
                      Text only
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Just words, no media
                    </p>
                  </div>
                </div>
              </button>

              {/* IMAGE */}
              <button
                onClick={() => setPostType("image")}
                className={`
                  rounded-2xl
                  border
                  p-5
                  text-left
                  transition-all
                  ${
                    postType === "image"
                      ? "border-[#6C63FF] bg-[#6C63FF]/10"
                      : "border-white/10 bg-[#0F1428]"
                  }
                `}
              >
                <div className="flex items-start gap-4">

                  <div
                    className="
                      w-11
                      h-11
                      rounded-xl
                      bg-[#1A2140]
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <ImageIcon
                      size={20}
                      className="text-[#8B7FFF]"
                    />
                  </div>

                  <div>
                    <h3 className="text-white font-semibold">
                      With image
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Add a photo or screenshot
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          className="
            px-5
            md:px-7
            py-5
            border-t
            border-white/10
            flex
            items-center
            justify-end
            gap-4
            flex-wrap
          "
        >

          <button
            className="
              h-12
              px-6
              rounded-xl
              bg-[#6C63FF]
              hover:bg-[#7B73FF]
              text-white
              font-semibold
              flex
              items-center
              gap-2
              transition-all
              shadow-lg
              shadow-[#6C63FF]/20
            "
          >
            Post Confession
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateConfessionModal;