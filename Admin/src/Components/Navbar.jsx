import React from 'react';
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
  Activity
} from 'lucide-react';



const Navbar = ({ onMenuClick }) => {
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
            <span className="text-white font-bold text-lg">VC</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Corsolo
            </h1>
            <p className="text-xs text-gray-500">Get Your vibes</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-all group">
          <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">3</span>
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2 hidden sm:block"></div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-xl cursor-pointer transition-all">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">CR</span>
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-gray-900">Admin</p>
            <p className="text-xs text-gray-500">Corsolo.com</p>
          </div>
        </div>

        <button className="p-2 hover:bg-red-50 rounded-xl transition-all group hidden sm:block">
          <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" />
        </button>
      </div>
    </nav>
  );
};


export default Navbar
