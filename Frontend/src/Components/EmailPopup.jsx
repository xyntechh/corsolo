import React, { useEffect, useState } from "react";
import {
  Heart,
  MessageCircle,
  Eye,
  Gift,
  Zap,
  CreditCard,
  Wallet,
  Building2,
  Smartphone,
  X,
  Check,
  Sparkles,
  Mail,
} from "lucide-react";
import axios from "axios";
import { useUser } from "../Context/UserContext";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";

export default function EmailPopup({ isOpen, onClose, selectedPackage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  //FATCH TOKEN FROM GET ITEM
  const token = localStorage.getItem("authToken");

  const { fetchUser, user } = useUser();

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setPassword("");
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // CASE 1: If Guest → Convert first
      if (user?.isGuest) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/user/update`,
          { email, password, isGuest: false },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await fetchUser();
        toast.success("Profile updated successfully");
      }

      // CASE 2: Payment API → Redirect to payment link
      const paymentRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/razorpay/payment-link`,
        {
          plan: selectedPackage.id,
          email: user?.email || email,
          amount: selectedPackage.price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Redirecting to payment...");

      // Redirect to payment URL
      const redirectUrl = paymentRes.data?.url;
      if (redirectUrl) {
        // IMPORTANT: Do NOT setLoading(false) before redirect
        window.location.href = redirectUrl;
        return; // stop execution
      }

      fetchUser();
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  fetchUser();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-3 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-xl border border-pink-200 relative animate-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1.5 transition-all"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-5">
          <div className="text-4xl mb-2">📧</div>
          <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Enter your Email
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">
            We'll send your receipt & coin details here
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative flex items-center">
            <Mail className="absolute left-3 text-purple-500" size={20} />

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full pl-11 sm:pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200
            focus:border-purple-500 focus:ring-4 focus:ring-purple-100
            outline-none text-gray-800 placeholder-gray-400 text-sm sm:text-base
            transition-all duration-200"
            />
          </div>

          <div className="relative flex items-center">
            <Eye className="absolute left-3 text-purple-500" size={20} />

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-11 sm:pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200
            focus:border-purple-500 focus:ring-4 focus:ring-purple-100
            outline-none text-gray-800 placeholder-gray-400 text-sm sm:text-base
            transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3 sm:py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm sm:text-base
    rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <ClipLoader size={18} color="#fff" />
            ) : (
              <>
                <Mail size={18} />
                Proceed to Payment
              </>
            )}
          </button>
        </form>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slide-up {
            from {
              transform: translateY(100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }

          .animate-slide-up {
            animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @media (min-width: 640px) {
            @keyframes slide-up {
              from {
                transform: translateY(30px);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
          }
        `}</style>
      </div>
    </div>
  );
}
