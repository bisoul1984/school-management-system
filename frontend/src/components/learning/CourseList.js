import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  BookOpenIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  AcademicCapIcon,
  PlayIcon,
  DocumentTextIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

/**
 * CourseList Component
 * 
 * Displays a list of available online courses with filtering, search, and enrollment functionality.
 * 
 * Features:
 * - Course grid layout with detailed information
 * - Search and filter functionality
 * - Course categories and difficulty levels
 * - Enrollment status and progress tracking
 * - Responsive design with animations
 * 
 * @component
 * @example
 * ```jsx
 * <CourseList />
 * ```
 */
const CourseList = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');

  // Mock course data - replace with API call
  useEffect(() => {
    const mockCourses = [
      {
        id: 1,
        title: 'Introduction to Mathematics',
        description: 'Learn fundamental mathematical concepts including algebra, geometry, and calculus.',
        instructor: 'Dr. Sarah Johnson',
        category: 'Mathematics',
        level: 'Beginner',
        duration: '8 weeks',
        lessons: 24,
        students: 156,
        rating: 4.8,
        price: 0,
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        enrolled: true,
        progress: 65
      },
      {
        id: 2,
        title: 'Advanced Physics Concepts',
        description: 'Explore advanced physics topics including quantum mechanics and relativity.',
        instructor: 'Prof. Michael Chen',
        category: 'Physics',
        level: 'Advanced',
        duration: '12 weeks',
        lessons: 36,
        students: 89,
        rating: 4.9,
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        enrolled: false,
        progress: 0
      },
      {
        id: 3,
        title: 'Creative Writing Workshop',
        description: 'Develop your writing skills through creative exercises and peer feedback.',
        instructor: 'Ms. Emily Davis',
        category: 'Language Arts',
        level: 'Intermediate',
        duration: '6 weeks',
        lessons: 18,
        students: 203,
        rating: 4.7,
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        enrolled: true,
        progress: 100
      },
      {
        id: 4,
        title: 'Computer Science Fundamentals',
        description: 'Learn programming basics, algorithms, and data structures.',
        instructor: 'Dr. Robert Wilson',
        category: 'Computer Science',
        level: 'Beginner',
        duration: '10 weeks',
        lessons: 30,
        students: 342,
        rating: 4.6,
        price: 0,
        image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        enrolled: false,
        progress: 0
      },
      {
        id: 5,
        title: 'World History: Ancient Civilizations',
        description: 'Explore the rise and fall of ancient civilizations around the world.',
        instructor: 'Prof. Lisa Thompson',
        category: 'History',
        level: 'Intermediate',
        duration: '8 weeks',
        lessons: 24,
        students: 127,
        rating: 4.5,
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        enrolled: false,
        progress: 0
      },
      {
        id: 6,
        title: 'Environmental Science',
        description: 'Study environmental systems, sustainability, and climate change.',
        instructor: 'Dr. James Martinez',
        category: 'Science',
        level: 'Intermediate',
        duration: '9 weeks',
        lessons: 27,
        students: 178,
        rating: 4.8,
        price: 0,
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        enrolled: true,
        progress: 30
      }
    ];

    setCourses(mockCourses);
    setLoading(false);
  }, []);

  // Filter and sort courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return b.students - a.students;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id - a.id;
      case 'price':
        return a.price - b.price;
      default:
        return 0;
    }
  });

  const categories = ['all', 'Mathematics', 'Physics', 'Language Arts', 'Computer Science', 'History', 'Science'];
  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const handleEnroll = (courseId) => {
    // Mock enrollment - replace with API call
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, enrolled: true, progress: 0 }
        : course
    ));
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Online Learning Platform</h1>
          <p className="text-gray-600">Discover and enroll in courses to expand your knowledge</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Courses</label>
              <input
                type="text"
                placeholder="Search by title, description, or instructor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {levels.map(level => (
                  <option key={level} value={level}>
                    {level === 'all' ? 'All Levels' : level}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="popularity">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="price">Price: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Course Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                {course.enrolled && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Enrolled
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  {course.price === 0 ? 'Free' : `$${course.price}`}
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {course.category}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {course.level}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {course.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <AcademicCapIcon className="h-4 w-4 mr-1" />
                  {course.instructor}
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div className="flex items-center text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center text-gray-500">
                    <DocumentTextIcon className="h-4 w-4 mr-1" />
                    {course.lessons} lessons
                  </div>
                  <div className="flex items-center text-gray-500">
                    <UserGroupIcon className="h-4 w-4 mr-1" />
                    {course.students}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(course.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {course.rating} ({course.students} students)
                  </span>
                </div>

                {/* Progress Bar (if enrolled) */}
                {course.enrolled && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(course.progress)}`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {course.enrolled ? (
                    <Link
                      to={`/learning/course/${course.id}`}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                      <PlayIcon className="h-4 w-4 mr-2" />
                      Continue Learning
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course.id)}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                    >
                      <BookOpenIcon className="h-4 w-4 mr-2" />
                      Enroll Now
                    </button>
                  )}
                  
                  <Link
                    to={`/learning/course/${course.id}/preview`}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                  >
                    Preview
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList; 