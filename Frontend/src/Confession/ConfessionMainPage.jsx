import React from "react";
import Navbar from "./CofessionComponents/Navbar";
import ConfessionCard from "./CofessionComponents/ConfessionCard";
import FloatingProfileButton from "./CofessionComponents/FloatingProfileButton";
import { useNavigate } from "react-router-dom";

function ConfessionMainPage() {
  const navigate = useNavigate();

  const handleMyProfileClick = () => {
    navigate("/confession/profile");
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
      {/* Navbar */}
      <Navbar />

      {/* Feed Container */}
      <div className="w-full flex justify-center mt-6 px-4">
        <div className="w-full max-w-2xl flex flex-col gap-6">
          <ConfessionCard />
          <ConfessionCard />
          <ConfessionCard />
        </div>
      </div>

      {/* FLOATING BUTTON */}
      <div
      onClick={handleMyProfileClick}
       className="w-full flex justify-end">
         <  FloatingProfileButton />
      </div>
    </div>
  );
}

export default ConfessionMainPage;
