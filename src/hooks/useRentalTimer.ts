import { useState, useEffect } from 'react';
import { RentalHistory } from '../types/rental';

export const useRentalTimer = (rental: RentalHistory) => {
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (rental.status !== 'active') return;

    const endTime = new Date(rental.timestamp.getTime() + rental.hours * 60 * 60 * 1000);
    const calculateRemainingTime = () => {
      const now = new Date();
      const remaining = Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / 1000));
      setRemainingTime(remaining);
      
      if (remaining === 0 && !isExpired) {
        setIsExpired(true);
      }
    };

    calculateRemainingTime();
    const interval = setInterval(calculateRemainingTime, 1000);

    return () => clearInterval(interval);
  }, [rental]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    remainingTime,
    formattedTime: formatTime(remainingTime),
    isExpired
  };
};