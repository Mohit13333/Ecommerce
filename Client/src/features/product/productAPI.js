import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URI,
});

const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const fetchProductById = async (id) => {
  const response = await api.get(`/products/${id}`, {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
  return response.data;
};

export const createProduct = async (product) => {
  const response = await api.post("/products", product, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateProduct = async (update) => {
  const response = await api.patch(`/products/${update.id}`, update, {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
  return response.data;
};

export const fetchProductsByFilters = async (filter, sort, pagination, admin) => {
  let queryString = new URLSearchParams();

  for (let key in filter) {
    const categoryValues = filter[key];
    if (categoryValues.length) {
      queryString.append(key, categoryValues.join(","));
    }
  }
  for (let key in sort) {
    queryString.append(key, sort[key]);
  }
  for (let key in pagination) {
    queryString.append(key, pagination[key]);
  }
  if (admin) {
    queryString.append("admin", "true");
  }

  try {
    const response = await api.get(`/products?${queryString.toString()}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });

    const totalItems = response.headers["x-total-count"];
    return { products: response.data, totalItems: +totalItems };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
};

export const fetchCategories = async () => {
  const response = await api.get("/categories", {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
  return response.data;
};

export const fetchBrands = async () => {
  const response = await api.get("/brands", {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });

  return response.data;
};
