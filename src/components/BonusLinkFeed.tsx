import React, { useState } from 'react';
import { BonusLink } from '../types';
import { 
  Rss, 
  ExternalLink, 
  Clock, 
  Share2, 
  CheckCircle, 
  Star,
  Users,
  Eye,
  Filter,
  Bookmark,
  Sparkles
} from 'lucide-react';

interface BonusLinkFeedProps {
  bonusLinks: BonusLink[];
  onClaimLink: (id: string) => void;
}

export default function BonusLinkFeed({
  bonusLinks,
  onClaimLink,
}: BonusLinkFeedProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'unclaimed' | 'claimed'>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');

  // Gather unique tags
  const allTags = Array.from(new Set(bonusLinks.flatMap(l => l.tags)));

  // Filter links
  const filteredLinks = bonusLinks.filter(l => {
    const matchesTab = activeTab === 'all' || 
                       (activeTab === 'unclaimed' && l.claimStatus === 'unclaimed') ||
                       (activeTab === 'claimed' && l.claimStatus === 'claimed');
    
    const matchesTag = tagFilter === 'all' || l.tags.includes(tagFilter);

    return matchesTab && matchesTag;
  });

  return (
    <div className="space-y-6" id="bonus-links-feed-container">
      {/* Social inspiration header */}
      <div className="bg-gradient-to-r from-[#1E2533] to-[#151922] p-6 rounded-xl border border-gray-800 flex justify-between items-center flex-wrap gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Rss className="h-5 w-5 text-[#F4B860]" />
            <h2 className="text-lg font-extrabold text-white">Reddit r/DailyCashList Automated Links Link</h2>
          </div>
          <p className="text-xs text-gray-400">
            Realtime verified link feed aggregating daily spins, Instagram stories, exclusive VIP match coupons, and seasonal social media codes.
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#4ADE80] animate-pulse"></span>
          <span className="text-xs text-gray-400 font-mono">Live Feed Sync Active</span>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#151922] p-3 rounded-xl border border-gray-800">
        <div className="flex bg-[#0B0D12] rounded-lg p-1 border border-gray-800">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 text-xs font-mono font-bold rounded ${activeTab === 'all' ? 'bg-slate-800 text-[#F4B860]' : 'text-gray-400 hover:text-white'}`}
          >
            ALL COIN LINKS ({bonusLinks.length})
          </button>
          <button
            onClick={() => setActiveTab('unclaimed')}
            className={`px-4 py-1.5 text-xs font-mono font-bold rounded ${activeTab === 'unclaimed' ? 'bg-slate-800 text-[#F4B860]' : 'text-gray-400'}`}
          >
            UNCLAIMED ({bonusLinks.filter(b => b.claimStatus === 'unclaimed').length})
          </button>
          <button
            onClick={() => setActiveTab('claimed')}
            className={`px-4 py-1.5 text-xs font-mono font-bold rounded ${activeTab === 'claimed' ? 'bg-slate-800 text-teal-400' : 'text-gray-400'}`}
          >
            CLAIMED
          </button>
        </div>

        {/* Dynamic Tag Scroller Filter */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <Filter className="h-4 w-4 text-zinc-500" />
          <span className="text-gray-400">Categorized Tags:</span>
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="bg-[#0B0D12] text-[#F4B860] font-bold border border-gray-850 px-2.5 py-1.5 rounded outline-none"
          >
            <option value="all">Show All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>#{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Social post feed items */}
      <div className="space-y-4" id="feed-items-container">
        {filteredLinks.length === 0 ? (
          <div className="bg-[#151922] py-12 text-center rounded-xl border border-gray-800">
            <Bookmark className="h-8 w-8 text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-gray-500 font-mono">No active social links matched the filters catalog.</p>
          </div>
        ) : (
          filteredLinks.map((link) => {
            const isUnclaimed = link.claimStatus === 'unclaimed';
            const isExpired = link.claimStatus === 'expired';

            let typeBadge = 'bg-sky-500/10 text-sky-400 border-sky-500/20';
            if (link.rewardType === 'VIP') typeBadge = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            if (link.rewardType === 'Seasonal') typeBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

            return (
              <div 
                key={link.id}
                className={`bg-[#151922] p-5 rounded-xl border transition relative ${
                  isUnclaimed ? 'border-gray-800' : 'border-gray-900 opacity-60'
                } hover:border-gray-700`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  
                  {/* Left Column Feed Post Info */}
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] bg-slate-800 text-gray-300 font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                        Posted by {link.source}
                      </span>
                      <span className="text-gray-500 text-[10px] font-mono">
                        • {link.datePosted}
                      </span>
                      
                      <span className={`text-[10.5px] border font-semibold px-2 py-0.2 rounded font-mono ${typeBadge}`}>
                        {link.rewardType} Reward Category
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                      <Sparkles className="h-4.5 w-4.5 text-[#F4B860]" />
                      Claim {link.rewardValue} Instant sweep activation
                    </h3>

                    {/* Tags block */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {link.tags.map(t => (
                        <button
                          key={t}
                          onClick={() => setTagFilter(t)}
                          className="text-[10.5px] text-[#F4B860]/80 hover:text-white font-semibold font-mono hover:underline"
                        >
                          #{t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right Column Action Panel */}
                  <div className="bg-[#0B0D12] p-3 rounded-lg border border-gray-850 flex flex-col items-center justify-center min-w-[200px] shrink-0 text-center font-mono">
                    <span className="text-[10px] text-gray-500 block uppercase">Expiration</span>
                    <span className="text-xs text-white block mt-0.5 font-bold">{link.expirationDate}</span>

                    <div className="mt-3 w-full">
                      {isUnclaimed ? (
                        <div className="flex gap-2">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-slate-800 hover:bg-slate-700 p-2 text-white border border-gray-700 rounded-lg transition text-xs flex justify-center items-center"
                            title="Direct Navigation (Simulate browser context)"
                          >
                            <ExternalLink className="h-4.5 w-4.5" />
                          </a>
                          <button
                            onClick={() => onClaimLink(link.id)}
                            className="flex-grow bg-[#4ADE80] hover:bg-[#4ADE80]/90 text-black font-extrabold px-3 py-2 rounded-lg text-xs transition"
                          >
                            Mark Redeemed
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 bg-slate-900 border border-gray-800 py-1.5 rounded-lg flex items-center justify-center gap-1">
                          <CheckCircle className="h-4 w-4 text-emerald-500" /> claimed
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
