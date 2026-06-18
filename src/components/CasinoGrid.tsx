import React, { useState } from 'react';
import { CasinoAccount } from '../types';
import { 
  Plus, 
  Search, 
  ExternalLink, 
  Activity, 
  Clock, 
  Check, 
  Eye, 
  EyeOff, 
  Copy, 
  Settings, 
  Edit, 
  FileText, 
  AlertTriangle, 
  Dribbble, 
  Users, 
  Lock,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { decryptPassword, encryptPassword } from '../utils/cryptoStorage';

interface CasinoGridProps {
  accounts: CasinoAccount[];
  onSelectCasino: (id: string) => void;
  onCollectDaily: (id: string) => void;
  onAddAccount: (account: Partial<CasinoAccount>) => void;
  onUpdateAccount: (id: string, updated: Partial<CasinoAccount>) => void;
}

export default function CasinoGrid({
  accounts,
  onSelectCasino,
  onCollectDaily,
  onAddAccount,
  onUpdateAccount,
}: CasinoGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [healthFilter, setHealthFilter] = useState<'all' | 'excellent' | 'good' | 'warning'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'claimed' | 'available'>('all');
  
  // Show password list map
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  
  // Edit forms
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState('');
  const [editUser, setEditUser] = useState('');
  const [editPass, setEditPass] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editSC, setEditSC] = useState(0);
  const [editGC, setEditGC] = useState(0);

  // Add Mode forms
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newUser, setNewUser] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newSc, setNewSc] = useState(1.00);

  // Actions
  const togglePassword = (id: string) => {
    setShowPasswordMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    // Silent notify
  };

  const startEdit = (acc: CasinoAccount) => {
    setEditingId(acc.id);
    setEditUrl(acc.casinoUrl);
    setEditUser(acc.username);
    setEditPass(decryptPassword(acc.passwordEncrypted));
    setEditNotes(acc.loginNotes);
    setEditSC(acc.scBalance);
    setEditGC(acc.gcBalance);
  };

  const saveEdit = (id: string) => {
    onUpdateAccount(id, {
      casinoUrl: editUrl,
      username: editUser,
      passwordEncrypted: encryptPassword(editPass),
      loginNotes: editNotes,
      scBalance: Number(editSC),
      gcBalance: Number(editGC),
    });
    setEditingId(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    
    onAddAccount({
      name: newName,
      casinoUrl: newUrl || 'https://www.google.com',
      username: newUser || 'GuestAccount',
      passwordEncrypted: encryptPassword(newPass || 'Password123!'),
      loginNotes: newNotes || 'Added manually',
      scBalance: Number(newSc),
      gcBalance: 10000,
    });

    setIsAdding(false);
    // reset
    setNewName('');
    setNewUrl('');
    setNewUser('');
    setNewPass('');
    setNewNotes('');
    setNewSc(1.00);
  };

  // Filters
  const filteredAccounts = accounts.filter(acc => {
    const matchesSearch = acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          acc.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesHealth = healthFilter === 'all' || acc.accountHealth === healthFilter;
    
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'claimed' && acc.todayBonusStatus === 'claimed') ||
                          (statusFilter === 'available' && acc.todayBonusStatus === 'available');

    return matchesSearch && matchesHealth && matchesStatus;
  });

  return (
    <div className="space-y-6" id="casino-grid-main">
      {/* Filters bar */}
      <div className="premium-card p-4 rounded-xl flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-gray-500" />
          <input
            type="text"
            placeholder="Search casinos by name, username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sleek-input pl-10 pr-4 py-2 text-sm text-gray-200 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={healthFilter}
            onChange={(e) => setHealthFilter(e.target.value as any)}
            className="sleek-input text-xs text-gray-300 px-3 py-2 outline-none font-semibold cursor-pointer"
          >
            <option value="all">🛡️ Health: All</option>
            <option value="excellent">🟢 Excellent Health</option>
            <option value="good">🟡 Good Health</option>
            <option value="warning">🔴 Warning Status</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="sleek-input text-xs text-gray-300 px-3 py-2 outline-none font-semibold cursor-pointer"
          >
            <option value="all">🪙 Bonus State: All</option>
            <option value="available">🟢 Available Bonus</option>
            <option value="claimed">⚪ Claimed Today</option>
          </select>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="bg-[#F4B860] hover:bg-[#e0a24f] text-black px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[0_4px_12px_rgba(244,184,96,0.25)]"
          >
            <Plus className="h-4 w-4" /> Add Casino
          </button>
        </div>
      </div>

      {/* Manual Add Card Form modal drop-in */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="premium-card p-6 rounded-xl shadow-xl space-y-4 max-w-2xl mx-auto border-[#F4B860]/20 glow-gold">
          <div className="border-b border-gray-800 pb-3 flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-mono uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-[#F4B860]" /> Add New Social Casino Integration
            </h3>
            <button type="button" onClick={() => setIsAdding(false)} className="text-xs text-gray-400 hover:text-white cursor-pointer">Cancel</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-gray-400 mb-1">Casino Name *</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Pulsz, Crown Coins, Zula"
                className="w-full sleek-input p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-gray-400 mb-1">Casino Portal URL</label>
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://www.example.com"
                className="w-full sleek-input p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-gray-400 mb-1">Account Username</label>
              <input
                type="text"
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
                className="w-full sleek-input p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-gray-400 mb-1">Account Password (will be encrypted on save)</label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full sleek-input p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-gray-400 mb-1">Initial SC Balance</label>
              <input
                type="number"
                step="0.01"
                value={newSc}
                onChange={(e) => setNewSc(Number(e.target.value))}
                className="w-full sleek-input p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-gray-400 mb-1">Account Restriction Notes</label>
              <input
                type="text"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="e.g., Excluded in Wash, NY"
                className="w-full sleek-input p-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#F4B860] hover:bg-[#e0a24f] text-xs font-bold text-black rounded-lg transition cursor-pointer shadow-[0_4px_12px_rgba(244,184,96,0.2)]"
            >
              Verify & Save Integration
            </button>
          </div>
        </form>
      )}

      {/* Main Grid display of Casino tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="tiles-grid-box">
        {filteredAccounts.map(acc => {
          const isEditing = editingId === acc.id;
          const showPass = showPasswordMap[acc.id] || false;
          
          let healthBadgeColor = 'bg-emerald-550/10 text-emerald-400 border-emerald-500/20';
          if (acc.accountHealth === 'warning') healthBadgeColor = 'bg-amber-550/10 text-amber-500 border-amber-500/20';
          if (acc.accountHealth === 'critical') healthBadgeColor = 'bg-red-550/10 text-red-500 border-red-500/20';

          return (
            <div 
              key={acc.id} 
              className="premium-card rounded-xl hover:border-gray-600 transition flex flex-col justify-between overflow-hidden relative group"
            >
              {/* Highlight bar with Casino aesthetic color */}
              <div className="h-1 w-full" style={{ backgroundColor: acc.color, boxShadow: `0 2px 8px ${acc.color}35` }} />

              <div className="p-5 flex-1 space-y-4">
                {/* Header row with logo & title */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <img 
                      src={acc.logoUrl} 
                      alt={acc.name} 
                      className="w-10 h-10 rounded-lg object-cover bg-gray-950 border border-white/5" 
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="font-bold text-white text-base tracking-tight flex items-center gap-1.5 uppercase font-mono">
                        {acc.name}
                        {acc.accountStatus === 'pending_verification' && (
                          <span className="text-[8px] bg-amber-500/10 border border-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded font-bold tracking-wider font-mono">
                            Pending KYC
                          </span>
                        )}
                      </h3>
                      <span className="text-[10px] text-gray-400 block font-mono">{acc.vipLevel}</span>
                    </div>
                  </div>

                  <span className={`text-[9px] uppercase font-bold tracking-wide font-mono px-2 py-0.5 rounded border ${healthBadgeColor}`}>
                    {acc.accountHealth}
                  </span>
                </div>

                {/* Balance display section */}
                <div className="grid grid-cols-2 gap-3 bg-black/40 p-3 rounded-lg border border-white/5">
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase block font-mono font-semibold">SC Cash Balance</span>
                    <span className="text-lg font-black text-[#4ADE80] font-mono mt-0.5 block tracking-tight">
                      {acc.scBalance.toFixed(2)} SC
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase block font-mono font-semibold">GC Tokens</span>
                    <span className="text-[#60A5FA] text-xs font-bold font-mono mt-1 block">
                      {acc.gcBalance.toLocaleString()} GC
                    </span>
                  </div>
                </div>

                {/* Subdued Credentials & Accessors */}
                {isEditing ? (
                  <div className="space-y-2 p-3 bg-[#0B0D12] rounded border border-white/5">
                    <div>
                      <label className="text-[9px] text-gray-400 font-mono block">Edit URL</label>
                      <input 
                        className="bg-black text-white text-xs p-1 sleek-input w-full" 
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-gray-400 font-mono block">Editing Username</label>
                      <input 
                        className="bg-black text-white text-xs p-1 sleek-input w-full" 
                        value={editUser}
                        onChange={(e) => setEditUser(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-gray-400 font-mono block">Editing Password</label>
                      <input 
                        type="text"
                        className="bg-black text-white text-xs p-1 sleek-input w-full" 
                        value={editPass}
                        onChange={(e) => setEditPass(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                      <button 
                        type="button" 
                        onClick={() => setEditingId(null)} 
                        className="bg-gray-800 hover:bg-gray-700 text-[10px] px-2 py-1 text-white rounded font-mono cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        type="button" 
                        onClick={() => saveEdit(acc.id)} 
                        className="bg-amber-500 hover:bg-amber-400 text-[10px] font-bold px-2.5 py-1 text-black rounded font-mono cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-gray-400">
                      <span className="flex items-center gap-1">
                        <Lock className="h-3 w-3 text-gray-500" /> credentials:
                      </span>
                      <span className="font-mono text-zinc-300 font-semibold">{acc.username}</span>
                    </div>

                    <div className="flex justify-between items-center text-gray-400">
                      <span>password:</span>
                      <div className="flex items-center gap-1 font-mono">
                        <span className="text-zinc-300">
                          {showPass ? decryptPassword(acc.passwordEncrypted) : '•••••••••'}
                        </span>
                        <button 
                          onClick={() => togglePassword(acc.id)}
                          className="text-gray-500 hover:text-white p-0.5 cursor-pointer"
                        >
                          {showPass ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </button>
                        <button 
                          onClick={() => copyToClipboard(decryptPassword(acc.passwordEncrypted), acc.name)}
                          className="text-gray-500 hover:text-white p-0.5 cursor-pointer"
                          title="Copy Password"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <div className="h-px bg-white/5 my-2" />

                    {/* Progress with playthrough */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Playthrough Requirement</span>
                        <span className="font-bold text-gray-300 font-mono text-[9px]">
                          {acc.playthroughProgress.toFixed(0)} / {acc.playthroughRequirement.toFixed(0)} SC
                        </span>
                      </div>
                      <div className="w-full h-1 bg-black/40 rounded overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-350" 
                          style={{ width: `${Math.min(100, (acc.playthroughProgress / Math.max(1, acc.playthroughRequirement)) * 100)}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Exclusive bonus statuses */}
                <div className="pt-2 flex justify-between items-center text-xs">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-zinc-500" /> Last Bonus Claim
                  </span>
                  <span className="font-mono text-gray-400 font-semibold text-[10.5px]">{acc.lastCollectionTime.substring(5)}</span>
                </div>
              </div>

              {/* Bottom actionable container */}
              <div className="bg-black/30 border-t border-white/5 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <a 
                    href={acc.casinoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/5 transition"
                    title="Open Casino Site"
                  >
                    <ExternalLink className="h-4.5 w-4.5" />
                  </a>
                  <button 
                    onClick={() => startEdit(acc)}
                    className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/5 transition cursor-pointer"
                    title="Edit Credentials"
                  >
                    <Settings className="h-4.5 w-4.5" />
                  </button>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => onSelectCasino(acc.id)}
                    className="border border-zinc-700 hover:border-zinc-500 hover:bg-white/5 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    Details <ChevronRight className="h-3.5 w-3.5" />
                  </button>

                  {acc.todayBonusStatus === 'available' ? (
                    <button 
                      onClick={() => onCollectDaily(acc.id)}
                      className="bg-[#4ADE80] text-black hover:bg-[#3ec36e] px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1 cursor-pointer shadow-[0_4px_10px_rgba(74,222,128,0.2)]"
                    >
                      Collect Daily
                    </button>
                  ) : (
                    <div className="bg-[#4ADE80]/5 text-[#4ADE80] border border-[#4ADE80]/15 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 font-mono">
                      <Check className="h-3 w-3" /> Claimed
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

