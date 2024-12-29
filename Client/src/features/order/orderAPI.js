import axios from "axios";

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: "import.meta.env.VITE_BACKEND_URI", // Base URL for your API
});

export const createOrder = async (order) => {
  const token = localStorage.getItem("token"); // Replace 'token' with your actual key
  console.log("Order being sent:", order); // Log the order object for debugging
  try {
    const response = await api.post("/orders", order, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Order created successfully:", response.data);
    return { data: response.data };
  } catch (error) {
    console.error("Error creating order:", error.response?.data || error.message);
    throw error;
  }
};



// Function to update an existing order
export const updateOrder = async (order) => {
  const token = localStorage.getItem("token"); // Replace 'token' with your actual key
  if (!token) {
    throw new Error("No authorization token found.");
  }

  try {
    const response = await api.patch(`/orders/${order.id}`, order, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Optional: Check if response is successful
    if (response.status === 200) {
      return { data: response.data };
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error updating order:", error.response ? error.response.data : error.message);
    throw error; // Optionally re-throw the error
  }
};

// Function to fetch all orders with sorting and pagination
export const fetchAllOrders = async (sort, pagination) => {
  const queryString = new URLSearchParams({
    ...sort,
    ...pagination,
  }).toString();
  const token = localStorage.getItem("token"); // Replace 'token' with your actual key
  try {
    const response = await api.get(`/orders?${queryString}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const totalOrders = response.headers["x-total-count"];
    return { data: { orders: response.data, totalOrders: +totalOrders } };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error; // Optionally re-throw the error
  }
};
