import React, { useEffect, useState } from "react";
import { BookOpen, ArrowRight, ShieldAlert } from "lucide-react";

/**
 * PromoRotator
 * Do promo cards ek hi jagah par, har 3.5s mein animation ke sath auto change hote hain.
 *
 * Props:
 * - interval: ms mein slide change time (default 3500)
 * - ebookHref / onEbookClick: ebook card ka link ya handler
 * - exposeHref / onExposeClick: "Catch Her Cheating First" card ka link ya handler
 * - className: spacing ke liye (e.g. "my-4")
 */
function PromoRotator({
  interval = 3500,
  ebookHref = "/eBook",
  onEbookClick,
  exposeHref = "/eBook",
  onExposeClick,
  className = "",
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const slides = [
    {
      key: "ebook",
      label: "Free ebook: How to Start Better Chats",
      border: "border-purple-500/60",
      glow: "shadow-[0_0_18px_rgba(147,51,234,0.25)]",
      bg: "from-indigo-600/25 via-purple-600/20 to-[#1B1B27]",
      iconBg: "from-indigo-600 to-purple-600 shadow-purple-900/50",
      icon: <BookOpen size={20} className="text-white" />,
      title: "Want better conversations?",
      sub: (
        <>
          Get our guide{" "}
          <span className="font-semibold text-purple-300">
            "How to Start Better Chats"
          </span>
        </>
      ),
      cta: "Get free guide",
      ctaClass: "bg-orange-500 hover:bg-orange-400",
      ctaIcon: <ArrowRight size={15} />,
      href: ebookHref,
      onClick: onEbookClick,
    },
    {
      key: "expose",
      label: "Catch her cheating first",
      border: "border-rose-500/60",
      glow: "shadow-[0_0_18px_rgba(244,63,94,0.25)]",
      bg: "from-rose-600/25 via-orange-600/15 to-[#1B1B27]",
      iconBg: "from-rose-600 to-orange-500 shadow-rose-900/50",
      icon: <ShieldAlert size={20} className="text-white" />,
      title: "Catch Her Cheating First",
      sub: (
        <>
          Find out the truth{" "}
          <span className="font-semibold text-rose-300">
            before it hurts you
          </span>
        </>
      ),
      cta: "Expose her",
      ctaClass: "bg-rose-600 hover:bg-rose-500",
      ctaIcon: <ArrowRight size={15} />,
      href: exposeHref,
      onClick: onExposeClick,
    },
  ];

  // auto change
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(id);
  }, [paused, interval, slides.length]);

  return (
    <div
      className={className}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* All slides stacked in one grid cell, so height never jumps */}
      <div className="grid">
        {slides.map((s, i) => {
          const isActive = i === active;
          return (
            <section
              key={s.key}
              aria-label={s.label}
              aria-hidden={!isActive}
              className={`col-start-1 row-start-1 flex items-center gap-3 rounded-md border bg-gradient-to-r px-3 py-2.5 transition-all duration-500 ease-out motion-reduce:transition-none sm:gap-4 sm:px-4 ${s.border} ${s.glow} ${s.bg} ${
                isActive
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-3 opacity-0"
              }`}
            >
              {/* Icon */}
              <div
                aria-hidden="true"
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gradient-to-br shadow-md sm:h-11 sm:w-11 ${s.iconBg}`}
              >
                {s.icon}
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold leading-tight text-white">
                  {s.title}
                </h3>
                <p className="mt-0.5 text-xs leading-snug text-gray-300">
                  {s.sub}
                </p>
              </div>

              {/* CTA: icon only on mobile, text on sm+ */}
              <a
                href={s.href}
                tabIndex={isActive ? 0 : -1}
                aria-label={s.cta}
                onClick={(e) => {
                  if (s.onClick) {
                    e.preventDefault();
                    s.onClick();
                  }
                }}
                className={`flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md px-3 text-xs font-semibold text-white transition active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${s.ctaClass}`}
              >
                {s.ctaIcon}
                <span className="hidden sm:inline">{s.cta}</span>
              </a>
            </section>
          );
        })}
      </div>

      {/* Dots */}
      <div className="mt-2 flex justify-center gap-1.5">
        {slides.map((s, i) => (
          <button
            key={s.key}
            type="button"
            aria-label={`Show ${s.label}`}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-5 bg-purple-400" : "w-1.5 bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default PromoRotator;