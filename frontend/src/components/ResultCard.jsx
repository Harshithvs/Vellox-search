import React from 'react';
import { ExternalLink, Clock, Eye, ThumbsUp, MapPin, Award } from 'lucide-react';
import { Youtube, Linkedin, Instagram, Monster, Foundit } from './PlatformIcons';

export default function ResultCard({
  item,
  isInspected = false,
  onHover,
}) {
  const isYouTube = item.platform === 'YouTube';
  const isLinkedIn = item.platform === 'LinkedIn';
  const isMonster = item.platform === 'Monster';
  const isFoundit = item.platform === 'Foundit';
  const isInstagram = item.platform === 'Instagram';

  let PlatformIcon = Youtube;
  let siteUrl = 'https://www.youtube.com › watch';

  const isJobItem = item.content_format?.toLowerCase().includes('job') ||
                    item.tags?.includes('jobs') ||
                    item.tags?.includes('vacancies') ||
                    item.url?.toLowerCase().includes('/jobs/');

  if (isLinkedIn) {
    PlatformIcon = Linkedin;
    siteUrl = isJobItem ? 'https://www.linkedin.com › jobs' : 'https://www.linkedin.com › pulse';
  } else if (isMonster) {
    PlatformIcon = Monster;
    siteUrl = isJobItem ? 'https://www.monster.com › jobs' : 'https://www.monster.com › career-advice';
  } else if (isFoundit) {
    PlatformIcon = Foundit;
    siteUrl = isJobItem ? 'https://www.foundit.in › jobs' : 'https://www.foundit.in › career-advice';
  } else if (isInstagram) {
    PlatformIcon = Instagram;
    siteUrl = 'https://www.instagram.com › reels';
  }

  return (
    <div
      id={`result-card-${item.id}`}
      onMouseEnter={() => onHover(item)}
      onClick={() => {
        if (item.url) {
          window.open(item.url, '_blank', 'noopener,noreferrer');
        }
      }}
      className={`group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#202124] border ${
        isInspected 
          ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg dark:shadow-blue-500/5' 
          : 'border-slate-200 dark:border-[#3c4043] hover:shadow-md dark:hover:border-slate-600'
      } cursor-pointer transition-all duration-200`}
    >
      <div>
        {/* Google-style Breadcrumb / URL Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
              <PlatformIcon className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-slate-800 dark:text-[#e8eaed] leading-none truncate">
                {item.platform}
              </span>
              <span className="text-[11px] text-[#70757a] dark:text-[#9aa0a6] leading-tight truncate">
                {siteUrl}
              </span>
            </div>
          </div>

          {/* Vector & Relevance Badge */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {item.vector_score && (
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                Vector {Math.round(item.vector_score * 100)}%
              </span>
            )}
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
              {item.relevance_score}% match
            </span>
          </div>
        </div>

        {/* Google Title Link */}
        <h3 className="mb-1.5">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="google-title-link text-base md:text-lg font-normal line-clamp-2 block leading-snug"
          >
            {item.title}
          </a>
        </h3>

        {/* Subtitle / Channel / Author */}
        <div className="text-xs text-[#70757a] dark:text-[#9aa0a6] mb-2.5 flex items-center gap-2 flex-wrap">
          <span className="font-medium text-slate-700 dark:text-slate-300">{item.subtitle}</span>
          {item.badge && (
            <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800/40 font-mono">
              <Award className="w-2.5 h-2.5" />
              {item.badge}
            </span>
          )}
        </div>

        {/* Snippet */}
        <p className="google-snippet text-xs md:text-sm line-clamp-3 mb-4 leading-relaxed">
          {item.snippet}
        </p>
      </div>

      {/* Metrics & Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-[#3c4043] mt-auto">
        <div className="flex items-center justify-between text-[11px] text-[#70757a] dark:text-[#9aa0a6] font-mono mb-2">
          {isYouTube && (
            <>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-slate-400" />
                {item.metrics.views}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {item.metrics.duration}
              </span>
              <span>⭐ {item.metrics.rating}</span>
            </>
          )}

          {isLinkedIn && (
            <>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {item.metrics?.location || "Global"}
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold truncate max-w-[120px]">
                {item.metrics?.compensation || item.metrics?.engagement || item.metrics?.category || "Insight"}
              </span>
            </>
          )}

          {isMonster && (
            <>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-purple-400" />
                {item.metrics?.location || item.metrics?.scope || "Global"}
              </span>
              <span className="text-purple-600 dark:text-purple-400 font-semibold truncate max-w-[120px]">
                {item.metrics?.compensation || item.metrics?.domain || item.metrics?.read_time || "Workplace Guide"}
              </span>
            </>
          )}

          {isFoundit && (
            <>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-orange-400" />
                {item.metrics?.location || item.metrics?.region || "APAC / Global"}
              </span>
              <span className="text-orange-600 dark:text-orange-400 font-semibold truncate max-w-[120px]">
                {item.metrics?.compensation || item.metrics?.trend || item.metrics?.market_sector || "Market Trend"}
              </span>
            </>
          )}

          {isInstagram && (
            <>
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-3 h-3 text-slate-400" />
                {item.metrics.likes}
              </span>
              <span>💬 {item.metrics.comments}</span>
              <span>⏱️ {item.metrics.duration}</span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 overflow-hidden">
            {item.semantic_concept && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/40 truncate max-w-[140px]">
                {item.semantic_concept}
              </span>
            )}
            {(item.tags || []).slice(0, 2).map((tag, tIdx) => (
              <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[#70757a] dark:text-[#9aa0a6] truncate max-w-[90px]">
                {tag}
              </span>
            ))}
          </div>

          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-[#8ab4f8] hover:underline transition-colors flex-shrink-0"
          >
            <span>Open</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
