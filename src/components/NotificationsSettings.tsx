import React, { useState } from 'react';
import { NotificationLog } from '../types';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Laptop, 
  CheckCheck, 
  Trash2, 
  AlertCircle, 
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  Megaphone,
  CircleAlert
} from 'lucide-react';

interface NotificationsSettingsProps {
  notifications: NotificationLog[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
}

export default function NotificationsSettings({
  notifications,
  onMarkRead,
  onClearAll,
}: NotificationsSettingsProps) {
  // Subscription settings states
  const [emailSub, setEmailSub] = useState(true);
  const [browserSub, setBrowserSub] = useState(true);
  const [mobileSub, setMobileSub] = useState(false);

  // Trigger categories toggles states
  const [triggerBonus, setTriggerBonus] = useState(true);
  const [triggerFailures, setTriggerFailures] = useState(true);
  const [triggerPromo, setTriggerPromo] = useState(true);
  const [triggerRedeem, setTriggerRedeem] = useState(true);

  return (
    <div className="space-y-6" id="notifications-settings-main">
      {/* Alert Header */}
      <div className="bg-gradient-to-r from-[#151922] to-[#1E2533] p-6 rounded-xl border border-gray-800 space-y-1.5">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Bell className="h-5 w-5 text-[#F4B860] animate-swing" />
          Alerts, Alarms & Broadcast Hub
        </h2>
        <p className="text-xs text-gray-400">
          Sync automated check-in notifications to keep from missing valuable short-lived social sweeps drop links.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns - Toggles */}
        <div className="space-y-6 lg:col-span-1">
          {/* Methods */}
          <div className="bg-[#151922] p-5 rounded-xl border border-gray-800 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">1. Channels Subscriptions</h3>
            
            <div className="space-y-3 pt-2 text-xs font-mono">
              <label className="flex items-center justify-between p-2.5 bg-[#0B0D12] rounded border border-gray-850 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-sky-400" />
                  <div>
                    <span className="text-white block font-bold">Email Notifications</span>
                    <span className="text-[10px] text-gray-500">Summary reports daily</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailSub}
                  onChange={(e) => setEmailSub(e.target.checked)}
                  className="rounded border-gray-800 text-amber-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-[#0B0D12] rounded border border-[#60A5FA]/10 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Laptop className="h-4 w-4 text-[#60A5FA]" />
                  <div>
                    <span className="text-white block font-bold">Browser Push alerts</span>
                    <span className="text-[10px] text-gray-500">Visual popup alerts</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={browserSub}
                  onChange={(e) => setBrowserSub(e.target.checked)}
                  className="rounded border-gray-800"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-[#0B0D12] rounded border border-gray-850 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-purple-400" />
                  <div>
                    <span className="text-white block font-bold">Mobile SMS Alerts</span>
                    <span className="text-[10px] text-gray-500">Urgent link alerts</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={mobileSub}
                  onChange={(e) => setMobileSub(e.target.checked)}
                  className="rounded border-gray-800"
                />
              </label>
            </div>
          </div>

          {/* Trigger events */}
          <div className="bg-[#151922] p-5 rounded-xl border border-gray-800 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">2. Categorized Events</h3>
            
            <div className="space-y-3 pt-2 text-xs">
              <label className="flex items-center justify-between cursor-pointer text-gray-300">
                <span>🔔 New Free Bonus Drops available</span>
                <input
                  type="checkbox"
                  checked={triggerBonus}
                  onChange={(e) => setTriggerBonus(e.target.checked)}
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer text-gray-300">
                <span>⚡ Crawler collection errors warnings</span>
                <input
                  type="checkbox"
                  checked={triggerFailures}
                  onChange={(e) => setTriggerFailures(e.target.checked)}
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer text-gray-300">
                <span>🎫 Expiring promotional coupon warnings</span>
                <input
                  type="checkbox"
                  checked={triggerPromo}
                  onChange={(e) => setTriggerPromo(e.target.checked)}
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer text-gray-300">
                <span>💵 Redemption approvals completion logs</span>
                <input
                  type="checkbox"
                  checked={triggerRedeem}
                  onChange={(e) => setTriggerRedeem(e.target.checked)}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Columns - Logs list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#151922] p-5 rounded-xl border border-gray-800 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xs font-bold text-gray-450 uppercase tracking-wider font-mono">Alert Audit Logs Center</h3>
                <p className="text-[11px] text-gray-400">Chronological history feed of system event notices</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onClearAll}
                  className="text-gray-500 hover:text-white text-xs font-mono border border-gray-850 px-2 py-1 rounded"
                >
                  Clear Logs
                </button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <div className="text-center py-16 text-gray-500 font-mono text-xs">
                  <CheckCircle className="h-6 w-6 text-slate-700 mx-auto mb-2" />
                  Your alert center is completely clean. No pending tasks.
                </div>
              ) : (
                notifications.map(n => {
                  let alertDot = 'bg-sky-400';
                  if (n.severity === 'warning') alertDot = 'bg-amber-400';
                  if (n.severity === 'error') alertDot = 'bg-red-400';
                  if (n.severity === 'success') alertDot = 'bg-emerald-400';

                  return (
                    <div 
                      key={n.id} 
                      className={`p-4 rounded-lg border transition flex items-start gap-3.5 ${
                        n.read ? 'bg-[#0B0D12] border-gray-850 opacity-60' : 'bg-[#1C212D]/80 border-gray-800 hover:border-gray-750'
                      }`}
                    >
                      <span className={`h-2.5 w-2.5 rounded-full shrink-0 mt-1.5 ${alertDot}`} />

                      <div className="space-y-1 flex-1">
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="font-extrabold text-[#F4B860] text-sm leading-tight">{n.title}</h4>
                          <span className="text-[10px] text-gray-500 font-mono shrink-0">{n.timestamp}</span>
                        </div>
                        <p className="text-xs text-gray-300 leading-normal">{n.message}</p>
                        
                        <div className="pt-2 flex justify-between items-center text-[10px] text-gray-500 font-mono">
                          <span>Event category: [ {n.type} ]</span>
                          {!n.read && (
                            <button
                              onClick={() => onMarkRead(n.id)}
                              className="text-[#4ADE80] hover:underline font-bold"
                            >
                              Mark Read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
