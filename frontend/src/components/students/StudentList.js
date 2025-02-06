import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents, deleteStudent } from '../../store/slices/studentSlice';
import { fetchClasses } from '../../store/slices/classSlice';
import { 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  MagnifyingGlassIcon, 
  UserGroupIcon 
} from '@heroicons/react/24/outline';
import StudentForm from './StudentForm';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import { Link } from 'react-router-dom';

const StudentList = () => {
  const dispatch = useDispatch();
  const { students, loading, error } = useSelector((state) => state.students);
  const { classes, loading: classesLoading } = useSelector((state) => state.classes);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('firstName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterGrade, setFilterGrade] = useState('all');

  useEffect(() => {
    console.log('Initial students fetch');
    dispatch(fetchStudents());
    dispatch(fetchClasses());
  }, [dispatch]);

  const filteredAndSortedStudents = useMemo(() => {
    let result = Array.isArray(students) ? [...students] : [];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(student => 
        (student?.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student?.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student?.rollNumber || '').toString().includes(searchTerm)
      );
    }

    // Apply grade filter
    if (filterGrade !== 'all') {
      result = result.filter(student => student?.grade === filterGrade);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (!a || !b) return 0;
      
      const aValue = (a[sortField] || '').toString().toLowerCase();
      const bValue = (b[sortField] || '').toString().toLowerCase();
      
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    return result;
  }, [students, searchTerm, sortField, sortOrder, filterGrade]);

  useEffect(() => {
    console.log('Modal state updated:', modalOpen);
  }, [modalOpen]);

  const handleAddClick = useCallback(() => {
    setSelectedStudent(null);
    requestAnimationFrame(() => {
      setModalOpen(true);
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    console.log('Closing modal');
    setModalOpen(false);
    
    // Wait for modal animation to complete before clearing selected student
    setTimeout(() => {
      setSelectedStudent(null);
      // Refresh the list after modal is fully closed
      dispatch(fetchStudents()).then(() => {
        console.log('Students list refreshed');
      });
    }, 300);
  }, [dispatch]);

  const handleEditClick = useCallback((student) => {
    setSelectedStudent(student);
    requestAnimationFrame(() => {
      setModalOpen(true);
    });
  }, []);

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await dispatch(deleteStudent(id)).unwrap();
      } catch (err) {
        console.error('Failed to delete student:', err);
      }
    }
  };

  const getClassName = (classId) => {
    const classObj = classes.find(c => c._id === classId);
    return classObj ? `${classObj.grade}-${classObj.section}` : 'Not Assigned';
  };

  const getFeeStatus = (student) => {
    const status = student?.feeStatus || 'pending';
    const statusColors = {
      paid: 'text-green-600 bg-green-50',
      pending: 'text-yellow-600 bg-yellow-50',
      overdue: 'text-red-600 bg-red-50'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading || classesLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center">{error}</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <div className="sm:flex sm:items-center bg-white p-6 rounded-xl shadow-sm">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all students in the school including their details.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/students/add"
            className="inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto transition-all duration-200 hover:shadow-md"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Student
          </Link>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Grades</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={String(i + 1)}>
                Grade {i + 1}
              </option>
            ))}
          </select>

          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
            <option value="email">Email</option>
            <option value="grade">Grade</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div className="mt-8 flex flex-col bg-white rounded-xl shadow-sm">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden">
              {filteredAndSortedStudents.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Roll Number</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Class</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fee Status</th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredAndSortedStudents.map((student) => (
                      <tr key={student._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {student.firstName} {student.lastName}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {student.rollNumber || 'Not Assigned'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {getClassName(student.class)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {student.email}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {getFeeStatus(student)}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => handleEditClick(student)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100 mr-2 transition-colors duration-150"
                          >
                            <PencilSquareIcon className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student._id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 transition-colors duration-150"
                          >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12 px-4">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-gray-100 p-3 mb-4">
                      <UserGroupIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No students found. Add a new student to get started.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={selectedStudent ? "Edit Student" : "Add New Student"}
      >
        {modalOpen && (
          <StudentForm
            key={selectedStudent?._id || 'new'}
            student={selectedStudent}
            onClose={handleCloseModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default React.memo(StudentList); 