import React from 'react';
import { UserProfile } from '../../types/user';
import { Trophy, Target, Star, TrendingUp } from 'lucide-react';

interface AchievementsProps {
  profile: UserProfile;
}

export const Achievements: React.FC<AchievementsProps> = ({ profile }) => {
  const achievements = [
    {
      id: 'first-rental',
      icon: Trophy,
      name: 'First Rental',
      description: 'Complete your first GPU rental',
      progress: profile.reputation.totalRentals > 0 ? 100 : 0,
      completed: profile.reputation.totalRentals > 0
    },
    {
      id: 'power-user',
      icon: TrendingUp,
      name: 'Power User',
      description: 'Complete 10 successful rentals',
      progress: (profile.reputation.totalRentals / 10) * 100,
      completed: profile.reputation.totalRentals >= 10
    },
    {
      id: 'top-rated',
      icon: Star,
      name: 'Top Rated',
      description: 'Maintain a 4.5+ rating',
      progress: (profile.stats.averageRating / 4.5) * 100,
      completed: profile.stats.averageRating >= 4.5
    },
    {
      id: 'provider',
      icon: Target,
      name: 'GPU Provider',
      description: 'List your first GPU',
      progress: profile.reputation.totalGPUsListed > 0 ? 100 : 0,
      completed: profile.reputation.totalGPUsListed > 0
    }
  ];

  return (
    <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
      <h3 className="text-lg font-medium text-white mb-6">Achievements</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map(achievement => (
          <div
            key={achievement.id}
            className={`
              relative p-4 rounded-lg border
              ${achievement.completed 
                ? 'bg-dark-700/50 border-glow-400/30' 
                : 'bg-dark-700 border-dark-600'
              }
            `}
          >
            <div className="flex items-start gap-4">
              <div className={`
                p-2 rounded-lg
                ${achievement.completed ? 'bg-glow-400/20 text-glow-400' : 'bg-dark-600 text-gray-400'}
              `}>
                <achievement.icon size={20} />
              </div>
              
              <div className="flex-1">
                <h4 className="text-white font-medium">{achievement.name}</h4>
                <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>
                
                <div className="mt-3">
                  <div className="h-1.5 bg-dark-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-glow-400 to-glow-600 transition-all duration-500"
                      style={{ width: `${Math.min(achievement.progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {Math.round(achievement.progress)}% Complete
                  </p>
                </div>
              </div>

              {achievement.completed && (
                <div className="absolute top-2 right-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 