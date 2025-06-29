import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

/**
 * Authentication Slice
 * 
 * Redux slice for managing authentication state and user-related operations.
 * Handles user registration, login, logout, profile updates, and password management.
 * 
 * Features:
 * - User registration and login
 * - JWT token management
 * - Profile updates and password changes
 * - Password reset functionality
 * - Account deletion
 * - Persistent authentication state
 * 
 * @module authSlice
 */

/**
 * Register user async thunk
 * Creates a new user account with the provided user data
 * 
 * @async
 * @function register
 * @param {Object} userData - User registration data
 * @param {string} userData.firstName - User's first name
 * @param {string} userData.lastName - User's last name
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @param {string} userData.role - User's role (admin, teacher, student, parent)
 * @param {Object} thunkAPI - Redux Toolkit thunk API
 * @returns {Promise<Object>} Registration response with user data and token
 * @throws {Object} Error response from the API
 */
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

/**
 * Update user profile async thunk
 * Updates the current user's profile information
 * 
 * @async
 * @function updateProfile
 * @param {Object} profileData - Profile data to update
 * @param {string} [profileData.firstName] - Updated first name
 * @param {string} [profileData.lastName] - Updated last name
 * @param {string} [profileData.email] - Updated email address
 * @param {string} [profileData.phone] - Updated phone number
 * @param {string} [profileData.avatar] - Updated avatar URL
 * @param {Object} thunkAPI - Redux Toolkit thunk API
 * @returns {Promise<Object>} Updated user profile data
 * @throws {Object} Error response from the API
 */
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

/**
 * Update user password async thunk
 * Changes the current user's password
 * 
 * @async
 * @function updatePassword
 * @param {Object} passwordData - Password update data
 * @param {string} passwordData.currentPassword - Current password
 * @param {string} passwordData.newPassword - New password
 * @param {Object} thunkAPI - Redux Toolkit thunk API
 * @returns {Promise<Object>} Success response
 * @throws {Object} Error response from the API
 */
export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await api.put('/auth/password', passwordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

/**
 * Delete user account async thunk
 * Permanently deletes the current user's account
 * 
 * @async
 * @function deleteAccount
 * @param {Object} thunkAPI - Redux Toolkit thunk API
 * @returns {Promise<null>} Success response
 * @throws {Object} Error response from the API
 */
export const deleteAccount = createAsyncThunk(
  'auth/deleteAccount',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/auth/profile');
      return null;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

/**
 * Send password reset link async thunk
 * Sends a password reset email to the user
 * 
 * @async
 * @function sendResetLink
 * @param {Object} params - Reset link parameters
 * @param {string} params.email - User's email address
 * @param {Object} thunkAPI - Redux Toolkit thunk API
 * @returns {Promise<Object>} Success response
 * @throws {Object} Error response from the API
 */
export const sendResetLink = createAsyncThunk(
  'auth/sendResetLink',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send reset link');
    }
  }
);

/**
 * Reset password async thunk
 * Resets user password using the provided token
 * 
 * @async
 * @function resetPassword
 * @param {Object} params - Password reset parameters
 * @param {string} params.token - Password reset token
 * @param {string} params.password - New password
 * @param {Object} thunkAPI - Redux Toolkit thunk API
 * @returns {Promise<Object>} Success response
 * @throws {Object} Error response from the API
 */
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, { password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
    }
  }
);

/**
 * Login user async thunk
 * Authenticates user with email and password
 * 
 * @async
 * @function login
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User's email address
 * @param {string} credentials.password - User's password
 * @param {Object} thunkAPI - Redux Toolkit thunk API
 * @returns {Promise<Object>} Login response with user data and token
 * @throws {Object} Error response from the API
 */
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

/**
 * Set authentication token in API headers
 * Configures the API client with the authentication token
 * 
 * @function setAuthToken
 * @param {string} token - JWT authentication token
 */
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

/**
 * Authentication slice configuration
 * Defines the initial state, reducers, and extra reducers for async actions
 */
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
    updateLoading: false,
    updateError: null
  },
  reducers: {
    /**
     * Logout reducer
     * Clears authentication state and removes stored data
     * 
     * @param {Object} state - Current state
     */
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Clear API authorization header
      delete api.defaults.headers.common['Authorization'];
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    /**
     * Clear error reducer
     * Removes error messages from state
     * 
     * @param {Object} state - Current state
     */
    clearError: (state) => {
      state.error = null;
      state.updateError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Registration failed';
      })
      // Update profile cases
      .addCase(updateProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.user = action.payload.user;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload?.message || 'Profile update failed';
      })
      // Other async thunk cases...
      .addCase(deleteAccount.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 