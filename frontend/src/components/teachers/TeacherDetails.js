import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Modal from '../common/Modal';

const TeacherDetails = ({ teacher, onClose }) => {
  const { classes } = useSelector((state) => state.classes);
  const [activeTab, setActiveTab] = useState('info');

  const assignedClasses = classes.filter(cls => 
    cls.teacher?._id === teacher._id || 
    cls.subjects?.some(subject => subject.teacher === teacher._id)
  );

  const tabs = [
    { id: 'info', label: 'Information' },
    { id: 'classes', label: 'Classes' },
    { id: 'schedule', label: 'Schedule' }
  ];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`${teacher.firstName} ${teacher.lastName}`}
    >
      <div className="mt-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-4">
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
                <div className="mt-2">
                  <p className="text-sm text-gray-900">Email: {teacher.email}</p>
                  <p className="text-sm text-gray-900">Phone: {teacher.phone}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Professional Details</h4>
                <div className="mt-2">
                  <p className="text-sm text-gray-900">Subject: {teacher.subject}</p>
                  <p className="text-sm text-gray-900">Qualifications: {teacher.qualifications}</p>
                  <p className="text-sm text-gray-900">Joining Date: {new Date(teacher.joiningDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'classes' && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-500">Assigned Classes</h4>
              {assignedClasses.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {assignedClasses.map((cls) => (
                    <li key={cls._id} className="py-4">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{cls.name}</p>
                          <p className="text-sm text-gray-500">Grade {cls.grade} - Section {cls.section}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {cls.teacher?._id === teacher._id ? 'Class Teacher' : 'Subject Teacher'}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No classes assigned yet.</p>
              )}
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-500">Weekly Schedule</h4>
              {/* Add schedule implementation here */}
              <p className="text-sm text-gray-500">Schedule feature coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TeacherDetails; 