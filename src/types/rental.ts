import { GPU } from './gpu';
import { AIModel } from './ai';

export interface RentalTimer {
  endTime: Date;
  remainingTime: number; // in seconds
}

export interface UsageStats {
  cpuUsage: number;
  memoryUsage: number;
  powerUsage: number;
  temperature: number;
  gpuUsage: number;
}

export interface PerformanceMetrics {
  throughput: string;
  latency: string;
  successRate: number;
}

export interface RentalHistory {
  id: string;
  gpu: GPU;
  hours: number;
  price: number;
  timestamp: Date;
  status: 'active' | 'completed' | 'expired';
  renterAddress: string;
  transactionSignature?: string;
  timer?: RentalTimer;
  aiModel?: AIModel;
  usageStats?: UsageStats;
  performanceMetrics?: PerformanceMetrics;
}