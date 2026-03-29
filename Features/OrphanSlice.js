import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Register a new orphan
export const registerOrphan = createAsyncThunk(
  "orphan/registerOrphan",
  async (orphanData, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://127.0.0.1:8080/orphans", orphanData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch all orphans
export const fetchOrphans = createAsyncThunk(
  "orphan/fetchOrphans", // ✅ FIXED
  async () => {
    const response = await axios.get("http://127.0.0.1:8080/orphans");
    return response.data;
  }
);

// Delete an orphan
export const deleteOrphan = createAsyncThunk(
  "orphan/deleteOrphan", // ✅ FIXED
  async (id) => {
    await axios.delete(`http://127.0.0.1:8080/orphans/${id}`);
    return id;
  }
);

// Update an orphan
export const updateOrphan = createAsyncThunk(
  "orphan/updateOrphan",
  async (orphan) => {
    const response = await axios.put(`http://127.0.0.1:8080/orphans/${orphan._id}`, orphan);
    return response.data;
  }
);

const initialState = {
  orphans: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
};

const OrphanSlice = createSlice({
  name: "orphan",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.isError = false; // ✅ FIXED
      state.isSuccess = false; // ✅ FIXED
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerOrphan.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(registerOrphan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true; // ✅ FIXED
        state.orphans.push(action.payload);
      })
      .addCase(registerOrphan.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload.error || "An unknown error occurred";
      })
      .addCase(fetchOrphans.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrphans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orphans = action.payload;
      })
      .addCase(fetchOrphans.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message;
      })
      .addCase(deleteOrphan.fulfilled, (state, action) => {
        state.orphans = state.orphans.filter((o) => o._id !== action.payload);
      })
      .addCase(updateOrphan.fulfilled, (state, action) => {
        const index = state.orphans.findIndex((o) => o._id === action.payload._id);
        if (index !== -1) {
          state.orphans[index] = action.payload;
        }
      });
  },
});

export const { clearMessages } = OrphanSlice.actions;
export default OrphanSlice.reducer;
