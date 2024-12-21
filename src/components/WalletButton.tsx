import React from 'react';
import { WalletIcon } from 'lucide-react';

interface WalletButtonProps {
  onConnect: () => void;
  connected: boolean;
  walletAddress?: string;
}

export const WalletButton: React.FC<WalletButtonProps> = ({
  onConnect,
  connected,
  walletAddress,
}) => {
  return (
    <button
      onClick={onConnect}
      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
    >
      <WalletIcon size={20} />
      {connected
        ? `${walletAddress?.slice(0, 4)}...${walletAddress?.slice(-4)}`
        : 'Connect Wallet'}
    </button>
  );
};