import React, { useState, useRef, useEffect } from 'react';
import { Search, User, Cpu, Brain, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GPU } from '../../types/gpu';
import { AIModel } from '../../types/ai';
import { UserProfile } from '../../types/user';
import { generateAvatarUrl } from '../../utils/avatar';

interface SearchResult {
  users: UserProfile[];
  gpus: GPU[];
  aiModels: AIModel[];
}

export const GlobalSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult>({
    users: [],
    gpus: [],
    aiModels: []
  });
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.length < 2) {
      setResults({ users: [], gpus: [], aiModels: [] });
      return;
    }

    // LocalStorage'dan verileri al ve filtrele
    const users = JSON.parse(localStorage.getItem('users') || '[]') as UserProfile[];
    const gpus = JSON.parse(localStorage.getItem('gpu_database') || '[]') as GPU[];
    const aiModels = JSON.parse(localStorage.getItem('ai_models') || '[]') as AIModel[];

    const filteredResults = {
      users: users.filter(user => 
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.address.toLowerCase().includes(searchQuery.toLowerCase())
      ),
      gpus: gpus.filter(gpu => 
        gpu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gpu.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
      aiModels: aiModels.filter(model => 
        model.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    };

    setResults(filteredResults);
  };

  return (
    <div ref={searchRef} className="relative">
      <div
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg
          ${isOpen ? 'bg-dark-700 ring-1 ring-glow-400/30' : 'bg-dark-800 hover:bg-dark-700'}
          transition-all duration-200 cursor-pointer
        `}
        onClick={() => setIsOpen(true)}
      >
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search users, GPUs, or AI models..."
          className="bg-transparent border-none outline-none text-sm text-gray-300 w-64"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {query && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuery('');
              handleSearch('');
            }}
            className="p-1 hover:bg-dark-600 rounded-full"
          >
            <X size={14} className="text-gray-400" />
          </button>
        )}
      </div>

      {isOpen && (results.users.length > 0 || results.gpus.length > 0 || results.aiModels.length > 0) && (
        <div className="absolute top-full mt-2 w-full bg-dark-800 rounded-lg border border-dark-700 shadow-lg overflow-hidden">
          {results.users.length > 0 && (
            <div className="p-2">
              <h3 className="text-xs font-medium text-gray-400 px-2 mb-1">Users</h3>
              {results.users.map(user => (
                <div
                  key={user.address}
                  className="flex items-center gap-3 p-2 hover:bg-dark-700 rounded-lg cursor-pointer"
                  onClick={() => {
                    navigate(`/profile/${user.address}`);
                    setIsOpen(false);
                  }}
                >
                  <img
                    src={generateAvatarUrl(user.address)}
                    alt={user.username}
                    className="w-8 h-8 rounded-full border border-dark-600"
                  />
                  <div>
                    <p className="text-sm text-white">{user.username || user.address.slice(0, 8)}</p>
                    <p className="text-xs text-gray-400">{user.reputation.level}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.gpus.length > 0 && (
            <div className="p-2 border-t border-dark-700">
              <h3 className="text-xs font-medium text-gray-400 px-2 mb-1">GPUs</h3>
              {results.gpus.map(gpu => (
                <div
                  key={gpu.id}
                  className="flex items-center gap-3 p-2 hover:bg-dark-700 rounded-lg cursor-pointer"
                  onClick={() => {
                    navigate(`/gpu/${gpu.id}`);
                    setIsOpen(false);
                  }}
                >
                  <div className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center">
                    <Cpu size={16} className="text-glow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white">{gpu.name}</p>
                    <p className="text-xs text-gray-400">{gpu.manufacturer}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.aiModels.length > 0 && (
            <div className="p-2 border-t border-dark-700">
              <h3 className="text-xs font-medium text-gray-400 px-2 mb-1">AI Models</h3>
              {results.aiModels.map(model => (
                <div
                  key={model.id}
                  className="flex items-center gap-3 p-2 hover:bg-dark-700 rounded-lg cursor-pointer"
                  onClick={() => {
                    navigate(`/ai-models/${model.id}`);
                    setIsOpen(false);
                  }}
                >
                  <div className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center">
                    <Brain size={16} className="text-glow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white">{model.name}</p>
                    <p className="text-xs text-gray-400">{model.type}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 