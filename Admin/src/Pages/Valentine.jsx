import React, { useEffect, useState } from "react";
import {
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle,
  Activity,
  MoreVertical,
  Eye,
  IndianRupee,
  CreditCard,
  Calendar,
  NotebookIcon,
  
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDashboard } from "../Context/DashboardContext";

const Valentine = () => {
  const {
    paymentDashboardStats,
    getPaymentDashboardStatsFunction,
    getRecentPaymentDetailsFunction,
    recentPayment,
    getLast7DaysPaymentGraph,
    last7daysPayment,
    geteBookDashboardStats,
    EbookStats,
    getRecentEbookOrderFunction,
    recentEbookOrder,
    getValentineOrder,
    recentValentineOrder,
    getValentineOrderFunction,
    valentineAllOrder,
  } = useDashboard();

  useEffect(() => {
    getPaymentDashboardStatsFunction();
    getRecentPaymentDetailsFunction();
    getLast7DaysPaymentGraph();
    geteBookDashboardStats();
    getRecentEbookOrderFunction();
    getValentineOrder();
    getValentineOrderFunction();
  }, []);

  const statsCards = [
    {
      title: "Total Sale",
      value: recentValentineOrder?.totalSale,
      icon: Wallet,
      color: "from-blue-600 to-cyan-500",
      change: "+18.5%",
      subtext: "all transactions",
    },
    {
      title: "Commplelted Order",
      value: recentValentineOrder?.completedOrder,
      icon: Clock,
      color: "from-orange-600 to-red-500",
      change: "+5.2%",
      subtext: "pending completion",
    },
    {
      title: "initiated Order",
      value: recentValentineOrder?.inisitatedOrder,
      icon: CheckCircle,
      color: "from-emerald-600 to-green-500",
      change: "+22.3%",
      subtext: "completed payments",
    },
  ];

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  const avatarColors = [
    "from-blue-600 to-cyan-500",
    "from-purple-600 to-pink-500",
    "from-emerald-600 to-green-500",
    "from-orange-600 to-red-500",
    "from-indigo-600 to-purple-500",
    "from-pink-600 to-rose-500",
    "from-cyan-600 to-blue-500",
    "from-yellow-600 to-orange-500",
    "from-teal-600 to-cyan-500",
    "from-violet-600 to-purple-500",
  ];

  return (
    <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Valentine Orders
              </h2>
              <p className="text-sm sm:text-base text-gray-600 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Monitor payment flow and transaction status of Valentine
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
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
                <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 flex items-center gap-1">
                  <IndianRupee className="w-6 h-6 sm:w-7 sm:h-7" />
                  {formatAmount(stat.value)}
                </p>
                <p className="text-xs text-gray-500">{stat.subtext}</p>
              </div>
            );
          })}
        </div>

        {/* Recent Payments List */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-600" />
              Recent Orders
            </h3>
            <span className="text-sm text-gray-500 font-semibold">
              Last 10 Orders
            </span>
          </div>

          <div className="space-y-3">
            {valentineAllOrder.map((val, index) => (
              <div
                key={val._id}
                className="flex flex-col lg:flex-row lg:items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/50 hover:from-blue-50 hover:to-blue-100/50 transition-all duration-200 group cursor-pointer border border-transparent hover:border-blue-200"
              >
                {/* Avatar & Name Section */}
                <div className="flex items-center gap-3 lg:w-64 flex-shrink-0">
                  <div className="relative">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${avatarColors[index]} rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-110 transition-transform`}
                    >
                      {val?.name?.charAt(0)}
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                        val?.paymentStatus === "COMPLETED"
                          ? "bg-green-500"
                          : "bg-orange-400"
                      }`}
                    ></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                        {val?.name}
                      </h4>
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-lg flex-shrink-0 ${
                          val?.paymentStatus === "COMPLETED"
                            ? "bg-green-100 text-green-600"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {val?.paymentStatus}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {val?.orderId}
                    </p>
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  {/* Amount */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <IndianRupee className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-gray-400">Amount</span>
                      <span className="font-bold text-gray-900">
                        199
                      </span>
                    </div>
                  </div>

                  {/* Note */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <NotebookIcon className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-gray-400">Note</span>
                      <span className="font-bold text-gray-900 truncate">
                        {val?.note}
                      </span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-gray-400">Purchase Time</span>
                      <span className="font-semibold text-gray-700 text-xs truncate">
                        {new Date(val.updatedAt).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Section */}
                <div className="flex items-center justify-end gap-2 lg:w-32 flex-shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 mt-2 lg:mt-0">
                  <button className="p-2 hover:bg-white rounded-lg transition-colors flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm">
                    <Eye className="w-4 h-4" />
                    <span className="hidden xl:inline">View</span>
                  </button>
                  <button className="p-2 hover:bg-white rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Valentine;