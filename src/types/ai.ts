import { GPU } from './gpu';

export interface AIModel {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  performance: number;
  vram: number;
  pricePerHour: number;
  type: 'training' | 'inference';
  features: string[];
  gpu: GPU;
}