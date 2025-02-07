import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Create new student
export const addStudent = createAsyncThunk(
  'students/addStudent',
  async (studentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/students', studentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch all students
export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/students');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch students');
    }
  }
);

// Update student
export const updateStudent = createAsyncThunk(
  'students/updateStudent',
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      console.log('Updating student:', id, data);
      const response = await api.put(`/students/${id}`, {
        ...data,
        role: 'student'
      });
      console.log('Update response:', response.data);
      
      // Immediately fetch updated list after successful update
      await dispatch(fetchStudents());
      return response.data;
    } catch (error) {
      console.error('Update error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update student');
    }
  }
);

// Delete student
export const deleteStudent = createAsyncThunk(
  'students/deleteStudent',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      console.log('Deleting student:', id);
      await api.delete(`/students/${id}`);
      console.log('Delete successful');
      
      // Fetch updated list after deletion
      await dispatch(fetchStudents());
      return id;
    } catch (error) {
      console.error('Delete error:', error);
      return rejectWithValue(error.response?.data || { message: 'Failed to delete student' });
    }
  }
);

const studentSlice = createSlice({
  name: 'students',
  initialState: {
    students: [],
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
      // Add Student
      .addCase(addStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.students.push(action.payload);
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to add student';
      })
      // Fetch Students
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch students';
      })
      // Update student
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update student';
      })
      // Delete student cases
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.students = state.students.filter(student => student._id !== action.payload);
      });
  },
});

export const { resetStatus } = studentSlice.actions;
export default studentSlice.reducer; 