import React from 'react';

interface SkeletonLoaderProps {
  rows?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  rows = 3, 
  className = '' 
}) => {
  return (
    <div className={`skeleton-container ${className}`} aria-label="Loading content">
      {Array.from({ length: rows }, (_, index) => (
        <div 
          key={index} 
          className="skeleton-line"
          style={{ animationDelay: `${index * 0.1}s` }}
        />
      ))}
    </div>
  );
};