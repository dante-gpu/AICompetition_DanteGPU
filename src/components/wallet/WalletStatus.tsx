import React from 'react';
import { CheckCircleIcon, XCircleIcon } from 'lucide-react';

interface WalletStatusProps {
  connected: boolean;
  balance?: number;
}

export const WalletStatus: React.FC<WalletStatusProps> = ({ connected, balance }) => {
  return (
    <div className="flex items-center gap-2">
      {connected ? (
        <>
          <CheckCircleIcon size={16} className="text-green-500" />
          <span className="text-sm text-gray-600">
            Balance: {balance?.toFixed(3) || '0.000'} SOL
          </span>
        </>
      ) : (
        <>
          <XCircleIcon size={16} className="text-red-500" />
          <span className="text-sm text-gray-600">Not Connected</span>
        </>
      )}
    </div>
  );
};