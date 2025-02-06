import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase';
import { updateProfile, updatePassword, deleteAccount } from '../../store/slices/authSlice';
import { validateForm } from '../../utils/validation';
import FormInput from '../common/FormInput';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, updateLoading, updateError } = useSelector((state) => state.auth);
  const fileInputRef = useRef();
  const [isEditing, setIsEditing] = useState(false);
  const defaultUser = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    qualification: '',
    designation: '',
    role: '',
  };

  const [formData, setFormData] = useState({
    ...defaultUser,
    ...(user || {}),
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData, ['firstName', 'lastName', 'email']);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    try {
      await dispatch(updateProfile(formData)).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(passwordData, ['currentPassword', 'newPassword', 'confirmPassword']);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    await dispatch(updatePassword(passwordData));
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `profile-photos/${user.id}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload error:', error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        dispatch(updateProfile({ ...formData, photoURL: downloadURL }));
        setUploadProgress(0);
      }
    );
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      await dispatch(deleteAccount());
    }
  };

  if (updateLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <div className="relative px-6 pb-6">
            <div className="flex items-center">
              <div className="-mt-16">
                <div className="inline-block h-32 w-32 rounded-xl ring-4 ring-white bg-white p-2">
                  <div className="h-full w-full rounded-lg bg-indigo-100 flex items-center justify-center">
                    <UserCircleIcon className="h-20 w-20 text-indigo-600" />
                  </div>
                </div>
              </div>
              <div className="ml-6 -mt-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.firstName || 'User'} {user?.lastName || ''}
                </h1>
                <p className="text-sm text-gray-500">{user?.role || 'Loading...'}</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="ml-auto -mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                <PencilSquareIcon className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          {updateError && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 border border-red-200">
              <p className="text-sm text-red-700">{updateError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Personal Information */}
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <div className="mt-1 relative rounded-lg">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`block w-full rounded-lg border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${!isEditing && 'bg-gray-50'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <div className="mt-1 relative rounded-lg">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`block w-full rounded-lg border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${!isEditing && 'bg-gray-50'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="mt-1 relative rounded-lg flex">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`block w-full pl-10 rounded-lg border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${!isEditing && 'bg-gray-50'}`}
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Professional Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Qualification</label>
                  <div className="mt-1 relative rounded-lg flex">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`block w-full pl-10 rounded-lg border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${!isEditing && 'bg-gray-50'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Designation</label>
                  <div className="mt-1 relative rounded-lg flex">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`block w-full pl-10 rounded-lg border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${!isEditing && 'bg-gray-50'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <div className="mt-1 relative rounded-lg flex">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`block w-full pl-10 rounded-lg border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${!isEditing && 'bg-gray-50'}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <div className="mt-1 relative rounded-lg flex">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    name="address"
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`block w-full pl-10 rounded-lg border-gray-200 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${!isEditing && 'bg-gray-50'}`}
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {updateLoading ? <LoadingSpinner size="sm" /> : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile; 