import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import teacherReducer from './slices/teacherSlice';
import classReducer from './slices/classSlice';
import studentReducer from './slices/studentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    teachers: teacherReducer,
    classes: classReducer,
    students: studentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
}); 