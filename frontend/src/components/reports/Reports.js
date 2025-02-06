import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStudents } from '../../store/slices/studentSlice';
import { fetchClasses } from '../../store/slices/classSlice';
import { fetchTeachers } from '../../store/slices/teacherSlice';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import LoadingSpinner from '../common/LoadingSpinner';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Reports = () => {
  const dispatch = useDispatch();
  const { students, loading: studentsLoading } = useSelector((state) => state.students);
  const { classes, loading: classesLoading } = useSelector((state) => state.classes);
  const { teachers, loading: teachersLoading } = useSelector((state) => state.teachers);

  const [selectedReport, setSelectedReport] = useState('students');

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchClasses());
    dispatch(fetchTeachers());
  }, [dispatch]);

  const isLoading = studentsLoading || classesLoading || teachersLoading;

  // Sample data for charts
  const studentsByClassData = {
    labels: classes.map(c => c.name),
    datasets: [{
      label: 'Number of Students',
      data: classes.map(c => c.students?.length || 0),
      backgroundColor: 'rgba(99, 102, 241, 0.5)',
      borderColor: 'rgb(99, 102, 241)',
      borderWidth: 1,
    }]
  };

  const genderDistributionData = {
    labels: ['Male', 'Female'],
    datasets: [{
      data: [
        students.filter(s => s.gender === 'male').length,
        students.filter(s => s.gender === 'female').length,
      ],
      backgroundColor: [
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 99, 132, 0.5)',
      ],
      borderColor: [
        'rgb(54, 162, 235)',
        'rgb(255, 99, 132)',
      ],
      borderWidth: 1,
    }]
  };

  const renderReport = () => {
    switch (selectedReport) {
      case 'students':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Students by Class</h3>
              <Bar 
                data={studentsByClassData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  }
                }}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Gender Distribution</h3>
              <Doughnut 
                data={genderDistributionData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  }
                }}
              />
            </div>
          </div>
        );
      // Add more cases for different report types
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        
        {/* Report Type Selector */}
        <div className="mt-4 mb-6">
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="students">Student Reports</option>
            <option value="classes">Class Reports</option>
            <option value="teachers">Teacher Reports</option>
            <option value="attendance">Attendance Reports</option>
          </select>
        </div>

        {/* Report Content */}
        <div className="mt-6">
          {renderReport()}
        </div>
      </div>
    </div>
  );
};

export default Reports; 