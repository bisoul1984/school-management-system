# School Management System - Technical Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Frontend Components](#frontend-components)
4. [Backend Structure](#backend-structure)
5. [Authentication System](#authentication-system)
6. [API Documentation](#api-documentation)
7. [State Management](#state-management)
8. [Database Schema](#database-schema)
9. [Deployment Guide](#deployment-guide)
10. [Development Guidelines](#development-guidelines)

## 🏗️ Project Overview

The School Management System is a full-stack web application built with React.js, Node.js, and MongoDB. It provides comprehensive functionality for managing educational institutions with role-based access control.

### Key Features
- **Multi-role Support**: Admin, Teacher, Student, and Parent roles
- **Real-time Updates**: Live data synchronization
- **Responsive Design**: Mobile-first approach
- **Secure Authentication**: JWT-based authentication
- **Role-based Access Control**: Granular permissions

## 🏛️ Architecture

### Frontend Architecture
```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── layout/         # Layout components
│   │   ├── students/       # Student management
│   │   ├── teachers/       # Teacher management
│   │   ├── classes/        # Class management
│   │   └── common/         # Shared components
│   ├── store/              # Redux store
│   ├── services/           # API services
│   ├── utils/              # Utility functions
│   └── config/             # Configuration files
```

### Backend Architecture
```
backend/
├── controllers/            # Request handlers
├── models/                 # Database models
├── routes/                 # API routes
├── middleware/             # Custom middleware
├── scripts/                # Database scripts
└── server.js              # Server entry point
```

## 🧩 Frontend Components

### Core Components

#### 1. Navbar Component
**File**: `frontend/src/components/layout/Navbar.js`

**Purpose**: Main navigation component that adapts based on user authentication status.

**Features**:
- Responsive design with mobile hamburger menu
- Dynamic navigation based on authentication status
- User profile and logout functionality
- Registration dropdown for different user types

**Props**: None (uses Redux state)

**Usage**:
```jsx
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <div>
      <Navbar />
      {/* Other components */}
    </div>
  );
}
```

#### 2. DashboardLayout Component
**File**: `frontend/src/components/layout/DashboardLayout.js`

**Purpose**: Layout wrapper for authenticated user interfaces.

**Features**:
- Responsive sidebar with role-based navigation
- Top navigation bar with user profile
- Mobile-friendly hamburger menu
- Role-based access control

**Props**:
- `children`: React components to render in main content area

**Usage**:
```jsx
import DashboardLayout from './components/layout/DashboardLayout';

function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
}
```

#### 3. Login Component
**File**: `frontend/src/components/auth/Login.js`

**Purpose**: User authentication interface.

**Features**:
- Email and password authentication
- Form validation with error handling
- Loading states during authentication
- Password visibility toggle
- Links to registration and password reset

**Props**: None (uses Redux state)

**Usage**:
```jsx
import Login from './components/auth/Login';

function AuthPage() {
  return <Login />;
}
```

#### 4. Dashboard Component
**File**: `frontend/src/components/dashboard/Dashboard.js`

**Purpose**: Main dashboard that displays role-specific information.

**Features**:
- Role-based dashboard content
- Real-time statistics and metrics
- Quick action buttons
- Recent activities and notifications

**Props**: None (uses Redux state)

**Usage**:
```jsx
import Dashboard from './components/dashboard/Dashboard';

function DashboardPage() {
  return <Dashboard />;
}
```

### Component Categories

#### Authentication Components
- `Login.js` - User login form
- `Register.js` - User registration form
- `ForgotPassword.js` - Password reset request
- `ResetPassword.js` - Password reset form

#### Layout Components
- `Navbar.js` - Main navigation
- `Sidebar.js` - Dashboard sidebar
- `Footer.js` - Page footer
- `DashboardLayout.js` - Dashboard layout wrapper

#### Management Components
- `StudentList.js` - Student management interface
- `TeacherList.js` - Teacher management interface
- `ClassList.js` - Class management interface
- `GradeManagement.js` - Grade management interface

## 🔧 Backend Structure

### Controllers

#### Auth Controller
**File**: `backend/controllers/auth.controller.js`

**Purpose**: Handles user authentication and authorization.

**Endpoints**:
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password/:token` - Password reset

#### Student Controller
**File**: `backend/controllers/student.controller.js`

**Purpose**: Manages student-related operations.

**Endpoints**:
- `GET /students` - Get all students
- `POST /students` - Create new student
- `PUT /students/:id` - Update student
- `DELETE /students/:id` - Delete student

#### Teacher Controller
**File**: `backend/controllers/teacher.controller.js`

**Purpose**: Manages teacher-related operations.

**Endpoints**:
- `GET /teachers` - Get all teachers
- `POST /teachers` - Create new teacher
- `PUT /teachers/:id` - Update teacher
- `DELETE /teachers/:id` - Delete teacher

### Models

#### User Model
**File**: `backend/models/User.js`

**Schema**:
```javascript
{
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: String, // admin, teacher, student, parent
  phone: String,
  avatar: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Student Model
**File**: `backend/models/Student.js`

**Schema**:
```javascript
{
  userId: ObjectId,
  studentId: String,
  grade: String,
  parentId: ObjectId,
  enrollmentDate: Date,
  status: String // active, inactive, graduated
}
```

#### Teacher Model
**File**: `backend/models/Teacher.js`

**Schema**:
```javascript
{
  userId: ObjectId,
  employeeId: String,
  subjects: [String],
  qualification: String,
  experience: Number,
  hireDate: Date
}
```

## 🔐 Authentication System

### JWT Implementation
The system uses JSON Web Tokens (JWT) for secure authentication.

**Token Structure**:
```javascript
{
  userId: String,
  role: String,
  iat: Number,
  exp: Number
}
```

**Token Storage**: LocalStorage with automatic cleanup on logout

**Security Features**:
- Token expiration handling
- Automatic logout on 401 responses
- Secure token transmission
- Role-based access control

### Role-based Access Control

#### Admin Role
- Full system access
- User management
- System configuration
- Reports generation

#### Teacher Role
- Class management
- Grade management
- Student attendance
- Assignment creation

#### Student Role
- Personal information access
- Grade viewing
- Assignment submission
- Schedule viewing

#### Parent Role
- Child progress monitoring
- Communication with teachers
- Attendance viewing
- Grade access

## 📡 API Documentation

### Base URL
```
Production: https://your-backend-url.com/api
Development: http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Student Endpoints

#### Get All Students
```http
GET /students
Authorization: Bearer <token>
```

#### Create Student
```http
POST /students
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "grade": "10",
  "parentId": "parent_id_here"
}
```

### Teacher Endpoints

#### Get All Teachers
```http
GET /teachers
Authorization: Bearer <token>
```

#### Create Teacher
```http
POST /teachers
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Dr. Smith",
  "lastName": "Johnson",
  "email": "smith@school.com",
  "subjects": ["Mathematics", "Physics"],
  "qualification": "PhD",
  "experience": 10
}
```

## 🗃️ State Management

### Redux Store Structure

#### Auth Slice
```javascript
{
  user: Object | null,
  token: String | null,
  isAuthenticated: Boolean,
  loading: Boolean,
  error: String | null
}
```

#### Student Slice
```javascript
{
  students: Array,
  currentStudent: Object | null,
  loading: Boolean,
  error: String | null
}
```

#### Teacher Slice
```javascript
{
  teachers: Array,
  currentTeacher: Object | null,
  loading: Boolean,
  error: String | null
}
```

### Async Actions
- `login()` - User authentication
- `register()` - User registration
- `fetchStudents()` - Load student data
- `createStudent()` - Add new student
- `updateStudent()` - Modify student data
- `deleteStudent()` - Remove student

## 🗄️ Database Schema

### Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  password: String (hashed),
  role: String,
  phone: String,
  avatar: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Students Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  studentId: String,
  grade: String,
  parentId: ObjectId (ref: Users),
  enrollmentDate: Date,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Teachers Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  employeeId: String,
  subjects: [String],
  qualification: String,
  experience: Number,
  hireDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Classes Collection
```javascript
{
  _id: ObjectId,
  name: String,
  teacherId: ObjectId (ref: Teachers),
  students: [ObjectId] (ref: Students),
  subject: String,
  schedule: {
    day: String,
    time: String,
    duration: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment Guide

### Frontend Deployment (Vercel)

1. **Connect Repository**
   ```bash
   # Connect your GitHub repository to Vercel
   # Configure build settings
   ```

2. **Environment Variables**
   ```env
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

3. **Build Configuration**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "build",
     "installCommand": "npm install"
   }
   ```

### Backend Deployment

1. **Environment Setup**
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=production
   ```

2. **Database Setup**
   ```bash
   # Set up MongoDB Atlas cluster
   # Configure network access
   # Create database user
   ```

3. **Server Deployment**
   ```bash
   # Deploy to your preferred hosting service
   # Configure environment variables
   # Set up SSL certificates
   ```

## 📝 Development Guidelines

### Code Style

#### JavaScript/React
- Use ES6+ features
- Prefer functional components with hooks
- Use JSDoc for documentation
- Follow consistent naming conventions

#### CSS/Styling
- Use Tailwind CSS utility classes
- Maintain responsive design
- Follow BEM methodology for custom CSS
- Use CSS variables for theming

### Git Workflow

1. **Feature Branches**
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Commit Messages**
   ```bash
   git commit -m "feat: add user authentication"
   git commit -m "fix: resolve login issue"
   git commit -m "docs: update API documentation"
   ```

3. **Pull Requests**
   - Create descriptive PR titles
   - Include detailed descriptions
   - Request code reviews
   - Test thoroughly before merging

### Testing

#### Frontend Testing
```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

#### Backend Testing
```bash
# Run unit tests
npm test

# Run API tests
npm run test:api

# Run database tests
npm run test:db
```

### Performance Optimization

#### Frontend
- Use React.memo for expensive components
- Implement code splitting with React.lazy
- Optimize bundle size with webpack
- Use CDN for static assets

#### Backend
- Implement database indexing
- Use connection pooling
- Implement caching strategies
- Optimize API response times

### Security Best Practices

#### Authentication
- Use HTTPS in production
- Implement rate limiting
- Validate all inputs
- Sanitize user data
- Use secure session management

#### Database
- Use parameterized queries
- Implement proper access controls
- Regular security audits
- Backup strategies

---

## 📞 Support

For technical support or questions about the documentation:

- **Email**: fikertetadesse1403@gmail.com
- **Phone**: +251967044111
- **Website**: [https://www.bisrat-tadesse.com](https://www.bisrat-tadesse.com)

---

**Last Updated**: December 2024
**Version**: 1.0.0 