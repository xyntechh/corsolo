import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/forgetPassword`,
        { email },
      );

      if (res.data.success) {
        toast.success(
          res.data.message || "Reset instructions sent to your email!",
        );
      } else {
        toast.error(res.data.message || "Failed to send reset instructions.");
      }
      setLoading(false);
      setEmail("");
    } catch (error) {
      toast.error("An error occurred while sending reset instructions.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 px-4 overflow-hidden">
      <div className="w-full max-w-md backdrop-blur-lg bg-purple-900/40 border border-purple-700 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col justify-center gap-5">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-center text-white tracking-wide">
            Forgot Your Password?
          </h1>
          <p className="text-center text-purple-200 text-xs sm:text-sm">
            Don't worry, it happens to the best of us! Enter your email below
            and we'll send you instructions.
          </p>
        </div>

        {/* Input */}
        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-xl bg-purple-800/70 placeholder-purple-300 text-white border border-purple-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none transition"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-black font-semibold p-4 rounded-xl shadow-lg transition-all active:scale-95"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Send Reset Instructions"
          )}
        </button>

        {/* Footer */}
        <div className="text-center text-purple-300 text-[10px] sm:text-xs">
          If you're facing any issues, contact our support team at{" "}
          <a
            href="mailto:corsolo@gmail.com"
            className="text-pink-400 hover:text-pink-300 font-semibold"
          >
            corsolo@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
