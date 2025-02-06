const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if admin exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      const admin = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });
      
      console.log('Admin user created:', admin);
    } else {
      console.log('Admin user already exists');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error creating admin:', error);
  }
};

createAdmin(); 