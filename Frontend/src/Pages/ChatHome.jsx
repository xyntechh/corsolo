import { Heart, Shield, Sparkles, User, Mail, Lock, Users, Zap } from "lucide-react";
import {useNavigate} from "react-router-dom";

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
  }

   const handleSignUp = () => {
    navigate("/signUp/basicdetails");
  }

   const handleLogin = () => {
    navigate("/login");
  }

  return (
    <div className=" w-full min-h-screen bg-[#08080B] overflow-hidden relative text-white">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-purple-500/20 blur-[180px] rounded-full" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 blur-[150px] rounded-full" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/10 blur-[150px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-0">
        <div className="lg:min-h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center w-full">
            {/* LEFT */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10 bg-white/5 text-xs sm:text-sm">
                <Shield size={14} className="text-purple-500 shrink-0" />
                Anonymous • Safe • Real Connections
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mt-4 sm:mt-6">
                Find Your
                <br />
                <span className="text-purple-500">Perfect Match</span>
              </h1>

              <p className="text-gray-400 mt-3 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 max-w-md mx-auto lg:mx-0">
                Connect with amazing people around the world and make
                meaningful connections.
              </p>

              {/* Feature list: compact row layout on mobile to cut scroll height */}
              <div className="mt-6 sm:mt-10 flex flex-row flex-wrap justify-center gap-3 sm:hidden">
                {leftFeatures.map(({ icon: Icon, title }) => (
                  <div
                    key={title}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30"
                  >
                    <Icon className="text-purple-500 shrink-0" size={16} />
                    <span className="text-xs font-medium whitespace-nowrap">
                      {title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Full feature list with descriptions: sm and up */}
              <div className="hidden sm:block mt-10 space-y-5">
                {leftFeatures.map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex gap-4 items-center text-left justify-center lg:justify-start"
                  >
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                      <Icon className="text-purple-500" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">{title}</h3>
                      <p className="text-gray-400 text-sm mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md mt-8 sm:mt-0">
                {/* Glow */}
                <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-[40px]" />

                {/* Card */}
                <div className="relative bg-[#0D0D11]/95 backdrop-blur-xl border border-purple-500/40 rounded-[28px] p-5 sm:p-8 shadow-2xl">
                  {/* Heart badge */}
                  <div className="flex justify-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 -mt-1 sm:-mt-2 rounded-full bg-purple-500 shadow-[0_0_40px_rgba(168,85,247,.6)] flex items-center justify-center">
                      <Heart className="w-5 h-5 sm:w-7 sm:h-7 fill-white text-white" />
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-3xl font-bold text-center mt-3 sm:mt-4">
                    Get Started
                  </h2>

                  <p className="text-center text-gray-400 mt-1.5 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6">
                    Enter your details below and start connecting!
                  </p>

                  {/* Buttons */}
                  <div className="mt-4 sm:mt-6 space-y-2.5 sm:space-y-3">
                    <button
                      type="button"
                      onClick={handleStartAsGuest}
                      className="w-full h-11 sm:h-12 rounded-xl bg-purple-500 hover:bg-purple-600 active:bg-purple-700 transition-colors font-semibold text-sm sm:text-[15px] flex justify-center items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D11]"
                    >
                      <User size={17} />
                      Start As A Guest
                    </button>

                    <button
                    onClick={handleSignUp}
                      type="button"
                      className="w-full h-11 sm:h-12 rounded-xl border border-white/10 bg-white/5 hover:border-purple-500 hover:bg-purple-500/10 transition-colors font-semibold text-sm sm:text-[15px] flex justify-center items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D11]"
                    >
                      <Mail size={17} />
                      Sign Up
                    </button>
                  </div>

                  {/* Login */}
                  <p className="text-center mt-3.5 sm:mt-5 text-gray-400 text-xs sm:text-sm">
                    Already have an account?{" "}
                    <button
                      onClick={handleLogin}
                      type="button"
                      className="text-purple-500 hover:text-purple-400 font-medium ml-1 focus:outline-none focus-visible:underline"
                    >
                      Login
                    </button>
                  </p>

                  <div className="h-px bg-white/10 my-4 sm:my-6" />

                  {/* Features */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {cardFeatures.map(({ icon: Icon, title, desc }) => (
                      <div key={title} className="text-center">
                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 mx-auto flex items-center justify-center">
                          <Icon className="text-purple-500" size={15} />
                        </div>
                        <h3 className="mt-2 sm:mt-2.5 font-semibold text-[11px] sm:text-xs">
                          {title}
                        </h3>
                        <p className="hidden sm:block text-[11px] text-gray-400 mt-1 leading-snug px-1">
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
