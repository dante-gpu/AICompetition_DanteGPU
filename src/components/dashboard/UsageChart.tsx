import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RentalHistory } from '../../types/rental';

interface UsageChartProps {
  rentals: RentalHistory[];
}

export const UsageChart: React.FC<UsageChartProps> = ({ rentals }) => {
  const [liveData, setLiveData] = useState<any[]>([]);

  useEffect(() => {
    // Son 10 dakikanın verilerini oluştur
    const generateInitialData = () => {
      const data = [];
      for (let i = 9; i >= 0; i--) {
        const time = new Date(Date.now() - i * 60 * 1000);
        data.push({
          time: time.toLocaleTimeString(),
          cpuUsage: Math.floor(Math.random() * 30 + 60),
          gpuUsage: Math.floor(Math.random() * 20 + 70),
          memoryUsage: Math.floor(Math.random() * 25 + 65),
          temperature: Math.floor(Math.random() * 15 + 70)
        });
      }
      return data;
    };

    setLiveData(generateInitialData());

    // Her 3 saniyede bir verileri güncelle
    const interval = setInterval(() => {
      setLiveData(prevData => {
        const newData = [...prevData.slice(1)];
        newData.push({
          time: new Date().toLocaleTimeString(),
          cpuUsage: Math.floor(Math.random() * 30 + 60),
          gpuUsage: Math.floor(Math.random() * 20 + 70),
          memoryUsage: Math.floor(Math.random() * 25 + 65),
          temperature: Math.floor(Math.random() * 15 + 70)
        });
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [rentals]);

  const gradients = {
    cpu: ['#4FD1C5', '#2C7A7B'],
    gpu: ['#9F7AEA', '#553C9A'],
    memory: ['#F6AD55', '#C05621'],
    temp: ['#FC8181', '#9B2C2C']
  };

  return (
    <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
      <h2 className="text-lg font-medium text-white mb-6">Active Rentals Performance</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={liveData}>
            <defs>
              {Object.entries(gradients).map(([key, [start, end]]) => (
                <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={start} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={end} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
            <XAxis 
              dataKey="time" 
              stroke="#718096"
              tick={{ fill: '#718096' }}
            />
            <YAxis 
              stroke="#718096"
              tick={{ fill: '#718096' }}
              domain={[0, 100]}
            />
            
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A202C',
                border: '1px solid #2D3748',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
              }}
              itemStyle={{ color: '#E2E8F0' }}
              labelStyle={{ color: '#A0AEC0' }}
            />

            <Area
              type="monotone"
              dataKey="cpuUsage"
              name="CPU Usage"
              stroke="#4FD1C5"
              fill="url(#gradient-cpu)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="gpuUsage"
              name="GPU Usage"
              stroke="#9F7AEA"
              fill="url(#gradient-gpu)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="memoryUsage"
              name="Memory"
              stroke="#F6AD55"
              fill="url(#gradient-memory)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="temperature"
              name="Temperature"
              stroke="#FC8181"
              fill="url(#gradient-temp)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6">
        {Object.entries({
          'CPU Usage': liveData[liveData.length - 1]?.cpuUsage || 0,
          'GPU Usage': liveData[liveData.length - 1]?.gpuUsage || 0,
          'Memory': liveData[liveData.length - 1]?.memoryUsage || 0,
          'Temperature': liveData[liveData.length - 1]?.temperature || 0
        }).map(([label, value], index) => (
          <div key={label} className="bg-dark-700 rounded-lg p-4">
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-2xl font-bold mt-1" style={{ 
              color: Object.values(gradients)[index][0] 
            }}>
              {value}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}; 