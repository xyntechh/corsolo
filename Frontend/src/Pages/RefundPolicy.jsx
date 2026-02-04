import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RefundPolicy() {
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
        <div className="w-full max-w-3xl backdrop-blur-lg bg-purple-900/40 border border-purple-700 rounded-3xl shadow-2xl p-6 sm:p-10 my-8">
          {/* Header */}
          <div className="flex flex-col gap-3 mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-white tracking-wide">
              Cancellation & Refund Policy
            </h1>
            <p className="text-center text-purple-200 text-sm">
              Last Updated: December 2024
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6 text-purple-100">
            <section className="bg-pink-500/20 border-2 border-pink-400 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">🚫</span>
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    No Refund Policy
                  </h2>
                  <p className="text-sm sm:text-base font-semibold text-pink-200">
                    All payments made on our platform are final and
                    non-refundable.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-purple-800/30 border border-purple-600 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Policy Overview
              </h2>
              <p className="text-sm sm:text-base mb-4">
                We maintain a strict no-refund policy for all services,
                subscriptions, and purchases made through our platform. By
                making a payment, you acknowledge and agree to this policy.
              </p>
              <div className="bg-yellow-500/20 border border-yellow-400 rounded-xl p-4">
                <p className="text-sm sm:text-base">
                  <strong className="text-white">Important:</strong> Please
                  review all service details, features, and pricing carefully
                  before making any purchase. Once payment is processed, it
                  cannot be reversed or refunded.
                </p>
              </div>
            </section>

            <section className="bg-purple-800/30 border border-purple-600 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Why No Refunds?
              </h2>
              <ul className="space-y-3 text-sm sm:text-base">
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 font-bold">•</span>
                  <span>
                    Our service provides immediate access to the platform and
                    matching features upon payment
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 font-bold">•</span>
                  <span>
                    Digital services are consumed instantly and cannot be
                    returned
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 font-bold">•</span>
                  <span>
                    We clearly state that matches are not guaranteed - outcomes
                    vary by user
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 font-bold">•</span>
                  <span>
                    Server costs, infrastructure, and operational expenses are
                    incurred immediately
                  </span>
                </li>
              </ul>
            </section>

            <section className="bg-purple-800/30 border border-purple-600 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Cancellation Policy
              </h2>
              <p className="text-sm sm:text-base mb-3">
                <strong className="text-white">For Subscriptions:</strong> You
                may cancel your subscription at any time to prevent future
                charges. However:
              </p>
              <ul className="space-y-2 text-sm sm:text-base ml-4">
                <li>
                  • No refund will be issued for the current billing period
                </li>
                <li>
                  • You will retain access until the end of the paid period
                </li>
                <li>
                  • Cancellation does not entitle you to a prorated refund
                </li>
              </ul>
              <p className="text-sm sm:text-base mt-4">
                <strong className="text-white">For One-Time Purchases:</strong>{" "}
                These are non-refundable and cannot be canceled once payment is
                processed.
              </p>
            </section>

            <section className="bg-purple-800/30 border border-purple-600 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Exceptional Circumstances
              </h2>
              <p className="text-sm sm:text-base mb-3">
                While we maintain a no-refund policy, we may consider refund
                requests in the following rare cases:
              </p>
              <ul className="space-y-2 text-sm sm:text-base">
                <li>
                  • Technical issues on our end preventing service access for
                  extended periods
                </li>
                <li>• Duplicate charges due to payment processing errors</li>
                <li>• Unauthorized transactions (subject to verification)</li>
              </ul>
              <p className="text-sm sm:text-base mt-4">
                All such cases will be reviewed individually at our sole
                discretion. Contact us at{" "}
                <a
                  href="mailto:corsoloenterprises@gmail.com"
                  className="text-pink-400 hover:text-pink-300 font-semibold"
                >
                  corsoloenterprises@gmail.com
                </a>{" "}
                with supporting evidence.
              </p>
            </section>

            <section className="bg-purple-800/30 border border-purple-600 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Payment Disputes
              </h2>
              <p className="text-sm sm:text-base">
                If you believe a charge was made in error or wish to dispute a
                transaction, please contact us first before initiating a
                chargeback with your payment provider. Chargebacks may result in
                immediate account suspension and legal action.
              </p>
            </section>

            <section className="bg-purple-800/30 border border-purple-600 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Contact Us
              </h2>
              <p className="text-sm sm:text-base">
                For questions about this policy or to discuss specific
                situations, please reach out to our support team at{" "}
                <a
                  href="mailto:corsoloenterprises@gmail.com"
                  className="text-pink-400 hover:text-pink-300 font-semibold"
                >
                  corsoloenterprises@gmail.com
                </a>
              </p>
            </section>

            <section className="bg-purple-800/30 border border-purple-600 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Agreement
              </h2>
              <p className="text-sm sm:text-base">
                By using our service and making any payment, you explicitly
                agree to this Cancellation & Refund Policy. This policy is part
                of our Terms & Conditions and is legally binding.
              </p>
            </section>
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

export default RefundPolicy;
