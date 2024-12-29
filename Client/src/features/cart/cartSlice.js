import { createSlice } from '@reduxjs/toolkit';
import { addToCart, deleteItemFromCart, fetchItemsByUserId, resetCart, updateCart } from './cartAPI';

const initialState = {
  status: 'idle',
  items: [],
  cartLoaded: false,
};

// Action creators
const addToCartAction = (item) => ({ type: 'cart/addToCart', payload: item });
const fetchItemsByUserIdAction = () => ({ type: 'cart/fetchItemsByUserId' });
const updateCartAction = (update) => ({ type: 'cart/updateCart', payload: update });
const deleteItemFromCartAction = (itemId) => ({ type: 'cart/deleteItemFromCart', payload: itemId });
const resetCartAction = () => ({ type: 'cart/resetCart' });

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Handle synchronous actions
    addToCartPending: (state) => {
      state.status = 'loading';
    },
    addToCartFulfilled: (state, action) => {
      state.status = 'idle';
      state.items.push(action.payload);
    },
    fetchItemsByUserIdPending: (state) => {
      state.status = 'loading';
    },
    fetchItemsByUserIdFulfilled: (state, action) => {
      state.status = 'idle';
      state.items = action.payload;
      state.cartLoaded = true;
    },
    fetchItemsByUserIdRejected: (state) => {
      state.status = 'idle';
      state.cartLoaded = true;
    },
    updateCartPending: (state) => {
      state.status = 'loading';
    },
    updateCartFulfilled: (state, action) => {
      state.status = 'idle';
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteItemFromCartPending: (state) => {
      state.status = 'loading';
    },
    deleteItemFromCartFulfilled: (state, action) => {
      state.status = 'idle';
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items.splice(index, 1);
      }
    },
    resetCartPending: (state) => {
      state.status = 'loading';
    },
    resetCartFulfilled: (state) => {
      state.status = 'idle';
      state.items = [];
    },
  },
});

// Thunk-like functions for async actions
export const addToCartAsync = (item) => async (dispatch) => {
  dispatch(cartSlice.actions.addToCartPending());
  try {
    const response = await addToCart(item);
    dispatch(cartSlice.actions.addToCartFulfilled(response.data));
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    dispatch(cartSlice.actions.addToCartRejected());
  }
};

export const fetchItemsByUserIdAsync = () => async (dispatch) => {
  dispatch(cartSlice.actions.fetchItemsByUserIdPending());
  try {
    const response = await fetchItemsByUserId();
    dispatch(cartSlice.actions.fetchItemsByUserIdFulfilled(response.data));
  } catch (error) {
    console.error('Failed to fetch items:', error);
    dispatch(cartSlice.actions.fetchItemsByUserIdRejected());
  }
};

export const updateCartAsync = (update) => async (dispatch) => {
  dispatch(cartSlice.actions.updateCartPending());
  try {
    const response = await updateCart(update);
    dispatch(cartSlice.actions.updateCartFulfilled(response.data));
  } catch (error) {
    console.error('Failed to update cart:', error);
  }
};

export const deleteItemFromCartAsync = (itemId) => async (dispatch) => {
  dispatch(cartSlice.actions.deleteItemFromCartPending());
  try {
    const response = await deleteItemFromCart(itemId);
    dispatch(cartSlice.actions.deleteItemFromCartFulfilled(response.data));
  } catch (error) {
    console.error('Failed to delete item from cart:', error);
  }
};

export const resetCartAsync = () => async (dispatch) => {
  dispatch(cartSlice.actions.resetCartPending());
  try {
    await resetCart();
    dispatch(cartSlice.actions.resetCartFulfilled());
  } catch (error) {
    console.error('Failed to reset cart:', error);
  }
};

// Selectors
export const selectItems = (state) => state.cart.items;
export const selectCartStatus = (state) => state.cart.status;
export const selectCartLoaded = (state) => state.cart.cartLoaded;

export const { 
  addToCartPending, 
  addToCartFulfilled, 
  fetchItemsByUserIdPending, 
  fetchItemsByUserIdFulfilled, 
  fetchItemsByUserIdRejected, 
  updateCartPending, 
  updateCartFulfilled, 
  deleteItemFromCartPending, 
  deleteItemFromCartFulfilled, 
  resetCartPending, 
  resetCartFulfilled 
} = cartSlice.actions;

export default cartSlice.reducer;
