import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store } from './store/store';
import ProtectedRoute from './components/routing/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './components/dashboard/Dashboard';
import StudentList from './components/students/StudentList';
import TeacherList from './components/teachers/TeacherList';
import ClassList from './components/classes/ClassList';
import Profile from './components/profile/Profile';
import Reports from './components/reports/Reports';
import HomePage from './components/home/HomePage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AboutPage from './components/about/AboutPage';
import ContactPage from './components/contact/ContactPage';
import AddStudentForm from './components/students/AddStudentForm';
import AddTeacherForm from './components/teachers/AddTeacherForm';
import AddClassForm from './components/classes/AddClassForm';
import UnauthorizedPage from './components/auth/UnauthorizedPage';
import { setAuthToken } from './store/slices/authSlice';
import StudentGrades from './components/student/StudentGrades';
import StudentSchedule from './components/student/StudentSchedule';
import StudentAssignments from './components/student/StudentAssignments';
import ChildProgress from './components/parent/ChildProgress';
import ChildAttendance from './components/parent/ChildAttendance';
import Messages from './components/messages/Messages';
import AttendanceList from './components/attendance/AttendanceList';
import GradesList from './components/grades/GradesList';
import PerformanceList from './components/performance/PerformanceList';
import ScheduleList from './components/schedule/ScheduleList';
import AssignmentsList from './components/assignments/AssignmentsList';
import ProgressReportsList from './components/reports/ProgressReportsList';
import EventsList from './components/events/EventsList';
import PrivacyPage from './components/privacy/PrivacyPage';

// Create a wrapper component that uses useLocation
const AppContent = () => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Update isDashboardRoute to include all routes that shouldn't show the footer
  const isDashboardRoute = location.pathname.startsWith('/dashboard') || 
                          location.pathname.startsWith('/students') ||
                          location.pathname.startsWith('/teachers') ||
                          location.pathname.startsWith('/classes') ||
                          location.pathname.startsWith('/profile') ||
                          location.pathname.startsWith('/reports') ||
                          location.pathname === '/grades' ||
                          location.pathname === '/performance' ||
                          location.pathname === '/schedule' ||
                          location.pathname === '/assignments' ||
                          location.pathname === '/progress-reports' ||
                          location.pathname === '/events' ||
                          location.pathname === '/messages' ||
                          location.pathname === '/attendance';

  // Redirect to login if trying to access protected route while not authenticated
  React.useEffect(() => {
    if (!isAuthenticated && location.pathname.startsWith('/dashboard')) {
      navigate('/login');
    }
  }, [isAuthenticated, location, navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      {!isDashboardRoute && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/students" element={
            <ProtectedRoute allowedRoles={['admin', 'teacher']}>
              <DashboardLayout>
                <StudentList />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/students/add" element={
            <ProtectedRoute>
              <DashboardLayout>
                <AddStudentForm />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/teachers" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <TeacherList />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/teachers/add" element={
            <ProtectedRoute>
              <DashboardLayout>
                <AddTeacherForm />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/classes" element={
            <ProtectedRoute allowedRoles={['admin', 'teacher']}>
              <DashboardLayout>
                <ClassList />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/classes/add" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <AddClassForm />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/reports" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Reports />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/:userType/register" element={<RegisterPage />} />

          {/* Student Routes */}
          <Route
            path="/my-grades"
            element={
              <ProtectedRoute roles={['student']}>
                <StudentGrades />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-schedule"
            element={
              <ProtectedRoute roles={['student']}>
                <StudentSchedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-assignments"
            element={
              <ProtectedRoute roles={['student']}>
                <StudentAssignments />
              </ProtectedRoute>
            }
          />

          {/* Parent Routes */}
          <Route
            path="/child-progress"
            element={
              <ProtectedRoute roles={['parent']}>
                <ChildProgress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/child-attendance"
            element={
              <ProtectedRoute roles={['parent']}>
                <ChildAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute allowedRoles={['parent', 'teacher', 'admin']}>
                <DashboardLayout>
                  <Messages />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <DashboardLayout>
                  <AttendanceList />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/grades"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <DashboardLayout>
                  <GradesList />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/performance"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <DashboardLayout>
                  <PerformanceList />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/schedule"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <DashboardLayout>
                  <ScheduleList />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/assignments"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <DashboardLayout>
                  <AssignmentsList />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/progress-reports"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <DashboardLayout>
                  <ProgressReportsList />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/events"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <DashboardLayout>
                  <EventsList />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!isDashboardRoute && <Footer />}
    </div>
  );
};

const App = () => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
};

export default App; 