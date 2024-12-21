import React, { useState, useRef } from 'react';
import { ChatMessage } from '../../types/chat';
import { Send, Loader2, RefreshCw, User, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { GPUCard } from '../../pages/MarketplacePage';
import { RentalCard } from '../rental/RentalCard';
import { formatDate } from '../../utils/format';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isTyping: boolean;
  availableGPUs: any[];
  onRetry?: (messageId: string) => void;
  onClearHistory?: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onRent: (gpu: any, hours: number) => Promise<void>;
  walletAddress?: string;
  balance: number | null;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
  isTyping,
  availableGPUs,
  onRetry,
  onClearHistory,
  messagesEndRef,
  onRent,
  walletAddress,
  balance
}) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                flex items-start gap-3 max-w-[80%]
                ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}
              `}>
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${message.role === 'user' ? 'bg-glow-400' : 'bg-purple-600'}
                `}>
                  {message.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                </div>

                <div className={`
                  rounded-lg p-3
                  ${message.role === 'user' ? 'bg-glow-400/10' : 'bg-dark-700'}
                  ${message.status === 'error' ? 'border border-red-500/50' : ''}
                `}>
                  <p className="text-gray-200 whitespace-pre-wrap">{message.content}</p>
                  
                  {message.rental && (
                    <div className="mt-4">
                      <RentalCard rental={message.rental} />
                    </div>
                  )}

                  {message.error && (
                    <p className="text-sm text-red-400 mt-1">{message.error}</p>
                  )}

                  {message.status === 'error' && onRetry && (
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onRetry(message.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Try again!
                      </Button>
                    </div>
                  )}

                  <span className="text-xs text-gray-500 mt-2 block">
                    {formatDate(new Date(message.timestamp))}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-gray-400"
          >
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-glow-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 bg-glow-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 bg-glow-400 rounded-full animate-bounce" />
            </div>
            <span className="text-sm">AI texting...</span>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-dark-700 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Text your message..."
            className="flex-1 bg-dark-800/50 border border-dark-700 rounded-lg p-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-glow-400/50"
            rows={1}
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-glow-400 to-glow-600 hover:from-glow-500 hover:to-glow-700 text-white px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>

        {messages.length > 0 && onClearHistory && (
          <div className="mt-2 flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClearHistory}
              className="text-gray-400 hover:text-gray-300"
            >
              Clean chat
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};