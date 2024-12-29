import axios from 'axios';

// Set up the Axios instance with a base URL
const api = axios.create({
  baseURL: 'import.meta.env.VITE_BACKEND_URI',
});

// Function to get the authorization token from local storage
const getAuthToken = () => {
  return localStorage.getItem('token'); // Replace 'authToken' with your actual token key
};

// Function to fetch a product by ID
export const fetchProductById = async (id) => {
  const response = await api.get(`/products/${id}`, {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
  console.log(response.data)
  return response.data;
};

// Function to create a new product
export const createProduct = async (product) => {
  const response = await api.post('/products', product, {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
  console.log(response.data)
  return response.data;
};

// Function to update an existing product
export const updateProduct = async (update) => {
  const response = await api.patch(`/products/${update.id}`, update, {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
  console.log(response.data)
  return response.data;
};

// Function to fetch products by filters
export const fetchProductsByFilters = async (filter, sort, pagination, admin) => {
  let queryString = new URLSearchParams();

  for (let key in filter) {
    const categoryValues = filter[key];
    if (categoryValues.length) {
      queryString.append(key, categoryValues.join(',')); // Join multiple category values with a comma
    }
  }
  for (let key in sort) {
    queryString.append(key, sort[key]);
  }
  for (let key in pagination) {
    queryString.append(key, pagination[key]);
  }
  if (admin) {
    queryString.append('admin', 'true');
  }

  try {
    const response = await api.get(`/products?${queryString.toString()}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    console.log(response.data)

    const totalItems = response.headers['x-total-count'];
    return { products: response.data, totalItems: +totalItems }; // Convert totalItems to a number
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

// Function to fetch all categories
export const fetchCategories = async () => {
  const response = await api.get('/categories', {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
  console.log(response.data)
  return response.data;
};

// Function to fetch all brands
export const fetchBrands = async () => {
  const response = await api.get('/brands', {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
  console.log(response.data)
  return response.data;
};
