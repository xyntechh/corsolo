import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { Heart, User, Cake, Search } from "lucide-react";
import { useUser } from "../Context/UserContext.jsx";

const footerLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "Partner program", href: "/partner" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Refunds", href: "/refundpolicy" },
];

function Input() {
  const [nick, setNick] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

  const { fetchUser } = useUser();

  const handleSubmit = async () => {
    try {
      if (!nick || !dob || !gender || !lookingFor) {
        return toast.error("Please enter all details!");
      }

      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/register`,
        {
          name: nick,
          dob,
          gender,
          lookingFor,
        },
      );

      setLoading(false);

      if (response.data.success) {
        const { token, user } = response.data.data;

        localStorage.setItem("authToken", token);

        fetchUser();

        toast.success("Welcome to the community");
        navigate("/homeClone");
      } else {
        toast.error("Registration failed!");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#08080B] overflow-hidden text-white">
      {/* Background Glow — softened */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-purple-500/10 blur-[160px] rounded-full" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 blur-[130px] rounded-full" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/5 blur-[130px] rounded-full" />

      <div className="relative z-10 w-full h-full flex items-center justify-center px-4 overflow-y-auto py-6">
        <div className="w-full max-w-md">
          <div className="relative">
            {/* Card glow — softened */}
            <div className="absolute inset-0 bg-purple-500/10 blur-2xl rounded-3xl" />

            <div className="relative bg-[#0D0D11]/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
              {/* Heart badge */}
              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-full bg-purple-500 shadow-[0_0_25px_rgba(168,85,247,.4)] flex items-center justify-center">
                  <Heart className="w-6 h-6 fill-white text-white" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 -mt-1">
                <h1 className="text-xl sm:text-2xl font-bold text-center tracking-wide">
                  Match Anonymously
                </h1>
                <p className="text-center text-gray-400 text-xs sm:text-sm">
                  Enter your details below and start connecting
                </p>
              </div>

              {/* Inputs */}
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400"
                  />
                  <input
                    type="text"
                    placeholder="Nickname"
                    value={nick}
                    onChange={(e) => setNick(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 placeholder-gray-500 text-white border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 outline-none transition"
                    style={{ fontSize: "16px" }}
                  />
                </div>

                <div className="relative">
                  <Cake
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none"
                  />
                  <input
                    type="date"
                    placeholder="Date of Birth"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 outline-none transition [color-scheme:dark]"
                    style={{ fontSize: "16px" }}
                  />
                </div>
              </div>

              {/* Gender select */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide pl-1">
                  I am
                </span>
                <div className="flex gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setGender("male")}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-colors border ${
                      gender === "male"
                        ? "bg-purple-500 border-purple-500 text-white shadow-[0_0_14px_rgba(168,85,247,.3)]"
                        : "bg-white/5 border-white/10 text-gray-300 hover:border-purple-500/50 hover:bg-purple-500/10"
                    }`}
                  >
                    Male
                  </button>

                  <button
                    type="button"
                    onClick={() => setGender("female")}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-colors border ${
                      gender === "female"
                        ? "bg-purple-500 border-purple-500 text-white shadow-[0_0_14px_rgba(168,85,247,.3)]"
                        : "bg-white/5 border-white/10 text-gray-300 hover:border-purple-500/50 hover:bg-purple-500/10"
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              {/* Looking for select */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide pl-1 flex items-center gap-1.5">
                  <Search size={12} className="text-purple-400" />
                  Looking for
                </span>
                <div className="flex gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setLookingFor("Men")}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-colors border text-sm ${
                      lookingFor === "Men"
                        ? "bg-purple-500 border-purple-500 text-white shadow-[0_0_14px_rgba(168,85,247,.3)]"
                        : "bg-white/5 border-white/10 text-gray-300 hover:border-purple-500/50 hover:bg-purple-500/10"
                    }`}
                  >
                    Men
                  </button>

                  <button
                    type="button"
                    onClick={() => setLookingFor("Women")}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-colors border text-sm ${
                      lookingFor === "Women"
                        ? "bg-purple-500 border-purple-500 text-white shadow-[0_0_14px_rgba(168,85,247,.3)]"
                        : "bg-white/5 border-white/10 text-gray-300 hover:border-purple-500/50 hover:bg-purple-500/10"
                    }`}
                  >
                    Women
                  </button>

                  <button
                    type="button"
                    onClick={() => setLookingFor("Everyone")}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-colors border text-sm ${
                      lookingFor === "Everyone"
                        ? "bg-purple-500 border-purple-500 text-white shadow-[0_0_14px_rgba(168,85,247,.3)]"
                        : "bg-white/5 border-white/10 text-gray-300 hover:border-purple-500/50 hover:bg-purple-500/10"
                    }`}
                  >
                    Everyone
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full h-12 flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white font-semibold rounded-xl shadow-md disabled:opacity-70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D11]"
              >
                {loading ? <ClipLoader size={22} color="#fff" /> : "Start Chat"}
              </button>

              {/* Login */}
              <button
                type="button"
                onClick={handleSignIn}
                className="w-full text-center text-gray-400 hover:text-white text-sm font-medium transition-colors -mt-2"
              >
                Already have an account?{" "}
                <span className="text-purple-400 hover:text-purple-300 font-semibold">
                  Login
                </span>
              </button>

              <div className="h-px bg-white/10" />

              {/* Footer links */}
              <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-gray-500 text-[10px] sm:text-xs">
                {footerLinks.map(({ label, href }, i) => (
                  <React.Fragment key={href}>
                    <a
                      href={href}
                      className="hover:text-purple-400 transition-colors"
                    >
                      {label}
                    </a>
                    {i < footerLinks.length - 1 && <span>•</span>}
                  </React.Fragment>
                ))}
              </div>

              <div className="text-center text-gray-500 text-[10px] sm:text-xs -mt-2">
                By clicking Start Chat, you agree to our policies.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Input;
