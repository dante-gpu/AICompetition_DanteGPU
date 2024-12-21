import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { config } from '../config';

export class TokenService {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(config.solana.rpcUrl, 'confirmed');
  }

  async checkBalance(walletAddress: string): Promise<boolean> {
    try {
      console.log('Checking balance for:', walletAddress);
      const publicKey = new PublicKey(walletAddress);
      const balance = await this.connection.getBalance(publicKey);
      const solBalance = balance / LAMPORTS_PER_SOL;
      
      console.log('Balance:', solBalance, 'SOL');
      return solBalance >= config.solana.minTokensRequired;
    } catch (error) {
      console.error('Error checking balance:', error);
      return false;
    }
  }
}

export const tokenService = new TokenService(); 