import React from 'react';
import { Film } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  text = 'Loading...' 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <div className="relative">
        <Film 
          className={`${sizeClasses[size]} text-red-500 animate-spin`}
        />
        <div className="absolute inset-0 rounded-full border-2 border-red-500/20 animate-pulse"></div>
      </div>
      
      <p className={`text-gray-400 ${textSizeClasses[size]} animate-pulse`}>
        {text}
      </p>
    </div>
  );
};

export default LoadingSpinner;