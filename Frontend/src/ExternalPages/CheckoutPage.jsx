import { useState } from "react";
import toast from "react-hot-toast"
import axios from "axios"

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handlePurchase = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const paymentRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/razorpay/ebook-payment-link`,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
      );
      toast.success("Redirecting to payment...");
      // Redirect to payment URL
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
    <div className="min-h-screen bg-black text-white font-sans py-6 px-4 sm:py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        {/* Product Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-2xl">
          <div className="flex items-start gap-4">
            {/* Book Icon */}
            <div className="flex-shrink-0 bg-gradient-to-br from-pink-500 to-pink-600 p-4 sm:p-5 rounded-xl shadow-lg">
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>

            {/* Product Info */}
            <div className="flex-grow">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                Catch Her Cheating First
              </h1>
              <p className="text-sm sm:text-base text-gray-400 mb-3">
                Deepages | Dating Guides
              </p>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-pink-500">
                  ₹499
                </span>
                <span className="text-lg sm:text-xl line-through text-gray-500">
                  ₹6,238
                </span>
                <span className="bg-green-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                  92% OFF
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-pink-600 to-pink-500 px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
              Complete Your Purchase
            </h2>
          </div>

          <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm sm:text-base font-semibold mb-2"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all"
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm sm:text-base font-semibold mb-2"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all"
              />
              <p className="text-xs sm:text-sm text-gray-400 mt-1.5">
                Your ebook will be sent to this email
              </p>
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm sm:text-base font-semibold mb-2"
              >
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all"
              />
            </div>

            {/* Features List */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-sm sm:text-base mb-3 text-pink-400">
                What You'll Get:
              </h3>
              {[
                "Instant Digital Download",
                "Lifetime Access",
                "Monthly Updates",
                "Premium Support",
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-xs sm:text-sm text-gray-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePurchase}
              className="w-full bg-gradient-to-r from-pink-500 via-pink-600 to-pink-500 hover:from-pink-600 hover:via-pink-700 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-xl text-base sm:text-lg md:text-xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-pink-500/50 transform"
            >
              🔒 Pay Now - ₹499
            </button>

            {/* Security Note */}
            <div className="text-center space-y-1">
              <p className="text-xs sm:text-sm text-gray-400">
                🔐 Secure payment processing
              </p>
              <p className="text-xs text-gray-500">
                No refunds • Educational content only
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            Protected by secure encryption • 500+ satisfied customers
          </p>
        </div>
      </div>
    </div>
  );
}
