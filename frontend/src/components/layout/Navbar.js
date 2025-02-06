import React, { useState, Fragment } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  AcademicCapIcon,
  HomeIcon,
  UserGroupIcon,
  BookOpenIcon,
  ChartBarIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Transition } from '@headlessui/react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'About', href: '/about', icon: BookOpenIcon },
    { name: 'Contact', href: '/contact', icon: ChartBarIcon },
  ];

  const authenticatedNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
    { name: 'Students', href: '/students', icon: UserGroupIcon },
    { name: 'Teachers', href: '/teachers', icon: AcademicCapIcon },
    { name: 'Classes', href: '/classes', icon: BookOpenIcon },
  ];

  const userTypes = [
    { name: 'Student', href: '/student/register' },
    { name: 'Teacher', href: '/teacher/register' },
    { name: 'Parent', href: '/parent/register' }
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <motion.div 
              className="flex-shrink-0 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/" className="flex items-center space-x-2">
                <AcademicCapIcon className="h-8 w-8 text-white" />
                <span className="text-xl font-bold text-white">SMS</span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
              {(isAuthenticated ? authenticatedNavigation : navigation).map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  className="flex items-center"
                >
                  <Link
                    to={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-white ${
                      location.pathname === item.href ? 'text-white' : ''
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-1" />
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right side menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
                  <Link
                    to="/profile"
                    className="text-gray-300 hover:text-white flex items-center space-x-1 transition-colors duration-200"
                  >
                    <UserCircleIcon className="h-6 w-6" />
                    <span>{user?.firstName || 'Profile'}</span>
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white flex items-center space-x-1 transition-colors duration-200"
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6" />
                  <span>Logout</span>
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                
                <Menu as="div" className="relative">
                  <Menu.Button className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium inline-flex items-center">
                    Register
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
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
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userTypes.map((type) => (
                        <Menu.Item key={type.name}>
                          {({ active }) => (
                            <Link
                              to={type.href}
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } block px-4 py-2 text-sm text-gray-700`}
                            >
                              Register as {type.name}
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.div 
            className="flex items-center sm:hidden"
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden bg-gray-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {(isAuthenticated ? authenticatedNavigation : navigation).map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive(item.href)
                      ? 'bg-gray-900 border-indigo-500 text-white'
                      : 'border-transparent text-gray-300 hover:bg-gray-700 hover:border-gray-300 hover:text-white'
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                >
                  <div className="flex items-center">
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.name}
                  </div>
                </Link>
              ))}
              
              {!isAuthenticated && (
                <div className="space-y-1">
                  <Link
                    to="/login"
                    className="block pl-3 pr-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                  >
                    Login
                  </Link>
                  {userTypes.map((type) => (
                    <Link
                      key={type.name}
                      to={type.href}
                      className="block pl-3 pr-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                    >
                      Register as {type.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-700">
              {isAuthenticated ? (
                <div className="space-y-1">
                  <Link
                    to="/profile"
                    className="block pl-3 pr-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                  >
                    <div className="flex items-center">
                      <UserCircleIcon className="h-5 w-5 mr-2" />
                      Profile
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block pl-3 pr-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                  >
                    <div className="flex items-center">
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                      Logout
                    </div>
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <Link
                    to="/login"
                    className="block pl-3 pr-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                  >
                    Login
                  </Link>
                  {userTypes.map((type) => (
                    <Link
                      key={type.name}
                      to={type.href}
                      className="block pl-3 pr-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                    >
                      Register as {type.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar; 