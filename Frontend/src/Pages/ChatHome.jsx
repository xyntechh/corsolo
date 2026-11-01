import { Heart, Shield, Sparkles, User, Mail, Lock, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Footer from "../Components/Footer";

const leftFeatures = [
  {
    icon: Heart,
    title: "Meet New People",
    desc: "Chat with interesting people instantly",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    desc: "Your privacy and safety are our priority",
  },
  {
    icon: Sparkles,
    title: "Real Connections",
    desc: "Build genuine relationships that last",
  },
];

const cardFeatures = [
  { icon: Lock, title: "100% Secure", desc: "Your data is protected" },
  { icon: Zap, title: "Quick Start", desc: "Join in less than 30 seconds" },
  { icon: Users, title: "Global Community", desc: "Millions of users worldwide" },
];

export default function ChatHome() {
  const navigate = useNavigate();

  const handleStartAsGuest = () => {
    navigate("/guest");
  };

  const handleSignUp = () => {
    navigate("/signUp/basicdetails");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#08080B] text-white">
      {/* Background glow: one cheap gradient layer instead of 3 huge blur divs */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(600px circle at 50% -10%, rgba(168,85,247,0.22), transparent 60%), radial-gradient(400px circle at 0% 100%, rgba(168,85,247,0.10), transparent 60%), radial-gradient(400px circle at 100% 100%, rgba(168,85,247,0.10), transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-12 lg:px-10 lg:py-0">
        <div className="flex items-center lg:min-h-screen">
          <div className="grid w-full items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16">
            {/* LEFT */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm">
                <Shield size={14} className="shrink-0 text-purple-500" />
                Anonymous • Safe • Real Connections
              </div>

              <h1 className="mt-4 text-3xl font-bold leading-tight sm:mt-6 sm:text-5xl lg:text-6xl">
                Find Your
                <br />
                <span className="text-purple-500">Perfect Match</span>
              </h1>

              <p className="mx-auto mt-3 max-w-md text-base leading-7 text-gray-400 sm:mt-6 sm:text-lg sm:leading-8 lg:mx-0">
                Connect with amazing people around the world and make
                meaningful connections.
              </p>

              {/* Feature list: compact row layout on mobile to cut scroll height */}
              <div className="mt-6 flex flex-row flex-wrap justify-center gap-3 sm:mt-10 sm:hidden">
                {leftFeatures.map(({ icon: Icon, title }) => (
                  <div
                    key={title}
                    className="flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-2"
                  >
                    <Icon className="shrink-0 text-purple-500" size={16} />
                    <span className="whitespace-nowrap text-xs font-medium">
                      {title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Full feature list with descriptions: sm and up */}
              <div className="mt-10 hidden space-y-5 sm:block">
                {leftFeatures.map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex items-center justify-center gap-4 text-left lg:justify-start"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10">
                      <Icon className="text-purple-500" size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">{title}</h3>
                      <p className="mt-0.5 text-sm text-gray-400">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative mt-8 w-full max-w-md sm:mt-0">
                {/* Card: opaque + static glow shadow (no blur layer, no backdrop-blur) */}
                <div className="relative rounded-[28px] border border-purple-500/40 bg-[#0D0D11] p-5 shadow-[0_0_60px_rgba(168,85,247,0.18)] sm:p-8">
                  {/* Heart badge */}
                  <div className="flex justify-center">
                    <div className="-mt-1 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500 shadow-[0_0_40px_rgba(168,85,247,.6)] sm:-mt-2 sm:h-16 sm:w-16">
                      <Heart className="h-5 w-5 fill-white text-white sm:h-7 sm:w-7" />
                    </div>
                  </div>

                  <h2 className="mt-3 text-center text-xl font-bold sm:mt-4 sm:text-3xl">
                    Get Started
                  </h2>

                  <p className="mt-1.5 text-center text-xs leading-5 text-gray-400 sm:mt-2 sm:text-sm sm:leading-6">
                    Enter your details below and start connecting!
                  </p>

                  {/* Buttons */}
                  <div className="mt-4 space-y-2.5 sm:mt-6 sm:space-y-3">
                    <button
                      type="button"
                      onClick={handleStartAsGuest}
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-purple-500 text-sm font-semibold transition-colors hover:bg-purple-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D11] active:bg-purple-700 sm:h-12 sm:text-[15px]"
                    >
                      <User size={17} />
                      Start As A Guest
                    </button>

                    <button
                      onClick={handleSignUp}
                      type="button"
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold transition-colors hover:border-purple-500 hover:bg-purple-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D11] sm:h-12 sm:text-[15px]"
                    >
                      <Mail size={17} />
                      Sign Up
                    </button>
                  </div>

                  {/* Login */}
                  <p className="mt-3.5 text-center text-xs text-gray-400 sm:mt-5 sm:text-sm">
                    Already have an account?{" "}
                    <button
                      onClick={handleLogin}
                      type="button"
                      className="ml-1 font-medium text-purple-500 hover:text-purple-400 focus:outline-none focus-visible:underline"
                    >
                      Login
                    </button>
                  </p>

                  <div className="my-4 h-px bg-white/10 sm:my-6" />

                  {/* Features */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {cardFeatures.map(({ icon: Icon, title, desc }) => (
                      <div key={title} className="text-center">
                        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 sm:h-11 sm:w-11">
                          <Icon className="text-purple-500" size={15} />
                        </div>
                        <h3 className="mt-2 text-[11px] font-semibold sm:mt-2.5 sm:text-xs">
                          {title}
                        </h3>
                        <p className="mt-1 hidden px-1 text-[11px] leading-snug text-gray-400 sm:block">
                          {desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}