import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  PlayIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  BookOpenIcon,
  ChatBubbleLeftIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  VideoCameraIcon,
  DocumentIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

/**
 * CourseDetail Component
 * 
 * Displays detailed course information, lesson content, and learning progress.
 * 
 * Features:
 * - Course overview and instructor information
 * - Lesson list with progress tracking
 * - Video player integration
 * - Course materials and resources
 * - Discussion forum
 * - Progress tracking and certificates
 * 
 * @component
 * @example
 * ```jsx
 * <CourseDetail />
 * ```
 */
const CourseDetail = () => {
  const { courseId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock course data - replace with API call
  useEffect(() => {
    const mockCourse = {
      id: courseId,
      title: 'Introduction to Mathematics',
      description: 'Learn fundamental mathematical concepts including algebra, geometry, and calculus. This comprehensive course covers essential topics that form the foundation of advanced mathematics.',
      instructor: {
        name: 'Dr. Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        bio: 'PhD in Mathematics from MIT with 15+ years of teaching experience',
        rating: 4.9,
        students: 1200
      },
      category: 'Mathematics',
      level: 'Beginner',
      duration: '8 weeks',
      lessons: 24,
      students: 156,
      rating: 4.8,
      price: 0,
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      enrolled: true,
      progress: 65,
      lessons: [
        {
          id: 1,
          title: 'Introduction to Algebra',
          duration: '45 min',
          type: 'video',
          completed: true,
          description: 'Learn the basics of algebraic expressions and equations'
        },
        {
          id: 2,
          title: 'Solving Linear Equations',
          duration: '60 min',
          type: 'video',
          completed: true,
          description: 'Master the techniques for solving linear equations'
        },
        {
          id: 3,
          title: 'Algebra Quiz 1',
          duration: '30 min',
          type: 'quiz',
          completed: false,
          description: 'Test your understanding of algebraic concepts'
        },
        {
          id: 4,
          title: 'Geometry Fundamentals',
          duration: '50 min',
          type: 'video',
          completed: false,
          description: 'Explore basic geometric shapes and properties'
        },
        {
          id: 5,
          title: 'Practice Problems',
          duration: '40 min',
          type: 'assignment',
          completed: false,
          description: 'Complete practice problems to reinforce learning'
        }
      ],
      materials: [
        { name: 'Course Syllabus', type: 'pdf', size: '2.3 MB' },
        { name: 'Practice Worksheets', type: 'pdf', size: '5.1 MB' },
        { name: 'Reference Guide', type: 'pdf', size: '1.8 MB' }
      ],
      requirements: [
        'Basic arithmetic skills',
        'High school level reading comprehension',
        'Access to a computer with internet connection'
      ],
      outcomes: [
        'Understand fundamental algebraic concepts',
        'Solve linear and quadratic equations',
        'Apply geometric principles to real-world problems',
        'Develop mathematical reasoning skills'
      ]
    };

    setCourse(mockCourse);
    setLoading(false);
  }, [courseId]);

  const handleLessonComplete = (lessonId) => {
    setCourse(prev => ({
      ...prev,
      lessons: prev.lessons.map(lesson =>
        lesson.id === lessonId ? { ...lesson, completed: true } : lesson
      )
    }));
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video':
        return <VideoCameraIcon className="h-5 w-5" />;
      case 'quiz':
        return <QuestionMarkCircleIcon className="h-5 w-5" />;
      case 'assignment':
        return <DocumentIcon className="h-5 w-5" />;
      default:
        return <DocumentTextIcon className="h-5 w-5" />;
    }
  };

  const getLessonTypeColor = (type) => {
    switch (type) {
      case 'video':
        return 'bg-blue-100 text-blue-800';
      case 'quiz':
        return 'bg-yellow-100 text-yellow-800';
      case 'assignment':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Course not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The course you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div className="py-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/learning"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Courses
          </Link>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-64 md:h-96">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{course.title}</h1>
                <p className="text-lg opacity-90">{course.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {['overview', 'lessons', 'materials', 'discussions'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Course</h3>
                      <p className="text-gray-600 leading-relaxed">{course.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-3">What You'll Learn</h4>
                        <ul className="space-y-2">
                          {course.outcomes.map((outcome, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600">{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-3">Requirements</h4>
                        <ul className="space-y-2">
                          {course.requirements.map((requirement, index) => (
                            <li key={index} className="flex items-start">
                              <div className="h-2 w-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                              <span className="text-gray-600">{requirement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lessons Tab */}
                {activeTab === 'lessons' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Course Content</h3>
                      <span className="text-sm text-gray-500">
                        {course.lessons.filter(l => l.completed).length} of {course.lessons.length} completed
                      </span>
                    </div>

                    <div className="space-y-2">
                      {course.lessons.map((lesson, index) => (
                        <motion.div
                          key={lesson.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                            lesson.completed
                              ? 'bg-green-50 border-green-200'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => setCurrentLesson(index)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${getLessonTypeColor(lesson.type)}`}>
                                {getLessonIcon(lesson.type)}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                                <p className="text-sm text-gray-500">{lesson.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-gray-500">{lesson.duration}</span>
                              {lesson.completed ? (
                                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                              ) : (
                                <PlayIcon className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Materials Tab */}
                {activeTab === 'materials' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Materials</h3>
                    <div className="space-y-3">
                      {course.materials.map((material, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <DocumentIcon className="h-6 w-6 text-gray-400" />
                            <div>
                              <h4 className="font-medium text-gray-900">{material.name}</h4>
                              <p className="text-sm text-gray-500">{material.size}</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Discussions Tab */}
                {activeTab === 'discussions' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Discussions</h3>
                    <div className="text-center py-8">
                      <ChatBubbleLeftIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No discussions yet</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Start a discussion to connect with other students.
                      </p>
                      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                        Start Discussion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{course.instructor.name}</h4>
                  <p className="text-sm text-gray-500">Instructor</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium">{course.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Level</span>
                  <span className="font-medium">{course.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Lessons</span>
                  <span className="font-medium">{course.lessons.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Students</span>
                  <span className="font-medium">{course.students}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Rating</span>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{course.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Your Progress</h4>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Overall Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Lessons Completed</span>
                  <span className="font-medium">
                    {course.lessons.filter(l => l.completed).length} / {course.lessons.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time Spent</span>
                  <span className="font-medium">4h 23m</span>
                </div>
              </div>
            </div>

            {/* Certificate */}
            {course.progress >= 100 && (
              <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg shadow-md p-6 text-white">
                <div className="text-center">
                  <CheckCircleIcon className="h-12 w-12 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Course Completed!</h4>
                  <p className="text-sm opacity-90 mb-4">
                    Congratulations! You've successfully completed this course.
                  </p>
                  <button className="w-full px-4 py-2 bg-white text-green-600 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200">
                    Download Certificate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail; 