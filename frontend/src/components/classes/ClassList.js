import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClasses, deleteClass } from '../../store/slices/classSlice';
import { fetchTeachers } from '../../store/slices/teacherSlice';
import { fetchStudents } from '../../store/slices/studentSlice';
import { 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  UserGroupIcon,
  AcademicCapIcon,
  HomeIcon,
  ClockIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import ClassForm from './ClassForm';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import { Link, useNavigate } from 'react-router-dom';
import ClassDetailsModal from './ClassDetailsModal';

const ClassList = () => {
  const dispatch = useDispatch();
  const { classes, loading, error } = useSelector((state) => state.classes);
  const { teachers, loading: teachersLoading } = useSelector((state) => state.teachers);
  const { students } = useSelector((state) => state.students);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('grade');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterGrade, setFilterGrade] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchClasses()).unwrap();
        await dispatch(fetchTeachers()).unwrap();
        await dispatch(fetchStudents()).unwrap();
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle unauthorized error
        if (error.includes('401') || error.includes('unauthorized')) {
          navigate('/login');
        }
      }
    };
    
    fetchData();
  }, [dispatch, navigate]);

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find(t => t._id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Not Assigned';
  };

  const getStudentCount = (classId) => {
    return students.filter(student => student.class === classId).length;
  };

  const getCapacityColor = (current, max) => {
    const ratio = current / max;
    if (ratio >= 0.9) return 'text-red-600 bg-red-50';
    if (ratio >= 0.7) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const filteredAndSortedClasses = useMemo(() => {
    let result = Array.isArray(classes) ? [...classes] : [];

    if (searchTerm) {
      result = result.filter(cls => 
        cls?.grade?.toString().includes(searchTerm) ||
        cls?.section?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls?.roomNumber?.toString().includes(searchTerm)
      );
    }

    if (filterGrade !== 'all') {
      result = result.filter(cls => cls?.grade?.toString() === filterGrade);
    }

    result.sort((a, b) => {
      if (!a || !b) return 0;
      
      const aValue = (a[sortField] || '').toString().toLowerCase();
      const bValue = (b[sortField] || '').toString().toLowerCase();
      
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    return result;
  }, [classes, searchTerm, sortField, sortOrder, filterGrade]);

  const handleEdit = (classData) => {
    setSelectedClass(classData);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await dispatch(deleteClass(id)).unwrap();
      } catch (err) {
        console.error('Failed to delete class:', err);
      }
    }
  };

  const handleAddClick = useCallback(() => {
    console.log('Add class clicked');
    setSelectedClass(null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    console.log('Closing class modal');
    setIsModalOpen(false);
  }, []);

  if (loading || teachersLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 px-4">
        <div className="rounded-full bg-red-100 p-3 mb-4 mx-auto w-fit">
          <AcademicCapIcon className="h-6 w-6 text-red-600" />
        </div>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <div className="sm:flex sm:items-center bg-white p-6 rounded-xl shadow-sm">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Class Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage all classes
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/classes/add"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add Class
          </Link>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search classes..."
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
            <option value="grade">Grade</option>
            <option value="section">Section</option>
            <option value="roomNumber">Room Number</option>
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
              {filteredAndSortedClasses.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Class</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Room</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Teacher</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Capacity</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Students</th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredAndSortedClasses.map((cls) => {
                      const studentCount = getStudentCount(cls._id);
                      const capacityClass = getCapacityColor(studentCount, cls.capacity);
                      
                      return (
                        <tr key={cls._id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                            Grade {cls.grade}-{cls.section}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <HomeIcon className="h-4 w-4 mr-1 text-gray-400" />
                              {cls.roomNumber || 'Not Assigned'}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {getTeacherName(cls.teacher)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${capacityClass}`}>
                              {studentCount}/{cls.capacity}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <UserGroupIcon className="h-4 w-4 mr-1 text-gray-400" />
                              {studentCount} students
                            </div>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => handleEdit(cls)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100 mr-2 transition-colors duration-150"
                            >
                              <PencilSquareIcon className="h-4 w-4 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(cls._id)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 transition-colors duration-150"
                            >
                              <TrashIcon className="h-4 w-4 mr-1" />
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12 px-4">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-gray-100 p-3 mb-4">
                      <AcademicCapIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No classes found. Add a new class to get started.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedClass ? "Edit Class" : "Add New Class"}
      >
        <ClassForm
          key={selectedClass?._id || 'new'}
          classData={selectedClass}
          onClose={handleCloseModal}
        />
      </Modal>

      {/* Class Details Modal */}
      {selectedClass && (
        <ClassDetailsModal
          classData={selectedClass}
          onClose={() => setSelectedClass(null)}
        />
      )}
    </div>
  );
};

export default React.memo(ClassList); 