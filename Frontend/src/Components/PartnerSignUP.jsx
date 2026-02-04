import React from "react";
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

function PartnerSignUP({ onClose, onSwitchToLogin }) {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [handle, sethandle] = useState("");
  const [handleUserName, sethandleUserName] = useState("");
  const [handleLink, sethandleLink] = useState("");
  const [phone, setphone] = useState("");
  const [loading, setloading] = useState(false);


  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !name ||
      !email ||
      !password ||
      !handle ||
      !handleUserName ||
      !handleLink ||
      !phone
    ) {
      toast.error("Please enter all details!");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    // Password validation
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ""))) {
      toast.error("Please enter a valid 10-digit phone number!");
      return;
    }

    setloading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/partner/Singup`,
        {
          name,
          email,
          password,
          handle,
          handleUserName,
          handleLink,
          phone,
        }
      );

      if (res.data.success) {

        const { token, newPartner } = res.data;


        localStorage.setItem("authToken", token);

        toast.success(`Welcome ${newPartner.name}! `);

        navigate("/partner/dashboard")

        // Clear form
        setname("");
        setemail("");
        setpassword("");
        sethandle("");
        sethandleUserName("");
        sethandleLink("");
        setphone("");

   
      } else {
        toast.error(res.data.message || "Registration failed!");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again!"
      );
    } finally {
      setloading(false);
    }
  };

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1f2937",
            color: "#fff",
            borderRadius: "10px",
            border: "1px solid #4b5563",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div
          className="bg-gradient-to-br from-purple-900 to-purple-800 border border-purple-600 rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Partner Signup</h2>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-purple-300 hover:text-white text-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              autoComplete="off"
              value={name}
              onChange={(e) => setname(e.target.value)}
              placeholder="Full Name"
              disabled={loading}
              className="w-full p-3 mb-4 rounded-xl bg-purple-800/70 text-white border border-purple-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              style={{ fontSize: "16px" }}
            />

            <input
              type="email"
              autoComplete="off"
              placeholder="Email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              disabled={loading}
              className="w-full p-3 mb-4 rounded-xl bg-purple-800/70 text-white border border-purple-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              style={{ fontSize: "16px" }}
            />

            <input
              type="tel"
              autoComplete="off"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => {
                // Allow only numbers
                const value = e.target.value.replace(/\D/g, "");
                setphone(value);
              }}
              disabled={loading}
              maxLength={10}
              className="w-full p-3 mb-4 rounded-xl bg-purple-800/70 text-white border border-purple-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              style={{ fontSize: "16px" }}
            />

            <input
              type="password"
              autoComplete="new-password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              disabled={loading}
              className="w-full p-3 mb-4 rounded-xl bg-purple-800/70 text-white border border-purple-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              style={{ fontSize: "16px" }}
            />

            <input
              type="text"
              autoComplete="off"
              placeholder="Platform (instagram, facebook, etc)"
              value={handle}
              onChange={(e) => sethandle(e.target.value)}
              disabled={loading}
              className="w-full p-3 mb-4 rounded-xl bg-purple-800/70 text-white border border-purple-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              style={{ fontSize: "16px" }}
            />

            <input
              type="text"
              autoComplete="off"
              placeholder="Account Username"
              value={handleUserName}
              onChange={(e) => sethandleUserName(e.target.value)}
              disabled={loading}
              className="w-full p-3 mb-4 rounded-xl bg-purple-800/70 text-white border border-purple-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              style={{ fontSize: "16px" }}
            />

            <input
              type="url"
              autoComplete="off"
              placeholder="Active Profile Link"
              value={handleLink}
              onChange={(e) => sethandleLink(e.target.value)}
              disabled={loading}
              className="w-full p-3 mb-6 rounded-xl bg-purple-800/70 text-white border border-purple-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              style={{ fontSize: "16px" }}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-semibold py-3 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <ClipLoader color="#ffffff" size={20} />
                  <span>Signing Up...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <p className="text-center text-purple-300 text-sm mt-4">
            Already have an account?{" "}
            <span
              onClick={!loading ? onSwitchToLogin : undefined}
              className={`text-pink-400 font-semibold cursor-pointer hover:text-pink-300 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default PartnerSignUP;