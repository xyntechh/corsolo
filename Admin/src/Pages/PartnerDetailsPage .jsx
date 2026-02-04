import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Calendar,
  Globe,
  Link2,
  TrendingUp,
  Users,
  DollarSign,
  ArrowLeft,
  Shield,
  Eye,
  Clock,
  Activity,
  Instagram,
  Share2,
  MousePointerClick,
  UserPlus,
  CreditCard,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const PartnerDetailsPage = () => {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);

  const { state } = useLocation();
  const partnerId = state?.partnerId;

  console.log(partnerId)

  const getPartnerById = async () => {
    setLoading(true);

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Unauthorized. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/partnerDashboard/getPartnerByid/${partnerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        console.log(res.data.data);
        setPartner(res.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPartnerById();
  }, [partnerId]);

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
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">
            Loading partner details...
          </p>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-semibold">Partner not found</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      label: "Total Visits",
      value: partner.totalVisits,
      icon: MousePointerClick,
      color: "from-blue-600 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Total Signups",
      value: partner.totalSignups,
      icon: UserPlus,
      color: "from-green-600 to-emerald-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      label: "Subscriptions",
      value: partner.totalSubscriptions,
      icon: CreditCard,
      color: "from-purple-600 to-pink-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      label: "Balance",
      value: `₹${partner.balance}`,
      icon: DollarSign,
      color: "from-yellow-600 to-orange-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
  ];

  const partnerInfoItems = [
    {
      label: "Partner ID",
      value: partner._id,
      icon: Shield,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      label: "Name",
      value: partner.name || "Not provided",
      icon: User,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Email",
      value: partner.email || "Not provided",
      icon: Mail,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Phone",
      value: partner.phone || "Not provided",
      icon: Phone,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Social Handle",
      value: partner.handle || "Not provided",
      icon: Instagram,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      label: "Username",
      value: partner.handleUserName || "Not provided",
      icon: User,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      label: "Handle Link",
      value: partner.handleLink || "Not provided",
      icon: Link2,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
    {
      label: "Referral Code",
      value: partner.referralCode,
      icon: Share2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Referral Link",
      value: partner.referralLink,
      icon: Globe,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Account Status",
      value: partner.isActive ? "Active" : "Inactive",
      icon: partner.isActive ? CheckCircle : XCircle,
      color: partner.isActive ? "text-green-600" : "text-red-600",
      bgColor: partner.isActive ? "bg-green-50" : "bg-red-50",
    },
    {
      label: "Created At",
      value: formatDate(partner.createdAt),
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Last Updated",
      value: formatDate(partner.updatedAt),
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
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
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg">
                  {partner.name?.charAt(0).toUpperCase() || "P"}
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white ${
                    partner.isActive ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
              </div>

              {/* Partner Header Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {partner.name}
                  </h1>
                  <span
                    className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-bold ${
                      partner.isActive
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {partner.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-1">
                  {partner.handle} • @{partner.handleUserName}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Partner since {getTimeDifference(partner.createdAt)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all text-sm sm:text-base">
                  Edit Partner
                </button>
                <button className="flex-1 sm:flex-none px-4 py-2 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-all text-sm sm:text-base">
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
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

        {/* Partner Details Grid */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Eye className="w-6 h-6 text-purple-600" />
            Partner Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {partnerInfoItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-purple-50/50 hover:from-purple-50 hover:to-purple-100/50 transition-all group border border-transparent hover:border-purple-200"
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
            <TrendingUp className="w-6 h-6 text-purple-600" />
            Activity Timeline
          </h2>

          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Partner Joined</p>
                <p className="text-sm text-gray-600">
                  {formatDate(partner.createdAt)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {getTimeDifference(partner.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Last Updated</p>
                <p className="text-sm text-gray-600">
                  {formatDate(partner.updatedAt)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {getTimeDifference(partner.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDetailsPage;
