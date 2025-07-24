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
        className={`${sizeClasses[size]} border-2 rounded-full`}
        style={{ 
          borderColor: '#666666',
          borderTopColor: '#D4AF37'
        }}
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
      className="rounded-xl overflow-hidden premium-card"
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
    >
      <div className="aspect-[2/3]" style={{ backgroundColor: '#1F1F1F' }} />
      <div className="p-3">
        <div className="h-4 rounded mb-2" style={{ backgroundColor: '#1F1F1F' }} />
        <div className="h-3 rounded w-2/3" style={{ backgroundColor: '#1F1F1F' }} />
      </div>
    </motion.div>
  );
};