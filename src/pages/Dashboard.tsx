import React from 'react';
import { RentalHistory } from '../types/rental';
import { ActiveRental } from '../components/rental/ActiveRental';
import { UsageChart } from '../components/dashboard/UsageChart';
import { PerformanceMetrics } from '../components/dashboard/PerformanceMetrics';
import { AIModelUsage } from '../components/dashboard/AIModelUsage';
import { formatSOL } from '../utils/format';
import { Activity, Cpu, Clock, Zap, ChevronRight, TrendingUp, Server } from 'lucide-react';

interface DashboardProps {
  rentals: RentalHistory[];
  totalSpent: number;
  onExpire: (rentalId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  rentals,
  totalSpent,
  onExpire
}) => {
  const activeRentals = rentals.filter(rental => rental.status === 'active');
  const completedRentals = rentals.filter(rental => rental.status === 'completed');
  const expiredRentals = rentals.filter(rental => rental.status === 'expired');

  const totalHours = rentals.reduce((sum, rental) => sum + rental.hours, 0);
  const avgPricePerHour = totalSpent / totalHours || 0;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-dark-800 to-dark-700 p-8 border border-dark-700">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Welcome to Your Dashboard
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Monitor your GPU rentals, track AI model performance, and manage your resources all in one place.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <Server className="w-full h-full text-glow-400" />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-glow-400/30 transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-glow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-glow-400/10 group-hover:bg-glow-400/20 transition-colors duration-300">
                <Activity className="w-5 h-5 text-glow-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">Total Spent</h3>
                <p className="text-2xl font-bold gradient-text">
                  {formatSOL(totalSpent)} SOL
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-glow-400">
              <TrendingUp size={12} />
              <span>+2.5% from last week</span>
            </div>
            <div className="mt-4 pt-4 border-t border-dark-700">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Last 24h</span>
                <span className="text-glow-400">{formatSOL(totalSpent * 0.15)} SOL</span>
              </div>
            </div>
          </div>
        </div>

        <div className="group bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-glow-400/30 transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-glow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-glow-400/10 group-hover:bg-glow-400/20 transition-colors duration-300">
                <Cpu className="w-5 h-5 text-glow-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">Active Rentals</h3>
                <p className="text-2xl font-bold gradient-text">
                  {activeRentals.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-glow-400">
              <ChevronRight size={12} />
              <span>{activeRentals.length} GPUs in use</span>
            </div>
            <div className="mt-4 pt-4 border-t border-dark-700">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400 block">Total VRAM</span>
                  <span className="text-glow-400">
                    {activeRentals.reduce((sum, rental) => sum + rental.gpu.vram, 0)}GB
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Avg. Performance</span>
                  <span className="text-glow-400">
                    {Math.round(activeRentals.reduce((sum, rental) => sum + rental.gpu.performance, 0) / activeRentals.length || 0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-glow-400/30 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-glow-400/10">
              <Clock className="w-5 h-5 text-glow-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400">Total Hours</h3>
              <p className="text-2xl font-bold gradient-text">
                {totalHours}h
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-glow-400">
            <ChevronRight size={12} />
            <span>Across all rentals</span>
          </div>
        </div>

        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-glow-400/30 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-glow-400/10">
              <Zap className="w-5 h-5 text-glow-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400">Avg Price/Hour</h3>
              <p className="text-2xl font-bold gradient-text">
                {formatSOL(avgPricePerHour)} SOL
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-glow-400">
            <TrendingUp size={12} />
            <span>Efficient usage</span>
          </div>
        </div>
      </div>

      {/* Active Rentals */}
      {activeRentals.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold gradient-text">Active Rentals</h2>
            <span className="text-sm text-gray-400">
              {activeRentals.length} active {activeRentals.length === 1 ? 'rental' : 'rentals'}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeRentals.map(rental => (
              <div key={rental.id} className="bg-dark-800 rounded-xl border border-dark-700 p-6 hover:border-glow-400/30 transition-all duration-300">
                <ActiveRental
                  rental={rental}
                  onExpire={onExpire}
                />
                {rental.usageStats && (
                  <div className="mt-6 pt-6 border-t border-dark-700">
                    <h4 className="text-sm font-medium text-gray-400 mb-4">Resource Usage</h4>
                    <UsageChart rentals={rentals} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Model Usage & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-800 rounded-xl border border-dark-700 p-6 hover:border-glow-400/30 transition-all duration-300">
          <h2 className="text-xl font-bold gradient-text mb-6">AI Model Usage</h2>
          <AIModelUsage rentals={rentals} />
        </div>

        <div className="bg-dark-800 rounded-xl border border-dark-700 p-6 hover:border-glow-400/30 transition-all duration-300">
          <h2 className="text-xl font-bold gradient-text mb-6">Performance Metrics</h2>
          <PerformanceMetrics rentals={rentals} />
        </div>
      </div>

      {/* Rental History */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 p-6 hover:border-glow-400/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold gradient-text">Rental History</h2>
            <p className="text-sm text-gray-400 mt-1">
              Past {completedRentals.length + expiredRentals.length} rentals
            </p>
          </div>
          <div className="flex gap-2">
            <select className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-1 text-sm text-gray-300 focus:outline-none focus:border-glow-400/50">
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
            </select>
            <select className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-1 text-sm text-gray-300 focus:outline-none focus:border-glow-400/50">
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {[...completedRentals, ...expiredRentals].map((rental) => (
            <div 
              key={rental.id} 
              className="group bg-dark-700/50 rounded-lg p-4 hover:bg-dark-700 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-dark-600 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-glow-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white group-hover:text-glow-400 transition-colors">
                      {rental.gpu.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {rental.aiModel?.name || 'Generic Workload'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium gradient-text">
                    {formatSOL(rental.price)} SOL
                  </p>
                  <p className="text-xs text-gray-400">
                    {rental.hours}h @ {formatSOL(rental.price / rental.hours)} SOL/h
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-dark-600 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400 block">Status</span>
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs inline-block mt-1
                    ${rental.status === 'completed' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                    }
                  `}>
                    {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Started</span>
                  <span className="text-white">
                    {new Date(rental.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Performance</span>
                  <span className="text-white">{rental.gpu.performance}%</span>
                </div>
              </div>
            </div>
          ))}

          {completedRentals.length === 0 && expiredRentals.length === 0 && (
            <div className="text-center py-12 bg-dark-700/50 rounded-lg">
              <Server className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">No rental history yet</p>
              <p className="text-sm text-gray-500">
                Start by renting a GPU from the marketplace!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 