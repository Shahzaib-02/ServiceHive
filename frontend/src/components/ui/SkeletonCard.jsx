import React from 'react';

const SkeletonCard = ({ className = '', lines = 3 }) => {
  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <div className="space-y-3">
        {[...Array(lines)].map((_, index) => (
          <div key={index} className="bg-gray-700 rounded h-4 animate-pulse"></div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonCard;
