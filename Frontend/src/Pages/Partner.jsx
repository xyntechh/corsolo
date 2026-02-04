import React, { useState, useEffect } from "react";
import PartnerSignUP from "../Components/PartnerSignUP";
import PartnerLogin from "../Components/PartnerLogin";

function Partner() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    // Prevent zoom on mobile
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      );
    }

    // Prevent body scroll
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.height = "100%";

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 overflow-y-auto">
      <div className="min-h-full py-8 px-4">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex justify-between items-center backdrop-blur-lg bg-purple-900/40 border border-purple-700 rounded-2xl p-4 shadow-xl">
            <h1 className="text-xl sm:text-3xl font-bold text-white">
              Partner Program
            </h1>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setShowLogin(true)}
                className="px-3 sm:px-4 py-2 bg-purple-700/60 hover:bg-purple-700/80 text-white text-sm sm:text-base rounded-xl font-semibold transition"
              >
                Login
              </button>
              <button
                onClick={() => setShowSignup(true)}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-black text-sm sm:text-base rounded-xl font-semibold transition active:scale-95"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="backdrop-blur-lg bg-purple-900/40 border border-purple-700 rounded-3xl p-6 sm:p-12 shadow-2xl text-center">
            <h2 className="text-2xl sm:text-5xl font-bold text-white mb-4">
              Become Our Partner & Earn Big!
            </h2>
            <p className="text-purple-200 text-base sm:text-xl mb-8">
              Turn your social media presence into a steady income stream. Join
              thousands of partners already earning with us.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-white">
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-4 sm:p-6 min-w-[150px] sm:min-w-[200px] shadow-xl">
                <div className="text-2xl sm:text-4xl font-bold mb-2">
                  ₹5000+
                </div>
                <div className="text-xs sm:text-base">Monthly Income</div>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl p-4 sm:p-6 min-w-[150px] sm:min-w-[200px] shadow-xl">
                <div className="text-2xl sm:text-4xl font-bold mb-2">20%</div>
                <div className="text-xs sm:text-base">Referral Bonus</div>
              </div>
              <div className="bg-gradient-to-br from-pink-600 to-purple-500 rounded-2xl p-4 sm:p-6 min-w-[150px] sm:min-w-[200px] shadow-xl">
                <div className="text-2xl sm:text-4xl font-bold mb-2">24/7</div>
                <div className="text-xs sm:text-base">Support Available</div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-6xl mx-auto mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
            Why Partner With Us?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="backdrop-blur-lg bg-purple-900/40 border border-purple-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition">
              <div className="text-4xl mb-4">💰</div>
              <h4 className="text-xl font-bold text-white mb-2">
                Monetize Your Platform
              </h4>
              <p className="text-purple-200">
                Turn your social media followers into a reliable income source.
                No investment needed!
              </p>
            </div>

            <div className="backdrop-blur-lg bg-purple-900/40 border border-purple-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition">
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="text-xl font-bold text-white mb-2">
                Earn by Referral
              </h4>
              <p className="text-purple-200">
                Get 20% commission on every Subscribtion. Unlimited earning
                potential!
              </p>
            </div>

            <div className="backdrop-blur-lg bg-purple-900/40 border border-purple-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition">
              <div className="text-4xl mb-4">📈</div>
              <h4 className="text-xl font-bold text-white mb-2">
                Monthly ₹5000+ Income
              </h4>
              <p className="text-purple-200">
                Guaranteed minimum earnings once you meet the basic criteria.
                Top earners make 50K+!
              </p>
            </div>

            <div className="backdrop-blur-lg bg-purple-900/40 border border-purple-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition">
              <div className="text-4xl mb-4">🚀</div>
              <h4 className="text-xl font-bold text-white mb-2">
                Easy to Start
              </h4>
              <p className="text-purple-200">
                Simple signup process. Start promoting within minutes and see
                results fast!
              </p>
            </div>

            <div className="backdrop-blur-lg bg-purple-900/40 border border-purple-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition">
              <div className="text-4xl mb-4">📊</div>
              <h4 className="text-xl font-bold text-white mb-2">
                Real-Time Dashboard
              </h4>
              <p className="text-purple-200">
                Track your earnings, referrals, and performance with our
                advanced analytics dashboard.
              </p>
            </div>

            <div className="backdrop-blur-lg bg-purple-900/40 border border-purple-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition">
              <div className="text-4xl mb-4">🎁</div>
              <h4 className="text-xl font-bold text-white mb-2">
                Bonus & Rewards
              </h4>
              <p className="text-purple-200">
                Special bonuses for top performers. Monthly contests with
                exciting prizes!
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-6xl mx-auto mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
            How It Works
          </h3>
          <div className="backdrop-blur-lg bg-purple-900/40 border border-purple-700 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white font-bold text-lg sm:text-xl flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-2">
                    Sign Up for Free
                  </h4>
                  <p className="text-purple-200 text-sm sm:text-base">
                    Create your partner account in less than 2 minutes. No
                    hidden charges or fees.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white font-bold text-lg sm:text-xl flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-2">
                    Get Your Unique Link
                  </h4>
                  <p className="text-purple-200 text-sm sm:text-base">
                    Receive your personalized referral link and promotional
                    materials instantly.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white font-bold text-lg sm:text-xl flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-2">
                    Share & Promote
                  </h4>
                  <p className="text-purple-200 text-sm sm:text-base">
                    Share your link on Instagram, YouTube, WhatsApp, or any
                    platform you prefer.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white font-bold text-lg sm:text-xl flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-2">
                    Start Earning
                  </h4>
                  <p className="text-purple-200 text-sm sm:text-base">
                    Earn commission on every signup and purchase. Withdraw
                    anytime, hassle-free!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="backdrop-blur-lg bg-gradient-to-r from-purple-900/60 to-pink-900/60 border border-purple-600 rounded-3xl p-6 sm:p-12 shadow-2xl text-center">
            <h3 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Ready to Start Earning?
            </h3>
            <p className="text-purple-200 text-base sm:text-lg mb-8">
              Join our partner program today and turn your influence into
              income!
            </p>
            <button
              onClick={() => setShowSignup(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-black font-bold text-base sm:text-lg px-8 sm:px-12 py-3 sm:py-4 rounded-xl shadow-lg transition-all active:scale-95"
            >
              Join Now - It's Free!
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-6xl mx-auto mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="backdrop-blur-lg bg-purple-900/40 border border-purple-700 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white mb-2">
                How much can I earn?
              </h4>
              <p className="text-purple-200 text-sm sm:text-base">
                Partners typically earn ₹5,000-₹50,000+ per month depending on
                their promotion efforts. Top performers make even more!
              </p>
            </div>
            <div className="border-t border-purple-700 pt-6">
              <h4 className="text-base sm:text-lg font-bold text-white mb-2">
                When do I get paid?
              </h4>
              <p className="text-purple-200 text-sm sm:text-base">
                Payments are processed monthly. You can request withdrawal
                anytime after reaching the minimum threshold of ₹1,000.
              </p>
            </div>
            <div className="border-t border-purple-700 pt-6">
              <h4 className="text-base sm:text-lg font-bold text-white mb-2">
                Do I need followers to join?
              </h4>
              <p className="text-purple-200 text-sm sm:text-base">
                No minimum follower requirement! Anyone can join. However,
                having an engaged audience helps you earn more.
              </p>
            </div>
            <div className="border-t border-purple-700 pt-6">
              <h4 className="text-base sm:text-lg font-bold text-white mb-2">
                Is there any joining fee?
              </h4>
              <p className="text-purple-200 text-sm sm:text-base">
                Absolutely not! Our partner program is 100% free to join. No
                hidden charges ever.
              </p>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="backdrop-blur-lg bg-purple-900/40 border border-purple-700 rounded-2xl p-6 shadow-xl text-center">
            <h4 className="text-lg sm:text-xl font-bold text-white mb-3">
              Need Help or Have Questions?
            </h4>
            <p className="text-purple-200 text-sm sm:text-base mb-4">
              Our support team is here to help you succeed!
            </p>
            <a
              href="mailto:corsoloenterprises@gmail.com"
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-black font-semibold text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-3 rounded-xl shadow-lg transition-all active:scale-95 break-all"
            >
              corsoloenterprises@gmail.com
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-6xl mx-auto pb-4">
          <div className="text-center text-purple-300 text-xs sm:text-sm space-y-2">
            <div className="flex flex-wrap justify-center items-center gap-2">
              <a
                href="/terms"
                className="hover:text-pink-400 transition-colors"
              >
                Terms & Conditions
              </a>
              <span>•</span>
              <a
                href="/privacy"
                className="hover:text-pink-400 transition-colors"
              >
                Privacy Policy
              </a>
              <span>•</span>
              <a
                href="/contact"
                className="hover:text-pink-400 transition-colors"
              >
                Contact Us
              </a>
            </div>
            <p>© 2025 Match Anonymous Partner Program. All rights reserved.</p>
          </div>
        </div>
      </div>

      {showLogin && (
        <PartnerLogin
          onClose={() => setShowLogin(false)}
          onSwitchToSignUp={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      )}

      {showSignup && (
        <PartnerSignUP
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      )}
    </div>
  );
}

export default Partner;
