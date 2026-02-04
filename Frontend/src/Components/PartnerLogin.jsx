import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

function PartnerLogin({ onClose, onSwitchToSignUp }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return toast.error("Email and password are required");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/partner/login`,
        { email, password }
      );

      // ✅ token extract (adjust if backend structure differs)
      const token = res.data?.token;

      if (!token) {
        throw new Error("Token not received");
      }

      // ✅ save token
      localStorage.setItem("authToken", token);

      toast.success("Login successful");

      // ✅ close modal
      onClose();

      // ✅ redirect
      navigate("/partner/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed, try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 to-purple-800 border border-purple-600 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Partner Login</h2>
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          disabled={loading}
          className="w-full p-3 mb-4 rounded-xl bg-purple-800/70 text-white border border-purple-600 outline-none"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          disabled={loading}
          className="w-full p-3 mb-6 rounded-xl bg-purple-800/70 text-white border border-purple-600 outline-none"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-black font-semibold py-3 rounded-xl shadow-lg transition-all disabled:opacity-70"
        >
          {loading ? (
            <>
              <ClipLoader size={20} color="#000" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <p className="text-center text-purple-300 text-sm mt-4">
          Don't have an account?{" "}
          <span
            onClick={onSwitchToSignUp}
            className="text-pink-400 font-semibold cursor-pointer hover:text-pink-300"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default PartnerLogin;
