import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch all users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add new user
export const addUser = createAsyncThunk(
  'users/addUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update user
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  users: [],
  loading: false,
  error: null,
  actionLoading: false,
  actionError: null
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.actionError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch users cases
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch users';
      })
      // Add user cases
      .addCase(addUser.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.users.push(action.payload.data);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload?.message || 'Failed to add user';
      })
      // Update user cases
      .addCase(updateUser.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.users.findIndex(user => user._id === action.payload.data._id);
        if (index !== -1) {
          state.users[index] = action.payload.data;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload?.message || 'Failed to update user';
      })
      // Delete user cases
      .addCase(deleteUser.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.users = state.users.filter(user => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload?.message || 'Failed to delete user';
      });
  }
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer; 