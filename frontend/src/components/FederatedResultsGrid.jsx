import React, { useState, useEffect, useRef } from 'react';
import ResultCard from './ResultCard';
import { 
  LayoutGrid, Sparkles, 
  ArrowDown, Compass, Search, ArrowUp, RefreshCw,
  ExternalLink, ChevronDown, ChevronUp, Layers, SearchX
} from 'lucide-react';
import { Youtube, Linkedin, Instagram, Monster, Foundit } from './PlatformIcons';

const PLATFORM_CONFIGS = [
  {
    id: 'youtube',
    platformName: 'YouTube',
    title: 'YouTube Pedagogical Engine',
    description: 'Full-length masterclasses, hardware teardowns, real-world benchmark shootouts, and architectural code walkthroughs with chapter-level semantic depth.',
    icon: Youtube,
    colorClasses: {
      iconBg: 'bg-red-500/10 text-red-500',
      badge: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800/50',
      activeBorder: 'border-red-500 ring-2 ring-red-500/20 shadow-lg dark:shadow-red-500/5',
      defaultBorder: 'border-slate-200 dark:border-[#5f6368] hover:border-red-400 dark:hover:border-red-500/50',
      btnActive: 'bg-red-600 hover:bg-red-700 text-white',
      btnEvoke: 'bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:hover:bg-red-900/50 dark:text-red-400 border border-red-200 dark:border-red-800/40',
      activeTab: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold'
    },
    url: 'https://www.youtube.com',
    urlLabel: 'youtube.com ↗'
  },
  {
    id: 'linkedin',
    platformName: 'LinkedIn',
    title: 'LinkedIn Professional Index',
    description: 'Verified industry leadership profiles, enterprise insights, company updates, professional articles, and talent networks.',
    icon: Linkedin,
    colorClasses: {
      iconBg: 'bg-blue-500/10 text-blue-500',
      badge: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/50',
      activeBorder: 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg dark:shadow-blue-500/5',
      defaultBorder: 'border-slate-200 dark:border-[#5f6368] hover:border-blue-400 dark:hover:border-blue-500/50',
      btnActive: 'bg-blue-600 hover:bg-blue-700 text-white',
      btnEvoke: 'bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40',
      activeTab: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
    },
    url: 'https://www.linkedin.com',
    urlLabel: 'linkedin.com ↗'
  },
  {
    id: 'monster',
    platformName: 'Monster',
    title: 'Monster Workplace Engine',
    description: 'Workplace technology guides, industry perspectives, career insights, and global employer research.',
    icon: Monster,
    colorClasses: {
      iconBg: 'bg-purple-500/10 text-purple-500',
      badge: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800/50',
      activeBorder: 'border-purple-500 ring-2 ring-purple-500/20 shadow-lg dark:shadow-purple-500/5',
      defaultBorder: 'border-slate-200 dark:border-[#5f6368] hover:border-purple-400 dark:hover:border-purple-500/50',
      btnActive: 'bg-purple-600 hover:bg-purple-700 text-white',
      btnEvoke: 'bg-purple-50 hover:bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 dark:text-purple-400 border border-purple-200 dark:border-purple-800/40',
      activeTab: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-semibold'
    },
    url: 'https://www.monster.com/',
    urlLabel: 'monster.com ↗'
  },
  {
    id: 'foundit',
    platformName: 'Foundit',
    title: 'foundit Talent & Industry Hub',
    description: 'Industry market trends, tech ecosystem evolution, recruiter connectivity, and APAC talent insights.',
    icon: Foundit,
    colorClasses: {
      iconBg: 'bg-orange-500/10 text-orange-500',
      badge: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800/50',
      activeBorder: 'border-orange-500 ring-2 ring-orange-500/20 shadow-lg dark:shadow-orange-500/5',
      defaultBorder: 'border-slate-200 dark:border-[#5f6368] hover:border-orange-400 dark:hover:border-orange-500/50',
      btnActive: 'bg-orange-600 hover:bg-orange-700 text-white',
      btnEvoke: 'bg-orange-50 hover:bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:hover:bg-orange-900/50 dark:text-orange-400 border border-orange-200 dark:border-orange-800/40',
      activeTab: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-semibold'
    },
    url: 'https://www.foundit.in/',
    urlLabel: 'foundit.in ↗'
  },
  {
    id: 'instagram',
    platformName: 'Instagram',
    title: 'Instagram Visual Pulse Radar',
    description: 'High-velocity 60-second dev reels, tactical productivity shortcuts, visual decision infographics, and creator aesthetic workspace engineering.',
    icon: Instagram,
    colorClasses: {
      iconBg: 'bg-pink-500/10 text-pink-500',
      badge: 'bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-950/40 dark:text-pink-400 dark:border-pink-800/50',
      activeBorder: 'border-pink-500 ring-2 ring-pink-500/20 shadow-lg dark:shadow-pink-500/5',
      defaultBorder: 'border-slate-200 dark:border-[#5f6368] hover:border-pink-400 dark:hover:border-pink-500/50',
      btnActive: 'bg-pink-600 hover:bg-pink-700 text-white',
      btnEvoke: 'bg-pink-50 hover:bg-pink-100 text-pink-600 dark:bg-pink-950/40 dark:hover:bg-pink-900/50 dark:text-pink-400 border border-pink-200 dark:border-pink-800/40',
      activeTab: 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 font-semibold'
    },
    url: 'https://www.instagram.com',
    urlLabel: 'instagram.com ↗'
  }
];

const checkIsJobQuery = (queryText = '', items = []) => {
  const clean = (queryText || '').toLowerCase();
  const jobWords = ['job', 'jobs', 'career', 'careers', 'hiring', 'hire', 'vacancy', 'vacancies', 'opening', 'openings', 'salary', 'internship', 'employment'];
  if (jobWords.some(w => clean.includes(w))) return true;
  if (items && items.some(i => i.content_format?.toLowerCase().includes('job') || i.tags?.includes('jobs') || i.tags?.includes('vacancies') || i.url?.toLowerCase().includes('/jobs/'))) return true;
  return false;
};

const getRelatablePlatformInfo = (cfg, searchQuery, platformItems = []) => {
  const cleanQ = (searchQuery || '').trim();
  const hasItems = platformItems && platformItems.length > 0;
  const isJob = checkIsJobQuery(cleanQ, platformItems);

  if (!cleanQ) {
    return {
      title: `${cfg.platformName} Live Search`,
      description: `Explore live video streams, verified professional roles, career vacancies, and creator reels on ${cfg.platformName}.`
    };
  }

  const queryDisplay = cleanQ.length > 40 ? cleanQ.slice(0, 38) + '…' : cleanQ;

  switch (cfg.id) {
    case 'youtube': {
      const title = `"${queryDisplay}" on YouTube`;
      const description = hasItems
        ? `Watch top video reviews, tutorials, teardowns, and creator perspectives for "${queryDisplay}".`
        : `No video streams found for "${queryDisplay}" on YouTube.`;
      return { title, description };
    }

    case 'linkedin': {
      const title = `"${queryDisplay}" on LinkedIn`;
      const description = hasItems
        ? (isJob
            ? `Discover active hiring openings, leadership profiles, and career opportunities for "${queryDisplay}".`
            : `Discover professional insights, leadership profiles, industry articles, and discussions for "${queryDisplay}".`)
        : `No professional discussions or roles found for "${queryDisplay}" on LinkedIn.`;
      return { title, description };
    }

    case 'monster': {
      const title = isJob ? `"${queryDisplay}" Jobs on Monster` : `"${queryDisplay}" on Monster`;
      const description = hasItems
        ? (isJob
            ? `Search active job vacancies, hiring requirements, and career opportunities for "${queryDisplay}".`
            : `Explore workplace guides, technology insights, and industry analysis for "${queryDisplay}".`)
        : `No active job listings or workplace guides found for "${queryDisplay}" on Monster.`;
      return { title, description };
    }

    case 'foundit': {
      const title = isJob ? `"${queryDisplay}" Vacancies on foundit` : `"${queryDisplay}" on foundit`;
      const description = hasItems
        ? (isJob
            ? `Explore verified job openings, employer hiring drives, and engineering positions for "${queryDisplay}".`
            : `Discover industry trends, technology evolution, and market insights for "${queryDisplay}".`)
        : `No active vacancies or market reports found for "${queryDisplay}" on foundit.`;
      return { title, description };
    }

    case 'instagram': {
      const title = `"${queryDisplay}" on Instagram`;
      const description = hasItems
        ? `Browse trending reels, creator shorts, visual showcases, and community highlights for "${queryDisplay}".`
        : `No reels or visual posts found for "${queryDisplay}" on Instagram.`;
      return { title, description };
    }

    default:
      return {
        title: `"${queryDisplay}" on ${cfg.platformName}`,
        description: hasItems
          ? `Explore live search results and real-time internet intelligence for "${queryDisplay}".`
          : `No results found for "${queryDisplay}" on ${cfg.platformName}.`
      };
  }
};

function EmptyMatchesState({ cfg, query, directPlatformUrl }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isRippling, setIsRippling] = useState(false);

  const handleOrbClick = () => {
    setIsRippling(true);
    setTimeout(() => setIsRippling(false), 800);
  };

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleOrbClick}
      className="relative overflow-hidden py-8 px-6 rounded-2xl bg-gradient-to-b from-slate-50/90 via-white/60 to-slate-100/70 dark:from-[#202124]/90 dark:via-[#1a1b1e]/70 dark:to-[#171717]/90 border border-dashed border-slate-300 dark:border-[#3c4043] text-center transition-all duration-300 group hover:border-blue-400 dark:hover:border-blue-500/60 hover:shadow-lg dark:hover:shadow-blue-500/5 select-none"
    >
      {/* Dynamic ambient color glow tailored to platform */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 dark:opacity-20 group-hover:opacity-60 transition-opacity duration-500">
        <div className="w-72 h-36 rounded-full bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 blur-3xl animate-pulse" />
      </div>

      {/* Interactive Scanning Radar Animation */}
      <div className="relative mx-auto mb-4 w-20 h-20 flex items-center justify-center">
        {/* Pulsing ring 1 */}
        <span 
          className={`absolute inset-0 rounded-full border border-blue-400/40 dark:border-blue-500/40 transition-all ${
            isRippling || isHovered ? 'animate-ping' : 'animate-pulse'
          }`} 
        />
        {/* Outer dashed compass ring that spins */}
        <span 
          className="absolute -inset-2.5 rounded-full border border-dashed border-slate-300 dark:border-slate-600/50 animate-spin" 
          style={{ animationDuration: isHovered ? '5s' : '14s' }} 
        />
        {/* Secondary inner ring */}
        <span className="absolute inset-2 rounded-full border border-slate-200 dark:border-slate-700/60" />

        {/* Central Radar Orb */}
        <div className="relative w-14 h-14 rounded-full bg-white dark:bg-[#303134] border border-slate-200 dark:border-slate-600 shadow-md flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-blue-500/20">
          <SearchX className="w-6 h-6 text-slate-400 transition-colors duration-300 group-hover:text-blue-500 dark:group-hover:text-[#8ab4f8]" />
          
          {/* Rotating radar scan sweep beam */}
          <div 
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-blue-500/25 to-transparent pointer-events-none animate-spin" 
            style={{ animationDuration: isHovered ? '1.5s' : '3.5s' }}
          />

          {/* Micro pulsing alert dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 shadow-xs animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400" />
        </div>
      </div>

      {/* Notice header & relatable message */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-2 shadow-xs transition-transform duration-200 group-hover:scale-105">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span>Sorry, no matches found</span>
        </div>

        <h4 className="text-sm font-bold text-slate-800 dark:text-[#e8eaed] mb-1">
          No matching entities discovered on {cfg.platformName}
        </h4>

        <p className="text-xs text-slate-500 dark:text-[#9aa0a6] max-w-md mx-auto leading-relaxed mb-4">
          Live stream search scanned verified {cfg.platformName} indexes, but found no active results for{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-200">"{query}"</span>.
        </p>

        {/* Action Button & Pro Tip */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <a
            href={directPlatformUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-sm hover:shadow-md transition-all duration-200 group/btn"
          >
            <span>Search live on {cfg.platformName}</span>
            <ExternalLink className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </a>

          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-[#303134] border border-slate-200/60 dark:border-slate-700/50">
            💡 Pro tip: Try broader keywords or inspect other platform tabs
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FederatedResultsGrid({
  results = [],
  activePlatform = 'all',
  totalLatency = 0,
  platformLatencies = {},
  query = '',
  activeInspectedItem,
  onHoverCard,
  onLoadMore,
  isLoadingMore = false,
  hasMore = true,
  currentPage = 1,
  relatedSuggestions = [],
  onSelectRelatedQuery,
}) {
  const [activeTab, setActiveTab] = useState('all');
  // State for which platforms are expanded (defaults to all platforms expanded so user sees results in all 5 platforms!)
  const [expandedPlatforms, setExpandedPlatforms] = useState(() => {
    if (activePlatform !== 'all') {
      return new Set([activePlatform.toLowerCase()]);
    }
    return new Set(['youtube', 'linkedin', 'monster', 'foundit', 'instagram']);
  });

  const [showBackToTop, setShowBackToTop] = useState(false);
  const sentinelRef = useRef(null);

  // Sync when activePlatform prop changes
  useEffect(() => {
    if (activePlatform !== 'all') {
      setExpandedPlatforms(new Set([activePlatform.toLowerCase()]));
      setActiveTab(activePlatform.toLowerCase());
    } else {
      setActiveTab('all');
      setExpandedPlatforms(new Set(['youtube', 'linkedin', 'monster', 'foundit', 'instagram']));
    }
  }, [activePlatform]);

  const effectiveFilter = activePlatform !== 'all' ? activePlatform : activeTab;

  const ytCount = results.filter((i) => i.platform === 'YouTube').length;
  const liCount = results.filter((i) => i.platform === 'LinkedIn').length;
  const monsterCount = results.filter((i) => i.platform === 'Monster').length;
  const founditCount = results.filter((i) => i.platform === 'Foundit').length;
  const igCount = results.filter((i) => i.platform === 'Instagram').length;

  const latencySeconds = (totalLatency / 1000).toFixed(3);

  // Proactive IntersectionObserver for Infinite Scrolling Sentinel (triggers 600px ahead)
  useEffect(() => {
    if (!onLoadMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !isLoadingMore && hasMore) {
          onLoadMore();
        }
      },
      { root: null, rootMargin: '600px', threshold: 0 }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) observer.unobserve(currentSentinel);
    };
  }, [onLoadMore, isLoadingMore, hasMore]);

  // Fallback Window Scroll Listener & Back to Top Tracker
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setShowBackToTop(scrollY > 650);

      if (!onLoadMore || isLoadingMore || !hasMore) return;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight || document.documentElement.clientHeight;
      if (scrollY + clientHeight >= scrollHeight - 600) {
        onLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onLoadMore, isLoadingMore, hasMore]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTogglePlatform = (platformId) => {
    setExpandedPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(platformId)) {
        next.delete(platformId);
      } else {
        next.add(platformId);
      }
      return next;
    });
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId !== 'all') {
      setExpandedPlatforms(new Set([tabId]));
    } else {
      setExpandedPlatforms(new Set(['youtube', 'linkedin', 'monster', 'foundit', 'instagram']));
    }
  };

  // Determine platforms to show based on tab filter
  const visibleConfigs = effectiveFilter === 'all'
    ? PLATFORM_CONFIGS
    : PLATFORM_CONFIGS.filter(cfg => cfg.id === effectiveFilter.toLowerCase());

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 relative">
      {/* Platform Category Tabs - Centered & Interactive */}
      {activePlatform === 'all' && (
        <div className="border-b border-slate-200 dark:border-[#3c4043] mb-6 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-sm scrollbar-none justify-start sm:justify-center">
            <button
              onClick={() => handleTabClick('all')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer active:scale-95 ${
                activeTab === 'all'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold shadow-xs ring-1 ring-blue-500/30'
                  : 'text-[#5f6368] dark:text-[#9aa0a6] hover:bg-slate-100 dark:hover:bg-[#303134] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All 5 Platforms ({results.length})</span>
            </button>
            <button
              onClick={() => handleTabClick('youtube')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer active:scale-95 ${
                activeTab === 'youtube'
                  ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold shadow-xs ring-1 ring-red-500/30'
                  : 'text-[#5f6368] dark:text-[#9aa0a6] hover:bg-slate-100 dark:hover:bg-[#303134] hover:text-red-600 dark:hover:text-red-400'
              }`}
            >
              <Youtube className="w-3.5 h-3.5 text-red-500" />
              <span>YouTube ({ytCount})</span>
            </button>
            <button
              onClick={() => handleTabClick('linkedin')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer active:scale-95 ${
                activeTab === 'linkedin'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold shadow-xs ring-1 ring-blue-500/30'
                  : 'text-[#5f6368] dark:text-[#9aa0a6] hover:bg-slate-100 dark:hover:bg-[#303134] hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <Linkedin className="w-3.5 h-3.5 text-blue-500" />
              <span>LinkedIn ({liCount})</span>
            </button>
            <button
              onClick={() => handleTabClick('monster')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer active:scale-95 ${
                activeTab === 'monster'
                  ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-semibold shadow-xs ring-1 ring-purple-500/30'
                  : 'text-[#5f6368] dark:text-[#9aa0a6] hover:bg-slate-100 dark:hover:bg-[#303134] hover:text-purple-600 dark:hover:text-purple-400'
              }`}
            >
              <Monster className="w-3.5 h-3.5 text-purple-500" />
              <span>Monster ({monsterCount})</span>
            </button>
            <button
              onClick={() => handleTabClick('foundit')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer active:scale-95 ${
                activeTab === 'foundit'
                  ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-semibold shadow-xs ring-1 ring-orange-500/30'
                  : 'text-[#5f6368] dark:text-[#9aa0a6] hover:bg-slate-100 dark:hover:bg-[#303134] hover:text-orange-600 dark:hover:text-orange-400'
              }`}
            >
              <Foundit className="w-3.5 h-3.5 text-orange-500" />
              <span>foundit ({founditCount})</span>
            </button>
            <button
              onClick={() => handleTabClick('instagram')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer active:scale-95 ${
                activeTab === 'instagram'
                  ? 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 font-semibold shadow-xs ring-1 ring-pink-500/30'
                  : 'text-[#5f6368] dark:text-[#9aa0a6] hover:bg-slate-100 dark:hover:bg-[#303134] hover:text-pink-600 dark:hover:text-pink-400'
              }`}
            >
              <Instagram className="w-3.5 h-3.5 text-pink-500" />
              <span>Instagram ({igCount})</span>
            </button>
          </div>
        </div>
      )}

      {/* Centered Interactive Platforms Stream */}
      <div className="w-full flex flex-col gap-5">
        {/* Exact order: 1. YouTube, 2. LinkedIn, 3. Monster, 4. foundit, 5. Instagram */}
        <div className="flex flex-col gap-5">
          {visibleConfigs.map((cfg) => {
            const PlatformIcon = cfg.icon;
            const platformItems = results.filter(
              (item) => item.platform.toLowerCase() === cfg.platformName.toLowerCase()
            );
            const platformLatency = platformLatencies[cfg.platformName];
            const isExtended = expandedPlatforms.has(cfg.id);
            const platformInfo = getRelatablePlatformInfo(cfg, query, platformItems);
            const isJob = checkIsJobQuery(query, platformItems);
            const directPlatformUrl = query && query.trim()
              ? cfg.id === 'youtube'
                ? `https://www.youtube.com/results?search_query=${encodeURIComponent(query.trim())}`
                : cfg.id === 'linkedin'
                ? (isJob
                    ? `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query.trim())}`
                    : `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(query.trim())}`)
                : cfg.id === 'monster'
                ? (isJob
                    ? `https://www.monster.com/jobs/search?q=${encodeURIComponent(query.trim())}`
                    : `https://www.monster.com/career-advice/search?q=${encodeURIComponent(query.trim())}`)
                : cfg.id === 'foundit'
                ? (isJob
                    ? `https://www.foundit.in/srp/results?query=${encodeURIComponent(query.trim().replace(/\([^)]*\)/g, ' ').replace(/[^a-zA-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim() || 'Software Engineer')}`
                    : `https://www.foundit.in/career-advice/?q=${encodeURIComponent(query.trim())}`)
                : `https://www.instagram.com/explore/tags/${encodeURIComponent(query.trim().replace(/\s+/g, ''))}/`
              : cfg.url;

            return (
              <div
                key={cfg.id}
                id={`platform-card-${cfg.id}`}
                className={`p-5 rounded-2xl bg-white dark:bg-[#303134] border transition-all duration-300 ${
                  isExtended
                    ? `${cfg.colorClasses.activeBorder} shadow-md`
                    : `${cfg.colorClasses.defaultBorder} shadow-sm hover:shadow-lg hover:-translate-y-0.5 cursor-pointer`
                }`}
                onClick={() => !isExtended && handleTogglePlatform(cfg.id)}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${cfg.colorClasses.iconBg} flex items-center justify-center flex-shrink-0 shadow-xs transition-transform duration-200 hover:scale-105`}>
                    <PlatformIcon className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-2">
                    {/* External Link */}
                    <a
                      href={directPlatformUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[11px] font-mono text-blue-600 dark:text-[#8ab4f8] hover:underline flex items-center gap-1 px-2.5 py-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                      title={`Open live search for "${query || cfg.platformName}" on ${cfg.platformName}`}
                    >
                      <span>{cfg.urlLabel}</span>
                    </a>

                    {/* Evoke / Extend / Collapse Interactive Toggle Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePlatform(cfg.id);
                      }}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 font-semibold shadow-xs cursor-pointer active:scale-95 ${
                        isExtended
                          ? `${cfg.colorClasses.btnActive} ring-2 ring-offset-1 ring-current/20`
                          : `${cfg.colorClasses.btnEvoke} hover:shadow-sm`
                      }`}
                      title={isExtended ? "Collapse platform preview" : `Expand & preview ${cfg.platformName} live entities`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isExtended ? 'bg-white' : 'bg-current'} animate-pulse`}></span>
                      <span>{isExtended ? 'Extended' : 'Evoke & Preview'}</span>
                      {isExtended ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Relatable Title & Stats */}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-base font-bold text-slate-800 dark:text-[#e8eaed] truncate" title={platformInfo.title}>
                    {platformInfo.title}
                  </h3>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border ${cfg.colorClasses.badge}`}>
                      {platformItems.length} {platformItems.length === 1 ? 'Result' : 'Results'}
                    </span>
                    {platformLatency && (
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#202124] px-1.5 py-0.5 rounded">
                        ⚡ {platformLatency}ms
                      </span>
                    )}
                  </div>
                </div>

                {/* Relatable Caption & Description */}
                <p className="text-xs text-[#70757a] dark:text-[#9aa0a6] leading-relaxed mb-1 line-clamp-2">
                  {platformInfo.description}
                </p>

                {/* EXTENDED RESULTS PREVIEW (Shown when this platform is expanded) */}
                {isExtended && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#3c4043] animate-in fade-in duration-200">
                    <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live Stream for {cfg.platformName} ({platformItems.length} Entities)
                      </span>
                      <span className="text-[11px]">Click any card to open live resource</span>
                    </div>

                    {platformItems.length > 0 ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {platformItems.map((item) => (
                            <ResultCard
                              key={item.id}
                              item={item}
                              isInspected={activeInspectedItem?.id === item.id}
                              onHover={onHoverCard}
                            />
                          ))}
                        </div>
                        <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-[#3c4043] flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                          <span>Showing {platformItems.length} live entities for {cfg.platformName}</span>
                          <span className="text-blue-500 dark:text-blue-400 flex items-center gap-1 font-medium">
                            <span>Scroll down to discover more</span>
                            <ArrowDown className="w-3 h-3 animate-bounce" />
                          </span>
                        </div>
                      </>
                    ) : (
                      <EmptyMatchesState
                        cfg={cfg}
                        query={query}
                        directPlatformUrl={directPlatformUrl}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Related Explorations & Suggested Queries */}
        {relatedSuggestions && relatedSuggestions.length > 0 && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#202124] border border-slate-200 dark:border-[#3c4043] my-2">
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Compass className="w-4 h-4 text-blue-500" />
              <span>Suggested Deep-Dive Explorations:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {relatedSuggestions.map((phrase, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectRelatedQuery && onSelectRelatedQuery(phrase)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-[#303134] text-slate-700 dark:text-[#bdc1c6] border border-slate-200 dark:border-[#5f6368] hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-sm transition-all"
                >
                  <Search className="w-3 h-3 text-[#9aa0a6]" />
                  <span>{phrase}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Infinite Scroll Continuous Streaming Feedback */}
        {isLoadingMore ? (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 backdrop-blur-sm flex flex-col items-center justify-center text-center my-3 transition-all animate-pulse">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 animate-spin">
                <RefreshCw className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Synthesizing next intelligence cluster {query ? `for "${query}"` : ''} across YouTube, LinkedIn, Monster, foundit, Instagram...
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Streaming Tier {currentPage + 1} • Performing dense 512-D ontological rank alignment
            </p>
          </div>
        ) : hasMore ? (
          <div className="py-6 flex flex-col items-center justify-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-[#303134] text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#5f6368]">
              <ArrowDown className="w-3.5 h-3.5 text-blue-500 animate-bounce" />
              <span>Scroll down to continuously discover more intelligence</span>
            </div>
            <button
              onClick={() => onLoadMore && onLoadMore()}
              className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline font-mono"
            >
              Or click here to load Tier {currentPage + 1}
            </button>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-400 font-mono">
            ✦ You have reached the frontier of indexed intelligence for this query ✦
          </div>
        )}

        {/* Invisible Scroll Observer Sentinel */}
        <div ref={sentinelRef} className="h-6 w-full pointer-events-none opacity-0" />
      </div>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300 z-50 flex items-center justify-center group"
          title="Scroll back to top"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
}
