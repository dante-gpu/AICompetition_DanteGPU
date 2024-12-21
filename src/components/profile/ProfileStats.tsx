import React, { useEffect, useState } from 'react';
import { UserProfile } from '../../types/user';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { formatSOL } from '../../utils/format';
import { Cpu, HardDrive, Activity, DollarSign, TrendingUp } from 'lucide-react';
import { useRentals } from '../../hooks/useRentals';
import { RentalHistory } from '../../types/rental';
import { PublicKey } from '@solana/web3.js';

interface ProfileStatsProps {
  profile: UserProfile;
}

interface ActivityData {
  time: string;
  earnings: number;
  spending: number;
  activeRentals: number;
  performance: number;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ profile }) => {
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const publicKey = window.solana?.publicKey ? new PublicKey(window.solana.publicKey) : undefined;
  const { rentals } = useRentals(publicKey);

  useEffect(() => {
    const updateActivityData = () => {
      // Son 24 saatin verilerini oluştur
      const data = Array.from({ length: 24 }, (_, i) => {
        const time = new Date();
        time.setHours(time.getHours() - (23 - i));
        time.setMinutes(0, 0, 0);

        // Bu saat için rental işlemlerini bul
        const hourRentals = rentals.filter(rental => {
          const rentalTime = new Date(rental.timestamp);
          const startHour = new Date(time);
          const endHour = new Date(time.getTime() + 3600000); // 1 saat ekle
          return rentalTime >= startHour && rentalTime < endHour;
        });

        // Harcama ve kazanç hesapla
        const spending = hourRentals
          .filter(r => r.renterAddress === profile.address)
          .reduce((sum, r) => sum + r.price, 0);

        const earnings = hourRentals
          .filter(r => r.gpu.creator?.address === profile.address)
          .reduce((sum, r) => sum + r.price, 0);

        return {
          time: time.toLocaleTimeString([], { hour: '2-digit' }),
          spending,
          earnings,
          activeRentals: hourRentals.filter(r => r.status === 'active').length,
          performance: calculatePerformance(hourRentals)
        };
      });

      setActivityData(data);
    };

    // İlk veriyi oluştur
    updateActivityData();

    // Her 3 saniyede bir güncelle
    const interval = setInterval(updateActivityData, 3000);
    return () => clearInterval(interval);
  }, [rentals, profile.address]);

  // Toplam harcama ve kazançları hesapla
  const totalSpending = activityData.reduce((sum, data) => sum + data.spending, 0);
  const totalEarnings = activityData.reduce((sum, data) => sum + data.earnings, 0);
  const activeRentalsCount = activityData[activityData.length - 1]?.activeRentals || 0;
  const averagePerformance = Math.round(activityData[activityData.length - 1]?.performance || 0);

  return (
    <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-white">Activity Overview</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Last 24 Hours</span>
          <Activity className="w-4 h-4 text-glow-400 animate-pulse" />
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={activityData}>
            <defs>
              <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis 
              dataKey="time" 
              stroke="#4B5563"
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis 
              stroke="#4B5563"
              tick={{ fill: '#9CA3AF' }}
              tickFormatter={(value) => `${value} SOL`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '0.5rem'
              }}
              labelStyle={{ color: '#9CA3AF' }}
              itemStyle={{ color: '#E5E7EB' }}
              formatter={(value: number) => [`${formatSOL(value)} SOL`, '']}
            />

            <Area
              type="monotone"
              dataKey="spending"
              name="Spending"
              stroke="#8B5CF6"
              fillOpacity={1}
              fill="url(#colorSpending)"
            />
            <Area
              type="monotone"
              dataKey="earnings"
              name="Earnings"
              stroke="#10B981"
              fillOpacity={1}
              fill="url(#colorEarnings)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6">
        <StatCard
          label="Active Rentals"
          value={activeRentalsCount}
          icon={Activity}
          trend={0}
        />
        <StatCard
          label="24h Spending"
          value={formatSOL(totalSpending)}
          icon={DollarSign}
          trend={-5}
          isCurrency
        />
        <StatCard
          label="24h Earnings"
          value={formatSOL(totalEarnings)}
          icon={DollarSign}
          trend={15}
          isCurrency
        />
        <StatCard
          label="Performance"
          value={`${averagePerformance}%`}
          icon={TrendingUp}
          trend={8}
        />
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.FC<{ className?: string }>;
  trend: number;
  isCurrency?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, trend, isCurrency }) => (
  <div className="bg-dark-700 rounded-lg p-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-gray-400">{label}</span>
      <Icon className="w-4 h-4 text-glow-400" />
    </div>
    <div className="flex items-end justify-between">
      <span className="text-2xl font-bold text-white">
        {isCurrency ? `${value} SOL` : value}
      </span>
      <div className={`flex items-center text-sm ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'transform rotate-180' : ''}`} />
        <span>{Math.abs(trend)}%</span>
      </div>
    </div>
  </div>
);

const calculatePerformance = (rentals: RentalHistory[]) => {
  if (rentals.length === 0) return 0;
  return rentals.reduce((sum, r) => {
    const usageStats = r.usageStats || { gpuUsage: 0 };
    return sum + (usageStats.gpuUsage || 0);
  }, 0) / rentals.length;
}; 