import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Server,
  Activity,
  RefreshCw,
  Clock,
  Terminal,
  Gauge,
  AlertCircle,
  Loader2,
  Radio,
} from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// 🔧 Change this to your backend base URL (or wire it to an env var / axios instance)
const BASE_URL = "http://localhost:5000";

// Auto-refresh interval (ms)
const REFRESH_INTERVAL = 5000;

const formatUptime = (seconds = 0) => {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

// Color scale based on usage percent
const usageColor = (pct = 0) => {
  if (pct >= 85) return { from: "from-red-600", to: "to-rose-500", hex: "#ef4444" };
  if (pct >= 60) return { from: "from-orange-600", to: "to-amber-500", hex: "#f97316" };
  return { from: "from-emerald-600", to: "to-green-500", hex: "#10b981" };
};

const Gauge3 = ({ label, value = 0, icon: Icon, sublabel }) => {
  const color = usageColor(value);
  const data = [{ name: label, value, fill: color.hex }];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group min-w-0">
      <div className="flex items-center justify-between mb-2 gap-2">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-gradient-to-br ${color.from} ${color.to} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
        >
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <span
          className="text-xl sm:text-2xl font-extrabold shrink-0"
          style={{ color: color.hex }}
        >
          {value?.toFixed ? value.toFixed(1) : value}%
        </span>
      </div>

      <div className="relative h-28 sm:h-32">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="70%"
            outerRadius="100%"
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: "#f1f5f9" }}
              dataKey="value"
              cornerRadius={20}
              fill={color.hex}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      <h3 className="text-gray-500 text-xs sm:text-sm font-semibold text-center uppercase tracking-wide -mt-4">
        {label}
      </h3>
      {sublabel && (
        <p className="text-[11px] sm:text-xs text-gray-400 text-center mt-1 break-words px-1">
          {sublabel}
        </p>
      )}
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-3 py-2 border-b border-gray-50 last:border-0">
    <span className="text-xs sm:text-sm text-gray-500 font-medium shrink-0">
      {label}
    </span>
    <span className="text-xs sm:text-sm text-gray-900 font-bold sm:text-right break-words min-w-0">
      {value ?? "—"}
    </span>
  </div>
);

const ServerStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const intervalRef = useRef(null);

  const fetchStats = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");

      const res = await fetch(`${BASE_URL}/api/serverStats/getServerStats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Unable to fetch server stats");
      }

      setStats(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || "Something went wrong while loading stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats(true);
  }, [fetchStats]);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => fetchStats(false), REFRESH_INTERVAL);
    }
    return () => clearInterval(intervalRef.current);
  }, [autoRefresh, fetchStats]);

  const nodeMemChartData = stats
    ? [
        { name: "RSS", value: stats.node.memoryUsage.rssGB },
        { name: "Heap Total", value: stats.node.memoryUsage.heapTotalGB },
        { name: "Heap Used", value: stats.node.memoryUsage.heapUsedGB },
        { name: "External", value: stats.node.memoryUsage.externalGB },
        { name: "Array Buf", value: stats.node.memoryUsage.arrayBuffersGB },
      ]
    : [];

  return (
    <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Server Monitor
              </h2>
              <p className="text-sm sm:text-base text-gray-600 flex items-center gap-2">
                <Activity className="w-4 h-4 shrink-0" />
                <span>Live view of your machine&apos;s resource usage</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {lastUpdated && (
                <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">
                    Updated {lastUpdated.toLocaleTimeString()}
                  </span>
                </span>
              )}

              <button
                onClick={() => setAutoRefresh((v) => !v)}
                className={`px-3 py-2 rounded-xl shadow-sm border flex items-center gap-2 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  autoRefresh
                    ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                    : "bg-white border-gray-200 text-gray-500"
                }`}
              >
                <Radio
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                    autoRefresh ? "animate-pulse" : ""
                  }`}
                />
                <span>{autoRefresh ? "Live" : "Paused"}</span>
              </button>

              <button
                onClick={() => fetchStats(true)}
                className="px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl shadow-sm transition-all flex items-center gap-2 text-gray-700 font-semibold text-xs sm:text-sm whitespace-nowrap"
              >
                <RefreshCw
                  className={`w-4 h-4 shrink-0 ${loading ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && !stats && (
          <div className="flex flex-col items-center justify-center py-20 sm:py-28 text-gray-400 gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm font-semibold">Fetching server stats...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && !stats && (
          <div className="flex flex-col items-center justify-center py-20 sm:py-28 text-gray-500 gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-sm font-semibold">{error}</p>
            <button
              onClick={() => fetchStats(true)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 mt-1"
            >
              Try again
            </button>
          </div>
        )}

        {stats && (
          <>
            {error && (
              <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl text-xs sm:text-sm text-red-500 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error} — showing last known data
              </div>
            )}

            {/* Gauges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <Gauge3
                label="CPU Usage"
                value={stats.cpu.usagePercent}
                icon={Cpu}
                sublabel={`${stats.cpu.cores} cores @ ${stats.cpu.speedMHz} MHz`}
              />
              <Gauge3
                label="Memory Usage"
                value={stats.memory.usagePercent}
                icon={MemoryStick}
                sublabel={`${stats.memory.usedGB} GB / ${stats.memory.totalGB} GB`}
              />
              {stats.disk ? (
                <Gauge3
                  label="Disk Usage"
                  value={stats.disk.usagePercent}
                  icon={HardDrive}
                  sublabel={`${stats.disk.usedGB} GB / ${stats.disk.totalGB} GB`}
                />
              ) : (
                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-400 to-gray-300 rounded-xl flex items-center justify-center shadow-lg">
                    <HardDrive className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-gray-500 text-xs sm:text-sm font-semibold uppercase tracking-wide">
                    Disk Usage
                  </h3>
                  <p className="text-xs text-gray-400">
                    Not available on this platform
                  </p>
                </div>
              )}
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* OS Info */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2 mb-3">
                  <Server className="w-5 h-5 text-blue-600" />
                  Operating System
                </h3>
                <InfoRow label="Platform" value={stats.os.platform} />
                <InfoRow label="Type" value={stats.os.type} />
                <InfoRow label="Release" value={stats.os.release} />
                <InfoRow label="Architecture" value={stats.os.architecture} />
                <InfoRow label="Hostname" value={stats.os.hostname} />
                <InfoRow
                  label="System Uptime"
                  value={formatUptime(stats.os.uptimeSeconds)}
                />
              </div>

              {/* CPU Info */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2 mb-3">
                  <Gauge className="w-5 h-5 text-orange-500" />
                  CPU Details
                </h3>
                <InfoRow label="Model" value={stats.cpu.model?.trim()} />
                <InfoRow label="Cores" value={stats.cpu.cores} />
                <InfoRow label="Speed" value={`${stats.cpu.speedMHz} MHz`} />
                <InfoRow label="Usage" value={`${stats.cpu.usagePercent}%`} />
                <InfoRow
                  label="Load Avg (1/5/15m)"
                  value={stats.cpu.loadAverage?.map((n) => n.toFixed(2)).join(" / ")}
                />
              </div>

              {/* Node Process Info */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2 mb-3">
                  <Terminal className="w-5 h-5 text-purple-600" />
                  Node Process
                </h3>
                <InfoRow label="Version" value={stats.node.version} />
                <InfoRow label="Platform" value={stats.node.platform} />
                <InfoRow label="Architecture" value={stats.node.architecture} />
                <InfoRow label="PID" value={stats.node.pid} />
                <InfoRow
                  label="Process Uptime"
                  value={formatUptime(stats.node.uptimeSeconds)}
                />
              </div>
            </div>

            {/* Node memory breakdown chart */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <MemoryStick className="w-5 h-5 text-purple-600" />
                  Node Process Memory Breakdown
                </h3>
                <span className="text-xs sm:text-sm text-gray-500 font-semibold">
                  in GB
                </span>
              </div>

              <ResponsiveContainer width="100%" height={280} minWidth={0}>
                <BarChart
                  data={nodeMemChartData}
                  margin={{ top: 8, right: 8, left: 0, bottom: 24 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    style={{ fontSize: "11px" }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    style={{ fontSize: "12px" }}
                    width={36}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      padding: "12px",
                    }}
                    formatter={(value) => [`${value} GB`, ""]}
                    labelStyle={{ fontWeight: "bold", marginBottom: "8px" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="value"
                    name="Memory"
                    fill="#8b5cf6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Server time footer */}
            <div className="text-center text-xs text-gray-400 font-medium pb-4">
              Server time: {new Date(stats.serverTime).toLocaleString()}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default ServerStats;