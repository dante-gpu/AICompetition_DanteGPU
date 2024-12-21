export type WalletProvider = 'solflare';

export interface WalletAdapter {
  connected: boolean;
  publicKey: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signAndSendTransaction: (transaction: any) => Promise<{ signature: string }>;
}

export interface WalletContextState {
  wallet: WalletAdapter | null;
  connected: boolean;
  publicKey: string | null;
  connecting: boolean;
  disconnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}