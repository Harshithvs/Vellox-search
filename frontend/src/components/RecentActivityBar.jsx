import React, { useState } from 'react';
import { Youtube, Linkedin, Instagram, Monster, Foundit } from './PlatformIcons';
import { Sparkles, ArrowRight, RotateCcw, Plus, Check } from 'lucide-react';

export default function RecentActivityBar({
  activeContext,
  onSelectContext,
  onClearContext,
  isLoading = false
}) {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customPlatform, setCustomPlatform] = useState('youtube');
  const [customTopic, setCustomTopic] = useState('');

  const presets = [
    { platform: 'youtube', topic: 'phone', label: 'YouTube: "phone"', icon: Youtube, color: 'text-red-500' },
    { platform: 'linkedin', topic: 'ai systems architect', label: 'LinkedIn: "ai architect"', icon: Linkedin, color: 'text-blue-500' },
    { platform: 'monster', topic: 'cloud engineer', label: 'Monster: "cloud engineer"', icon: Monster, color: 'text-purple-500' },
    { platform: 'foundit', topic: 'full stack developer', label: 'foundit: "full stack"', icon: Foundit, color: 'text-orange-500' },
    { platform: 'instagram', topic: 'coding tips', label: 'Instagram: "coding tips"', icon: Instagram, color: 'text-pink-500' },
  ];

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customTopic.trim()) {
      onSelectContext(customPlatform, customTopic.trim());
      setShowCustomModal(false);
      setCustomTopic('');
    }
  };

  const currentTopic = activeContext?.topic || 'none';
  const currentPlatform = activeContext?.platform || 'none';

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      {/* Activity Context Pill Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/60 to-purple-50/70 dark:from-[#303134]/90 dark:via-[#2b2c2f]/90 dark:to-[#332f38]/90 border border-blue-200/60 dark:border-[#5f6368]/60 shadow-sm backdrop-blur-sm">
        
        {/* Left: Active Context Display */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-white dark:bg-[#202124] flex items-center justify-center shadow-xs border border-slate-200 dark:border-[#5f6368] flex-shrink-0">
            {currentPlatform === 'youtube' && <Youtube className="w-4 h-4 text-red-500" />}
            {currentPlatform === 'linkedin' && <Linkedin className="w-4 h-4 text-blue-500" />}
            {currentPlatform === 'monster' && <Monster className="w-4 h-4 text-purple-500" />}
            {currentPlatform === 'foundit' && <Foundit className="w-4 h-4 text-orange-500" />}
            {currentPlatform === 'instagram' && <Instagram className="w-4 h-4 text-pink-500" />}
            {currentPlatform !== 'youtube' && currentPlatform !== 'linkedin' && currentPlatform !== 'monster' && currentPlatform !== 'foundit' && currentPlatform !== 'instagram' && (
              <Sparkles className="w-4 h-4 text-amber-500" />
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Cross-Platform Sync:</span>
            {activeContext ? (
              <span className="inline-flex items-center gap-1 font-mono text-slate-900 dark:text-white bg-white/80 dark:bg-[#202124]/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-[#5f6368]">
                <span>Visited <strong className="capitalize">{activeContext.platform}</strong></span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span>Searched for <strong className="text-blue-600 dark:text-[#8ab4f8]">"{activeContext.topic}"</strong></span>
              </span>
            ) : (
              <span className="text-slate-500 dark:text-slate-400 italic">No external activity synced (Neutral)</span>
            )}
          </div>
        </div>

        {/* Right: Quick Context Presets & Custom Simulation */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">Try scenario:</span>
          {presets.map((p) => {
            const Icon = p.icon;
            const isActive = currentPlatform === p.platform && currentTopic === p.topic;
            return (
              <button
                key={`${p.platform}-${p.topic}`}
                type="button"
                onClick={() => onSelectContext(p.platform, p.topic)}
                disabled={isLoading}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs ring-2 ring-blue-400/40'
                    : 'bg-white dark:bg-[#202124] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#5f6368] hover:border-blue-400 hover:text-blue-600 dark:hover:text-[#8ab4f8]'
                }`}
              >
                <Icon className={`w-3 h-3 ${isActive ? 'text-white' : p.color}`} />
                <span>{p.label}</span>
                {isActive && <Check className="w-3 h-3 ml-0.5" />}
              </button>
            );
          })}

          {/* Custom Simulation Modal Trigger */}
          <button
            type="button"
            onClick={() => setShowCustomModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-white dark:bg-[#202124] text-slate-700 dark:text-slate-300 border border-dashed border-slate-300 dark:border-[#5f6368] hover:border-blue-500 hover:text-blue-600 dark:hover:text-[#8ab4f8] transition-all"
            title="Simulate custom platform visit"
          >
            <Plus className="w-3 h-3 text-blue-500" />
            <span>Custom</span>
          </button>

          {/* Reset / Neutral Button */}
          {activeContext && (
            <button
              type="button"
              onClick={onClearContext}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
              title="Reset to neutral state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Custom Simulation Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#303134] rounded-3xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-slate-200 dark:border-[#5f6368]">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Simulate External Platform Activity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Enter any platform and search term to see Trie keywords & recommendations completely adapt.
            </p>

            <form onSubmit={handleCustomSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  External Platform
                </label>
                <select
                  value={customPlatform}
                  onChange={(e) => setCustomPlatform(e.target.value)}
                  className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#202124] border border-slate-200 dark:border-[#5f6368] px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="youtube">YouTube (Video tutorials, reviews)</option>
                  <option value="linkedin">LinkedIn (Jobs, roles, profiles)</option>
                  <option value="monster">Monster (Careers, global hiring)</option>
                  <option value="foundit">foundit (Jobs in India & APAC, tech roles)</option>
                  <option value="instagram">Instagram (Reels, hashtags)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Topic / Search Term (e.g., "phone", "headphones", "golang")
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g. phone"
                  className="w-full text-xs rounded-xl bg-slate-50 dark:bg-[#202124] border border-slate-200 dark:border-[#5f6368] px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!customTopic.trim()}
                  className="px-4 py-1.5 rounded-xl text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 transition-colors shadow-sm"
                >
                  Sync Context
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
