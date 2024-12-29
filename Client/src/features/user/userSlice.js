import { createSlice } from '@reduxjs/toolkit';
import {
  fetchLoggedInUserOrders,
  updateUser,
  fetchLoggedInUser,
} from './userAPI';

const initialState = {
  status: 'idle',
  userInfo: {
    orders: [],
  }, 
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchLoggedInUserOrdersStart(state) {
      state.status = 'loading';
    },
    fetchLoggedInUserOrdersSuccess(state, action) {
      state.status = 'idle';
      state.userInfo.orders = action.payload;
    },
    fetchLoggedInUserOrdersFailure(state) {
      state.status = 'idle';
      // Handle error if needed
    },
    fetchLoggedInUserStart(state) {
      state.status = 'loading';
    },
    fetchLoggedInUserSuccess(state, action) {
      state.status = 'idle';
      state.userInfo = action.payload;
    },
    fetchLoggedInUserFailure(state) {
      state.status = 'idle';
      // Handle error if needed
    },
    updateUserStart(state) {
      state.status = 'loading';
    },
    updateUserSuccess(state, action) {
      state.status = 'idle';
      state.userInfo = action.payload;
    },
    updateUserFailure(state) {
      state.status = 'idle';
      // Handle error if needed
    },
  },
});

// Action creators
export const {
  fetchLoggedInUserOrdersStart,
  fetchLoggedInUserOrdersSuccess,
  fetchLoggedInUserOrdersFailure,
  fetchLoggedInUserStart,
  fetchLoggedInUserSuccess,
  fetchLoggedInUserFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} = userSlice.actions;

// Thunks (Now you need to create thunks manually)
export const fetchLoggedInUserOrdersAsync = () => async (dispatch) => {
  dispatch(fetchLoggedInUserOrdersStart());
  try {
    const response = await fetchLoggedInUserOrders();
    dispatch(fetchLoggedInUserOrdersSuccess(response));
  } catch (error) {
    dispatch(fetchLoggedInUserOrdersFailure());
  }
};

export const fetchLoggedInUserAsync = () => async (dispatch) => {
  dispatch(fetchLoggedInUserStart());
  try {
    const response = await fetchLoggedInUser();
    console.log(response)
    dispatch(fetchLoggedInUserSuccess(response));
  } catch (error) {
    dispatch(fetchLoggedInUserFailure());
  }
};

export const updateUserAsync = (update) => async (dispatch) => {
  dispatch(updateUserStart());
  try {
    const response = await updateUser(update);
    dispatch(updateUserSuccess(response.data));
  } catch (error) {
    dispatch(updateUserFailure());
  }
};

export const selectUserOrders = (state) => state.user.userInfo.orders;
export const selectUserInfo = (state) => state.user.userInfo;
export const selectUserInfoStatus = (state) => state.user.status;

export default userSlice.reducer;
