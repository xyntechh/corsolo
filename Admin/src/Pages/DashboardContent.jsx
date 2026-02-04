import React from "react";
import {
  Users,
  DollarSign,
  UserCheck,
  Handshake,
  TrendingUp,
  Clock,
  User,
  Cake,
  MapPin,
  ArrowUpRight,
  Activity,
  Eye,
  MoreVertical,
  UserPlus,
  Globe,
} from "lucide-react";
import { useDashboard } from "../Context/DashboardContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashboardContent = () => {
  const { getDashboardFunction, getRecentUserfunction, recentUser, stats } =
    useDashboard();

  const navigate = useNavigate();

  useEffect(() => {
    getDashboardFunction();
    getRecentUserfunction();
  }, []);

  const statsCards = [
    {
      title: "Signup Users",
      value: stats?.signupUsers || 0,
      icon: UserPlus,
      color: "from-indigo-600 to-purple-500",
      change: "+15.3%",
      subtext: "new signups",
      link : "/dashboard/signUpUserlist"
    },
    {
      title: "Guest Users",
      value: stats?.guestUsers || 0,
      icon: UserCheck,
      color: "from-purple-600 to-pink-500",
      change: "+8.3%",
      subtext: "active guests",
    },
    {
      title: "Total Users",
      value:  stats?.totalUser || 0,
      icon: Users,
      color: "from-blue-600 to-cyan-500",
      change: "+12.5%",
      subtext: "vs last month",
    },
    {
      title: "Total Payment",
      value: `₹${stats?.totalAmount || 0}`,
      icon: DollarSign,
      color: "from-emerald-600 to-green-500",
      change: "+18.2%",
      subtext: "revenue growth",
    },
    {
      title: "Total Partners",
      value: stats?.partners || 0,
      icon: Handshake,
      color: "from-orange-600 to-red-500",
      change: "+5.7%",
      subtext: "partnerships",
    },
  ];

  const avatarColors = [
    "from-blue-600 to-cyan-500",
    "from-purple-600 to-pink-500",
    "from-emerald-600 to-green-500",
    "from-orange-600 to-red-500",
    "from-indigo-600 to-purple-500",
    "from-pink-600 to-rose-500",
    "from-cyan-600 to-blue-500",
    "from-yellow-600 to-orange-500",
  ];

  const getAvatarColor = (index) => {
    return avatarColors[index % avatarColors.length];
  };

  return (
    <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h2>
              <p className="text-sm sm:text-base text-gray-600 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Monitor and manage your platform analytics
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
              onClick={()=> navigate(stat.link)}
                key={index}
      
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 group"
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <span className="text-green-600 text-xs sm:text-sm font-bold flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-gray-500 text-xs sm:text-sm font-semibold mb-1 uppercase tracking-wide">
                  {stat.title}
                </h3>
                <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500">{stat.subtext}</p>
              </div>
            );
          })}
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Recent Users
            </h3>
          </div>

          <div className="space-y-3">
            {recentUser.map((user, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/50 hover:from-blue-50 hover:to-blue-100/50 transition-all duration-200 group cursor-pointer border border-transparent hover:border-blue-200"
              >
                {/* Avatar & Name Section */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="relative">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${getAvatarColor(
                        index
                      )} rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-110 transition-transform`}
                    >
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                        user.accountType === "Signup"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    ></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                        {user?.name}
                      </h4>
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-lg flex-shrink-0 ${
                          user?.accountType === "Signup"
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {user?.accountType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm text-gray-600 pl-0 sm:pl-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400">Gender</span>
                      <span className="font-semibold text-gray-700">
                        {user?.gender}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Cake className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400">Age</span>
                      <span className="font-semibold text-gray-700">
                        {user?.age} years
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400">IP Address</span>
                      <span className="font-semibold text-gray-700 truncate">
                        {user?.ip}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Section */}
                <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 flex-shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{user?.timeAgo}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        navigate("/dashboard/userDetails", {
                          state: { userId: user?._id },
                        })
                      }
                      className="p-2 hover:bg-white rounded-lg transition-colors flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden lg:inline">View</span>
                    </button>
                    <button className="p-2 hover:bg-white rounded-lg transition-colors opacity-0 sm:opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardContent;
