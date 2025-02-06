import React, { useState, Fragment } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import {
  HomeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  ChartBarIcon,
  ChartPieIcon,
  CalendarIcon,
  ClipboardDocumentIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  ChatBubbleLeftIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';

const DashboardLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Define which paths should show the admin navigation
  const adminNavigationPaths = ['/dashboard', '/students', '/teachers', '/classes'];
  const shouldShowAdminNav = adminNavigationPaths.includes(location.pathname);

  // Admin navigation items (students, teachers, classes)
  const adminNavigation = [
    {
      name: 'Students',
      href: '/students',
      icon: UserGroupIcon,
      allowedRoles: ['admin', 'teacher']
    },
    {
      name: 'Teachers',
      href: '/teachers',
      icon: AcademicCapIcon,
      allowedRoles: ['admin']
    },
    {
      name: 'Classes',
      href: '/classes',
      icon: BookOpenIcon,
      allowedRoles: ['admin', 'teacher']
    }
  ];

  // Regular navigation items for other pages
  const regularNavigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      allowedRoles: ['admin', 'teacher', 'student', 'parent']
    },
    {
      name: 'Grades',
      href: '/grades',
      icon: ChartBarIcon,
      allowedRoles: ['teacher', 'admin']
    },
    {
      name: 'Performance',
      href: '/performance',
      icon: ChartPieIcon,
      allowedRoles: ['teacher', 'admin']
    },
    {
      name: 'Schedule',
      href: '/schedule',
      icon: CalendarIcon,
      allowedRoles: ['teacher', 'admin']
    },
    {
      name: 'Assignments',
      href: '/assignments',
      icon: ClipboardDocumentIcon,
      allowedRoles: ['teacher', 'admin']
    },
    {
      name: 'Progress Reports',
      href: '/progress-reports',
      icon: DocumentTextIcon,
      allowedRoles: ['teacher', 'admin']
    },
    {
      name: 'Events',
      href: '/events',
      icon: CalendarDaysIcon,
      allowedRoles: ['teacher', 'admin']
    },
    {
      name: 'Messages',
      href: '/messages',
      icon: ChatBubbleLeftIcon,
      allowedRoles: ['teacher', 'admin', 'parent']
    },
    {
      name: 'Attendance',
      href: '/attendance',
      icon: ClipboardDocumentCheckIcon,
      allowedRoles: ['teacher', 'admin']
    }
  ];

  // Choose which navigation items to display
  const navigationItems = shouldShowAdminNav ? adminNavigation : regularNavigation;

  // Define which paths should show the navbar
  const showNavbarPaths = [
    '/dashboard',
    '/students',
    '/teachers',
    '/classes',
    '/grades',
    '/performance',
    '/schedule',
    '/assignments',
    '/progress-reports',
    '/events',
    '/messages',
    '/attendance'
  ];
  const shouldShowNavbar = showNavbarPaths.includes(location.pathname);

  // Function to get page title based on current path
  const getPageTitle = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/dashboard':
        return 'Dashboard';
      case '/students':
        return 'Students';
      case '/teachers':
        return 'Teachers';
      case '/classes':
        return 'Classes';
      case '/profile':
        return 'Profile';
      case '/grades':
        return 'Grades Management';
      case '/performance':
        return 'Performance Tracking';
      case '/schedule':
        return 'Schedule Management';
      case '/assignments':
        return 'Assignments';
      case '/progress-reports':
        return 'Progress Reports';
      case '/events':
        return 'School Events';
      case '/messages':
        return 'Messages';
      case '/attendance':
        return 'Attendance Management';
      default:
        return 'Dashboard';
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <h2 className="text-xl font-bold text-gray-900">School Management</h2>
            <button
              type="button"
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigationItems
              .filter(item => item.allowedRoles.includes(user.role))
              .map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    location.pathname === item.href
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-6 w-6 flex-shrink-0 ${
                      location.pathname === item.href
                        ? 'text-gray-500'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </NavLink>
              ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-gradient-to-b from-gray-600 to-gray-700">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <div className="flex justify-center w-full">
                <img
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-white shadow-lg"
                  src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80"
                  alt="School Logo"
                />
              </div>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {navigationItems
                .filter(item => item.allowedRoles.includes(user.role))
                .map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      classNames(
                        isActive
                          ? 'bg-gray-500 text-white'
                          : 'text-gray-100 hover:bg-gray-500 hover:text-white',
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={classNames(
                            isActive
                              ? 'text-white'
                              : 'text-gray-200 group-hover:text-white',
                            'mr-3 flex-shrink-0 h-6 w-6'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </>
                    )}
                  </NavLink>
                ))}
            </nav>
          </div>
          {/* User profile section */}
          <div className="flex flex-shrink-0 border-t border-gray-500 p-4">
            <div className="group block w-full flex-shrink-0">
              <div className="flex items-center">
                <div>
                  <img
                    className="inline-block h-9 w-9 rounded-full"
                    src={user?.avatar || "https://ui-avatars.com/api/?name=" + user?.firstName}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs font-medium text-gray-200 group-hover:text-white">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col md:pl-64">
        {shouldShowNavbar && (
          <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-600 to-gray-700 pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-white hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-400"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Top navbar for desktop */}
        {shouldShowNavbar && (
          <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-600 to-gray-700 shadow-sm -ml-4 sm:-ml-6 lg:-ml-8">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center">
                <h1 className="text-2xl font-semibold text-white">
                  {getPageTitle()}
                </h1>
              </div>
              <div className="flex items-center gap-4">
                {/* Notification button */}
                <button
                  type="button"
                  className="rounded-full bg-gray-500 p-2 text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  <BellIcon className="h-6 w-6" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <Menu.Button
                    className="flex items-center rounded-full bg-gray-500 p-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  >
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.firstName}`}
                      alt=""
                    />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <NavLink
                            to="/profile"
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            Your Profile
                          </NavLink>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block w-full text-left px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 