import React from 'react';
import { RentalHistory } from '../../types/rental';
import { Zap, Clock, CheckCircle } from 'lucide-react';

interface PerformanceMetricsProps {
  rentals: RentalHistory[];
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ rentals }) => {
  const activeRentals = rentals.filter(r => r.status === 'active' && r.performanceMetrics);

  return (
    <div className="space-y-4">
      {activeRentals.map(rental => (
        <div key={rental.id} className="bg-dark-700 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-sm font-medium text-white">{rental.aiModel?.name}</h3>
            <span className="px-2 py-0.5 text-xs rounded-full bg-glow-500/20 text-glow-400">
              Active
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-glow-400" />
              <div>
                <p className="text-xs text-gray-400">Throughput</p>
                <p className="text-sm font-medium text-white">
                  {rental.performanceMetrics?.throughput}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-glow-400" />
              <div>
                <p className="text-xs text-gray-400">Latency</p>
                <p className="text-sm font-medium text-white">
                  {rental.performanceMetrics?.latency}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-glow-400" />
              <div>
                <p className="text-xs text-gray-400">Success Rate</p>
                <p className="text-sm font-medium text-white">
                  {rental.performanceMetrics?.successRate}%
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {activeRentals.length === 0 && (
        <div className="text-center py-4 text-gray-400">
          No active rentals with performance metrics
        </div>
      )}
    </div>
  );
}; 