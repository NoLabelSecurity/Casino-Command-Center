import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line 
} from 'recharts';
import { 
  HISTORICAL_EARNINGS, 
  CASINO_EFFICIENCY, 
  REDEMPTION_SUCCESS_RATES, 
  MONTHLY_FORECAST 
} from '../data/mockData';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users, 
  Zap, 
  ShieldCheck, 
  Award,
  CircleDollarSign
} from 'lucide-react';

export default function AnalyticsView() {
  // Aggregate stats based on our rich historical arrays
  const totalCollectedAllTime = HISTORICAL_EARNINGS.reduce((acc, curr) => acc + curr.SC, 0);
  const averageDailyCollected = totalCollectedAllTime / HISTORICAL_EARNINGS.length;
  
  // Weekly aggregation calculation (last 7 days of array)
  const last7Days = HISTORICAL_EARNINGS.slice(-7);
  const totalWeeklyCollected = last7Days.reduce((acc, curr) => acc + curr.SC, 0);

  // Yearly estimates extrapolation
  const projectedYearlyCollected = averageDailyCollected * 365;

  return (
    <div className="space-y-6" id="analytics-view-container">
      {/* Header section */}
      <div className="bg-gradient-to-r from-[#151922] to-[#1E2533] p-6 rounded-xl border border-gray-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#F4B860]" />
          Financial & Performance Analytics
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Perform depth inspections on social sweep allocations, return efficiency ratios, and projected cash flows.
        </p>
      </div>

      {/* Aggregate numerical cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat 1 */}
        <div className="premium-card p-5 rounded-xl border border-white/5 relative overflow-hidden">
          <span className="text-[10px] text-gray-400 block uppercase font-mono font-bold tracking-wider">Daily Mean SC</span>
          <span className="text-3xl font-black text-white font-mono mt-2 block tracking-tight">${averageDailyCollected.toFixed(2)}</span>
          <p className="text-[10px] text-[#4ADE80] font-medium mt-2 flex items-center gap-1">🟢 Stable rate baseline</p>
        </div>

        {/* Stat 2 */}
        <div className="premium-card p-5 rounded-xl border border-white/5 relative overflow-hidden group hover:border-[#F4B860]/20 glow-gold">
          <span className="text-[10px] text-gray-400 block uppercase font-mono font-bold tracking-wider">Total Cumulative SC</span>
          <span className="text-3xl font-black text-[#F4B860] font-mono mt-2 block tracking-tight">${totalCollectedAllTime.toFixed(2)}</span>
          <p className="text-[10px] text-zinc-500 font-medium mt-2">Active reward points</p>
        </div>

        {/* Stat 3 */}
        <div className="premium-card p-5 rounded-xl border border-white/5 relative overflow-hidden">
          <span className="text-[10px] text-gray-400 block uppercase font-mono font-bold tracking-wider">Weekly SC Collected</span>
          <span className="text-3xl font-black text-[#4ADE80] font-mono mt-2 block tracking-tight">${totalWeeklyCollected.toFixed(2)}</span>
          <p className="text-[10px] text-zinc-500 font-medium mt-2">Last 7 day rolling sum</p>
        </div>

        {/* Stat 4 */}
        <div className="premium-card p-5 rounded-xl border border-white/5 relative overflow-hidden group hover:border-sky-500/20 glow-sky">
          <span className="text-[10px] text-gray-400 block uppercase font-mono font-bold tracking-wider">Extrapolated Annual Yield</span>
          <span className="text-3xl font-black text-sky-400 font-mono mt-2 block tracking-tight">${projectedYearlyCollected.toFixed(2)}</span>
          <p className="text-[10px] text-slate-500 font-semibold mt-2">Expected baseline return</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Casino Performance Share */}
        <div className="premium-card p-6 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 uppercase tracking-wider font-mono">
              <Award className="h-4.5 w-4.5 text-[#F4B860]" />
              SC Returns by Casino Interface
            </h3>
            <p className="text-[11px] text-gray-400 mt-1">Aggregated overall profits derived from daily and promo claims</p>
          </div>

          <div className="h-64 w-full font-mono text-[11px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CASINO_EFFICIENCY} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222530" strokeOpacity={0.4} />
                <XAxis dataKey="name" stroke="#71717a" tickLine={false} />
                <YAxis stroke="#71717a" tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#151922', borderColor: '#3f3f46', borderRadius: '12px' }} />
                <Bar dataKey="SC" fill="#F4B860" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Monthly Forecasting bounds */}
        <div className="premium-card p-6 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 uppercase tracking-wider font-mono">
              <TrendingUp className="h-4.5 w-4.5 text-[#4ADE80]" />
              Predictive Yield Projection
            </h3>
            <p className="text-[11px] text-gray-400 mt-1">Algorithm estimates including baseline, potential promos, and maximum drops</p>
          </div>

          <div className="h-64 w-full font-mono text-[11px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_FORECAST} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222530" strokeOpacity={0.4} />
                <XAxis dataKey="name" stroke="#71717a" tickLine={false} />
                <YAxis stroke="#71717a" tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#151922', borderColor: '#3f3f46', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="minSC" stackId="1" stroke="#EF4444" fill="#EF444415" />
                <Area type="monotone" dataKey="average" stackId="2" stroke="#F4B860" fill="#F4B86020" />
                <Area type="monotone" dataKey="maxSC" stackId="3" stroke="#4ADE80" fill="#4ADE8015" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: redemption clearance status */}
        <div className="premium-card p-6 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 uppercase tracking-wider font-mono">
              <ShieldCheck className="h-4.5 w-4.5 text-[#60A5FA]" />
              Redemption Success Audits
            </h3>
            <p className="text-[11px] text-gray-400 mt-1">Percentage rate of completed cash redemptions to bank and cards</p>
          </div>

          <div className="h-64 w-full font-mono text-[11px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REDEMPTION_SUCCESS_RATES} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222530" strokeOpacity={0.4} />
                <XAxis dataKey="name" stroke="#71717a" tickLine={false} />
                <YAxis stroke="#71717a" tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#151922', borderColor: '#3f3f46', borderRadius: '12px' }} />
                <Bar dataKey="success" name="Success Rate %" fill="#4ADE80" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending Rate %" fill="#60A5FA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Claim Duration Efficiency */}
        <div className="premium-card p-6 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 uppercase tracking-wider font-mono">
              <Clock className="h-4.5 w-4.5 text-purple-400" />
              Claim Time to Revenue Ratio
            </h3>
            <p className="text-[11px] text-gray-400 mt-1">Duration spent claiming (minutes) mapped against cash yield. Lower is more efficient.</p>
          </div>

          <div className="h-64 w-full font-mono text-[11px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CASINO_EFFICIENCY} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222530" strokeOpacity={0.4} />
                <XAxis dataKey="name" stroke="#71717a" tickLine={false} />
                <YAxis stroke="#71717a" tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#151922', borderColor: '#3f3f46', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="durationMin" name="Claim Time (mins)" stroke="#A855F7" strokeWidth={3} />
                <Line type="monotone" dataKey="efficiency" name="WAF Bypass success %" stroke="#10B981" strokeWidth={2} strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
