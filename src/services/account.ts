import { UserProfile } from '../types/user';
import { generateAvatarUrl } from '../utils/avatar';
import { RentalHistory } from '../types/rental';
import { UserActivity } from '../types/user';

const ACCOUNTS_KEY = 'dgpu_accounts';

export interface AccountStats {
  totalRentals: number;
  totalSpent: number;
  totalEarned: number;
  successRate: number;
  reputation: number;
}

export interface AccountActivity {
  type: 'rental' | 'listing' | 'review' | 'badge' | 'level_up';
  timestamp: Date;
  details: {
    title: string;
    description: string;
    amount?: number;
    rating?: number;
    badgeId?: string;
    level?: string;
  };
}

export interface AccountSettings {
  notifications: {
    email: boolean;
    rental: boolean;
    marketing: boolean;
  };
  privacy: {
    showActivity: boolean;
    showStats: boolean;
    showRentals: boolean;
  };
  preferences: {
    theme: 'dark' | 'light';
    currency: 'SOL' | 'USD';
    language: string;
  };
}

class AccountService {
  async initializeAccount(address: string): Promise<UserProfile> {
    const accounts = await this.getAllAccounts();
    const existingAccount = accounts.find(a => a.address === address);

    if (existingAccount) {
      return existingAccount;
    }

    const newAccount: UserProfile = {
      address,
      avatarUrl: generateAvatarUrl(address),
      joinedAt: new Date().toISOString(),
      reputation: {
        score: 0,
        level: 'Newcomer',
        totalRentals: 0,
        totalGPUsListed: 0,
        reviews: 0,
        successRate: 100
      },
      badges: [],
      stats: {
        totalSpent: 0,
        totalEarned: 0,
        averageRating: 0
      },
      activity: [],
      settings: {
        notifications: {
          email: true,
          rental: true,
          marketing: false
        },
        privacy: {
          showActivity: true,
          showStats: true,
          showRentals: true
        },
        preferences: {
          theme: 'dark',
          currency: 'SOL',
          language: 'en'
        }
      }
    };

    await this.saveAccount(newAccount);
    return newAccount;
  }

  async updateAccount(address: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const accounts = await this.getAllAccounts();
    const index = accounts.findIndex(a => a.address === address);
    
    if (index === -1) {
      throw new Error('Account not found');
    }

    const updatedAccount = { ...accounts[index], ...updates };
    accounts[index] = updatedAccount;
    
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    return updatedAccount;
  }

  async searchAccounts(query: string): Promise<UserProfile[]> {
    const accounts = await this.getAllAccounts();
    const lowerQuery = query.toLowerCase();

    return accounts.filter(account => 
      account.address.toLowerCase().includes(lowerQuery) ||
      account.username?.toLowerCase().includes(lowerQuery)
    );
  }

  async getAllAccounts(): Promise<UserProfile[]> {
    const stored = localStorage.getItem(ACCOUNTS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  async saveAccount(account: UserProfile): Promise<void> {
    const accounts = await this.getAllAccounts();
    const index = accounts.findIndex(a => a.address === account.address);

    if (index !== -1) {
      accounts[index] = account;
    } else {
      accounts.push(account);
    }

    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }

  async getAccountStats(address: string): Promise<AccountStats> {
    const account = (await this.getAllAccounts())
      .find(a => a.address === address);

    if (!account) {
      throw new Error('Account not found');
    }

    return {
      totalRentals: account.reputation.totalRentals,
      totalSpent: account.stats.totalSpent,
      totalEarned: account.stats.totalEarned,
      successRate: account.reputation.successRate,
      reputation: account.reputation.score
    };
  }

  async updateStats(address: string, rental: RentalHistory): Promise<void> {
    const account = await this.getAccount(address);
    if (!account) return;

    account.stats.totalSpent += rental.price;
    account.reputation.totalRentals += 1;
    account.reputation.successRate = this.calculateSuccessRate(account);
    
    const newLevel = this.calculateLevel(account);
    if (newLevel !== account.reputation.level) {
      account.reputation.level = newLevel;
      this.addActivity(address, {
        type: 'level_up',
        timestamp: new Date().toISOString(),
        details: {
          type: 'level_up',
          title: 'Level Up!',
          description: `Congratulations! You've reached ${newLevel} level`,
          level: newLevel
        }
      });
    }

    await this.saveAccount(account);
  }

  async addActivity(address: string, activity: Omit<UserActivity, 'id'>): Promise<void> {
    const account = await this.getAccount(address);
    if (!account) return;

    const newActivity: UserActivity = {
      id: crypto.randomUUID(),
      ...activity,
      timestamp: new Date().toISOString()
    };

    account.activity = [newActivity, ...account.activity].slice(0, 50);
    await this.saveAccount(account);
  }

  async updateSettings(address: string, settings: Partial<AccountSettings>): Promise<void> {
    const account = await this.getAccount(address);
    if (!account) return;

    account.settings = { ...account.settings, ...settings };
    await this.saveAccount(account);
  }

  private calculateLevel(account: UserProfile): string {
    const { totalRentals, successRate } = account.reputation;
    const { totalSpent } = account.stats;

    if (totalRentals >= 100 && successRate >= 95 && totalSpent >= 100) return 'Elite';
    if (totalRentals >= 50 && successRate >= 90 && totalSpent >= 50) return 'Expert';
    if (totalRentals >= 20 && successRate >= 85 && totalSpent >= 20) return 'Trusted';
    if (totalRentals >= 5 && successRate >= 80 && totalSpent >= 5) return 'Regular';
    return 'Newcomer';
  }

  private calculateSuccessRate(account: UserProfile): number {
    return 100;
  }

  async getLeaderboard(): Promise<UserProfile[]> {
    const accounts = await this.getAllAccounts();
    return accounts
      .sort((a, b) => b.reputation.score - a.reputation.score)
      .slice(0, 10);
  }

  async getAccount(address: string): Promise<UserProfile | null> {
    const accounts = await this.getAllAccounts();
    return accounts.find(a => a.address === address) || null;
  }
}

export const accountService = new AccountService();