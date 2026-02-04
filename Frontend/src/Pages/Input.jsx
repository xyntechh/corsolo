import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader"; // ADDED

function Input() {
  const [nick, setNick] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
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

  const handleSubmit = async () => {
    try {
      if (!nick || !age || !gender) {
        return toast.error("Please enter all details!");
      }

      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/register`,
        {
          name: nick,
          age,
          gender,
        }
      );

      setLoading(false);

      if (response.data.success) {
        const { token, user } = response.data.data;

        localStorage.setItem("authToken", token);

        toast.success(`Welcome ${user.name}!`);
        navigate("/looking-for");
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
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 px-4 overflow-hidden">
      <div className="w-full max-w-md backdrop-blur-lg bg-purple-900/40 border border-purple-700 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col justify-center gap-5">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-center text-white tracking-wide">
            Match Anonymously
          </h1>
          <p className="text-center text-purple-200 text-xs sm:text-sm">
            Enter your details below and start connecting
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nickname"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            className="p-3 rounded-xl bg-purple-800/70 placeholder-purple-300 text-white border border-purple-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none transition"
            style={{ fontSize: "16px" }}
          />

          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="p-3 rounded-xl bg-purple-800/70 placeholder-purple-300 text-white border border-purple-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none transition"
            style={{ fontSize: "16px" }}
          />
        </div>

        <div className="flex gap-3 sm:gap-4">
          <button
            onClick={() => setGender("Male")}
            className={`flex-1 py-3 rounded-xl font-semibold transition ${
              gender === "Male"
                ? "bg-pink-500 text-black shadow-lg"
                : "bg-purple-700/60 text-white hover:bg-purple-700/80"
            }`}
          >
            Male
          </button>

          <button
            onClick={() => setGender("Female")}
            className={`flex-1 py-3 rounded-xl font-semibold transition ${
              gender === "Female"
                ? "bg-pink-500 text-black shadow-lg"
                : "bg-purple-700/60 text-white hover:bg-purple-700/80"
            }`}
          >
            Female
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-black font-semibold p-4 rounded-xl shadow-lg disabled:opacity-70 transition-all active:scale-95"
        >
          {loading ? <ClipLoader size={28} color="#000" /> : "Start Chat"}
        </button>

        <button
          onClick={handleSignIn}
          className="w-full text-center text-purple-200 hover:text-white text-sm font-medium transition-colors"
        >
          Already have an account?{" "}
          <span className="text-pink-400 hover:text-pink-300 font-semibold">
            Login
          </span>
        </button>

        <div className="flex flex-wrap justify-center items-center gap-2 text-purple-300 text-[10px] sm:text-xs">
          <a href="/contact" className="hover:text-pink-400 transition-colors">
            Contact Us
          </a>

           <a href="/partner" className="hover:text-pink-400 transition-colors">
            Partner program
          </a>
          <span>•</span>
          <a href="/terms" className="hover:text-pink-400 transition-colors">
            Terms & Conditions
          </a>
          <span>•</span>
          <a href="/privacy" className="hover:text-pink-400 transition-colors">
            Privacy Policy
          </a>
          <span>•</span>
          <a
            href="/refundpolicy"
            className="hover:text-pink-400 transition-colors"
          >
            Refunds
          </a>
        </div>

        <div className="text-center text-purple-300 text-[10px] sm:text-xs -mt-2">
          By clicking Start Chat, you agree to our policies.
        </div>
      </div>
    </div>
  );
}

export default Input;
