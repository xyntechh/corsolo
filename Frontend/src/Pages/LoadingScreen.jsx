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
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 overflow-hidden p-4">
      
      <div className="w-full max-w-sm backdrop-blur-xl bg-purple-950/40 border border-purple-700/50 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center gap-6 relative">
        
        {/* Animated Background Circles */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Profile Image with Heart Animation */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-purple-900/50 flex items-center justify-center overflow-hidden">
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
          <div className="flex items-center justify-center gap-2 text-purple-200">
            <span className="text-sm">{profile.age || "--"} years</span>
            <span className="text-purple-400">•</span>
            <span className="text-sm">{profile.location || "---"}</span>
          </div>
        </div>

        {/* Custom Heart Loader */}
        <div className="flex flex-col items-center gap-3 z-10">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
          
          <p className="text-purple-200 text-sm font-medium">
            Finding your perfect match{dots}
          </p>
        </div>

        {/* Spinning Heart Ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 border-2 border-pink-500/20 rounded-full animate-spin" style={{ animationDuration: '3s' }}>
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