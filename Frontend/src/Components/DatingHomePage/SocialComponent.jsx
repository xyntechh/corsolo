import { Instagram } from "lucide-react";
import { FaXTwitter, FaTelegram } from "react-icons/fa6";

export default function SocialComponent() {
  const socials = [
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: FaXTwitter, href: "https://x.com", label: "X" },
    { icon: FaTelegram, href: "https://t.me", label: "Telegram" },
  ];

  return (
    <div
      className="
        absolute inset-0 z-20
        flex flex-col items-center justify-start
        gap-3 sm:gap-3
        sm:inset-x-0 sm:top-0 sm:bottom-auto
        sm:justify-start sm:pt-4 sm:pb-3
        pointer-events-none
      "
    >
      {/* Logo badge */}
      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-orange-400 via-fuchsia-500 to-purple-700 shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center justify-center pointer-events-auto">
        <svg viewBox="0 0 64 64" className="h-6 w-6 sm:h-7 sm:w-7" fill="none">
          <path
            d="M32 10c-9 0-16 6-16 14 0 3 1 5.5 2.5 7.5-1 2-2.5 4-4.5 5.5 3 1 6-.3 8-2 2.7 1.6 6.2 2.5 10 2.5s7.3-.9 10-2.5c2 1.7 5 3 8 2-2-1.5-3.5-3.5-4.5-5.5C47 29.5 48 27 48 24c0-8-7-14-16-14z"
            fill="url(#faceGrad)"
          />
          <path d="M20 22c-3-2-7-3-9-1 1 3 4 5 7 5z" fill="#fb923c" />
          <path d="M44 22c3-2 7-3 9-1-1 3-4 5-7 5z" fill="#fb923c" />
          <rect x="19" y="26" width="26" height="9" rx="4.5" fill="#0f0f13" />
          <circle cx="25.5" cy="30.5" r="2.4" fill="#fff" />
          <circle cx="38.5" cy="30.5" r="2.4" fill="#fff" />
          <defs>
            <linearGradient id="faceGrad" x1="16" y1="10" x2="48" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fb923c" />
              <stop offset="1" stopColor="#a21caf" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Wordmark */}
      <h1 className="font-extrabold italic text-lg sm:text-2xl tracking-tight pointer-events-auto">
        <span className="text-white">Corsolo</span>
        <span className="text-orange-400">.com</span>
      </h1>

      {/* Social icons */}
      <div className="flex items-center gap-3 sm:gap-4 pointer-events-auto">
        {socials.map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#1c1c22] flex items-center justify-center text-white hover:bg-[#26262e] hover:scale-105 transition-all duration-200"
          >
            <Icon className="h-4 w-4 sm:h-4 sm:w-4" />
          </a>
        ))}
      </div>
    </div>
  );
}