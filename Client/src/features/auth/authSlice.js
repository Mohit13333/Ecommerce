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

// Create User Action
export const createUserAction = (userData) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await createUser(userData);
    localStorage.setItem("token", response.token); // Save the token from the response
    dispatch(setLoggedInUser(response.token));
    dispatch(clearError());
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setIdle());
  }
};


// Login User Action
export const loginUserAction = (loginInfo) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await loginUser(loginInfo);
    localStorage.setItem("token", response.token); // Adjusted to access token directly
    dispatch(setLoggedInUser(response.token)); // Adjusted to access token directly
    dispatch(clearError());
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setIdle());
  }
};

// Check Authentication Action
export const checkAuthAction = () => async (dispatch) => {
  dispatch(setLoading());
  const token = localStorage.getItem("token");
  if (!token) {
    dispatch(setError("No token found"));
    dispatch(setUserChecked());
    return;
  }
  try {
    const response = await checkAuth(); // Assume this validates the token
    dispatch(setLoggedInUser(response.token)); // Set token in the state
    dispatch(clearError());
  } catch (error) {
    // localStorage.removeItem("token"); // Remove token if there's an error
    // dispatch(clearToken());
    dispatch(setError(error.message));
  } finally {
    dispatch(setUserChecked());
    dispatch(setIdle());
  }
};

// Reset Password Request Action
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

// Reset Password Action
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

// Sign Out Action
export const signOutAction = () => (dispatch) => {
  dispatch(setLoading());
  signOut();
  localStorage.removeItem("token");
  dispatch(clearToken());
  dispatch(setIdle());
};

// Selectors
export const selectLoggedInUser = (state) => state.auth.loggedInUserToken;
export const selectError = (state) => state.auth.error;
export const selectUserChecked = (state) => state.auth.userChecked;
export const selectMailSent = (state) => state.auth.mailSent;
export const selectPasswordReset = (state) => state.auth.passwordReset;

export default authSlice.reducer;
