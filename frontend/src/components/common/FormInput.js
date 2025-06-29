import React from 'react';

const FormInput = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  required = false,
  placeholder = '' 
}) => {
  // Determine autocomplete value based on field type and name
  const getAutocompleteValue = () => {
    if (type === 'password') {
      if (name === 'password') {
        return 'new-password';
      } else if (name === 'confirmPassword') {
        return 'new-password';
      } else {
        return 'current-password';
      }
    }
    if (type === 'email') return 'email';
    if (name === 'firstName') return 'given-name';
    if (name === 'lastName') return 'family-name';
    if (name === 'phone') return 'tel';
    return 'off';
  };

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1">
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={getAutocompleteValue()}
          className={`block w-full rounded-md shadow-sm sm:text-sm ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormInput; 