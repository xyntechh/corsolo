import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setstats] = useState({});
  const [recentUser, setrecentUser] = useState([]);
  const [userStats, setuserStats] = useState({});
  const [last7daysGraph, setlast7daysGraph] = useState([]);
  const [avarageUserPerDay, setavarageUserPerDay] = useState({});
  const [partnerStats, setpartnerStats] = useState({});
  const [recentPartner, setrecentPartner] = useState([]);
  const [paymentDashboardStats, setpaymentDashboardStats] = useState({});
  const [recentPayment, setrecentPayment] = useState([]);
  const [last7daysPayment, setlast7daysPayment] = useState([]);
  const [EbookStats, setEbookStats] = useState([]);
  const [recentEbookOrder, setrecentEbookOrder] = useState([]);
  const [recentValentineOrder, setrecentValentineOrder] = useState({});
  const [valentineAllOrder, setvalentineAllOrder] = useState([]);

  const navigate = useNavigate();

  //LOGIN FUNCTION
  const loginFunction = async (email, password) => {
    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/login`,
        { email, password },
      );

      if (res.data.success) {
        const { token, admin } = res.data;

        localStorage.setItem("authToken", token);

        setAdmin(admin);

        toast.success("Admin login successful");
        navigate("/dashboard");
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  //GET DASHBOARD STATS FUCNTION
  const getDashboardFunction = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("Unauthorized. Please login again.");
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/dashboard/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(res.data.data);

      setstats(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  //GET RECENT USER FUNCTION
  const getRecentUserfunction = async () => {
    setLoading(true);

    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Unauthorized. Please login again.");
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/dashboard/recentUser`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setrecentUser(res.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  //GET USERDASHBOARD FUNCTION
  const userStatsFunction = async () => {
    setLoading(true);

    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Unauthorized. Please login again.");
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/userDashboard/userStats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setuserStats(res.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  //GET LAST 7 DAYS USER COMPPARISSON
  const userLast7DaysFunction = async () => {
    setLoading(true);

    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Unauthorized. Please login again.");
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/userDashboard/last7days`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setlast7daysGraph(res.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  //GET AVARAGE USER PER DAY
  const getUserPerDayFunction = async () => {
    setLoading(true);

    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Unauthorized. Please login again.");
      return;
    }
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/userDashboard/avagrageUserPerDay`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setavarageUserPerDay(res.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  //GET PARTNER STATS
  const getPartnerStats = async () => {
    setLoading(true);

    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Unauthorized. Please login again.");
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/partnerDashboard/partnerStats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setpartnerStats(res.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  //GET RECENT JOIN PARTNER
  const getRecentPartnerFunction = async () => {
    setLoading(true);

    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Unauthorized. Please login again.");
      return;
    }

    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/partnerDashboard/RecentJoinPartner`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setrecentPartner(res.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  //GET PAYMEMNT DASHBOARD STATS
  const getPaymentDashboardStatsFunction = async () => {
    setLoading(true);

    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Unauthorized. Please login again.");
      return;
    }

    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/paymentDashboard/getPaymentDashboardStats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res?.data?.success) {
        setpaymentDashboardStats(res?.data?.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getRecentPaymentDetailsFunction = async () => {
    setLoading(true);

    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Unauthorized. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/paymentDashboard/recentPayment`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setrecentPayment(res?.data?.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getLast7DaysPaymentGraph = async () => {
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
        }/api/paymentDashboard/last7daysPaymentGraph`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res?.data?.success) {
        setlast7daysPayment(res?.data?.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const geteBookDashboardStats = async () => {
    setLoading(true);

    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Unauthorized. Please login again.");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/eBookDashboard/getDashboardStats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res?.data?.success) {
        setEbookStats(res?.data?.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getRecentEbookOrderFunction = async () => {
    setLoading(true);

    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Unauthorized. Please login again.");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/eBookDashboard/getAllEbookOrder`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res?.data?.success) {
        setrecentEbookOrder(res?.data?.ebooks);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getValentineOrder = async () => {
    setLoading(true);

    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Unauthorized. Please login again.");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/valentineDashboard/getValentineCard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res?.data?.success) {
        setrecentValentineOrder(res?.data?.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getValentineOrderFunction = async () => {
    setLoading(true);

    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Unauthorized. Please login again.");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/valentineDashboard/getAllValentineOrder`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res?.data?.success) {
        setvalentineAllOrder(res?.data?.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        loginFunction,
        admin,
        loading,
        setLoading,
        getDashboardFunction,
        stats,
        getRecentUserfunction,
        recentUser,
        userStatsFunction,
        userStats,
        userLast7DaysFunction,
        last7daysGraph,
        getUserPerDayFunction,
        avarageUserPerDay,
        getPartnerStats,
        partnerStats,
        getRecentPartnerFunction,
        recentPartner,
        getPaymentDashboardStatsFunction,
        paymentDashboardStats,
        getRecentPaymentDetailsFunction,
        recentPayment,
        getLast7DaysPaymentGraph,
        last7daysPayment,
        geteBookDashboardStats,
        EbookStats,
        getRecentEbookOrderFunction,
        recentEbookOrder,
        recentValentineOrder,
        getValentineOrder,
        valentineAllOrder,
        getValentineOrderFunction,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
