
import React from 'react';

interface TrashIconProps {
  className?: string;
}

const TrashIcon: React.FC<TrashIconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className || "w-5 h-5"}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c1.153 0 2.24.032 3.22.096m-3.22-.096A48.37 48.37 0 0 1 M6.375 5.79m11.25 0c.608 0 1.158.015 1.7.045M6.375 5.79m11.25 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

export default TrashIcon;
