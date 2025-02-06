import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const createGrade = createAsyncThunk(
  'grade/create',
  async (gradeData, { rejectWithValue }) => {
    try {
      const response = await api.post('/grades', gradeData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getStudentGrades = createAsyncThunk(
  'grade/getStudentGrades',
  async ({ studentId, classId, subject }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/grades?studentId=${studentId}&classId=${classId}&subject=${subject}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  grades: [],
  currentGrade: null,
  loading: false,
  error: null
};

const gradeSlice = createSlice({
  name: 'grade',
  initialState,
  reducers: {
    clearGradeError: (state) => {
      state.error = null;
    },
    setCurrentGrade: (state, action) => {
      state.currentGrade = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGrade.fulfilled, (state, action) => {
        state.loading = false;
        state.grades.push(action.payload);
      })
      .addCase(createGrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create grade';
      })
      .addCase(getStudentGrades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudentGrades.fulfilled, (state, action) => {
        state.loading = false;
        state.grades = action.payload;
      })
      .addCase(getStudentGrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch grades';
      });
  }
});

export const { clearGradeError, setCurrentGrade } = gradeSlice.actions;
export default gradeSlice.reducer; 