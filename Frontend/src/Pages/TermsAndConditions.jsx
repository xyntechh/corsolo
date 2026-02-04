import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function TermsAndConditions() {
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

  const navigate = useNavigate()

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl backdrop-blur-lg bg-purple-900/40 border border-purple-700 rounded-3xl shadow-2xl p-6 sm:p-10 my-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Terms & Conditions
            </h1>
            <p className="text-purple-200 text-sm">Effective Date: December 2024</p>
          </div>

          {/* Content */}
          <div className="space-y-5">
            
            {/* Section 1 */}
            <div className="bg-purple-800/40 rounded-2xl p-6 border border-purple-600">
              <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
              <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
                By creating an account or using our chat and matching platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree, you must discontinue use immediately.
              </p>
            </div>

            {/* Section 2 */}
            <div className="bg-purple-800/40 rounded-2xl p-6 border border-purple-600">
              <h2 className="text-2xl font-bold text-white mb-4">2. Service Overview</h2>
              <p className="text-purple-100 text-sm sm:text-base leading-relaxed mb-3">
                Our platform is a social networking and matching service designed to connect users for chat and friendship. We provide the technology and infrastructure but do not control user interactions.
              </p>
              <div className="bg-red-500/20 border-2 border-red-400 rounded-xl p-4 mt-4">
                <p className="text-white font-bold text-base mb-2">⚠️ NO MATCH GUARANTEE</p>
                <p className="text-red-100 text-sm sm:text-base">
                  We explicitly DO NOT guarantee that you will find a match, make connections, or achieve any specific outcome through our service. Success depends on factors including user availability, preferences, communication skills, and timing—all beyond our control. Payment grants access to features only, not results.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-purple-800/40 rounded-2xl p-6 border border-purple-600">
              <h2 className="text-2xl font-bold text-white mb-4">3. User Eligibility & Account</h2>
              <div className="space-y-3 text-purple-100 text-sm sm:text-base">
                <p><strong className="text-white">Age Requirement:</strong> You must be 18+ years old to use this service.</p>
                <p><strong className="text-white">Accurate Information:</strong> You agree to provide truthful, current information during registration.</p>
                <p><strong className="text-white">Account Security:</strong> You are solely responsible for maintaining the confidentiality of your password and account credentials.</p>
                <p><strong className="text-white">One Account Policy:</strong> Creating multiple accounts is strictly prohibited and may result in permanent ban.</p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="bg-purple-800/40 rounded-2xl p-6 border border-purple-600">
              <h2 className="text-2xl font-bold text-white mb-4">4. Prohibited Activities</h2>
              <p className="text-purple-100 text-sm sm:text-base mb-3">
                The following behaviors are strictly forbidden and will result in immediate account termination:
              </p>
              <div className="grid sm:grid-cols-2 gap-3 text-sm sm:text-base">
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-pink-300 font-semibold mb-1">• Harassment & Abuse</p>
                  <p className="text-purple-200 text-xs sm:text-sm">Threatening, bullying, or harassing other users</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-pink-300 font-semibold mb-1">• Explicit Content</p>
                  <p className="text-purple-200 text-xs sm:text-sm">Sharing pornographic or sexually explicit material</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-pink-300 font-semibold mb-1">• Fraud & Scams</p>
                  <p className="text-purple-200 text-xs sm:text-sm">Soliciting money, running scams, or deceptive practices</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-pink-300 font-semibold mb-1">• Fake Profiles</p>
                  <p className="text-purple-200 text-xs sm:text-sm">Impersonating others or creating fraudulent accounts</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-pink-300 font-semibold mb-1">• Spam & Bots</p>
                  <p className="text-purple-200 text-xs sm:text-sm">Automated messages, commercial spam, or bot usage</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-pink-300 font-semibold mb-1">• Platform Abuse</p>
                  <p className="text-purple-200 text-xs sm:text-sm">Hacking attempts, exploits, or system manipulation</p>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="bg-purple-800/40 rounded-2xl p-6 border border-purple-600">
              <h2 className="text-2xl font-bold text-white mb-4">5. Payment & Billing</h2>
              <div className="space-y-3 text-purple-100 text-sm sm:text-base">
                <p>All fees are charged in advance and are non-refundable unless legally required. By purchasing any service or subscription, you agree to our no-refund policy.</p>
                <div className="bg-yellow-500/20 border border-yellow-400 rounded-lg p-4 mt-3">
                  <p className="text-yellow-100 font-semibold">
                    💳 Payment does NOT guarantee matches, connections, or any specific results. You are paying for platform access and features only.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div className="bg-purple-800/40 rounded-2xl p-6 border border-purple-600">
              <h2 className="text-2xl font-bold text-white mb-4">6. Account Suspension & Termination</h2>
              <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
                We reserve the right to suspend, terminate, or permanently ban any account at our sole discretion for violations of these terms, suspicious activity, or any behavior we deem harmful to the community. No refunds will be issued for terminated accounts.
              </p>
            </div>

            {/* Section 7 */}
            <div className="bg-purple-800/40 rounded-2xl p-6 border border-purple-600">
              <h2 className="text-2xl font-bold text-white mb-4">7. Disclaimer of Warranties</h2>
              <p className="text-purple-100 text-sm sm:text-base leading-relaxed mb-3">
                Our service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied. We do not warrant that:
              </p>
              <ul className="space-y-2 text-purple-100 text-sm sm:text-base ml-4">
                <li>• The service will be uninterrupted or error-free</li>
                <li>• You will achieve any particular results or make connections</li>
                <li>• All user profiles are genuine or accurate</li>
                <li>• The platform will meet all your expectations</li>
              </ul>
            </div>

            {/* Section 8 */}
            <div className="bg-purple-800/40 rounded-2xl p-6 border border-purple-600">
              <h2 className="text-2xl font-bold text-white mb-4">8. Limitation of Liability</h2>
              <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
                To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service. This includes but is not limited to: failed connections, emotional distress, financial losses, or negative experiences with other users. You use our platform at your own risk.
              </p>
            </div>

            {/* Section 9 */}
            <div className="bg-purple-800/40 rounded-2xl p-6 border border-purple-600">
              <h2 className="text-2xl font-bold text-white mb-4">9. User Content & Behavior</h2>
              <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
                You are solely responsible for all content you share and interactions you have on our platform. We are not responsible for user-generated content or the actions of other users. You agree to interact respectfully and legally at all times.
              </p>
            </div>

            {/* Section 10 */}
            <div className="bg-purple-800/40 rounded-2xl p-6 border border-purple-600">
              <h2 className="text-2xl font-bold text-white mb-4">10. Intellectual Property</h2>
              <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
                All platform content, features, design, logos, and trademarks are owned by us or our licensors. You may not copy, modify, distribute, or reverse engineer any part of our service without explicit written permission.
              </p>
            </div>

            {/* Section 11 */}
            <div className="bg-purple-800/40 rounded-2xl p-6 border border-purple-600">
              <h2 className="text-2xl font-bold text-white mb-4">11. Modifications to Terms</h2>
              <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
                We may update these Terms and Conditions at any time. Changes will be effective immediately upon posting. Your continued use of the service constitutes acceptance of modified terms.
              </p>
            </div>

            {/* Section 12 */}
            <div className="bg-purple-800/40 rounded-2xl p-6 border border-purple-600">
              <h2 className="text-2xl font-bold text-white mb-4">12. Governing Law</h2>
              <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
                These terms shall be governed by and construed in accordance with applicable laws. Any disputes shall be resolved through binding arbitration or in courts of appropriate jurisdiction.
              </p>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-purple-700/50 to-pink-700/50 rounded-2xl p-6 border-2 border-purple-500">
              <h2 className="text-2xl font-bold text-white mb-3">Questions?</h2>
              <p className="text-purple-100 text-sm sm:text-base">
                If you have any questions about these Terms and Conditions, please contact us at{" "}
                <a 
                  href="mailto:corsoloenterprises@gmail.com" 
                  className="text-pink-300 hover:text-pink-200 font-bold underline"
                >
                  corsoloenterprises@gmail.com
                </a>
              </p>
            </div>

          </div>

          {/* Back Button */}
          <button
            onClick={()=>navigate("/")}
            className="w-full mt-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-black font-bold text-lg p-4 rounded-xl shadow-lg transition-all active:scale-95"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;