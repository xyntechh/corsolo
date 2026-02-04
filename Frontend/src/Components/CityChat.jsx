import React, { useEffect, useState } from "react";
import { MapPin, Users, Shield, Zap, MessageCircle, Globe } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const CityChat = () => {
  const { city } = useParams();
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(3);

  const formattedCity =
    city?.charAt(0).toUpperCase() + city?.slice(1).toLowerCase();

  const handleStartChat = () => {
    localStorage.setItem("selectedCity", city);
    navigate(`/?city=${city}`);
  };

  useEffect(() => {
    localStorage.setItem("selectedCity", city);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const redirectTimer = setTimeout(() => {
      handleStartChat();
    }, 3000);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownInterval);
    };
  }, [city]);

  const features = [
    { icon: <Shield className="w-5 h-5" />, title: "Safe & Anonymous", desc: "No login required" },
    { icon: <Zap className="w-5 h-5" />, title: "Fast Match", desc: "Get connected in seconds" },
    { icon: <Users className="w-5 h-5" />, title: "Local Chat", desc: `People from ${formattedCity}` },
    { icon: <Globe className="w-5 h-5" />, title: "Free Forever", desc: "Always 100% free" }
  ];

  return (
    <>
      {/* SEO Dynamic */}
      <Helmet>
        <title>Chat with People from {formattedCity} - Free, Secure & Instant</title>
        <meta
          name="description"
          content={`Meet and chat with strangers online from ${formattedCity}. No registration needed. Safe, fast and anonymous chat free forever.`}
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 relative overflow-hidden">
        {/* Gradient Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-violet-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
          {/* Main Card */}
          <div className="bg-white/15 backdrop-blur-xl shadow-2xl rounded-3xl p-8 md:p-12 w-full max-w-2xl border border-white/30 mb-8 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <MapPin className="w-10 h-10 text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 text-center leading-tight">
              {formattedCity} Chat
            </h1>

            <p className="text-xl text-purple-100 mb-8 text-center font-medium">
              Connecting with people in {formattedCity}…
            </p>

            <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl p-6 mb-8 border border-white/20">
              <div className="flex items-center justify-center gap-3 mb-3">
                <MessageCircle className="w-6 h-6 text-white animate-bounce" />
                <p className="text-white font-semibold text-lg">
                  Finding someone for you...
                </p>
              </div>

              <div className="flex justify-center gap-2">
                {Array(3).fill().map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Manual Connect Button */}
            <button
              onClick={handleStartChat}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white font-bold py-4 px-8 w-full rounded-2xl transition-all duration-300 text-lg shadow-2xl transform hover:scale-105 active:scale-95"
            >
              Start Chatting Now →
            </button>

            {countdown > 0 && (
              <p className="text-center text-purple-100 mt-4 text-sm font-medium">
                Auto-connecting in {countdown} sec…
              </p>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mb-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex justify-center mb-3 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-white font-bold text-sm">{feature.title}</h3>
                <p className="text-purple-100 text-xs">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* SEO Section */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-10 w-full max-w-4xl border border-white/20">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
              Chat with Local People in {formattedCity}
            </h2>

            <p className="text-purple-100 leading-relaxed mb-6">
              Meet strangers from {formattedCity} instantly. Our chat platform connects you with real local people for fun conversations, learning, and friendships — free & anonymous!
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-purple-200 text-xs">
              © {new Date().getFullYear()} {formattedCity} Chat — Safe & Free
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CityChat;
