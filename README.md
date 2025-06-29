# School Management System

A comprehensive web-based school management system built with React.js, Node.js, and MongoDB. This system provides a complete solution for managing students, teachers, classes, grades, attendance, and more.

## 🌐 Live Demo

**Visit the live application:** [https://school-management-system-bdya.vercel.app/](https://school-management-system-bdya.vercel.app/)

## 🚀 Features

### 👨‍💼 Admin Features
- **Dashboard**: Overview of school statistics and key metrics
- **Student Management**: Add, edit, delete, and view student information
- **Teacher Management**: Manage teacher profiles and assignments
- **Class Management**: Create and manage classes, assign teachers and students
- **Grade Management**: Record and manage student grades
- **Attendance Tracking**: Monitor student attendance
- **Reports Generation**: Generate various academic reports
- **Event Management**: Create and manage school events

### 👨‍🏫 Teacher Features
- **Dashboard**: Personalized teacher dashboard
- **Class Management**: View assigned classes and students
- **Grade Management**: Record and update student grades
- **Attendance Management**: Mark and track student attendance
- **Assignment Management**: Create and manage assignments
- **Performance Tracking**: Monitor student performance
- **Schedule Management**: View and manage class schedules
- **Messaging**: Communicate with students and parents

### 👨‍🎓 Student Features
- **Dashboard**: Student-specific dashboard
- **Grade View**: View personal grades and performance
- **Schedule**: Access class schedules
- **Assignments**: View and submit assignments
- **Attendance**: Check personal attendance records

### 👨‍👩‍👧‍👦 Parent Features
- **Child Progress**: Monitor child's academic progress
- **Attendance**: View child's attendance records
- **Grades**: Access child's grades and performance
- **Communication**: Message teachers and administrators

## 🛠️ Technology Stack

### Frontend
- **React.js** - User interface framework
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling and UI components
- **React Router** - Navigation and routing
- **Axios** - HTTP client for API calls
- **Framer Motion** - Animations and transitions
- **Heroicons** - Icon library

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web application framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Deployment
- **Vercel** - Frontend deployment
- **MongoDB Atlas** - Cloud database

## 📋 Prerequisites

Before running this project, make sure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/bisoul1984/school-management-system.git
cd school-management-system
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Run the Application

#### Start Backend Server
```bash
cd backend
npm start
```

#### Start Frontend Development Server
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
school-management-system/
├── backend/
│   ├── controllers/     # API controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── scripts/         # Database scripts
│   └── server.js        # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── store/       # Redux store
│   │   ├── services/    # API services
│   │   └── utils/       # Utility functions
│   └── public/          # Static files
└── README.md
```

## 🔐 Authentication

The system supports multiple user roles:
- **Admin**: Full system access
- **Teacher**: Class and student management
- **Student**: Personal information and grades
- **Parent**: Child monitoring and communication

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🎨 UI/UX Features

- **Modern Design**: Clean and intuitive user interface
- **Dark/Light Theme**: Customizable appearance
- **Smooth Animations**: Enhanced user experience
- **Mobile-First**: Optimized for mobile devices
- **Accessibility**: WCAG compliant design

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Teachers
- `GET /api/teachers` - Get all teachers
- `POST /api/teachers` - Create new teacher
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher

### Classes
- `GET /api/classes` - Get all classes
- `POST /api/classes` - Create new class
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Backend
1. Set up MongoDB Atlas database
2. Configure environment variables
3. Deploy to your preferred hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Developed by:** [Bisrate Tadesse](https://www.bisrat-tadesse.com)

## 📞 Contact

- **Email:** fikertetadesse1403@gmail.com
- **Phone:** +251967044111
- **Website:** [https://www.bisrat-tadesse.com](https://www.bisrat-tadesse.com)

## 🙏 Acknowledgments

- React.js community for the excellent framework
- Tailwind CSS for the beautiful styling system
- MongoDB for the robust database solution
- All contributors and users of this project

---

**Note:** This is a demo project. For production use, please ensure proper security measures, data validation, and error handling are implemented. 