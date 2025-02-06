import React from 'react';

const SpinnerComponent = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex justify-center items-center">
      <div 
        className={`${sizeClasses[size]} animate-spin rounded-full border-3 border-gray-200`}
        style={{ 
          borderRightColor: '#4f46e5',
          borderTopColor: '#4f46e5'
        }}
      />
    </div>
  );
};

const LoadingSpinner = React.memo(SpinnerComponent);
LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner; 