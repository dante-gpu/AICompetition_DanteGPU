import { useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import { getBalance } from '../utils/solana';

export const useWalletBalance = (publicKey: PublicKey | null) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalance = async () => {
    if (!publicKey) {
      setBalance(null);
      return;
    }

    setIsLoading(true);
    try {
      const newBalance = await getBalance(publicKey);
      setBalance(newBalance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    const intervalId = setInterval(fetchBalance, 10000); // Refresh every 10 seconds

    return () => clearInterval(intervalId);
  }, [publicKey]);

  return { balance, isLoading, refreshBalance: fetchBalance };
};