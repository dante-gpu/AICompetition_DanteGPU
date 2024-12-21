/// <reference types="vite/client" />

import { Transaction, PublicKey } from '@solana/web3.js';

declare global {
  interface Window {
    solflare?: {
      isConnected: boolean;
      connect: () => Promise<{ publicKey: PublicKey }>;
      disconnect: () => Promise<void>;
      signAndSendTransaction: (transaction: Transaction) => Promise<{ signature: string }>;
      publicKey?: PublicKey;
      on: (event: string, handler: () => void) => void;
      off: (event: string, handler: () => void) => void;
    };
    solana?: {
      publicKey?: {
        toBase58: () => string;
      };
    };
  }
}
