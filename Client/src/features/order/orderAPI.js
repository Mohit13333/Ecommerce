import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URI,
});

export const createOrder = async (order) => {
  const token = localStorage.getItem("token");
  try {
    const response = await api.post("/orders", order, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { data: response.data };
  } catch (error) {
    console.error("Error creating order:", error.response?.data || error.message);
    throw error;
  }
};

export const updateOrder = async (order) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authorization token found.");
  }

  try {
    const response = await api.patch(`/orders/${order.id}`, order, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200) {
      return { data: response.data };
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error updating order:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchAllOrders = async (sort, pagination) => {
  const queryString = new URLSearchParams({
    ...sort,
    ...pagination,
  }).toString();
  const token = localStorage.getItem("token");
  try {
    const response = await api.get(`/orders?${queryString}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const totalOrders = response.headers["x-total-count"];
    return { data: { orders: response.data, totalOrders: +totalOrders } };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};
