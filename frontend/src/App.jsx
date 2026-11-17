import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import SearchDashboard from './components/SearchDashboard';
import FederatedResultsGrid from './components/FederatedResultsGrid';
import RecentActivityBar from './components/RecentActivityBar';
import ContextualFeed from './components/ContextualFeed';
import InteractiveCanvas from './components/InteractiveCanvas';
import CyberDashboardBackground from './components/CyberDashboardBackground';
import KidsPortal from './components/KidsPortal';
import ParentalControlModal from './components/ParentalControlModal';
import UserProfileGate from './components/UserProfileGate';
import OfflineGameModal from './components/OfflineGameModal';
import { Youtube, Linkedin, Instagram, Monster, Foundit } from './components/PlatformIcons';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [interactiveParticles, setInteractiveParticles] = useState(true);
  const [logoTransform, setLogoTransform] = useState('');
  const logoRef = useRef(null);

  // Active User Profile Security State ('null' ensures Who's using velloX? profile selection screen is always shown on open)
  const [activeUser, setActiveUser] = useState(null);

  // Interface Mode: 'standard' or 'kids' (Parental Control)
  const [interfaceMode, setInterfaceMode] = useState(() => {
    try {
      return localStorage.getItem('vellox_interface_mode') || 'standard';
    } catch {
      return 'standard';
    }
  });
  const [showParentalGate, setShowParentalGate] = useState(false);

  const [activePlatform, setActivePlatform] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalLatency, setTotalLatency] = useState(0);
  const [platformLatencies, setPlatformLatencies] = useState({});
  const [activeInspectedItem, setActiveInspectedItem] = useState(null);

  // Infinite Scroll & Multi-Page Continuous Streaming State
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [relatedSuggestions, setRelatedSuggestions] = useState([]);

  // Direct Offline Auto-Launcher & Arcade State
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [showOfflineGame, setShowOfflineGame] = useState(() => (typeof navigator !== 'undefined' ? !navigator.onLine : false));

  useEffect(() => {
    let isCancelled = false;

    const handleOffline = () => {
      if (isCancelled) return;
      setIsOnline(false);
      // Auto-launch the game directly when offline!
      setShowOfflineGame(true);
    };

    const handleOnline = () => {
      if (isCancelled) return;
      setIsOnline(true);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    // Active heartbeat check every 2.5s to reliably detect offline even on localhost
    const interval = setInterval(async () => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        if (!isCancelled) {
          setIsOnline(false);
          setShowOfflineGame(true);
        }
        return;
      }

      try {
        const ctrl = new AbortController();
        const tid = setTimeout(() => ctrl.abort(), 1200);
        await fetch('https://www.google.com/favicon.ico', {
          mode: 'no-cors',
          cache: 'no-store',
          signal: ctrl.signal
        });
        clearTimeout(tid);
        if (!isCancelled) setIsOnline(true);
      } catch (err) {
        if (!isCancelled) {
          setIsOnline(false);
          setShowOfflineGame(true);
        }
      }
    }, 2500);

    return () => {
      isCancelled = true;
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      clearInterval(interval);
    };
  }, []);

  // 3D Perspective Deflection on velloX Logo & Live Telemetry
  useEffect(() => {
    const handlePointer = (e) => {
      const { x, y } = e.detail;

      if (!logoRef.current) return;
      const rect = logoRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.hypot(x - centerX, y - centerY);

      if (dist < 400) {
        const factor = 1 - dist / 400;
        const rotX = (y - centerY) * -0.04 * factor;
        const rotY = (x - centerX) * 0.04 * factor;
        setLogoTransform(`perspective(800px) rotateX(${rotX.toFixed(1)}deg) rotateY(${rotY.toFixed(1)}deg) scale(${1 + factor * 0.03})`);
      } else {
        setLogoTransform('perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)');
      }
    };

    window.addEventListener('vellox-pointer-move', handlePointer);
    return () => window.removeEventListener('vellox-pointer-move', handlePointer);
  }, []);

  // Cross-Platform Context & Topic Recommendations State
  const [activeContext, setActiveContext] = useState(null);
  const [contextRecommendations, setContextRecommendations] = useState([]);
  const [quickPills, setQuickPills] = useState([]);
  const [isContextLoading, setIsContextLoading] = useState(false);

  // Sync theme with html class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Initial load: Fetch recommendations for the active context (e.g. YouTube: phone)
  useEffect(() => {
    const fetchContextData = async () => {
      try {
        const ctxRes = await fetch('http://127.0.0.1:8000/api/context');
        if (ctxRes.ok) {
          const ctxData = await ctxRes.json();
          if (ctxData.active_context) {
            setActiveContext(ctxData.active_context);
          }
        }

        const recRes = await fetch('http://127.0.0.1:8000/api/recommendations');
        if (recRes.ok) {
          const recData = await recRes.json();
          setContextRecommendations(recData.recommendations || []);
          setQuickPills(recData.quick_pills || []);
        }
      } catch (err) {
        console.error('Failed to load initial context & recommendations:', err);
      }
    };

    fetchContextData();
  }, []);

  // Handle setting / changing simulated external activity
  const handleSelectContext = async (platform, topic) => {
    setIsContextLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, topic })
      });
      if (!res.ok) throw new Error('Failed to record activity');
      const data = await res.json();
      setActiveContext(data.active_context);
      setContextRecommendations(data.recommendations || []);
      setQuickPills((data.recommendations || []).map(r => r.phrase).slice(0, 6));
    } catch (err) {
      console.error('Error switching activity context:', err);
    } finally {
      setIsContextLoading(false);
    }
  };

  // Clear external context back to neutral
  const handleClearContext = async () => {
    try {
      await fetch('http://127.0.0.1:8000/api/context', { method: 'DELETE' });
      setActiveContext(null);
      setContextRecommendations([]);
      setQuickPills([]);
    } catch (err) {
      console.error('Error clearing activity context:', err);
    }
  };

  const handleSearch = async (query) => {
    if (!query || !query.trim()) return;
    const cleanQuery = query.trim();

    // Direct check: If navigator.onLine is false or isOnline is false, launch the game directly!
    if ((typeof navigator !== 'undefined' && !navigator.onLine) || !isOnline) {
      setIsOnline(false);
      setShowOfflineGame(true);
      return;
    }

    // Fast active check: can we reach the internet? If offline, redirecting to Google will show Edge's ERR_INTERNET_DISCONNECTED error!
    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 800);
      await fetch('https://www.google.com/favicon.ico', {
        mode: 'no-cors',
        cache: 'no-store',
        signal: ctrl.signal
      });
      clearTimeout(tid);
    } catch (err) {
      // Internet is disconnected! Do NOT navigate to Google - launch the game directly!
      setIsOnline(false);
      setShowOfflineGame(true);
      return;
    }

    let searchTerms = cleanQuery;
    if (activePlatform && activePlatform !== 'all') {
      const platformSites = {
        youtube: 'site:youtube.com',
        linkedin: 'site:linkedin.com',
        monster: 'site:monster.com',
        foundit: 'site:foundit.in',
        instagram: 'site:instagram.com'
      };
      const siteFilter = platformSites[activePlatform.toLowerCase()];
      if (siteFilter) {
        searchTerms = `${cleanQuery} ${siteFilter}`;
      }
    }

    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerms)}`;
    window.location.href = googleUrl;
  };

  const handlePlatformChange = (platformId) => {
    setActivePlatform(platformId);
    setCurrentPage(1);
    setHasMore(true);
    if (searchQuery) {
      if ((typeof navigator !== 'undefined' && !navigator.onLine) || !isOnline) {
        setIsOnline(false);
        setShowOfflineGame(true);
        return;
      }
      let searchTerms = searchQuery.trim();
      if (platformId && platformId !== 'all') {
        const platformSites = {
          youtube: 'site:youtube.com',
          linkedin: 'site:linkedin.com',
          monster: 'site:monster.com',
          foundit: 'site:foundit.in',
          instagram: 'site:instagram.com'
        };
        const siteFilter = platformSites[platformId.toLowerCase()];
        if (siteFilter) {
          searchTerms = `${searchTerms} ${siteFilter}`;
        }
      }
      const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerms)}`;
      window.location.href = googleUrl;
    }
  };

  // Continuous Federated Streaming on User Scroll
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || !searchQuery || isSearching) return;
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/search?q=${encodeURIComponent(searchQuery.trim())}&platform=${activePlatform}&page=${nextPage}&page_size=8`
      );
      if (!res.ok) throw new Error('Failed to load more');
      const data = await res.json();

      const newItems = data.results || [];
      if (newItems.length > 0) {
        setSearchResults((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const existingTitles = new Set(prev.map((p) => `${p.platform}-${(p.title || '').trim().toLowerCase()}`));
          const filteredNew = newItems.filter((item) => {
            const titleKey = `${item.platform}-${(item.title || '').trim().toLowerCase()}`;
            return !existingIds.has(item.id) && !existingTitles.has(titleKey);
          });
          return [...prev, ...filteredNew];
        });
        setCurrentPage(nextPage);
        setHasMore(data.has_more ?? true);
        if (data.related_suggestions && data.related_suggestions.length > 0) {
          setRelatedSuggestions(data.related_suggestions);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more federated results:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, searchQuery, isSearching, currentPage, activePlatform]);

  const handleResetHome = () => {
    setSearchQuery('');
    setSearchResults([]);
    setActiveInspectedItem(null);
    setCurrentPage(1);
    setHasMore(true);
    setRelatedSuggestions([]);
  };

  const handleLogoClick = (e) => {
    handleResetHome();
    const rect = e.currentTarget.getBoundingClientRect();
    window.dispatchEvent(
      new CustomEvent('vellox-burst', {
        detail: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, count: 45 }
      })
    );
  };

  const handleSelectUser = (user, saveForNextLogin = true) => {
    setActiveUser(user);
    try {
      localStorage.setItem('vellox_active_user', JSON.stringify(user));
      if (saveForNextLogin) {
        localStorage.setItem('vellox_saved_account_for_login', 'true');
        localStorage.setItem('vellox_last_saved_user_id', user.id);
        localStorage.setItem('vellox_show_on_startup', 'false');
      } else {
        localStorage.setItem('vellox_saved_account_for_login', 'false');
      }
    } catch (err) {
      console.error(err);
    }
    window.dispatchEvent(
      new CustomEvent('vellox-burst', {
        detail: { x: window.innerWidth / 2, y: window.innerHeight / 2, count: 50 }
      })
    );
  };

  const handleSelectGuest = (guestUser) => {
    setActiveUser(guestUser);
    try {
      localStorage.setItem('vellox_active_user', JSON.stringify(guestUser));
      // Guest sessions are ephemeral by design
      localStorage.setItem('vellox_saved_account_for_login', 'false');
    } catch (err) {
      console.error(err);
    }
    window.dispatchEvent(
      new CustomEvent('vellox-burst', {
        detail: { x: window.innerWidth / 2, y: window.innerHeight / 2, count: 35 }
      })
    );
  };

  const handleSwitchProfile = () => {
    setActiveUser(null);
    try {
      localStorage.removeItem('vellox_active_user');
      localStorage.setItem('vellox_saved_account_for_login', 'false');
    } catch (err) {
      console.error(err);
    }
    handleResetHome();
  };

  // If no profile selected, display Chrome-style UserProfileGate (Search bar appears only AFTER profile selection)
  if (!activeUser) {
    return (
      <div className="relative min-h-screen">
        <OfflineGameModal
          isOpen={showOfflineGame}
          onClose={() => setShowOfflineGame(false)}
          isOnline={isOnline}
          onBackToSearch={() => setShowOfflineGame(false)}
        />
        <InteractiveCanvas isDark={isDark} enabled={interactiveParticles} />
        <UserProfileGate
          isDark={isDark}
          onSelectUser={handleSelectUser}
          onSelectGuest={handleSelectGuest}
          isOnline={isOnline}
          onLaunchOfflineGame={() => setShowOfflineGame(true)}
        />
      </div>
    );
  }

  if (interfaceMode === 'kids') {
    return (
      <div className="relative min-h-screen">
        <OfflineGameModal
          isOpen={showOfflineGame}
          onClose={() => setShowOfflineGame(false)}
          isOnline={isOnline}
          onBackToSearch={() => setShowOfflineGame(false)}
        />
        {/* Fullscreen Interactive Canvas Layer */}
        <InteractiveCanvas isDark={isDark} enabled={interactiveParticles} />

        <KidsPortal
          isDark={isDark}
          onExitKidsMode={() => setShowParentalGate(true)}
          onOpenParentalGate={() => setShowParentalGate(true)}
        />

        <ParentalControlModal
          isOpen={showParentalGate}
          onClose={() => setShowParentalGate(false)}
          onUnlockSuccess={() => {
            setShowParentalGate(false);
            setInterfaceMode('standard');
            try {
              localStorage.setItem('vellox_interface_mode', 'standard');
            } catch (err) {
              console.error(err);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col relative ${isDark ? 'bg-[#08091a] text-[#e8eaed]' : 'bg-[#f8fafc] text-slate-800'} transition-colors overflow-hidden`}>
      {/* Eye-Comfort Cyber Dashboard Background Layer (PCB traces, HUD panels, deep midnight gradient) */}
      <CyberDashboardBackground isDark={isDark} />

      {/* Fullscreen Interactive Canvas Layer */}
      <InteractiveCanvas isDark={isDark} enabled={interactiveParticles} />

      <Navbar 
        isDark={isDark} 
        onToggleTheme={() => setIsDark(!isDark)} 
        onResetHome={handleResetHome}
        interactiveParticles={interactiveParticles}
        onToggleInteractive={() => setInteractiveParticles(!interactiveParticles)}
        interfaceMode={interfaceMode}
        activeUser={activeUser}
        onSwitchProfile={handleSwitchProfile}
        isOnline={isOnline}
        onOpenOfflineGame={() => setShowOfflineGame(true)}
        onSwitchToKids={() => {
          setInterfaceMode('kids');
          try {
            localStorage.setItem('vellox_interface_mode', 'kids');
          } catch (err) {
            console.error(err);
          }
        }}
      />

      <ParentalControlModal
        isOpen={showParentalGate}
        onClose={() => setShowParentalGate(false)}
        onUnlockSuccess={() => {
          setShowParentalGate(false);
          setInterfaceMode('standard');
          try {
            localStorage.setItem('vellox_interface_mode', 'standard');
          } catch (err) {
            console.error(err);
          }
        }}
      />

      {/* Offline Direct Auto-Launch Arcade Modal */}
      <OfflineGameModal
        isOpen={showOfflineGame}
        onClose={() => setShowOfflineGame(false)}
        isOnline={isOnline}
        onBackToSearch={() => setShowOfflineGame(false)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col relative z-20">
        {/* velloX Logo & Hero Header */}
        {!searchQuery ? (
          <div className="text-center mt-6 sm:mt-10 mb-8 max-w-3xl mx-auto flex flex-col items-center">
            {/* velloX Multi-Color Iconic Logo with Magnetic 3D Stage & Letter Bounce */}
            <div 
              ref={logoRef}
              style={{ transform: logoTransform }}
              className="cursor-pointer mb-4 logo-interactive-stage transition-transform duration-100 ease-out flex flex-col items-center gap-3" 
              onClick={handleLogoClick}
              title="Click for particle celebration!"
            >
              <div className="relative group">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-500/40 via-purple-500/40 to-blue-500/40 blur-xl opacity-75 group-hover:opacity-100 transition duration-500"></div>
                <img 
                  src="/vellox-logo.png" 
                  alt="velloX" 
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-2xl transition-transform duration-300 hover:scale-105 select-none ring-2 ring-cyan-500/50" 
                />
              </div>
              <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[7.2rem] font-sans font-black tracking-tight select-none leading-none py-1">
                <span className="char-bounce text-[#3b82f6]">v</span>
                <span className="char-bounce text-[#ef4444]">e</span>
                <span className="char-bounce text-[#f59e0b]">l</span>
                <span className="char-bounce text-[#2563eb]">l</span>
                <span className="char-bounce text-[#10b981]">o</span>
                <span className="char-bounce text-[#ea580c] text-[1.08em]">X</span>
              </h1>
            </div>
          </div>
        ) : (
          <div className="text-center mb-4 max-w-2xl mx-auto flex items-center justify-center">
            <button
              onClick={handleLogoClick}
              className="text-4xl sm:text-5xl font-sans font-black tracking-tight select-none hover:opacity-90 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              title="Return to velloX Home"
            >
              <span className="char-bounce text-[#3b82f6]">v</span>
              <span className="char-bounce text-[#ef4444]">e</span>
              <span className="char-bounce text-[#f59e0b]">l</span>
              <span className="char-bounce text-[#2563eb]">l</span>
              <span className="char-bounce text-[#10b981]">o</span>
              <span className="char-bounce text-[#ea580c] text-[1.08em]">X</span>
            </button>
          </div>
        )}

        {/* Google Search Bar with Context Recommendations & Trie Autocomplete */}
        <SearchDashboard
          onSearch={handleSearch}
          activePlatform={activePlatform}
          onPlatformChange={handlePlatformChange}
          isSearching={isSearching}
          activeContext={activeContext}
          contextRecommendations={contextRecommendations}
          isOnline={isOnline}
          onLaunchOfflineGame={() => setShowOfflineGame(true)}
        />

        {/* Personalized Contextual Intelligence Feed on Home View */}
        {!searchQuery && activeContext && (
          <ContextualFeed
            activeContext={activeContext}
            recommendations={contextRecommendations}
            quickPills={quickPills}
            onSelectQuery={handleSearch}
          />
        )}

        {/* Federated Search Results Grid with Continuous Multi-Page Infinite Stream */}
        {searchResults.length > 0 && (
          <FederatedResultsGrid
            results={searchResults}
            activePlatform={activePlatform}
            totalLatency={totalLatency}
            platformLatencies={platformLatencies}
            query={searchQuery}
            activeInspectedItem={activeInspectedItem}
            onHoverCard={(item) => setActiveInspectedItem(item)}
            onLoadMore={handleLoadMore}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            currentPage={currentPage}
            relatedSuggestions={relatedSuggestions}
            onSelectRelatedQuery={handleSearch}
          />
        )}


      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-indigo-500/20 bg-white/75 dark:bg-[#0a0c20]/80 backdrop-blur-md py-3.5 px-6 text-xs text-[#70757a] dark:text-[#9aa0a6] flex items-center justify-center mt-auto relative z-20">
        <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
          velloX Search Platform
        </div>
      </footer>
    </div>
  );
}
