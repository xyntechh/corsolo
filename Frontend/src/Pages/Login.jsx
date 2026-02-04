import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useUser } from "../Context/UserContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { fetchUser } = useUser();

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
      alert("Please enter all details!");
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
        }
      );

      const data = await response.json();

      if (!data.success) {
        setLoading(false);
        alert(data.message || "Login failed");
        return;
      }

      // Save token in localStorage
      localStorage.setItem("authToken", data.token);

      // Save user info (optional but helpful)
      localStorage.setItem("userData", JSON.stringify(data.user));

      toast.success("Login successful!");

      fetchUser();

      // Redirect to dashboard or home
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  const handleSignup = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 px-4 overflow-hidden">
      <div className="w-full max-w-md backdrop-blur-lg bg-purple-900/40 border border-purple-700 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col justify-center gap-5">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-center text-white tracking-wide">
            Welcome Back!
          </h1>
          <p className="text-center text-purple-200 text-xs sm:text-sm">
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
            className="p-3 rounded-xl bg-purple-800/70 placeholder-purple-300 text-white border border-purple-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none transition"
            style={{ fontSize: "16px" }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-xl bg-purple-800/70 placeholder-purple-300 text-white border border-purple-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none transition"
            style={{ fontSize: "16px" }}
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-black font-semibold p-4 rounded-xl shadow-lg disabled:opacity-70 transition-all active:scale-95"
        >
          {loading ? (
            <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Login"
          )}
        </button>
        

        {/* Signup Link */}
        <button
          onClick={handleSignup}
          className="w-full text-center text-purple-200 hover:text-white text-sm font-medium transition-colors"
        >
          Don't have an account?{" "}
          <span className="text-pink-400 hover:text-pink-300 font-semibold">
            Sign Up
          </span>
        </button>

        {/* Footer */}
        <div className="text-center text-purple-300 text-[10px] sm:text-xs">
          By logging in, you agree to our Terms & Conditions.
        </div>
      </div>
    </div>
  );
}

export default Login;
