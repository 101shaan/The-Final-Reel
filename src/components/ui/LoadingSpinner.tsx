import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} border-2 border-gray-600 border-t-purple-500 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
};

export const LoadingCard: React.FC = () => {
  return (
    <motion.div
      className="bg-gray-800 rounded-lg overflow-hidden"
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
    >
      <div className="aspect-[2/3] bg-gray-700" />
      <div className="p-3">
        <div className="h-4 bg-gray-700 rounded mb-2" />
        <div className="h-3 bg-gray-700 rounded w-2/3" />
      </div>
    </motion.div>
  );
};