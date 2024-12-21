import { UserProfile, ReputationLevel } from '../types/user';

export const calculateReputationLevel = (score: number): ReputationLevel => {
  if (score >= 90) return 'Elite';
  if (score >= 70) return 'Expert';
  if (score >= 50) return 'Trusted';
  if (score >= 30) return 'Regular';
  return 'Newcomer';
};

export const calculateReputationScore = (profile: Omit<UserProfile, 'reputation'>) => {
  let score = 0;

  // Başarılı kiralama geçmişi
  const rentalScore = Math.min(profile.stats.totalSpent * 2, 40);
  score += rentalScore;

  // Olumlu değerlendirmeler
  const reviewScore = Math.min(profile.stats.averageRating * 10, 30);
  score += reviewScore;

  // Platform aktivitesi
  const activityScore = Math.min(profile.activity.length, 20);
  score += activityScore;

  // Rozetler
  const badgeScore = Math.min(profile.badges.length * 5, 10);
  score += badgeScore;

  return Math.round(score);
};

export const updateReputation = async (
  address: string,
  action: 'rental' | 'review' | 'listing' | 'badge',
  details: any
) => {
  // Burada veritabanı güncellemesi yapılacak
  // Şimdilik localStorage kullanıyoruz
  const profile = await getUserProfile(address);
  if (!profile) return;

  switch (action) {
    case 'rental':
      profile.reputation.totalRentals++;
      profile.stats.totalSpent += details.amount;
      break;
    case 'review':
      profile.reputation.reviews++;
      // Ortalama puanı güncelle
      const totalScore = profile.stats.averageRating * (profile.reputation.reviews - 1) + details.rating;
      profile.stats.averageRating = totalScore / profile.reputation.reviews;
      break;
    case 'listing':
      profile.reputation.totalGPUsListed++;
      break;
    case 'badge':
      profile.badges.push(details.badge);
      break;
  }

  // Yeni reputasyon skorunu hesapla
  const newScore = calculateReputationScore(profile);
  profile.reputation.score = newScore;
  profile.reputation.level = calculateReputationLevel(newScore);

  // Aktivite ekle
  profile.activity.unshift({
    id: crypto.randomUUID(),
    type: action,
    timestamp: new Date().toISOString(),
    details
  });

  // Profili kaydet
  await saveUserProfile(profile);
};

export const getUserProfile = async (address: string): Promise<UserProfile | null> => {
  const stored = localStorage.getItem(`user_${address}`);
  return stored ? JSON.parse(stored) : null;
};

export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  localStorage.setItem(`user_${profile.address}`, JSON.stringify(profile));
};

export const BADGES = {
  EARLY_ADOPTER: {
    id: 'early-adopter',
    name: 'Early Adopter',
    description: 'Joined during platform launch',
    icon: '/badges/early-adopter.svg'
  },
  POWER_RENTER: {
    id: 'power-renter',
    name: 'Power Renter',
    description: 'Completed 10+ successful rentals',
    icon: '/badges/power-renter.svg'
  },
  TOP_PROVIDER: {
    id: 'top-provider',
    name: 'Top Provider',
    description: 'Listed 5+ GPUs with high ratings',
    icon: '/badges/top-provider.svg'
  },
  TRUSTED_MEMBER: {
    id: 'trusted-member',
    name: 'Trusted Member',
    description: 'Maintained high reputation for 30+ days',
    icon: '/badges/trusted-member.svg'
  }
};

export const checkAndAwardBadges = async (profile: UserProfile) => {
  const newBadges = [];

  // Early Adopter kontrolü
  if (new Date(profile.joinedAt).getTime() < new Date('2024-01-01').getTime()) {
    if (!profile.badges.find(b => b.id === BADGES.EARLY_ADOPTER.id)) {
      newBadges.push({
        ...BADGES.EARLY_ADOPTER,
        earnedAt: new Date().toISOString()
      });
    }
  }

  // Power Renter kontrolü
  if (profile.reputation.totalRentals >= 10) {
    if (!profile.badges.find(b => b.id === BADGES.POWER_RENTER.id)) {
      newBadges.push({
        ...BADGES.POWER_RENTER,
        earnedAt: new Date().toISOString()
      });
    }
  }

  // Top Provider kontrolü
  if (profile.reputation.totalGPUsListed >= 5 && profile.stats.averageRating >= 4.5) {
    if (!profile.badges.find(b => b.id === BADGES.TOP_PROVIDER.id)) {
      newBadges.push({
        ...BADGES.TOP_PROVIDER,
        earnedAt: new Date().toISOString()
      });
    }
  }

  // Yeni rozetleri ekle ve kaydet
  if (newBadges.length > 0) {
    profile.badges.push(...newBadges);
    await saveUserProfile(profile);

    // Her yeni rozet için aktivite ekle
    for (const badge of newBadges) {
      await updateReputation(profile.address, 'badge', { badge });
    }
  }

  return newBadges;
}; 