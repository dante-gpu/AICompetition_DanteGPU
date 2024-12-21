import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWallet } from '../hooks/useWallet';

interface WalletContextType {
  connected: boolean;
  walletAddress: string | null;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { connected, publicKey, connectWallet, disconnectWallet } = useWallet();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    if (connected && publicKey) {
      setWalletAddress(publicKey.toBase58());
    } else {
      setWalletAddress(null);
    }
  }, [connected, publicKey]);

  return (
    <WalletContext.Provider
      value={{
        connected,
        walletAddress,
        onConnect: connectWallet,
        onDisconnect: disconnectWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
}; 