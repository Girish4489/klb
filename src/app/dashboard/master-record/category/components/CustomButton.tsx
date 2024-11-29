'use client';
import React from 'react';

interface CustomButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: React.ReactNode;
  className?: string;
  tooltip?: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({ onClick, children, className, tooltip }) => {
  return (
    <button className={`btn btn-sm ${className}`} onClick={onClick} data-tip={tooltip}>
      {children}
    </button>
  );
};
