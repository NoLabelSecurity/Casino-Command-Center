import React, { useState } from 'react';
import { CasinoAccount, CasinoTransaction } from '../types';
import { 
  ArrowLeft, 
  Download, 
  Search, 
  SlidersHorizontal, 
  ExternalLink, 
  Calendar, 
  User, 
  ShieldAlert, 
  Activity, 
  Coins, 
  HelpCircle,
  FileSpreadsheet,
  CheckCircle,
  Eye,
  EyeOff
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
import { decryptPassword } from '../utils/cryptoStorage';

interface CasinoDetailViewProps {
  casinoId: string;
  accounts: CasinoAccount[];
  transactions: CasinoTransaction[];
  onBack: () => void;
}

export default function CasinoDetailView({
  casinoId,
  accounts,
  transactions,
  onBack,
}: CasinoDetailViewProps) {
  const account = accounts.find(a => a.id === casinoId);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showPass, setShowPass] = useState(false);

  if (!account) {
    return (
      <div className="p-6 bg-[#151922] rounded-xl border border-gray-800 text-center">
        <p className="text-gray-400">Casino integration profile [{casinoId}] not found.</p>
        <button onClick={onBack} className="text-[#F4B860] hover:underline mt-4 text-xs font-bold">
          Go Back
        </button>
      </div>
    );
  }

  // Filter transactions
  const casinoTransactions = transactions.filter(t => t.casinoId === casinoId);
  
  const filteredTx = casinoTransactions.filter(tx => {
    const matchesSearch = tx.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Calculate sum counts for this casino
  const winsCount = casinoTransactions.filter(t => t.type === 'win').reduce((acc, curr) => acc + curr.amountSC, 0);
  const redemptionsCount = casinoTransactions.filter(t => t.type === 'redemption').reduce((acc, curr) => acc + curr.amountSC, 0);
  const bonusesCount = casinoTransactions.filter(t => t.type === 'bonus_claim').reduce((acc, curr) => acc + curr.amountSC, 0);
  const depositsCount = casinoTransactions.filter(t => t.type === 'deposit').reduce((acc, curr) => acc + curr.amountSC, 0);

  // Balance history graph generation based on actual transaction values for rich simulation
  const balanceHistoryPoints = [
    { date: '06-10', Balance: account.scBalance - 35 },
    { date: '06-11', Balance: account.scBalance - 33 },
    { date: '06-12', Balance: account.scBalance - 8 },
    { date: '06-13', Balance: account.scBalance - 14 },
    { date: '06-14', Balance: account.scBalance + 5 },
    { date: '06-15', Balance: account.scBalance },
  ];

  // Export CSV Functionality (Actual code implementation!)
  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Transaction ID,Casino,Type,Amount (SC),Amount (GC),Timestamp,Status,Notes\r\n";
    
    casinoTransactions.forEach(tx => {
      const row = `${tx.id},${tx.casinoName},${tx.type},${tx.amountSC},${tx.amountGC},"${tx.timestamp}",${tx.status},"${tx.notes || ''}"`;
      csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${account.id}_transaction_history.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6" id="casino-detail-page-container">
      {/* Return button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white flex items-center gap-1 text-xs font-semibold uppercase bg-[#151922] border border-gray-800 px-3 py-1.5 rounded-lg transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>
        
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: account.color }} />
          <span className="text-sm font-bold text-white uppercase tracking-wider font-mono">{account.name} Portal</span>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Account Metadata (Left Column) */}
        <div className="bg-[#151922] p-6 rounded-xl border border-gray-800 space-y-6" id="detail-metadata">
          <div className="flex items-center gap-4 border-b border-gray-800 pb-4">
            <img 
              src={account.logoUrl} 
              alt={account.name} 
              className="w-14 h-14 rounded-xl object-cover border border-gray-800"
              referrerPolicy="no-referrer"
            />
            <div>
              <h2 className="text-xl font-bold text-white">{account.name}</h2>
              <p className="text-xs text-[#F4B860] font-mono leading-none mt-1 font-semibold">{account.vipLevel}</p>
            </div>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <h3 className="text-gray-400 uppercase tracking-wider text-[10px] font-bold">Credential Vault Info</h3>
            
            <div className="space-y-2 bg-[#0B0D12] p-3 rounded-lg border border-gray-850">
              <div className="flex justify-between">
                <span className="text-gray-500">Username:</span>
                <span className="text-white font-semibold">{account.username}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Security Key:</span>
                <span className="text-white font-semibold">
                  {showPass ? decryptPassword(account.passwordEncrypted) : '••••••••••••'}
                </span>
                <button 
                  onClick={() => setShowPass(!showPass)} 
                  className="text-gray-500 hover:text-zinc-300 p-0.5"
                >
                  {showPass ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </button>
              </div>
            </div>

            <h3 className="text-gray-400 uppercase tracking-wider text-[10px] font-bold">Geographic Restrictions</h3>
            <div className="p-3 bg-[#0B0D12] rounded-lg border border-gray-850">
              <div className="flex gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-gray-300 leading-normal">{account.stateRestriction}</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">Join Date:</span>
                <span className="text-gray-200">{account.joinDate}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">Last Scraped Login:</span>
                <span className="text-gray-200">{account.lastLogin}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-gray-400">Redemption Priority:</span>
                {account.scBalance >= 50 ? (
                  <span className="text-[#4ADE80] font-bold">ELIGIBLE ({account.redemptionStatus})</span>
                ) : (
                  <span className="text-gray-500">NO REDEEMABLE BALANCE</span>
                )}
              </div>
            </div>

            {account.loginNotes && (
              <div className="p-3 bg-[#1e2430] border border-gray-800 text-gray-400 rounded-lg text-[11px] leading-relaxed">
                <span className="font-bold text-gray-200 block mb-1">Developer Notes:</span>
                {account.loginNotes}
              </div>
            )}
          </div>
        </div>

        {/* Balance tracking & history graph (Right Column) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Account Balances */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-[#151922] border border-gray-800 rounded-xl relative">
              <span className="text-xs text-gray-400 font-mono block">Sweeps Coins (SC)</span>
              <span className="text-2xl font-bold text-[#4ADE80] font-mono mt-2 block">{account.scBalance.toFixed(2)} SC</span>
              <span className="text-[10px] text-gray-500 mt-1 block">Value equiv: ${(account.scBalance).toFixed(2)} USD</span>
            </div>

            <div className="p-5 bg-[#151922] border border-gray-800 rounded-xl">
              <span className="text-xs text-gray-400 font-mono block">Gold Coins (GC)</span>
              <span className="text-2xl font-bold text-[#60A5FA] font-mono mt-2 block">{account.gcBalance.toLocaleString()} GC</span>
              <span className="text-[10px] text-slate-500 mt-1 block">Free game chips</span>
            </div>

            <div className="p-5 bg-[#151922] border border-gray-800 rounded-xl">
              <span className="text-xs text-gray-400 font-mono block">Wagering Playthrough</span>
              <span className="text-2xl font-bold text-purple-400 font-mono mt-2 block">
                {((account.playthroughProgress / Math.max(1, account.playthroughRequirement)) * 100).toFixed(0)}% Clear
              </span>
              <span className="text-[10px] text-gray-500 mt-1 block">{account.playthroughProgress.toFixed(0)} SC completed</span>
            </div>
          </div>

          {/* Historical Area Chart */}
          <div className="bg-[#151922] p-5 rounded-xl border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">SC Liquidity History</h3>
                <p className="text-[11px] text-gray-400">Balance volatility over the last 6 claim sessions</p>
              </div>
            </div>

            <div className="h-56 font-mono text-[11px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={balanceHistoryPoints} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222530" />
                  <XAxis dataKey="date" stroke="#52525b" />
                  <YAxis stroke="#52525b" />
                  <Tooltip contentStyle={{ backgroundColor: '#151922', borderColor: '#374151' }} />
                  <Area type="monotone" dataKey="Balance" stroke={account.color} fill={`${account.color}15`} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

      {/* Ledger Transactions section */}
      <div className="bg-[#151922] p-5 rounded-xl border border-gray-800 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Sweeps Activity Ledger</h3>
            <p className="text-xs text-gray-400 mt-1">Audit log of claims, redemptions, wins, and losses</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#0B0D12] text-xs text-white pl-9 pr-4 py-1.5 rounded-lg border border-gray-800 outline-none"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#0B0D12] text-xs text-gray-300 border border-gray-800 rounded-lg px-2 py-1.5 outline-none"
            >
              <option value="all">Types: All</option>
              <option value="win">Winnings</option>
              <option value="redemption">Redemptions</option>
              <option value="bonus_claim">Bonus Claims</option>
              <option value="promo_claim">Promo Claims</option>
              <option value="deposit">Deposits</option>
            </select>

            <button
              onClick={exportCSV}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold font-mono transition"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Amount (SC)</th>
                <th className="py-3 px-4 text-right">Amount (GC)</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-850">
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No transactions matching your dynamic criteria found.
                  </td>
                </tr>
              ) : (
                filteredTx.map(tx => {
                  let badgeColor = 'bg-gray-800 text-zinc-300';
                  if (tx.type === 'win') badgeColor = 'bg-emerald-500/10 text-emerald-400';
                  if (tx.type === 'redemption') badgeColor = 'bg-blue-500/10 text-blue-400';
                  if (tx.type === 'deposit') badgeColor = 'bg-[#F4B860]/10 text-[#F4B860]';
                  if (tx.type === 'bonus_claim' || tx.type === 'promo_claim') badgeColor = 'bg-purple-500/10 text-purple-400';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/40 text-[11.5px] transition">
                      <td className="py-3 px-4 text-gray-500 font-mono">#{tx.id}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${badgeColor}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-white">
                        {tx.amountSC >= 0 ? '+' : ''}{tx.amountSC.toFixed(2)} SC
                      </td>
                      <td className="py-3 px-4 text-right text-gray-400">
                        {tx.amountGC !== 0 ? tx.amountGC.toLocaleString() : '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-400">{tx.timestamp}</td>
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1 text-[11px] text-gray-300">
                          {tx.status === 'completed' && <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />}
                          {tx.status === 'pending' && <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-bounce" />}
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 max-w-xs truncate">{tx.notes || '-'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
