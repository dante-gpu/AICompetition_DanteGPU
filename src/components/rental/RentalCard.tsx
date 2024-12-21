import React, { useState } from 'react';
import { RentalHistory } from '../../types/rental';
import { formatDate, formatSOL } from '../../utils/format';
import { RentalConfirmModal } from './RentalConfirmModal';

interface RentalCardProps {
  rental: RentalHistory;
}

export const RentalCard: React.FC<RentalCardProps> = ({ rental }) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  const handleRentClick = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmRental = async () => {
    // Kiralama işlemleri
    setIsConfirmModalOpen(false);
  };

  // Timestamp'i güvenli bir şekilde Date nesnesine dönüştür
  const timestamp = rental.timestamp instanceof Date 
    ? rental.timestamp 
    : new Date(rental.timestamp);

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm rounded-xl border border-dark-700 p-6 space-y-4">
      <div className="flex items-center gap-4">
        <img 
          src={rental.gpu.imageUrl} 
          alt={rental.gpu.name} 
          className="w-16 h-16 object-cover rounded-lg"
        />
        <div>
          <h3 className="text-xl font-bold text-white">{rental.gpu.name}</h3>
          <p className="text-gray-400">{rental.gpu.description}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <p className="text-sm text-gray-400">
            {rental.hours} saat @ {formatSOL(rental.gpu.pricePerHour)} SOL/saat
          </p>
          <p className="text-sm text-gray-500">
            {formatDate(timestamp)}
          </p>
          <span className={`text-sm ${
            rental.status === 'active' ? 'text-yellow-600' :
            rental.status === 'expired' ? 'text-red-600' :
            'text-gray-600'
          }`}>
            {rental.status === 'active' ? 'Aktif' :
             rental.status === 'expired' ? 'Süresi Dolmuş' :
             'Kullanılabilir'}
          </span>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-glow-400">
            {formatSOL(rental.price)} SOL
          </p>
          <button
            onClick={handleRentClick}
            className="mt-2 px-4 py-2 bg-gradient-to-r from-glow-400 to-glow-600 hover:from-glow-500 hover:to-glow-700 text-white rounded-lg transition-all duration-200"
          >
            Kirala
          </button>
        </div>
      </div>

      <RentalConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmRental}
        gpuDetails={{
          name: rental.gpu.name,
          price: rental.gpu.pricePerHour,
          duration: rental.hours
        }}
      />
    </div>
  );
};