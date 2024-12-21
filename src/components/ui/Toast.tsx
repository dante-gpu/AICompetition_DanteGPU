import React, { useEffect } from 'react';
import { XIcon } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    success: 'border-green-500 bg-green-500/10 text-green-400',
    error: 'border-red-500 bg-red-500/10 text-red-400',
    info: 'border-glow-500 bg-glow-500/10 text-glow-400'
  };

  return (
    <div className={`
      fixed bottom-4 right-4 p-4 rounded-lg
      border backdrop-blur-lg
      transition-all duration-300
      ${typeStyles[type]}
    `}>
      <span>{message}</span>
      <button onClick={onClose} className="hover:opacity-80">
        <XIcon size={18} />
      </button>
    </div>
  );
};