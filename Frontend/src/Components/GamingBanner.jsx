import React from 'react'

function GamingBanner() {
  return (
            {/* GAMING BANNER */}
        <div 
          onClick={handleGameClick}
          className="relative cursor-pointer group overflow-hidden rounded-2xl border-2 border-yellow-400 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-100"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 animate-pulse"></div>
          
          {/* Checkered Road Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full grid grid-cols-8 gap-0">
              {[...Array(64)].map((_, i) => (
                <div 
                  key={i} 
                  className={`${(Math.floor(i / 8) + i) % 2 === 0 ? 'bg-white' : 'bg-transparent'}`}
                ></div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 p-5 flex flex-col items-center gap-3">
            {/* Icons */}
            <div className="flex gap-2 items-center">
              <span className="text-4xl animate-bounce">🎮</span>
              <span className="text-4xl animate-bounce" style={{animationDelay: '0.1s'}}>💰</span>
              <span className="text-4xl animate-bounce" style={{animationDelay: '0.2s'}}>🏆</span>
            </div>

            {/* Main Text */}
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-black text-yellow-300 drop-shadow-lg mb-1 tracking-wide">
                PLAY & EARN REAL MONEY!
              </h2>
              <p className="text-white font-bold text-lg sm:text-xl mb-2">
                🎯 Win Cash Playing Games 🎯
              </p>
              <p className="text-yellow-200 text-sm font-semibold">
                ₹100 Bonus on First Deposit | Instant Withdrawal
              </p>
            </div>

            {/* CTA Button */}
            <div className="w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 text-green-900 font-black text-lg py-3 px-6 rounded-xl shadow-lg group-hover:shadow-yellow-400/50 transition-all">
              <div className="flex items-center justify-center gap-2">
                <span>PLAY NOW</span>
                <span className="text-xl">→</span>
              </div>
            </div>

            {/* Small Text */}
            <p className="text-xs text-yellow-100 font-semibold">
              ⚡ Live Games • 24/7 Support • Safe & Secure ⚡
            </p>
          </div>

          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
  )
}

export default GamingBanner
