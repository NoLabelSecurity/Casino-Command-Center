import React, { useState } from 'react';
import { AutomationAdapter, CasinoAccount } from '../types';
import { 
  Play, 
  Settings2, 
  CheckCircle, 
  XOctagon, 
  Plus, 
  Code2, 
  Terminal, 
  RefreshCw, 
  Bug, 
  BookOpen, 
  Workflow,
  Check,
  AlertTriangle,
  Info
} from 'lucide-react';

interface AutomationViewProps {
  adapters: AutomationAdapter[];
  accounts: CasinoAccount[];
  onAddAdapter: (adapter: Partial<AutomationAdapter>) => void;
  onUpdateAdapter: (id: string, updated: Partial<AutomationAdapter>) => void;
  onRefreshScatteredStats: () => void;
}

export default function AutomationView({
  adapters,
  accounts,
  onAddAdapter,
  onUpdateAdapter,
  onRefreshScatteredStats,
}: AutomationViewProps) {
  const [selectedAdapterId, setSelectedAdapterId] = useState<string>('stake-us');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [hasError, setHasError] = useState(false);

  // New Adapter Form
  const [isAddingAdapter, setIsAddingAdapter] = useState(false);
  const [newCasinoName, setNewCasinoName] = useState('');
  const [newLoginUrl, setNewLoginUrl] = useState('');
  const [newColMethod, setNewColMethod] = useState<'API' | 'Selectors' | 'Puppeteer'>('Selectors');
  const [newScDisplay, setNewScDisplay] = useState('');

  const selectedAdapter = adapters.find(a => a.id === selectedAdapterId) || adapters[0];

  const steps = [
    "Allocating headless sandbox browser instance...",
    "Routing to casino credentials terminal...",
    "Injecting obfuscated credentials payload safely...",
    "Checking for Cloudflare WAF or Geolocation blocks...",
    "Scraping wallet balance figures in real time...",
    "Interacting with bonus drop claims trigger elements...",
    "Releasing cluster worker resources safely..."
  ];

  // Run Crawl Simulation
  const runCrawlSimulation = async (id: string, adapter: AutomationAdapter) => {
    setIsRunning(true);
    setLogs([]);
    setHasError(false);
    setActiveStep(0);

    const appendLog = (msg: string) => {
      setLogs(prev => [...prev, `[${new Date().toISOString().substring(11, 19)}] ${msg}`]);
    };

    appendLog(`INITIALIZING CRAWLER: ${adapter.casinoName} plugin-v2.1`);
    appendLog(`Target endpoint: ${adapter.loginUrl}`);
    appendLog(`Standard Method: ${adapter.bonusCollectionMethod}`);

    // Cycle through steps
    for (let i = 0; i < steps.length; i++) {
      setActiveStep(i);
      appendLog(steps[i]);
      
      // Delay
      await new Promise(r => setTimeout(r, 900));

      // Introduce potential realistic failures
      if (id === 'stake-us' && i === 3) {
        appendLog("⚠️ [WAF WARNING] Cloudflare captcha challenge detected on Node IP.");
        appendLog("❌ [CRITICAL EXCEPTION] Human intervention captcha bypass token required.");
        appendLog("Crawler session aborted to safeguard accounts.");
        setHasError(true);
        setIsRunning(false);
        setActiveStep(-1);
        onUpdateAdapter(id, {
          status: 'error',
          lastRunTime: '2026-06-15 19:44',
          lastRunError: 'WAF Captcha prompt triggered. Slower execution needed.'
        });
        return;
      }
    }

    appendLog(`✅ SUCCESS: ${adapter.casinoName} task pipeline cleared!`);
    appendLog(`Deposited SC successfully. Wallet synced.`);
    setIsRunning(false);
    setActiveStep(-1);
    onUpdateAdapter(id, {
      status: 'active',
      lastRunTime: '2026-06-15 19:44',
      lastRunError: undefined
    });
    
    // update parent
    onRefreshScatteredStats();
  };

  const handleCreateAdapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCasinoName) return;

    onAddAdapter({
      casinoName: newCasinoName,
      loginUrl: newLoginUrl || 'https://example.com/login',
      dashboardUrl: 'https://example.com/dashboard',
      bonusCollectionMethod: newColMethod,
      balanceSelectors: newScDisplay || '.balance-selector',
      transactionSelectors: '.txn-table',
      status: 'testing'
    });

    setIsAddingAdapter(false);
    setNewCasinoName('');
    setNewScDisplay('');
    setNewLoginUrl('');
  };

  return (
    <div className="space-y-6" id="automation-view-main">
      {/* Overview */}
      <div className="bg-gradient-to-r from-[#151922] to-[#1E2533] p-6 rounded-xl border border-gray-800 space-y-2">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Workflow className="h-5 w-5 text-[#F4B860]" />
          Plugin-Based Automation & Scrapers Workspace
        </h2>
        <p className="text-xs text-gray-400">
          Standardized developer adapter workspace to monitor custom background scrapers. Scrape balances, execute bonus collection, and capture cashflow tables.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Adapter selector list */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-[#151922] p-5 rounded-xl border border-gray-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Active Crawler Plugins</h3>
              <button
                onClick={() => setIsAddingAdapter(!isAddingAdapter)}
                className="text-xs text-[#F4B860] hover:underline flex items-center gap-1 font-bold font-mono"
              >
                <Plus className="h-3.5 w-3.5" /> ADD NEW
              </button>
            </div>

            {isAddingAdapter && (
              <form onSubmit={handleCreateAdapter} className="bg-[#0B0D12] p-4 rounded border border-gray-800 space-y-3 font-mono text-xs">
                <div>
                  <label className="text-gray-400 block mb-1">Casino Name *</label>
                  <input
                    type="text"
                    required
                    value={newCasinoName}
                    onChange={(e) => setNewCasinoName(e.target.value)}
                    placeholder="e.g. Fortune Coins"
                    className="w-full bg-[#151922] border border-gray-850 p-1.5 rounded text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Login URL</label>
                  <input
                    type="url"
                    value={newLoginUrl}
                    onChange={(e) => setNewLoginUrl(e.target.value)}
                    className="w-full bg-[#151922] border border-gray-850 p-1.5 rounded text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Collection Mode</label>
                  <select
                    value={newColMethod}
                    onChange={(e) => setNewColMethod(e.target.value as any)}
                    className="w-full bg-[#151922] border border-gray-850 p-1.5 rounded text-white"
                  >
                    <option value="Selectors">Selectors DOM scrape</option>
                    <option value="API">Headless API intercept</option>
                    <option value="Puppeteer">Full Puppeteer simulation</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">SC Balance Selector Tag</label>
                  <input
                    type="text"
                    value={newScDisplay}
                    onChange={(e) => setNewScDisplay(e.target.value)}
                    placeholder="e.g. section.sc-amount"
                    className="w-full bg-[#151922] border border-gray-850 p-1.5 rounded text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsAddingAdapter(false)} className="text-gray-500 hover:text-white">Cancel</button>
                  <button type="submit" className="bg-[#F4B860] text-black px-2.5 py-1 rounded font-bold font-mono">Create</button>
                </div>
              </form>
            )}

            <div className="space-y-2.5">
              {adapters.map(ad => (
                <button
                  key={ad.id}
                  onClick={() => { setSelectedAdapterId(ad.id); setLogs([]); }}
                  className={`w-full text-left p-3.5 rounded-lg border transition ${
                    selectedAdapterId === ad.id 
                    ? 'bg-[#1e2430] border-[#F4B860]/40 shadow-md' 
                    : 'bg-[#0B0D12] border-gray-850 hover:bg-[#1C212D]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-xs tracking-tight uppercase font-mono">{ad.casinoName}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                      ad.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {ad.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-[11px] text-gray-500 font-mono mt-2">
                    <span className="truncate max-w-[130px]">{ad.bonusCollectionMethod} Driver</span>
                    <span>{ad.lastRunTime ? ad.lastRunTime.substring(11) : 'No runs'}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-xs space-y-1.5 leading-relaxed">
            <h4 className="font-bold flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" /> Cloudflare Captcha (WAF) Notice
            </h4>
            <p>
              Automated claims work on standardized schedules, but Captcha puzzles require local companion extensions or human-in-the-loop assistance. The app halts automatically if challenge pages arise, preventing account suspension flags.
            </p>
          </div>
        </div>

        {/* Right Columns: Adapter settings and terminal output */}
        <div className="lg:col-span-2 space-y-6">
          {selectedAdapter && (
            <div className="p-6 bg-[#151922] rounded-xl border border-gray-800 space-y-6">
              
              {/* Selected Adapter controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-[#F4B860]" />
                    {selectedAdapter.casinoName} Adapter Configuration
                  </h3>
                  <p className="text-xs text-gray-400">Model adapters manage DOM targeting and request sequences pathing.</p>
                </div>

                <button
                  onClick={() => runCrawlSimulation(selectedAdapter.id, selectedAdapter)}
                  disabled={isRunning}
                  className="bg-[#4ADE80] disabled:bg-gray-800 text-black px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2"
                >
                  <Play className="h-4 w-4" /> {isRunning ? 'Running Simulation...' : 'Run Test Session'}
                </button>
              </div>

              {/* Technical Specifications form summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-[#0B0D12] p-3 rounded border border-gray-850">
                  <span className="text-gray-500 block">HTTP Login endpoint:</span>
                  <span className="text-gray-300 break-all">{selectedAdapter.loginUrl}</span>
                </div>
                <div className="bg-[#0B0D12] p-3 rounded border border-gray-850">
                  <span className="text-gray-500 block">Claims Area Endpoint:</span>
                  <span className="text-[#F4B860] break-all">{selectedAdapter.dashboardUrl}</span>
                </div>
                <div className="bg-[#0B0D12] p-3 rounded border border-gray-850">
                  <span className="text-gray-500 block">Balance Scraping DOM Selectors:</span>
                  <span className="text-gray-300">{selectedAdapter.balanceSelectors}</span>
                </div>
                <div className="bg-[#0B0D12] p-3 rounded border border-gray-850">
                  <span className="text-gray-500 block">Transactions Table Selectors:</span>
                  <span className="text-gray-300">{selectedAdapter.transactionSelectors}</span>
                </div>
              </div>

              {selectedAdapter.lastRunError && (
                <div className="p-3 bg-red-950/20 border border-red-500/30 text-red-400 rounded text-xs flex gap-2 font-mono">
                  <Bug className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Last Run Encountered Exception:</span>
                    <p className="mt-1">{selectedAdapter.lastRunError}</p>
                  </div>
                </div>
              )}

              {/* Headless automation live step visualizer */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Crawler Steps Sequence</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {steps.map((s, idx) => {
                    const isPassed = activeStep > idx;
                    const isActive = activeStep === idx;

                    let blockClass = 'border-gray-800 text-gray-500';
                    if (isPassed) blockClass = 'bg-emerald-500/5 border-emerald-500/30 text-emerald-400 font-bold';
                    if (isActive) blockClass = 'bg-[#F4B860]/10 border-[#F4B860]/50 text-[#F4B860] animate-pulse font-bold';

                    return (
                      <div key={idx} className={`p-2.5 rounded-lg border text-[10px] uppercase font-mono ${blockClass}`}>
                        <div className="flex justify-between">
                          <span>Step #{idx + 1}</span>
                          {isPassed && <Check className="h-3 w-3" />}
                        </div>
                        <p className="mt-1 text-[9.5px] truncate text-slate-300 capitalize">{s.substring(0, 30)}...</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Streaming terminal simulation logs */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono flex items-center gap-1">
                    <Terminal className="h-4 w-4 text-[#F4B860]" /> Headless Stream Terminal Log
                  </h4>
                  <span className="text-[10px] bg-slate-800 text-gray-400 px-2 py-0.5 rounded font-mono">tty stdout stream</span>
                </div>

                <div className="bg-black text-xs font-mono text-emerald-400 p-4 rounded-lg h-52 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-gray-800">
                  {logs.length === 0 ? (
                    <div className="text-zinc-600 text-center py-16">
                      // Launching background crawlers stream logs will render here.<br />
                      // Select an account above and run a Test Session.
                    </div>
                  ) : (
                    logs.map((log, lidx) => (
                      <div key={lidx} className="leading-relaxed">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
