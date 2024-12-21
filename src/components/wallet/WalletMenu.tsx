import React, { useState, useRef, useEffect } from 'react';
import { WalletIcon, LogOut, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { WalletAvatar } from './WalletAvatar';

interface WalletMenuProps {
  walletAddress: string;
  onDisconnect: () => void;
}

export const WalletMenu: React.FC<WalletMenuProps> = ({
  walletAddress,
  onDisconnect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openExplorer = () => {
    window.open(`https://explorer.solana.com/address/${walletAddress}?cluster=devnet`, '_blank');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 flex items-center gap-2"
      >
        <WalletAvatar address={walletAddress} size={24} />
        {`${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden z-50">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <WalletAvatar address={walletAddress} size={48} />
              <div>
                <p className="text-sm text-gray-400">Connected with Solflare</p>
                <p className="text-sm font-mono text-gray-300">
                  {`${walletAddress.slice(0, 8)}...${walletAddress.slice(-8)}`}
                </p>
              </div>
            </div>
          </div>

          <div className="p-2">
            <button
              onClick={copyAddress}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
            >
              {copied ? (
                <CheckCircle size={16} className="mr-2 text-green-500" />
              ) : (
                <Copy size={16} className="mr-2" />
              )}
              {copied ? 'Copied!' : 'Copy Address'}
            </button>

            <button
              onClick={openExplorer}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ExternalLink size={16} className="mr-2" />
              View on Explorer
            </button>

            <button
              onClick={() => {
                onDisconnect();
                setIsOpen(false);
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut size={16} className="mr-2" />
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};