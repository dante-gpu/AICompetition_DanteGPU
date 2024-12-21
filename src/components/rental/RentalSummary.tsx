import React from 'react';
import { RentalHistory } from '../../types/rental';
import { formatSOL } from '../../utils/format';

interface RentalSummaryProps {
  rental: RentalHistory;
}

export const RentalSummary: React.FC<RentalSummaryProps> = ({ rental }) => {
  const statusColors = {
    active: 'text-yellow-600',
    expired: 'text-red-600',
    completed: 'text-green-600'
  } as const;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold">{rental.gpu.name}</h4>
        <span className={`text-sm font-medium ${statusColors[rental.status]}`}>
          {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
        </span>
      </div>
      
      <div className="space-y-1 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Duration:</span>
          <span>{rental.hours} hours</span>
        </div>
        <div className="flex justify-between">
          <span>Rate:</span>
          <span>{formatSOL(rental.gpu.pricePerHour)} SOL/hour</span>
        </div>
        <div className="flex justify-between font-medium text-gray-900">
          <span>Total:</span>
          <span>{formatSOL(rental.price)} SOL</span>
        </div>
      </div>
    </div>
  );
};