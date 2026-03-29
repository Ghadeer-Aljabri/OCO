import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to submit feedback
export const submitFeedback = createAsyncThunk(
    "feedback/submitFeedback",
    async (feedbackData, { getState, rejectWithValue }) => {
      try {
        // Get user from state
        const user = getState().user.userInfo;
        if (!user || !user._id) {
          return rejectWithValue("User not logged in!");
        }
  
        // Include userId in feedbackData
        const response = await axios.post("http://127.0.0.1:8080/feedback", {
          userId: user._id,  // 🔹 Add userId
          ...feedbackData,
        });
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to submit feedback");
      }
    }
  );
  

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    message: "",
    isLoading: false,
    isError: false,
    isSuccess: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitFeedback.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export default feedbackSlice.reducer;
