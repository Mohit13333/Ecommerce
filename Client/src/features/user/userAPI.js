import axios from "axios";

const apiClient = axios.create({
  baseURL: "import.meta.env.VITE_BACKEND_URI",
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
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error.response ? error.response.data : { message: "Network Error" };
  }
};

export const fetchLoggedInUser = async () => {
  try {
    const token = getAuthToken();
    const response = await apiClient.get("/users/own", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("User info response:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
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
