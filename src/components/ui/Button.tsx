import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900';
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-glow-400 to-glow-600 text-white hover:shadow-lg hover:shadow-glow-500/20',
    secondary: 'bg-dark-800 text-glow-400 hover:bg-dark-700 border border-glow-500/20',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed pointer-events-none';
  const fullWidthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${(disabled || loading) ? disabledStyles : ''}
        ${fullWidthStyles}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <LoadingSpinner />
          <span>Loading...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </div>
      )}
    </button>
  );
};