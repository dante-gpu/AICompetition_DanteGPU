import React, { useState, useEffect } from 'react';
import { RentalHistory } from '../../types/rental';
import { formatSOL } from '../../utils/format';
import { Clock, Cpu } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';

interface ActiveRentalProps {
  rental: RentalHistory;
  onExpire: (rentalId: string) => void;
}

export const ActiveRental: React.FC<ActiveRentalProps> = ({ rental, onExpire }) => {
  const [remainingSeconds, setRemainingSeconds] = useState(rental.timer?.remainingTime || 0);
  const totalSeconds = rental.hours * 3600;
  const progress = (remainingSeconds / totalSeconds) * 100;

  useEffect(() => {
    if (!rental.timer) return;

    const timer = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          onExpire(rental.id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [rental.id, rental.timer, onExpire]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">{rental.gpu.name}</h3>
          {rental.aiModel && (
            <p className="text-sm text-gray-400">
              Running {rental.aiModel.name}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Price</p>
          <p className="text-lg font-bold gradient-text">
            {formatSOL(rental.price)} SOL
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-gray-400">
          <Clock size={16} />
          <span className="text-sm">Duration: {rental.hours}h</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Cpu size={16} />
          <span className="text-sm">VRAM: {rental.gpu.vram}GB</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Time Remaining</span>
          <span className="text-sm font-mono text-glow-400">
            {formatTime(remainingSeconds)}
          </span>
        </div>
        <ProgressBar progress={progress} />
      </div>

      {rental.usageStats && (
        <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-dark-700 rounded-lg">
          <div>
            <p className="text-sm text-gray-400">CPU Usage</p>
            <p className="text-lg font-semibold text-white">
              {rental.usageStats.cpuUsage}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Memory Usage</p>
            <p className="text-lg font-semibold text-white">
              {rental.usageStats.memoryUsage}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Power Usage</p>
            <p className="text-lg font-semibold text-white">
              {rental.usageStats.powerUsage}W
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Temperature</p>
            <p className="text-lg font-semibold text-white">
              {rental.usageStats.temperature}°C
            </p>
          </div>
        </div>
      )}
    </div>
  );
};