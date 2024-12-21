import { RentalHistory, UsageStats, PerformanceMetrics } from '../types/rental';
import { GPU } from '../types/gpu';
import { AIModel } from '../types/ai';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

const RENTAL_STORAGE_KEY = 'rental_history';
const MAX_RENTALS = 100; // Maksimum saklayacağımız kiralama sayısı

// Platform cüzdan adresi (Devnet için)
const PLATFORM_WALLET = "DZKzDMbq3HpwAqP3H9UwKqpgUteLFxGKHVVuFjqoqkXk";

// Devnet RPC URL'sini tanımla
const SOLANA_RPC_URL = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com';

export const saveRental = async (rental: RentalHistory) => {
  try {
    const rentals = await getRentals();
    
    // Eğer maksimum sayıya ulaşıldıysa, en eski kiralamaları sil
    if (rentals.length >= MAX_RENTALS) {
      // Status'u completed veya expired olan en eski kiralamaları sil
      const activeRentals = rentals.filter(r => r.status === 'active');
      const completedRentals = rentals
        .filter(r => r.status !== 'active')
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, MAX_RENTALS - activeRentals.length - 1);
      
      rentals.length = 0; // Array'i temizle
      rentals.push(...activeRentals, ...completedRentals);
    }

    // Yeni kiralamayı ekle
    rentals.push(rental);

    // Veriyi sıkıştırarak sakla
    const compressedData = JSON.stringify(rentals, (key, value) => {
      // Gereksiz alanları çıkar
      if (key === 'description' || key === 'imageUrl') return undefined;
      return value;
    });

    try {
      localStorage.setItem(RENTAL_STORAGE_KEY, compressedData);
    } catch (storageError) {
      // Eğer hala kotayı aşıyorsa, eski kiralamaları temizle
      console.warn('Storage quota exceeded, cleaning up old rentals');
      const reducedRentals = rentals
        .filter(r => r.status === 'active' || new Date(r.timestamp).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000) // Son 30 günün kiralamaları
        .slice(-50); // Sadece son 50 kiralamayı tut
      
      localStorage.setItem(RENTAL_STORAGE_KEY, JSON.stringify(reducedRentals));
    }
  } catch (error) {
    console.error('Error saving rental:', error);
    throw new Error('Failed to save rental data');
  }
};

export const getRentals = async (address?: string): Promise<RentalHistory[]> => {
  try {
    const stored = localStorage.getItem(RENTAL_STORAGE_KEY);
    const rentals: RentalHistory[] = stored ? JSON.parse(stored) : [];

    if (address) {
      return rentals
        .filter(rental => rental.renterAddress === address)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    
    return rentals.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error('Error getting rentals:', error);
    return [];
  }
};

export const createRental = async (
  gpu: GPU,
  hours: number,
  price: number,
  publicKey: PublicKey,
  aiModel?: AIModel
): Promise<RentalHistory> => {
  try {
    // Solana connection'ı oluştur
    const connection = new Connection(SOLANA_RPC_URL);
    
    // Transaction'ı oluştur
    const transaction = new Transaction();
    
    // Recent blockhash'i al
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = publicKey;

    // Transfer instruction'ı ekle
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(PLATFORM_WALLET),
        lamports: Math.floor(price * LAMPORTS_PER_SOL)
      })
    );

    // Solflare kontrolü
    if (!window.solflare) {
      throw new Error('Solflare wallet not found');
    }

    try {
      // Transaction'ı imzala ve gönder
      const { signature } = await window.solflare.signAndSendTransaction(transaction);
      
      // Transaction'ın onaylanmasını bekle
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error('Transaction failed');
      }

      // Kiralama kaydını oluştur
      const rental: RentalHistory = {
        id: crypto.randomUUID(),
        gpu,
        hours,
        price,
        timestamp: new Date(),
        status: 'active',
        renterAddress: publicKey.toBase58(),
        transactionSignature: signature,
        aiModel,
        timer: {
          endTime: new Date(Date.now() + hours * 3600 * 1000),
          remainingTime: hours * 3600
        },
        usageStats: generateInitialUsageStats(),
        performanceMetrics: generateInitialPerformanceMetrics()
      };

      await saveRental(rental);
      return rental;
    } catch (txError) {
      console.error('Transaction error:', txError);
      throw new Error('Transaction failed');
    }
  } catch (error) {
    console.error('Error creating rental:', error);
    throw new Error('Failed to process rental payment');
  }
};

export const updateRentalStatus = async (rentalId: string, status: 'active' | 'completed' | 'expired') => {
  const rentals = await getRentals();
  const index = rentals.findIndex(r => r.id === rentalId);
  
  if (index !== -1) {
    rentals[index].status = status;
    localStorage.setItem(RENTAL_STORAGE_KEY, JSON.stringify(rentals));
  }
};

export const updateRentalMetrics = async (rentalId: string, updates: {
  usageStats?: UsageStats;
  performanceMetrics?: PerformanceMetrics;
}) => {
  const rentals = await getRentals();
  const index = rentals.findIndex(r => r.id === rentalId);
  
  if (index !== -1 && rentals[index]) {
    if (updates.usageStats) {
      rentals[index].usageStats = updates.usageStats;
    }
    if (updates.performanceMetrics) {
      rentals[index].performanceMetrics = updates.performanceMetrics;
    }
    localStorage.setItem(RENTAL_STORAGE_KEY, JSON.stringify(rentals));
  }
};

// Yardımcı fonksiyonlar
const generateInitialUsageStats = (): UsageStats => ({
  cpuUsage: Math.random() * 30 + 20,
  memoryUsage: Math.random() * 40 + 30,
  powerUsage: Math.random() * 100 + 150,
  temperature: Math.random() * 20 + 50,
  gpuUsage: Math.random() * 30 + 40
});

const generateInitialPerformanceMetrics = (): PerformanceMetrics => ({
  throughput: `${Math.floor(Math.random() * 1000 + 500)} req/s`,
  latency: `${Math.floor(Math.random() * 50 + 10)}ms`,
  successRate: Math.random() * 10 + 90
});

// Solana transaction geçmişini kontrol et
export const syncTransactionHistory = async (connection: Connection, publicKey: PublicKey) => {
  try {
    const signatures = await connection.getSignaturesForAddress(publicKey);
    const transactions = await connection.getParsedTransactions(signatures.map(sig => sig.signature));
    
    const rentalTransactions = transactions
      .filter(tx => tx?.meta?.logMessages?.some(msg => msg?.includes('GPU_RENTAL')))
      .map(tx => {
        // Null kontrolü ekleyelim
        const postBalance = tx?.meta?.postBalances?.[0] ?? 0;
        const preBalance = tx?.meta?.preBalances?.[0] ?? 0;
        const rentAmount = postBalance - preBalance;
        const blockTime = tx?.blockTime ?? Math.floor(Date.now() / 1000);

        return {
          timestamp: new Date(blockTime * 1000),
          amount: rentAmount / 1e9,
          signature: tx?.transaction.signatures[0] ?? ''
        };
      })
      .filter(tx => tx.signature && tx.amount > 0); // Geçersiz transaction'ları filtrele

    // Mevcut rental history ile senkronize et
    const existingRentals = await getRentals(publicKey.toBase58());
    const syncedSignatures = new Set(existingRentals.map(r => r.transactionSignature));

    for (const tx of rentalTransactions) {
      if (!syncedSignatures.has(tx.signature)) {
        // Yeni transaction bulundu, rental history'ye ekle
        const rental: RentalHistory = {
          id: crypto.randomUUID(),
          timestamp: tx.timestamp,
          price: tx.amount,
          status: 'completed',
          renterAddress: publicKey.toBase58(),
          transactionSignature: tx.signature,
          hours: Math.ceil(tx.amount * 10),
          gpu: {
            id: 'unknown',
            name: 'Unknown GPU',
            description: 'GPU details not available', // description eklendi
            vram: 0,
            performance: 0,
            pricePerHour: tx.amount / Math.ceil(tx.amount * 10),
            manufacturer: 'Unknown',
            model: 'Unknown',
            imageUrl: ''
          }
        };
        await saveRental(rental);
      }
    }
  } catch (error) {
    console.error('Error syncing transaction history:', error);
  }
}; 