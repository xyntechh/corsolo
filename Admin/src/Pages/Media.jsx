import React, { useEffect, useState, useCallback } from "react";
import {
  Image as ImageIcon,
  Music,
  Activity,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
  Trash2,
  Download,
  Loader2,
  AlertCircle,
} from "lucide-react";

// 🔧 Change this to your backend base URL (or wire it to an env var / axios instance)
const BASE_URL = "http://localhost:5000";

// Helper: decide file type from its name/extension
const getFileType = (name = "") => {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "webm") return "audio";
  return "image"; // png, jpg, jpeg, gif, webp, etc.
};

const Media = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const [selected, setSelected] = useState([]); // array of file names
  const [previewItem, setPreviewItem] = useState(null);

  const fetchMedia = useCallback(async (pageNumber = 1) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");

      const res = await fetch(
        `${BASE_URL}/api/mediaDashboard/getAllMedia?page=${pageNumber}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Unable to fetch media");
      }

      setMedia(data.media || []);
      setPage(data.page || 1);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
      setHasNextPage(Boolean(data.hasNextPage));
      setHasPreviousPage(Boolean(data.hasPreviousPage));
      setSelected([]); // reset selection on page change
    } catch (err) {
      setError(err.message || "Something went wrong while loading media");
      setMedia([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    fetchMedia(p);
  };

  const toggleSelect = (fileName) => {
    setSelected((prev) =>
      prev.includes(fileName)
        ? prev.filter((f) => f !== fileName)
        : [...prev, fileName]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === media.length) {
      setSelected([]);
    } else {
      setSelected(media.map((m) => m.name));
    }
  };

  // Build simple pagination number list (max 5 visible, centered around current page)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Media Library
              </h2>
              <p className="text-sm sm:text-base text-gray-600 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Browse images and audio recordings
              </p>
            </div>

            <div className="flex items-center gap-2">
              {selected.length > 0 && (
                <span className="text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-2 rounded-xl border border-blue-100">
                  {selected.length} selected
                </span>
              )}
              <button
                onClick={() => fetchMedia(page)}
                className="p-2 sm:px-4 sm:py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl shadow-sm transition-all flex items-center gap-2 text-gray-700 font-semibold text-sm"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-600" />
              Uploaded Files
            </h3>

            {media.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleSelectAll}
                  className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  {selected.length === media.length ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                  {selected.length === media.length
                    ? "Deselect All"
                    : "Select All"}
                </button>

                {selected.length > 0 && (
                  <button
                    onClick={() => setSelected([])}
                    className="text-xs sm:text-sm font-semibold text-red-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-gray-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-sm font-semibold">Loading media...</p>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-gray-500 gap-3">
              <AlertCircle className="w-8 h-8 text-red-400" />
              <p className="text-sm font-semibold">{error}</p>
              <button
                onClick={() => fetchMedia(page)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 mt-1"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && media.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-gray-400 gap-3">
              <ImageIcon className="w-10 h-10" />
              <p className="text-sm font-semibold">No files found</p>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && media.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {media.map((item) => {
                const isSelected = selected.includes(item.name);
                const fileType = getFileType(item.name);
                const isAudio = fileType === "audio";

                return (
                  <div
                    key={item.name}
                    className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-200 bg-gray-50 ${
                      isSelected
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-transparent hover:border-blue-200"
                    }`}
                  >
                    {isAudio ? (
                      /* Audio card */
                      <div className="aspect-square w-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-purple-50 to-indigo-50 p-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <Music className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-600 font-semibold truncate max-w-full px-1">
                          {item.name}
                        </p>
                        <audio
                          controls
                          src={item.url}
                          className="w-full h-8 mt-1"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    ) : (
                      /* Image card */
                      <div
                        className="aspect-square w-full overflow-hidden cursor-pointer"
                        onClick={() => setPreviewItem(item)}
                      >
                        <img
                          src={item.url}
                          alt={item.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Select checkbox */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(item.name);
                      }}
                      className={`absolute top-2 left-2 w-6 h-6 rounded-lg flex items-center justify-center shadow-md transition-all z-10 ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-white/90 text-gray-400 opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>

                    {/* Hover overlay actions (image only) */}
                    {!isAudio && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-center justify-between">
                        <p className="text-[10px] sm:text-xs text-white font-semibold truncate max-w-[70%]">
                          {item.name}
                        </p>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 hover:bg-white/20 rounded"
                        >
                          <Download className="w-3.5 h-3.5 text-white" />
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && media.length > 0 && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs sm:text-sm text-gray-500 font-semibold order-2 sm:order-1">
              Showing page {page} of {totalPages} &middot; {total} total files
            </p>

            <div className="flex items-center gap-1.5 sm:gap-2 order-1 sm:order-2">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={!hasPreviousPage}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {getPageNumbers()[0] > 1 && (
                <>
                  <button
                    onClick={() => goToPage(1)}
                    className="w-9 h-9 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 border border-gray-200"
                  >
                    1
                  </button>
                  <span className="text-gray-400 px-1">...</span>
                </>
              )}

              {getPageNumbers().map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-bold transition-colors ${
                    p === page
                      ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  {p}
                </button>
              ))}

              {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                <>
                  <span className="text-gray-400 px-1">...</span>
                  <button
                    onClick={() => goToPage(totalPages)}
                    className="w-9 h-9 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 border border-gray-200"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => goToPage(page + 1)}
                disabled={!hasNextPage}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Image preview modal (images only — audio plays inline in its card) */}
      {previewItem && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100">
              <p className="text-sm font-bold text-gray-900 truncate pr-2">
                {previewItem.name}
              </p>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg flex-shrink-0"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="bg-gray-50 flex items-center justify-center max-h-[70vh] overflow-hidden">
              <img
                src={previewItem.url}
                alt={previewItem.name}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="p-3 sm:p-4 flex justify-end gap-2 border-t border-gray-100">
              <a
                href={previewItem.url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Open / Download
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Media;