import React, { useState } from 'react';
import {
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Tab } from '@headlessui/react';
import StudentsList from './StudentsList';
import AssignmentsList from './AssignmentsList';

const ClassDetailsModal = ({ classData, onClose }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    { name: 'Overview', icon: AcademicCapIcon },
    { name: 'Students', icon: UserGroupIcon },
    { name: 'Assignments', icon: BookOpenIcon },
  ];

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{classData.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-4 border-b border-gray-200 mb-6">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  `${
                    selected
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } flex items-center px-3 py-2 border-b-2 font-medium text-sm focus:outline-none`
                }
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels>
            {/* Overview Panel */}
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-5 w-5 mr-2" />
                    <span>Schedule: {classData.schedule.day} at {classData.schedule.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    <span>Room: {classData.room}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <UserIcon className="h-5 w-5 mr-2" />
                    <span>Teacher: {classData.teacher?.firstName} {classData.teacher?.lastName}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <UserGroupIcon className="h-5 w-5 mr-2" />
                    <span>Students: {classData.students?.length || 0}</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Class Description</h3>
                  <p className="text-gray-600">{classData.description || 'No description available.'}</p>
                </div>
              </div>
            </Tab.Panel>

            {/* Students Panel */}
            <Tab.Panel>
              <StudentsList classId={classData._id} />
            </Tab.Panel>

            {/* Assignments Panel */}
            <Tab.Panel>
              <AssignmentsList classId={classData._id} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default ClassDetailsModal; 