import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NavButtonProps {
  onClick: () => void;
  label: string;
  icon: LucideIcon;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const NavButton: React.FC<NavButtonProps> = ({
  onClick,
  label,
  icon: Icon,
  active = false,
  disabled = false,
  className = '',
  children
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative flex items-center gap-3 px-4 py-2 rounded-lg font-medium
        transition-all duration-300 ease-out
        ${active 
          ? 'bg-gradient-to-r from-glow-400/90 to-glow-600/90 text-white shadow-lg shadow-glow-500/20 scale-105' 
          : 'text-gray-400 hover:text-glow-400 hover:bg-dark-800/50'
        }
        hover:scale-[1.02]
        disabled:opacity-50 disabled:cursor-not-allowed
        group
        ${className}
      `}
    >
      {/* Hover ve Active Glow Efekti */}
      <div className={`
        absolute inset-0 rounded-lg opacity-0 
        transition-opacity duration-300
        bg-gradient-to-r from-glow-400/20 to-transparent
        group-hover:opacity-100
        ${active ? 'opacity-100 blur-xl' : 'blur-lg'}
      `} />

      {/* İkon Container */}
      <div className={`
        relative z-10 
        flex items-center justify-center 
        w-6 h-6 
        rounded-lg
        transition-all duration-300
        ${active 
          ? 'bg-white/20' 
          : 'bg-dark-800 group-hover:bg-dark-700'
        }
        group-hover:scale-110
        overflow-hidden
      `}>
        {/* İkon Glow Efekti */}
        <div className={`
          absolute inset-0 
          bg-gradient-to-tr from-glow-400/20 to-transparent 
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          ${active ? 'opacity-100' : ''}
        `} />

        {/* İkon */}
        <Icon 
          size={16} 
          className={`
            relative z-10
            transition-all duration-300
            ${active 
              ? 'text-white' 
              : 'text-gray-400 group-hover:text-glow-400'
            }
            group-hover:rotate-6
            transform-gpu
          `}
          strokeWidth={2.5}
        />
      </div>

      {/* Label */}
      <span className={`
        relative z-10 
        transition-all duration-300
        tracking-wide
        ${active 
          ? 'text-white font-semibold' 
          : 'text-gray-400 group-hover:text-glow-400'
        }
      `}>
        {label}
      </span>

      {/* Alt Çizgi */}
      <div className={`
        absolute bottom-0 left-0 h-[2px] w-full
        bg-gradient-to-r from-glow-400 to-glow-600
        transition-all duration-300
        ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'}
        transform origin-left
        ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
      `} />

      {children}
    </button>
  );
};