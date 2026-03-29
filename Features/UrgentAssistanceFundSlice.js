import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Apply for fund
export const applyForFund = createAsyncThunk("fund/apply", async (fundData, { rejectWithValue }) => {
    try {
        const response = await axios.post("http://127.0.0.1:8080/urgentAssistance", fundData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Fetch all applications
export const fetchFundApplications = createAsyncThunk("fund/fetchAll", async () => {
    const response = await axios.get("http://127.0.0.1:8080/urgentAssistance");
    return response.data;
});

// Update application status
export const updateFundStatus = createAsyncThunk("fund/update", async ({ id, status, adminNotes }) => {
    const response = await axios.put(`http://127.0.0.1:8080/urgentAssistance/${id}`, { status, adminNotes });
    return response.data;
});

// Delete application
export const deleteApplication = createAsyncThunk("fund/delete", async (id) => {
    await axios.delete(`http://127.0.0.1:8080/urgentAssistance/${id}`);
    return id;
});

const initialState = {
    applications: [],
    isLoading: false,
    isError: false,
};

const UrgentAssistanceFundSlice = createSlice({
    name: "fund",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFundApplications.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchFundApplications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.applications = action.payload;
            })
            .addCase(fetchFundApplications.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
            .addCase(updateFundStatus.fulfilled, (state, action) => {
                const index = state.applications.findIndex((app) => app._id === action.payload._id);
                if (index !== -1) state.applications[index] = action.payload;
            })
            .addCase(deleteApplication.fulfilled, (state, action) => {
                state.applications = state.applications.filter((app) => app._id !== action.payload);
            });
    },
});

export default UrgentAssistanceFundSlice.reducer;
