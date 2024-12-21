import { AccountSettings } from '../services/account';

export interface UserProfile {
  address: string;
  avatarUrl: string;
  username?: string;
  bio?: string;
  joinedAt: string;
  reputation: {
    score: number;
    level: string;
    totalRentals: number;
    totalGPUsListed: number;
    reviews: number;
    successRate: number;
  };
  badges: Badge[];
  stats: {
    totalSpent: number;
    totalEarned: number;
    averageRating: number;
  };
  activity: UserActivity[];
  settings: AccountSettings;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface UserActivity {
  id: string;
  type: 'rental' | 'listing' | 'review' | 'badge' | 'level_up';
  timestamp: string;
  details: RentalDetails | ListingDetails | ReviewDetails | BadgeDetails | LevelUpDetails;
}

interface BaseDetails {
  title: string;
  description: string;
  amount?: number;
}

interface RentalDetails extends BaseDetails {
  type: 'rental';
  gpu: {
    id: string;
    name: string;
  };
}

interface ListingDetails extends BaseDetails {
  type: 'listing';
  gpu: {
    id: string;
    name: string;
  };
}

interface ReviewDetails extends BaseDetails {
  type: 'review';
  rating: number;
}

interface BadgeDetails extends BaseDetails {
  type: 'badge';
  badge: Badge;
}

interface LevelUpDetails extends BaseDetails {
  type: 'level_up';
  level: string;
}

export type ReputationLevel = 
  | 'Newcomer'
  | 'Regular'
  | 'Trusted'
  | 'Expert'
  | 'Elite'; 