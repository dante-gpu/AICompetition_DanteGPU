import React, { useState } from 'react';
import { GPU } from '../types/gpu';
import { Button } from './ui/Button';
import { calculatePrice } from '../utils/solana';
import { RentalConfirmModal } from './rental/RentalConfirmModal';
import { DurationPicker } from './rental/DurationPicker';
import { formatSOL } from '../utils/format';
import { Clock, Lock, MoreVertical, Edit, Trash2 } from 'lucide-react';

interface GPUCardProps {
  gpu: GPU;
  onRent: (gpu: GPU, hours: number) => Promise<void>;
  disabled?: boolean;
  userBalance?: number | null;
  walletAddress?: string;
  isAdmin?: boolean;
  onEdit?: (gpu: GPU) => void;
  onDelete?: (gpu: GPU) => void;
}

export const GPUCard: React.FC<GPUCardProps> = ({
  gpu,
  onRent,
  disabled,
  userBalance,
  walletAddress,
  isAdmin,
  onEdit,
  onDelete
}) => {
  const [hours, setHours] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const totalPrice = calculatePrice(gpu.pricePerHour, hours);

  const handleRent = async () => {
    if (!userBalance || totalPrice > userBalance) {
      alert('Insufficient balance!');
      return;
    }

    if (!window.solflare?.isConnected) {
      try {
        await window.solflare?.connect();
      } catch (error) {
        console.error('Failed to connect Solflare:', error);
        alert('Please connect your Solflare wallet first!');
        return;
      }
    }
    
    setShowConfirmModal(true);
  };

  const confirmRental = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    try {
      await onRent(gpu, hours);
    } finally {
      setIsLoading(false);
    }
  };

  const isRented = gpu.status === 'rented';
  const isMyRental = gpu.rentedBy === walletAddress;

  return (
    <>
      <div className={`
        bg-dark-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 
        hover:shadow-glow-500/20 hover:scale-[1.02] border border-dark-700
        ${isRented && !isMyRental ? 'opacity-75' : ''}
      `}>
        <div className="relative">
          <img
            src={gpu.imageUrl}
            alt={gpu.name}
            className={`
              w-full h-48 object-cover
              ${isRented && !isMyRental ? 'filter grayscale' : ''}
            `}
          />
          
          {/* Status Badge */}
          {isRented && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="bg-dark-800/90 px-4 py-2 rounded-lg border border-dark-700 flex items-center gap-3">
                <Lock className="text-red-400" size={20} />
                <div className="text-left">
                  <p className="text-red-400 font-medium">Currently Rented</p>
                  {gpu.rentedUntil && (
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={12} />
                      Available in {formatTimeLeft(gpu.rentedUntil)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Performance Score */}
          <div className="absolute top-2 right-2 bg-gradient-to-r from-glow-400 to-glow-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            {gpu.performance} Performance Score
          </div>

          {/* Creator Info */}
          {gpu.creator && (
            <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
              <img
                src={gpu.creator.avatarUrl}
                alt="Creator"
                className="w-6 h-6 rounded-full border border-glow-400/30"
              />
              <span className="text-xs text-white font-medium">
                {gpu.creator.address.slice(0, 4)}...{gpu.creator.address.slice(-4)}
              </span>
            </div>
          )}

          {isAdmin && (
            <div className="absolute top-2 right-2 z-10">
              <button
                onClick={() => setShowAdminMenu(!showAdminMenu)}
                className="p-1 rounded-lg bg-dark-800/90 hover:bg-dark-700 transition-colors"
              >
                <MoreVertical size={20} className="text-gray-400" />
              </button>

              {showAdminMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-dark-800 rounded-lg shadow-lg border border-dark-700 overflow-hidden">
                  <button
                    onClick={() => {
                      setShowAdminMenu(false);
                      onEdit?.(gpu);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-dark-700 flex items-center gap-2 text-gray-300"
                  >
                    <Edit size={16} />
                    <span>Edit GPU</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowAdminMenu(false);
                      onDelete?.(gpu);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-dark-700 flex items-center gap-2 text-red-400"
                  >
                    <Trash2 size={16} />
                    <span>Delete GPU</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">{gpu.name}</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>VRAM</span>
                <span className="font-medium text-glow-400">{gpu.vram}GB</span>
              </div>
              <div className="flex justify-between text-glow-400">
                <span>Price per hour</span>
                <span className="font-semibold text-glow-300">{formatSOL(gpu.pricePerHour)} SOL</span>
              </div>
            </div>
          </div>
          
          <DurationPicker
            hours={hours}
            onChange={setHours}
          />
          
          <div className="flex items-center justify-between pt-4 border-t border-dark-700">
            <div>
              <span className="text-sm text-gray-400">Total Price</span>
              <p className="text-lg font-bold gradient-text">
                {formatSOL(totalPrice)} SOL
              </p>
            </div>
            <Button
              onClick={handleRent}
              disabled={disabled || (isRented && !isMyRental)}
              loading={isLoading}
              variant={isRented && !isMyRental ? "secondary" : "primary"}
            >
              {isRented ? (isMyRental ? "Extend Rental" : "Rented") : "Rent Now"}
            </Button>
          </div>
        </div>
      </div>

      <RentalConfirmModal
        gpu={gpu}
        hours={hours}
        totalPrice={totalPrice}
        onConfirm={confirmRental}
        onCancel={() => setShowConfirmModal(false)}
        isOpen={showConfirmModal}
      />
    </>
  );
};

// Yardımcı fonksiyon
const formatTimeLeft = (rentedUntil: Date) => {
  const now = new Date();
  const diff = rentedUntil.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};