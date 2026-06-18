import React, { useState } from 'react';
import { CasinoAccount, CasinoTransaction } from '../types';
import { 
  Gift, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  DollarSign, 
  Sparkles, 
  ArrowUpDown,
  Filter,
  Flame,
  MousePointerClick
} from 'lucide-react';

interface DailyBonusCenterProps {
  accounts: CasinoAccount[];
  transactions: CasinoTransaction[];
  onCollectDaily: (id: string) => void;
}

type SortOption = 'highest-value' | 'expiring-soon' | 'newest';

export default function DailyBonusCenter({
  accounts,
  transactions,
  onCollectDaily,
}: DailyBonusCenterProps) {
  const [sortBy, setSortBy] = useState<SortOption>('highest-value');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'claimed'>('all');

  // Map accounts to mock bonus structures
  const bonusItems = accounts.map(acc => {
    // Generate customizable details based on actual settings
    const bonusAmount = acc.id === 'stake-us' ? 1.00 : acc.id === 'wow-vegas' ? 0.30 : 1.00;
    const spins = acc.freeSpinsAvailable > 0 ? acc.freeSpinsAvailable : undefined;
    const isAvailable = acc.todayBonusStatus === 'available';

    // Mock expiration dates
    let expirationText = "24-Hour Lifetime Claim window";
    let hoursLeft = 14;
    if (acc.id === 'pulsz-casino') {
      hoursLeft = 2;
      expirationText = "Expiring in 2 hours!";
    } else if (acc.id === 'stake-us') {
      hoursLeft = 8;
      expirationText = "Expiring in 8 hours";
    }

    return {
      id: acc.id,
      name: acc.name,
      logoUrl: acc.logoUrl,
      color: acc.color,
      amountSC: bonusAmount,
      spins,
      claimStatus: acc.todayBonusStatus,
      isAvailable,
      expirationText,
      hoursLeft,
      vipLevel: acc.vipLevel,
    };
  });

  // Filters
  const filteredBonus = bonusItems.filter(item => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'available') return item.isAvailable;
    if (filterStatus === 'claimed') return !item.isAvailable;
    return true;
  });

  // Sort logic
  const sortedBonus = [...filteredBonus].sort((a, b) => {
    if (sortBy === 'highest-value') {
      return b.amountSC - a.amountSC;
    }
    if (sortBy === 'expiring-soon') {
      return a.hoursLeft - b.hoursLeft;
    }
    if (sortBy === 'newest') {
      // alphabetically or mock rank based on joins
      return b.name.localeCompare(a.name);
    }
    return 0;
  });

  // Total collected from logs
  const totalCollectedToday = transactions
    .filter(t => t.type === 'bonus_claim' && t.timestamp.startsWith('2026-06-15'))
    .reduce((acc, curr) => acc + curr.amountSC, 0);

  return (
    <div className="space-y-6" id="daily-bonus-center">
      {/* Alert Header Banner */}
      <div className="bg-gradient-to-r from-[#1E2533] to-[#151922] p-6 rounded-xl border border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Flame className="text-[#F4B860] h-5 w-5 fill-[#F4B860]" />
            Unified Daily Bonus Center
          </h2>
          <p className="text-xs text-gray-400">
            Social casinos unlock free cash claims every 24 hours. Manage logins and activate credits in one click.
          </p>
        </div>

        <div className="bg-[#0B0D12] px-5 py-3 rounded-lg border border-gray-850 flex items-center gap-4 text-center">
          <div>
            <span className="text-[10px] text-gray-500 uppercase block font-mono">Streak Earnings Today</span>
            <span className="text-lg font-bold text-[#4ADE80] font-mono mt-0.5 block">{totalCollectedToday.toFixed(2)} SC</span>
          </div>
          <div className="w-px h-8 bg-gray-800" />
          <div className="text-left">
            <span className="text-[10px] text-gray-500 uppercase block font-mono">Status Tracker</span>
            <span className="text-xs text-white font-bold block mt-1 font-mono">
              {accounts.filter(a => a.todayBonusStatus === 'available').length} / {accounts.length} Left to Claim
            </span>
          </div>
        </div>
      </div>

      {/* Sorting Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#151922] p-4 rounded-xl border border-gray-800">
        <div className="flex items-center gap-2 text-xs">
          <Filter className="h-4 w-4 text-[#F4B860]" />
          <span className="text-gray-400">Filter Claim State:</span>
          <div className="flex bg-[#0B0D12] rounded border border-gray-800 p-0.5">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 text-[10.5px] rounded-lg transition font-mono ${filterStatus === 'all' ? 'bg-[#F4B860] text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              ALL
            </button>
            <button
              onClick={() => setFilterStatus('available')}
              className={`px-3 py-1 text-[10.5px] rounded-lg transition font-mono ${filterStatus === 'available' ? 'bg-[#4ADE80] text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              AVAILABLE ({bonusItems.filter(b => b.isAvailable).length})
            </button>
            <button
              onClick={() => setFilterStatus('claimed')}
              className={`px-3 py-1 text-[10.5px] rounded-lg transition font-mono ${filterStatus === 'claimed' ? 'bg-zinc-800 text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              CLAIMED
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <ArrowUpDown className="h-4 w-4 text-zinc-500" />
          <span className="text-gray-400">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="sleek-input text-[#F4B860] px-2.5 py-1.5 outline-none font-bold cursor-pointer"
          >
            <option value="highest-value">💸 Highest Cash Reward</option>
            <option value="expiring-soon">⏳ Expiring Soonest</option>
            <option value="newest">🎰 Sort Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Dynamic Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="daily-bonus-feed-box">
        {sortedBonus.map(item => {
          const urgentStyle = item.hoursLeft <= 3 && item.isAvailable;

          return (
            <div 
              key={item.id}
              className={`premium-card p-5 rounded-xl transition flex flex-col justify-between ${
                urgentStyle ? 'border-red-500/50 shadow-[0_4px_16px_rgba(239,68,68,0.15)] bg-red-950/5' : 'hover:border-zinc-700'
              }`}
            >
              <div className="space-y-4">
                {/* Name Row */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.logoUrl} 
                      alt={item.name} 
                      className="w-10 h-10 rounded-lg object-cover bg-gray-950 border border-white/5" 
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="font-bold text-white text-sm font-mono uppercase">{item.name}</h3>
                      <span className="text-[10px] text-[#F4B860] font-mono leading-none font-semibold">{item.vipLevel}</span>
                    </div>
                  </div>

                  <span className={`text-[9px] uppercase font-bold tracking-wider font-mono px-2 py-0.5 rounded border ${
                    item.isAvailable ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-850 text-zinc-500 border-white/5'
                  }`}>
                    {item.claimStatus}
                  </span>
                </div>

                {/* Rewards display */}
                <div className="bg-black/35 p-3 rounded-lg border border-white/5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-gray-500 uppercase block font-mono font-semibold">Claimable Reward</span>
                    <span className="text-xl font-black text-white font-mono flex items-center gap-1">
                      <DollarSign className="h-4.5 w-4.5 text-[#4ADE80]" />
                      {item.amountSC.toFixed(2)} SC
                    </span>
                  </div>

                  {item.spins && (
                    <div className="text-right space-y-0.5">
                      <span className="text-[9px] text-gray-400 block uppercase font-mono">Freespins Included</span>
                      <span className="text-xs font-bold text-[#60A5FA] font-mono block bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded uppercase tracking-wider text-[9px]">
                        +{item.spins} Extra Spins
                      </span>
                    </div>
                  )}
                </div>

                {/* Countdown and warnings */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 flex items-center gap-1.5 font-semibold">
                    <Clock className="h-3.5 w-3.5 text-zinc-500" /> Deadline Check:
                  </span>
                  <span className={`font-mono text-xs font-bold ${urgentStyle ? 'text-red-400 animate-pulse' : 'text-gray-400'}`}>
                    {item.expirationText}
                  </span>
                </div>
              </div>

              {/* Claim Action */}
              <div className="mt-5 pt-4 border-t border-white/5">
                {item.isAvailable ? (
                  <button
                    onClick={() => onCollectDaily(item.id)}
                    className="w-full bg-[#4ADE80] text-black hover:bg-[#3ec36e] p-2.5 rounded-lg text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer shadow-[0_4px_12px_rgba(74,222,128,0.2)]"
                  >
                    <MousePointerClick className="h-4 w-4" /> Collect SC Daily Reward
                  </button>
                ) : (
                  <div className="w-full bg-zinc-900 border border-white/5 text-gray-400 p-2.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 select-none">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Collected and Deposited to Wallet!
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
