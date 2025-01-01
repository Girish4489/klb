'use client';
import React from 'react';

interface LoadingSpinnerProps {
  classStyle?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ classStyle = 'h-screen' }) => {
  return (
    <div className={`flex items-center justify-center ${classStyle}`}>
      <div className="text-center">
        <span className="loading loading-bars loading-xs text-primary sm:loading-xs md:loading-sm lg:loading-md xl:loading-lg md:inline-block"></span>
        <span className="text-secondary flex items-end">
          Loading<span className="loading loading-dots loading-xs"></span>
        </span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
