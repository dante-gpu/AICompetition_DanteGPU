import dotenv from 'dotenv';
import { Connection } from '@solana/web3.js';

dotenv.config();

if (!process.env.HUGGING_FACE_TOKEN) {
  console.error('HUGGING_FACE_TOKEN is not set in .env file');
  process.exit(1);
}

export const config = {
  port: process.env.PORT || 5001,
  huggingFaceToken: process.env.HUGGING_FACE_TOKEN,
  solana: {
    network: 'devnet',
    rpcUrl: 'https://api.devnet.solana.com',
    minTokensRequired: 0.001,
  },
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5174'
  }
};

export const solanaConnection = new Connection(config.solana.rpcUrl, 'confirmed'); 