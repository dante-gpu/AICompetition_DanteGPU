import React from 'react';
import { RentalHistory } from '../types/rental';
import { RentalCard } from './rental/RentalCard';
import { RentalStats } from './rental/RentalStats';
import { ActiveRental } from './rental/ActiveRental';

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
  const completedRentals = rentals.filter(rental => rental.status !== 'active');

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <RentalStats totalSpent={totalSpent} activeCount={activeRentals.length} />
      
      {activeRentals.length > 0 && (
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-300 mb-4">
            Active Rentals
          </h3>
          <div className="space-y-4">
            {activeRentals.map(rental => (
              <ActiveRental
                key={rental.id}
                rental={rental}
                onExpire={onExpire}
              />
            ))}
          </div>
        </div>
      )}
      
      <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-300 mb-4">
          Rental History
        </h3>
        <div className="space-y-4">
          {completedRentals.map((rental) => (
            <RentalCard key={rental.id} rental={rental} />
          ))}
          {completedRentals.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No rental history yet</p>
              <p className="text-sm text-gray-600">
                Start by renting a GPU from the marketplace!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};