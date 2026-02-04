import React, { useEffect, useState } from 'react';
import { CheckCircle, Mail, Clock, Code, Sparkles, Heart, Globe, Zap } from 'lucide-react';

export default function ValentinePaymentSuccess() {
  const [hearts, setHearts] = useState([]);

  // Generate floating hearts
  useEffect(() => {
    const interval = setInterval(() => {
      const newHeart = {
        id: Math.random(),
        left: Math.random() * 100,
        size: 12 + Math.random() * 20,
        duration: 5 + Math.random() * 3
      };
      setHearts(prev => [...prev.slice(-12), newHeart]);
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-rose-800 to-red-900 flex items-center justify-center p-3 sm:p-4 md:p-6 relative overflow-hidden">
      
      {/* Floating Hearts Background */}
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="fixed pointer-events-none z-0"
          style={{
            left: `${heart.left}%`,
            bottom: '-50px',
            animation: `float-up ${heart.duration}s ease-in-out`,
            fontSize: `${heart.size}px`,
            opacity: 0.15
          }}
        >
          <Heart fill="currentColor" className="text-pink-400" />
        </div>
      ))}

      {/* Decorative Background Blobs */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl"></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl"></div>
      <div className="fixed top-1/2 left-1/3 w-64 h-64 bg-red-500/15 rounded-full blur-3xl"></div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Main Card */}
        <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-pink-400/30 overflow-hidden animate-scale-in">
          
          {/* Success Icon Header */}
          <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-6 sm:p-8 text-center relative overflow-hidden">
            {/* Decorative hearts */}
            <div className="absolute top-4 left-4 opacity-20 animate-pulse">
              <Heart size={40} fill="white" className="text-white" />
            </div>
            <div className="absolute bottom-4 right-4 opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}>
              <Heart size={40} fill="white" className="text-white" />
            </div>
            
            <div className="flex justify-center mb-3 sm:mb-4 relative">
              <div className="bg-white rounded-full p-2 sm:p-3 animate-bounce shadow-2xl">
                <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-pink-600" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 px-2">
              🎉 Congratulations! 🎉
            </h1>
            <p className="text-pink-100 text-base sm:text-lg px-2">
              Your purchase is complete!
            </p>
          </div>

          {/* Content Section */}
          <div className="p-4 sm:p-6 md:p-10">
            
            {/* Code & Globe Icons */}
            <div className="flex justify-center gap-4 mb-4 sm:mb-6">
              <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg animate-pulse-slow">
                <Code className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              <div className="bg-gradient-to-r from-rose-600 to-red-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg animate-pulse-slow" style={{ animationDelay: '0.3s' }}>
                <Globe className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
            </div>

            {/* Main Title */}
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-300 via-rose-300 to-red-300 bg-clip-text text-transparent mb-2">
                Get Ready to Impress Your Crush! 💝
              </h2>
              <p className="text-pink-200 text-sm sm:text-base">
                Your exclusive Valentine's website is being prepared
              </p>
            </div>

            {/* Main Message */}
            <div className="bg-pink-900/30 border-2 border-pink-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 backdrop-blur-sm">
              <div className="flex items-start gap-2 sm:gap-3 mb-4">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 flex-shrink-0 mt-1 animate-pulse" />
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                    Your Website Code & Link Coming Soon! 🚀
                  </h3>
                  <p className="text-sm sm:text-base text-pink-100 leading-relaxed mb-3">
                    We're creating something special for you to impress your crush! 
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3 mb-4">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm sm:text-base text-pink-100 leading-relaxed">
                    <span className="font-semibold text-pink-300">Within 24 hours</span>, you'll receive via email:
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-800/40 to-rose-800/40 rounded-lg p-4 space-y-3 border border-pink-500/20">
                <div className="flex items-start gap-3">
                  <div className="bg-pink-600 rounded-full p-1 flex-shrink-0 mt-0.5">
                    <Code className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm sm:text-base text-white font-medium">Complete website source code</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-pink-600 rounded-full p-1 flex-shrink-0 mt-0.5">
                    <Globe className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm sm:text-base text-white font-medium">Live website link ready to share</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-pink-600 rounded-full p-1 flex-shrink-0 mt-0.5">
                    <Heart className="w-3 h-3 text-white" fill="currentColor" />
                  </div>
                  <span className="text-sm sm:text-base text-white font-medium">Customization guide to make it yours</span>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3 mt-4">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400 flex-shrink-0 mt-1" />
                <p className="text-sm sm:text-base text-pink-100">
                  Please check your inbox (and spam folder) regularly!
                </p>
              </div>
            </div>

            {/* What Makes It Special Box */}
            <div className="bg-gradient-to-br from-pink-800/30 to-rose-800/30 border-2 border-pink-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 animate-pulse" />
                <h3 className="text-base sm:text-lg font-semibold text-white">What Makes It Special:</h3>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Heart className="w-4 h-4 text-pink-400 flex-shrink-0 mt-1" fill="currentColor" />
                  <span className="text-sm sm:text-base text-pink-100">Fully customizable Valentine's themed design</span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Heart className="w-4 h-4 text-pink-400 flex-shrink-0 mt-1" fill="currentColor" />
                  <span className="text-sm sm:text-base text-pink-100">Mobile-responsive and modern interface</span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Heart className="w-4 h-4 text-pink-400 flex-shrink-0 mt-1" fill="currentColor" />
                  <span className="text-sm sm:text-base text-pink-100">Easy to edit and personalize messages</span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Heart className="w-4 h-4 text-pink-400 flex-shrink-0 mt-1" fill="currentColor" />
                  <span className="text-sm sm:text-base text-pink-100">Professional animations and effects</span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Heart className="w-4 h-4 text-pink-400 flex-shrink-0 mt-1" fill="currentColor" />
                  <span className="text-sm sm:text-base text-pink-100">Lifetime access & updates</span>
                </div>
              </div>
            </div>

            {/* Pro Tip Box */}
            <div className="bg-yellow-900/20 border-2 border-yellow-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-4 sm:mb-6 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-yellow-300 mb-1">💡 Pro Tip:</h4>
                  <p className="text-xs sm:text-sm text-yellow-100 leading-relaxed">
                    Once you receive the code, customize it with your crush's name and favorite colors to make it extra special! ✨
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-pink-900/30 border-2 border-pink-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 text-center backdrop-blur-sm">
              <p className="text-sm sm:text-base text-pink-100 mb-3 sm:mb-4">
                Questions? We're here to help! 💬
              </p>
              <a 
                href="mailto:corsoloenterprises@gmail.com"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:from-pink-700 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-pink-500/50 break-all"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-xs sm:text-sm md:text-base">corsoloenterprises@gmail.com</span>
              </a>
            </div>

            {/* Thank You Message */}
            <div className="text-center pt-4 sm:pt-6 border-t-2 border-pink-500/20">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Heart size={28} className="text-pink-400 animate-pulse" fill="currentColor" />
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-300">
                  Thank You!
                </h3>
                <Heart size={28} className="text-pink-400 animate-pulse" fill="currentColor" />
              </div>
              <p className="text-sm sm:text-base text-pink-200 px-2 mb-2">
                Get ready to create magic this Valentine's Day! 💝
              </p>
              <p className="text-xs sm:text-sm text-pink-300/70 px-2">
                Your crush is going to love what you've got planned! 🌹
              </p>
            </div>

          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-4 sm:mt-6 px-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart size={16} className="text-pink-400" fill="currentColor" />
            <span className="text-pink-300 text-xs sm:text-sm font-medium">Made with Love for Valentine's Day</span>
            <Heart size={16} className="text-pink-400" fill="currentColor" />
          </div>
          <p className="text-pink-400/70 text-xs sm:text-sm">
            © 2026 Corsolo Enterprises. All rights reserved.
          </p>
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

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

 
