import { useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';

declare global {
  interface Window {
    solflare?: {
      isConnected: boolean;
      connect: () => Promise<{ publicKey: PublicKey }>;
      disconnect: () => Promise<void>;
      signAndSendTransaction: (transaction: any) => Promise<{ signature: string }>;
      publicKey?: PublicKey;
      on: (event: string, handler: () => void) => void;
      off: (event: string, handler: () => void) => void;
    };
  }
}

export const useWallet = () => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.solflare?.isConnected) {
        setConnected(true);
        setPublicKey(window.solflare.publicKey || null);
      }
    };

    const handleConnect = () => {
      if (window.solflare?.publicKey) {
        setConnected(true);
        setPublicKey(window.solflare.publicKey);
      }
    };

    const handleDisconnect = () => {
      setConnected(false);
      setPublicKey(null);
    };

    window.solflare?.on('connect', handleConnect);
    window.solflare?.on('disconnect', handleDisconnect);
    checkWalletConnection();

    return () => {
      window.solflare?.off('connect', handleConnect);
      window.solflare?.off('disconnect', handleDisconnect);
    };
  }, []);

  const connectWallet = async () => {
    if (!window.solflare) {
      window.open('https://solflare.com', '_blank');
      return;
    }

    try {
      setConnecting(true);
      const response = await window.solflare.connect();
      if (response?.publicKey) {
        setPublicKey(new PublicKey(response.publicKey));
        setConnected(true);
      }
    } catch (error) {
      console.error('Solflare connection error:', error);
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await window.solflare?.disconnect();
      setConnected(false);
      setPublicKey(null);
    } catch (error) {
      console.error('Solflare disconnect error:', error);
    }
  };

  return {
    connected,
    connecting,
    publicKey,
    connectWallet,
    disconnectWallet
  };
};