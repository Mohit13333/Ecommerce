import axios from 'axios';

// Create an Axios instance with a base URL
const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URI}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to create a user
export const createUser = async (userData) => {
  try {
    const response = await apiClient.post('/signup', userData);
    return response.data; // Return the response data directly
  } catch (error) {
    throw error.response ? error.response.data : error; // Handle errors
  }
};

// Function to log in a user
// Function to log in a user
export const loginUser = async (loginInfo) => {
    try {
      const response = await apiClient.post('/login', loginInfo, { withCredentials: true });
      console.log('Login Response:', response.data); // Log the entire response
      return response.data; // Return the response data directly
    } catch (error) {
      console.error('Login Error:', error); // Log any errors
      throw error.response ? error.response.data : error; // Handle errors
    }
  };
  
// Function to check authentication status
export const checkAuth = async () => {
  try {
    const response = await apiClient.get('/check');
    return response.data; // Return the response data directly
  } catch (error) {
    throw error.response ? error.response.data : error; // Handle errors
  }
};

// Function to sign out a user
export const signOut = async () => {
  try {
    await apiClient.post('/logout');
    return { data: 'success' }; // Return success message
  } catch (error) {
    throw error.response ? error.response.data : error; // Handle errors
  }
};

// Function to request a password reset
export const resetPasswordRequest = async (email) => {
  try {
    const response = await apiClient.post('/reset-password-request', { email });
    console.log(response)
    return response.data; // Return the response data directly
  } catch (error) {
    throw error.response ? error.response.data : error; // Handle errors
  }
};

// Function to reset the password
export const resetPassword = async (data) => {
  try {
    const response = await apiClient.post('/reset-password', data);
    console.log(response)
    return response.data; // Return the response data directly
  } catch (error) {
    throw error.response ? error.response.data : error; // Handle errors
  }
};
