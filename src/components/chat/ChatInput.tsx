import React, { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  disabled 
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
        disabled={disabled}
        className={`
          w-full px-4 py-3 pr-12
          bg-dark-700 rounded-lg
          text-gray-200 placeholder-gray-500
          resize-none
          focus:outline-none focus:ring-2 focus:ring-glow-400/50
          disabled:opacity-50 disabled:cursor-not-allowed
          h-[60px]
        `}
      />
      <button
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        className={`
          absolute right-2 top-1/2 -translate-y-1/2
          p-2 rounded-full
          transition-all duration-200
          ${message.trim() && !disabled
            ? 'text-glow-400 hover:bg-glow-400/10'
            : 'text-gray-500 cursor-not-allowed'
          }
        `}
      >
        <Send size={20} />
      </button>
    </div>
  );
}; 