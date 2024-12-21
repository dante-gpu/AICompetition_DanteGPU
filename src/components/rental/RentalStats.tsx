import React from 'react';
import { formatSOL } from '../../utils/format';
import { Cpu, Clock } from 'lucide-react';

interface RentalStatsProps {
  totalSpent: number;
  activeCount: number;
}

export const RentalStats: React.FC<RentalStatsProps> = ({ totalSpent, activeCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
        <div className="flex items-center gap-3 mb-2">
          <Cpu className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-200">Total Spent</h3>
        </div>
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-300">
          {formatSOL(totalSpent)} SOL
        </p>
      </div>

      <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-200">Active Rentals</h3>
        </div>
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-300">
          {activeCount}
        </p>
      </div>
    </div>
  );
};