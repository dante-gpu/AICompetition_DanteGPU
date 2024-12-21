import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100 arası
  color?: string;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'glow-400',
  height = 4
}) => {
  return (
    <div className={`w-full bg-dark-700 rounded-full h-${height}`}>
      <div
        className={`bg-${color} h-full rounded-full transition-all duration-1000 ease-linear`}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}; 