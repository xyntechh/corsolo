import React, { useState } from "react";
import {
  Moon,
  MessageSquare,
  ShieldCheck,
  FileText,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const links = [
  {
    label: "Discord Server",
    href: "https://discord.gg/your-invite",
    icon: MessageSquare,
  },
  { label: "Privacy Policy", href: "/privacy", icon: ShieldCheck },
  { label: "Terms Of Service", href: "/terms", icon: FileText },
];

function SettingsCard({ isOpen }) {
  const [darkTheme, setDarkTheme] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div
      className={`absolute bottom-[-5px] left-0 w-72 z-40 transition-all duration-300 ease-in-out ${
        isOpen
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-10 opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-[#0D0D11] border border-white/10 rounded-xl px-4 py-3 shadow-lg">
       
        {/* Links */}
        {links.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="flex items-center justify-between py-2.5 group"
          >
            <div className="flex items-center gap-3">
              <Icon size={18} className="text-gray-400" />
              <span className="text-sm font-medium text-purple-300 group-hover:text-purple-500 transition-colors">
                {label}
              </span>
            </div>
            <ExternalLink
              size={15}
              className="text-gray-500 group-hover:text-gray-300 transition-colors"
            />
          </a>
        ))}

        <div className="h-px bg-white/10 my-2" />

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 py-2.5 text-red-400 hover:text-red-300 transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default SettingsCard;
