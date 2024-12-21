import React, { useState, useRef, useEffect } from 'react';
import { Search, User, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../../types/user';
import { accountService } from '../../services/account';
import { generateAvatarUrl } from '../../utils/avatar';

export const AccountSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserProfile[]>([]);
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
      setResults([]);
      return;
    }

    const searchResults = await accountService.searchAccounts(searchQuery);
    setResults(searchResults);
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
          placeholder="Search by wallet address..."
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

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-dark-800 rounded-lg border border-dark-700 shadow-lg overflow-hidden">
          {results.map(account => (
            <div
              key={account.address}
              className="flex items-center gap-3 p-3 hover:bg-dark-700 cursor-pointer"
              onClick={() => {
                navigate(`/profile/${account.address}`);
                setIsOpen(false);
              }}
            >
              <img
                src={generateAvatarUrl(account.address)}
                alt={account.username || account.address}
                className="w-8 h-8 rounded-full border border-dark-600"
              />
              <div>
                <p className="text-sm text-white">
                  {account.username || `${account.address.slice(0, 6)}...${account.address.slice(-4)}`}
                </p>
                <p className="text-xs text-gray-400">
                  {account.reputation.level} • {account.reputation.score} points
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 