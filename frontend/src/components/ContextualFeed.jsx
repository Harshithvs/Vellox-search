import React from 'react';
import { Youtube, Linkedin, Instagram } from './PlatformIcons';
import { Sparkles, TrendingUp, ArrowRight } from 'lucide-react';

export default function ContextualFeed({
  activeContext,
  recommendations = [],
  quickPills = [],
  onSelectQuery
}) {
  if (!activeContext || !activeContext.topic) return null;

  const topic = activeContext.topic;
  const platform = activeContext.platform || 'youtube';

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-[#3c4043]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center text-red-500 flex-shrink-0">
            {platform === 'youtube' && <Youtube className="w-4 h-4" />}
            {platform === 'linkedin' && <Linkedin className="w-4 h-4 text-blue-500" />}
            {platform === 'instagram' && <Instagram className="w-4 h-4 text-pink-500" />}
            {platform !== 'youtube' && platform !== 'linkedin' && platform !== 'instagram' && (
              <Sparkles className="w-4 h-4 text-amber-500" />
            )}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-[#e8eaed] flex items-center gap-2">
              <span>{activeContext.title || `Because you searched for '${topic}' on ${platform}`}</span>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                Personalized Feed
              </span>
            </h2>
            <p className="text-xs text-[#70757a] dark:text-[#9aa0a6]">
              Federated intelligence across YouTube, LinkedIn, and Instagram matching your interest
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Keywords Pill Carousel */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 mb-2.5">
          <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Recommended Keywords & Autocomplete Boosts:
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(quickPills.length > 0 ? quickPills : recommendations.map(r => r.phrase)).map((phrase, idx) => (
            <button
              key={`${phrase}-${idx}`}
              onClick={() => onSelectQuery(phrase)}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-50 dark:bg-[#303134] border border-slate-200 dark:border-[#5f6368] text-slate-800 dark:text-[#e8eaed] hover:border-blue-500 hover:text-blue-600 dark:hover:text-[#8ab4f8] hover:shadow-xs transition-all"
            >
              <span>{phrase}</span>
              <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 group-hover:text-blue-500">
                ★ 3x
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3-Column Previews for the Topic (YouTube, LinkedIn, Instagram) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* YouTube Card */}
        <div 
          onClick={() => onSelectQuery(`${topic} reviews 2025`)}
          className="p-4 rounded-2xl bg-white dark:bg-[#303134] border border-slate-200 dark:border-[#5f6368] hover:border-red-400/60 dark:hover:border-red-500/60 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 dark:text-red-400">
                <Youtube className="w-3.5 h-3.5" />
                <span>YouTube Highlight</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400">
                4K Ultra HD
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 line-clamp-2 mb-1.5 transition-colors">
              The Ultimate {topic.toUpperCase()} Buyer's Guide 2025 (Blind Camera Test)
            </h3>
            <p className="text-xs text-[#70757a] dark:text-[#9aa0a6] line-clamp-2 mb-3">
              MKBHD & Dave2D real-world battery longevity, display benchmarks, and durability showdown.
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50 text-[11px] text-slate-500">
            <span>2.8M views • 18m</span>
            <span className="text-red-500 font-medium group-hover:underline flex items-center gap-0.5">
              Explore <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* LinkedIn Card */}
        <div 
          onClick={() => onSelectQuery(`senior ${topic} hardware engineer`)}
          className="p-4 rounded-2xl bg-white dark:bg-[#303134] border border-slate-200 dark:border-[#5f6368] hover:border-blue-400/60 dark:hover:border-blue-500/60 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn Careers</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                $210k - $285k
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 mb-1.5 transition-colors">
              Staff Mobile Systems Architect - {topic.toUpperCase()} Silicon & RF
            </h3>
            <p className="text-xs text-[#70757a] dark:text-[#9aa0a6] line-clamp-2 mb-3">
              Apple Hardware / Qualcomm Technologies • Cupertino, CA • Flagship 3nm processor integration.
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50 text-[11px] text-slate-500">
            <span>89 applicants</span>
            <span className="text-blue-500 font-medium group-hover:underline flex items-center gap-0.5">
              View Roles <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Instagram Card */}
        <div 
          onClick={() => onSelectQuery(`#${topic.replace(/\s+/g, '')} hacks`)}
          className="p-4 rounded-2xl bg-white dark:bg-[#303134] border border-slate-200 dark:border-[#5f6368] hover:border-pink-400/60 dark:hover:border-pink-500/60 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-pink-600 dark:text-pink-400">
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram Dev & Reels</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400">
                Viral 128k likes
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 line-clamp-2 mb-1.5 transition-colors">
              🔥 5 Hidden {topic.toUpperCase()} Settings You Need to Turn OFF Right Now!
            </h3>
            <p className="text-xs text-[#70757a] dark:text-[#9aa0a6] line-clamp-2 mb-3">
              @techreels.daily • Boost battery life by 35% and stop background tracking with these 5 tricks.
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50 text-[11px] text-slate-500">
            <span>Reel • 0:45s</span>
            <span className="text-pink-500 font-medium group-hover:underline flex items-center gap-0.5">
              Watch Reel <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
