import { Instagram } from "lucide-react";
import { FaXTwitter, FaTelegram } from "react-icons/fa6";

export default function SocialComponent() {
  const socials = [
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: FaXTwitter, href: "https://x.com", label: "X" },
    { icon: FaTelegram, href: "https://t.me/corsoloo", label: "Telegram" },
  ];

  return (
    <div
      className="
        absolute top-20 left-0 right-0 z-10
        flex sm:hidden
        flex-col items-center justify-center
        gap-2
        pt-3 pb-2
        pointer-events-none
        opacity-80
      "
    >
      {/* Logo badge */}
      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400/70 via-fuchsia-500/70 to-purple-700/70 shadow-[0_0_10px_rgba(168,85,247,0.2)] flex items-center justify-center pointer-events-auto">
        <svg viewBox="0 0 64 64" className="h-6 w-6 opacity-90" fill="none">
          <path
            d="M32 10c-9 0-16 6-16 14 0 3 1 5.5 2.5 7.5-1 2-2.5 4-4.5 5.5 3 1 6-.3 8-2 2.7 1.6 6.2 2.5 10 2.5s7.3-.9 10-2.5c2 1.7 5 3 8 2-2-1.5-3.5-3.5-4.5-5.5C47 29.5 48 27 48 24c0-8-7-14-16-14z"
            fill="url(#faceGrad)"
          />
          <path d="M20 22c-3-2-7-3-9-1 1 3 4 5 7 5z" fill="#fb923c" opacity="0.85" />
          <path d="M44 22c3-2 7-3 9-1-1 3-4 5-7 5z" fill="#fb923c" opacity="0.85" />
          <rect x="19" y="26" width="26" height="9" rx="4.5" fill="#0f0f13" />
          <circle cx="25.5" cy="30.5" r="2.4" fill="#fff" opacity="0.85" />
          <circle cx="38.5" cy="30.5" r="2.4" fill="#fff" opacity="0.85" />
          <defs>
            <linearGradient id="faceGrad" x1="16" y1="10" x2="48" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fb923c" />
              <stop offset="1" stopColor="#a21caf" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Wordmark */}
      <h1 className="font-extrabold italic text-lg tracking-tight pointer-events-auto text-white/80">
        <span className="text-white/80">Corsolo</span>
        <span className="text-purple-400/80">.com</span>
      </h1>

      {/* Social icons */}
      <div className="flex items-center gap-3 pointer-events-auto">
        {socials.map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="h-8 w-8 rounded-full bg-[#1c1c22]/70 flex items-center justify-center text-white/70 hover:bg-[#26262e]/80 hover:text-white hover:scale-105 transition-all duration-200"
          >
            <Icon className="h-4 w-4" />
          </a>
        ))}
      </div>
    </div>
  );
}