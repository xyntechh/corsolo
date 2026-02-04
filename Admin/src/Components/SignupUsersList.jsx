import React, { useState, useEffect } from "react";
import {
  Users,
  User,
  Mail,
  Phone,
  Globe,
  Heart,
  Eye,
  Activity,
  Wifi,
  WifiOff,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  UserCheck,
  UserPlus,
  Cake,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SignupUsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const getUsersList = async (page = 1) => {
    setLoading(true);

    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Unauthorized. Please login again.");
      return;
    }

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/userDashboard/getAllSignUpUser?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUsers(response?.data?.data);
        setTotalPages(response?.data?.pagination?.totalPages);

        console.log(response?.data?.pagination?.totalPages);
        setCurrentPage(response?.data?.pagination?.currentPage);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsersList(currentPage);
  }, [currentPage]);

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

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleViewDetails = (userId) => {

    console.log(userId)
    navigate("/dashboard/signUpUserDetails", {
      state: { userId },
    });
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Signup Users
              </h2>
              <p className="text-sm sm:text-base text-gray-600 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Monitor and manage registered users
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Registered Users
            </h3>
            <span className="text-sm text-gray-500 font-semibold">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <div className="space-y-3">
            {users.map((user, index) => (
              <div
                key={user._id}
                className="flex flex-col gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/50 hover:from-blue-50 hover:to-blue-100/50 transition-all duration-200 group cursor-pointer border border-transparent hover:border-blue-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${
                          avatarColors[index % avatarColors.length]
                        } rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-110 transition-transform`}
                      >
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                          user?.isOnline ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                          {user?.name}
                        </h4>
                        <span
                          className={`px-2 py-0.5 text-xs font-semibold rounded-lg flex items-center gap-1 ${
                            user?.isOnline
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {user?.isOnline ? (
                            <Wifi className="w-3 h-3" />
                          ) : (
                            <WifiOff className="w-3 h-3" />
                          )}
                          {user?.isOnline ? "Online" : "Offline"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {user?.gender} • {user?.age} years
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-gray-400">Email</span>
                      <span className="font-semibold text-gray-700 truncate">
                        {user?.email || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400">Phone</span>
                      <span className="font-semibold text-gray-700">
                        {user?.phone || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-gray-400">IP Address</span>
                      <span className="font-semibold text-gray-700 truncate">
                        {user?.ip || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <Cake className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400">Age</span>
                      <span className="font-semibold text-gray-700">
                        {user?.age} years
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-4 h-4 text-pink-600" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-gray-400">Looking For</span>
                      <span className="font-semibold text-gray-700 truncate">
                        {user?.lookingFor || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end border-t pt-3">
                  <button
                    onClick={() => handleViewDetails(user?._id)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg transition-all flex items-center gap-2 hover:shadow-lg font-semibold text-xs sm:text-sm transform hover:scale-105"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-semibold text-sm transition-all ${
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return (
                    <span key={pageNum} className="text-gray-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignupUsersList;
