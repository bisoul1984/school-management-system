import React from 'react';

const TeacherDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <h2 className="text-lg font-medium text-gray-900">Teacher Dashboard</h2>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Stats Cards */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                My Classes
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                5
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Students
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                150
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Pending Assignments
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                12
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard; 