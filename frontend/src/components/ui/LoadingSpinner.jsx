import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  return (
    <div className={`inline-block animate-spin rounded-full border-2 border-gray-200 border-t-gray-200 ${className}`}>
      <div 
        className={`animate-spin rounded-full border-2 border-transparent border-t-transparent ${size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-6 w-6' : size === 'lg' ? 'h-8 w-8' : 'h-12 w-12'}`}
        style={{
          borderTopColor: 'rgba(59, 130, 246, 0.2)',
          borderRightColor: 'rgba(59, 130, 246, 0.2)',
          borderBottomColor: 'rgba(59, 130, 246, 0.2)',
          borderLeftColor: 'rgba(59, 130, 246, 0.2)',
        }}
      >
        <div className="h-full w-full bg-gradient-to-r from-blue-500/20% via-cyan-500 to-purple-500/80% bg-clip-border">
          <div className="h-full w-full rounded-full border-2 border-transparent animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
