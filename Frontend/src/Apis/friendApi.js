import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;


export const acceptFriendRequest = async (requestId, token) => {
  try {
    const res = await axios.patch(
      `${API_URL}/api/user/friend-request/${requestId}/accept`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};


export const rejectFriendRequest = async (requestId, token) => {
  try {
    const res = await axios.patch(
      `${API_URL}/api/user/friend-request/${requestId}/reject`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};