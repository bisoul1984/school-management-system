import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const createAttendance = createAsyncThunk(
  'attendance/create',
  async (attendanceData, { rejectWithValue }) => {
    try {
      const response = await api.post('/attendance', attendanceData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAttendance = createAsyncThunk(
  'attendance/get',
  async ({ classId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/attendance?classId=${classId}&startDate=${startDate}&endDate=${endDate}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  attendanceRecords: [],
  currentRecord: null,
  loading: false,
  error: null
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearAttendanceError: (state) => {
      state.error = null;
    },
    setCurrentRecord: (state, action) => {
      state.currentRecord = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceRecords.push(action.payload);
      })
      .addCase(createAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create attendance record';
      })
      .addCase(getAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceRecords = action.payload;
      })
      .addCase(getAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch attendance records';
      });
  }
});

export const { clearAttendanceError, setCurrentRecord } = attendanceSlice.actions;
export default attendanceSlice.reducer; 