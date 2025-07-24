import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900';

  const variantClasses = {
    primary: 'text-white shadow-lg hover:shadow-xl focus:ring-2',
    secondary: 'text-white border focus:ring-2',
    ghost: 'hover:text-white focus:ring-2',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: '#D4AF37',
          color: '#0E0E0E',
          fontWeight: '400',
        };
      case 'secondary':
        return {
          background: 'transparent',
          color: '#AFAFAF',
          borderColor: '#AFAFAF',
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: '#AFAFAF',
        };
      default:
        return {};
    }
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={combinedClasses}
      style={getVariantStyles()}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" 
               style={{ borderColor: variant === 'primary' ? '#0E0E0E' : '#AFAFAF' }} />
        </motion.div>
      )}
      
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {Icon && <Icon className="w-4 h-4 mr-2" />}
        {children}
      </span>
    </motion.button>
  );
};