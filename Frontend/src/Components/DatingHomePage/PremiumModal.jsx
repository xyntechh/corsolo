import { useState, useEffect } from "react";
import { X, Coins, Check, MessageCircle, Sparkles, Heart, Gift, ShieldCheck , Gem} from "lucide-react";

const perks = [
  { icon: MessageCircle, label: "Unlimited random chat" },
  { icon: Sparkles, label: "Better match quality" },
  { icon: Heart, label: "See who liked you" },
  { icon: Gift, label: "Send gifts" },
];

// Bonus % is real info (bigger pack = better rate) — shown as a plain
// "Save X%" chip, the way a SaaS pricing table shows annual savings.
const packages = [
  { id: "infinity", coins: "Infinity", price: 999, note: "Unlimited, forever", popular: true },
  { id: "p199", coins: 199, price: 199, bonus: 0 },
  { id: "p299", coins: 299, price: 299, bonus: 5 },
  { id: "p499", coins: 499, price: 499, bonus: 10 },
  { id: "p799", coins: 799, price: 799, bonus: 15 },
  { id: "p999", coins: 999, price: 999, bonus: 20 },
];

export default function PremiumModal({ setShowPremium }) {
  const [selected, setSelected] = useState("infinity");

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const close = () => setShowPremium(false);

  return (
    <div
      onClick={close}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-3 py-3 backdrop-blur-sm transition-opacity duration-300 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className={`no-scrollbar w-full max-w-md md:max-w-2xl lg:max-w-3xl max-h-full overflow-y-auto rounded-xl border border-white/10 bg-[#121016] shadow-2xl transition-all duration-300 ${
          mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>

        {/* Header — flat, plan-selector style */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/15">
              <Gem className="w-4 h-4 text-purple-400" />
            </span>
            <div>
              <h2 className="text-white font-semibold text-[15px] leading-tight">
                Add Coins
              </h2>
              <p className="text-neutral-500 text-[11.5px] leading-tight">
                Choose a coin package to continue
              </p>
            </div>
          </div>
          <button
            onClick={close}
            aria-label="Close"
            className="text-neutral-500 hover:text-white transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="px-5 py-4 md:px-6">
          {/* Perks — plain feature checklist, SaaS style */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 mb-5 rounded-lg bg-white/[0.02] border border-white/5 px-3.5 py-3">
            {perks.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 shrink-0 text-purple-400" />
                <span className="text-[12px] text-neutral-300 truncate">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Packages */}
          <p className="text-neutral-400 text-[11px] font-medium uppercase tracking-wider mb-2">
            Select a package
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2.5 mb-5">
            {packages.map((pkg) => (
              <PackageTile
                key={pkg.id}
                pkg={pkg}
                selected={selected === pkg.id}
                onSelect={() => setSelected(pkg.id)}
              />
            ))}
          </div>

          {/* CTA */}
          <button className="w-full rounded-lg bg-purple-600 py-3 font-semibold text-white text-sm tracking-wide hover:bg-purple-500 active:scale-[0.99] transition">
            Continue to payment
          </button>
          <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Secure payment · 100% safe
          </p>
        </div>
      </div>
    </div>
  );
}

function PackageTile({ pkg, selected, onSelect }) {
  const isInfinity = pkg.id === "infinity";
  return (
    <button
      onClick={onSelect}
      className={`relative flex md:aspect-square flex-col items-center justify-center gap-1 rounded-lg border px-2 py-4 text-center transition-colors duration-150 ${
        selected
          ? "border-purple-500 bg-purple-500/[0.08]"
          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
      }`}
    >
      {/* Radio indicator — SaaS billing-card pattern */}
      <span
        className={`absolute top-2 right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full border transition-colors ${
          selected ? "border-purple-500 bg-purple-500" : "border-neutral-600"
        }`}
      >
        {selected && <Check className="w-2 h-2 text-white" strokeWidth={4} />}
      </span>

      {pkg.popular && (
        <span className="absolute top-2 left-2 rounded bg-purple-500/15 px-1.5 py-[1px] text-[8px] font-semibold uppercase tracking-wide text-purple-300">
          Popular
        </span>
      )}
      {pkg.bonus > 0 && (
        <span className="absolute top-2 left-2 rounded bg-emerald-500/15 px-1.5 py-[1px] text-[8px] font-semibold text-emerald-400">
          Save {pkg.bonus}%
        </span>
      )}

      <Gem
        className={`w-4 h-4 mt-2 ${
          selected ? "text-purple-300" : "text-neutral-500"
        }`}
      />
      <p className="font-semibold text-white text-[13px] leading-none">
        {pkg.coins}
      </p>
      <p className="text-[11px] text-neutral-500 leading-none">
        ₹{pkg.price}
      </p>
      {isInfinity && (
        <p className="hidden md:block text-[9px] text-neutral-600 leading-none mt-0.5">
          {pkg.note}
        </p>
      )}
    </button>
  );
}