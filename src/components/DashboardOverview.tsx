import React from 'react';
import { CasinoAccount, CasinoTransaction, PromoCode, BonusLink } from '../types';
import { 
  TrendingUp, 
  Coins, 
  CheckCircle2, 
  Clock, 
  Gift, 
  Search, 
  Check, 
  Zap, 
  ArrowUpRight, 
  AlertCircle,
  PiggyBank,
  ExternalLink
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { HISTORICAL_EARNINGS } from '../data/mockData';

interface DashboardOverviewProps {
  accounts: CasinoAccount[];
  transactions: CasinoTransaction[];
  promoCodes: PromoCode[];
  bonusLinks: BonusLink[];
  onNavigate: (tabId: string, casinoId?: string) => void;
  onClaimLink: (id: string) => void;
  onCollectDaily: (id: string) => void;
}

export default function DashboardOverview({
  accounts,
  transactions,
  promoCodes,
  bonusLinks,
  onNavigate,
  onClaimLink,
  onCollectDaily,
}: DashboardOverviewProps) {
  
  // Calculations
  const activePromoCodes = promoCodes.filter(p => !p.isArchived && new Date(p.expirationDate) >= new Date()).length;
  const activeBonusLinks = bonusLinks.filter(l => l.claimStatus === 'unclaimed').length;
  
  const totalSCBalance = accounts.reduce((acc, curr) => acc + curr.scBalance, 0);
  const totalGCBalance = accounts.reduce((acc, curr) => acc + curr.gcBalance, 0);
  
  const totalPlaythroughRequired = accounts.reduce((acc, curr) => acc + curr.playthroughRequirement, 0);
  const totalPlaythroughCompleted = accounts.reduce((acc, curr) => acc + curr.playthroughProgress, 0);
  
  const totalRedeemedSC = transactions
    .filter(t => t.type === 'redemption' && t.status === 'completed')
    .reduce((acc, curr) => acc + curr.amountSC, 0);

  const pendingRedemptionSC = transactions
    .filter(t => t.type === 'redemption' && t.status === 'pending')
    .reduce((acc, curr) => acc + curr.amountSC, 0);

  const totalFreeSCCollectedToday = transactions
    .filter(t => t.type === 'bonus_claim' && t.timestamp.startsWith('2026-06-15'))
    .reduce((acc, curr) => acc + curr.amountSC, 0);

  const totalFreeSCCollectedMonth = HISTORICAL_EARNINGS.reduce((acc, curr) => acc + curr.SC, 0);

  const availableFreeSpins = accounts.reduce((acc, curr) => acc + curr.freeSpinsAvailable, 0);
  
  const availableDailyBonusesCount = accounts.filter(a => a.todayBonusStatus === 'available').length;

  // Next available spin countdown style text
  const nextDailyResetString = "Next run starts in 4h 15m";

  // Quick action claim links
  const quickLinks = bonusLinks.filter(l => l.claimStatus === 'unclaimed').slice(0, 3);

  // Recent transactions list
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6" id="dashboard-overview-container">
      {/* Header section with live feed note & summary info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#151922] to-[#1E2533] p-6 rounded-2xl border border-gray-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Casino Command Center 
            <span className="bg-[#F4B860]/10 border border-[#F4B860]/30 text-[#F4B860] px-2.5 py-0.5 rounded-full text-xs font-semibold">
              v1.0.0 Live
            </span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Aggregated dashboard tracking {accounts.length} active social casinos. Daily bonuses running flawlessly.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-gray-400 block uppercase tracking-wider font-mono">Last Sync Time</span>
            <span className="text-sm font-semibold text-[#4ADE80] font-mono flex items-center justify-end gap-1.5 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-[#4ADE80] animate-pulse"></span>
              2026-06-15 19:44 (UTC)
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Key Performance Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="overview-metric-grid">
        {/* Card 1: Daily Free SC */}
        <div className="premium-card p-5 rounded-xl relative overflow-hidden group hover:border-[#4ADE80]/30 glow-emerald" id="card-sc-today">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#4ADE80]/5 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-gray-400 block uppercase tracking-wider font-semibold">SC Collected Today</span>
              <span className="text-3xl font-black text-[#4ADE80] font-mono mt-2 block tracking-tight">
                {totalFreeSCCollectedToday.toFixed(2)} SC
              </span>
            </div>
            <div className="bg-[#4ADE80]/10 p-2 rounded-lg text-[#4ADE80] border border-[#4ADE80]/15">
              <Coins className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-400 flex items-center gap-1.5">
            <span className="flex items-center justify-center p-0.5 bg-[#4ADE80]/10 rounded-full">
              <TrendingUp className="h-3 w-3 text-[#4ADE80]" />
            </span>
            <span className="text-[#4ADE80] font-bold">+$2.50</span> from daily login streaks
          </div>
        </div>

        {/* Card 2: SC Total month */}
        <div className="premium-card p-5 rounded-xl relative overflow-hidden group hover:border-[#F4B860]/30 glow-gold" id="card-sc-month">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#F4B860]/5 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-gray-400 block uppercase tracking-wider font-semibold">SC Collected - 30 Days</span>
              <span className="text-3xl font-black text-[#F4B860] font-mono mt-2 block tracking-tight">
                {totalFreeSCCollectedMonth.toFixed(2)} SC
              </span>
            </div>
            <div className="bg-[#F4B860]/10 p-2 rounded-lg text-[#F4B860] border border-[#F4B860]/15">
              <Gift className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-400 flex items-center gap-1">
            <span className="text-gray-500 font-mono">Average return</span>
            <span className="text-white font-bold font-mono">{(totalFreeSCCollectedMonth / 30).toFixed(2)} SC/Day</span>
          </div>
        </div>

        {/* Card 3: Free Spins */}
        <div className="premium-card p-5 rounded-xl relative overflow-hidden group hover:border-[#60A5FA]/30 glow-sky" id="card-spins">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#60A5FA]/5 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-gray-400 block uppercase tracking-wider font-semibold">Free Spins Available</span>
              <span className="text-3xl font-black text-[#60A5FA] font-mono mt-2 block tracking-tight">
                {availableFreeSpins} Spins
              </span>
            </div>
            <div className="bg-[#60A5FA]/10 p-2 rounded-lg text-[#60A5FA] border border-[#60A5FA]/15">
              <Zap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-400 flex items-center justify-between">
            <span className="text-gray-500">Across 4 casinos</span>
            <button 
              onClick={() => onNavigate('bonuses')}
              className="text-[#60A5FA] hover:text-[#60A5FA]/80 font-bold text-xs flex items-center gap-0.5"
            >
              Spin Center <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Card 4: Combine playthrough */}
        <div className="premium-card p-5 rounded-xl relative overflow-hidden group hover:border-purple-400/30 glow-purple" id="card-playthrough">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/5 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-gray-400 block uppercase tracking-wider font-semibold">Remaining Playthrough</span>
              <span className="text-3xl font-black text-purple-400 font-mono mt-2 block tracking-tight">
                {(totalPlaythroughRequired - totalPlaythroughCompleted).toFixed(2)} SC
              </span>
            </div>
            <div className="bg-purple-500/10 p-2 rounded-lg text-purple-400 border border-purple-550/15">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3">
            <div className="w-full h-1.5 bg-[#0B0D12] rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-sky-400 transition-all duration-500"
                style={{ width: `${Math.min(100, (totalPlaythroughCompleted / Math.max(1, totalPlaythroughRequired)) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 mt-1.5 font-mono">
              <span className="font-semibold text-gray-400">{totalPlaythroughCompleted.toFixed(0)} SC Cleared</span>
              <span>{totalPlaythroughRequired.toFixed(0)} SC Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Dashboard Financial Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-secondary-grid">
        {/* Left Column: Recharts Main Earnings Line Graph and quick claims */}
        <div className="lg:col-span-2 space-y-6">
          {/* Graphic Area */}
          <div className="premium-card p-6 rounded-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#F4B860]/5 to-transparent pointer-events-none" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#F4B860]" />
                  SC Historical Collection Trend
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">30-day cumulative earnings & daily claim activity</p>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono bg-black/35 p-2 rounded-lg border border-gray-800">
                <span className="flex items-center gap-2 text-gray-300">
                  <span className="w-2.5 h-2.5 rounded bg-[#F4B860] block ring-2 ring-[#F4B860]/20"></span> Cumulative: <span className="text-[#F4B860] font-bold">{totalFreeSCCollectedMonth.toFixed(2)} SC</span>
                </span>
                <span className="flex items-center gap-2 text-gray-300">
                  <span className="w-2.5 h-2.5 rounded bg-[#4ADE80] block ring-2 ring-[#4ADE80]/20"></span> Today: <span className="text-[#4ADE80] font-bold">{totalFreeSCCollectedToday.toFixed(2)} SC</span>
                </span>
              </div>
            </div>

            <div className="h-72 w-full font-mono text-[11px]" id="earnings-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={HISTORICAL_EARNINGS}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorSc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#4ADE80" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F4B860" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#F4B860" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2432" strokeOpacity={0.4} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#71717a" 
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#71717a" 
                    tickLine={false}
                    align="right"
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#151922', borderColor: '#3f3f46', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                    itemStyle={{ color: '#f4b860' }}
                  />
                  <Area 
                    name="Daily SC Claimed" 
                    type="monotone" 
                    dataKey="SC" 
                    stroke="#4ADE80" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorSc)" 
                  />
                  <Area 
                    name="Cumulative Sum (SC)" 
                    type="monotone" 
                    dataKey="Cumulative" 
                    stroke="#F4B860" 
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fillOpacity={1} 
                    fill="url(#colorCumulative)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Grid: Live Promo link list and quick collection panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Quick Claims Feed */}
            <div className="premium-card p-5 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5 uppercase tracking-wider font-mono">
                  <Gift className="h-4 w-4 text-[#F4B860]" />
                  Instantly Claimable Links
                </h3>
                <button 
                  onClick={() => onNavigate('links')}
                  className="text-xs text-[#F4B860] hover:text-[#F4B860]/80 font-bold flex items-center gap-0.5 cursor-pointer"
                >
                  See All ({activeBonusLinks})
                </button>
              </div>

              <div className="space-y-3">
                {quickLinks.map((link) => (
                  <div key={link.id} className="p-3 bg-black/20 rounded-lg border border-white/5 hover:border-[#F4B860]/20 transition flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{link.rewardValue}</span>
                        <span className="text-[10px] bg-sky-500/10 text-sky-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase border border-sky-500/10">
                          {link.rewardType}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1">Source: <span className="text-gray-400 font-medium">{link.source}</span></p>
                    </div>
                    <button
                      onClick={() => onClaimLink(link.id)}
                      className="bg-[#4ADE80] text-black hover:bg-[#3ec36e] px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-[0_4px_12px_rgba(74,222,128,0.2)]"
                    >
                      Collect <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Daily Claim Status lists */}
            <div className="premium-card p-5 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5 uppercase tracking-wider font-mono">
                  <Clock className="h-4 w-4 text-[#4ADE80]" />
                  Immediate Login Bonuses
                </h3>
                <span className="text-[10px] bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20 px-2 py-0.5 rounded-full font-bold">
                  {availableDailyBonusesCount} Available
                </span>
              </div>

              {/* Instant Claim Grid */}
              <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1 custom-scrollbar">
                {accounts.map(acc => {
                  return (
                    <div key={acc.id} className="flex justify-between items-center p-2.5 bg-black/20 rounded-lg border border-white/5 hover:border-[#F4B860]/10 transition">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full ring-2 ring-black shrink-0" style={{ backgroundColor: acc.color, boxShadow: `0 0 8px ${acc.color}` }} />
                        <span className="text-xs font-semibold text-gray-200">{acc.name}</span>
                      </div>
                      {acc.todayBonusStatus === 'available' ? (
                        <button
                          onClick={() => onCollectDaily(acc.id)}
                          className="bg-[#F4B860] hover:bg-[#e0a24f] text-black px-2.5 py-1 rounded-md text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-[0_4px_10px_rgba(244,184,96,0.15)]"
                        >
                          Claim 1.00 SC
                        </button>
                      ) : (
                        <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1 bg-black/30 px-2 py-1 rounded border border-white/5">
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          Done
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Combined Balances, Playthrough, and Recent Logs */}
        <div className="space-y-6">
          {/* fintech consolidated wallet view card */}
          <div className="premium-card bg-gradient-to-br from-[#1E2433] via-[#151922] to-[#0A0D14] p-6 rounded-xl shadow-2xl relative overflow-hidden border border-white/5 hover:border-[#F4B860]/20">
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-[#F4B860]/5 to-transparent pointer-events-none" />
            <h3 className="text-xs font-bold text-gray-400 block uppercase tracking-wider font-mono">Consolidated SC Value</h3>
            <span className="text-4xl font-extrabold text-white mt-1 block font-mono tracking-tight flex items-baseline gap-1.5">
              ${totalSCBalance.toFixed(2)}
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">USD VALUE</span>
            </span>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-white/5">
              <div>
                <span className="text-[10px] text-gray-400 block font-mono uppercase tracking-wider">Unclaimed Balance</span>
                <span className="text-base font-bold text-[#F4B860] font-mono mt-1 block flex items-center gap-1">
                  <Coins className="h-4 w-4 bg-[#F4B860]/10 text-[#F4B860] p-0.5 rounded" />
                  {availableDailyBonusesCount}.00 SC
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-mono uppercase tracking-wider">Total GC Tokens</span>
                <span className="text-base font-bold text-sky-450 font-mono mt-1 block text-sky-400">
                  {(totalGCBalance / 1000000).toFixed(2)}M GC
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 bg-black/10 p-3 rounded-lg border border-white/5">
              <div>
                <span className="text-[10px] text-gray-400 block font-mono uppercase tracking-wider">Realized Returns</span>
                <span className="text-base font-bold text-[#4ADE80] font-mono mt-0.5 block">
                  ${totalRedeemedSC.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-mono uppercase tracking-wider">Pending Release</span>
                <span className="text-base font-bold text-amber-500 font-mono mt-0.5 block flex items-center gap-1.5">
                  {pendingRedemptionSC > 0 ? (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#F59E0B]"></span>
                      ${pendingRedemptionSC.toFixed(2)}
                    </>
                  ) : '$0.00'}
                </span>
              </div>
            </div>

            <div className="mt-5 bg-black/30 p-3 rounded-lg border border-white/5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <PiggyBank className="h-3.5 w-3.5 text-zinc-400" /> Estimated Monthly Loop
                </span>
                <span className="text-[#4ADE80] font-bold font-mono">+$180.00 / mo</span>
              </div>
            </div>
          </div>

          {/* recent transaction flow logs */}
          <div className="premium-card p-5 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5 uppercase tracking-wider font-mono">
                <Coins className="h-4 w-4 text-[#F4B860]" />
                Recent Cashflow Stream
              </h3>
              <button 
                onClick={() => onNavigate('casinos')} // go to grids to view detail
                className="text-xs text-gray-400 hover:text-white underline cursor-pointer"
              >
                Show All
              </button>
            </div>

            <div className="space-y-3">
              {recentTransactions.map((tx) => {
                const isPositive = ['win', 'bonus_claim', 'promo_claim', 'deposit'].includes(tx.type);
                const isRedemption = tx.type === 'redemption';
                
                let textClass = 'text-white';
                let typeLabel = tx.type.replace('_', ' ');
                let symbol = '';

                if (isPositive) {
                  textClass = 'text-[#4ADE80]';
                  symbol = '+';
                } else if (isRedemption) {
                  textClass = 'text-[#60A5FA]';
                  symbol = '-';
                } else {
                  textClass = 'text-red-400';
                  symbol = '';
                }

                return (
                  <div key={tx.id} className="p-2.5 bg-black/20 hover:bg-black/35 transition rounded-lg border border-white/5 flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-gray-100">{tx.casinoName}</span>
                        <span className="text-[9px] bg-slate-800 text-gray-400 uppercase tracking-widest font-mono px-1.5 py-0.5 rounded-sm">
                          {typeLabel}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono block">{tx.timestamp}</span>
                    </div>
                    
                    <div className="text-right">
                      <span className={`font-mono font-bold ${textClass}`}>
                        {symbol}{Math.abs(tx.amountSC).toFixed(2)} SC
                      </span>
                      {tx.amountGC !== 0 && (
                        <span className="text-[10px] text-gray-550 font-mono block text-gray-500">
                          {symbol}{tx.amountGC.toLocaleString()} GC
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
