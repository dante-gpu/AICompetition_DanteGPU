import React from 'react';
import { ChatMessage as ChatMessageType } from '../../types/chat';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`
        flex items-start gap-3 max-w-[80%]
        ${isUser ? 'flex-row-reverse' : 'flex-row'}
      `}>
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center
          ${isUser ? 'bg-glow-400' : 'bg-purple-600'}
        `}>
          {isUser ? <User size={18} /> : <Bot size={18} />}
        </div>

        <div className={`
          rounded-lg p-3
          ${isUser ? 'bg-glow-400/10' : 'bg-dark-700'}
          ${message.status === 'error' ? 'border border-red-500/50' : ''}
        `}>
          <p className="text-gray-200">{message.content}</p>
          {message.error && (
            <p className="text-sm text-red-400 mt-1">{message.error}</p>
          )}
          <span className="text-xs text-gray-500 mt-1 block">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
}; 