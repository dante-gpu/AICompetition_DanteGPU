import React from 'react';
import { UserProfile as UserProfileType } from '../../types/user';
import { Shield, Star, Award, Clock, Activity, Zap } from 'lucide-react';
import { ProfileStats } from './ProfileStats';
import { Achievements } from './Achievements';
import { generateAvatarUrl } from '../../utils/avatar';

interface UserProfileProps {
  profile: UserProfileType;
}

export const UserProfile: React.FC<UserProfileProps> = ({ profile }) => {
  const getReputationColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-blue-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const avatarUrl = generateAvatarUrl(profile.address);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={avatarUrl}
              alt={profile.username || profile.address}
              className="w-24 h-24 rounded-xl border-2 border-glow-400/20"
            />
            <div className="absolute -bottom-2 -right-2 bg-dark-800 rounded-lg px-2 py-1 border border-dark-700">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-white">
                  {profile.stats.averageRating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              {profile.username || `${profile.address.slice(0, 6)}...${profile.address.slice(-4)}`}
            </h2>
            <p className="text-gray-400 mt-1">{profile.bio || 'No bio yet'}</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Joined {new Date(profile.joinedAt).toLocaleDateString()}</span>
              </div>
              <div className={`flex items-center gap-1 text-sm ${getReputationColor(profile.reputation.score)}`}>
                <Shield className="w-4 h-4" />
                <span>{profile.reputation.level}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-glow-400" />
            <h3 className="text-lg font-medium text-white">Activity</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Rentals</span>
              <span className="text-white font-medium">{profile.reputation.totalRentals}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">GPUs Listed</span>
              <span className="text-white font-medium">{profile.reputation.totalGPUsListed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Reviews</span>
              <span className="text-white font-medium">{profile.reputation.reviews}</span>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-glow-400" />
            <h3 className="text-lg font-medium text-white">Performance</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Success Rate</span>
              <span className="text-white font-medium">{profile.reputation.successRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Spent</span>
              <span className="text-white font-medium">{profile.stats.totalSpent} SOL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Earned</span>
              <span className="text-white font-medium">{profile.stats.totalEarned} SOL</span>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-5 h-5 text-glow-400" />
            <h3 className="text-lg font-medium text-white">Badges</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {profile.badges.map(badge => (
              <div
                key={badge.id}
                className="group relative flex items-center justify-center p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors"
              >
                <img src={badge.icon} alt={badge.name} className="w-8 h-8" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-dark-900 rounded-lg border border-dark-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-sm font-medium text-white">{badge.name}</p>
                  <p className="text-xs text-gray-400">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ProfileStats profile={profile} />
      <Achievements profile={profile} />

      {/* Recent Activity */}
      <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
        <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {profile.activity.map(activity => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-4 bg-dark-700 rounded-lg"
            >
              {activity.type === 'rental' && (
                <div className="text-blue-400">
                  <Zap className="w-5 h-5" />
                </div>
              )}
              {activity.type === 'listing' && (
                <div className="text-green-400">
                  <Activity className="w-5 h-5" />
                </div>
              )}
              {activity.type === 'review' && (
                <div className="text-yellow-400">
                  <Star className="w-5 h-5" />
                </div>
              )}
              {activity.type === 'badge' && (
                <div className="text-purple-400">
                  <Award className="w-5 h-5" />
                </div>
              )}

              <div>
                <p className="text-white">
                  {activity.type === 'rental' && `Rented ${activity.details.gpu?.name}`}
                  {activity.type === 'listing' && `Listed ${activity.details.gpu?.name}`}
                  {activity.type === 'review' && `Left a ${activity.details.rating}★ review`}
                  {activity.type === 'badge' && `Earned ${activity.details.badge?.name} badge`}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 