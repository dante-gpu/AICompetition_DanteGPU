import React, { useEffect, useState } from 'react';
import { UserProfile } from '../../types/user';
import { accountService } from '../../services/account';
import { Shield, Trophy, Star, TrendingUp } from 'lucide-react';
import { formatSOL } from '../../utils/format';
import { useNavigate } from 'react-router-dom';

export const LeaderboardPanel: React.FC = () => {
  const [leaders, setLeaders] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadLeaderboard = async () => {
      const data = await accountService.getLeaderboard();
      setLeaders(data);
      setLoading(false);
    };

    loadLeaderboard();
    const interval = setInterval(loadLeaderboard, 30000); // Her 30 saniyede bir güncelle
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-white">Top Performers</h3>
        <Trophy className="w-5 h-5 text-yellow-400" />
      </div>

      <div className="space-y-4">
        {leaders.map((user, index) => (
          <div
            key={user.address}
            className="flex items-center gap-4 p-4 bg-dark-700/50 rounded-lg hover:bg-dark-700 transition-colors cursor-pointer"
            onClick={() => navigate(`/profile/${user.address}`)}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-dark-600 text-glow-400 font-bold">
              {index + 1}
            </div>

            <img
              src={user.avatarUrl}
              alt={user.username}
              className="w-10 h-10 rounded-lg border border-dark-600"
            />

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">
                  {user.username || `${user.address.slice(0, 6)}...${user.address.slice(-4)}`}
                </span>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-dark-600">
                  <Shield className="w-3 h-3 text-glow-400" />
                  <span className="text-xs text-gray-300">{user.reputation.level}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Star className="w-3 h-3" />
                  <span>{user.reputation.score} points</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>{formatSOL(user.stats.totalEarned)} SOL earned</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 