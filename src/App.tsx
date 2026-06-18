import React, { useState, useEffect } from 'react';
import { 
  INITIAL_CASINO_ACCOUNTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_PROMO_CODES, 
  INITIAL_BONUS_LINKS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUTOMATION_ADAPTERS 
} from './data/mockData';
import { 
  CasinoAccount, 
  CasinoTransaction, 
  PromoCode, 
  BonusLink, 
  NotificationLog, 
  AutomationAdapter 
} from './types';

// Icons
import { 
  LayoutDashboard, 
  FolderLock, 
  Coins, 
  Tag, 
  Rss, 
  BarChart3, 
  Workflow, 
  Bell, 
  Database,
  ArrowRightLeft,
  ChevronRight,
  ShieldCheck,
  User,
  Users,
  Settings,
  HelpCircle,
  Menu,
  X,
  FileSpreadsheet
} from 'lucide-react';

// Modular Components
import DashboardOverview from './components/DashboardOverview';
import CasinoGrid from './components/CasinoGrid';
import CasinoDetailView from './components/CasinoDetailView';
import DailyBonusCenter from './components/DailyBonusCenter';
import PromoCodeCenter from './components/PromoCodeCenter';
import BonusLinkFeed from './components/BonusLinkFeed';
import AnalyticsView from './components/AnalyticsView';
import AutomationView from './components/AutomationView';
import NotificationsSettings from './components/NotificationsSettings';
import DatabaseDeliverables from './components/DatabaseDeliverables';

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedCasinoDetailId, setSelectedCasinoDetailId] = useState<string | null>(null);
  
  // Responsive sidebar toggler for mobile devices
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Authentication roles state
  const [currentUserRole, setCurrentUserRole] = useState<'Operator Admin' | 'Guest Operator'>('Operator Admin');
  const [mockUser, setMockUser] = useState({
    name: 'Brian Lorick',
    email: 'brianlorick1988@gmail.com',
    profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60'
  });

  // Database core state
  const [accounts, setAccounts] = useState<CasinoAccount[]>([]);
  const [transactions, setTransactions] = useState<CasinoTransaction[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [bonusLinks, setBonusLinks] = useState<BonusLink[]>([]);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [adapters, setAdapters] = useState<AutomationAdapter[]>([]);

  // Load from local storage or defaults on startup
  useEffect(() => {
    const savedAccs = localStorage.getItem('ccc_accounts');
    const savedTx = localStorage.getItem('ccc_transactions');
    const savedPromos = localStorage.getItem('ccc_promos');
    const savedLinks = localStorage.getItem('ccc_links');
    const savedNotifs = localStorage.getItem('ccc_notifications');
    const savedAdapters = localStorage.getItem('ccc_adapters');

    if (savedAccs) setAccounts(JSON.parse(savedAccs));
    else setAccounts(INITIAL_CASINO_ACCOUNTS);

    if (savedTx) setTransactions(JSON.parse(savedTx));
    else setTransactions(INITIAL_TRANSACTIONS);

    if (savedPromos) setPromoCodes(JSON.parse(savedPromos));
    else setPromoCodes(INITIAL_PROMO_CODES);

    if (savedLinks) setBonusLinks(JSON.parse(savedLinks));
    else setBonusLinks(INITIAL_BONUS_LINKS);

    if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
    else setNotifications(INITIAL_NOTIFICATIONS);

    if (savedAdapters) setAdapters(JSON.parse(savedAdapters));
    else setAdapters(INITIAL_AUTOMATION_ADAPTERS);
  }, []);

  // Sync to localStorage helpers
  const saveStateToLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Actions handlers
  const handleCollectDailyBonus = (casinoId: string) => {
    // 1. Find casino
    const updatedAccs = accounts.map(acc => {
      if (acc.id === casinoId) {
        return {
          ...acc,
          scBalance: acc.scBalance + 1.00,
          todayBonusStatus: 'claimed' as const,
          lastCollectionTime: '2026-06-15 19:44',
          playthroughProgress: Math.min(acc.playthroughRequirement, acc.playthroughProgress + 1.00)
        };
      }
      return acc;
    });

    // 2. Insert bonus record
    const target = accounts.find(a => a.id === casinoId);
    const newTx: CasinoTransaction = {
      id: `tx-gen-${Date.now().toString().substring(7)}`,
      casinoId,
      casinoName: target ? target.name : 'Unknown Casino',
      type: 'bonus_claim',
      amountSC: 1.00,
      amountGC: 10000,
      timestamp: '2026-06-15 19:44',
      status: 'completed',
      notes: 'Manually logged daily bonus collection reward credit'
    };

    const updatedTx = [newTx, ...transactions];

    // 3. Register notification
    const newNotification: NotificationLog = {
      id: `not-gen-${Date.now()}`,
      title: 'Daily Bonus Claims Account Completed',
      message: `Successfully claimed daily 1.00 SC + 10,000 GC reward for ${target?.name || 'Casino'}`,
      timestamp: '2026-06-15 19:44',
      type: 'bonus',
      severity: 'success',
      read: false
    };
    const updatedNotifs = [newNotification, ...notifications];

    setAccounts(updatedAccs);
    setTransactions(updatedTx);
    setNotifications(updatedNotifs);

    saveStateToLocalStorage('ccc_accounts', updatedAccs);
    saveStateToLocalStorage('ccc_transactions', updatedTx);
    saveStateToLocalStorage('ccc_notifications', updatedNotifs);
  };

  const handleClaimBonusLink = (id: string) => {
    const updatedLinks = bonusLinks.map(link => {
      if (link.id === id) {
        return { ...link, claimStatus: 'claimed' as const };
      }
      return link;
    });

    const targetLink = bonusLinks.find(l => l.id === id);
    let targetCasinoId = 'stake-us';
    if (targetLink?.tags.includes('Pulsz')) targetCasinoId = 'pulsz-casino';
    if (targetLink?.tags.includes('Chumba')) targetCasinoId = 'chumba-casino';
    if (targetLink?.tags.includes('McLuck')) targetCasinoId = 'mcluck';

    const cleanRewardVal = Number(targetLink?.rewardValue.split(' ')[0]) || 1.00;

    // Credit account balance
    const updatedAccs = accounts.map(acc => {
      if (acc.id === targetCasinoId) {
        return {
          ...acc,
          scBalance: acc.scBalance + cleanRewardVal
        };
      }
      return acc;
    });

    // Log transaction
    const newTx: CasinoTransaction = {
      id: `tx-gen-${Date.now().toString().substring(8)}`,
      casinoId: targetCasinoId,
      casinoName: targetLink ? targetLink.source.split('/')[1] || targetLink.source : 'Cash Reward Feed',
      type: 'bonus_claim',
      amountSC: cleanRewardVal,
      amountGC: 0,
      timestamp: '2026-06-15 19:44',
      status: 'completed',
      notes: `Claimed social link: ${targetLink?.rewardValue || 'Bonus'}`
    };

    const updatedTx = [newTx, ...transactions];

    setBonusLinks(updatedLinks);
    setAccounts(updatedAccs);
    setTransactions(updatedTx);

    saveStateToLocalStorage('ccc_links', updatedLinks);
    saveStateToLocalStorage('ccc_accounts', updatedAccs);
    saveStateToLocalStorage('ccc_transactions', updatedTx);
  };

  const handleUpdateAccount = (id: string, updated: Partial<CasinoAccount>) => {
    const updatedAccs = accounts.map(acc => {
      if (acc.id === id) {
        return { ...acc, ...updated };
      }
      return acc;
    });

    setAccounts(updatedAccs);
    saveStateToLocalStorage('ccc_accounts', updatedAccs);
  };

  const handleAddAccount = (acc: Partial<CasinoAccount>) => {
    const newCasino: CasinoAccount = {
      id: `casino-gen-${Date.now()}`,
      name: acc.name || 'New Casino Integration',
      logoUrl: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=100&auto=format&fit=crop&q=60',
      casinoUrl: acc.casinoUrl || '#',
      username: acc.username || 'Unspecified',
      passwordEncrypted: acc.passwordEncrypted || '',
      loginNotes: acc.loginNotes || '',
      stateRestriction: acc.stateRestriction || 'No State Restrictions noted.',
      accountStatus: 'active',
      scBalance: acc.scBalance || 0.00,
      gcBalance: 10000,
      vipLevel: 'Standard Player Rank',
      joinDate: '2026-06-15',
      lastLogin: 'Never logged',
      lastCollectionTime: 'Never claimed',
      todayBonusStatus: 'available',
      freeSpinsAvailable: 0,
      promoCodesCount: 0,
      playthroughRequirement: 0.00,
      playthroughProgress: 0.00,
      redemptionStatus: 'none',
      accountHealth: 'good',
      color: '#ec4899', // generic default color accent
    };

    const updatedAccs = [...accounts, newCasino];
    setAccounts(updatedAccs);
    saveStateToLocalStorage('ccc_accounts', updatedAccs);
  };

  const handleUpdatePromoCode = (id: string, updated: Partial<PromoCode>) => {
    const updatedPromos = promoCodes.map(p => {
      if (p.id === id) {
        return { ...p, ...updated };
      }
      return p;
    });
    setPromoCodes(updatedPromos);
    saveStateToLocalStorage('ccc_promos', updatedPromos);
  };

  const handleAddPromoCode = (p: Partial<PromoCode>) => {
    const newPromo: PromoCode = {
      id: `promo-gen-${Date.now()}`,
      code: p.code || 'COUPONCODE100',
      casinoId: p.casinoId || 'stake-us',
      casinoName: p.casinoName || 'Stake.us',
      dateAdded: p.dateAdded || '2026-06-15',
      expirationDate: p.expirationDate || '2026-12-31',
      dailyUsageAvailable: p.dailyUsageAvailable !== false,
      rewardValue: p.rewardValue || '1.00 SC',
      isArchived: false,
      isFavorite: false,
      usedCount: p.usedCount || 0
    };

    const updatedPromos = [newPromo, ...promoCodes];
    setPromoCodes(updatedPromos);
    saveStateToLocalStorage('ccc_promos', updatedPromos);
  };

  const handleDeletePromo = (id: string) => {
    const updatedPromos = promoCodes.filter(p => p.id !== id);
    setPromoCodes(updatedPromos);
    saveStateToLocalStorage('ccc_promos', updatedPromos);
  };

  const handleUpdateAdapter = (id: string, updated: Partial<AutomationAdapter>) => {
    const updatedAdapters = adapters.map(a => {
      if (a.id === id) return { ...a, ...updated };
      return a;
    });
    setAdapters(updatedAdapters);
    saveStateToLocalStorage('ccc_adapters', updatedAdapters);
  };

  const handleAddAdapter = (ad: Partial<AutomationAdapter>) => {
    const newAd: AutomationAdapter = {
      id: ad.id || `adapter-gen-${Date.now()}`,
      casinoName: ad.casinoName || 'New Scraper',
      loginUrl: ad.loginUrl || '',
      dashboardUrl: ad.dashboardUrl || '',
      bonusCollectionMethod: ad.bonusCollectionMethod || 'Selectors',
      balanceSelectors: ad.balanceSelectors || '',
      transactionSelectors: ad.transactionSelectors || '',
      status: 'testing'
    };

    const updatedAdapters = [newAd, ...adapters];
    setAdapters(updatedAdapters);
    saveStateToLocalStorage('ccc_adapters', updatedAdapters);
  };

  const handleMarkNotificationRead = (id: string) => {
    const updated = notifications.map(n => {
      if (n.id === id) return { ...n, read: true };
      return n;
    });
    setNotifications(updated);
    saveStateToLocalStorage('ccc_notifications', updated);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    saveStateToLocalStorage('ccc_notifications', []);
  };

  const handleDrilldownCasino = (id: string) => {
    setSelectedCasinoDetailId(id);
    setActiveTab('casinos-detail');
  };

  // Callback to simulate automated status update during script crawling runs
  const handleRefreshMockBalancesStats = () => {
    const updatedAccs = accounts.map(acc => {
      if (acc.id === 'mcluck') {
        return {
          ...acc,
          scBalance: acc.scBalance + 1.50,
          todayBonusStatus: 'claimed' as const
        };
      }
      return acc;
    });
    setAccounts(updatedAccs);
    saveStateToLocalStorage('ccc_accounts', updatedAccs);
  };

  const totalSCBalance = accounts.reduce((acc, curr) => acc + curr.scBalance, 0);
  const totalGCBalance = accounts.reduce((acc, curr) => acc + curr.gcBalance, 0);
  const totalFreeSCCollectedToday = transactions
    .filter(t => t.type === 'bonus_claim' && t.timestamp.startsWith('2026-06-15'))
    .reduce((acc, curr) => acc + curr.amountSC, 0);

  return (
    <div className="min-h-screen bg-[#0B0D12] text-gray-100 flex font-sans select-none" id="command-center-root">
      
      {/* 
        Left Side Navigation Rail & Control Desk
      */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#151922] border-r border-gray-800 flex flex-col justify-between transform transition-transform duration-300 md:translate-x-0 md:static md:h-screen ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        id="side-nav-deck"
      >
        {/* Top Header Section */}
        <div className="flex flex-col flex-1 min-h-0">
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#F4B860] rounded flex items-center justify-center text-[#0B0D12] font-black text-sm font-mono">C3</div>
              <h1 className="text-sm font-black tracking-tight text-white uppercase font-mono">
                CASINO<span className="text-[#F4B860]">COMMAND</span>
              </h1>
            </div>

            <button 
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white md:hidden cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User auth SSO simulation card */}
          <div className="p-4 bg-black/20 border-b border-gray-800 space-y-3">
            <div className="flex items-center gap-3 p-1 rounded-lg">
              <img 
                src={mockUser.profileUrl} 
                alt="Profile Avatar" 
                className="w-8 h-8 rounded-full object-cover border border-[#F4B860] shadow-[0_0_8px_rgba(244,184,96,0.3)]" 
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white block truncate">{mockUser.name}</span>
                <span className="text-[10px] text-gray-500 block truncate font-mono">Platinum VIP</span>
              </div>
            </div>

            {/* Auth Roles toggle panel */}
            <div className="flex justify-between items-center bg-[#0B0D12]/80 p-2 rounded border border-gray-850 text-[10.5px]">
              <span className="text-zinc-500 font-mono">Simulated Role:</span>
              <button 
                onClick={() => setCurrentUserRole(prev => prev === 'Operator Admin' ? 'Guest Operator' : 'Operator Admin')}
                className="text-[#F4B860] hover:text-white font-mono font-extrabold uppercase cursor-pointer"
                title="Simulate role toggle"
              >
                {currentUserRole}
              </button>
            </div>
          </div>

          {/* Nav channels link scrollable body */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'casinos', label: 'Casino Tile Grid', icon: FolderLock },
              { id: 'bonuses', label: 'Bonus Center', icon: Coins },
              { id: 'promos', label: 'Promo Codes', icon: Tag },
              { id: 'links', label: 'Bonus Link Feed', icon: Rss },
              { id: 'analytics', label: 'Analytics Reports', icon: BarChart3 },
              { id: 'automation', label: 'Automation', icon: Workflow },
              { id: 'notifications', label: 'Alert Center', icon: Bell },
              { id: 'deliverables', label: 'Dev Deliverables', icon: Database },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id || (tab.id === 'casinos' && activeTab === 'casinos-detail');
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                    isActive 
                    ? 'bg-[#F4B860]/10 text-[#F4B860] border border-[#F4B860]/25 font-semibold' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </span>
                  
                  {isActive && <ChevronRight className="h-3 w-3 text-[#F4B860]" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info lock */}
        <div className="h-14 border-t border-gray-800 bg-[#0c0e14] flex items-center px-5 justify-between select-none">
          <span className="text-[10px] text-zinc-500 font-mono tracking-tight uppercase font-semibold">Security: Active</span>
          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-bold">AES-256</span>
        </div>
      </aside>

      {/* 
        Main Dashboard display viewport areas
      */}
      <div className="flex-1 flex flex-col min-w-0" id="main-viewport-desktop">
        
        {/* Sleek Custom Premium Header */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 md:px-8 bg-[#151922]/50 backdrop-blur-md shrink-0">
          <div className="flex gap-6 md:gap-8 items-center">
            {/* Mobile Menu Toggle Button */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="text-gray-400 hover:text-white md:hidden p-1.5 bg-gray-800/40 rounded border border-gray-800 cursor-pointer"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest text-[#F4B860] font-bold">Global Balance</span>
              <span className="text-sm font-semibold text-white font-mono flex items-baseline gap-1">
                ${totalSCBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SC 
                <span className="text-[10px] text-gray-500 font-normal">{(totalGCBalance / 1000).toFixed(0)}k GC</span>
              </span>
            </div>
            
            <div className="flex flex-col border-l border-gray-800 pl-6 md:pl-8">
              <span className="text-[9px] uppercase tracking-widest text-[#4ADE80] font-bold">Collected Today</span>
              <span className="text-sm font-semibold text-[#4ADE80] font-mono">
                +${totalFreeSCCollectedToday.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SC
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-black/40 px-3 py-1.5 rounded-full border border-gray-800">
              <span className="w-2 h-2 rounded-full bg-[#4ADE80] mr-2 shadow-[0_0_8px_#4ADE80] animate-pulse"></span>
              <span className="text-[11px] font-medium text-gray-300">Sync Active</span>
            </div>

            <button 
              onClick={() => setActiveTab('notifications')}
              className="p-2 hover:bg-white/5 rounded-full text-zinc-400 transition hover:text-[#F4B860] relative cursor-pointer"
              title="System event logs"
            >
              <Bell className="w-5 h-5" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F4B860] rounded-full ring-1 ring-[#151922]"></span>
              )}
            </button>
          </div>
        </header>

        {/* Primary Tab View containers */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          
          {activeTab === 'dashboard' && (
            <DashboardOverview 
              accounts={accounts} 
              transactions={transactions} 
              promoCodes={promoCodes} 
              bonusLinks={bonusLinks}
              onNavigate={(tabId, casinoId) => {
                if (casinoId) handleDrilldownCasino(casinoId);
                else setActiveTab(tabId);
              }}
              onClaimLink={handleClaimBonusLink}
              onCollectDaily={handleCollectDailyBonus}
            />
          )}

          {activeTab === 'casinos' && (
            <CasinoGrid 
              accounts={accounts}
              onSelectCasino={handleDrilldownCasino}
              onCollectDaily={handleCollectDailyBonus}
              onAddAccount={handleAddAccount}
              onUpdateAccount={handleUpdateAccount}
            />
          )}

          {activeTab === 'casinos-detail' && selectedCasinoDetailId && (
            <CasinoDetailView 
              casinoId={selectedCasinoDetailId}
              accounts={accounts}
              transactions={transactions}
              onBack={() => setActiveTab('casinos')}
            />
          )}

          {activeTab === 'bonuses' && (
            <DailyBonusCenter 
              accounts={accounts} 
              transactions={transactions} 
              onCollectDaily={handleCollectDailyBonus}
            />
          )}

          {activeTab === 'promos' && (
            <PromoCodeCenter 
              accounts={accounts} 
              promoCodes={promoCodes} 
              onAddPromo={handleAddPromoCode}
              onUpdatePromo={handleUpdatePromoCode}
              onDeletePromo={handleDeletePromo}
            />
          )}

          {activeTab === 'links' && (
            <BonusLinkFeed 
              bonusLinks={bonusLinks} 
              onClaimLink={handleClaimBonusLink} 
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView />
          )}

          {activeTab === 'automation' && (
            <AutomationView 
              adapters={adapters}
              accounts={accounts}
              onAddAdapter={handleAddAdapter}
              onUpdateAdapter={handleUpdateAdapter}
              onRefreshScatteredStats={handleRefreshMockBalancesStats}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsSettings 
              notifications={notifications}
              onMarkRead={handleMarkNotificationRead}
              onClearAll={handleClearNotifications}
            />
          )}

          {activeTab === 'deliverables' && (
            <DatabaseDeliverables />
          )}

        </main>
      </div>
    </div>
  );
}
