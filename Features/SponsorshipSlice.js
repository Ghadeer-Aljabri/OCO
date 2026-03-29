import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for creating sponsorship
export const createSponsorship = createAsyncThunk(
  "sponsorship/createSponsorship",
  async (sponsorshipData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/api/sponsorships", 
        sponsorshipData
      ); // Ensure correct endpoint
      return response.data; // Return the response data (the created sponsorship)
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Async thunk for fetching sponsorship data for a logged-in user
export const fetchSponsorships = createAsyncThunk(
  "sponsorship/fetchSponsorships",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8080/api/sponsorships?userId=${userId}`
      ); // Ensure your API supports querying sponsorships by userId
      return response.data; // Return the sponsorship data
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Sponsorship slice
const sponsorshipSlice = createSlice({
  name: "sponsorship",
  initialState: {
    sponsorships: [], // Now an array to store multiple sponsorships
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Creating sponsorship state handling
      .addCase(createSponsorship.pending, (state) => {
        state.isLoading = true; // Set loading to true when request is made
      })
      .addCase(createSponsorship.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sponsorships = action.payload; // Store the created sponsorship data
      })
      .addCase(createSponsorship.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Store error message on failure
      })
      // Fetching sponsorship state handling
      .addCase(fetchSponsorships.pending, (state) => {
        state.isLoading = true; // Set loading to true when request is made
      })
      .addCase(fetchSponsorships.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sponsorships = action.payload; // Store the fetched sponsorship data
      })
      .addCase(fetchSponsorships.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Store error message on failure
      });
  },
});

export default sponsorshipSlice.reducer;
