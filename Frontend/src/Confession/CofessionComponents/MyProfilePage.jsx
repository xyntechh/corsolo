import React from "react";
import {
  Crown,
  ShieldCheck,
  MapPin,
  Calendar,
  Link2,
  Heart,
  MessageCircle,
  Share2,
  Trophy,
  Flame,
  Star,
  Users,
  ArrowLeft,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import FloatingProfileButton from "./FloatingActionButton";

function MyProfilePage() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {/* TOP NAV */}
      <div
        className="
    sticky
    top-0
    z-50
    border-b
    border-white/10
    bg-[#050816]/90
    backdrop-blur-xl
  "
      >
        <div className="h-14 px-4 flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            {/* BACK BUTTON */}
            <button
              onClick={handleBackClick}
              className="
          w-10
          h-10
          rounded-xl
          border
          border-white/10
          bg-[#11162A]

          flex
          items-center
          justify-center

          hover:bg-[#171D35]
          transition-all
        "
            >
              <ArrowLeft size={20} className="text-white" />
            </button>

            {/* PAGE TITLE */}
            <div>
              <h1 className="font-bold text-lg text-white">My Profile</h1>

              <p className="text-xs text-gray-500">
                Anonymous confession profile
              </p>
            </div>
          </div>

          {/* RIGHT BUTTON */}
          <button
            className="
        px-4
        h-9
        rounded-full
        bg-[#6C63FF]
        text-sm
        font-semibold
        hover:bg-[#7B74FF]
        transition-all
      "
          >
            Edit
          </button>
        </div>
      </div>

      {/* COVER */}
      <div className="relative h-32 bg-gradient-to-r from-[#6C63FF] via-[#2B2F77] to-[#141B34] overflow-hidden">
        {/* PATTERN */}
        <div
          className="
            absolute
            inset-0
            opacity-20
            bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%)]
            bg-[length:20px_20px]
          "
        ></div>
      </div>

      {/* PROFILE SECTION */}
      <div className="px-4 relative">
        {/* PROFILE IMAGE */}
        <div
          className="
            absolute
            -top-12
            left-4
            w-24
            h-24
            rounded-full
            border-4
            border-[#050816]
            bg-[#6C63FF]
            flex
            items-center
            justify-center
            text-4xl
            font-bold
            shadow-2xl
          "
        >
          A
        </div>

        {/* PROFILE INFO */}
        <div className="pt-16">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold">anonymous_soul</h1>

            <div
              className="
                px-2
                py-1
                rounded-full
                bg-yellow-500/10
                border
                border-yellow-500/20
                text-yellow-400
                text-[10px]
                font-semibold
                flex
                items-center
                gap-1
              "
            >
              <Crown size={10} />
              Premium
            </div>

            <div
              className="
                px-2
                py-1
                rounded-full
                bg-blue-500/10
                border
                border-blue-500/20
                text-blue-400
                text-[10px]
                font-semibold
                flex
                items-center
                gap-1
              "
            >
              <ShieldCheck size={10} />
              Verified
            </div>
          </div>

          {/* BIO */}
          <p className="text-gray-400 mt-3 leading-relaxed text-sm">
            I write secrets, pain, and emotional chaos nobody talks about.
          </p>

          {/* META */}
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              India
            </div>

            <div className="flex items-center gap-1">
              <Calendar size={14} />
              Joined Jan 2023
            </div>

            <div className="flex items-center gap-1">
              <Link2 size={14} />
              confesso.vercel.app
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 mt-6">
            <button
              className="
                flex-1
                h-11
                rounded-xl
                bg-[#6C63FF]
                font-semibold
              "
            >
              + Follow
            </button>

            <button
              className="
                flex-1
                h-11
                rounded-xl
                border
                border-white/10
                bg-[#11162A]
                font-semibold
              "
            >
              Message
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="px-4 mt-8">
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              number: "247",
              label: "Confessions",
              icon: <MessageCircle size={16} />,
            },

            {
              number: "48.2k",
              label: "Total Likes",
              icon: <Heart size={16} />,
            },

            {
              number: "3.1k",
              label: "Replies",
              icon: <Share2 size={16} />,
            },

            {
              number: "1.4k",
              label: "Followers",
              icon: <Users size={16} />,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="
                rounded-2xl
                border
                border-white/10
                bg-[#0B1020]
                p-4
              "
            >
              <div className="flex items-center justify-between">
                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-[#141B34]
                    flex
                    items-center
                    justify-center
                    text-[#8B7FFF]
                  "
                >
                  {item.icon}
                </div>

                <span className="text-green-400 text-xs">+12%</span>
              </div>

              <h2 className="text-2xl font-bold mt-4">{item.number}</h2>

              <p className="text-gray-500 text-sm mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ACHIEVEMENTS */}
      <div className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Achievements</h2>

          <span className="text-[#8B7FFF] text-sm">8/15</span>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[<Trophy />, <Flame />, <Star />, <Crown />].map((icon, index) => (
            <div
              key={index}
              className="
                aspect-square
                rounded-2xl
                border
                border-white/10
                bg-[#0B1020]
                flex
                items-center
                justify-center
                text-[#8B7FFF]
              "
            >
              {icon}
            </div>
          ))}
        </div>
      </div>

      {/* POSTS */}
      <div className="px-4 mt-8 pb-32">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg">Confessions</h2>

          <button
            className="
              px-4
              h-9
              rounded-full
              bg-[#11162A]
              border
              border-white/10
              text-sm
            "
          >
            Latest
          </button>
        </div>

        {/* POST CARD */}
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="
              rounded-3xl
              border
              border-yellow-500/20
              bg-[#0B1020]
              p-5
              mb-5
            "
          >
            {/* TAGS */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="
                  px-3
                  py-1
                  rounded-full
                  bg-[#141B34]
                  text-[#8B7FFF]
                  text-xs
                "
              >
                friendship
              </span>

              <span
                className="
                  px-3
                  py-1
                  rounded-full
                  bg-red-500/10
                  text-red-400
                  text-xs
                "
              >
                EMOTIONAL
              </span>
            </div>

            {/* TEXT */}
            <h3 className="text-lg font-semibold leading-relaxed mt-4">
              I secretly paid off my best friend's student debt and never told
              him. He thanked a "mysterious donor" at his wedding. I cried.
            </h3>

            {/* META */}
            <div className="flex items-center gap-5 mt-5 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <Heart size={16} />
                14.2k
              </div>

              <div className="flex items-center gap-2">
                <MessageCircle size={16} />
                847
              </div>

              <div className="flex items-center gap-2">
                <Share2 size={16} />
                Share
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FLOATING BUTTON */}
      <FloatingProfileButton />
    </div>
  );
}

export default MyProfilePage;
