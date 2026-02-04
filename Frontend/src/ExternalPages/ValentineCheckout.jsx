import React, { useState } from "react";
import {
  Heart,
  ShoppingBag,
  Gift,
  Sparkles,
  Lock,
  CheckCircle2,
  CreditCard,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function ValentineCheckout() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    note: "",
  });

  const [errors, setErrors] = useState({});
  const [hearts, setHearts] = useState([]);

  // Generate floating hearts
  React.useEffect(() => {
    const interval = setInterval(() => {
      const newHeart = {
        id: Math.random(),
        left: Math.random() * 100,
        size: 12 + Math.random() * 20,
        duration: 5 + Math.random() * 3,
      };
      setHearts((prev) => [...prev.slice(-12), newHeart]);
    }, 600);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePurchase = async () => {
    if (!formData.fullName || !formData.email || !formData.contactNumber) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const paymentRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/razorpay/valentine-payment-link`,
        {
          name: formData.fullName,
          email: formData.email,
          phone: formData.contactNumber,
          note: formData.note,
        },
      );

      toast.success("Redirecting to payment...");

      const redirectUrl = paymentRes.data?.url;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-rose-800 to-red-900 py-8 px-4 relative overflow-hidden">
      <Toaster position="top-center" />

      {/* Floating Hearts Background */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="fixed pointer-events-none z-0"
          style={{
            left: `${heart.left}%`,
            bottom: "-50px",
            animation: `float-up ${heart.duration}s ease-in-out`,
            fontSize: `${heart.size}px`,
            opacity: 0.15,
          }}
        >
          <Heart fill="currentColor" className="text-pink-400" />
        </div>
      ))}

      {/* Decorative Background Blobs */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl"></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl"></div>
      <div className="fixed top-1/2 left-1/3 w-64 h-64 bg-red-500/15 rounded-full blur-3xl"></div>

      <div className="max-w-md mx-auto relative z-10">
        {/* Product Card */}
        <div className="bg-gradient-to-br from-pink-800/80 to-rose-800/80 backdrop-blur-xl rounded-3xl p-6 mb-6 border-2 border-pink-400/30 shadow-2xl animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-2xl p-4 shadow-lg">
              <Gift className="text-white" size={40} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">
                Catch Her Cheating First
              </h3>
              <p className="text-pink-200 text-sm mb-3">
                Deepages | Dating Guides
              </p>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-white">₹199</span>
                <span className="text-pink-300 line-through">₹2,499</span>
                <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  92% OFF
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl p-8 border-2 border-pink-400/30 shadow-2xl animate-slide-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-3 rounded-full mb-4 shadow-lg">
              <ShoppingBag size={20} />
              <span className="font-bold">Complete Your Purchase</span>
            </div>
          </div>

          <form className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-pink-200 text-sm font-semibold mb-2">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3.5 bg-gray-800/50 border-2 ${
                  errors.fullName ? "border-red-500" : "border-gray-700"
                } rounded-xl text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all`}
              />
              {errors.fullName && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-pink-200 text-sm font-semibold mb-2">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className={`w-full px-4 py-3.5 bg-gray-800/50 border-2 ${
                  errors.email ? "border-red-500" : "border-gray-700"
                } rounded-xl text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all`}
              />
              <p className="text-gray-400 text-xs mt-1.5">
                Your ebook will be sent to this email
              </p>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-pink-200 text-sm font-semibold mb-2">
                Contact Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className={`w-full px-4 py-3.5 bg-gray-800/50 border-2 ${
                  errors.contactNumber ? "border-red-500" : "border-gray-700"
                } rounded-xl text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all`}
              />
              {errors.contactNumber && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.contactNumber}
                </p>
              )}
            </div>

            {/* Special Note (Optional) */}
            <div>
              <label className="block text-pink-200 text-sm font-semibold mb-2">
                Add a Special Note (Optional) 💌
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Add a romantic message or special instructions..."
                rows="3"
                className="w-full px-4 py-3.5 bg-gray-800/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all resize-none"
              />
              <p className="text-gray-400 text-xs mt-1.5">
                Make it extra special with a personal message 💝
              </p>
            </div>

            {/* What You'll Get */}
            <div className="bg-gradient-to-br from-pink-900/30 to-rose-900/30 rounded-2xl p-5 border border-pink-500/20">
              <h4 className="text-pink-300 font-bold text-sm mb-3 flex items-center gap-2">
                <Sparkles size={16} />
                What You'll Get:
              </h4>
              <div className="space-y-2.5">
                {[
                  "Instant Digital Download",
                  "Lifetime Access",
                  "Monthly Updates",
                  "Premium Support",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <CheckCircle2
                      className="text-green-400 flex-shrink-0"
                      size={18}
                    />
                    <span className="text-gray-200 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePurchase}
              type="button"
              className="group relative w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center gap-3">
                <CreditCard
                  className="group-hover:rotate-12 transition-transform duration-300"
                  size={24}
                />
                <span>Pay Now - ₹199</span>
                <Heart
                  className="group-hover:scale-125 transition-transform duration-300"
                  fill="currentColor"
                  size={20}
                />
              </div>
            </button>

            {/* Security Info */}
            <div className="text-center pt-2">
              <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
                <Lock size={14} />
                <span>Secure payment processing</span>
              </div>
              <p className="text-gray-500 text-xs mt-1">
                No refunds • Educational content only
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-400 text-xs">
          <p>Protected by secure encryption • 500+ satisfied customers</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Heart size={16} className="text-pink-400" fill="currentColor" />
            <span className="text-pink-300">
              Made with Love for Valentine's Day
            </span>
            <Heart size={16} className="text-pink-400" fill="currentColor" />
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
