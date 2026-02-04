import React, { useState } from "react";
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
} from "lucide-react";
import EmailPopup from "./EmailPopup";
import { useUser } from "../Context/UserContext";
import toast from "react-hot-toast";
import axios from "axios";

export default function AddCoin({ onClose }) {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [openEmailPopup, setOpenEmailPopup] = useState({
    open: false,
    package: null,
  });
  const { user, loading, setUser } = useUser(); //USER INFORMATION FROM USE CONTEXT

  const coinPackages = [
 
    {
      id: 3,
      coins: 149,
      price: 149,
      popular: true,
      bonus: 0,
    },
    {
      id: 4,
      coins: 249,
      price: 249,
      popular: false,

    },
    {
      id: 5,
      coins: 499,
      price: 499,
      popular: false,
    },

    {
      id: 6,
      coins: 799,
      price: 799,
      popular: false,
    },


      {
      id: 7,
      coins: 999,
      price: 999,
      popular: false,
    },
  ];

  const paymentMethods = [
    { id: "upi", name: "UPI", icon: Smartphone },
    { id: "card", name: "Card", icon: CreditCard },
    { id: "wallet", name: "Wallet", icon: Wallet },
    { id: "netbanking", name: "Banking", icon: Building2 },
  ];

  const token = localStorage.getItem("authToken");

  const handlePurchase = async () => {
    try {
      if (!selectedPackage) {
        toast.error("Please select a coin package");
        return;
      }

      if (user?.isGuest) {
        setOpenEmailPopup({
          open: true,
          package: selectedPackage,
        });
        return;
      }

      const paymentRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/razorpay/payment-link`,
        {
          plan: selectedPackage.id,
          email: user?.email,
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
        window.location.href = redirectUrl;
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-3 sm:p-4">
      <div className="bg-white w-full max-w-[420px] rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 sm:p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white hover:bg-white/20 rounded-full p-1.5 transition-all"
          >
            <X size={20} />
          </button>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl mb-2">💰</div>
            <h2 className="text-xl sm:text-2xl font-bold">Add Coins</h2>
            <p className="text-purple-100 text-xs sm:text-sm mt-1">
              Unlock premium features
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[70vh] overflow-y-auto">
          {/* Benefits Section */}
          <div className="p-4 sm:p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base flex items-center gap-2">
              <Sparkles size={18} className="text-purple-600" />
              What you get with coins
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <MessageCircle
                  size={16}
                  className="text-purple-600 flex-shrink-0"
                />
                <span className="text-gray-700">Unlimited Random Chat</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-pink-600 flex-shrink-0" />
                <span className="text-gray-700">See who liked</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-orange-600 flex-shrink-0" />
                <span className="text-gray-700">Get Better Match</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift size={16} className="text-red-600 flex-shrink-0" />
                <span className="text-gray-700">Send gifts</span>
              </div>
            </div>
          </div>

          {/* Coin Packages */}
          <div className="p-4 sm:p-5">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
              Select Package
            </h3>
            <div className="space-y-2.5">
              {coinPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`relative p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPackage?.id === pkg.id
                      ? "border-purple-600 bg-purple-50 shadow-md scale-[1.02]"
                      : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-sm"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap">
                      🔥 MOST POPULAR
                    </div>
                  )}
                  {pkg.discount && (
                    <div className="absolute -top-2.5 right-3 bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold">
                      {pkg.discount}
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg sm:text-xl font-bold text-purple-600 flex items-center gap-1">
                        💎 {pkg.coins}
                        {pkg.bonus > 0 && (
                          <span className="text-sm sm:text-base text-green-500">
                            +{pkg.bonus}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] sm:text-xs text-gray-500">
                        {pkg.bonus > 0
                          ? `Total: ${pkg.coins + pkg.bonus} coins`
                          : "coins"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-bold text-gray-800">
                        ₹{pkg.price}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-500">
                        1 coin = ₹1
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="px-4 sm:px-5 pb-4">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
              Payment Method
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <div
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-2.5 sm:p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${
                      paymentMethod === method.id
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 bg-white hover:border-purple-300"
                    }`}
                  >
                    <IconComponent
                      size={20}
                      className={`mx-auto mb-1 ${
                        paymentMethod === method.id
                          ? "text-purple-600"
                          : "text-gray-600"
                      }`}
                    />
                    <div className="text-xs sm:text-sm font-medium text-gray-700">
                      {method.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Special Offer Banner */}
          <div className="mx-4 sm:mx-5 mb-4 p-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl text-center">
            <div className="text-white font-bold text-xs sm:text-sm">
              🎉 Get 40% extra coins on ₹250+ packages!
            </div>
          </div>
        </div>

        {/* Purchase Button - Fixed at bottom */}
        <div className="p-4 sm:p-5 pt-0 bg-white">
          <button
            onClick={handlePurchase}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <Heart size={18} fill="white" />
            {selectedPackage
              ? `Pay ₹${selectedPackage.price} • Get ${
                  selectedPackage.coins + selectedPackage.bonus
                } Coins`
              : "Select a Package"}
          </button>
          <p className="text-center text-[10px] sm:text-xs text-gray-500 mt-2 flex items-center justify-center gap-1">
            <Check size={12} className="text-green-500" />
            Secure payment • 100% safe
          </p>
        </div>
        <EmailPopup
          isOpen={openEmailPopup.open}
          selectedPackage={openEmailPopup.package}
          onClose={() => setOpenEmailPopup({ open: false, package: null })}
        />
      </div>

      <style>
        {`
  @keyframes scale-in {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  .animate-scale-in {
    animation: scale-in 0.2s ease-out;
  }
  `}
      </style>
    </div>
  );
}
