import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Admin Login action
export const getAdmin = createAsyncThunk("admin/getAdmin", async (adminData, { rejectWithValue }) => {
  try {
    const response = await axios.post("http://127.0.0.1:8080/admin-login", {
      email: adminData.email,
      password: adminData.password,
    });
    return response.data.admin; 
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Invalid Admin Credentials");
  }
});

// Initial state
const initialState = {
  adminInfo: null,               // Admin data
  loginError: "",                // Login error message
  isLoading: false,              // Loading state
  isLoggedIn: false,             // Track login status
  isError: false,                // Generic error state
  isSuccess: false,              // Generic success state
};

// Admin slice
export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    resetAdminSuccess: (state) => {
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin login cases
      .addCase(getAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.adminInfo = action.payload;
        state.isSuccess = true; // Set success state
      })
      .addCase(getAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.loginError = action.payload; // Set error message
        state.isLoggedIn = false; // Ensure admin login status is false
      });
  },
});

export const { resetAdminSuccess } = adminSlice.actions;
export default adminSlice.reducer;
