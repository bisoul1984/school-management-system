import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpenIcon } from '@heroicons/react/24/outline';

const StudentDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <h2 className="text-lg font-medium text-gray-900">Student Dashboard</h2>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Stats Cards */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Attendance Rate
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                95%
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Average Grade
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                A-
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Pending Tasks
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                3
              </dd>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Platform Card */}
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Online Learning</h3>
            <p className="mt-1 text-sm text-gray-500">
              Access your courses and continue learning
            </p>
          </div>
          <Link
            to="/learning"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <BookOpenIcon className="h-4 w-4 mr-2" />
            Go to Learning Platform
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 