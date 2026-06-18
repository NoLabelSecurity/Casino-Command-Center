export interface CasinoAccount {
  id: string;
  name: string;
  logoUrl: string;
  casinoUrl: string;
  username: string;
  passwordEncrypted: string;
  loginNotes: string;
  stateRestriction: string;
  accountStatus: 'active' | 'suspended' | 'pending_verification';
  scBalance: number;
  gcBalance: number;
  vipLevel: string;
  joinDate: string;
  lastLogin: string;
  lastCollectionTime: string;
  todayBonusStatus: 'claimed' | 'available' | 'cooldown';
  freeSpinsAvailable: number;
  promoCodesCount: number;
  playthroughRequirement: number; // in SC
  playthroughProgress: number; // current wager completed (SC)
  redemptionStatus: 'none' | 'eligible' | 'pending' | 'completed';
  accountHealth: 'excellent' | 'good' | 'warning' | 'critical';
  color: string; // Tailwind tint
}

export type TransactionType = 'deposit' | 'redemption' | 'win' | 'loss' | 'bonus_claim' | 'promo_claim';

export interface CasinoTransaction {
  id: string;
  casinoId: string;
  casinoName: string;
  type: TransactionType;
  amountSC: number;
  amountGC: number;
  timestamp: string;
  notes?: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface PromoCode {
  id: string;
  code: string;
  casinoId: string;
  casinoName: string;
  dateAdded: string;
  expirationDate: string;
  lastUsed?: string;
  dailyUsageAvailable: boolean;
  rewardValue: string; // e.g., "1.00 SC"
  isArchived: boolean;
  isFavorite: boolean;
  usedCount: number;
}

export interface BonusLink {
  id: string;
  source: string;
  datePosted: string;
  rewardType: 'SC' | 'Spins' | 'VIP' | 'Promo' | 'Seasonal';
  rewardValue: string;
  expirationDate: string;
  claimStatus: 'unclaimed' | 'claimed' | 'expired';
  url: string;
  tags: string[];
}

export interface NotificationLog {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'bonus' | 'promo' | 'redemption' | 'balance' | 'system';
  severity: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}

export interface AutomationAdapter {
  id: string;
  casinoName: string;
  loginUrl: string;
  dashboardUrl: string;
  bonusCollectionMethod: 'API' | 'Selectors' | 'Puppeteer';
  balanceSelectors: string;
  transactionSelectors: string;
  status: 'active' | 'testing' | 'error';
  lastRunTime?: string;
  lastRunError?: string;
}
