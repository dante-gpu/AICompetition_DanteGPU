import { RentalHistory } from '../types/rental';
// import { formatSOL } from '/Users/dante/Desktop/reacthreejs/dgpu.fun/src/utils/format.ts';

export interface ActivityStats {
  date: string;
  activities: number;
  spent: number;
  earned: number;
  performance: number;
  usage: {
    cpu: number;
    memory: number;
    gpu: number;
  };
}

export const getActivityStats = (rentals: RentalHistory[], days: number = 7): ActivityStats[] => {
  const stats: ActivityStats[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));

    const dayRentals = rentals.filter(rental => {
      const rentalDate = new Date(rental.timestamp);
      return rentalDate >= dayStart && rentalDate <= dayEnd;
    });

    stats.push({
      date: date.toISOString(),
      activities: dayRentals.length,
      spent: dayRentals.reduce((sum, rental) => sum + rental.price, 0),
      earned: dayRentals.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.price, 0),
      performance: dayRentals.reduce((sum, r) => sum + (r.performanceMetrics?.successRate || 0), 0) / (dayRentals.length || 1),
      usage: {
        cpu: dayRentals.reduce((sum, r) => sum + (r.usageStats?.cpuUsage || 0), 0) / (dayRentals.length || 1),
        memory: dayRentals.reduce((sum, r) => sum + (r.usageStats?.memoryUsage || 0), 0) / (dayRentals.length || 1),
        gpu: dayRentals.reduce((sum, r) => sum + (r.usageStats?.gpuUsage || 0), 0) / (dayRentals.length || 1),
      }
    });
  }

  return stats;
}; 