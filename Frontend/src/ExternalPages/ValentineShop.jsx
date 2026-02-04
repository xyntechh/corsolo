import React, { useState, useEffect } from "react";
import {
  Heart,
  Gift,
  Sparkles,
  ShoppingBag,
  Star,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ValentineShop() {
  const [hearts, setHearts] = useState([]);
  const [scrollY, setScrollY] = useState(0);

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/valantineCheckOut");
  };

  useEffect(() => {
    // Floating hearts animation
    const interval = setInterval(() => {
      const newHeart = {
        id: Math.random(),
        left: Math.random() * 100,
        size: 15 + Math.random() * 25,
        duration: 4 + Math.random() * 3,
        delay: Math.random() * 2,
      };
      setHearts((prev) => [...prev.slice(-15), newHeart]);
    }, 400);

    // Parallax scroll effect
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-900 via-rose-800 to-red-900 overflow-hidden">
      {/* Floating Hearts Background */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="fixed pointer-events-none z-0"
          style={{
            left: `${heart.left}%`,
            bottom: "-50px",
            animation: `float-up ${heart.duration}s ease-in-out`,
            animationDelay: `${heart.delay}s`,
            fontSize: `${heart.size}px`,
            opacity: 0.2,
          }}
        >
          <Heart fill="currentColor" className="text-pink-400" />
        </div>
      ))}

      {/* Decorative Background Elements */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl"></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl"></div>
      <div className="fixed top-1/2 left-1/3 w-64 h-64 bg-red-500/15 rounded-full blur-3xl"></div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-5 flex items-center justify-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Heart
              size={40}
              className="text-pink-400 animate-pulse"
              fill="currentColor"
            />
            <Sparkles
              size={20}
              className="absolute -top-1 -right-1 text-rose-300"
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-300 via-rose-300 to-red-300 bg-clip-text text-transparent">
            Impress Your Crush
          </h1>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-20">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-800/60 backdrop-blur-sm rounded-full border-2 border-pink-400/30 shadow-lg animate-bounce-slow">
            <Star className="text-yellow-400" size={20} fill="currentColor" />
            <span className="text-sm font-semibold text-pink-200">
              Valentine's Day Special Collection
            </span>
            <Star className="text-yellow-400" size={20} fill="currentColor" />
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h2 className="text-7xl md:text-8xl font-black leading-none tracking-tight">
              <span
                className="block text-pink-300 drop-shadow-sm"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Impress Your
              </span>
              <span
                className="block bg-gradient-to-r from-pink-400 via-rose-300 to-red-400 bg-clip-text text-transparent animate-gradient"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Crush
              </span>
            </h2>
            <p
              className="text-2xl md:text-3xl font-light text-pink-200 max-w-3xl mx-auto leading-relaxed"
              style={{ fontFamily: "'Crimson Text', serif" }}
            >
              With the Most <span className="font-bold italic">Unique</span> &{" "}
              <span className="font-bold italic">Romantic</span> Gifts
            </p>
          </div>

          {/* Taglines */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {[
              { icon: Heart, text: "Express Love Uniquely" },
              { icon: Gift, text: "Curated with Passion" },
              { icon: Sparkles, text: "Moments to Remember" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-5 py-3 bg-pink-800/50 backdrop-blur-sm rounded-full shadow-md border border-pink-400/30"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <item.icon size={20} className="text-pink-300" />
                <span className="font-medium text-pink-200">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="pt-8 animate-bounce">
            <ChevronDown size={32} className="text-pink-400 mx-auto" />
            <p className="text-sm text-pink-300 font-medium">
              Scroll to discover
            </p>
          </div>
        </div>
      </section>

      {/* Video Reference Section */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h3
            className="text-5xl font-bold text-pink-200 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            See The Magic ✨
          </h3>
          <p className="text-xl text-pink-300">
            Watch how our gifts create unforgettable moments
          </p>
        </div>

        {/* Video Container - Instagram Reel Style */}
        <div className="relative group flex justify-center">
          {/* Decorative Frame */}
          <div className="absolute -inset-4 bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>

          <div className="relative bg-gradient-to-br from-pink-900/90 to-rose-900/70 backdrop-blur-sm rounded-3xl p-4 shadow-2xl border-4 border-pink-500/30 max-w-md w-full">
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ aspectRatio: "9/16" }}
            >
              {/* Instagram Reel Style Video - Vertical, Autoplay, Loop, No Controls */}
              <video
                className="w-full h-full object-cover"
                autoPlay
                loop
                playsInline
              >
                <source
                  src="https://res.cloudinary.com/debwsr9bs/video/upload/v1770112739/snapsave-app_3823075752724211066_zg7rtp.mp4"
                  type="video/mp4"
                />
              </video>

              {/* Decorative hearts overlay */}
              <div className="absolute top-6 left-6 pointer-events-none">
                <Heart
                  size={28}
                  className="text-pink-300 opacity-40 animate-pulse"
                  fill="currentColor"
                />
              </div>
              <div className="absolute bottom-6 right-6 pointer-events-none">
                <Heart
                  size={24}
                  className="text-rose-300 opacity-40 animate-pulse"
                  fill="currentColor"
                  style={{ animationDelay: "0.5s" }}
                />
              </div>
              <div className="absolute top-20 right-8 pointer-events-none">
                <Sparkles
                  size={20}
                  className="text-yellow-300 opacity-40 animate-pulse"
                  style={{ animationDelay: "0.3s" }}
                />
              </div>
            </div>
          </div>

          {/* Floating decorative elements */}
          <div className="absolute -top-8 -left-8 w-20 h-20 bg-pink-500 rounded-full opacity-30 blur-2xl"></div>
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-rose-500 rounded-full opacity-30 blur-2xl"></div>
        </div>
      </section>

      {/* Shop CTA Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <div className="relative">
          {/* Glowing background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 rounded-3xl blur-2xl opacity-40 animate-pulse-slow"></div>

          <div className="relative bg-gradient-to-br from-pink-700 via-rose-700 to-red-700 rounded-3xl p-12 shadow-2xl border-4 border-pink-400/30 overflow-hidden">
            {/* Decorative patterns */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative text-center space-y-8">
              {/* Discount Badge */}
              <div className="inline-block relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-2xl blur-xl animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-yellow-300 to-yellow-400 px-8 py-4 rounded-2xl transform -rotate-2 shadow-2xl border-4 border-white">
                  <div className="flex items-center gap-3">
                    <Gift size={32} className="text-red-700" />
                    <div className="text-left">
                      <p className="text-5xl font-black text-red-700 leading-none">
                        92% OFF
                      </p>
                      <p className="text-sm font-bold text-red-600">
                        Until Valentine's Day
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Heading */}
              <div className="space-y-3">
                <h3
                  className="text-5xl md:text-6xl font-black text-white leading-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Start Shopping Now!
                </h3>
                <p className="text-xl text-pink-200 max-w-2xl mx-auto">
                  Limited time offer • Exclusive Valentine's collection • Free
                  gift wrapping
                </p>
              </div>

              {/* Features */}
              <div className="flex flex-wrap justify-center gap-6 py-4">
                {[
                  "🎁 Premium Packaging",
                  "💌 Personal Message Card",
                  "🚚 Express Delivery",
                  "💝 Satisfaction Guaranteed",
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium border border-white/30"
                  >
                    {feature}
                  </div>
                ))}
              </div>

              {/* Shop Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleNavigate}
                  className="group relative inline-flex items-center gap-4 px-12 py-6 bg-white text-pink-700 rounded-2xl font-black text-2xl shadow-2xl hover:shadow-pink-300/50 transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-rose-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <ShoppingBag
                    size={32}
                    className="relative group-hover:rotate-12 transition-transform duration-300"
                  />
                  <span className="relative">Shop Valentine's Collection</span>
                  <ArrowRight
                    size={32}
                    className="relative group-hover:translate-x-2 transition-transform duration-300"
                  />
                </button>
              </div>

              {/* Countdown Timer */}
              <div className="pt-6">
                <p className="text-pink-200 text-sm font-medium mb-2">
                  ⏰ Offer ends in:
                </p>
                <div className="flex justify-center gap-4">
                  {[
                    { value: "12", label: "Days" },
                    { value: "08", label: "Hours" },
                    { value: "34", label: "Minutes" },
                  ].map((time, i) => (
                    <div
                      key={i}
                      className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[80px] border border-white/30"
                    >
                      <div className="text-3xl font-bold text-white">
                        {time.value}
                      </div>
                      <div className="text-xs text-pink-200">{time.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 mt-20">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Heart size={24} className="text-pink-400" fill="currentColor" />
            <span className="text-xl font-bold text-pink-300">
              Made with Love for You
            </span>
            <Heart size={24} className="text-pink-400" fill="currentColor" />
          </div>
          <p className="text-pink-400/70 text-sm">
            © 2026 Impress Your Crush • Make Every Moment Special • This
            Valentine's Day
          </p>
        </div>
      </footer>

      {/* CSS Animations */}
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Crimson+Text:wght@400;600&display=swap");

        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        * {
          font-family:
            system-ui,
            -apple-system,
            sans-serif;
        }
      `}</style>
    </div>
  );
}
