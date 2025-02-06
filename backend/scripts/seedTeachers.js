const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const teacherData = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@school.com',
    password: 'password123',
    role: 'teacher',
    subject: 'Mathematics',
    qualifications: 'M.Sc. Mathematics'
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@school.com',
    password: 'password123',
    role: 'teacher',
    subject: 'English',
    qualifications: 'M.A. English Literature'
  }
];

const seedTeachers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const teacher of teacherData) {
      const existingTeacher = await User.findOne({ email: teacher.email });
      if (!existingTeacher) {
        await User.create(teacher);
        console.log(`Created teacher: ${teacher.firstName} ${teacher.lastName}`);
      } else {
        console.log(`Teacher already exists: ${teacher.firstName} ${teacher.lastName}`);
      }
    }

    console.log('Seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding teachers:', error);
    process.exit(1);
  }
};

seedTeachers(); 