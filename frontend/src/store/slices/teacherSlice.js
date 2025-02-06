import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create new teacher
export const addTeacher = createAsyncThunk(
  'teachers/addTeacher',
  async (teacherData, { rejectWithValue }) => {
    try {
      console.log('Adding teacher:', teacherData);
      const response = await axios.post('http://localhost:8081/api/teachers', teacherData);
      return response.data;
    } catch (error) {
      console.error('Add error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to add teacher');
    }
  }
);

// Fetch all teachers
export const fetchTeachers = createAsyncThunk(
  'teachers/fetchTeachers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:8081/api/teachers');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch teachers');
    }
  }
);

// Update teacher
export const updateTeacher = createAsyncThunk(
  'teachers/updateTeacher',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:8081/api/teachers/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update teacher');
    }
  }
);

// Delete teacher
export const deleteTeacher = createAsyncThunk(
  'teachers/deleteTeacher',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:8081/api/teachers/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete teacher');
    }
  }
);

const teacherSlice = createSlice({
  name: 'teachers',
  initialState: {
    teachers: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetStatus: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Teacher
      .addCase(addTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.teachers.push(action.payload);
      })
      .addCase(addTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Teachers
      .addCase(fetchTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = action.payload;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update and Delete cases...
      .addCase(updateTeacher.fulfilled, (state, action) => {
        const index = state.teachers.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.teachers[index] = action.payload;
        }
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.teachers = state.teachers.filter(t => t._id !== action.payload);
      });
  },
});

export const { resetStatus } = teacherSlice.actions;
export default teacherSlice.reducer; 