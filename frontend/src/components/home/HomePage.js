import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserGroupIcon, 
  AcademicCapIcon, 
  UserIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const navigate = useNavigate();

  const userTypes = [
    {
      title: 'Student',
      description: 'Access your academic records, assignments, and class schedule',
      icon: UserGroupIcon,
      color: 'indigo',
      role: 'student'
    },
    {
      title: 'Teacher',
      description: 'Manage classes, grades, and student attendance',
      icon: AcademicCapIcon,
      color: 'emerald',
      role: 'teacher'
    },
    {
      title: 'Parent',
      description: 'Monitor your child\'s progress and communicate with teachers',
      icon: UserIcon,
      color: 'blue',
      role: 'parent'
    },
    {
      title: 'Admin',
      description: 'Manage school operations, staff, and system settings',
      icon: ShieldCheckIcon,
      color: 'purple',
      role: 'admin'
    }
  ];

  const handleLoginClick = (userType) => {
    navigate('/login', { state: { selectedRole: userType.role } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              School Management System
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Welcome to our comprehensive school management platform
            </p>
          </div>
        </div>
      </div>

      {/* Login Options */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {userTypes.map((userType) => (
            <div
              key={userType.title}
              onClick={() => handleLoginClick(userType)}
              className={`relative group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden`}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r from-${userType.color}-400/0 via-${userType.color}-400/0 to-${userType.color}-400/0 group-hover:from-${userType.color}-400/5 group-hover:via-${userType.color}-400/10 group-hover:to-${userType.color}-400/5 transition-all duration-500 rounded-xl`} />
              
              <div className="relative p-6">
                <div className={`inline-flex items-center justify-center p-3 bg-${userType.color}-100 rounded-xl group-hover:bg-${userType.color}-200 transition-colors duration-300`}>
                  <userType.icon className={`h-6 w-6 text-${userType.color}-600`} />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {userType.title} Login
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {userType.description}
                </p>
                <div className={`mt-4 inline-flex items-center text-${userType.color}-600 text-sm font-medium`}>
                  Sign in
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Key Features
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={<UserGroupIcon className="h-6 w-6" />}
              title="Student Management"
              description="Track student attendance, grades, and performance"
            />
            <Feature
              icon={<AcademicCapIcon className="h-6 w-6" />}
              title="Class Management"
              description="Organize classes, schedules, and assignments"
            />
            <Feature
              icon={<UserIcon className="h-6 w-6" />}
              title="Parent Portal"
              description="Keep parents informed about their child's progress"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ icon, title, description }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-xl">
      {icon}
    </div>
    <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
    <p className="mt-2 text-sm text-gray-500">{description}</p>
  </div>
);

export default HomePage; 