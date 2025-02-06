const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Handle deprecation warning
mongoose.set('strictQuery', false);

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const classRoutes = require('./routes/class.routes');
const teacherRoutes = require('./routes/teacher.routes');
const studentRoutes = require('./routes/student.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const eventRoutes = require('./routes/event.routes');
const messageRoutes = require('./routes/message.routes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/messages', messageRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'School Management System API is running' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working correctly' });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      authSource: 'admin',
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    
    console.log('MongoDB Connected Successfully');

    const PORT = process.env.PORT || 8081;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup error:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    process.exit(1);
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
  
  res.status(500).json({ 
    message: 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

startServer(); 