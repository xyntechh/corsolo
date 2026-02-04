import { useNavigate } from "react-router-dom";

export default function EbookPage() {
  const navigate = useNavigate();


  const handleCheckout = () =>{

    navigate("/checkOutPage")

    
  } 

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Section */}
          <div className="space-y-4 sm:space-y-6">
            {/* Hero Image */}
            <div className="relative bg-gray-900 rounded-lg sm:rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=600&fit=crop"
                alt="Couple"
                className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
              />
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-red-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold rounded shadow-lg">
                WARNING
              </div>
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                <div className="bg-red-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-bold rounded-t shadow-lg">
                  Patterns To
                </div>
                <div className="bg-black bg-opacity-90 text-white px-2 sm:px-3 py-1 sm:py-2 text-base sm:text-xl md:text-2xl font-bold mt-0.5 sm:mt-1 rounded-b shadow-lg leading-tight">
                  FIND IF SHE IS
                  <br />
                  CHEATING
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Catch Her Cheating First
            </h1>

            {/* Price Tag */}
            <div className="inline-block bg-gradient-to-r from-pink-500 to-pink-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 font-bold text-xs sm:text-sm md:text-base rounded-lg shadow-lg">
              ₹199 | <span className="line-through opacity-75">₹2499</span>{" "}
              Dating Guide
            </div>

            {/* Guide Content */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-lg sm:rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-xl">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600">
                In this HOT Guide You Will Learn:
              </h2>

              <ul className="space-y-2 sm:space-y-3">
                {[
                  "How To Turn Her Cheating Into Advantage.",
                  "Must-Understand Having a Behavior of Her",
                  "Her Location Identifier Technique",
                  "How To Be Calm Everytime she cheats. (Simple Training!)",
                  "How to Make Her Reply Fast",
                  'How To Reply When she Says "She Need Space"',
                  "How To Stop Her Posting Those Thirst Online.",
                  "How TO Block her male Friends (It Damn Tricks)",
                  "and Monthly More Tricks (Every Month)",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2 sm:gap-3">
                    <span className="text-pink-500 mt-0.5 sm:mt-1 font-bold text-sm sm:text-base flex-shrink-0">
                      •
                    </span>
                    <span className="text-xs sm:text-sm md:text-base text-gray-200 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="pt-3 sm:pt-4 mt-4 sm:mt-6 border-t border-gray-700">
                <p className="text-xs sm:text-sm text-gray-400 italic">
                  I will be waiting inside for you.
                </p>
                <p className="text-xs sm:text-sm md:text-base font-bold mt-1 sm:mt-2">
                  Good Luck,
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-900 border border-yellow-600 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg">
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-300 leading-relaxed">
                <span className="font-bold text-yellow-500">
                  ⚠️ Disclaimer:
                </span>{" "}
                we are not responsible for any outcomes or breakup between you
                and your partner. This is just educational and informational
                purpose only & Be Stay.
              </p>
            </div>
          </div>

          {/* Right Section - Purchase Card */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 rounded-lg sm:rounded-xl overflow-hidden shadow-2xl">
              {/* Price and Button */}
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide font-semibold">
                    Limited Time Offer
                  </p>
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
                      ₹199
                    </span>
                    <span className="text-lg sm:text-xl md:text-2xl line-through text-gray-500">
                      ₹2,499
                    </span>
                  </div>
                  <div className="inline-block bg-green-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold">
                    92% OFF
                  </div>
                </div>

                <button 
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-pink-500 via-pink-600 to-pink-500 hover:from-pink-600 hover:via-pink-700 hover:to-pink-600 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl text-base sm:text-lg md:text-xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-pink-500/50 transform">
                  🔥 I want this!
                </button>

                <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-3">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Instant Digital Download</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Lifetime Access</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Monthly Updates Included</span>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-3 sm:pt-4 mt-3 sm:mt-4">
                  <p className="text-center text-xs sm:text-sm text-red-400 font-semibold">
                    ⚠️ No refunds allowed
                  </p>
                  <p className="text-center text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-2">
                    Educational content only
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3">
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-2 sm:p-3 text-center">
                <p className="text-xs sm:text-sm font-bold text-white">500+</p>
                <p className="text-[10px] sm:text-xs text-gray-400">
                  Happy Readers
                </p>
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-2 sm:p-3 text-center">
                <p className="text-xs sm:text-sm font-bold text-white">4.8★</p>
                <p className="text-[10px] sm:text-xs text-gray-400">
                  Average Rating
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
