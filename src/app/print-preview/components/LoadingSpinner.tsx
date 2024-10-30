import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <span className="loading loading-bars loading-xs text-primary sm:loading-xs md:loading-sm lg:loading-md xl:loading-lg md:inline-block"></span>
        <span className="flex items-end text-secondary">
          Loading<span className="loading loading-dots loading-xs"></span>
        </span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
