import React from 'react';
import { CheckCircle, Mail, Clock, BookOpen, Sparkles } from 'lucide-react';

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-700 overflow-hidden">
          
          {/* Success Icon Header */}
          <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-6 sm:p-8 text-center">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="bg-white rounded-full p-2 sm:p-3 animate-bounce">
                <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-pink-600" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 px-2">
              Payment Successful! 🎉
            </h1>
            <p className="text-pink-100 text-base sm:text-lg px-2">
              Your order has been confirmed
            </p>
          </div>

          {/* Content Section */}
          <div className="p-4 sm:p-6 md:p-10">
            
            {/* Book Icon */}
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl">
                <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
            </div>

            {/* Main Message */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
                    Your E-book is On Its Way!
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    Your e-book <span className="text-pink-400 font-semibold">"Catch Her Cheating First"</span> will be sent to your email within <span className="text-pink-400 font-semibold">24 hours</span>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500 flex-shrink-0 mt-1" />
                <p className="text-sm sm:text-base text-slate-300">
                  Please check your inbox (and spam folder) for the download link.
                </p>
              </div>
            </div>

            {/* Features Box */}
            <div className="bg-gradient-to-br from-pink-900/20 to-rose-900/20 border border-pink-800/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
                <h3 className="text-base sm:text-lg font-semibold text-white">What You'll Get:</h3>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm sm:text-base text-slate-300">Instant Digital Download</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm sm:text-base text-slate-300">Lifetime Access</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm sm:text-base text-slate-300">Monthly Updates</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm sm:text-base text-slate-300">Premium Support</span>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 text-center">
              <p className="text-sm sm:text-base text-slate-300 mb-3 sm:mb-4">
                Have any questions or concerns?
              </p>
              <a 
                href="mailto:corsoloenterprises@gmail.com"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:from-pink-700 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 active:scale-95 break-all"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-xs sm:text-sm md:text-base">corsoloenterprises@gmail.com</span>
              </a>
            </div>

            {/* Thank You Message */}
            <div className="text-center pt-4 sm:pt-6 border-t border-slate-700">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400 mb-2">
                Thank You! ❤️
              </h3>
              <p className="text-sm sm:text-base text-slate-400 px-2">
                We appreciate your purchase and trust in us
              </p>
            </div>

          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-4 sm:mt-6 text-slate-400 text-xs sm:text-sm px-2">
          <p>© 2024 Corsolo Enterprises. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}