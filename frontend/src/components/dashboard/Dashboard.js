import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchClasses } from '../../store/slices/classSlice';
import { fetchStudents } from '../../store/slices/studentSlice';
import { fetchTeachers } from '../../store/slices/teacherSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import StudentForm from '../students/StudentForm';
import TeacherForm from '../teachers/TeacherForm';
import ClassForm from '../classes/ClassForm';
import {
  UserGroupIcon,
  AcademicCapIcon,
  UserIcon,
  ChartBarIcon,
  CalendarIcon,
  BellIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon,
  EllipsisHorizontalIcon,
  BookOpenIcon,
  ClipboardDocumentCheckIcon,
  PresentationChartLineIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  DocumentCheckIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { motion } from 'framer-motion';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Dashboard Component
 * 
 * The main dashboard component that displays role-specific information and statistics.
 * This component adapts its content based on the user's role (admin, teacher, student, parent).
 * 
 * Features:
 * - Role-based dashboard content
 * - Real-time statistics and metrics
 * - Quick action buttons
 * - Recent activities and notifications
 * - Responsive design with animations
 * - Dynamic content loading
 * 
 * @component
 * @example
 * ```jsx
 * <Dashboard />
 * ```
 */
const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { classes, loading: classesLoading } = useSelector((state) => state.classes);
  const { students, loading: studentsLoading } = useSelector((state) => state.students);
  const { teachers, loading: teachersLoading } = useSelector((state) => state.teachers);
  const isAdmin = user?.role === 'admin';

  // Modal states
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);

  // Notification state (you can integrate with a real notification system)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Student Registration',
      message: 'John Doe has registered as a new student',
      time: '5 minutes ago',
      unread: true,
    },
    // Add more notifications
  ]);

  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort data
  const filteredData = React.useMemo(() => {
    // Ensure students is an array
    let result = Array.isArray(students) ? [...students] : [];
    
    // Apply search
    if (searchQuery) {
      result = result.filter(item => 
        (item?.firstName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item?.lastName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item?.email || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply filter
    if (filterType !== 'all') {
      result = result.filter(item => item?.status === filterType);
    }
    
    // Apply sort with type checking
    result.sort((a, b) => {
      // Ensure both items exist
      if (!a || !b) return 0;

      // Get values with fallbacks
      const aValue = (a[sortBy] || '').toString();
      const bValue = (b[sortBy] || '').toString();

      try {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } catch (error) {
        console.error('Sorting error:', error);
        return 0;
      }
    });
    
    return result;
  }, [students, filterType, sortBy, sortOrder, searchQuery]);

  // Export functions
  const exportToExcel = () => {
    try {
      const data = filteredData.map(item => ({
        'First Name': item.firstName,
        'Last Name': item.lastName,
        'Email': item.email,
        'Status': item.status,
        'Created At': new Date(item.createdAt).toLocaleDateString()
      }));
      
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Students');
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(dataBlob, 'students.xlsx');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      // You can add a toast notification here
    }
  };

  const exportToPDF = async () => {
    try {
      const doc = new jsPDF();
      doc.text('Students Report', 10, 10);
      
      const rows = filteredData.map(item => [
        item.firstName,
        item.lastName,
        item.email,
        item.status,
        new Date(item.createdAt).toLocaleDateString()
      ]);
      
      doc.autoTable({
        head: [['First Name', 'Last Name', 'Email', 'Status', 'Created At']],
        body: rows,
        startY: 20
      });
      
      doc.save('students.pdf');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      // You can add a toast notification here
    }
  };

  // Add filter controls
  const renderFilters = () => (
    <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-4">
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full rounded-lg border-slate-200 bg-white/50 shadow-sm focus:border-slate-400 focus:ring focus:ring-slate-200 focus:ring-opacity-50 sm:text-sm hover:border-slate-300 transition-all duration-300 placeholder-slate-400"
        />
      </div>
      <div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="block w-full rounded-lg border-slate-200 bg-white/50 shadow-sm focus:border-slate-400 focus:ring focus:ring-slate-200 focus:ring-opacity-50 sm:text-sm hover:border-slate-300 transition-all duration-300 text-slate-600"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="block w-full rounded-lg border-slate-200 bg-white/50 shadow-sm focus:border-slate-400 focus:ring focus:ring-slate-200 focus:ring-opacity-50 sm:text-sm hover:border-slate-300 transition-all duration-300 text-slate-600"
        >
          <option value="firstName">First Name</option>
          <option value="lastName">Last Name</option>
          <option value="email">Email</option>
          <option value="createdAt">Date</option>
        </select>
      </div>
      <div>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="block w-full rounded-lg border-slate-200 bg-white/50 shadow-sm focus:border-slate-400 focus:ring focus:ring-slate-200 focus:ring-opacity-50 sm:text-sm hover:border-slate-300 transition-all duration-300 text-slate-600"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div className="flex space-x-3">
        <button
          onClick={exportToExcel}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-emerald-200 shadow-sm text-sm font-medium rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300"
        >
          <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
          Export Excel
        </button>
        <button
          onClick={exportToPDF}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-rose-200 shadow-sm text-sm font-medium rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all duration-300"
        >
          <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
          Export PDF
        </button>
      </div>
    </div>
  );

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchTeachers());
    dispatch(fetchStudents());
  }, [dispatch]);

  const isLoading = classesLoading || teachersLoading || studentsLoading;

  // Stats data - simplified without sorting
  const stats = [
    {
      name: 'Total Students',
      value: Array.isArray(students) ? students.length : 0,
      icon: UserGroupIcon,
      change: '+4.75%',
      changeType: 'positive',
    },
    {
      name: 'Total Classes',
      value: Array.isArray(classes) ? classes.length : 0,
      icon: AcademicCapIcon,
      change: '+3.2%',
      changeType: 'positive',
    },
    {
      name: 'Total Teachers',
      value: Array.isArray(teachers) ? teachers.length : 0,
      icon: UserIcon,
      change: '+2.5%',
      changeType: 'positive',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'attendance',
      message: 'Class 10A attendance marked for today',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      type: 'exam',
      message: 'Mid-term exam results published for Class 9B',
      timestamp: '4 hours ago',
    },
    {
      id: 3,
      type: 'fee',
      message: 'Fee collection reminder sent to pending students',
      timestamp: '5 hours ago',
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Parent-Teacher Meeting',
      date: '2024-03-15',
      time: '10:00 AM',
    },
    {
      id: 2,
      title: 'Annual Sports Day',
      date: '2024-03-20',
      time: '9:00 AM',
    },
    {
      id: 3,
      title: 'Science Exhibition',
      date: '2024-03-25',
      time: '11:00 AM',
    },
  ];

  // Additional statistics
  const additionalStats = [
    {
      name: 'Attendance Rate',
      value: '95%',
      icon: CheckCircleIcon,
      change: '+1.2%',
      changeType: 'positive',
    },
    {
      name: 'Fee Collection',
      value: '$25,400',
      icon: CurrencyDollarIcon,
      change: '+12.5%',
      changeType: 'positive',
    },
  ];

  // Chart data for student enrollment trend
  const enrollmentData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Student Enrollment',
        data: [65, 72, 78, 85, 90, 95],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  // Chart data for student distribution
  const distributionData = {
    labels: ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  };

  // Quick action handlers
  const handleAddStudent = () => {
    try {
      setIsStudentModalOpen(true);
    } catch (error) {
      console.error('Error opening student modal:', error);
    }
  };

  const handleAddTeacher = () => {
    try {
      setIsTeacherModalOpen(true);
    } catch (error) {
      console.error('Error opening teacher modal:', error);
    }
  };

  const handleAddClass = () => {
    try {
      setIsClassModalOpen(true);
    } catch (error) {
      console.error('Error opening class modal:', error);
    }
  };

  const handleViewReports = () => navigate('/reports');

  // Add this section after the stats section
  const renderCharts = () => (
    <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Student Enrollment Trend</h3>
        <Line data={enrollmentData} />
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Student Distribution by Grade</h3>
        <Doughnut data={distributionData} />
      </div>
    </div>
  );

  // Add this section before the quick actions
  const renderNotifications = () => (
    <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-gray-100 rounded-lg mr-3">
            <BellIcon className="h-5 w-5 text-gray-600" />
          </div>
          <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
          <span className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {notifications.filter(n => n.unread).length} new
          </span>
        </div>
        <button className="text-sm text-gray-600 hover:text-gray-700 font-medium transition-colors duration-200">
          Mark all as read
        </button>
      </div>

      <div className="flow-root mt-4">
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li 
              key={notification.id} 
              className={`group relative p-4 rounded-xl transition-all duration-200 ${
                notification.unread 
                  ? 'bg-gray-50 hover:bg-gray-100/70' 
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-4 relative">
                {notification.unread && (
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2">
                    <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                  </div>
                )}
                <div className="flex-shrink-0">
                  <div className={`p-2 rounded-lg ${
                    notification.unread 
                      ? 'bg-gray-100 text-gray-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <BellIcon className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium ${
                      notification.unread ? 'text-gray-900' : 'text-gray-900'
                    }`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                  <p className={`text-sm mt-1 ${
                    notification.unread ? 'text-gray-700' : 'text-gray-600'
                  }`}>
                    {notification.message}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200">
                    <EllipsisHorizontalIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 text-center">
          <button className="text-sm font-medium text-gray-600 hover:text-gray-700 transition-colors duration-200">
            View all notifications
          </button>
        </div>
      </div>
    </div>
  );

  // Conditionally render quick actions section only for admin
  const renderQuickActions = () => {
    if (!isAdmin) return null;

    return (
      <div className="mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={handleAddStudent}
            className="group relative block w-full rounded-xl p-8 text-center bg-gradient-to-br from-indigo-50 to-white shadow-sm hover:shadow-md border border-indigo-100 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-indigo-400/0 to-indigo-400/0 group-hover:from-indigo-400/5 group-hover:via-indigo-400/10 group-hover:to-indigo-400/5 rounded-xl transition-all duration-500"></div>
            <div className="relative">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition-colors duration-300 mb-4">
                <UserGroupIcon className="h-6 w-6 text-indigo-600 group-hover:text-indigo-700" />
              </div>
              <span className="mt-2 block text-sm font-medium text-gray-900">Add New Student</span>
              <p className="mt-1 text-xs text-gray-500 group-hover:text-gray-700">Register a new student</p>
            </div>
          </button>
          <button
            onClick={handleAddTeacher}
            className="group relative block w-full rounded-xl p-8 text-center bg-gradient-to-br from-purple-50 to-white shadow-sm hover:shadow-md border border-purple-100 hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/0 to-purple-400/0 group-hover:from-purple-400/5 group-hover:via-purple-400/10 group-hover:to-purple-400/5 rounded-xl transition-all duration-500"></div>
            <div className="relative">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300 mb-4">
                <UserIcon className="h-6 w-6 text-purple-600 group-hover:text-purple-700" />
              </div>
              <span className="mt-2 block text-sm font-medium text-gray-900">Add New Teacher</span>
              <p className="mt-1 text-xs text-gray-500 group-hover:text-gray-700">Register a new teacher</p>
            </div>
          </button>
          <button
            onClick={handleAddClass}
            className="group relative block w-full rounded-xl p-8 text-center bg-gradient-to-br from-pink-50 to-white shadow-sm hover:shadow-md border border-pink-100 hover:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400/0 via-pink-400/0 to-pink-400/0 group-hover:from-pink-400/5 group-hover:via-pink-400/10 group-hover:to-pink-400/5 rounded-xl transition-all duration-500"></div>
            <div className="relative">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 group-hover:bg-pink-200 transition-colors duration-300 mb-4">
                <AcademicCapIcon className="h-6 w-6 text-pink-600 group-hover:text-pink-700" />
              </div>
              <span className="mt-2 block text-sm font-medium text-gray-900">Add New Class</span>
              <p className="mt-1 text-xs text-gray-500 group-hover:text-gray-700">Create a new class</p>
            </div>
          </button>
          <button
            onClick={handleViewReports}
            className="group relative block w-full rounded-xl p-8 text-center bg-gradient-to-br from-blue-50 to-white shadow-sm hover:shadow-md border border-blue-100 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/0 to-blue-400/0 group-hover:from-blue-400/5 group-hover:via-blue-400/10 group-hover:to-blue-400/5 rounded-xl transition-all duration-500"></div>
            <div className="relative">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300 mb-4">
                <ChartBarIcon className="h-6 w-6 text-blue-600 group-hover:text-blue-700" />
              </div>
              <span className="mt-2 block text-sm font-medium text-gray-900">View Reports</span>
              <p className="mt-1 text-xs text-gray-500 group-hover:text-gray-700">Access all reports</p>
            </div>
          </button>
        </div>
      </div>
    );
  };

  // Role-based management sections
  const renderManagementSections = () => {
    switch (user?.role) {
      case 'admin':
        return (
          <>
            {renderStudentManagement()}
            {renderClassManagement()}
            {renderParentPortal()}
          </>
        );
      case 'teacher':
        return (
          <>
            {renderStudentManagement()}
            {renderClassManagement()}
          </>
        );
      case 'parent':
        return renderParentDashboard();
      case 'student':
        return renderStudentDashboard();
      default:
        return null;
    }
  };

  const renderStudentManagement = () => (
    <div className="mt-8 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
        <BookOpenIcon className="h-6 w-6 text-indigo-600 mr-2" />
        Student Management
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-indigo-50 rounded-lg">
          <div className="flex items-center mb-4">
            <ClipboardDocumentCheckIcon className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Attendance</h3>
          </div>
          <button 
            onClick={() => navigate('/attendance')}
            className="w-full mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Manage Attendance
          </button>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center mb-4">
            <PresentationChartLineIcon className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Grades</h3>
          </div>
          <button 
            onClick={() => navigate('/grades')}
            className="w-full mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Manage Grades
          </button>
        </div>

        <div className="p-4 bg-pink-50 rounded-lg">
          <div className="flex items-center mb-4">
            <DocumentCheckIcon className="h-5 w-5 text-pink-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Performance</h3>
          </div>
          <button 
            onClick={() => navigate('/performance')}
            className="w-full mt-2 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
          >
            View Reports
          </button>
        </div>
      </div>
    </div>
  );

  const renderClassManagement = () => (
    <div className="mt-8 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
        <CalendarDaysIcon className="h-6 w-6 text-green-600 mr-2" />
        Class Management
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center mb-4">
            <ClockIcon className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Schedule</h3>
          </div>
          <button 
            onClick={() => navigate('/schedule')}
            className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            View Schedule
          </button>
        </div>

        <div className="p-4 bg-teal-50 rounded-lg">
          <div className="flex items-center mb-4">
            <DocumentCheckIcon className="h-5 w-5 text-teal-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Assignments</h3>
          </div>
          <button 
            onClick={() => navigate('/assignments')}
            className="w-full mt-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Manage Assignments
          </button>
        </div>

        <div className="p-4 bg-cyan-50 rounded-lg">
          <div className="flex items-center mb-4">
            <UsersIcon className="h-5 w-5 text-cyan-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Class List</h3>
          </div>
          <button 
            onClick={() => navigate('/classes')}
            className="w-full mt-2 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
          >
            View Classes
          </button>
        </div>
      </div>
    </div>
  );

  const renderParentPortal = () => (
    <div className="mt-8 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
        <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600 mr-2" />
        Parent Communication
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center mb-4">
            <DocumentCheckIcon className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Progress Reports</h3>
          </div>
          <button 
            onClick={() => navigate('/progress-reports')}
            className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            View Reports
          </button>
        </div>

        <div className="p-4 bg-violet-50 rounded-lg">
          <div className="flex items-center mb-4">
            <CalendarDaysIcon className="h-5 w-5 text-violet-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Events</h3>
          </div>
          <button 
            onClick={() => navigate('/events')}
            className="w-full mt-2 px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
          >
            School Events
          </button>
        </div>

        <div className="p-4 bg-fuchsia-50 rounded-lg">
          <div className="flex items-center mb-4">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-fuchsia-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Messages</h3>
          </div>
          <button 
            onClick={() => navigate('/messages')}
            className="w-full mt-2 px-4 py-2 bg-fuchsia-600 text-white rounded hover:bg-fuchsia-700"
          >
            View Messages
          </button>
        </div>
      </div>
    </div>
  );

  const renderStudentDashboard = () => (
    <div className="mt-8 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
        <BookOpenIcon className="h-6 w-6 text-indigo-600 mr-2" />
        Student Dashboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-indigo-50 rounded-lg">
          <div className="flex items-center mb-4">
            <DocumentCheckIcon className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">My Grades</h3>
          </div>
          <button 
            onClick={() => navigate('/my-grades')}
            className="w-full mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            View Grades
          </button>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center mb-4">
            <ClockIcon className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">My Schedule</h3>
          </div>
          <button 
            onClick={() => navigate('/my-schedule')}
            className="w-full mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            View Schedule
          </button>
        </div>

        <div className="p-4 bg-pink-50 rounded-lg">
          <div className="flex items-center mb-4">
            <DocumentTextIcon className="h-5 w-5 text-pink-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Assignments</h3>
          </div>
          <button 
            onClick={() => navigate('/my-assignments')}
            className="w-full mt-2 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
          >
            View Assignments
          </button>
        </div>
      </div>
    </div>
  );

  const renderParentDashboard = () => (
    <div className="mt-8 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
        <UserIcon className="h-6 w-6 text-blue-600 mr-2" />
        Parent Dashboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center mb-4">
            <DocumentCheckIcon className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Child's Progress</h3>
          </div>
          <button 
            onClick={() => navigate('/child-progress')}
            className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            View Progress
          </button>
        </div>

        <div className="p-4 bg-violet-50 rounded-lg">
          <div className="flex items-center mb-4">
            <CalendarDaysIcon className="h-5 w-5 text-violet-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Attendance</h3>
          </div>
          <button 
            onClick={() => navigate('/child-attendance')}
            className="w-full mt-2 px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
          >
            View Attendance
          </button>
        </div>

        <div className="p-4 bg-fuchsia-50 rounded-lg">
          <div className="flex items-center mb-4">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-fuchsia-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Communication</h3>
          </div>
          <button 
            onClick={() => navigate('/messages')}
            className="w-full mt-2 px-4 py-2 bg-fuchsia-600 text-white rounded hover:bg-fuchsia-700"
          >
            Contact Teachers
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600 mb-8">
          {isAdmin 
            ? "Here's what's happening in your school today."
            : "Here's your dashboard overview."}
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Stats */}
        <div className="mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-indigo-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Statistics Overview</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ) : (
                  <>
                    <dt>
                      <div className="absolute bg-indigo-500 rounded-md p-3">
                        <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      <p className="ml-16 text-sm font-medium text-gray-500 truncate">{stat.name}</p>
                    </dt>
                    <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                      <p
                        className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {stat.change}
                      </p>
                    </dd>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-purple-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Analytics</h2>
          {renderCharts()}
        </div>

        {/* Recent Activities and Upcoming Events */}
        <div className="mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-pink-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Activities & Events</h2>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Recent Activities */}
            <div className="bg-white/90 shadow rounded-lg hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <ClockIcon className="h-5 w-5 text-violet-500 mr-2" />
                  Recent Activities
                </h2>
                <div className="flow-root">
                  <ul className="-mb-8">
                    {recentActivities.map((activity, activityIdx) => (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {activityIdx !== recentActivities.length - 1 ? (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                                <BellIcon className="h-5 w-5 text-white" aria-hidden="true" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">{activity.message}</p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                <time>{activity.timestamp}</time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white/90 shadow rounded-lg hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <CalendarIcon className="h-5 w-5 text-violet-500 mr-2" />
                  Upcoming Events
                </h2>
                <div className="flow-root">
                  <ul className="-my-5 divide-y divide-gray-200">
                    {upcomingEvents.map((event) => (
                      <li key={event.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <CalendarIcon className="h-8 w-8 text-indigo-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(event.date).toLocaleDateString()} at {event.time}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Only for admin */}
        {isAdmin && renderQuickActions()}

        {/* Role-based Management Sections */}
        {renderManagementSections()}

        {/* Data Management */}
        <div className="mt-8 p-6 bg-gradient-to-br from-slate-50 to-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-slate-100 rounded-lg mr-3">
                <ChartBarIcon className="h-5 w-5 text-slate-600" />
              </div>
              <h2 className="text-lg font-medium text-gray-900">Data Management</h2>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-4">
            {/* Search Input */}
            <div>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-lg border-slate-200 bg-white/50 shadow-sm focus:border-slate-400 focus:ring focus:ring-slate-200 focus:ring-opacity-50 sm:text-sm hover:border-slate-300 transition-all duration-300 placeholder-slate-400"
              />
            </div>

            {/* Filter Select */}
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="block w-full rounded-lg border-slate-200 bg-white/50 shadow-sm focus:border-slate-400 focus:ring focus:ring-slate-200 focus:ring-opacity-50 sm:text-sm hover:border-slate-300 transition-all duration-300 text-slate-600"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Sort Select */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full rounded-lg border-slate-200 bg-white/50 shadow-sm focus:border-slate-400 focus:ring focus:ring-slate-200 focus:ring-opacity-50 sm:text-sm hover:border-slate-300 transition-all duration-300 text-slate-600"
              >
                <option value="firstName">First Name</option>
                <option value="lastName">Last Name</option>
                <option value="email">Email</option>
                <option value="createdAt">Date</option>
              </select>
            </div>

            {/* Export Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={exportToExcel}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-emerald-200 shadow-sm text-sm font-medium rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Export Excel
              </button>
              <button
                onClick={exportToPDF}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-rose-200 shadow-sm text-sm font-medium rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all duration-300"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Export PDF
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="bg-slate-50/50 rounded-lg p-4 mb-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DocumentTextIcon className="h-5 w-5 text-slate-500" />
                <span className="text-sm text-slate-600">
                  Showing <span className="font-medium text-slate-900">{filteredData.length}</span> results
                </span>
              </div>
              <div className="text-sm text-slate-500">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {renderNotifications()}
      </div>

      <Modal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        title="Add New Student"
      >
        <StudentForm onClose={() => setIsStudentModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        title="Add New Teacher"
      >
        <TeacherForm onClose={() => setIsTeacherModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        title="Add New Class"
      >
        <ClassForm onClose={() => setIsClassModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Dashboard; 