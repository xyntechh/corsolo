import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useUser } from "../Context/UserContext";
import {
  Heart,
  Lock,
  ShieldCheck,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";

const sideFeatures = [
  {
    icon: MessageCircle,
    title: "Pick Up Where You Left Off",
    desc: "Your chats and matches are waiting for you.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Secure",
    desc: "Your data and conversations stay private.",
  },
  {
    icon: Sparkles,
    title: "Real Connections",
    desc: "Thousands of people online right now.",
  },
];

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { fetchUser, getFriend } = useUser();

  useEffect(() => {
    // Prevent body scroll and zoom
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.height = "100%";

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    };
  }, []);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error("Please enter all details!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message || "Login failed");
        return;
      }

      // Save authentication data
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user));


      toast.success("Login successful!");

      fetchUser();
      getFriend();

      navigate("/homeClone");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    navigate("/signUp/basicdetails");
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#08080B] overflow-hidden text-white">
      {/* Background Glow — same treatment as the rest of the app */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-purple-500/20 blur-[180px] rounded-full" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 blur-[150px] rounded-full" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/10 blur-[150px] rounded-full" />

      <div className="relative z-10 w-full h-full flex items-center justify-center px-4 lg:px-10">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT — desktop-only brand panel */}
          <div className="hidden lg:block">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm">
              <Heart size={15} className="text-purple-500 shrink-0" />
              Anonymous • Safe • Real Connections
            </div>

            <h1 className="text-5xl xl:text-6xl font-bold leading-tight mt-6">
              Welcome
              <br />
              <span className="text-purple-500">Back</span>
            </h1>

            <p className="text-gray-400 mt-6 text-lg leading-8 max-w-md">
              Log in to pick up your conversations and keep meeting new people
              from around the world.
            </p>

            <div className="mt-10 space-y-5">
              {sideFeatures.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4 items-center">
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

          {/* RIGHT — login card */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Card glow */}
              <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-[40px]" />

              <div className="relative bg-[#0D0D11]/95 backdrop-blur-xl border border-purple-500/40 rounded-[28px] p-6 sm:p-8 shadow-2xl flex flex-col gap-5">
                {/* Heart badge */}
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-purple-500 shadow-[0_0_40px_rgba(168,85,247,.6)] flex items-center justify-center">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 -mt-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-center tracking-wide">
                    Welcome Back!
                  </h1>
                  <p className="text-center text-gray-400 text-xs sm:text-sm">
                    Login to continue your journey
                  </p>
                </div>

                {/* Inputs */}
                <div className="flex flex-col gap-3">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-3 rounded-xl bg-white/5 placeholder-gray-500 text-white border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 outline-none transition"
                    style={{ fontSize: "16px" }}
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-3 rounded-xl bg-white/5 placeholder-gray-500 text-white border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 outline-none transition"
                    style={{ fontSize: "16px" }}
                  />

                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-purple-400 ml-1 text-sm hover:text-purple-300 transition-colors text-left w-fit"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full h-12 flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white font-semibold rounded-xl shadow-lg disabled:opacity-70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D11]"
                >
                  {loading ? <ClipLoader size={22} color="#fff" /> : "Login"}
                </button>

                {/* Signup Link */}
                <button
                  type="button"
                  onClick={handleSignup}
                  className="w-full text-center text-gray-400 hover:text-white text-sm font-medium transition-colors -mt-2"
                >
                  Don't have an account?{" "}
                  <span className="text-purple-400 hover:text-purple-300 font-semibold">
                    Sign Up
                  </span>
                </button>

                <div className="h-px bg-white/10" />

                {/* Footer */}
                <div className="text-center text-gray-500 text-[10px] sm:text-xs">
                  By logging in, you agree to our Terms & Conditions.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
