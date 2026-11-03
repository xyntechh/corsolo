import { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  FileText,
  ImageOff,
  UserCheck,
  MessageSquareOff,
  Ban,
  Lock,
  Flag,
} from "lucide-react";

const STORAGE_KEY = "image_sharing_notice_seen";

const RULES = [
  {
    icon: ImageOff,
    title: "No adult or nude images",
    text: "Sharing adult, nude or sexually explicit images is strictly prohibited.",
  },
  {
    icon: UserCheck,
    title: "18+ only",
    text: "Only users aged 18 and above are allowed on this site.",
  },
  {
    icon: MessageSquareOff,
    title: "No hate speech",
    text: "Hate speech, abuse, harassment and bullying are not tolerated.",
  },
  {
    icon: Lock,
    title: "Respect privacy",
    text: "Do not share anyone's personal info or photos without consent.",
  },
  {
    icon: Flag,
    title: "No illegal or harmful content",
    text: "Spam, scams, threats, violence and illegal content are not allowed.",
  },
];

export default function ImportantNoticeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notice-title"
    >
      {/* Scrollbar hidden (scroll still works if screen is very small) */}
      <div
        className="
          w-full max-w-[22rem] sm:max-w-xl lg:max-w-3xl
          max-h-[94vh] overflow-y-auto
          [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
          bg-[#1c1c24] rounded-xl sm:rounded-2xl
          p-4 sm:p-6 lg:p-8 shadow-2xl
        "
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-xl bg-purple-600/20 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
          </div>
          <h2
            id="notice-title"
            className="text-white text-lg sm:text-2xl lg:text-3xl font-bold leading-tight"
          >
            Strict Policy Notice
          </h2>
        </div>
        <p className="text-gray-400 text-xs sm:text-sm lg:text-base mt-2 mb-3 sm:mb-5">
          We have a strict policy to keep this platform safe for everyone.
          Please read and follow these rules.
        </p>

        {/* Rules */}
        <div className="bg-[#26262f] rounded-xl p-3 sm:p-4 lg:p-5 mb-3 sm:mb-4">
          <p className="text-white font-semibold text-sm sm:text-base mb-2 sm:mb-3">
            Community Rules
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
            {RULES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-purple-600/20 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-xs sm:text-sm lg:text-base font-semibold">
                    {title}
                  </p>
                  <p className="text-gray-400 text-[11px] sm:text-xs lg:text-sm leading-snug sm:leading-relaxed">
                    {text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Ban warning */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 sm:p-4 mb-3 sm:mb-5">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <Ban className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 shrink-0" />
            <p className="text-red-400 font-semibold text-xs sm:text-sm lg:text-base">
              Violation = Permanent Ban
            </p>
          </div>
          <p className="text-gray-300 text-xs sm:text-sm lg:text-base leading-snug sm:leading-relaxed">
            If you are found breaking any of these rules, we may{" "}
            <span className="text-white font-semibold">
              permanently ban your account and IP address
            </span>{" "}
            without prior warning.
          </p>
        </div>

        {/* Footer: links + button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex gap-2">
            <a
              href="/privacy"
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-[#3a3a44] text-gray-300 hover:bg-[#454550] transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              Privacy
            </a>
            <a
              href="/policy"
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-[#3a3a44] text-gray-300 hover:bg-[#454550] transition-colors"
            >
              <FileText className="w-4 h-4" />
              Our Policy
            </a>
          </div>

          <button
            onClick={handleClose}
            className="w-full sm:w-auto bg-purple-600 text-white text-sm sm:text-base font-semibold px-6 py-2.5 rounded-xl hover:bg-purple-700 transition-colors"
          >
            I understand
          </button>
        </div>
      </div>
    </div>
  );
}