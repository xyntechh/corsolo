import React, { useEffect, useState } from "react";

// Fake names arrays
const maleNames = ["Rohit", "Aman", "Siddharth", "Raj", "Vikram", "Arjun", "Karan"];
const femaleNames = ["Priya", "Ananya", "Sakshi", "Neha", "Isha", "Aditi", "Riya"];
const locations = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune"];

function LoadingScreen({ lookingFor }) {
  const [profile, setProfile] = useState({ name: "", age: 0, location: "" });
  const [dots, setDots] = useState("");

  useEffect(() => {
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const nameList = lookingFor === "Male" ? maleNames : femaleNames;
      const randomName = nameList[Math.floor(Math.random() * nameList.length)];
      const randomAge = Math.floor(Math.random() * 20) + 20;
      const randomLoc = locations[Math.floor(Math.random() * locations.length)];

      setProfile({ name: randomName, age: randomAge, location: randomLoc });
    }, 1200);

    return () => clearInterval(interval);
  }, [lookingFor]);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);

    return () => clearInterval(dotsInterval);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-[#2E2F38] overflow-hidden p-4">

      <div className="w-full max-w-sm bg-[#0D0D11] border border-white/10 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center gap-6 relative">

        {/* Profile Image */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-2 border-purple-500/40 p-1">
            <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center overflow-hidden">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Floating Hearts */}
          <div className="absolute -top-2 -right-2">
            <div className="text-2xl animate-bounce" style={{ animationDuration: '2s' }}>
              💖
            </div>
          </div>
          <div className="absolute -bottom-2 -left-2">
            <div className="text-xl animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>
              💕
            </div>
          </div>
        </div>

        {/* Name and Info */}
        <div className="text-center space-y-2 z-10">
          <h2 className="text-2xl font-bold text-white tracking-wide">
            {profile.name || "Searching"}
          </h2>
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <span className="text-sm">{profile.age || "--"} years</span>
            <span className="text-gray-600">•</span>
            <span className="text-sm">{profile.location || "---"}</span>
          </div>
        </div>

        {/* Custom Loader */}
        <div className="flex flex-col items-center gap-3 z-10">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>

          <p className="text-gray-400 text-sm font-medium">
            Finding your perfect match{dots}
          </p>
        </div>

        {/* Spinning Ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 border-2 border-purple-500/20 rounded-full animate-spin" style={{ animationDuration: '3s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="text-lg">💗</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LoadingScreen;