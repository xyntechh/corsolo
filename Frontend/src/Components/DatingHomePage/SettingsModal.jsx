import React, { useState } from "react";
import {
  X,
  User,
  Settings as SettingsIcon,
  ShieldCheck,
  Shield,
  SlidersHorizontal,
  Ban,
  Pencil,
} from "lucide-react";

const NAV_ITEMS = [
  { key: "profile", label: "Profile", icon: User },
  { key: "account", label: "Account", icon: SettingsIcon },
  { key: "standing", label: "Standing", icon: ShieldCheck },
  { key: "privacy", label: "Privacy", icon: Shield },
  { key: "preferences", label: "Preferences", icon: SlidersHorizontal },
  { key: "blocked", label: "Blocked", icon: Ban },
];

export default function SettingsModal({
  showSettingsModal,
  setshowSettingsModal,
}) {
  const [activeTab, setActiveTab] = useState("profile");

  // Jab modal khule tab hi background scroll band karo,
  // aur modal band hote hi wapas normal kar do.
  React.useEffect(() => {
    if (showSettingsModal) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [showSettingsModal]);

  // ---- Drag-to-close (mobile only) ----
  // dragY = kitna neeche khinch chuke hain abhi (pixels mein)
  // isDragging = true jab tak ungli screen pe hai
  const [dragY, setDragY] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const startYRef = React.useRef(0);
  const panelRef = React.useRef(null);

  const handleTouchStart = (e) => {
    startYRef.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    const currentY = e.touches[0].clientY;
    const delta = currentY - startYRef.current;
    // Sirf neeche ki taraf khinchne do (upar khinchne pe kuch mat karo)
    if (delta > 0) {
      setDragY(delta);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const panelHeight = panelRef.current?.offsetHeight || 0;
    const closeThreshold = panelHeight * 0.25; // 25% se zyada khincha toh band karo

    if (dragY > closeThreshold) {
      setshowSettingsModal(false);
    }
    // Chahe band ho ya na ho, position wapas 0 pe reset kar do
    // (band hone par parent ka translate-y-full le lega, animation smooth rahega)
    setDragY(0);
  };



  return (
    <div
      ref={panelRef}
      className="
        relative w-full bg-neutral-900 text-neutral-100 shadow-md
        flex flex-col
        rounded-t-md lg:rounded-md
        h-[50vh] lg:h-[60vh]
        lg:max-w-3xl
        animate-[slideUp_0.28s_ease-out]
        lg:animate-[fadeIn_0.2s_ease-out]
      "
      style={{
        transform: `translateY(${dragY}px)`,
        transition: isDragging ? "none" : "transform 0.25s ease-out",
      }}
    >
      {/* drag handle, mobile only */}
      <div
        className="lg:hidden flex justify-center pt-2.5 pb-1 touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-10 h-1 rounded-full bg-neutral-700" />
      </div>

      {/* Header */}
      <div
        className="flex items-center justify-between flex-wrap gap-2 px-5 lg:px-7 pt-3 lg:pt-6 pb-3 lg:pb-4 shrink-0 lg:cursor-default"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <h2 className="text-lg lg:text-xl font-semibold">Settings</h2>
        <button
          onClick={() => setshowSettingsModal(false)}
          className="text-neutral-400 hover:text-neutral-100 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0 border-t border-neutral-800 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar: horizontal scroll strip on mobile, vertical list on desktop */}
        <div
          className="
            shrink-0 border-b lg:border-b-0 lg:border-r border-neutral-800
            flex flex-row lg:flex-col
            gap-1 lg:gap-1
            px-3 lg:px-3 py-2 lg:py-4
            overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto
            hide-scrollbar
            w-full lg:w-44 xl:w-56
          "
        >
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`
                  flex items-center gap-2 lg:gap-3
                  px-3 py-2 lg:py-2.5 rounded-md
                  text-xs lg:text-sm font-medium transition-colors
                  whitespace-nowrap shrink-0
                  w-auto lg:w-full
                  ${
                    active
                      ? "bg-neutral-800 text-white"
                      : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50"
                  }
                `}
              >
                <Icon size={16} className="shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div
          className="flex-1 min-h-0 min-w-0 overflow-y-auto overscroll-contain px-4 lg:px-7 py-4 lg:py-5 hide-scrollbar"
          style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
        >
          {activeTab === "profile" && <ProfilePanel />}
          {activeTab === "account" && <AccountPanel />}
          {activeTab === "standing" && <PlaceholderPanel title="Standing" />}
          {activeTab === "privacy" && <PlaceholderPanel title="Privacy" />}
          {activeTab === "preferences" && (
            <PlaceholderPanel title="Preferences" />
          )}
          {activeTab === "blocked" && <PlaceholderPanel title="Blocked" />}
        </div>
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
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold tracking-wide text-neutral-400 mb-2">
      {children}
    </p>
  );
}

function ProfilePanel() {
  const [nameChangesLeft] = useState(3);

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div>
        <SectionLabel>Avatar</SectionLabel>
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-neutral-700 shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center text-2xl">
                😏
              </div>
            </div>
            <p className="text-sm text-neutral-400 min-w-0">
              Avatars are reviewed before displaying. Do not upload
              inappropriate avatars. Limit: 3 changes daily. Max 8MB.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 pl-20 sm:pl-0">
            <button className="px-3 py-1.5 rounded-md bg-neutral-800 text-sm font-medium hover:bg-neutral-700 transition-colors">
              Change
            </button>
            <button className="px-3 py-1.5 rounded-md text-sm font-medium text-neutral-200 hover:text-white transition-colors">
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div>
        <SectionLabel>Banner</SectionLabel>
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-1.5">
            <button className="relative w-20 h-14 rounded-md bg-amber-600/80 hover:opacity-90 transition-opacity">
              <Pencil
                size={12}
                className="absolute top-1.5 right-1.5 text-neutral-900"
              />
            </button>
            <span className="text-xs text-neutral-400">Simple</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <button className="relative w-20 h-14 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 hover:opacity-90 transition-opacity">
              <Pencil
                size={12}
                className="absolute top-1.5 right-1.5 text-white"
              />
            </button>
            <span className="text-xs text-neutral-400">Gradient</span>
          </div>
        </div>
      </div>

      {/* Username */}
      <div>
        <SectionLabel>Username</SectionLabel>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-base">charred title</span>
          <button className="px-3 py-1.5 rounded-md bg-neutral-800 text-sm font-medium hover:bg-neutral-700 transition-colors">
            Edit
          </button>
        </div>
        <p className="text-sm text-neutral-400 mt-1">
          You have <span className="text-neutral-200">{nameChangesLeft}</span>{" "}
          name changes left for today.
        </p>
      </div>

      {/* Interests */}
      <div>
        <SectionLabel>Interests (ON)</SectionLabel>
      </div>
    </div>
  );
}

function AccountPanel() {
  return (
    <div className="space-y-6">
      {/* Email */}
      <div>
        <SectionLabel>Email</SectionLabel>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-base">charred.title@example.com</span>
          <button className="px-3 py-1.5 rounded-md bg-neutral-800 text-sm font-medium hover:bg-neutral-700 transition-colors">
            Edit
          </button>
        </div>
        <p className="text-sm text-neutral-400 mt-1">
          Your email is verified.
        </p>
      </div>

      {/* Password */}
      <div>
        <SectionLabel>Password</SectionLabel>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-base">••••••••••••</span>
          <button className="px-3 py-1.5 rounded-md bg-neutral-800 text-sm font-medium hover:bg-neutral-700 transition-colors">
            Change
          </button>
        </div>
        <p className="text-sm text-neutral-400 mt-1">
          Last changed 4 months ago.
        </p>
      </div>

      {/* Phone number */}
      <div>
        <SectionLabel>Phone Number</SectionLabel>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-base text-neutral-400">Not connected</span>
          <button className="px-3 py-1.5 rounded-md bg-neutral-800 text-sm font-medium hover:bg-neutral-700 transition-colors">
            Connect
          </button>
        </div>
        <p className="text-sm text-neutral-400 mt-1">
          Add a phone number for account recovery.
        </p>
      </div>

      {/* Two-factor authentication */}
      <div>
        <SectionLabel>Two-Factor Authentication</SectionLabel>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-base text-neutral-400">Disabled</span>
          <button className="px-3 py-1.5 rounded-md bg-neutral-800 text-sm font-medium hover:bg-neutral-700 transition-colors">
            Enable
          </button>
        </div>
        <p className="text-sm text-neutral-400 mt-1">
          Add an extra layer of security to your account.
        </p>
      </div>

      {/* Connected accounts */}
      <div>
        <SectionLabel>Connected Accounts</SectionLabel>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-base">Discord, Google</span>
          <button className="px-3 py-1.5 rounded-md bg-neutral-800 text-sm font-medium hover:bg-neutral-700 transition-colors">
            Manage
          </button>
        </div>
      </div>

      {/* Delete account */}
      <div>
        <SectionLabel>Danger Zone</SectionLabel>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-base text-red-400">Delete account</span>
          <button className="px-3 py-1.5 rounded-md bg-red-950 text-red-300 text-sm font-medium hover:bg-red-900 transition-colors">
            Delete
          </button>
        </div>
        <p className="text-sm text-neutral-400 mt-1">
          This action is permanent and cannot be undone.
        </p>
      </div>
    </div>
  );
}

function PlaceholderPanel({ title }) {
  return (
    <div className="h-full flex items-center justify-center text-neutral-500 text-sm">
      {title} settings coming soon.
    </div>
  );
}