import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Database,
  HardDrive,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Radio,
  X,
  ShieldAlert,
} from "lucide-react";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";

const BASE_URL = import.meta.env.VITE_API_URL;
const REFRESH_INTERVAL = 5000;
const CONFIRM_TEXT = "DELETE";

const usageColor = (pct = 0) => {
  if (pct >= 85) return { from: "from-red-600", to: "to-rose-500", hex: "#ef4444" };
  if (pct >= 60) return { from: "from-orange-600", to: "to-amber-500", hex: "#f97316" };
  return { from: "from-emerald-600", to: "to-green-500", hex: "#10b981" };
};

/* ---------------- Confirm Delete Modal ---------------- */
const ConfirmDeleteModal = ({ open, onClose, onConfirm, loading }) => {
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setInputVal("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  const isMatch = inputVal === CONFIRM_TEXT;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-3 p-5 sm:p-6 pb-4">
          <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 bg-gradient-to-br from-red-600 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
            <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              Clean MongoDB Storage
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              This will permanently delete chats &amp; messages older than 12 hours.
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 -mt-1 -mr-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 sm:px-6 pb-2">
          <div className="bg-red-50 border border-red-100 rounded-xl px-3.5 py-3 mb-4 flex gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-red-600 font-medium">
              This action is irreversible. Deleted data cannot be recovered.
            </p>
          </div>

          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
            Type <span className="font-mono font-extrabold text-red-600">{CONFIRM_TEXT}</span> to confirm
          </label>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={CONFIRM_TEXT}
            autoComplete="off"
            spellCheck={false}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none text-sm font-mono tracking-wide transition-all"
            onKeyDown={(e) => {
              if (e.key === "Enter" && isMatch && !loading) onConfirm();
            }}
          />
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-5 sm:p-6 pt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!isMatch || loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-br from-red-600 to-rose-500 text-white font-semibold text-sm shadow-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Confirm Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Main Component ---------------- */
const MongoStats = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cleaning, setCleaning] = useState(false);
  const [cleanMsg, setCleanMsg] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const intervalRef = useRef(null);

  const fetchMongoStats = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${BASE_URL}/api/serverStats/mongoStats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.message || "Unable to fetch Mongo stats");
      }
      setData(json);
    } catch (err) {
      setError(err.message || "Something went wrong while loading Mongo stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMongoStats(true);
  }, [fetchMongoStats]);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => fetchMongoStats(false), REFRESH_INTERVAL);
    }
    return () => clearInterval(intervalRef.current);
  }, [autoRefresh, fetchMongoStats]);

  const handleCleanStorage = async () => {
    setCleaning(true);
    setCleanMsg("");
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${BASE_URL}/api/serverStats/cleanMongoStorage`, {
        method: "Delete",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-confirm-delete": CONFIRM_TEXT,
        },
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.message || "Failed to clean storage");
      }
      const { chatsNew = 0, messages = 0 } = json.deletedCount || {};
      setCleanMsg(`Cleaned! ${chatsNew} chats & ${messages} messages deleted.`);
      setShowModal(false);
      fetchMongoStats(false);
    } catch (err) {
      setError(err.message || "Something went wrong while cleaning storage");
      setShowModal(false);
    } finally {
      setCleaning(false);
      setTimeout(() => setCleanMsg(""), 5000);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <Loader2 className="w-7 h-7 animate-spin text-purple-500" />
        <p className="text-sm font-semibold">Fetching MongoDB stats...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500 gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <AlertCircle className="w-7 h-7 text-red-400" />
        <p className="text-sm font-semibold">{error}</p>
        <button
          onClick={() => fetchMongoStats(true)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 mt-1"
        >
          Try again
        </button>
      </div>
    );
  }

  const pct = data?.storage?.usagePercent ?? 0;
  const color = usageColor(pct);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6 sm:mb-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-2">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-purple-600" />
          MongoDB Storage
        </h3>

        <div className="flex items-center gap-2 flex-wrap">
          {data?.raw?.atlasSizeBytes != null && (
            <span className="text-xs sm:text-sm text-gray-400 font-medium whitespace-nowrap">
              Atlas size: {(data.raw.atlasSizeBytes / 1024 / 1024).toFixed(2)} MB
            </span>
          )}

          <button
            onClick={() => setAutoRefresh((v) => !v)}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
              autoRefresh
                ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                : "bg-white border-gray-200 text-gray-500"
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${autoRefresh ? "animate-pulse" : ""}`} />
            {autoRefresh ? "Live" : "Paused"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl text-xs sm:text-sm text-red-500 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      {cleanMsg && (
        <div className="mb-4 px-4 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-xs sm:text-sm text-emerald-600 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {cleanMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
        {/* Gauge */}
        <div className="flex flex-col items-center">
          <div
            className={`w-12 h-12 mb-2 bg-gradient-to-br ${color.from} ${color.to} rounded-xl flex items-center justify-center shadow-lg`}
          >
            <HardDrive className="w-6 h-6 text-white" />
          </div>
          <div className="relative h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="70%"
                outerRadius="100%"
                data={[{ name: "Storage", value: pct, fill: color.hex }]}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background={{ fill: "#f1f5f9" }} dataKey="value" cornerRadius={20} fill={color.hex} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <span className="text-2xl font-extrabold -mt-4" style={{ color: color.hex }}>
            {pct.toFixed(2)}%
          </span>
        </div>

        {/* Details + button */}
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex justify-between text-xs sm:text-sm py-1.5 border-b border-gray-50">
            <span className="text-gray-500 font-medium">Used</span>
            <span className="text-gray-900 font-bold">{data?.storage?.usedGB} GB</span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm py-1.5 border-b border-gray-50">
            <span className="text-gray-500 font-medium">Free</span>
            <span className="text-gray-900 font-bold">{data?.storage?.freeGB} GB</span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm py-1.5">
            <span className="text-gray-500 font-medium">Total</span>
            <span className="text-gray-900 font-bold">{data?.storage?.totalGB} GB</span>
          </div>

          <button
            onClick={() => setShowModal(true)}
            disabled={cleaning}
            className="mt-3 w-full px-4 py-2.5 bg-gradient-to-br from-red-600 to-rose-500 hover:opacity-90 disabled:opacity-60 text-white rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm font-semibold"
          >
            <Trash2 className="w-4 h-4" />
            Click here to clean the storage
          </button>
        </div>
      </div>

      <ConfirmDeleteModal
        open={showModal}
        onClose={() => !cleaning && setShowModal(false)}
        onConfirm={handleCleanStorage}
        loading={cleaning}
      />
    </div>
  );
};

export default MongoStats;