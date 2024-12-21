// import { RentalHistory } from '../types/rental';
// import { gpus } from './gpus';
// import { aiModels } from './aiModels';

// export const mockRentals: RentalHistory[] = [
//   {
//     id: '1',
//     gpu: gpus[0],
//     hours: 24,
//     price: 1.2,
//     timestamp: new Date('2024-03-15T10:00:00'),
//     status: 'active',
//     timer: {
//       endTime: new Date('2024-03-16T10:00:00'),
//       remainingTime: 86400
//     },
//     aiModel: aiModels[0],
//     usageStats: {
//       cpuUsage: 85,
//       memoryUsage: 92,
//       powerUsage: 280,
//       temperature: 75
//     }
//   },
//   {
//     id: '2',
//     gpu: gpus[1],
//     hours: 12,
//     price: 0.6,
//     timestamp: new Date('2024-03-14T15:00:00'),
//     status: 'completed',
//     aiModel: aiModels[1],
//     performanceMetrics: {
//       throughput: '125 tokens/s',
//       latency: '45ms',
//       successRate: 99.8
//     }
//   },
//   {
//     id: '3',
//     gpu: gpus[2],
//     hours: 48,
//     price: 2.4,
//     timestamp: new Date('2024-03-13T08:00:00'),
//     status: 'expired',
//     aiModel: aiModels[2],
//     performanceMetrics: {
//       throughput: '60 FPS',
//       latency: '16ms',
//       successRate: 99.5
//     }
//   }
// ]; 