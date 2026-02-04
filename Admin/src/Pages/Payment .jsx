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

const Payment = () => {
  const {
    paymentDashboardStats,
    getPaymentDashboardStatsFunction,
    getRecentPaymentDetailsFunction,
    recentPayment,
    getLast7DaysPaymentGraph,
    last7daysPayment,
  } = useDashboard();

  useEffect(() => {
    getPaymentDashboardStatsFunction();
    getRecentPaymentDetailsFunction();
    getLast7DaysPaymentGraph()
  }, []);

  const [weeklyData] = useState([
    { day: "Mon", initiated: 45000, success: 120000 },
    { day: "Tue", initiated: 52000, success: 145000 },
    { day: "Wed", initiated: 38000, success: 135000 },
    { day: "Thu", initiated: 65000, success: 180000 },
    { day: "Fri", initiated: 48000, success: 165000 },
    { day: "Sat", initiated: 55000, success: 155000 },
    { day: "Sun", initiated: 42000, success: 140000 },
  ]);

  const statsCards = [
    {
      title: "Total Payment",
      value: paymentDashboardStats?.totalAmount,
      icon: Wallet,
      color: "from-blue-600 to-cyan-500",
      change: "+18.5%",
      subtext: "all transactions",
    },
    {
      title: "Initiated Payment",
      value: paymentDashboardStats?.initiatedAmount,
      icon: Clock,
      color: "from-orange-600 to-red-500",
      change: "+5.2%",
      subtext: "pending completion",
    },
    {
      title: "Successful Payment",
      value: paymentDashboardStats?.successAmount,
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
                Payment Analytics
              </h2>
              <p className="text-sm sm:text-base text-gray-600 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Monitor payment flow and transaction status
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
              Recent Payments
            </h3>
            <span className="text-sm text-gray-500 font-semibold">
              Last 10 Transactions
            </span>
          </div>

          <div className="space-y-3">
            {recentPayment.map((payment, index) => (
              <div
                key={payment._id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/50 hover:from-blue-50 hover:to-blue-100/50 transition-all duration-200 group cursor-pointer border border-transparent hover:border-blue-200"
              >
                {/* Avatar & Name Section */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="relative">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${avatarColors[index]} rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-110 transition-transform`}
                    >
                      {payment?.userId?.name?.charAt(0)}
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                        payment?.transactionType === "SUCCESS"
                          ? "bg-green-500"
                          : "bg-orange-400"
                      }`}
                    ></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                        {payment?.userId?.name}
                      </h4>
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-lg flex-shrink-0 ${
                          payment.transactionType === "SUCCESS"
                            ? "bg-green-100 text-green-600"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {payment?.transactionType}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {payment?.orderId}
                    </p>
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm text-gray-600 pl-0 sm:pl-4">
                  {/* Amount */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <IndianRupee className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400">Amount</span>
                      <span className="font-bold text-gray-900 flex items-center">
                        ₹{formatAmount(payment?.amount)}
                      </span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400"> Time ago </span>
                      <span className="font-semibold text-gray-700">
                        {payment?.timeAgo}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Section */}
                <div className="flex items-center justify-end gap-2 flex-shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                  <button className="p-2 hover:bg-white rounded-lg transition-colors flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm">
                    <Eye className="w-4 h-4" />
                    <span className="hidden lg:inline">View</span>
                  </button>
                  <button className="p-2 hover:bg-white rounded-lg transition-colors opacity-0 sm:opacity-0 group-hover:opacity-100">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Payment Graph */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Weekly Payment Overview
            </h3>
            <div className="flex items-center gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-gray-600 font-semibold">Initiated</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-gray-600 font-semibold">Success</span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={last7daysPayment}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="day"
                stroke="#94a3b8"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="#94a3b8"
                style={{ fontSize: "12px" }}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "12px",
                }}
                formatter={(value) => [`₹${formatAmount(value)}`, ""]}
                labelStyle={{ fontWeight: "bold", marginBottom: "8px" }}
              />
              <Line
                type="monotone"
                dataKey="initiated"
                stroke="#f97316"
                strokeWidth={3}
                dot={{ fill: "#f97316", r: 5 }}
                activeDot={{ r: 7 }}
                name="Initiated"
              />
              <Line
                type="monotone"
                dataKey="success"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 5 }}
                activeDot={{ r: 7 }}
                name="Success"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
};

export default Payment;
