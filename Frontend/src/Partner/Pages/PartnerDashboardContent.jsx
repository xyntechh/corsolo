import React, { useState } from "react";
import {
  Users,
  UserPlus,
  CreditCard,
  Wallet,
  TrendingUp,
  Activity,
  Link,
  Copy,
  Check,
  ExternalLink,
  Share2,
} from "lucide-react";
import axios from "axios";
import { useEffect } from "react";
import { useUser } from "../../Context/UserContext";

const PartnerDashboardContent = () => {
  const [copiedField, setCopiedField] = useState(null);

  const { accountDetails, setRefreshKey } = useUser();

  const statsCards = [
    {
      title: "Total Visits",
      value: accountDetails?.partner?.totalVisits,
      icon: Users,
      color: "from-blue-600 to-cyan-500",
      change: "+12%",
    },
    {
      title: "Total Signup",
      value: accountDetails?.partner?.totalSignups,
      icon: UserPlus,
      color: "from-cyan-600 to-blue-500",
      change: "+5%",
    },
    {
      title: "Total Subscription",
      value: accountDetails?.partner?.totalSubscriptions,
      icon: CreditCard,
      color: "from-indigo-600 to-purple-500",
      change: "+2%",
    },
    {
      title: "Balance",
      value: accountDetails?.partner?.balance,
      icon: Wallet,
      color: "from-emerald-600 to-green-500",
      change: "+8%",
    },
  ];

  console.log(accountDetails)

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Partner Dashboard
          </h2>
          <p className="text-gray-600 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Here's what's happening with your work today
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-green-600 text-sm font-bold flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-gray-500 text-sm font-semibold mb-1 uppercase tracking-wide">
                  {stat.title}
                </h3>
                <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Link className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">
                  Referral Link
                </h3>
                <p className="text-gray-600">Share this link to earn rewards</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200 shadow-inner">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0 w-full">
                  <p className="text-xs text-gray-600 font-semibold mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Share2 className="w-3 h-3" />
                    Your Active Referral Link
                  </p>
                  <div className="bg-white rounded-xl p-4 border border-purple-200">
                    <p className="text-sm sm:text-base lg:text-lg font-mono font-bold text-purple-700 break-all leading-relaxed">
                      {accountDetails?.partner?.referralLink}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleCopy(accountDetails?.partner?.referralLink, "link")
                  }
                  className="flex-shrink-0 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-bold flex items-center gap-2 whitespace-nowrap"
                >
                  {copiedField === "link" ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  Account
                </h3>
                <p className="text-sm text-gray-600">Partner info</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-5 border border-gray-200">
                <p className="text-xs text-gray-600 font-semibold mb-2 uppercase tracking-wide">
                  Platform
                </p>

                <a
                  href={accountDetails?.partner?.handleLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-bold text-blue-600 break-all hover:underline"
                >
                  {accountDetails?.partner?.handleLink}
                </a>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-5 border border-gray-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 font-semibold mb-2 uppercase tracking-wide">
                      Username
                    </p>
                    <p className="text-lg font-mono font-bold text-gray-900 break-all">
                      {accountDetails?.partner?.handleUserName}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleCopy(
                        accountDetails?.partner?.handleUserName,
                        "username"
                      )
                    }
                    className="flex-shrink-0 p-3 bg-white hover:bg-gray-100 rounded-lg transition-all shadow-sm hover:shadow-md group"
                  >
                    {copiedField === "username" ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-600 group-hover:scale-110 transition-transform" />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-2 uppercase tracking-wide">
                      Status
                    </p>
                    <p className="text-lg font-bold text-green-700 flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                      Active
                    </p>
                  </div>
                  <ExternalLink className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PartnerDashboardContent;
