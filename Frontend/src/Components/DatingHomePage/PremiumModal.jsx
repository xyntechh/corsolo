import { useState } from "react";
import { X, Crown, Sparkles, ChevronDown } from "lucide-react";

const plans = [
  {
    id: "basic",
    name: "Basic Plan",
    nameColor: "text-emerald-400",
    price: 199,
    coin: 199,
    button: "bg-emerald-600 hover:bg-emerald-500",
    ring: "",
    features: [
      "Ad-free experience",
      "Unlimited messages",
      "Basic chat customization",
      "Standard support",
    ],
  },
  {
    id: "plus",
    name: "Plus Plan",
    nameColor: "text-indigo-400",
    price: 299,
    coin: 299,
    button: "bg-indigo-600 hover:bg-indigo-500",
    ring: "ring-2 ring-fuchsia-500",
    features: [
      "Everything in Basic, plus:",
      "Priority message delivery",
      "Exclusive profile badges",
      "Custom themes and stickers",
      "Priority support",
    ],
  },

  {
    id: "plus",
    name: "Plus Plan",
    nameColor: "text-indigo-400",
    price: 299,
    coin: 299,
    button: "bg-indigo-600 hover:bg-indigo-500",
    ring: "ring-2 ring-fuchsia-500",
    features: [
      "Everything in Basic, plus:",
      "Priority message delivery",
      "Exclusive profile badges",
      "Custom themes and stickers",
      "Priority support",
    ],
  },
];

function PlanCard({ plan, yearly, onToggleYearly }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`flex flex-col rounded-md border border-neutral-700 bg-neutral-900 p-5`}
    >
      <h3 className={`text-xl font-bold mb-2 ${plan.nameColor}`}>
        {plan.name}
      </h3>

      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-3xl font-extrabold text-white">
          ₹{plan.price}
        </span>
        <span className="text-neutral-400 text-sm">/Get</span>
      </div>
      <p className="text-neutral-400 text-sm mb-4">{`${plan.coin} coin`}</p>

      <button
        className={`w-full py-2.5 rounded-lg font-bold text-white text-sm tracking-wide transition ${plan.button}`}
      >
        SUBSCRIBE
      </button>
    </div>
  );
}

export default function PremiumModal({ setShowPremium }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center  px-4 py-8">
      <div className="w-[90vw] md:w-[60vw] sm:w-[60vw]  lg:w-[60vw] rounded-md overflow-scroll border border-neutral-800 bg-neutral-900 shadow-xl">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-blue-500 px-6 pt-6 pb-10">
          <div className="flex items-center justify-between">
            <span className="text-white font-bold text-xl">Premium</span>
            <button
              onClick={() => setShowPremium(false)}
              aria-label="Close"
              className="text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-center -mb-14 mt-2">
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center rotate-[8deg] shadow-lg">
              <img src="https://app.chitchat.gg/images/crown.gif" alt="" />
              <Sparkles className="w-3.5 h-3.5 text-white absolute top-1 left-1" />
              <Sparkles className="w-3 h-3 text-white absolute bottom-1 right-1" />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="pt-16 pb-6 px-6">
          <h2 className="text-center text-2xl font-bold text-white mb-1">
            Pick a plan
          </h2>
          <p className="text-center text-neutral-400 text-sm mb-6">
            Choose what works best for you
          </p>

          {/* Plans */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>

          <p className="text-center text-neutral-500 text-xs mt-6">
            Be respectful and follow our{" "}
            <a href="#" className="text-blue-400 underline">
              chat rules
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
