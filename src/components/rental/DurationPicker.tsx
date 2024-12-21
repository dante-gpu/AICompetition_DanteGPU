import React from 'react';
import { Clock, Plus, Minus } from 'lucide-react';

interface DurationPickerProps {
  hours: number;
  onChange: (hours: number) => void;
  maxHours?: number;
  minHours?: number;
}

export const DurationPicker: React.FC<DurationPickerProps> = ({
  hours,
  onChange,
  maxHours = 168, // 1 week
  minHours = 1,
}) => {
  return (
    <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
      <div className="flex items-center justify-between">
        <span className="text-glow-400">Duration</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onChange(Math.max(1, hours - 1))}
            className="p-1 rounded hover:bg-dark-700 text-glow-400"
          >
            <Minus size={16} />
          </button>
          <span className="w-16 text-center font-medium text-white">
            {hours} {hours === 1 ? 'hour' : 'hours'}
          </span>
          <button
            onClick={() => onChange(hours + 1)}
            className="p-1 rounded hover:bg-dark-700 text-glow-400"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};