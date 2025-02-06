import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../services/api';

// Helper function to get auth token
const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token;
};

// Fetch all classes
export const fetchClasses = createAsyncThunk(
  'classes/fetchClasses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/classes');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch classes');
    }
  }
);

// Add new class
export const addClass = createAsyncThunk(
  'classes/addClass',
  async (classData, { rejectWithValue }) => {
    try {
      const response = await api.post('/classes', classData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add class');
    }
  }
);

// Update class
export const updateClass = createAsyncThunk(
  'classes/updateClass',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/classes/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update class');
    }
  }
);

// Delete class
export const deleteClass = createAsyncThunk(
  'classes/deleteClass',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/classes/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete class');
    }
  }
);

// Add student to class
export const addStudentToClass = createAsyncThunk(
  'classes/addStudent',
  async ({ classId, studentId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/classes/${classId}/students`, { studentId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add student to class');
    }
  }
);

// Remove student from class
export const removeStudentFromClass = createAsyncThunk(
  'classes/removeStudent',
  async ({ classId, studentId }, { rejectWithValue }) => {
    try {
      await api.delete(`/classes/${classId}/students/${studentId}`);
      return { classId, studentId };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to remove student from class');
    }
  }
);

// Get schedule
export const getSchedule = createAsyncThunk(
  'classes/getSchedule',
  async (classId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/classes/${classId}/schedule`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to get schedule');
    }
  }
);

// Update schedule
export const updateSchedule = createAsyncThunk(
  'classes/updateSchedule',
  async ({ id, schedule }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/classes/${id}/schedule`, { schedule });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update schedule');
    }
  }
);

const initialState = {
  classes: [],
  loading: false,
  error: null,
  success: false,
};

const classSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch classes cases
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add class cases
      .addCase(addClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addClass.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.classes.push(action.payload);
      })
      .addCase(addClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update class cases
      .addCase(updateClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.classes.findIndex(cls => cls._id === action.payload.data._id);
        if (index !== -1) {
          state.classes[index] = action.payload.data;
        }
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete class cases
      .addCase(deleteClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = state.classes.filter(cls => cls._id !== action.payload);
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add student to class cases
      .addCase(addStudentToClass.fulfilled, (state, action) => {
        const classIndex = state.classes.findIndex(cls => cls._id === action.payload._id);
        if (classIndex !== -1) {
          state.classes[classIndex] = action.payload;
        }
      })
      // Remove student from class cases
      .addCase(removeStudentFromClass.fulfilled, (state, action) => {
        const classIndex = state.classes.findIndex(cls => cls._id === action.payload.classId);
        if (classIndex !== -1) {
          state.classes[classIndex].students = state.classes[classIndex].students
            .filter(studentId => studentId !== action.payload.studentId);
        }
      })
      // Get schedule cases
      .addCase(getSchedule.fulfilled, (state, action) => {
        const classIndex = state.classes.findIndex(cls => cls._id === action.payload.classId);
        if (classIndex !== -1) {
          state.classes[classIndex].schedule = action.payload.data;
        }
      })
      // Update schedule cases
      .addCase(updateSchedule.fulfilled, (state, action) => {
        const classIndex = state.classes.findIndex(cls => cls._id === action.payload.classId);
        if (classIndex !== -1) {
          state.classes[classIndex].schedule = action.payload.data;
        }
      });
  }
});

export const { resetStatus } = classSlice.actions;
export default classSlice.reducer; 