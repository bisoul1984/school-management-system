import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeachers, deleteTeacher } from '../../store/slices/teacherSlice';
import { fetchClasses } from '../../store/slices/classSlice';
import { 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  PhoneIcon,
  AcademicCapIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';
import TeacherForm from './TeacherForm';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import { Link } from 'react-router-dom';

function TeacherList() {
  const dispatch = useDispatch();
  const { teachers, loading, error } = useSelector((state) => state.teachers);
  const { classes, loading: classesLoading } = useSelector((state) => state.classes);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('firstName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterSubject, setFilterSubject] = useState('all');

  // Memoize the fetch functions to prevent unnecessary re-renders
  const fetchTeachersData = useCallback(() => {
    console.log('Fetching teachers data');
    dispatch(fetchTeachers());
  }, [dispatch]);

  const fetchClassesData = useCallback(() => {
    console.log('Fetching classes data');
    dispatch(fetchClasses());
  }, [dispatch]);

  useEffect(() => {
    console.log('Initial teachers fetch');
    fetchTeachersData();
    fetchClassesData();
  }, [fetchTeachersData, fetchClassesData]);

  const getAssignedClasses = (teacherId) => {
    if (!Array.isArray(classes)) return [];
    return classes.filter(cls => cls.teacher === teacherId)
      .map(cls => `${cls.grade}-${cls.section}`)
      .join(', ') || 'No classes assigned';
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(salary || 0);
  };

  const formatPhone = (phone) => {
    return phone || 'Not provided';
  };

  // Get unique subjects for filter dropdown
  const uniqueSubjects = useMemo(() => {
    if (!Array.isArray(teachers)) return [];
    return [...new Set(teachers.map(teacher => teacher.subject))].filter(Boolean);
  }, [teachers]);

  const filteredAndSortedTeachers = useMemo(() => {
    let result = Array.isArray(teachers) ? [...teachers] : [];

    if (searchTerm) {
      result = result.filter(teacher => 
        (teacher?.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (teacher?.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (teacher?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (teacher?.phone || '').includes(searchTerm) ||
        (teacher?.subject || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterSubject !== 'all') {
      result = result.filter(teacher => teacher?.subject === filterSubject);
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
  }, [teachers, searchTerm, sortField, sortOrder, filterSubject]);

  const handleAddClick = useCallback(() => {
    console.log('Add teacher clicked');
    setSelectedTeacher(null);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    console.log('Closing teacher modal');
    setModalOpen(false);
  }, []);

  const handleEdit = (teacher) => {
    setSelectedTeacher(teacher);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await dispatch(deleteTeacher(id)).unwrap();
      } catch (err) {
        console.error('Failed to delete teacher:', err);
      }
    }
  };

  if (loading || classesLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all teachers in the school including their subjects and qualifications.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/teachers/add"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Add Teacher
          </Link>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Subjects</option>
            {uniqueSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
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
            <option value="subject">Subject</option>
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
              {filteredAndSortedTeachers.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Contact</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Subject</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Assigned Classes</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Salary</th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredAndSortedTeachers.map((teacher) => (
                      <tr key={teacher._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {teacher.firstName} {teacher.lastName}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          <div className="flex flex-col">
                            <span>{teacher.email}</span>
                            <span className="flex items-center text-gray-400 mt-1">
                              <PhoneIcon className="h-4 w-4 mr-1" />
                              {formatPhone(teacher.phone)}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {teacher.subject}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {getAssignedClasses(teacher._id)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <CurrencyDollarIcon className="h-4 w-4 mr-1 text-gray-400" />
                            {formatSalary(teacher.salary)}
                          </div>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => handleEdit(teacher)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100 mr-2 transition-colors duration-150"
                          >
                            <PencilSquareIcon className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(teacher._id)}
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
                      <AcademicCapIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No teachers found. Add a new teacher to get started.</p>
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
        title={selectedTeacher ? "Edit Teacher" : "Add New Teacher"}
      >
        <TeacherForm
          key={selectedTeacher?._id || 'new'}
          teacher={selectedTeacher}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
}

export default React.memo(TeacherList); 