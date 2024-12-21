import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

const RECIPIENT_WALLET = new PublicKey('B99ZeAHD4ZxGfSwbQRqbpQPpAigzwDCyx4ShHTcYCAtS');
const NETWORK = 'devnet';

// Devnet bağlantısı
export const connection = new Connection(
  `https://api.${NETWORK}.solana.com`,
  {
    commitment: 'confirmed',
    wsEndpoint: `wss://api.${NETWORK}.solana.com/`
  }
);

export const calculatePrice = (pricePerHour: number, hours: number): number => {
  return Math.max(0.01, pricePerHour * hours);
};

export const createPaymentTransaction = async (
  fromPubkey: PublicKey,
  amount: number
): Promise<Transaction> => {
  try {
    const transaction = new Transaction();
    
    const transferInstruction = SystemProgram.transfer({
      fromPubkey,
      toPubkey: RECIPIENT_WALLET,
      lamports: Math.floor(amount * LAMPORTS_PER_SOL),
    });

    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    
    transaction.add(transferInstruction);
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    return transaction;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

export const getBalance = async (publicKey: PublicKey): Promise<number> => {
  try {
    const balance = await connection.getBalance(publicKey, 'confirmed');
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error getting balance:', error);
    return 0; // Hata durumunda 0 dön
  }
};

// Devnet'te test SOL almak için
export const requestAirdrop = async (publicKey: PublicKey): Promise<string> => {
  try {
    const signature = await connection.requestAirdrop(
      publicKey,
      1 * LAMPORTS_PER_SOL // 1 SOL
    );
    await connection.confirmTransaction(signature);
    return signature;
  } catch (error) {
    console.error('Error requesting airdrop:', error);
    throw error;
  }
};