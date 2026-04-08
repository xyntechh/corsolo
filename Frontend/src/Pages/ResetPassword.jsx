import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = useParams(); 
  const navigate = useNavigate();

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/resetPassword/${token}`,
        { password }
      );

      if (!res.data.success) {
        toast.error(res.data.message);
      } else {
        toast.success("Password reset successful!");
        navigate("/login");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 px-4 overflow-hidden">
      <div className="w-full max-w-md backdrop-blur-lg bg-purple-900/40 border border-purple-700 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col gap-5">
        
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-center text-white">
            Reset Your Password
          </h1>
          <p className="text-center text-purple-200 text-xs sm:text-sm">
            Enter your new password below.
          </p>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-xl bg-purple-800/70 text-white border border-purple-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-3 rounded-xl bg-purple-800/70 text-white border border-purple-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-black font-semibold p-4 rounded-xl shadow-lg disabled:opacity-70"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Reset Password"
          )}
        </button>

        {/* Footer */}
        <div className="text-center text-purple-300 text-xs">
          Need help?{" "}
          <a
            href="mailto:corsolo@gmail.com"
            className="text-pink-400 font-semibold"
          >
            Contact Support
          </a>
        </div>

      </div>
    </div>
  );
}

export default ResetPassword;