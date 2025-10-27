import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  balance: null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.username;
      state.token = action.payload.token;
      state.balance = action.payload.balance;
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('username', action.payload.username);
        localStorage.setItem('balance', action.payload.balance);
      }
    },
    loginFailure: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.balance = null;
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
    },
    updateBalance: (state, action) => {
      state.balance = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('balance', action.payload);
      }
    },
    initializeAuth: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const balance = localStorage.getItem('balance');
        if (token && username) {
          state.isAuthenticated = true;
          state.user = username;
          state.token = token;
          state.balance = balance;
        }
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateBalance, initializeAuth } = authSlice.actions;
export default authSlice.reducer;

