import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Calendar,
  Cake,
  Globe,
  Heart,
  MessageCircle,
  Coins,
  Users,
  Wifi,
  WifiOff,
  ArrowLeft,
  Shield,
  Eye,
  Clock,
  Activity,
  TrendingUp,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const UserDetailPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { state } = useLocation();

  const userId = state?.userId;

  console.log(userId); // ✅ mil gaya

  const getuserById = async () => {
    setLoading(true);

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Unauthorized. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/dashboard/getUserBy/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.sucess) {
        console.log(res.data.user);
        setUser(res.data.user)
        
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getuserById();
  }, [userId]);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeDifference = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-semibold">User not found</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      label: "Coins",
      value: user.coin,
      icon: Coins,
      color: "from-yellow-600 to-orange-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      label: "Likes",
      value: user.likes,
      icon: Heart,
      color: "from-pink-600 to-rose-500",
      bgColor: "bg-pink-50",
      textColor: "text-pink-600",
    },
    {
      label: "Chats",
      value: user.chats,
      icon: MessageCircle,
      color: "from-blue-600 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
  ];

  const userInfoItems = [
    {
      label: "User ID",
      value: user._id,
      icon: Shield,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      label: "Name",
      value: user.name || "Not provided",
      icon: User,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Email",
      value: user.email || "Not provided",
      icon: Mail,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Gender",
      value: user.gender,
      icon: Users,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      label: "Age",
      value: `${user.age} years`,
      icon: Cake,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      label: "Looking For",
      value: user.lookingFor || "Not specified",
      icon: Heart,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
    {
      label: "IP Address",
      value: user.ip,
      icon: Globe,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Account Type",
      value: user.isGuest ? "Guest User" : "Registered User",
      icon: Shield,
      color: user.isGuest ? "text-yellow-600" : "text-green-600",
      bgColor: user.isGuest ? "bg-yellow-50" : "bg-green-50",
    },
    {
      label: "Status",
      value: user.isOnline ? "Online" : "Offline",
      icon: user.isOnline ? Wifi : WifiOff,
      color: user.isOnline ? "text-green-600" : "text-gray-600",
      bgColor: user.isOnline ? "bg-green-50" : "bg-gray-50",
    },
    {
      label: "Socket ID",
      value: user.socketId || "Not connected",
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      label: "Created At",
      value: formatDate(user.createdAt),
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Last Updated",
      value: formatDate(user.updatedAt),
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Dashboard</span>
          </button>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white ${
                    user.isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
              </div>

              {/* User Header Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {user.name}
                  </h1>
                  <span
                    className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-bold ${
                      user.isGuest
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {user.isGuest ? "Guest" : "Registered"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1 ${
                      user.isOnline
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {user.isOnline ? (
                      <Wifi className="w-3 h-3" />
                    ) : (
                      <WifiOff className="w-3 h-3" />
                    )}
                    {user.isOnline ? "Online" : "Offline"}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-1">
                  {user.gender} • {user.age} years old
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Member since {getTimeDifference(user.createdAt)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all text-sm sm:text-base">
                  Edit Profile
                </button>
                <button className="flex-1 sm:flex-none px-4 py-2 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-all text-sm sm:text-base">
                  Suspend
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-semibold mb-2 uppercase tracking-wide">
                      {stat.label}
                    </p>
                    <p className="text-4xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* User Details Grid */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Eye className="w-6 h-6 text-blue-600" />
            User Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {userInfoItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/50 hover:from-blue-50 hover:to-blue-100/50 transition-all group border border-transparent hover:border-blue-200"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500 font-semibold mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm sm:text-base font-bold text-gray-900 break-words">
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="mt-6 sm:mt-8 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Activity Timeline
          </h2>

          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Account Created</p>
                <p className="text-sm text-gray-600">
                  {formatDate(user.createdAt)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {getTimeDifference(user.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Last Updated</p>
                <p className="text-sm text-gray-600">
                  {formatDate(user.updatedAt)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {getTimeDifference(user.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
