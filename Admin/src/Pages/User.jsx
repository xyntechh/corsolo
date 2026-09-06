import React, { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  UserPlus,
  Copy,
  Activity,
  TrendingUp,
  Calendar,
  Radio,
  Venus,
  Mars,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useDashboard } from "../Context/DashboardContext";
import { socket } from "../socket.js";

const User = () => {
  const {
    userStatsFunction,
    userStats,
    userLast7DaysFunction,
    last7daysGraph,
    getUserPerDayFunction,
    avarageUserPerDay,
  } = useDashboard();

  useEffect(() => {
    userStatsFunction();
    userLast7DaysFunction();
    getUserPerDayFunction();
  }, []);

  const statsCards = [
    {
      title: "Total Users",
      value: userStats?.totalUsers || 0,
      icon: Users,
      color: "from-blue-600 to-cyan-500",
      change: "+12.5%",
      subtext: "all time users",
    },
    {
      title: "Unique Users",
      value: userStats?.uniqueUsers || 0,
      icon: UserCheck,
      color: "from-purple-600 to-pink-500",
      change: "+8.3%",
      subtext: "unique accounts",
    },
    {
      title: "Duplicate Users",
      value: userStats?.duplicateUsers || 0,
      icon: Copy,
      color: "from-orange-600 to-red-500",
      change: "+5.7%",
      subtext: "duplicate entries",
    },
    {
      title: "Guest Users",
      value: userStats?.guestUsers || 0,
      icon: Activity,
      color: "from-emerald-600 to-green-500",
      change: "+15.2%",
      subtext: "guest accounts",
    },
    {
      title: "Signup Users",
      value: userStats?.signupUsers || 0,
      icon: UserPlus,
      color: "from-indigo-600 to-purple-500",
      change: "+18.9%",
      subtext: "registered users",
    },
  ];

  const [queues, setQueues] = useState({
    random: [],
    male: [],
    female: [],
  });

  useEffect(() => {
    const handleConnect = () => {
      console.log("🟢 ADMIN SOCKET CONNECTED:", socket.id);

      socket.emit("joinAdminRoom");
      console.log("📡 joinAdminRoom emitted");
    };

    const handleQueueUpdate = (data) => {
      console.log("🔥 LIVE QUEUE:", data);
      setQueues(data);
    };

    const handleConnectError = (err) => {
      console.error("❌ SOCKET CONNECT ERROR:", err.message);
      console.error("❌ SOCKET URL:", import.meta.env.VITE_API_URL);
    };

    socket.on("connect", handleConnect);
    socket.on("queueUpdate", handleQueueUpdate);
    socket.on("connect_error", handleConnectError);

    if (!socket.connected) {
      console.log("🔌 Connecting admin socket...");
      socket.connect();
    } else {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("queueUpdate", handleQueueUpdate);
      socket.off("connect_error", handleConnectError);
    };
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <p className="font-bold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{" "}
              <span className="font-bold">{entry.value.toLocaleString()}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // ---------- Live Queue helpers ----------
  const randomQueue = queues?.random || [];
  const maleQueue = queues?.male || [];
  const femaleQueue = queues?.female || [];

  // unique total waiting users (avoid double counting since a user can appear
  // in both "random" and their gender-specific queue at the same time)
  const uniqueWaitingIds = new Set([
    ...randomQueue.map((u) => u.socketId),
    ...maleQueue.map((u) => u.socketId),
    ...femaleQueue.map((u) => u.socketId),
  ]);
  const totalWaiting = uniqueWaitingIds.size;

  const queueCards = [
  { title: "Random", list: randomQueue, icon: Radio, iconColor: "text-violet-600" },
  { title: "Male", list: maleQueue, icon: Mars, iconColor: "text-blue-600" },
  { title: "Female", list: femaleQueue, icon: Venus, iconColor: "text-pink-600" },
];
  // -----------------------------------------

  return (
    <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Dashboard Analytics
              </h2>
              <p className="text-sm sm:text-base text-gray-600 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Monitor user growth and platform statistics
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

        
       {/* ---------------- Live Queue Status (NEW) ---------------- */}
<div className="bg-white rounded-2xl border border-gray-200 mb-6 sm:mb-8 overflow-hidden">
  {/* Header strip */}
  <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-200">
    <div className="flex items-center gap-2.5">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <h3 className="text-base sm:text-lg font-bold text-gray-900">
        Live matching queue
      </h3>
      <span className="text-xs text-gray-400 font-medium hidden sm:inline">
        · updates in real time
      </span>
    </div>

    <div className="flex items-baseline gap-1.5">
      <span className="text-xs text-gray-500 font-medium">waiting</span>
      <span className="text-xl sm:text-2xl font-bold text-gray-900 tabular-nums font-mono">
        {totalWaiting}
      </span>
    </div>
  </div>

  {/* Columns */}
  <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
    {queueCards.map((q, index) => {
      const Icon = q.icon;
      return (
        <div key={index} className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${q.iconColor}`} strokeWidth={2} />
              <span className="text-sm font-semibold text-gray-700">
                {q.title}
              </span>
            </div>
            <span className="text-2xl font-bold text-gray-900 tabular-nums font-mono">
              {q.list.length}
            </span>
          </div>

          {q.list.length === 0 ? (
            <p className="text-xs text-gray-400 py-3">Nobody waiting right now.</p>
          ) : (
            <ul className="space-y-1.5 max-h-48 overflow-y-auto">
              {q.list.map((u, i) => (
                <li
                  key={u.socketId || i}
                  className="flex items-center justify-between text-sm py-1.5 px-2 -mx-2 rounded-lg hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-800 truncate">
                    {u.partnerName || "Unknown"}
                  </span>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                    {u.lookingFor || u.gender}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    })}
  </div>
</div>
{/* -------------- End Live Queue Status -------------- */}
      
        {/* Analytics Graph */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 mb-1">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                User Growth Trends
              </h3>
              <p className="text-sm text-gray-600">Last 7 days comparison</p>
            </div>

            {/* Legend Pills */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg">
                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                <span className="text-xs sm:text-sm font-semibold text-purple-600">
                  Unique Users
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span className="text-xs sm:text-sm font-semibold text-blue-600">
                  Signup Users
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg">
                <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                <span className="text-xs sm:text-sm font-semibold text-emerald-600">
                  Guest Users
                </span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="w-full h-64 sm:h-80 lg:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={last7daysGraph}
                margin={{
                  top: 5,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  style={{ fontSize: "12px" }}
                  tick={{ fill: "#6b7280" }}
                />
                <YAxis
                  stroke="#9ca3af"
                  style={{ fontSize: "12px" }}
                  tick={{ fill: "#6b7280" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="uniqueUsers"
                  stroke="#9333ea"
                  strokeWidth={3}
                  dot={{ fill: "#9333ea", r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Unique Users"
                />
                <Line
                  type="monotone"
                  dataKey="signupUsers"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ fill: "#2563eb", r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Signup Users"
                />
                <Line
                  type="monotone"
                  dataKey="guestUsers"
                  stroke="#059669"
                  strokeWidth={3}
                  dot={{ fill: "#059669", r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Guest Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Stats Summary Below Chart */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <p className="text-sm text-purple-600 font-semibold mb-1">
                Avg. Unique Users
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-900">
                {avarageUserPerDay ? avarageUserPerDay?.averageUniqueUsers : 0}
              </p>
              <p className="text-xs text-purple-600 mt-1">per day</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-600 font-semibold mb-1">
                Avg. Signup Users
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-900">
                {" "}
                {avarageUserPerDay ? avarageUserPerDay?.averageSignupUsers : 0}
              </p>
              <p className="text-xs text-blue-600 mt-1">per day</p>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-xl">
              <p className="text-sm text-emerald-600 font-semibold mb-1">
                Avg. Guest Users
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-900">
                {avarageUserPerDay ? avarageUserPerDay?.averageGuestUsers : 0}
              </p>
              <p className="text-xs text-emerald-600 mt-1">per day</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default User;