import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Register user

export const addUser = createAsyncThunk("user/addUser", async (userData, thunkAPI) => {
  try {
    const response = await axios.post("http://127.0.0.1:8080/register", userData);
    return response.data; // "User Added.." or "User Exists.."
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data || "An error occurred while registering"
    );
  }
});

// Login user
export const getUser = createAsyncThunk(
  "user/getUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://127.0.0.1:8080/login", {
        password: userData.password,
        email: userData.email,
      });
      return response.data.user; // Return user data on success
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid Credentials"
      );
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://127.0.0.1:8080/users"); // Replace with correct API route
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

// Update user details
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8080/users/${userData._id}`,
        userData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user"
      );
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await axios.delete(`http://127.0.0.1:8080/users/${userId}`);
      return userId; // Return the deleted user ID for state update
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

// Forgot password action
export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/forgot-password",
        { email }
      );
      return response.data.message; // Success message
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send reset email"
      );
    }
  }
);

// Reset password action (handles password reset from the email link)
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/reset-password",
        { token, newPassword }
      );
      return response.data.message; // Success message
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reset password"
      );
    }
  }
);

// Update password action
export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/update-password",
        passwordData
      );
      return response.data.message; // Success message
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update password"
      );
    }
  }
);

// Initial state
const initialState = {
  userInfo: [], // User data
  users: [], 
  message: "", // General success message
  loginError: "", // Login error message
  forgotPasswordMessage: "", // Forgot password success message
  forgotPasswordError: "", // Forgot password error message
  resetPasswordMessage: "", // Reset password success message
  resetPasswordError: "", // Reset password error message
  updateError: "", // Update password error message
  isLoading: false, // Loading state
  isLoggedIn: false, // Track login status
  isError: false, // Generic error state
  isSuccess: false, // Generic success state
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register user cases
      .addCase(addUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(addUser.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })

      // Get user (login) cases
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false; // Reset error state
        state.isSuccess = false; // Reset success state
        state.loginError = ""; // Clear previous error message
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.userInfo = action.payload;
        state.isSuccess = true; // Successful login
        state.isError = false; // Clear any error
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true; // Indicate error
        state.loginError = action.payload; // Set error message
        state.isLoggedIn = false;
        state.isSuccess = false; // Ensure success is false
      })

      // Forgot password cases
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.forgotPasswordMessage = "";
        state.forgotPasswordError = "";
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.forgotPasswordMessage = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.forgotPasswordError = action.payload;
      })

      // Reset password cases (handle password reset from email link)
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.resetPasswordMessage = "";
        state.resetPasswordError = "";
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resetPasswordMessage = action.payload; // Success message
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.resetPasswordError = action.payload; // Error message
      })

      // Update password cases
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
        state.updateError = "";
        state.message = "";
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.updateError = action.payload;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })

      // Update user
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        // Update the userInfo if it's the current logged-in user
        if (state.userInfo._id === action.payload._id) {
          state.userInfo = action.payload; // Update user info directly
        }
      
        // Optionally, update the list of all users (if needed)
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
      })
      
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export const { resetSuccess } = userSlice.actions;
export default userSlice.reducer;
