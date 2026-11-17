import React from 'react';
import { Search, History, Sparkles, TrendingUp, X, Calculator } from 'lucide-react';
import { Youtube, Linkedin, Instagram } from './PlatformIcons';

/**
 * Google-style Autocomplete Suggestion Dropdown
 * - Seamlessly attaches to the search bar container
 * - Supports:
 *   1. Instant Zero-Click Calculation / Converter Smart Answer Widget
 *   2. Search History with individual delete & clear all
 *   3. Contextual Recommendations (when input is focused/empty and external activity is detected)
 *   4. Authentic Google keyword matching: typed prefix standard, predictions bolded
 *   5. Dynamic 3x history scoring badges and telemetry
 */
export default function SuggestionDropdown({
  suggestions = [],
  query = '',
  selectedIndex = -1,
  onSelectSuggestion,
  onHoverIndex,
  onDeleteHistory,
  onClearAllHistory,
  onVelloXSearch,
  onGoogleSearch,
  onFeelingLucky,
  latencyMs = 0,
  isContextRecommendation = false,
  activeContext = null,
  instantAnswer = null
}) {
  // If no suggestions and no instant answer, render nothing
  if ((!suggestions || suggestions.length === 0) && !instantAnswer) {
    return null;
  }

  const cleanQuery = (query || '').trim().toLowerCase();
  const hasQuery = cleanQuery.length > 0;
  const hasHistoryItems = suggestions.some(s => s.canDelete || s.source === 'history');

  return (
    <div 
      id="suggestion-dropdown"
      className="w-full rounded-b-[24px] overflow-hidden bg-white dark:bg-[#303134] text-slate-800 dark:text-[#e8eaed] transition-colors border-t border-slate-100 dark:border-[#3c4043]"
    >
      {/* 1. Instant Zero-Click Calculator / Converter Smart Answer Card */}
      {instantAnswer && (
        <div 
          onMouseDown={(e) => {
            e.preventDefault();
            onSelectSuggestion(instantAnswer.result);
          }}
          className="px-4 py-3 bg-gradient-to-r from-blue-50/90 via-indigo-50/80 to-purple-50/80 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/30 border-b border-blue-200/70 dark:border-blue-800/40 flex items-center justify-between cursor-pointer group hover:bg-blue-100/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <span className="font-semibold text-blue-600 dark:text-blue-400">{instantAnswer.label}</span>
                <span>•</span>
                <span className="font-mono text-slate-600 dark:text-slate-300">{instantAnswer.expression}</span>
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                = {instantAnswer.result}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white active:scale-95 transition-all shadow-sm"
          >
            Search Result
          </button>
        </div>
      )}

      {/* 2. Contextual Recommendation Header (Shown when input is empty & active context exists) */}
      {isContextRecommendation && activeContext && (
        <div className="px-4 py-2 flex items-center justify-between text-xs bg-slate-50/80 dark:bg-[#28292c] border-b border-slate-100 dark:border-[#3c4043]">
          <div className="flex items-center gap-2">
            {activeContext.platform === 'youtube' && <Youtube className="w-3.5 h-3.5 text-red-500" />}
            {activeContext.platform === 'linkedin' && <Linkedin className="w-3.5 h-3.5 text-blue-500" />}
            {activeContext.platform === 'instagram' && <Instagram className="w-3.5 h-3.5 text-pink-500" />}
            {activeContext.platform !== 'youtube' && activeContext.platform !== 'linkedin' && activeContext.platform !== 'instagram' && (
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Recent {activeContext.platform || 'external'} search: <strong className="text-blue-600 dark:text-[#8ab4f8]">"{activeContext.topic}"</strong>
            </span>
          </div>
          <span className="text-[10px] font-mono text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 px-1.5 py-0.5 rounded">
            Personalized 3x
          </span>
        </div>
      )}

      {/* 3. Suggestion & Search History List */}
      {suggestions.length > 0 && (
        <ul className="py-2 max-h-96 overflow-y-auto">
          {suggestions.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            const phrase = item.phrase;
            const lowerPhrase = phrase.toLowerCase();
            const isHistory = item.source === 'history' || isContextRecommendation;

            // Keyword Matching Logic (Google Autocomplete Style):
            let prefixPart = '';
            let boldCompletion = phrase;
            let hasPrefixMatch = false;

            if (hasQuery && lowerPhrase.startsWith(cleanQuery)) {
              hasPrefixMatch = true;
              prefixPart = phrase.slice(0, cleanQuery.length);
              boldCompletion = phrase.slice(cleanQuery.length);
            }

            return (
              <li
                key={`${item.phrase}-${idx}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelectSuggestion(item.phrase);
                }}
                onMouseEnter={() => onHoverIndex && onHoverIndex(idx)}
                className={`px-4 py-2 flex items-center justify-between cursor-pointer transition-colors duration-100 ${
                  isSelected 
                    ? 'bg-[#f1f3f4] dark:bg-[#3c4043] text-slate-900 dark:text-white' 
                    : 'hover:bg-[#f8f9fa] dark:hover:bg-[#3c4043] text-slate-800 dark:text-[#e8eaed]'
                }`}
              >
                {/* Left: Icon & Query Text */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {isContextRecommendation ? (
                    <TrendingUp className="w-4 h-4 text-blue-500 dark:text-[#8ab4f8] flex-shrink-0" />
                  ) : isHistory ? (
                    <History className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  ) : (
                    <Search className="w-4 h-4 text-[#9aa0a6] dark:text-[#9aa0a6] flex-shrink-0" />
                  )}

                  {/* Text Display */}
                  <div className="text-[15px] truncate select-none leading-normal">
                    {hasPrefixMatch ? (
                      <>
                        <span className="font-normal text-slate-800 dark:text-[#e8eaed]">
                          {prefixPart}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {boldCompletion}
                        </span>
                      </>
                    ) : hasQuery && lowerPhrase.includes(cleanQuery) ? (
                      (() => {
                        const matchIndex = lowerPhrase.indexOf(cleanQuery);
                        return (
                          <>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {phrase.slice(0, matchIndex)}
                            </span>
                            <span className="font-semibold text-blue-600 dark:text-[#8ab4f8] underline decoration-blue-400/50">
                              {phrase.slice(matchIndex, matchIndex + cleanQuery.length)}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {phrase.slice(matchIndex + cleanQuery.length)}
                            </span>
                          </>
                        );
                      })()
                    ) : (
                      <span className="font-medium text-slate-900 dark:text-white">{phrase}</span>
                    )}
                  </div>
                </div>

                {/* Right: Badges / History Delete Action */}
                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  {isHistory && (
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      {item.tag || 'Recent'}
                    </span>
                  )}
                  {item.category && item.category !== 'general' && !isHistory && (
                    <span className="text-[11px] text-[#70757a] dark:text-[#9aa0a6] capitalize">
                      {item.category}
                    </span>
                  )}
                  {/* Delete individual history item */}
                  {item.canDelete && onDeleteHistory && (
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onDeleteHistory(item.phrase);
                      }}
                      className="p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      title="Remove from recent search history"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Clear All History footer button if history is showing */}
      {!hasQuery && hasHistoryItems && onClearAllHistory && (
        <div className="px-4 py-1.5 flex justify-end bg-slate-50/60 dark:bg-[#28292c]/50 border-t border-slate-100 dark:border-[#3c4043]">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onClearAllHistory();
            }}
            className="text-[11px] font-medium text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
          >
            Clear recent history
          </button>
        </div>
      )}

      {/* Engine Telemetry Footer */}
      <div className="py-2.5 px-4 flex items-center justify-between border-t border-slate-100 dark:border-[#3c4043]/50">
        <div className="flex items-center gap-2 text-[11px] font-mono text-[#70757a] dark:text-[#9aa0a6]">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>
            {isContextRecommendation 
              ? `Contextual Knowledge Expansion • 3x History Scoring • ${suggestions.length} keywords`
              : `Prefix Trie O(L) Traversal • ${latencyMs}ms • ${suggestions.length} suggestions`
            }
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 hidden sm:inline-block">
          Press <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300">/</kbd> to focus • <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300">Esc</kbd> to close
        </div>
      </div>
    </div>
  );
}
