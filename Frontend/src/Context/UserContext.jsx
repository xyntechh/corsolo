import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accountDetails, setAccountDetails] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("authToken"); // token ka key jo save kiya tha
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/getUserInfo`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // token ko header me bhejna
          },
        }
      );
      if (res.data) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const getAccountDetails = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/partner/getInformation`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAccountDetails(res.data); // 🔥 UI auto update
    } catch (error) {
      console.error(
        "Error fetching account details:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    getAccountDetails();
  }, [refreshKey]);

  useEffect(() => {
    fetchUser();
  }, []);

  const Value = {
    user,
    loading,
    setUser,
    fetchUser,
    accountDetails,
    setRefreshKey,
  };

  return <UserContext.Provider value={Value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
