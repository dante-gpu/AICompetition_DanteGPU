import React from 'react';
import { RentalHistory } from '../../types/rental';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface AIModelUsageProps {
  rentals: RentalHistory[];
}

export const AIModelUsage: React.FC<AIModelUsageProps> = ({ rentals }) => {
  const modelUsage = rentals.reduce((acc, rental) => {
    if (rental.aiModel) {
      const modelName = rental.aiModel.name;
      acc[modelName] = (acc[modelName] || 0) + rental.hours;
    }
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(modelUsage).map(([name, hours]) => ({
    name,
    value: hours,
  }));

  const COLORS = ['#4FD1C5', '#8B5CF6', '#F87171', '#10B981'];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '0.5rem',
              color: '#E5E7EB',
            }}
            formatter={(value: number) => [`${value}h`, 'Usage']}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div>
              <p className="text-sm text-white">{entry.name}</p>
              <p className="text-xs text-gray-400">{entry.value}h</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 