import React from 'react';
import { motion } from 'framer-motion';
import { AcademicCapIcon, UserGroupIcon, BookOpenIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const AboutPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            About Our School
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Learn about our mission, values, and commitment to education
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
              <p className="mt-4 text-gray-500">
                We are dedicated to providing quality education that empowers students
                to achieve their full potential and become responsible global citizens.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
              <p className="mt-4 text-gray-500">
                To be a leading educational institution that nurtures creativity,
                critical thinking, and character development in our students.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Our Values</h2>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Excellence</h3>
                <p className="mt-2 text-gray-500">
                  Striving for the highest standards in education and personal development
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Innovation</h3>
                <p className="mt-2 text-gray-500">
                  Embracing new ideas and approaches to learning
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Community</h3>
                <p className="mt-2 text-gray-500">
                  Building strong relationships between students, teachers, and families
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AboutPage; 