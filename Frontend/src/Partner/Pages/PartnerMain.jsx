import { useState } from "react";
import { Outlet } from "react-router-dom";



import Navbar from "../Components/Navbar"
import Sidebar from "../Components/Sidebar"




const PartnerMain = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-4">
          <Outlet />   
        </div>
      </div>
    </div>
  );
};


export default PartnerMain


