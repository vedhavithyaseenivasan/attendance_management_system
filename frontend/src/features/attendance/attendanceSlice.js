import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAttendanceAPI } from "./attendanceService";

export const fetchAttendance = createAsyncThunk(
  "attendance/get",
  async (_, thunkAPI) => {
    try {
      return await fetchAttendanceAPI();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    records: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default attendanceSlice.reducer;