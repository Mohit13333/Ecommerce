import axios from 'axios';
const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URI}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createUser = async (userData) => {
  try {
    const response = await apiClient.post('/signup', userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error; 
  }
};

export const loginUser = async (loginInfo) => {
    try {
      const response = await apiClient.post('/login', loginInfo, { withCredentials: true });
      return response.data; 
    } catch (error) {
      console.error('Login Error:', error);
      throw error.response ? error.response.data : error; 
    }
  };
  
export const checkAuth = async () => {
  try {
    const response = await apiClient.get('/check');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error; 
  }
};

export const signOut = async () => {
  try {
    await apiClient.post('/logout');
    return { data: 'success' };
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const resetPasswordRequest = async (email) => {
  try {
    const response = await apiClient.post('/reset-password-request', { email });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await apiClient.post('/reset-password', data);
    return response.data; 
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
