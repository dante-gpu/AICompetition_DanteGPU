import { useState, useEffect } from 'react';
import { RentalHistory } from '../types/rental';
import { PublicKey } from '@solana/web3.js';
import { GPU } from '../types/gpu';
import { createRental, getRentals, updateRentalStatus, syncTransactionHistory } from '../services/rental';
import { useConnection } from '@solana/wallet-adapter-react';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Devnet RPC URL'sini tanımla
const SOLANA_RPC_URL = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com';

export const useRentals = (publicKey?: PublicKey) => {
  const [rentals, setRentals] = useState<RentalHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { connection } = useConnection();

  useEffect(() => {
    const loadRentals = async () => {
      if (publicKey) {
        setLoading(true);
        try {
          // Blockchain ile senkronize et
          await syncTransactionHistory(connection, publicKey);
          // Güncel rental history'yi getir
          const userRentals = await getRentals(publicKey.toBase58());
          setRentals(userRentals);
        } catch (error) {
          console.error('Error loading rentals:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadRentals();
    
    // Her 30 saniyede bir güncelle
    const interval = setInterval(loadRentals, 30000);
    return () => clearInterval(interval);
  }, [publicKey, connection]);

  const handleRent = async (gpu: GPU, hours: number, publicKey: PublicKey) => {
    try {
      // Bakiye kontrolü
      const connection = new Connection(SOLANA_RPC_URL);
      const balance = await connection.getBalance(publicKey);
      const totalPrice = gpu.pricePerHour * hours;
      const totalLamports = Math.floor(totalPrice * LAMPORTS_PER_SOL);
      
      if (balance < totalLamports) {
        throw new Error(`Insufficient balance. Required: ${totalPrice} SOL`);
      }

      // Kiralama işlemini başlat
      const rental = await createRental(
        gpu,
        hours,
        totalPrice,
        publicKey
      );

      setRentals(prev => [...prev, rental]);
      return { 
        success: true, 
        rental, 
        signature: rental.transactionSignature 
      };
    } catch (error) {
      console.error('Error creating rental:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Transaction failed',
        details: error
      };
    }
  };

  const handleExpire = async (rentalId: string) => {
    try {
      await updateRentalStatus(rentalId, 'expired');
      setRentals(prev => 
        prev.map(r => r.id === rentalId ? { ...r, status: 'expired' } : r)
      );
    } catch (error) {
      console.error('Error expiring rental:', error);
    }
  };

  const getTotalSpent = () => 
    rentals.reduce((sum, rental) => sum + rental.price, 0);

  return {
    rentals,
    loading,
    handleRent,
    handleExpire,
    getTotalSpent
  };
};