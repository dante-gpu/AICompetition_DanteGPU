import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: LucideIcon;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  label,
  description,
  checked,
  onChange,
  icon: Icon,
  disabled = false
}) => {
  return (
    <div className={`relative flex items-start ${disabled ? 'opacity-50' : ''}`}>
      {Icon && (
        <div className="mr-3 pt-0.5">
          <Icon className="w-5 h-5 text-glow-400" />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <label className="text-sm font-medium text-white cursor-pointer">
          {label}
        </label>
        {description && (
          <p className="text-sm text-gray-400 mt-0.5">
            {description}
          </p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-glow-400 
          focus:ring-offset-2 focus:ring-offset-dark-800
          ${checked ? 'bg-glow-400' : 'bg-dark-600'}
          ${disabled ? 'cursor-not-allowed' : ''}
        `}
      >
        <span
          aria-hidden="true"
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full 
            bg-white shadow ring-0 transition duration-200 ease-in-out
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
};

// Animasyonlu versiyon
export const AnimatedSwitch: React.FC<SwitchProps> = (props) => {
  return (
    <div className="group">
      <Switch {...props} />
      <div
        className={`
          absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-glow-400/10 to-transparent 
          opacity-0 blur transition-opacity duration-500 group-hover:opacity-100
          ${props.checked ? 'bg-glow-400/10' : 'bg-dark-600/10'}
        `}
      />
    </div>
  );
};

// Boyut varyantları
interface SwitchSizeProps extends SwitchProps {
  size?: 'sm' | 'md' | 'lg';
}

export const SwitchWithSize: React.FC<SwitchSizeProps> = ({ size = 'md', ...props }) => {
  const sizes = {
    sm: {
      switch: 'h-5 w-9',
      thumb: 'h-4 w-4',
      translate: 'translate-x-4',
      icon: 'w-4 h-4',
      text: 'text-xs'
    },
    md: {
      switch: 'h-6 w-11',
      thumb: 'h-5 w-5',
      translate: 'translate-x-5',
      icon: 'w-5 h-5',
      text: 'text-sm'
    },
    lg: {
      switch: 'h-7 w-14',
      thumb: 'h-6 w-6',
      translate: 'translate-x-7',
      icon: 'w-6 h-6',
      text: 'text-base'
    }
  };

  return (
    <div className="relative flex items-start">
      {props.icon && (
        <div className="mr-3 pt-0.5">
          <props.icon className={`${sizes[size].icon} text-glow-400`} />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <label className={`${sizes[size].text} font-medium text-white cursor-pointer`}>
          {props.label}
        </label>
        {props.description && (
          <p className={`${sizes[size].text} text-gray-400 mt-0.5`}>
            {props.description}
          </p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={props.checked}
        disabled={props.disabled}
        onClick={() => props.onChange(!props.checked)}
        className={`
          relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 
          focus:ring-glow-400 focus:ring-offset-2 focus:ring-offset-dark-800
          ${sizes[size].switch}
          ${props.checked ? 'bg-glow-400' : 'bg-dark-600'}
          ${props.disabled ? 'cursor-not-allowed opacity-50' : ''}
        `}
      >
        <span
          aria-hidden="true"
          className={`
            pointer-events-none inline-block transform rounded-full 
            bg-white shadow ring-0 transition duration-200 ease-in-out
            ${sizes[size].thumb}
            ${props.checked ? sizes[size].translate : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
}; 