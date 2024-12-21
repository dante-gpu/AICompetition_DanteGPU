import React, { ReactNode } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  icon?: ReactNode;
  multiline?: boolean;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  className = '', 
  icon,
  multiline = false,
  ...props 
}) => {
  const InputComponent = multiline ? 'textarea' as const : 'input' as const;

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            {icon}
          </div>
        )}
        <InputComponent
          className={`
            w-full px-3 py-2 
            ${icon ? 'pl-10' : 'px-3'}
            bg-dark-700 border border-dark-600 
            rounded-lg text-white 
            placeholder-gray-500
            focus:outline-none focus:border-glow-400/50
            transition-colors
            ${multiline ? 'resize-none' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
    </div>
  );
}; 