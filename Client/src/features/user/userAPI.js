import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URI,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const fetchLoggedInUserOrders = async () => {
  try {
    const token = getAuthToken();
    const response = await apiClient.get("/orders/own/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network Error" };
  }
};

export const fetchLoggedInUser = async () => {
  try {
    const token = getAuthToken();
    const response = await apiClient.get("/users/own", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
    }
    throw error.response ? error.response.data : { message: "Network Error" };
  }
};

export const updateUser = async (update) => {
  try {
    const token = getAuthToken();
    const response = await apiClient.patch(`/users/${update.id}`, update, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error.response ? error.response.data : { message: "Network Error" };
    t;
  }
};
