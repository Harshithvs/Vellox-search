import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Search, X, Sparkles, ShieldCheck, Play, Lock, AlertTriangle, 
  Volume2, ArrowRight, ExternalLink, CheckCircle2, RotateCcw, Loader2,
  Timer, Moon, Clock
} from 'lucide-react';
import KidsModeEntranceSplash from './KidsModeEntranceSplash';

// Verified YouTube Video IDs and Thumbnails for popular cartoon icons
const KNOWN_CARTOON_YOUTUBE_IDS = {
  // Russia / Europe
  'masha': 'KBP8NNMB8wo',
  'masha and the bear': 'KBP8NNMB8wo',
  // Japan anime & cartoons
  'doraemon': 'qajaHK5dcQA',
  'nobita': 'qajaHK5dcQA',
  'pokemon': 'VYcgvukt7jc',
  'pikachu': 'VYcgvukt7jc',
  'ash ketchum': 'VYcgvukt7jc',
  'totoro': 'HaLISMAGdOE',
  'ghibli': 'HaLISMAGdOE',
  'studio ghibli': 'HaLISMAGdOE',
  'digimon': 'kBV3PvdHrDw',
  'beyblade': 'zS8nFd2_8CM',
  'dragon ball': 'VhKtn3G5eM4',
  'goku': 'VhKtn3G5eM4',
  'naruto': 'u_3Uac1E2JU',
  'sasuke': 'u_3Uac1E2JU',
  'boruto': 'u_3Uac1E2JU',
  'shinchan': 'eXX-4Jy31cc',
  'shin-chan': 'eXX-4Jy31cc',
  'crayon shin': 'eXX-4Jy31cc',
  'one piece': 'sHop6asiT1c',
  'chopper': 'sHop6asiT1c',
  'luffy': 'sHop6asiT1c',
  'tsubasa': 'qIOYIFiHadg',
  'captain tsubasa': 'qIOYIFiHadg',
  'inazuma': 'Voewwc7YL64',
  'inazuma eleven': 'Voewwc7YL64',
  'conan': 'dG20f9ulqII',
  'detective conan': 'dG20f9ulqII',
  'sailor moon': 'JYjDxZ_ct1o',
  'astro boy': 'smVQzUogLQM',
  'astroboy': 'smVQzUogLQM',
  'ponyo': 'CsR3KVgBzSM',
  // France
  'oggy': 'WkiWnGwqreM',
  'cockroaches': 'WkiWnGwqreM',
  'miraculous': 'VCwtE3L-u7w',
  'ladybug': 'VCwtE3L-u7w',
  // India
  'bheem': 'CA9AIy5CIRI',
  'chhota bheem': 'CA9AIy5CIRI',
  'motu': 'V_6I30jIIC0',
  'patlu': 'V_6I30jIIC0',
  'motu patlu': 'V_6I30jIIC0',
  'little singham': 'R_-0G6g1Rlg',
  'shiva': 'h1Odc779Kjk',
  // Australia / UK
  'bluey': 'mNt8QH-fyyY',
  'bingo': 'mNt8QH-fyyY',
  'peppa': 'RjHq-aimIuk',
  'peppa pig': 'RjHq-aimIuk',
  'shaun': 'VWTopJvSLzs',
  'shaun the sheep': 'VWTopJvSLzs',
  'thomas': 'H-6AX5GbAYo',
  // Korea
  'pororo': '8QlsGwTI3F4',
  'larva': 'aTc-6bX-b6Q',
  'tayo': 'eR8qAhJNfYw',
  'robocar': 'pg9k812F6sY',
  'pucca': 'r_SAwslOUbQ',
  // Belgium / Spain
  'smurf': 'xoLOsbgKRoM',
  'smurfs': 'xoLOsbgKRoM',
  'papa smurf': 'xoLOsbgKRoM',
  'pocoyo': 'swVI1aYW8E0',
  'tintin': 'BRJbzGoCdfE',
  // USA / Western
  'tom and jerry': 'Gkysb_8N9os',
  'tom jerry': 'Gkysb_8N9os',
  'spongebob': 'kEgjZGEf_NQ',
  'patrick star': 'kEgjZGEf_NQ',
  'looney': 'DuXwFlL8Usk',
  'looney tunes': 'DuXwFlL8Usk',
  'bugs bunny': 'DuXwFlL8Usk',
  'daffy duck': 'DuXwFlL8Usk',
  'avatar': 'M_Las484swM',
  'aang': 'M_Las484swM',
  'ben 10': 'yX0AhxgR0_I',
  'omnitrix': 'yX0AhxgR0_I',
  'gravity falls': 'PNWu3Gct3Ps',
  'dipper': 'PNWu3Gct3Ps',
  'phineas': 'fLWBx37eKBM',
  'teen titans': '1mnSMR3ZMyY',
  'powerpuff': 'O9Nw51J1r8E',
  'dexter': '3bLNQgRn-Wg',
  'scooby': 'C-upU-cb8CY',
  'scooby doo': 'C-upU-cb8CY',
  'gumball': 'pyJZIt1ZCHE',
  'paw patrol': 'hc4hH7JMV_g',
  'pj masks': 'Y7oQVnL2vag',
  'cocomelon': 'e_04ZrNroTo',
  'baby shark': 'XqZsoesa55w',
  'dora': '18iHwoCgM_Q',
  'mickey': 'EorJ8cEzsZo',
  'disney': 'WIPV1iwzrzg',
  'frozen': 'L0MK7qz13bU',
  'lion king': '0MxulhivCvI',
  // Other Popular Cartoons & Defaults
  'mr bean': 'JJg6VqUwavE',
  'roll no 21': '7ma5gpCb4UQ',
  'pink panther': 'E__Qk3h18SY',
  'popeye': 'z7TzPV_CbJc',
  'lion guard': 'yhswAYgk_LE',
  'super simple': 'ZhODBFQ2-bQ',
  // Learning / Science
  'scishow': 'libKVRa01L8',
  'storybots': 'Vb2ZXRh74WU',
  'numberblocks': 'GnVLJowv6eU',
  'octonauts': '81Z3N7-qbZ0',
  'dinosaur': 'i-xn8GTefe4',
  'dinosaurs': 'i-xn8GTefe4',
  't-rex': 'i-xn8GTefe4',
  'solar system': 'F2prtmPEjOc',
  'planets': 'F2prtmPEjOc',
  'space': 'F2prtmPEjOc',
  // Crafts / Games
  'origami': 'F5ADLvIwzas',
  'minecraft': 'x9sCBCXrp8E',
  'draw': 'zvAW8WE0VD4',
  'how to draw': 'zvAW8WE0VD4',
  'mario': 'Ta6x1TGzmhc',
  'sonic': '8IitAAlElX4',
};

// 32 Diverse verified cartoon thumbnails so cards never duplicate
const CARTOON_DIVERSE_FALLBACK_IDS = [
  'Gkysb_8N9os', // Tom and Jerry
  'mNt8QH-fyyY', // Bluey
  'KBP8NNMB8wo', // Masha and the Bear
  'kEgjZGEf_NQ', // SpongeBob SquarePants
  'DuXwFlL8Usk', // Looney Tunes
  'CA9AIy5CIRI', // Chhota Bheem
  'V_6I30jIIC0', // Motu Patlu
  'qajaHK5dcQA', // Doraemon
  'VYcgvukt7jc', // Pokémon
  'VhKtn3G5eM4', // Dragon Ball Super
  'eXX-4Jy31cc', // Crayon Shin-chan
  'WkiWnGwqreM', // Oggy and the Cockroaches
  'RjHq-aimIuk', // Peppa Pig
  'xoLOsbgKRoM', // The Smurfs
  'PNWu3Gct3Ps', // Gravity Falls
  'O9Nw51J1r8E', // The Powerpuff Girls
  'C-upU-cb8CY', // Scooby-Doo
  'pyJZIt1ZCHE', // The Amazing World of Gumball
  'hc4hH7JMV_g', // PAW Patrol
  '18iHwoCgM_Q', // Dora the Explorer
  'yX0AhxgR0_I', // Ben 10
  'EorJ8cEzsZo', // Mickey Mouse
  'L0MK7qz13bU', // Frozen
  'fLWBx37eKBM', // Phineas and Ferb
  'JJg6VqUwavE', // Mr Bean Animated
  '7ma5gpCb4UQ', // Roll No 21
  'E__Qk3h18SY', // Pink Panther
  'F2prtmPEjOc', // StoryBots Solar System
  'i-xn8GTefe4', // Nat Geo Dinosaurs
  'F5ADLvIwzas', // Easy Origami
  'x9sCBCXrp8E', // Minecraft Building
  'zvAW8WE0VD4', // How to Draw Cartoons
];

function getConsistentFallbackId(item) {
  const seed = (item?.id || item?.video_id || item?.title || item?.name || 'kids_show').toString();
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return CARTOON_DIVERSE_FALLBACK_IDS[Math.abs(hash) % CARTOON_DIVERSE_FALLBACK_IDS.length];
}

function getYouTubeThumbnail(item) {
  if (item?.thumbnail && typeof item.thumbnail === 'string' && item.thumbnail.startsWith('http') && !item.thumbnail.includes('unsplash.com')) {
    return item.thumbnail;
  }
  if (item?.video_id) {
    return `https://i.ytimg.com/vi/${item.video_id}/hqdefault.jpg`;
  }
  if (item?.url) {
    const vMatch = item.url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (vMatch && vMatch[1]) {
      return `https://i.ytimg.com/vi/${vMatch[1]}/hqdefault.jpg`;
    }
    const beMatch = item.url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (beMatch && beMatch[1]) {
      return `https://i.ytimg.com/vi/${beMatch[1]}/hqdefault.jpg`;
    }
  }
  const text = `${item?.title || ''}`.toLowerCase();
  for (const [key, id] of Object.entries(KNOWN_CARTOON_YOUTUBE_IDS)) {
    if (text.includes(key)) {
      return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    }
  }
  const fallbackId = getConsistentFallbackId(item);
  return `https://i.ytimg.com/vi/${fallbackId}/hqdefault.jpg`;
}

function extractYouTubeVideoId(item) {
  if (item?.video_id) return item.video_id;
  if (item?.url) {
    const vMatch = item.url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (vMatch && vMatch[1]) return vMatch[1];
    const beMatch = item.url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (beMatch && beMatch[1]) return beMatch[1];
  }
  const text = `${item?.title || ''}`.toLowerCase();
  for (const [key, id] of Object.entries(KNOWN_CARTOON_YOUTUBE_IDS)) {
    if (text.includes(key)) {
      return id;
    }
  }
  return getConsistentFallbackId(item);
}

// Generates direct YouTube Kids URL for any cartoon or show
function getYouTubeKidsUrl(item) {
  if (!item) return 'https://www.youtubekids.com';

  if (item.url && typeof item.url === 'string' && item.url.includes('youtubekids.com')) {
    return item.url;
  }

  let videoId = item.video_id;
  if (!videoId && item.url) {
    const vMatch = item.url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (vMatch && vMatch[1]) {
      videoId = vMatch[1];
    } else {
      const beMatch = item.url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
      if (beMatch && beMatch[1]) {
        videoId = beMatch[1];
      }
    }
  }

  if (!videoId) {
    videoId = extractYouTubeVideoId(item);
  }

  if (videoId) {
    return `https://www.youtubekids.com/watch?v=${videoId}`;
  }

  const q = item.query || item.title || '';
  if (q) {
    return `https://www.youtubekids.com/search?q=${encodeURIComponent(q)}`;
  }

  return 'https://www.youtubekids.com';
}

// 16:9 YouTube Thumbnail component with hover overlay, duration pill, and error fallback
function KidVideoThumbnail({ item }) {
  const [imgError, setImgError] = useState(false);
  const [fallbackThumb, setFallbackThumb] = useState(null);

  useEffect(() => {
    setImgError(false);
    setFallbackThumb(null);
  }, [item?.id, item?.thumbnail, item?.video_id, item?.title]);

  const thumbUrl = fallbackThumb || getYouTubeThumbnail(item);

  const handleImageError = () => {
    if (!fallbackThumb) {
      const text = `${item?.title || ''}`.toLowerCase();
      for (const [key, id] of Object.entries(KNOWN_CARTOON_YOUTUBE_IDS)) {
        if (text.includes(key)) {
          const candidate = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
          if (candidate !== thumbUrl) {
            setFallbackThumb(candidate);
            return;
          }
        }
      }
      const altFallback = `https://i.ytimg.com/vi/${getConsistentFallbackId(item)}/hqdefault.jpg`;
      if (thumbUrl !== altFallback) {
        setFallbackThumb(altFallback);
        return;
      }
    }
    setImgError(true);
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-slate-900 group/thumb">
      {thumbUrl && !imgError ? (
        <img
          src={thumbUrl}
          alt={item?.title || 'Kid video thumbnail'}
          loading="lazy"
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className={`w-full h-full bg-gradient-to-tr ${item?.thumbnail_gradient || 'from-amber-400 via-orange-500 to-rose-500'} flex items-center justify-center p-4 text-center`}>
          <span className="text-5xl filter drop-shadow-md">{item?.country_flag || item?.icon || '📺'}</span>
        </div>
      )}

      {/* Top Left: Age Rating Badge */}
      <div className="absolute top-2 left-2 z-10 pointer-events-none">
        <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-bold shadow-sm">
          {item.age_rating || 'All Ages (G)'}
        </span>
      </div>

      {/* Top Right: Rating Badge */}
      <div className="absolute top-2 right-2 z-10 pointer-events-none flex items-center gap-1">
        <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-amber-300 text-[10px] font-mono font-bold shadow-sm flex items-center gap-0.5">
          <span>⭐</span>
          <span>{item.rating || '4.9'}</span>
        </span>
      </div>

      {/* Center YouTube Kids Play Button Overlay on Hover */}
      <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1.5 z-10 pointer-events-none">
        <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-600/40 transform scale-90 group-hover:scale-100 transition-transform duration-200">
          <Play className="w-6 h-6 fill-current ml-0.5" />
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-bold text-[10px] shadow tracking-tight">
          YouTube Kids ↗
        </span>
      </div>

      {/* Bottom Right: Duration Pill (Exact YouTube style) */}
      <div className="absolute bottom-2 right-2 z-10 pointer-events-none">
        <span className="px-1.5 py-0.5 rounded bg-black/85 backdrop-blur-sm text-white text-[11px] font-mono font-medium tracking-tight shadow">
          {item.duration || '15:00'}
        </span>
      </div>

      {/* Bottom Left: Views Badge */}
      {item.views && (
        <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
          <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white/90 text-[10px] font-medium shadow">
            {item.views}
          </span>
        </div>
      )}
    </div>
  );
}

export default function KidsPortal({
  isDark,
  onOpenParentalGate
}) {
  const [showEntranceAnimation, setShowEntranceAnimation] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState('');
  const [safeAlternatives, setSafeAlternatives] = useState([]);
  const [latency, setLatency] = useState(0);

  // Screen-Time Timer & Bedtime Lock State
  const [timerMinutes, setTimerMinutes] = useState(() => {
    try {
      return parseInt(localStorage.getItem('vellox_kids_timer_minutes') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [timerRemainingSeconds, setTimerRemainingSeconds] = useState(() => {
    try {
      const targetTime = parseInt(localStorage.getItem('vellox_kids_timer_target') || '0', 10);
      if (targetTime > 0) {
        const remaining = Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
        return remaining;
      }
      return 0;
    } catch {
      return 0;
    }
  });
  const [isBedtimeLocked, setIsBedtimeLocked] = useState(() => {
    try {
      const targetTime = parseInt(localStorage.getItem('vellox_kids_timer_target') || '0', 10);
      return targetTime > 0 && Date.now() >= targetTime;
    } catch {
      return false;
    }
  });
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [timerWarnToast, setTimerWarnToast] = useState(null);

  // Screen Time Countdown Interval
  useEffect(() => {
    if (timerRemainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setTimerRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsBedtimeLocked(true);
          try {
            localStorage.setItem('vellox_kids_timer_locked', 'true');
          } catch {}
          return 0;
        }
        if (prev === 300) {
          setTimerWarnToast('5 minutes left of screen time today! ⏰');
          setTimeout(() => setTimerWarnToast(null), 4500);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRemainingSeconds]);

  const handleSetTimer = (minutes) => {
    setTimerMinutes(minutes);
    if (minutes <= 0) {
      setTimerRemainingSeconds(0);
      setIsBedtimeLocked(false);
      try {
        localStorage.removeItem('vellox_kids_timer_target');
        localStorage.removeItem('vellox_kids_timer_minutes');
        localStorage.removeItem('vellox_kids_timer_locked');
      } catch {}
    } else {
      const seconds = minutes * 60;
      setTimerRemainingSeconds(seconds);
      setIsBedtimeLocked(false);
      try {
        const target = Date.now() + seconds * 1000;
        localStorage.setItem('vellox_kids_timer_target', target.toString());
        localStorage.setItem('vellox_kids_timer_minutes', minutes.toString());
        localStorage.removeItem('vellox_kids_timer_locked');
      } catch {}
    }
    setShowTimerModal(false);
  };

  const handleAddMoreTime = (extraMinutes = 15) => {
    const extraSeconds = extraMinutes * 60;
    setTimerRemainingSeconds(extraSeconds);
    setTimerMinutes(extraMinutes);
    setIsBedtimeLocked(false);
    try {
      const target = Date.now() + extraSeconds * 1000;
      localStorage.setItem('vellox_kids_timer_target', target.toString());
      localStorage.setItem('vellox_kids_timer_minutes', extraMinutes.toString());
      localStorage.removeItem('vellox_kids_timer_locked');
    } catch {}
  };

  const formatTimerDisplay = (seconds) => {
    if (seconds <= 0) return 'Timer';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m > 0) return `${m}m left`;
    return `${s}s left`;
  };

  // Infinite Scroll Pagination State (Search content only)
  const [searchPage, setSearchPage] = useState(1);
  const [hasMoreSearch, setHasMoreSearch] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollSentinelRef = useRef(null);

  // Discovery Feed State (loaded when not searching)
  const [feedData, setFeedData] = useState(null);
  const [isFeedLoading, setIsFeedLoading] = useState(true);
  const [feedPage, setFeedPage] = useState(1);
  const [hasMoreFeed, setHasMoreFeed] = useState(true);
  const [isLoadingMoreFeed, setIsLoadingMoreFeed] = useState(false);
  const [extraFeedSections, setExtraFeedSections] = useState([]);
  const feedSentinelRef = useRef(null);

  // Autocomplete Suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestLatency, setSuggestLatency] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Selected Video Player Modal
  const [playingVideo, setPlayingVideo] = useState(null);
  const [redirectToast, setRedirectToast] = useState(null);

  // Directly redirect video to YouTube Kids in a new secure window
  const handleWatchOnYouTubeKids = (item, e) => {
    if (e) {
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
    }
    const kidsUrl = getYouTubeKidsUrl(item);
    const title = item?.title || 'Cartoon';
    const displayTitle = title.length > 28 ? title.slice(0, 26) + '…' : title;
    setRedirectToast(`Opening "${displayTitle}" on YouTube Kids 🎈`);
    setTimeout(() => {
      setRedirectToast(null);
    }, 3500);
    window.open(kidsUrl, '_blank', 'noopener,noreferrer');
  };

  const searchInputRef = useRef(null);
  const debounceRef = useRef(null);

  // Fetch kids discovery feed with dynamic freshness timestamp
  const fetchKidsFeed = useCallback(async (isRefresh = false) => {
    setIsFeedLoading(true);
    try {
      const res = await fetch(`/api/kids/feed?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setFeedData(data);
        if (isRefresh) {
          setExtraFeedSections([]);
          setFeedPage(1);
          setHasMoreFeed(true);
        }
      }
    } catch (err) {
      console.error('Failed to load kids feed:', err);
    } finally {
      setIsFeedLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKidsFeed();
  }, [fetchKidsFeed]);

  // Autocomplete debounced lookup from Kids Trie
  const fetchKidsSuggestions = useCallback(async (prefix) => {
    if (!prefix || !prefix.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    try {
      const res = await fetch(`/api/kids/suggest?q=${encodeURIComponent(prefix.trim())}`);
      if (res.ok) {
        const data = await res.json();
        const list = data.suggestions || [];
        setSuggestions(list);
        setSuggestLatency(data.latency_ms || 0);
        setShowDropdown(list.length > 0);
      }
    } catch (err) {
      console.error('Kids suggest error:', err);
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setSelectedIndex(-1);

    if (!val || !val.trim()) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchKidsSuggestions(val);
    }, 180);
  };

  // Core kids search function — calls dedicated /api/kids/search endpoint
  // Defined BEFORE handleKeyDown / handleSelectSuggestion so TDZ is not an issue
  const executeKidsSearchRef = useRef(null);
  const executeKidsSearch = useCallback(async (queryText, categoryOverride) => {
    const q = (queryText || '').trim();
    if (!q) return;

    // Close dropdown immediately
    setSuggestions([]);
    setShowDropdown(false);
    setSelectedIndex(-1);

    const cat = categoryOverride || activeCategory;
    setIsSearching(true);
    setIsBlocked(false);
    setBlockedMessage('');
    setSafeAlternatives([]);
    setSearchResults([]);
    setSearchQuery(q);
    setInputValue(q);
    setSearchPage(1);
    setHasMoreSearch(true);

    const t0 = performance.now();
    try {
      const res = await fetch(
        `/api/kids/search?q=${encodeURIComponent(q)}&category=${encodeURIComponent(cat)}&page=1&page_size=12`
      );
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      setLatency(Math.round(performance.now() - t0));

      if (data.status === 'blocked' || !data.is_kids_safe) {
        setIsBlocked(true);
        setBlockedMessage(data.message || 'Blocked by Parental Control.');
        setSafeAlternatives(data.safe_alternatives || []);
        setSearchResults([]);
      } else {
        const results = data.results || [];
        setSearchResults(results);
        setHasMoreSearch(data.has_more !== false && results.length > 0);
      }
    } catch (err) {
      console.error('Kids search error:', err);
      setIsBlocked(true);
      setBlockedMessage('Could not connect to the search server. Please ensure the backend is running.');
      setSafeAlternatives(['Pokemon ⚡', 'Doraemon 🇯🇵', 'Tom and Jerry 🇺🇸']);
    } finally {
      setIsSearching(false);
    }
  }, [activeCategory]);

  // Keep a ref so handleKeyDown (defined below) can always access the latest version
  executeKidsSearchRef.current = executeKidsSearch;

  const handleKeyDown = (e) => {
    if (showDropdown && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = selectedIndex < suggestions.length - 1 ? selectedIndex + 1 : 0;
        setSelectedIndex(next);
        setInputValue(suggestions[next].phrase);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = selectedIndex > 0 ? selectedIndex - 1 : suggestions.length - 1;
        setSelectedIndex(prev);
        setInputValue(suggestions[prev].phrase);
        return;
      }
      if (e.key === 'Escape') {
        setShowDropdown(false);
        setSelectedIndex(-1);
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          executeKidsSearchRef.current(suggestions[selectedIndex].phrase);
        } else {
          executeKidsSearchRef.current(inputValue);
        }
        return;
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeKidsSearchRef.current(inputValue);
    }
  };

  const handleSelectSuggestion = (phrase) => {
    setInputValue(phrase);
    executeKidsSearchRef.current(phrase);
  };

  const handleResetKidsHome = () => {
    setSearchQuery('');
    setInputValue('');
    setSearchResults([]);
    setIsBlocked(false);
    setBlockedMessage('');
    setSafeAlternatives([]);
    setActiveCategory('all');
    setSearchPage(1);
    setHasMoreSearch(true);
    setIsLoadingMore(false);
    setSuggestions([]);
    setShowDropdown(false);
    setFeedPage(1);
    setHasMoreFeed(true);
    setIsLoadingMoreFeed(false);
    setExtraFeedSections([]);
    fetchKidsFeed(true);
  };

  // Load-more function for infinite scroll (subsequent pages)
  const loadMoreKidsResults = useCallback(async () => {
    if (isLoadingMore || !hasMoreSearch || !searchQuery) return;
    const nextPage = searchPage + 1;
    setIsLoadingMore(true);
    try {
      const res = await fetch(
        `/api/kids/search?q=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(activeCategory)}&page=${nextPage}&page_size=12`
      );
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      if (data.status !== 'blocked' && data.is_kids_safe && data.results?.length > 0) {
        setSearchResults(prev => {
          const existingIds = new Set(prev.map(r => r.id));
          const fresh = data.results.filter(r => !existingIds.has(r.id));
          return [...prev, ...fresh];
        });
        setSearchPage(nextPage);
        setHasMoreSearch(data.has_more !== false && data.results.length > 0);
      } else {
        setHasMoreSearch(false);
      }
    } catch (err) {
      console.error('Load more error:', err);
      setHasMoreSearch(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMoreSearch, searchQuery, searchPage, activeCategory]);

  // Infinite scroll observer for Search Results
  useEffect(() => {
    if (!scrollSentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreSearch && !isLoadingMore && searchQuery) {
          loadMoreKidsResults();
        }
      },
      { threshold: 0.1, rootMargin: '800px' }
    );
    observer.observe(scrollSentinelRef.current);
    return () => observer.disconnect();
  }, [hasMoreSearch, isLoadingMore, searchQuery, loadMoreKidsResults]);

  // Load-more function for Discovery Feed (when not searching)
  const loadMoreKidsFeed = useCallback(async () => {
    if (isLoadingMoreFeed || !hasMoreFeed || searchQuery) return;
    const nextPage = feedPage + 1;
    setIsLoadingMoreFeed(true);
    try {
      const res = await fetch(`/api/kids/feed?page=${nextPage}&category=${encodeURIComponent(activeCategory)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.sections && data.sections.length > 0) {
          setExtraFeedSections(prev => {
            const existingIds = new Set(prev.map(s => s.id));
            const fresh = data.sections.filter(s => !existingIds.has(s.id));
            return [...prev, ...fresh];
          });
          setFeedPage(nextPage);
          setHasMoreFeed(data.has_more !== false && nextPage < 100);
        } else {
          setHasMoreFeed(false);
        }
      } else {
        setHasMoreFeed(false);
      }
    } catch (err) {
      console.error('Failed to load more kids feed:', err);
      setHasMoreFeed(false);
    } finally {
      setIsLoadingMoreFeed(false);
    }
  }, [isLoadingMoreFeed, hasMoreFeed, searchQuery, feedPage, activeCategory]);

  // Infinite scroll observer for Discovery Feed
  useEffect(() => {
    if (!feedSentinelRef.current || searchQuery) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreFeed && !isLoadingMoreFeed && !searchQuery) {
          loadMoreKidsFeed();
        }
      },
      { threshold: 0.1, rootMargin: '800px' }
    );
    observer.observe(feedSentinelRef.current);
    return () => observer.disconnect();
  }, [hasMoreFeed, isLoadingMoreFeed, searchQuery, loadMoreKidsFeed]);

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    if (searchQuery) {
      executeKidsSearch(searchQuery, catId);
    } else {
      setExtraFeedSections([]);
      setFeedPage(1);
      setHasMoreFeed(true);
    }
  };

  // Preset quick tags
  const quickPills = feedData?.quick_pills || [
    'Doraemon (Japan) 🇯🇵',
    'Masha & Bear (Russia) 🇷🇺',
    'Tom & Jerry (USA) 🇺🇸',
    'Chhota Bheem (India) 🇮🇳',
    'Bluey (Australia) 🇦🇺',
    'Oggy & Cockroaches (France) 🇫🇷',
    'Pororo (Korea) 🇰🇷',
    'Pokemon ⚡',
    'Shaun Sheep (UK) 🇬🇧',
    'Crayon Shin-chan 🎈',
    'The Smurfs (Belgium) 🇧🇪',
    'Pocoyo (Spain) 🇪🇸'
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${isDark ? 'bg-[#0f1117] text-[#f1f3f5]' : 'bg-[#fdf8f4] text-slate-900'}`}>
      
      {/* Outstanding 1-Second Kids Mode Entrance Animation on Switch */}
      {showEntranceAnimation && (
        <KidsModeEntranceSplash onComplete={() => setShowEntranceAnimation(false)} />
      )}

      {/* 1. PLAYFUL KIDS TOP BAR WITH PARENTAL CONTROL */}
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-amber-200/60 dark:border-amber-900/30 bg-white/90 dark:bg-[#161822]/90 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* velloX Kids Brand Logo with Bouncing Stars */}
          <div 
            className="flex items-center gap-2 cursor-pointer select-none group"
            onClick={handleResetKidsHome}
            title="Kids Wonderland Home"
          >
            <div className="flex items-center text-2xl font-black tracking-tight font-sans">
              <span className="text-blue-500 animate-bounce">v</span>
              <span className="text-red-500 animate-bounce delay-75">e</span>
              <span className="text-amber-500 animate-bounce delay-100">l</span>
              <span className="text-blue-600 animate-bounce delay-150">l</span>
              <span className="text-emerald-500 animate-bounce delay-200">o</span>
              <span className="text-orange-500 text-3xl font-extrabold animate-bounce delay-300">X</span>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-rose-400 text-white font-extrabold text-xs shadow-sm shadow-orange-500/20">
              <span>Kids</span>
              <span className="text-sm">🎈</span>
            </div>
          </div>

          {/* Adorable Kids Mascot Badge */}
          <div className="flex items-center px-2 py-1 rounded-2xl bg-gradient-to-r from-pink-50/80 via-purple-50/60 to-amber-50/80 dark:from-purple-950/40 dark:via-indigo-950/30 dark:to-pink-950/40 border border-pink-200/70 dark:border-purple-800/50 shadow-sm backdrop-blur-md transition-all hover:shadow-md group/kidslogo select-none">
            {/* The Kids Mascot Sticker */}
            <img 
              src="/kids-logo-transparent.png" 
              alt="Kids Mascot Wonderland" 
              className="h-11 sm:h-12 w-auto object-contain filter drop-shadow-sm transition-transform duration-300 group-hover/kidslogo:scale-105 animate-kids-float"
            />
          </div>

          {/* Parental Exit Switch & Screen Time Timer */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Screen Time Timer Button */}
            <button
              onClick={() => setShowTimerModal(true)}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm ${
                timerRemainingSeconds > 0
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-700/60 animate-pulse'
                  : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 hover:scale-105'
              }`}
              title="Kids Screen-Time Timer & Bedtime Lock"
            >
              <Timer className="w-3.5 h-3.5 text-amber-500" />
              <span>{formatTimerDisplay(timerRemainingSeconds)}</span>
            </button>

            <button
              onClick={onOpenParentalGate}
              type="button"
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
              title="Parent Gate: Enter password to unlock standard search"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Parent Gate</span>
              <span className="hidden md:inline text-[10px] opacity-80">(Exit Kids)</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN KIDS CONTENT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col relative z-10">

        {/* Big Playful Search Bar with Trie Autocomplete */}
        <div className="relative max-w-3xl w-full mx-auto mb-6">
          <div className="relative rounded-3xl bg-white dark:bg-[#1a1d28] border-2 border-amber-300 dark:border-amber-500/40 shadow-xl shadow-amber-500/10 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-400/20 transition-all overflow-visible">
            <div className="flex items-center px-4 py-2.5 sm:py-3 gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Search className="w-5 h-5" />
              </div>

              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Search cartoons, anime (Pokemon, Doraemon...), games, or facts! 🎈"
                className="flex-1 bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />

              {inputValue && (
                <button
                  type="button"
                  onClick={() => { setInputValue(''); setSuggestions([]); setShowDropdown(false); if (searchInputRef.current) searchInputRef.current.focus(); }}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                disabled={isSearching}
                onClick={() => executeKidsSearch(inputValue)}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-300 hover:to-rose-400 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-orange-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-70 flex items-center gap-1.5"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>{isSearching ? 'Finding...' : 'Go! 🚀'}</span>
              </button>
            </div>

            {/* Kids Trie Autocomplete Dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a1d28] rounded-2xl border-2 border-amber-300 dark:border-amber-500/40 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-3 py-1.5 text-[11px] font-mono font-semibold text-amber-600 dark:text-amber-400 flex items-center justify-between border-b border-amber-100 dark:border-slate-800">
                  <span>🎈 Kid-Safe Prefix Trie Matches</span>
                  <span>{suggestLatency} ms</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {suggestions.map((item, idx) => (
                    <button
                      key={item.phrase}
                      type="button"
                      onClick={() => handleSelectSuggestion(item.phrase)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-between transition-colors ${
                        idx === selectedIndex
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-amber-500">✨</span>
                        <span>{item.phrase}</span>
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {item.category || 'kid-safe'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Pill Buttons + Shuffle Wonder */}
          <div className="flex items-center gap-1.5 flex-wrap mt-3 justify-center">
            <button
              onClick={() => fetchKidsFeed(true)}
              type="button"
              className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-300/80 dark:border-amber-700/80 shadow-sm hover:scale-105 active:scale-95 cursor-pointer mr-1"
              title="Shuffle dashboard to discover different popular cartoons and animes!"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              <span>Shuffle 🎲</span>
            </button>
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 mr-1">
              <Sparkles className="w-3 h-3" />
              Try searching:
            </span>
            {quickPills.slice(0, 6).map((pill) => (
              <button
                key={pill}
                type="button"
                onClick={() => {
                  const cleaned = pill.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
                  executeKidsSearch(cleaned);
                }}
                className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#1a1d28] border border-amber-200 dark:border-amber-900/60 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:border-amber-400 transition-all shadow-sm"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>

        {/* 3. STRICT GUARDRAIL BLOCK BANNER (WHEN KID SEARCHES NON-KID TOPIC) */}
        {isBlocked && (
          <div className="max-w-2xl mx-auto w-full mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 dark:from-[#221724] dark:via-[#1e1929] dark:to-[#171a2b] border-2 border-rose-300 dark:border-rose-800/80 shadow-2xl text-center relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-rose-500 to-amber-400 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 text-3xl animate-bounce">
              🛡️
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
              Oops! That's Outside Kids Space! 🎈
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto mb-4 leading-relaxed">
              {blockedMessage}
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-mono font-semibold mb-6">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Strict Rule: Non-Kid Queries Do Not Respond with Results</span>
            </div>

            {/* Kid-Safe Alternatives */}
            <div className="bg-white/80 dark:bg-[#161822]/80 backdrop-blur-md rounded-2xl p-4 border border-rose-200 dark:border-rose-900/60 max-w-lg mx-auto mb-5">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                🌟 Pick one of these fun kid adventures instead:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {safeAlternatives.map((alt) => (
                  <button
                    key={alt}
                    type="button"
                    onClick={() => {
                      const cleanAlt = alt.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
                      executeKidsSearch(cleanAlt);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-white text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
                  >
                    {alt}
                  </button>
                ))}
              </div>
            </div>

            {/* Parent Exit Action */}
            <button
              onClick={onOpenParentalGate}
              type="button"
              className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline underline-offset-4"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Are you a parent? Click here to unlock standard adult search with PIN</span>
            </button>
          </div>
        )}

        {/* 4. KID SEARCH RESULTS GRID */}
        {!isBlocked && searchResults.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Results for "{searchQuery}"</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-mono font-normal">
                    {searchResults.length} Safe Shows
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Internet
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Verified live from the internet • Parental control active • {latency} ms
                </p>
              </div>

              <button
                onClick={handleResetKidsHome}
                type="button"
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear to Home</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((item, idx) => (
                <div
                  key={`${item.id || item.video_id || item.url}-${idx}`}
                  onClick={(e) => handleWatchOnYouTubeKids(item, e)}
                  className="group rounded-3xl bg-white dark:bg-[#1a1d28] border-2 border-slate-100 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col cursor-pointer hover:-translate-y-1"
                >
                  {/* YouTube 16:9 Thumbnail with Duration & Badges */}
                  <KidVideoThumbnail item={item} />

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-bold mb-1">
                        <span>{item.country_flag || item.icon || '📺'}</span>
                        <span className="truncate">{item.channel}</span>
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        {item.region && (
                          <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
                            {item.region}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-amber-500 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                        {item.snippet}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-medium">
                        {item.badge}
                      </span>
                      <span className="text-red-600 dark:text-red-400 font-bold group-hover:scale-105 transition-transform flex items-center gap-1">
                        <span>Watch on YouTube Kids</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Infinite Scroll Sentinel and Load More indicator (SEARCH CONTENT ONLY) */}
            <div ref={scrollSentinelRef} className="w-full py-6 flex flex-col items-center justify-center">
              {isLoadingMore && (
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-700/60 shadow-md">
                  <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                  <div className="text-left">
                    <p className="text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-200">
                      Finding more "{searchQuery}" cartoon videos... 🎈
                    </p>
                    <p className="text-[11px] text-amber-600/80 dark:text-amber-400/70">
                      Fetching live kid-safe YouTube streams
                    </p>
                  </div>
                </div>
              )}

              {!hasMoreSearch && searchResults.length > 0 && (
                <div className="mt-2 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/60 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                    <span>🎉</span>
                    <span>You've seen all the top "{searchQuery}" videos! Try another fun search!</span>
                    <span>🎈</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. KIDS HOME VIEW: CURATED SECTIONS (CARTOONS, ANIME, SCIENCE, CRAFTS) */}
        {!searchQuery && !isBlocked && isFeedLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-500 flex items-center justify-center animate-spin">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono animate-pulse">
              Loading Kids Space & Safe Cartoon Feed...
            </p>
          </div>
        )}

        {!searchQuery && !isBlocked && !isFeedLoading && feedData && (
          <div className="space-y-10 mb-12">
            
            {/* Featured Hero Banner */}
            {feedData.featured_spotlight && (
              <div 
                onClick={() => executeKidsSearch(feedData.featured_spotlight.query)}
                className={`relative rounded-3xl bg-gradient-to-r ${feedData.featured_spotlight.gradient || 'from-amber-400 via-orange-500 to-rose-500'} p-6 sm:p-10 text-white shadow-xl shadow-orange-500/20 cursor-pointer overflow-hidden group hover:scale-[1.01] transition-transform`}
              >
                <div className="absolute -right-8 -bottom-8 text-9xl opacity-20 group-hover:scale-110 transition-transform select-none">
                  {feedData.featured_spotlight.icon || '⚡'}
                </div>

                <div className="max-w-xl relative z-10">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/25 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-3">
                    {feedData.featured_spotlight.banner_badge}
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
                    {feedData.featured_spotlight.title}
                  </h2>
                  <p className="text-sm sm:text-base text-white/90 mb-4 leading-relaxed font-medium">
                    {feedData.featured_spotlight.subtitle}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWatchOnYouTubeKids(feedData.featured_spotlight, e);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-red-600 font-black text-sm shadow-lg group-hover:bg-amber-50 transition-colors"
                  >
                    <Play className="w-4 h-4 fill-current text-red-600" />
                    <span>Watch on YouTube Kids 🎈</span>
                  </button>
                </div>
              </div>
            )}

            {/* Sections: Cartoons, Anime, Learning, Crafts & Infinite Loaded Sections */}
            {[...(feedData.sections || []), ...extraFeedSections].map((section) => (
              <div key={section.id}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                      {section.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {section.subtitle}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={(e) => handleWatchOnYouTubeKids(item, e)}
                      className="group rounded-3xl bg-white dark:bg-[#1a1d28] border-2 border-slate-100 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col cursor-pointer hover:-translate-y-1"
                    >
                      {/* YouTube 16:9 Thumbnail Header */}
                      <KidVideoThumbnail item={item} />

                      {/* Content */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-bold mb-1">
                            <span>{item.country_flag || item.icon || '📺'}</span>
                            <span className="truncate">{item.channel}</span>
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                            {item.region && (
                              <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
                                {item.region}
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 mb-1.5 group-hover:text-amber-500 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                            {item.snippet}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-medium truncate">
                              {item.badge}
                            </span>
                            {item.views && (
                              <span className="hidden sm:inline-block text-[10px] font-mono text-slate-400 shrink-0">
                                • {item.views}
                              </span>
                            )}
                          </div>
                          <span className="text-red-600 dark:text-red-400 font-bold group-hover:scale-105 transition-transform flex items-center gap-1 shrink-0 ml-1">
                            <span>Watch on YouTube Kids</span>
                            <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Infinite Scroll Sentinel for Kids Discovery Feed */}
            <div ref={feedSentinelRef} className="w-full py-8 flex flex-col items-center justify-center">
              {isLoadingMoreFeed && (
                <div className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300/80 dark:border-amber-700/60 shadow-lg animate-pulse">
                  <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                  <div className="text-left">
                    <p className="text-xs sm:text-sm font-black text-amber-900 dark:text-amber-200">
                      Unlocking more awesome cartoons & adventures... 🎈
                    </p>
                    <p className="text-[11px] text-amber-700/80 dark:text-amber-400/70">
                      Fetching global cartoons, anime & science episodes
                    </p>
                  </div>
                </div>
              )}

              {!hasMoreFeed && extraFeedSections.length > 0 && (
                <div className="mt-2 text-center">
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-100/70 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 text-xs font-bold shadow-sm">
                    <span>🌟</span>
                    <span>You've explored all the world cartoons! Scroll up to watch anytime!</span>
                    <span>🚀</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* 6. PLAYFUL KID VIDEO THEATER MODAL */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-[#1a1d28] rounded-3xl border-2 border-amber-400 dark:border-amber-500 shadow-2xl overflow-hidden relative">
            
            {/* Top Close */}
            <button
              onClick={() => setPlayingVideo(null)}
              type="button"
              className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-colors shadow-lg"
              title="Close Player"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Video Stage: Embedded Kid-Safe YouTube Player or 16:9 Thumbnail */}
            <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
              {extractYouTubeVideoId(playingVideo) ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${extractYouTubeVideoId(playingVideo)}?autoplay=1&rel=0&modestbranding=1`}
                  title={playingVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="relative w-full h-full">
                  <KidVideoThumbnail item={playingVideo} />
                </div>
              )}
            </div>

            {/* Video Meta & Actions */}
            <div className="p-6">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{playingVideo.country_flag || playingVideo.icon || '📺'}</span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      {playingVideo.channel}
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{playingVideo.views} • {playingVideo.duration}</span>
                      {playingVideo.region && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-mono text-[10px]">
                          {playingVideo.region}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold font-mono shrink-0">
                  {playingVideo.age_rating || 'TV-Y7'}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {playingVideo.snippet}
              </p>

              <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setPlayingVideo(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Close Player
                </button>

                <a
                  href={getYouTubeKidsUrl(playingVideo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all hover:scale-105"
                >
                  <span>Open on YouTube Kids</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. FLOATING REDIRECT TO YOUTUBE KIDS TOAST */}
      {redirectToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold border-2 border-red-400">
            <span className="text-base animate-bounce">🎈</span>
            <span>{redirectToast}</span>
            <ExternalLink className="w-4 h-4 ml-0.5 opacity-90" />
          </div>
        </div>
      )}

      {/* 5-Minute Warning Toast */}
      {timerWarnToast && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="px-5 py-3 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-2 border-2 border-amber-300">
            <Timer className="w-4 h-4 animate-spin" />
            <span>{timerWarnToast}</span>
          </div>
        </div>
      )}

      {/* Screen Time Timer Settings Modal */}
      {showTimerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white dark:bg-[#1a1d28] rounded-3xl p-6 max-w-sm w-full shadow-2xl border-2 border-amber-300 dark:border-amber-700/60 relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                  <Timer className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">Kids Screen Time Limit</h3>
              </div>
              <button
                onClick={() => setShowTimerModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Set how long your child can explore cartoons and videos. When the timer runs out, the Bedtime Lock screen activates.
            </p>

            {/* Presets */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { min: 15, label: '15 Minutes', emoji: '⏱️' },
                { min: 30, label: '30 Minutes', emoji: '⏳' },
                { min: 45, label: '45 Minutes', emoji: '⏰' },
                { min: 60, label: '60 Minutes', emoji: '⌛' }
              ].map(({ min, label, emoji }) => (
                <button
                  key={min}
                  type="button"
                  onClick={() => handleSetTimer(min)}
                  className={`py-3 px-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                    timerMinutes === min && timerRemainingSeconds > 0
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20'
                      : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-lg">{emoji}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Disable timer option */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleSetTimer(0)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Turn Timer Off
              </button>
              <button
                type="button"
                onClick={() => setShowTimerModal(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Bedtime Lock Screen */}
      {isBedtimeLocked && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center select-none bg-gradient-to-b from-[#0b0f19] via-[#111827] to-[#1e1b4b] text-white animate-in fade-in duration-300">
          {/* Animated Sleeping Moon */}
          <div className="relative mb-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-amber-200/20 flex items-center justify-center shadow-[0_0_50px_rgba(251,191,36,0.3)] animate-pulse">
              <span className="text-6xl sm:text-7xl filter drop-shadow-md">🌙</span>
            </div>
            <span className="absolute -top-1 -right-1 text-2xl animate-bounce">✨</span>
            <span className="absolute bottom-2 -left-2 text-xl animate-pulse">⭐</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3 text-amber-300 drop-shadow-sm font-sans">
            Time for Bed & Rest! 💤
          </h2>

          <p className="max-w-md text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
            Great job playing and learning today! Your screen time limit has ended. It is time to rest your eyes and relax. See you tomorrow! 🎈
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={onOpenParentalGate}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Parent Unlock (Enter PIN)</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddMoreTime(15)}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 text-xs font-semibold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              <span>Add +15 Minutes Playtime</span>
            </button>
          </div>
        </div>
      )}

      {/* 8. PLAYFUL FOOTER */}
      <footer className="w-full border-t border-amber-200/60 dark:border-amber-900/30 bg-white/70 dark:bg-[#161822]/70 backdrop-blur-md py-4 px-6 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-4 mt-auto">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            Strict Parental Guardrail: Cartoons, Anime & Fun Only
          </span>
        </div>
        <div className="font-mono text-[11px]">
          velloX Kids Space • Protected by Parental PIN • O(L) Kids Prefix Trie
        </div>
      </footer>
    </div>
  );
}
