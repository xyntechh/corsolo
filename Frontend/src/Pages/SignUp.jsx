import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [nick, setNick] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
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

  const refferalCode = localStorage.getItem("referralCode");

  const handleSubmit = async () => {
    try {
      if ((!nick || !age || !gender || !email || !password, !phone)) {
        alert("Please fill all required fields!");
        return;
      }
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/signUp`,
        {
          name: nick,
          age,
          gender,
          email,
          password,
          phone,
          refferdBy : refferalCode || "Default"
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
    alert("Navigating to login...");
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 px-4 py-6 overflow-auto">
      <div className="w-full max-w-lg backdrop-blur-lg bg-purple-900/40 border border-purple-700 rounded-3xl shadow-2xl p-6 sm:p-8 my-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide mb-2">
            Start Your Journey to the Perfect Match
          </h1>
          <p className="text-purple-200 text-sm">
            Enter your details below and start connecting
          </p>
        </div>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5">
          <input
            type="text"
            placeholder="Nickname"
            required
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            className="w-full p-3 rounded-xl bg-purple-800/70 placeholder-purple-300 text-white border border-purple-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none transition"
            style={{ fontSize: "16px" }}
          />

          <input
            type="number"
            placeholder="Age"
            required
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full p-3 rounded-xl bg-purple-800/70 placeholder-purple-300 text-white border border-purple-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none transition"
            style={{ fontSize: "16px" }}
          />

          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-purple-800/70 placeholder-purple-300 text-white border border-purple-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none transition sm:col-span-2"
            style={{ fontSize: "16px" }}
          />

          <input
            type="tel"
            placeholder="Phone Number "
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 rounded-xl bg-purple-800/70 placeholder-purple-300 text-white border border-purple-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none transition"
            style={{ fontSize: "16px" }}
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-purple-800/70 placeholder-purple-300 text-white border border-purple-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none transition"
            style={{ fontSize: "16px" }}
          />
        </div>

        {/* Gender Selection */}
        <div className="mb-5">
          <p className="text-sm text-purple-200 mb-3 font-medium">
            Select Gender
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={() => setGender("Male")}
              className={`py-3 rounded-xl font-semibold transition ${
                gender === "Male"
                  ? "bg-pink-500 text-black shadow-lg"
                  : "bg-purple-700/60 text-white hover:bg-purple-700/80"
              }`}
            >
              Male
            </button>

            <button
              onClick={() => setGender("Female")}
              className={`py-3 rounded-xl font-semibold transition ${
                gender === "Female"
                  ? "bg-pink-500 text-black shadow-lg"
                  : "bg-purple-700/60 text-white hover:bg-purple-700/80"
              }`}
            >
              Female
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-black font-semibold p-4 rounded-xl shadow-lg disabled:opacity-70 transition-all active:scale-95 mb-4"
        >
          {loading ? (
            <div className="w-7 h-7 border-3 border-black border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Start Exploring"
          )}
        </button>

        {/* Login Link */}
        <div className="text-center mb-5">
          <button
            onClick={handleSignIn}
            className="text-purple-200 hover:text-white text-sm font-medium transition-colors"
          >
            Already have an account?{" "}
            <span className="text-pink-400 hover:text-pink-300 font-semibold">
              Login
            </span>
          </button>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center items-center gap-2 text-purple-300 text-xs mb-3">
          <a href="/contact" className="hover:text-pink-400 transition-colors">
            Contact Us
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

        {/* Terms Text */}
        <div className="text-center text-purple-300 text-xs">
          By clicking Start Exploring, you agree to our policies.
        </div>
      </div>
    </div>
  );
}

export default SignUp;
