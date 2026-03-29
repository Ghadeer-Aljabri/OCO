import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create donation thunk
export const createDonation = createAsyncThunk(
  'donations/createDonation',
  async (donationData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://127.0.0.1:8080/api/donations', donationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch all donations (optional, in case admin wants to view all donations)
export const fetchDonations = createAsyncThunk(
  'donations/fetchDonations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://127.0.0.1:8080/api/donations');
      console.log('API Response:', response.data); // Log the response data

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const donationSlice = createSlice({
  name: 'donations',
  initialState: {
    donations: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Donation
      .addCase(createDonation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDonation.fulfilled, (state, action) => {
        state.loading = false;
        state.donations.push(action.payload);
      })
      .addCase(createDonation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Donations
      .addCase(fetchDonations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDonations.fulfilled, (state, action) => {
        state.loading = false;
        state.donations = action.payload;
      })
      .addCase(fetchDonations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default donationSlice.reducer;
