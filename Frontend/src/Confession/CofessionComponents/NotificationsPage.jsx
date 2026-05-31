import React from "react";
import {
  Bell,
  MessageCircle,
  Award,
  AtSign,
  UserPlus,
} from "lucide-react";

function NotificationsPage() {

  const notifications = [
    {
      id: 1,
      type: "upvote",
      user: "r/",
      color: "bg-[#6C63FF]",
      text: `Your confession "I paid off my friend's debt secretly" crossed 15,000 upvotes`,
      time: "2 min ago",
      community: "r/Confessions",
      button1: "View post",
      unread: true,
    },

    {
      id: 2,
      type: "comment",
      user: "u/",
      color: "bg-pink-500",
      text: `throwaway_9981 replied to your comment: "This actually made me tear up ngl 😭"`,
      time: "18 min ago",
      community: "r/TrueOffMyChest",
      button1: "Reply",
      button2: "View thread",
      unread: true,
    },

    {
      id: 3,
      type: "award",
      user: "🏅",
      color: "bg-yellow-500",
      text: `Your post received a Gold Award from an anonymous user. Your confession resonated with the community!`,
      time: "45 min ago",
      community: "r/Confessions",
      button1: "See post",
      unread: true,
    },

    {
      id: 4,
      type: "mention",
      user: "u/",
      color: "bg-green-500",
      text: `silent_ghost22 mentioned you: "@you literally described my life exactly"`,
      time: "1 hr ago",
      community: "r/offmychest",
      button1: "View mention",
      button2: "Ignore",
      unread: true,
    },

    {
      id: 5,
      type: "follow",
      user: "u/",
      color: "bg-emerald-400",
      text: `3 anonymous users started following your confessions this week.`,
      time: "3 hr ago",
      community: "",
      unread: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-white">

      {/* TOP HEADER */}
      <div className="border-b border-white/10">

        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">

          {/* TITLE */}
          <div className="flex items-center justify-between flex-wrap gap-4">

            <div className="flex items-center gap-3">

              <h1 className="text-3xl font-bold">
                Notifications
              </h1>

              <div
                className="
                  w-8
                  h-8
                  rounded-full
                  bg-red-500
                  flex
                  items-center
                  justify-center
                  text-sm
                  font-bold
                "
              >
                6
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-6">

              <button
                className="
                  text-[#8B7FFF]
                  hover:text-white
                  transition-all
                  text-sm
                  font-medium
                "
              >
                Mark all read
              </button>

              <button
                className="
                  text-[#8B7FFF]
                  hover:text-white
                  transition-all
                  text-sm
                  font-medium
                "
              >
                Clear all
              </button>
            </div>
          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap gap-3 mt-8">

            {[
              "All",
              "Upvotes",
              "Comments",
              "Mentions",
              "Awards",
              "Follows",
            ].map((item, index) => (

              <button
                key={index}
                className={`
                  px-5
                  h-11
                  rounded-full
                  border
                  text-sm
                  font-medium
                  transition-all
                  ${
                    item === "All"
                      ? "border-[#6C63FF] bg-[#6C63FF]/10 text-[#9B92FF]"
                      : "border-white/10 bg-[#0F1428] text-gray-400 hover:text-white"
                  }
                `}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">

        {/* TODAY */}
        <h2
          className="
            text-sm
            tracking-widest
            uppercase
            text-gray-500
            font-semibold
            mb-6
          "
        >
          Today
        </h2>

        {/* LIST */}
        <div className="space-y-5">

          {notifications.map((item) => (

            <div
              key={item.id}
              className="
                relative
                rounded-3xl
                border
                border-[#6C63FF]/20
                bg-[#0B1020]
                p-5
                md:p-6
                hover:border-[#6C63FF]/40
                transition-all
                overflow-hidden
              "
            >
              {/* UNREAD DOT */}
              {item.unread && (
                <div
                  className="
                    absolute
                    right-5
                    top-6
                    w-3
                    h-3
                    rounded-full
                    bg-[#6C63FF]
                  "
                ></div>
              )}

              <div className="flex gap-4">

                {/* AVATAR */}
                <div className="relative shrink-0">

                  <div
                    className={`
                      w-14
                      h-14
                      rounded-full
                      ${item.color}
                      flex
                      items-center
                      justify-center
                      text-white
                      font-bold
                      text-xl
                    `}
                  >
                    {item.user}
                  </div>

                  {/* SMALL BADGE */}
                  <div
                    className="
                      absolute
                      -bottom-1
                      -right-1
                      w-5
                      h-5
                      rounded-full
                      bg-[#050816]
                      border
                      border-[#050816]
                      flex
                      items-center
                      justify-center
                    "
                  >
                    {item.type === "upvote" && (
                      <Bell
                        size={12}
                        className="text-orange-400"
                      />
                    )}

                    {item.type === "comment" && (
                      <MessageCircle
                        size={12}
                        className="text-blue-400"
                      />
                    )}

                    {item.type === "award" && (
                      <Award
                        size={12}
                        className="text-yellow-400"
                      />
                    )}

                    {item.type === "mention" && (
                      <AtSign
                        size={12}
                        className="text-green-400"
                      />
                    )}

                    {item.type === "follow" && (
                      <UserPlus
                        size={12}
                        className="text-emerald-400"
                      />
                    )}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="flex-1">

                  {/* TEXT */}
                  <h3
                    className="
                      text-base
                      md:text-2xl
                      font-semibold
                      leading-relaxed
                    "
                  >
                    {item.text}
                  </h3>

                  {/* META */}
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      flex-wrap
                      mt-3
                      text-gray-500
                      text-sm
                    "
                  >
                    <span>{item.time}</span>

                    {item.community && (
                      <>
                        <span>•</span>
                        <span>{item.community}</span>
                      </>
                    )}
                  </div>

                  {/* BUTTONS */}
                  {(item.button1 || item.button2) && (

                    <div className="flex flex-wrap gap-3 mt-5">

                      {item.button1 && (
                        <button
                          className="
                            h-11
                            px-5
                            rounded-xl
                            bg-[#6C63FF]
                            hover:bg-[#7A73FF]
                            text-white
                            font-medium
                            transition-all
                          "
                        >
                          {item.button1}
                        </button>
                      )}

                      {item.button2 && (
                        <button
                          className="
                            h-11
                            px-5
                            rounded-xl
                            border
                            border-white/10
                            bg-[#11162A]
                            hover:bg-[#171D35]
                            text-gray-300
                            font-medium
                            transition-all
                          "
                        >
                          {item.button2}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;