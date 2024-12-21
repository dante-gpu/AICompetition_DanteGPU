export interface GPU {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  performance: number;
  vram: number;
  pricePerHour: number;
  manufacturer: string;
  model: string;
  createdAt?: string;
  creator?: {
    address: string;
    avatarUrl?: string;
  };
  status?: 'available' | 'rented';
  rentedUntil?: Date;
  rentedBy?: string;
}