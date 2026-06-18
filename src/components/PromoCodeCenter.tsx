import React, { useState } from 'react';
import { PromoCode, CasinoAccount } from '../types';
import { 
  Plus, 
  Search, 
  ClipboardCheck, 
  Clipboard, 
  Star, 
  Archive, 
  Check, 
  Trash2, 
  AlertCircle,
  Tag,
  ThumbsUp,
  FileText
} from 'lucide-react';

interface PromoCodeCenterProps {
  accounts: CasinoAccount[];
  promoCodes: PromoCode[];
  onAddPromo: (promo: Partial<PromoCode>) => void;
  onUpdatePromo: (id: string, updated: Partial<PromoCode>) => void;
  onDeletePromo: (id: string) => void;
}

export default function PromoCodeCenter({
  accounts,
  promoCodes,
  onAddPromo,
  onUpdatePromo,
  onDeletePromo,
}: PromoCodeCenterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Code Form
  const [isAdding, setIsAdding] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newCasinoId, setNewCasinoId] = useState(accounts[0]?.id || '');
  const [newReward, setNewReward] = useState('1.00 SC');
  const [newExp, setNewExp] = useState('2026-07-30');
  const [newDialy, setNewDaily] = useState(true);

  // Filters
  const filteredPromos = promoCodes.filter(p => {
    const matchesSearch = p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.casinoName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesArchive = showArchived ? p.isArchived : !p.isArchived;
    const matchesFav = !onlyFavorites || p.isFavorite;

    return matchesSearch && matchesArchive && matchesFav;
  });

  const triggerCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newCasinoId) return;

    const casino = accounts.find(a => a.id === newCasinoId);
    onAddPromo({
      code: newCode.trim().toUpperCase(),
      casinoId: newCasinoId,
      casinoName: casino ? casino.name : 'Unknown Casino',
      dateAdded: '2026-06-15',
      expirationDate: newExp,
      rewardValue: newReward,
      dailyUsageAvailable: newDialy,
      isArchived: false,
      isFavorite: false,
      usedCount: 0,
    });

    setIsAdding(false);
    setNewCode('');
    setNewReward('1.00 SC');
  };

  const toggleFavorite = (id: string, current: boolean) => {
    onUpdatePromo(id, { isFavorite: !current });
  };

  const toggleArchive = (id: string, current: boolean) => {
    onUpdatePromo(id, { isArchived: !current });
  };

  const markAsUsed = (id: string, currentCount: number) => {
    onUpdatePromo(id, { 
      lastUsed: '2026-06-15 19:44',
      usedCount: currentCount + 1
    });
  };

  return (
    <div className="space-y-6" id="promo-code-system-container">
      {/* Promo banner info */}
      <div className="bg-gradient-to-r from-[#1E2533] to-[#151922] p-6 rounded-xl border border-gray-800 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Tag className="h-5 w-5 text-[#F4B860]" />
            Promotional Coupons Feed
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Redeem special promo codes on target platforms and track usage status, favoriting tags, and quick-copy keypads.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-[#F4B860] hover:bg-[#F4B860]/95 text-black px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Promo Code
        </button>
      </div>

      {/* Add code modal segment */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="bg-[#151922] p-5 rounded-xl border border-[#F4B860]/20 max-w-xl mx-auto space-y-4">
          <div className="border-b border-gray-800 pb-2">
            <h3 className="text-xs font-bold text-white">Add Fresh Active Bonus Promo Coupon</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-gray-400 mb-1">Coupon Promo Code *</label>
              <input
                type="text"
                required
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="e.g. MONSTERSPINS"
                className="bg-[#0B0D12] text-white p-2 border border-gray-800 rounded w-full outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Target Social Casino *</label>
              <select
                value={newCasinoId}
                onChange={(e) => setNewCasinoId(e.target.value)}
                className="bg-[#0B0D12] text-white p-2 border border-gray-800 rounded w-full outline-none"
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Claim Reward Value *</label>
              <input
                type="text"
                required
                value={newReward}
                onChange={(e) => setNewReward(e.target.value)}
                placeholder="e.g. 5.00 SC + 25 Spins"
                className="bg-[#0B0D12] text-white p-2 border border-gray-800 rounded w-full outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Expiration Date</label>
              <input
                type="date"
                value={newExp}
                onChange={(e) => setNewExp(e.target.value)}
                className="bg-[#0B0D12] text-white p-2 border border-gray-800 rounded w-full outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <input
              type="checkbox"
              id="dailyUseCheck"
              checked={newDialy}
              onChange={(e) => setNewDaily(e.target.checked)}
              className="rounded border-gray-800 text-amber-500 bg-black"
            />
            <label htmlFor="dailyUseCheck" className="text-gray-300">Daily reuse is available for this category of promotion</label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-850">
            <button
              onClick={() => setIsAdding(false)}
              className="bg-slate-800 px-3 py-1.5 text-xs font-bold text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#F4B860] text-black px-4 py-1.5 text-xs font-bold rounded"
            >
              Verify Code
            </button>
          </div>
        </form>
      )}

      {/* Selector Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#151922] p-4 rounded-xl border border-gray-800">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search coupon codes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0B0D12] text-xs text-white pl-9 pr-4 py-2 rounded-lg border border-gray-800 focus:border-[#F4B860] outline-none"
          />
        </div>

        <div className="flex items-center gap-4 text-xs font-mono font-bold">
          <label className="flex items-center gap-1.5 text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyFavorites}
              onChange={(e) => setOnlyFavorites(e.target.checked)}
              className="rounded"
            />
            Favorites Star ⭐
          </label>

          <label className="flex items-center gap-1.5 text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
              className="rounded"
            />
            Show Archived List
          </label>
        </div>
      </div>

      {/* Grid containing Coupon Elements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="coupons-grid-box">
        {filteredPromos.map(item => {
          const isCopied = copiedId === item.id;
          const isExpired = new Date(item.expirationDate) < new Date();

          return (
            <div 
              key={item.id} 
              className={`bg-[#151922] p-5 rounded-xl border relative overflow-hidden flex flex-col justify-between ${
                isExpired ? 'border-red-500/25 opacity-70' : 'border-gray-850 hover:border-gray-800'
              }`}
            >
              <div className="space-y-3.5">
                {/* Header title */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-gray-500 font-mono block uppercase">Target Channel</span>
                    <span className="text-white text-sm font-extrabold">{item.casinoName}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => toggleFavorite(item.id, item.isFavorite)}
                      className="text-gray-500 hover:text-amber-400 p-1"
                    >
                      <Star className={`h-4.5 w-4.5 ${item.isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
                    </button>
                    <button 
                      onClick={() => toggleArchive(item.id, item.isArchived)}
                      className="text-gray-500 hover:text-white p-1"
                    >
                      <Archive className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>

                {/* Big typography Coupon code card to copy */}
                <div className="bg-[#0B0D12] p-4 rounded-lg border border-gray-850 flex justify-between items-center font-mono relative">
                  <div>
                    <span className="text-[9px] text-gray-500 tracking-wider font-semibold uppercase block">Promo Coupon Code</span>
                    <span className="text-lg font-black text-white tracking-widest">{item.code}</span>
                  </div>

                  <button
                    onClick={() => triggerCopy(item.code, item.id)}
                    className={`p-2 rounded ${
                      isCopied ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#151922] text-[#F3B760] hover:text-white'
                    } transition border border-gray-800`}
                  >
                    {isCopied ? <ClipboardCheck className="h-5 w-5" /> : <Clipboard className="h-5 w-5" />}
                  </button>
                </div>

                {/* Value statistics details */}
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Coupon Benefit:</span>
                    <span className="text-[#4ADE80] font-bold">{item.rewardValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Usage Limit:</span>
                    <span className="text-gray-300">
                      {item.dailyUsageAvailable ? 'REUSABLE EVERY 24H' : 'SINGLE USE CLAIM ONLY'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Expiration:</span>
                    <span className="text-gray-300">{item.expirationDate}</span>
                  </div>
                  {item.lastUsed && (
                    <div className="flex justify-between text-[11px] text-gray-500">
                      <span>Last Redeemed:</span>
                      <span>{item.lastUsed}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom control metrics bar */}
              <div className="border-t border-gray-850 pt-4 mt-4 flex justify-between items-center">
                <span className="text-[10px] text-gray-500 font-mono">
                  {item.usedCount} total usages tracked
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => markAsUsed(item.id, item.usedCount)}
                    className="p-1 px-3 bg-slate-800 hover:bg-slate-750 text-white text-[11px] font-mono rounded"
                  >
                    Mark Used
                  </button>
                  <button
                    onClick={() => onDeletePromo(item.id)}
                    className="p-1 px-2 text-red-400 hover:text-white"
                    title="Delete Code"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
