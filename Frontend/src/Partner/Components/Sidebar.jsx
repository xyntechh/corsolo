import React, { useEffect } from "react";
import {
  LayoutDashboard,
  Calendar,
  PhoneCall,
  CheckSquare,
  FileText,
  ChevronRight,
  Settings,
  HelpCircle,
  LogOut,
  Proportions,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const Sidebar = ({ isOpen, onClose }) => {


    const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    toast.success("Logout");
    navigate("/partner", { replace: true });
  };




  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      link: "/partner/dashboard",
      exact: true, 
    },
    {
      id: "Payments",
      label: "Payments",
      icon: Calendar,
      badge: "95%",
      link: "/partner/dashboard/payment",
    },

  ];



  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:sticky top-0 left-0 z-50 lg:z-10
        w-72 h-screen bg-white border-r border-gray-200
        transition-transform duration-300 ease-in-out
        flex flex-col shadow-2xl lg:shadow-none`}
      >
        {/* USER INFO */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
              P
            </div>
            <div>
              <h3 className="font-bold text-gray-900">
               Partners
              </h3>
            </div>
          </div>
        </div>

        {/* MAIN MENU */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.id}
                to={item.link}
                end={item.exact} // ⭐ MAIN FIX
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-4 py-3 rounded-xl transition-all
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? "text-white" : "text-gray-500"
                        }`}
                      />
                      <span className="font-medium">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-bold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {isActive && <ChevronRight className="w-4 h-4" />}
                  </>
                )}
              </NavLink>
            );
          })}

        
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t">
          <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-semibold">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
