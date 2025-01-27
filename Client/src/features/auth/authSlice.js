import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  createUser,
  signOut,
  checkAuth,
  resetPasswordRequest,
  resetPassword,
} from "./authAPI";

const initialState = {
  loggedInUserToken: localStorage.getItem("token") || null,
  status: "idle",
  error: null,
  userChecked: false,
  mailSent: false,
  passwordReset: false,
};

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading(state) {
      state.status = "loading";
    },
    setIdle(state) {
      state.status = "idle";
    },
    setLoggedInUser(state, action) {
      state.loggedInUserToken = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    setUserChecked(state) {
      state.userChecked = true;
    },
    setMailSent(state) {
      state.mailSent = true;
    },
    setPasswordReset(state) {
      state.passwordReset = true;
    },
    clearToken(state) {
      state.loggedInUserToken = null;
    },
    clearMailSent(state) {
      state.mailSent = false;
    },
    clearPasswordReset(state) {
      state.passwordReset = false;
    },
  },
});

export const {
  setLoading,
  setIdle,
  setLoggedInUser,
  setError,
  clearError,
  setUserChecked,
  setMailSent,
  setPasswordReset,
  clearToken,
  clearMailSent,
  clearPasswordReset,
} = authSlice.actions;

export const createUserAction = (userData) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await createUser(userData);
    localStorage.setItem("token", response.token);
    dispatch(setLoggedInUser(response.token));
    dispatch(clearError());
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setIdle());
  }
};

export const loginUserAction = (loginInfo) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await loginUser(loginInfo);
    localStorage.setItem("token", response.token);
    dispatch(setLoggedInUser(response.token));
    dispatch(clearError());
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setIdle());
  }
};

export const checkAuthAction = () => async (dispatch) => {
  dispatch(setLoading());
  const token = localStorage.getItem("token");
  if (!token) {
    dispatch(setError("No token found"));
    dispatch(setUserChecked());
    return;
  }
  try {
    const response = await checkAuth();
    dispatch(setLoggedInUser(response.token));
    dispatch(clearError());
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setUserChecked());
    dispatch(setIdle());
  }
};

export const resetPasswordRequestAction = (email) => async (dispatch) => {
  dispatch(setLoading());
  try {
    await resetPasswordRequest(email);
    dispatch(setMailSent());
    dispatch(clearError());
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setIdle());
  }
};
export const resetPasswordAction = (data) => async (dispatch) => {
  dispatch(setLoading());
  try {
    await resetPassword(data);
    dispatch(setPasswordReset());
    dispatch(clearError());
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setIdle());
  }
};

export const signOutAction = () => (dispatch) => {
  dispatch(setLoading());
  signOut();
  localStorage.removeItem("token");
  dispatch(clearToken());
  dispatch(setIdle());
};

export const selectLoggedInUser = (state) => state.auth.loggedInUserToken;
export const selectError = (state) => state.auth.error;
export const selectUserChecked = (state) => state.auth.userChecked;
export const selectMailSent = (state) => state.auth.mailSent;
export const selectPasswordReset = (state) => state.auth.passwordReset;

export default authSlice.reducer;
