import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";
import { useUser } from "../../Context/UserContext";
import toast from "react-hot-toast";
import axios from "axios";

export default function GuestPaymentDetails({ setGuestPaymentDetails }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setloading] = useState(false);

  const isValid = email.trim().length > 3 && password.trim().length >= 6;

  //context
  const { selected, packages } = useUser();
  const token = localStorage.getItem("authToken");

  const handleGuestPurchase = async () => {
    if (!email || !password) {
      return toast.error("Please fill all details");
    }

    setloading(true);

    try {
      //UPDATE USER
      const updateUser = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/update`,
        {
          email: email,
          password: password,
          isGuest: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!updateUser.data?.success) {
        toast.error(updateUser.data?.message || "Registration failed");
        return;
      }

      //CREATE PAYMENT LINK
      const selectedPackage = packages.find((pkg) => pkg.id === selected);

      if (!selectedPackage) {
        toast.error("Invalid package selected");
        return;
      }

      const paymentRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/razorpay/payment-link`,
        {
          plan: selectedPackage.id,
          email: email,
          amount: selectedPackage.price, // Razorpay paise mein chahta hai
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const redirectUrl = paymentRes.data?.url;

      if (redirectUrl) {
        // clear inputs before leaving the page
        setEmail("");
        setPassword("");
        window.location.href = redirectUrl;
      } else {
        toast.error("Payment link not received");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="md:h-screen flex items-center justify-center lg:p-4">
      <div className="max-w-md sm:[50vh] w-full bg-[#1c1c24] rounded-md p-6 shadow-2xl">
        {/* Header */}
        <h2 className="text-white text-2xl font-bold mb-1">
          Continue to Payment
        </h2>
        <p className="text-gray-400 text-sm mb-5">
          Create your account to securely proceed to checkout.
        </p>

        {/* Email input */}
        <div className="bg-[#26262f] rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
          <Mail size={18} className="text-gray-500 shrink-0" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            disabled={loading}
            className="w-full bg-transparent text-gray-300 placeholder-gray-500 outline-none text-sm disabled:opacity-50"
          />
        </div>

        {/* Password input */}
        <div className="bg-[#26262f] rounded-xl px-4 py-3 mb-2 flex items-center gap-3">
          <Lock size={18} className="text-gray-500 shrink-0" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={loading}
            className="w-full bg-transparent text-gray-300 placeholder-gray-500 outline-none text-sm disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            disabled={loading}
            className="text-gray-500 hover:text-gray-300 transition-colors shrink-0 disabled:opacity-50"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Security note */}
        <div className="flex items-center gap-1.5 mb-6 px-1">
          <ShieldCheck size={13} className="text-gray-500" />
          <span className="text-gray-500 text-xs">
            Your details are encrypted and never stored in plain text.
          </span>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setGuestPaymentDetails(false)}
            disabled={loading}
            className="text-gray-400 font-semibold px-5 py-2.5 rounded-xl hover:text-white hover:bg-[#26262f] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            disabled={!isValid || loading}
            onClick={handleGuestPurchase}
            className={`font-semibold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2 ${
              isValid && !loading
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-[#3a3a44] text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Redirecting." : "Continue to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}