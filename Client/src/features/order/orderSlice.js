import { createSlice } from '@reduxjs/toolkit';
import { createOrder, fetchAllOrders, updateOrder } from './orderAPI';

const initialState = {
  orders: [],
  status: 'idle',
  currentOrder: null,
  totalOrders: 0,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.currentOrder = null;
    },
    setOrders: (state, action) => {
      state.orders = action.payload.orders;
      state.totalOrders = action.payload.totalOrders;
    },
    addOrder: (state, action) => {
      state.orders.push(action.payload);
      state.currentOrder = action.payload;
    },
    updateOrderInState: (state, action) => {
      const index = state.orders.findIndex(order => order.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

// Thunk actions
export const createOrderAsync = (order) => async (dispatch) => {
  dispatch(orderSlice.actions.setStatus('loading'));
  try {
    const response = await createOrder(order);
    console.log(response)
    dispatch(orderSlice.actions.addOrder(response.data));
    dispatch(orderSlice.actions.setStatus('idle'));
  } catch (error) {
    console.error('Error creating order:', error);
    dispatch(orderSlice.actions.setStatus('idle'));
  }
};

export const updateOrderAsync = (order) => async (dispatch) => {
  dispatch(orderSlice.actions.setStatus('loading'));
  try {
    const response = await updateOrder(order);
    dispatch(orderSlice.actions.updateOrderInState(response.data));
    dispatch(orderSlice.actions.setStatus('idle'));
  } catch (error) {
    console.error('Error updating order:', error);
    dispatch(orderSlice.actions.setStatus('idle'));
  }
};

export const fetchAllOrdersAsync = ({ sort, pagination }) => async (dispatch) => {
  dispatch(orderSlice.actions.setStatus('loading'));
  try {
    const response = await fetchAllOrders(sort, pagination);
    dispatch(orderSlice.actions.setOrders(response.data));
    dispatch(orderSlice.actions.setStatus('idle'));
  } catch (error) {
    console.error('Error fetching orders:', error);
    dispatch(orderSlice.actions.setStatus('idle'));
  }
};

export const { resetOrder } = orderSlice.actions;

// Selectors
export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectOrders = (state) => state.order.orders;
export const selectTotalOrders = (state) => state.order.totalOrders;
export const selectStatus = (state) => state.order.status;

export default orderSlice.reducer;
