import React from 'react';
import { ChatSession } from '../../types/chat';
import { MessageSquare, Clock } from 'lucide-react';

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSession?: ChatSession;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  currentSession,
  onSelectSession,
  onNewSession,
}) => {
  return (
    <div className="h-full flex flex-col bg-dark-800">
      <div className="p-4">
        <button
          onClick={onNewSession}
          className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-glow-400 to-glow-600 text-white hover:shadow-lg hover:shadow-glow-500/20 transition-all"
        >
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            className={`
              w-full p-3 text-left transition-all
              hover:bg-dark-700
              ${currentSession?.id === session.id ? 'bg-dark-700' : ''}
            `}
          >
            <div className="flex items-center gap-3">
              <MessageSquare size={16} className="text-glow-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {session.title}
                </p>
                {session.lastMessage && (
                  <p className="text-xs text-gray-400 truncate mt-1">
                    {session.lastMessage}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <Clock size={12} />
              <span>
                {new Date(session.timestamp).toLocaleDateString()}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}; 