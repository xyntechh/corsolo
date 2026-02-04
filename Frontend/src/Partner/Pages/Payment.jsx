import React from 'react';
import { Lock, UserPlus, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import { useUser } from '../../Context/UserContext';

function Payment() {
  const { accountDetails } = useUser();
  
  const currentSignups = accountDetails?.partner?.totalSignups || 0;
  const requiredSignups = 5;
  const progress = Math.min((currentSignups / requiredSignups) * 100, 100);
  const isUnlocked = currentSignups >= requiredSignups;

  const [upiId, setUpiId] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleWithdraw = async () => {
    if (!upiId || !amount) {
      alert('Please enter both UPI ID and amount');
      return;
    }
    
    setIsProcessing(true);
    // Add your payment processing logic here
    setTimeout(() => {
      alert('Withdrawal request submitted successfully!');
      setIsProcessing(false);
      setUpiId('');
      setAmount('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border border-gray-100 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00djJoLTJ2LTJoMnptMC00djJoLTJ2LTJoMnptMC00djJoLTJ2LTJoMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>

          {/* Content */}
          <div className="relative">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className={`w-24 h-24 rounded-3xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform ${
                isUnlocked 
                  ? 'bg-gradient-to-br from-green-600 to-emerald-600' 
                  : 'bg-gradient-to-br from-indigo-600 to-purple-600'
              }`}>
                {isUnlocked ? (
                  <CheckCircle className="w-12 h-12 text-white" />
                ) : (
                  <Lock className="w-12 h-12 text-white" />
                )}
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-4">
              {isUnlocked ? 'Payment Unlocked!' : 'Payment Feature Locked'}
            </h1>

            {/* Description */}
            {!isUnlocked && (
              <p className="text-lg text-gray-600 text-center mb-8 leading-relaxed">
                This feature is currently unavailable. To unlock payment withdrawals, you need to complete at least <span className="font-bold text-indigo-600">5 successful signups</span> through your referral link.
              </p>
            )}

            {isUnlocked && (
              <p className="text-lg text-gray-600 text-center mb-8 leading-relaxed">
                Congratulations! You've unlocked payment withdrawals. Enter your UPI ID below to receive payments.
              </p>
            )}

            {/* Progress Section */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 border border-indigo-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <UserPlus className="w-6 h-6 text-indigo-600" />
                  <span className="text-lg font-bold text-gray-900">Your Progress</span>
                </div>
                <span className="text-2xl font-bold text-indigo-600">
                  {currentSignups}/{requiredSignups}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: `${progress}%` }}
                >
                  {progress > 15 && (
                    <span className="text-xs font-bold text-white">{progress.toFixed(0)}%</span>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 text-center">
                {isUnlocked ? (
                  <span className="font-semibold text-green-600">✓ Payment feature unlocked!</span>
                ) : (
                  <>
                    <span className="font-semibold text-indigo-600">{requiredSignups - currentSignups} more signups</span> needed to unlock payments
                  </>
                )}
              </p>
            </div>

            {/* Benefits List */}
            {!isUnlocked && (
              <div className="space-y-3 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  What you'll unlock:
                </h3>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">Instant payment withdrawals to your bank account</p>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">Access to detailed earnings and transaction history</p>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">Multiple payment methods and faster processing</p>
                </div>
              </div>
            )}

            {/* Payment Form - Shows when unlocked */}
            {isUnlocked && (
              <div className="space-y-6 mb-8">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Withdrawal Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        UPI ID
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@paytm"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Amount (₹)
                      </label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-sm text-blue-800">
                        <span className="font-bold">Available Balance:</span> ₹{accountDetails?.partner?.earnings || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CTA Button */}
            {!isUnlocked && (
              <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                Share Your Referral Link
                <ArrowRight className="w-5 h-5" />
              </button>
            )}

            {isUnlocked && (
              <button 
                onClick={handleWithdraw}
                disabled={isProcessing || !upiId || !amount}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Processing...' : 'Request Withdrawal'}
                <ArrowRight className="w-5 h-5" />
              </button>
            )}

            {/* Help Text */}
            <p className="text-sm text-gray-500 text-center mt-6">
              Need help? Contact our support team for assistance
            </p>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/80 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Quick Tip</h4>
              <p className="text-sm text-gray-600">
                {isUnlocked 
                  ? 'Make sure to enter your correct UPI ID. Payments will be processed within 24-48 hours.'
                  : 'Share your referral link on social media, forums, and with friends to reach your signup goal faster. Each successful signup brings you closer to unlocking payments!'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;