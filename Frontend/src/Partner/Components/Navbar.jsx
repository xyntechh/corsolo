import React from "react";
import {
  Bell,
  MessageSquare,
  Phone,
  LogOut,
  Menu,
  Search,
  LayoutDashboard,
  Calendar,
  PhoneCall,
  CheckSquare,
  FileText,
  ChevronRight,
  Settings,
  HelpCircle,
  TrendingUp,
  Clock,
  Target,
  Users,
  ArrowUpRight,
  MoreVertical,
  Activity,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    toast.success("Logout");
    navigate("/partner", { replace: true });
  };

  return (
    <nav className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 sm:px-6 z-20 sticky top-0">
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Corsolo
            </h1>
            <p className="text-xs text-gray-500">Partner Dashboard</p>
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
       

        <div className="w-px h-6 bg-gray-300 mx-2 hidden sm:block"></div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-xl cursor-pointer transition-all">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">JD</span>
          </div>
          <div className="hidden lg:block"></div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 hover:bg-red-50 rounded-xl transition-all group hidden sm:block"
        >
          <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
