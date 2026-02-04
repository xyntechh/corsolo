import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ContactUs() {
  useEffect(() => {
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

  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl backdrop-blur-lg bg-purple-900/40 border border-purple-700 rounded-3xl shadow-2xl p-6 sm:p-10 my-8">
          {/* Header */}
          <div className="flex flex-col gap-3 mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-white tracking-wide">
              Contact Us
            </h1>
            <p className="text-center text-purple-200 text-sm sm:text-base">
              We're here to help! Reach out to us anytime.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="bg-purple-800/30 border border-purple-600 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Get in Touch
              </h2>
              <p className="text-purple-200 text-sm sm:text-base mb-4">
                Have questions, concerns, or feedback? We'd love to hear from
                you. Our support team is ready to assist you with any inquiries.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-purple-300 text-sm font-medium mb-2">
                    Email Support
                  </p>
                  <a
                    href="mailto:corsoloenterprises@gmail.com"
                    className="text-pink-400 hover:text-pink-300 text-base sm:text-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    📧 corsoloenterprises@gmail.com
                  </a>
                </div>

                <div className="pt-4 border-t border-purple-600">
                  <p className="text-purple-300 text-sm">
                    <strong className="text-white">Response Time:</strong> We
                    typically respond within 24-48 hours during business days.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-800/30 border border-purple-600 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Before You Contact
              </h3>
              <ul className="space-y-2 text-purple-200 text-sm sm:text-base">
                <li>
                  • Please check our Terms & Conditions and Privacy Policy first
                </li>
                <li>
                  • Include relevant details in your message for faster
                  assistance
                </li>
                <li>• Be respectful - our team is here to help you</li>
              </ul>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="w-full mt-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-black font-semibold p-4 rounded-xl shadow-lg transition-all active:scale-95"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
