import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const AttendanceView = () => {
  const { user } = useSelector((state) => state.auth);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const calculateAttendanceStats = () => {
    const total = attendanceData.length;
    const present = attendanceData.filter(record => record.status === 'present').length;
    const absent = attendanceData.filter(record => record.status === 'absent').length;
    const late = attendanceData.filter(record => record.status === 'late').length;

    return {
      total,
      present,
      absent,
      late,
      attendanceRate: total ? ((present + late) / total * 100).toFixed(1) : 0
    };
  };

  const stats = calculateAttendanceStats();

  return (
    <div className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="md:flex md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Attendance Record</h3>
          <p className="mt-1 text-sm text-gray-500">
            View your attendance history and statistics.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="mr-2 mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {months.map((month, index) => (
              <option key={month} value={index}>{month}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {[selectedYear - 1, selectedYear].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Attendance Rate
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.attendanceRate}%
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Present Days
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-green-600">
              {stats.present}
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Absent Days
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-red-600">
              {stats.absent}
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Late Days
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-yellow-600">
              {stats.late}
            </dd>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendanceData.map((record) => (
                      <tr key={record.date}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${record.status === 'present' ? 'bg-green-100 text-green-800' : 
                              record.status === 'absent' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'}`}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.remark || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceView; 