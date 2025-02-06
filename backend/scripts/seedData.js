const mongoose = require('mongoose');
const User = require('../models/User');
const Class = require('../models/Class');
const dotenv = require('dotenv');
const Grade = require('../models/Grade');
const Assignment = require('../models/Assignment');

dotenv.config();

const teachers = [
  {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@school.com',
    password: 'password123',
    role: 'teacher',
    phone: '(555) 123-4567',
    subject: 'Mathematics',
    qualifications: 'M.Sc. Mathematics, B.Ed'
  },
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@school.com',
    password: 'password123',
    role: 'teacher',
    phone: '(555) 234-5678',
    subject: 'English Literature',
    qualifications: 'M.A. English, PGCE'
  },
  {
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@school.com',
    password: 'password123',
    role: 'teacher',
    phone: '(555) 345-6789',
    subject: 'Physics',
    qualifications: 'Ph.D. Physics'
  },
  {
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@school.com',
    password: 'password123',
    role: 'teacher',
    phone: '(555) 456-7890',
    subject: 'Biology',
    qualifications: 'M.Sc. Biology, B.Ed'
  },
  {
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@school.com',
    password: 'password123',
    role: 'teacher',
    phone: '(555) 567-8901',
    subject: 'Chemistry',
    qualifications: 'M.Sc. Chemistry'
  },
  {
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@school.com',
    password: 'password123',
    role: 'teacher',
    phone: '(555) 678-9012',
    subject: 'Spanish',
    qualifications: 'M.A. Spanish Literature'
  },
  {
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@school.com',
    password: 'password123',
    role: 'teacher',
    phone: '(555) 789-0123',
    subject: 'History',
    qualifications: 'M.A. History, PGCE'
  },
  {
    firstName: 'Lisa',
    lastName: 'Taylor',
    email: 'lisa.taylor@school.com',
    password: 'password123',
    role: 'teacher',
    phone: '(555) 890-1234',
    subject: 'Art',
    qualifications: 'M.F.A. Fine Arts'
  },
  {
    firstName: 'Robert',
    lastName: 'Anderson',
    email: 'robert.anderson@school.com',
    password: 'password123',
    role: 'teacher',
    phone: '(555) 901-2345',
    subject: 'Physical Education',
    qualifications: 'B.Sc. Sports Science'
  },
  {
    firstName: 'Jennifer',
    lastName: 'Martinez',
    email: 'jennifer.martinez@school.com',
    password: 'password123',
    role: 'teacher',
    phone: '(555) 012-3456',
    subject: 'Music',
    qualifications: 'M.Mus. Music Education'
  }
];

const students = [
  {
    firstName: 'Alex',
    lastName: 'Thompson',
    email: 'alex.thompson@student.com',
    password: 'password123',
    role: 'student',
    phone: '(555) 111-2222',
    address: {
      street: '123 Oak Street',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701'
    },
    profilePicture: 'https://ui-avatars.com/api/?name=Alex+Thompson'
  },
  {
    firstName: 'Emma',
    lastName: 'Wilson',
    email: 'emma.wilson@student.com',
    password: 'password123',
    role: 'student',
    phone: '(555) 222-3333',
    address: {
      street: '456 Maple Ave',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62702'
    },
    profilePicture: 'https://ui-avatars.com/api/?name=Emma+Wilson'
  },
  {
    firstName: 'Lucas',
    lastName: 'Rodriguez',
    email: 'lucas.r@student.com',
    password: 'password123',
    role: 'student',
    phone: '(555) 333-4444',
    address: {
      street: '789 Pine Road',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62703'
    },
    profilePicture: 'https://ui-avatars.com/api/?name=Lucas+Rodriguez'
  },
  {
    firstName: 'Sophia',
    lastName: 'Chang',
    email: 'sophia.c@student.com',
    password: 'password123',
    role: 'student',
    phone: '(555) 444-5555',
    address: {
      street: '321 Elm Street',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62704'
    },
    profilePicture: 'https://ui-avatars.com/api/?name=Sophia+Chang'
  },
  {
    firstName: 'William',
    lastName: 'Parker',
    email: 'william.p@student.com',
    password: 'password123',
    role: 'student',
    phone: '(555) 555-6666',
    address: {
      street: '654 Birch Lane',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62705'
    },
    profilePicture: 'https://ui-avatars.com/api/?name=William+Parker'
  },
  {
    firstName: 'Olivia',
    lastName: 'Martinez',
    email: 'olivia.m@student.com',
    password: 'password123',
    role: 'student',
    phone: '(555) 666-7777',
    address: {
      street: '987 Cedar Blvd',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62706'
    },
    profilePicture: 'https://ui-avatars.com/api/?name=Olivia+Martinez'
  },
  {
    firstName: 'Ethan',
    lastName: 'Patel',
    email: 'ethan.p@student.com',
    password: 'password123',
    role: 'student',
    phone: '(555) 777-8888',
    address: {
      street: '147 Willow Way',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62707'
    },
    profilePicture: 'https://ui-avatars.com/api/?name=Ethan+Patel'
  },
  {
    firstName: 'Ava',
    lastName: 'Kim',
    email: 'ava.k@student.com',
    password: 'password123',
    role: 'student',
    phone: '(555) 888-9999',
    address: {
      street: '258 Spruce Street',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62708'
    },
    profilePicture: 'https://ui-avatars.com/api/?name=Ava+Kim'
  },
  {
    firstName: 'Noah',
    lastName: 'Singh',
    email: 'noah.s@student.com',
    password: 'password123',
    role: 'student',
    phone: '(555) 999-0000',
    address: {
      street: '369 Ash Avenue',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62709'
    },
    profilePicture: 'https://ui-avatars.com/api/?name=Noah+Singh'
  },
  {
    firstName: 'Isabella',
    lastName: 'Brown',
    email: 'isabella.b@student.com',
    password: 'password123',
    role: 'student',
    phone: '(555) 000-1111',
    address: {
      street: '741 Maple Street',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62710'
    },
    profilePicture: 'https://ui-avatars.com/api/?name=Isabella+Brown'
  },
  // Add 10 more students with similar structure
];

const classes = [
  {
    name: 'Mathematics Advanced',
    grade: '12',
    section: 'A',
    capacity: 30,
    academicYear: '2024',
    subjects: ['Mathematics', 'Physics'],
    schedule: {
      monday: [
        { subject: 'Mathematics', startTime: '08:00', endTime: '09:30' },
        { subject: 'Physics', startTime: '10:00', endTime: '11:30' }
      ]
    }
  },
  {
    name: 'Science Elite',
    grade: '11',
    section: 'B',
    capacity: 25,
    academicYear: '2024',
    subjects: ['Biology', 'Chemistry'],
    schedule: {
      monday: [
        { subject: 'Biology', startTime: '08:00', endTime: '09:30' },
        { subject: 'Chemistry', startTime: '10:00', endTime: '11:30' }
      ]
    }
  },
  {
    name: 'Literature & Languages',
    grade: '12',
    section: 'C',
    capacity: 28,
    academicYear: '2024',
    subjects: ['English Literature', 'Spanish'],
    schedule: {
      monday: [
        { subject: 'English Literature', startTime: '08:00', endTime: '09:30' },
        { subject: 'Spanish', startTime: '10:00', endTime: '11:30' }
      ]
    }
  },
  {
    name: 'Arts & Music',
    grade: '11',
    section: 'D',
    capacity: 22,
    academicYear: '2024',
    subjects: ['Art', 'Music'],
    schedule: {
      monday: [
        { subject: 'Art', startTime: '08:00', endTime: '09:30' },
        { subject: 'Music', startTime: '10:00', endTime: '11:30' }
      ]
    }
  },
  {
    name: 'Social Sciences',
    grade: '12',
    section: 'E',
    capacity: 27,
    academicYear: '2024',
    subjects: ['History', 'Geography'],
    schedule: {
      monday: [
        { subject: 'History', startTime: '08:00', endTime: '09:30' },
        { subject: 'Geography', startTime: '10:00', endTime: '11:30' }
      ]
    }
  },
  {
    name: 'Physical Education & Health',
    grade: '11',
    section: 'F',
    capacity: 35,
    academicYear: '2024',
    subjects: ['Physical Education', 'Health Science'],
    schedule: {
      monday: [
        { subject: 'Physical Education', startTime: '08:00', endTime: '09:30' },
        { subject: 'Health Science', startTime: '10:00', endTime: '11:30' }
      ]
    }
  },
  {
    name: 'Computer Science',
    grade: '12',
    section: 'G',
    capacity: 24,
    academicYear: '2024',
    subjects: ['Programming', 'Web Development'],
    schedule: {
      monday: [
        { subject: 'Programming', startTime: '08:00', endTime: '09:30' },
        { subject: 'Web Development', startTime: '10:00', endTime: '11:30' }
      ]
    }
  }
];

// Update teachers with more fields
teachers.forEach(teacher => {
  teacher.address = {
    street: `${Math.floor(Math.random() * 1000)} Faculty Drive`,
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701'
  };
  teacher.profilePicture = `https://ui-avatars.com/api/?name=${teacher.firstName}+${teacher.lastName}`;
});

const sampleData = {
  grades: [
    {
      subject: 'Mathematics',
      score: 92,
      type: 'exam',
      date: new Date('2024-03-01')
    },
    {
      subject: 'Physics',
      score: 88,
      type: 'quiz',
      date: new Date('2024-03-05')
    },
    {
      subject: 'English',
      score: 95,
      type: 'homework',
      date: new Date('2024-03-10')
    }
  ],
  assignments: [
    {
      title: 'Algebra Problem Set',
      description: 'Complete problems 1-20 in Chapter 5',
      subject: 'Mathematics',
      dueDate: new Date('2024-03-25'),
      points: 100
    },
    {
      title: 'Physics Lab Report',
      description: 'Write a report on the pendulum experiment',
      subject: 'Physics',
      dueDate: new Date('2024-03-28'),
      points: 50
    },
    {
      title: 'Essay Writing',
      description: 'Write a 1000-word essay on Shakespeare',
      subject: 'English',
      dueDate: new Date('2024-03-30'),
      points: 75
    }
  ],
  classes: [
    {
      name: 'Advanced Mathematics',
      subject: 'Mathematics',
      schedule: {
        day: 'Monday',
        time: '09:00 AM',
        duration: 60
      },
      room: 'Room 101'
    },
    {
      name: 'Physics Fundamentals',
      subject: 'Physics',
      schedule: {
        day: 'Tuesday',
        time: '10:30 AM',
        duration: 60
      },
      room: 'Room 202'
    },
    {
      name: 'English Literature',
      subject: 'English',
      schedule: {
        day: 'Wednesday',
        time: '02:00 PM',
        duration: 60
      },
      room: 'Room 303'
    }
  ]
};

const seedData = async (userId, classId) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({ role: { $in: ['teacher', 'student'] } });
    await Class.deleteMany({});
    await Grade.deleteMany({});
    await Assignment.deleteMany({});

    // Create teachers
    const createdTeachers = await User.create(teachers);
    console.log('Teachers created:', createdTeachers.length);

    // Create students
    const createdStudents = await User.create(students);
    console.log('Students created:', createdStudents.length);

    // Create classes and assign teachers
    const classPromises = classes.map(async (classData, index) => {
      const teacher = createdTeachers[index % createdTeachers.length];
      const classStudents = createdStudents.slice(index * 3, (index + 1) * 3);
      
      return Class.create({
        ...classData,
        teacher: teacher._id,
        students: classStudents.map(student => student._id)
      });
    });

    const createdClasses = await Promise.all(classPromises);
    console.log('Classes created:', createdClasses.length);

    // Add grades with student reference
    const grades = await Grade.insertMany(
      sampleData.grades.map(grade => ({
        ...grade,
        student: userId
      }))
    );

    // Add assignments with class reference
    const assignments = await Assignment.insertMany(
      sampleData.assignments.map(assignment => ({
        ...assignment,
        class: classId
      }))
    );

    console.log('Sample data seeded successfully');
    return { grades, assignments };
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
};

module.exports = seedData; 