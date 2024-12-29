import axios from 'axios';

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: 'http://localhost:8080', // Base URL for your API
});

// Function to add an item to the cart
export const addToCart = async (item) => {
  const token = localStorage.getItem('token'); // Replace 'token' with your actual key
  try {
    const response = await api.post('/cart', item, {
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      },
    });
    return { data: response.data };
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error; // Optionally re-throw the error
  }
};

// Function to fetch items by user ID
export const fetchItemsByUserId = async () => {
  const token = localStorage.getItem('token'); // Replace 'token' with your actual key
  try {
    const response = await api.get('/cart', {
      headers: { 
        'Authorization': `Bearer ${token}` 
      },
    });
    return { data: response.data };
  } catch (error) {
    console.error('Error fetching items from cart:', error);
    throw error; // Optionally re-throw the error
  }
};

// Function to update an item in the cart
export const updateCart = async (update) => {
  const token = localStorage.getItem('token'); // Replace 'token' with your actual key
  try {
    const response = await api.patch(`/cart/${update.id}`, update, {
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      },
    });
    return { data: response.data };
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error; // Optionally re-throw the error
  }
};

// Function to delete an item from the cart
export const deleteItemFromCart = async (itemId) => {
  const token = localStorage.getItem('token'); // Replace 'token' with your actual key
  try {
    await api.delete(`/cart/${itemId}`, {
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      },
    });
    return { data: { id: itemId } };
  } catch (error) {
    console.error('Error deleting item from cart:', error);
    throw error; // Optionally re-throw the error
  }
};

// Function to reset the cart by deleting all items
export const resetCart = async () => {
  try {
    const itemsResponse = await fetchItemsByUserId(); // Fetch all items
    const items = itemsResponse.data;

    for (const item of items) {
      await deleteItemFromCart(item.id); // Delete each item
    }

    return { status: 'success' };
  } catch (error) {
    console.error('Error resetting cart:', error);
    throw error; // Optionally re-throw the error
  }
};
