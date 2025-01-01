'use client';
import React from 'react';

interface CustomButtonProps {
  onClickAction: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: React.ReactNode;
  className?: string;
  tooltip?: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({ onClickAction, children, className, tooltip }) => {
  return (
    <button className={`btn btn-sm ${className}`} onClick={onClickAction} data-tip={tooltip}>
      {children}
    </button>
  );
};
