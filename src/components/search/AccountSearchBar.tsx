import React, { useState, useRef, useEffect } from 'react';
import { Search, User, X, Shield, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../../types/user';
import { accountService } from '../../services/account';
import { generateAvatarUrl } from '../../utils/avatar';
import { formatSOL } from '../../utils/format';

export const AccountSearchBar: React.FC = () => {
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
    <div ref={searchRef} className="relative flex-1 max-w-xl">
      <div
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg
          ${isOpen ? 'bg-dark-700 ring-1 ring-glow-400/30' : 'bg-dark-800 hover:bg-dark-700'}
          transition-all duration-200
        `}
        onClick={() => setIsOpen(true)}
      >
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search users by wallet address or username..."
          className="w-full bg-transparent border-none outline-none text-sm text-gray-300"
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
        <div className="absolute top-full mt-2 w-full bg-dark-800 rounded-lg border border-dark-700 shadow-lg overflow-hidden z-50">
          {results.map(account => (
            <div
              key={account.address}
              className="flex items-center gap-4 p-4 hover:bg-dark-700 cursor-pointer transition-colors"
              onClick={() => {
                navigate(`/profile/${account.address}`);
                setIsOpen(false);
              }}
            >
              <div className="relative">
                <img
                  src={account.avatarUrl}
                  alt={account.username || account.address}
                  className="w-10 h-10 rounded-lg border border-dark-600"
                />
                <div className="absolute -bottom-1 -right-1 bg-dark-800 rounded-md px-1.5 py-0.5 border border-dark-700">
                  <Star size={12} className="text-yellow-400" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white">
                    {account.username || `${account.address.slice(0, 6)}...${account.address.slice(-4)}`}
                  </p>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-dark-600">
                    <Shield size={12} className="text-glow-400" />
                    <span className="text-xs text-gray-300">{account.reputation.level}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-xs text-gray-400">
                    {account.reputation.totalRentals} rentals
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatSOL(account.stats.totalSpent)} SOL spent
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 