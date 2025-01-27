import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URI,
});

export const addToCart = async (item) => {
  const token = localStorage.getItem('token');
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
    throw error;
  }
};

export const fetchItemsByUserId = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await api.get('/cart', {
      headers: { 
        'Authorization': `Bearer ${token}` 
      },
    });
    return { data: response.data };
  } catch (error) {
    console.error('Error fetching items from cart:', error);
    throw error;
  }
};

export const updateCart = async (update) => {
  const token = localStorage.getItem('token');
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
    throw error;
  }
};

export const deleteItemFromCart = async (itemId) => {
  const token = localStorage.getItem('token');
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
    throw error;
  }
};

export const resetCart = async () => {
  try {
    const itemsResponse = await fetchItemsByUserId();
    const items = itemsResponse.data;

    for (const item of items) {
      await deleteItemFromCart(item.id);
    }

    return { status: 'success' };
  } catch (error) {
    console.error('Error resetting cart:', error);
    throw error;
  }
};
