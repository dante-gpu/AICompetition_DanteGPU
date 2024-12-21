import { useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import { connection } from '../utils/solana';

export const useBalance = (publicKey: PublicKey | null) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalance = async () => {
    if (!publicKey) return;
    
    setIsLoading(true);
    try {
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / 1e9); // Convert lamports to SOL
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    
    // Subscribe to balance changes
    const subscription = connection.onAccountChange(
      publicKey!,
      () => fetchBalance(),
      'confirmed'
    );

    return () => {
      connection.removeAccountChangeListener(subscription);
    };
  }, [publicKey]);

  return { balance, isLoading, refreshBalance: fetchBalance };
};