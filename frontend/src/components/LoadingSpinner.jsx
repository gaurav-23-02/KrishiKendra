import React from 'react';
import { Sprout } from 'lucide-react';

const LoadingSpinner = ({ message = "Loading agricultural data..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-krishi-200 border-t-krishi-600 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-krishi-700">
          <Sprout className="w-5 h-5 animate-pulse" />
        </div>
      </div>
      <p className="text-sm font-medium text-gray-500 animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
