// redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'authentication',
  initialState: {
    loginRegisterData: {
      loginIdentifier: "",
      countryCode: "",
    },
    notifications: [],
  },
  reducers: {
    setLoginRegisterData(state, action) {
      state.loginRegisterData = {
        ...state.loginRegisterData,
        ...action.payload,
      };
    },
    clearLoginRegisterData(state) {
      state.loginRegisterData = {
        loginIdentifier: "",
        countryCode: "",
      };
    },
    logout(state) {
      state.loginRegisterData = {
        loginIdentifier: "",
        countryCode: "",
      };
    },
    AddNotifcation(state, action) {
      state.notifications = [...state.notifications, action.payload]
    },
  },
});

export const { setLoginRegisterData, clearLoginRegisterData, logout, AddNotifcation } = authSlice.actions;

export default authSlice.reducer;
