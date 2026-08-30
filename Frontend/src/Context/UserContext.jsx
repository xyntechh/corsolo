import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { socket } from "../socket.js";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accountDetails, setAccountDetails] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [friendRequests, setfriendRequests] = useState([]);
  const [friendList, setfriendList] = useState([]);
  const [chatPreferences, setChatPreferences] = useState(null);
  const [isMatched, setIsMatched] = useState(false);
  const [selected, setSelected] = useState("infinity"); //THIS STATE FOR THE SELCETED COIN PLAN

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("authToken"); // token ka key jo save kiya tha
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/getUserInfo`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // token ko header me bhejna
          },
        },
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
        },
      );

      setAccountDetails(res.data);
    } catch (error) {
      console.error(
        "Error fetching account details:",
        error.response?.data || error.message,
      );
    }
  };

  const getFriendRequest = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const UserID = user?._id;

      if (!token || !UserID) return;

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/fetchPendingFriendReq/${UserID}`,
      );

      setfriendRequests(res?.data?.requests);
    } catch (error) {
      console.error(
        "Error fetching friend requests:",
        error.response?.data || error.message,
      );
    }
  };

  const getFriend = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) return;

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/get-friends`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Agar context use kar raha hai
      setfriendList(res?.data?.friends);

      return res.data;
    } catch (error) {
      console.error(
        "Error fetching friends:",
        error.response?.data || error.message,
      );
    }
  };

  const removeFriendRequest = (requestId) => {
    setfriendRequests((prev) =>
      prev.filter((request) => request._id !== requestId),
    );
  };

  useEffect(() => {
    getAccountDetails();
    getFriend();
    getFriendRequest();
  }, [refreshKey]);

  useEffect(() => {
    fetchUser();
    getFriend();
  }, []);

  useEffect(() => {
    if (!user?._id) return;

    getFriendRequest();
  }, [user]);

  useEffect(() => {
    socket.on("onlineStatusChanged", ({ userId, online }) => {
      setfriendList((prev) =>
        prev.map((friend) =>
          friend._id === userId ? { ...friend, online } : friend,
        ),
      );
    });

    return () => {
      socket.off("onlineStatusChanged");
    };
  }, []);

  const packages = [
    {
      id: "infinity",
      coins: "Infinity",
      price: 999,
      note: "Unlimited, forever",
      popular: true,
    },
    { id: "p199", coins: 199, price: 199, bonus: 0 },
    { id: "p299", coins: 299, price: 299, bonus: 5 },
    { id: "p499", coins: 499, price: 499, bonus: 10 },
    { id: "p799", coins: 799, price: 799, bonus: 15 },
    { id: "p999", coins: 999, price: 999, bonus: 20 },
  ];

  const Value = {
    user,
    loading,
    setUser,
    fetchUser,
    accountDetails,
    setRefreshKey,
    refreshKey,
    friendRequests,
    setfriendRequests,
    getFriendRequest,
    friendList,
    getFriend,
    chatPreferences,
    setChatPreferences,
    isMatched,
    setIsMatched,
    removeFriendRequest,
    selected,
    setSelected,
    packages,
  };

  return <UserContext.Provider value={Value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);