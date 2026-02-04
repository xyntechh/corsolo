import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-purple-200 text-sm">Last Updated: December 2024</p>
          </div>

          {/* Content */}
          <div className="space-y-5">
            
            {/* Introduction */}
            <div className="bg-purple-800/40 rounded-2xl p-6 border border-purple-600">
              <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
              <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
                Your privacy matters to us. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our chat and matching platform. By using our service, you consent to the data practices described in this policy.
              </p>
            </div>

            {/* Section 1 */}
            <div className="bg-purple-800/40 rounded-2xl p-6 border border-purple-600">
              <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-pink-300 mb-2">Personal Information</h3>
                  <p className="text-purple-100 text-sm sm:text-base mb-2">
                    When you create an account, we collect:
                  </p>
                  <ul className="space-y-1 text-purple-100 text-sm sm:text-base ml-4">
                    <li>• Nickname or display name</li>
                    <li>• Age</li>
                    <li>• Gender</li>
                    <li>• Email address (if applicable)</li>
                    <li>• Profile preferences and settings</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-pink-300 mb-2">Usage Data</h3>
                  <p className="text-purple-100 text-sm sm:text-base mb-2">
                    We automatically collect information about how you interact with our service:
                  </p>
                  <ul className="space-y-1 text-purple-100 text-sm sm:text-base ml-4">
                    <li>• Chat history and messages</li>
                    <li>• Matching preferences and activity</li>
                    <li>• Login times and session duration</li>
                    <li>• Device information (browser, OS, IP address)</li>
                    <li>• Feature usage and interaction patterns</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-pink-300 mb-2">Payment Information</h3>
                  <p className="text-purple-100 text-sm sm:text-base">
                    If you make purchases, payment data is processed securely through third-party payment processors. We do not store complete credit card details on our servers.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-purple-800/40 rounded-2xl p-6 border border-purple-600">
              <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
              <div className="space-y-3 text-purple-100 text-sm sm:text-base">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <p className="font-semibold text-white">Matching & Connections</p>
                    <p className="text-sm">To pair you with compatible users based on preferences and availability</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚙️</span>
                  <div>
                    <p className="font-semibold text-white">Service Improvement</p>
                    <p className="text-sm">To analyze usage patterns and enhance platform features and algorithms</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🛡️</span>
                  <div>
                    <p className="font-semibold text-white">Safety & Security</p>
                    <p className="text-sm">To detect fraud, prevent abuse, and enforce our Terms of Service</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="font-semibold text-white">Communication</p>
                    <p className="text-sm">To send important updates, notifications, and service-related messages</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💳</span>
                  <div>
                    <p className="font-semibold text-white">Billing & Support</p>
                    <p className="text-sm">To process payments and provide customer assistance</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Authenticity Section */}
            <div className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 rounded-2xl p-6 border-2 border-pink-400">
              <h2 className="text-2xl font-bold text-white mb-4">3. Profile Authenticity</h2>
              <div className="bg-purple-900/60 rounded-xl p-4 mb-4">
                <p className="text-white font-semibold text-base mb-2">✅ Our Commitment to Genuine Users</p>
                <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
                  We maintain high standards for profile quality. Approximately <strong className="text-pink-300">90% of profiles</strong> on our platform are genuine, verified users. We actively monitor for fake accounts, bots, and suspicious activity.
                </p>
              </div>
              <div className="bg-yellow-500/20 border border-yellow-400 rounded-xl p-4">
                <p className="text-yellow-100 text-sm sm:text-base">
                  <strong className="text-white">Important Disclaimer:</strong> While we strive for authenticity, we cannot guarantee 100% verification of all users. Some fake or misleading profiles may exist. Please exercise caution, trust your instincts, and report suspicious accounts immediately.
                </p>
              </div>
            </div>

            {/* No Match Guarantee */}
            <div className="bg-red-500/20 border-2 border-red-400 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">4. No Match Guarantee</h2>
              <p className="text-red-100 text-sm sm:text-base leading-relaxed mb-3">
                We want to be completely transparent with you:
              </p>
              <div className="bg-red-900/40 rounded-xl p-4">
                <p className="text-white font-bold text-base mb-2">⚠️ IMPORTANT NOTICE</p>
                <p className="text-red-100 text-sm sm:text-base leading-relaxed">
                  We do NOT guarantee that you will find a match or make successful connections through our platform—even if you purchase premium services. Finding compatible matches depends on many factors beyond our control, including user availability, personal preferences, communication skills, timing, and individual compatibility. Your use of the service and any payments made do not entitle you to guaranteed results.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div className="bg-purple-800/40 rounded-2xl p-6 border border-purple-600">
              <h2 className="text-2xl font-bold text-white mb-4">5. Information Sharing</h2>
              <p className="text-purple-100 text-sm sm:text-base leading-relaxed mb-4">
                We respect your privacy and do not sell your personal information to third parties. However, we may share data in the following circumstances:
              </p>
              <div className="space-y-3">
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-pink-300 font-semibold mb-1">With Other Users</p>
                  <p className="text-purple-200 text-sm sm:text-base">Your profile information (nickname, age, gender) is visible to potential matches as part of the service</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-pink-300 font-semibold mb-1">Service Providers</p>
                  <p className="text-purple-200 text-sm sm:text-base">Trusted third-party vendors who help us operate the platform (hosting, analytics, payment processing)</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-pink-300 font-semibold mb-1">Legal Requirements</p>
                  <p className="text-purple-200 text-sm sm:text-base">When required by law, court order, or to protect rights and safety</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-pink-300 font-semibold mb-1">Business Transfers</p>
                  <p className="text-purple-200 text-sm sm:text-base">In the event of a merger, acquisition, or sale of assets</p>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div className="bg-purple-800/40 rounded-2xl p-6 border border-purple-600">
              <h2 className="text-2xl font-bold text-white mb-4">6. Data Security</h2>
              <p className="text-purple-100 text-sm sm:text-base leading-relaxed mb-3">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="space-y-2 text-purple-100 text-sm sm:text-base ml-4">
                <li>• Encrypted data transmission (SSL/TLS)</li>
                <li>• Secure server infrastructure</li>
                <li>• Regular security audits and updates</li>
                <li>• Access controls and authentication</li>
                <li>• Monitoring for suspicious activity</li>
              </ul>
              <div className="bg-yellow-500/20 border border-yellow-400 rounded-lg p-4 mt-4">
                <p className="text-yellow-100 text-sm sm:text-base">
                  <strong className="text-white">Note:</strong> No internet transmission is 100% secure. While we use reasonable measures to protect your data, we cannot guarantee absolute security. Please use strong passwords and keep your credentials confidential.
                </p>
              </div>
            </div>

            {/* Section 7 */}
            <div className="bg-purple-800/40 rounded-2xl p-6 border border-purple-600">
              <h2 className="text-2xl font-bold text-white mb-4">7. Data Retention</h2>
              <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
                We retain your personal information for as long as your account is active or as needed to provide services. Even after account deletion, some data may be retained for legal compliance, dispute resolution, and fraud prevention as permitted by law.
              </p>
            </div>

            {/* Section 8 */}
            <div className="bg-purple-800/40 rounded-2xl p-6 border border-purple-600">
              <h2 className="text-2xl font-bold text-white mb-4">8. Your Privacy Rights</h2>
              <p className="text-purple-100 text-sm sm:text-base leading-relaxed mb-3">
                You have the following rights regarding your personal data:
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-pink-300 font-semibold text-sm sm:text-base">📋 Access</p>
                  <p className="text-purple-200 text-xs sm:text-sm">Request a copy of your data</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-pink-300 font-semibold text-sm sm:text-base">✏️ Correction</p>
                  <p className="text-purple-200 text-xs sm:text-sm">Update inaccurate information</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-pink-300 font-semibold text-sm sm:text-base">🗑️ Deletion</p>
                  <p className="text-purple-200 text-xs sm:text-sm">Request account and data removal</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-pink-300 font-semibold text-sm sm:text-base">🚫 Opt-Out</p>
                  <p className="text-purple-200 text-xs sm:text-sm">Withdraw consent for processing</p>
                </div>
              </div>
              <p className="text-purple-100 text-sm sm:text-base mt-4">
                To exercise these rights, contact us at{" "}
                <a href="mailto:corsoloenterprises@gmail.com" className="text-pink-400 hover:text-pink-300 font-semibold underline">
                  corsoloenterprises@gmail.com
                </a>
              </p>
            </div>

            {/* Section 9 */}
            <div className="bg-purple-800/40 rounded-2xl p-6 border border-purple-600">
              <h2 className="text-2xl font-bold text-white mb-4">9. Cookies & Tracking Technologies</h2>
              <p className="text-purple-100 text-sm sm:text-base leading-relaxed mb-3">
                We use cookies, web beacons, and similar technologies to:
              </p>
              <ul className="space-y-2 text-purple-100 text-sm sm:text-base ml-4">
                <li>• Remember your login and preferences</li>
                <li>• Analyze platform usage and performance</li>
                <li>• Personalize your experience</li>
                <li>• Deliver targeted content and features</li>
              </ul>
              <p className="text-purple-100 text-sm sm:text-base mt-3">
                You can control cookies through your browser settings, but disabling them may affect functionality.
              </p>
            </div>

            {/* Section 10 */}
            <div className="bg-purple-800/40 rounded-2xl p-6 border border-purple-600">
              <h2 className="text-2xl font-bold text-white mb-4">10. Third-Party Links</h2>
              <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
                Our platform may contain links to external websites or services. We are not responsible for the privacy practices of third-party sites. Please review their privacy policies independently.
              </p>
            </div>

            {/* Section 11 */}
            <div className="bg-purple-800/40 rounded-2xl p-6 border border-purple-600">
              <h2 className="text-2xl font-bold text-white mb-4">11. Children's Privacy</h2>
              <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
                Our service is intended for users aged 18 and above. We do not knowingly collect information from minors. If we discover that a minor has provided us with personal data, we will delete it immediately.
              </p>
            </div>

            {/* Section 12 */}
            <div className="bg-purple-800/40 rounded-2xl p-6 border border-purple-600">
              <h2 className="text-2xl font-bold text-white mb-4">12. International Users</h2>
              <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
                If you access our service from outside your home country, your information may be transferred to and stored in different jurisdictions. By using our platform, you consent to such transfers.
              </p>
            </div>

            {/* Section 13 */}
            <div className="bg-purple-800/40 rounded-2xl p-6 border border-purple-600">
              <h2 className="text-2xl font-bold text-white mb-4">13. Changes to This Policy</h2>
              <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
                We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. The "Last Updated" date at the top indicates when revisions were made. Continued use of our service after changes constitutes acceptance.
              </p>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-purple-700/50 to-pink-700/50 rounded-2xl p-6 border-2 border-purple-500">
              <h2 className="text-2xl font-bold text-white mb-3">Contact Us</h2>
              <p className="text-purple-100 text-sm sm:text-base mb-2">
                If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please reach out:
              </p>
              <a 
                href="mailto:corsoloenterprises@gmail.com"
                className="inline-flex items-center gap-2 text-pink-300 hover:text-pink-200 font-bold text-base underline"
              >
                📧 corsoloenterprises@gmail.com
              </a>
            </div>

          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="w-full mt-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-black font-bold text-lg p-4 rounded-xl shadow-lg transition-all active:scale-95"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;