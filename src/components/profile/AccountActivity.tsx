import React from 'react';
import { AccountActivity } from '../../services/account';
import { formatDistance } from 'date-fns';
import { Shield, Star, Award, Clock, Activity } from 'lucide-react';
import { formatSOL } from '../../utils/format';

interface ActivityFeedProps {
  activities: AccountActivity[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getActivityIcon = (type: AccountActivity['type']) => {
    switch (type) {
      case 'rental': return Activity;
      case 'listing': return Star;
      case 'review': return Award;
      case 'badge': return Shield;
      case 'level_up': return Award;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = getActivityIcon(activity.type);
        
        return (
          <div key={index} className="flex items-start gap-4 p-4 bg-dark-700 rounded-lg">
            <div className="p-2 rounded-lg bg-dark-600">
              <Icon className="w-5 h-5 text-glow-400" />
            </div>
            
            <div className="flex-1">
              <h4 className="text-sm font-medium text-white">
                {activity.details.title}
              </h4>
              <p className="text-sm text-gray-400 mt-1">
                {activity.details.description}
              </p>
              {activity.details.amount && (
                <p className="text-sm text-glow-400 mt-1">
                  {formatSOL(activity.details.amount)} SOL
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {formatDistance(new Date(activity.timestamp), new Date(), { addSuffix: true })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}; 