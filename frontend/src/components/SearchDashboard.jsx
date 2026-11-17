import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2, Mic, Camera, Upload, Image as ImageIcon, Globe, FileText, Tag, Copy, Check } from 'lucide-react';
import Tesseract from 'tesseract.js';
import SuggestionDropdown from './SuggestionDropdown';

const SUPPORTED_VOICE_LANGUAGES = [
  { code: 'auto', label: 'Auto Detect', name: 'Auto', flag: '🌐' },
  { code: 'en-US', label: 'English (US)', name: 'English', flag: '🇺🇸' },
  { code: 'en-GB', label: 'English (UK)', name: 'UK English', flag: '🇬🇧' },
  { code: 'es-ES', label: 'Español (Spanish)', name: 'Español', flag: '🇪🇸' },
  { code: 'hi-IN', label: 'हिन्दी (Hindi)', name: 'Hindi', flag: '🇮🇳' },
  { code: 'fr-FR', label: 'Français (French)', name: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', label: 'Deutsch (German)', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja-JP', label: '日本語 (Japanese)', name: 'Japanese', flag: '🇯🇵' },
  { code: 'te-IN', label: 'తెలుగు (Telugu)', name: 'Telugu', flag: '🇮🇳' },
  { code: 'ta-IN', label: 'தமிழ் (Tamil)', name: 'Tamil', flag: '🇮🇳' },
];

export default function SearchDashboard({
  onSearch,
  activePlatform = 'all',
  onPlatformChange,
  isSearching = false,
  activeContext = null,
  contextRecommendations = [],
  isOnline = true,
  onLaunchOfflineGame = null
}) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [suggestLatency, setSuggestLatency] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceError, setVoiceError] = useState(null);
  const [selectedVoiceLang, setSelectedVoiceLang] = useState(() => {
    try {
      return localStorage.getItem('vellox_voice_lang') || 'auto';
    } catch {
      return 'auto';
    }
  });
  const [waveformBars, setWaveformBars] = useState([8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8]);
  const [showLensModal, setShowLensModal] = useState(false);
  const [lensImage, setLensImage] = useState(null);
  const [isDraggingLens, setIsDraggingLens] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrText, setOcrText] = useState('');
  const [ocrTags, setOcrTags] = useState([]);
  const [isCopiedOcr, setIsCopiedOcr] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isNear, setIsNear] = useState(false);
  const [magneticTransform, setMagneticTransform] = useState('');
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('vellox_recent_searches')) || [];
    } catch {
      return [];
    }
  });

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const recognitionRef = useRef(null);
  const lensFileInputRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Search History Helper Methods
  const saveToRecentSearches = useCallback((query) => {
    if (!query || !query.trim()) return;
    const q = query.trim();
    try {
      const prev = JSON.parse(localStorage.getItem('vellox_recent_searches')) || [];
      const updated = [q, ...prev.filter(item => item.toLowerCase() !== q.toLowerCase())].slice(0, 8);
      localStorage.setItem('vellox_recent_searches', JSON.stringify(updated));
      setRecentSearches(updated);
    } catch {}
  }, []);

  const handleDeleteHistory = (phrase) => {
    try {
      const prev = JSON.parse(localStorage.getItem('vellox_recent_searches')) || [];
      const updated = prev.filter(item => item.toLowerCase() !== phrase.toLowerCase());
      localStorage.setItem('vellox_recent_searches', JSON.stringify(updated));
      setRecentSearches(updated);
    } catch {}
  };

  const handleClearAllHistory = () => {
    try {
      localStorage.removeItem('vellox_recent_searches');
      setRecentSearches([]);
    } catch {}
  };

  // Instant Zero-Click Calculation / Converter Smart Answer Helper
  const evaluateInstantAnswer = (q) => {
    if (!q || typeof q !== 'string') return null;
    const trimmed = q.trim();
    if (trimmed.length < 2) return null;

    // 1. Percentage calculations: "20% of 150" or "15% off 200"
    const pctMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*%\s*(?:of|off)\s*(\d+(?:\.\d+)?)$/i);
    if (pctMatch) {
      const pct = parseFloat(pctMatch[1]);
      const val = parseFloat(pctMatch[2]);
      const isOff = /off/i.test(trimmed);
      const calculated = (pct / 100) * val;
      const result = isOff ? (val - calculated) : calculated;
      return {
        type: 'calc',
        expression: `${pct}% ${isOff ? 'off' : 'of'} ${val}`,
        result: Number(result.toFixed(4)).toString(),
        label: isOff ? 'Discount Calculator' : 'Percentage Calculation'
      };
    }

    // 2. Math expression evaluation
    let sanitized = trimmed
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/\^/g, '**')
      .replace(/\bpi\b/gi, 'Math.PI')
      .replace(/\bsqrt\(([^)]+)\)/gi, 'Math.sqrt($1)');

    if (/^[0-9+\-*/().\s*%^MathPIsqrt,]+$/.test(sanitized) && /[+\-*/%]/.test(sanitized)) {
      try {
        const calcFunc = new Function(`return (${sanitized});`);
        const val = calcFunc();
        if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
          return {
            type: 'calc',
            expression: trimmed,
            result: Number(val.toFixed(6)).toString(),
            label: 'Smart Calculator'
          };
        }
      } catch {}
    }

    // 3. Unit / Temperature conversion
    const convMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)\s+(?:to|in)\s+([a-zA-Z]+)$/i);
    if (convMatch) {
      const amount = parseFloat(convMatch[1]);
      const fromUnit = convMatch[2].toLowerCase();
      const toUnit = convMatch[3].toLowerCase();
      
      const conversions = {
        'km_miles': 0.621371,
        'miles_km': 1.60934,
        'kg_lbs': 2.20462,
        'lbs_kg': 0.453592,
        'm_ft': 3.28084,
        'ft_m': 0.3048,
        'cm_inch': 0.393701,
        'inch_cm': 2.54,
        'gb_mb': 1024,
        'mb_gb': 1 / 1024,
      };
      const key = `${fromUnit}_${toUnit}`;
      if (conversions[key]) {
        const converted = (amount * conversions[key]).toFixed(3);
        return {
          type: 'calc',
          expression: `${amount} ${fromUnit} → ${toUnit}`,
          result: `${converted} ${toUnit}`,
          label: 'Unit Converter'
        };
      }
      if ((fromUnit === 'c' || fromUnit === 'celsius') && (toUnit === 'f' || toUnit === 'fahrenheit')) {
        const f = ((amount * 9/5) + 32).toFixed(1);
        return {
          type: 'calc',
          expression: `${amount}°C → °F`,
          result: `${f}°F`,
          label: 'Temperature Converter'
        };
      }
      if ((fromUnit === 'f' || fromUnit === 'fahrenheit') && (toUnit === 'c' || toUnit === 'celsius')) {
        const c = (((amount - 32) * 5/9)).toFixed(1);
        return {
          type: 'calc',
          expression: `${amount}°F → °C`,
          result: `${c}°C`,
          label: 'Temperature Converter'
        };
      }
    }

    return null;
  };

  // Magnetic Proximity tracking to pointer
  useEffect(() => {
    const handlePointer = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const { x, y } = e.detail;
      const dist = Math.hypot(x - centerX, y - centerY);

      const threshold = 220;
      if (dist < threshold) {
        setIsNear(true);
        const pull = (1 - dist / threshold) * 6;
        const angle = Math.atan2(y - centerY, x - centerX);
        const pullX = Math.cos(angle) * pull;
        const pullY = Math.sin(angle) * pull;
        setMagneticTransform(`translate(${pullX.toFixed(1)}px, ${pullY.toFixed(1)}px) scale(1.01)`);
      } else {
        setIsNear(false);
        setMagneticTransform('');
      }
    };

    window.addEventListener('vellox-pointer-move', handlePointer);
    return () => window.removeEventListener('vellox-pointer-move', handlePointer);
  }, []);

  // Global Keyboard Shortcuts: '/' to focus search input, 'Esc' to blur/close
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Pressing '/' when not typing in an input/textarea focuses the search input
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
      // Pressing 'Escape' closes dropdown & blurs
      if (e.key === 'Escape') {
        setShowDropdown(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const triggerBurst = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      window.dispatchEvent(
        new CustomEvent('vellox-burst', {
          detail: { x: rect.left + rect.width / 2, y: rect.bottom, count: 35 }
        })
      );
    }
  };

  // 200ms Debounced Autocomplete Request
  const fetchSuggestions = useCallback(async (prefix) => {
    if (!prefix || !prefix.trim()) {
      setSuggestions([]);
      if (contextRecommendations && contextRecommendations.length > 0) {
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
      setIsSuggestLoading(false);
      return;
    }

    setIsSuggestLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/suggest?q=${encodeURIComponent(prefix.trim())}`);
      if (!res.ok) throw new Error('Failed to fetch suggestions');
      const data = await res.json();

      const list = data.suggestions || [];
      setSuggestions(list);
      setSuggestLatency(data.latency_ms || 0);
      setShowDropdown(list.length > 0);
    } catch (err) {
      console.error('Autocomplete fetch error:', err);
      setSuggestions([]);
      setShowDropdown(false);
    } finally {
      setIsSuggestLoading(false);
    }
  }, [contextRecommendations]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setSelectedIndex(-1);

    if (!val || !val.trim()) {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      setSuggestions([]);
      if (contextRecommendations && contextRecommendations.length > 0) {
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 200);
  };

  const handleClear = () => {
    setInputValue('');
    setSuggestions([]);
    setSelectedIndex(-1);
    if (contextRecommendations && contextRecommendations.length > 0) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
    if (inputRef.current) inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    const currentList = !inputValue.trim() ? contextRecommendations : suggestions;

    if (showDropdown && currentList.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = selectedIndex < currentList.length - 1 ? selectedIndex + 1 : 0;
        setSelectedIndex(nextIndex);
        setInputValue(currentList[nextIndex].phrase);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = selectedIndex > 0 ? selectedIndex - 1 : currentList.length - 1;
        setSelectedIndex(prevIndex);
        setInputValue(currentList[prevIndex].phrase);
        return;
      }
      if (e.key === 'Escape') {
        setShowDropdown(false);
        setSelectedIndex(-1);
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        triggerBurst();
        if (selectedIndex >= 0 && selectedIndex < currentList.length) {
          const selected = currentList[selectedIndex].phrase;
          setInputValue(selected);
          saveToRecentSearches(selected);
          setShowDropdown(false);
          onSearch(selected);
        } else if (inputValue.trim()) {
          saveToRecentSearches(inputValue.trim());
          setShowDropdown(false);
          onSearch(inputValue.trim());
        } else if (currentList.length > 0) {
          const top = currentList[0].phrase;
          setInputValue(top);
          saveToRecentSearches(top);
          setShowDropdown(false);
          onSearch(top);
        }
        return;
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      triggerBurst();
      if (inputValue.trim()) {
        saveToRecentSearches(inputValue.trim());
        setShowDropdown(false);
        onSearch(inputValue.trim());
      } else if (contextRecommendations.length > 0) {
        const top = contextRecommendations[0].phrase;
        setInputValue(top);
        saveToRecentSearches(top);
        setShowDropdown(false);
        onSearch(top);
      }
    }
  };

  const handleSelectSuggestion = (phrase) => {
    triggerBurst();
    setInputValue(phrase);
    saveToRecentSearches(phrase);
    setShowDropdown(false);
    onSearch(phrase);
  };

  const LUCKY_TOPICS = [
    'James Webb Space Telescope discoveries',
    'Quantum computing breakthroughs',
    'Aurora borealis northern lights 4k',
    'Deep ocean bioluminescent creatures',
    'Artificial intelligence foundation models',
    'Ancient Roman architecture wonders',
    'Mars Perseverance rover 4k footage',
    'Studio Ghibli aesthetic animations',
    'How photosynthesis works step by step',
    'Hubble space telescope iconic galaxies',
    'Renewable clean energy innovations',
    'Great Barrier Reef marine ecosystem',
    'Origami 3d paper art tutorials'
  ];

  const handleGoogleSearchSubmit = () => {
    triggerBurst();
    if (inputValue.trim()) {
      saveToRecentSearches(inputValue.trim());
      setShowDropdown(false);
      onSearch(inputValue.trim());
    }
  };

  const handleFeelingLucky = () => {
    triggerBurst();
    const queryToUse = inputValue.trim();
    if (queryToUse) {
      setShowDropdown(false);
      onSearch(queryToUse);
    } else {
      // Pick a random lucky discovery topic
      const randomTopic = LUCKY_TOPICS[Math.floor(Math.random() * LUCKY_TOPICS.length)];
      setInputValue(randomTopic);
      setShowDropdown(false);
      onSearch(randomTopic);
    }
  };

  // Resolve actual language tag for SpeechRecognition
  const getEffectiveLanguage = (langCode) => {
    if (langCode === 'auto') {
      return (navigator.languages && navigator.languages[0]) || navigator.language || 'en-US';
    }
    return langCode;
  };

  // Connect Web Audio API AnalyserNode to user's live microphone stream
  const startAudioVisualizer = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.65;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const renderLoop = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Sample 16 frequency bands to match pitch and loudness
        const numBars = 16;
        const step = Math.max(1, Math.floor(dataArray.length / numBars));
        const bars = [];
        for (let i = 0; i < numBars; i++) {
          const rawVal = dataArray[i * step] || 0;
          // Scale from 0-255 to dynamic height between 6px and 46px
          const scaled = Math.max(6, Math.min(46, Math.round((rawVal / 255) * 40) + 6));
          bars.push(scaled);
        }
        setWaveformBars(bars);
        animationFrameRef.current = requestAnimationFrame(renderLoop);
      };

      renderLoop();
    } catch (err) {
      console.warn('Real-time Audio Visualizer notice:', err);
    }
  };

  const stopAudioVisualizer = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch {}
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close().catch(() => {});
      } catch {}
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setWaveformBars([8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8]);
  };

  // Real Voice Recognition via Web Speech API with Multi-Language Support
  const handleVoiceClick = (targetLang) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError('Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      setIsVoiceListening(true);
      return;
    }

    setVoiceTranscript('');
    setVoiceError(null);
    setIsVoiceListening(true);

    // Stop any existing session
    stopAudioVisualizer();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }

    // Start live microphone waveform visualizer
    startAudioVisualizer();

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      const langCode = targetLang || selectedVoiceLang;
      recognition.lang = getEffectiveLanguage(langCode);
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setVoiceError(null);
      };

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += trans;
          } else {
            interim += trans;
          }
        }
        const spoken = (final || interim).trim();
        if (spoken) {
          setVoiceTranscript(spoken);
        }

        if (final && final.trim()) {
          const finalQuery = final.trim();
          setInputValue(finalQuery);
          saveToRecentSearches(finalQuery);
          stopAudioVisualizer();
          setTimeout(() => {
            setIsVoiceListening(false);
            setShowDropdown(false);
            onSearch(finalQuery);
          }, 700);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        stopAudioVisualizer();
        if (event.error === 'no-speech') {
          setVoiceError('No speech detected. Please speak into your microphone.');
        } else if (event.error === 'not-allowed') {
          setVoiceError('Microphone permission blocked. Please allow microphone access in your browser.');
        } else if (event.error === 'audio-capture') {
          setVoiceError('No microphone detected on your device.');
        } else {
          setVoiceError(`Voice input error (${event.error}). Click to try again.`);
        }
      };

      recognition.onend = () => {
        // Recognition complete
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      stopAudioVisualizer();
      setVoiceError('Unable to start microphone recording. Please check browser permissions.');
    }
  };

  const handleLanguageChange = (newLang) => {
    setSelectedVoiceLang(newLang);
    try {
      localStorage.setItem('vellox_voice_lang', newLang);
    } catch {}
    if (isVoiceListening) {
      handleVoiceClick(newLang);
    }
  };

  const handleCancelVoice = () => {
    stopAudioVisualizer();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }
    setIsVoiceListening(false);
    setVoiceTranscript('');
    setVoiceError(null);
  };

  const handleSearchSpokenNow = () => {
    if (voiceTranscript.trim()) {
      const query = voiceTranscript.trim();
      stopAudioVisualizer();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      setIsVoiceListening(false);
      setInputValue(query);
      saveToRecentSearches(query);
      setShowDropdown(false);
      onSearch(query);
    }
  };

  // velloX Lens (Camera / Visual Search) Handlers with Client-Side Tesseract OCR
  const processImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target.result;
      setLensImage({
        file,
        preview: dataUrl,
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB'
      });
      setOcrText('');
      setOcrTags([]);
      setOcrLoading(true);
      setOcrProgress(0);
      setIsCopiedOcr(false);

      try {
        const { data } = await Tesseract.recognize(
          dataUrl,
          'eng',
          {
            logger: (m) => {
              if (m.status === 'recognizing text' && typeof m.progress === 'number') {
                setOcrProgress(Math.round(m.progress * 100));
              }
            }
          }
        );

        const rawText = data?.text?.trim() || '';
        setOcrText(rawText);

        // Extract clean semantic tokens / tags from text
        const words = rawText
          .split(/[\s,.;:!?()[\]{}"'\\/|<>+=*&^%$#@~`\n\r]+/)
          .map(w => w.trim())
          .filter(w => w.length >= 3 && !/^\d+$/.test(w));
        
        const stopWords = new Set(['the', 'and', 'for', 'that', 'this', 'with', 'from', 'your', 'have', 'are', 'was', 'were', 'which', 'about', 'into']);
        const uniqueTags = Array.from(new Set(words.filter(w => !stopWords.has(w.toLowerCase())))).slice(0, 7);

        // Add clean filename tag
        const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').trim();
        if (baseName && !uniqueTags.some(t => t.toLowerCase() === baseName.toLowerCase())) {
          uniqueTags.unshift(baseName);
        }

        setOcrTags(uniqueTags);
      } catch (ocrErr) {
        console.warn('Client-side OCR processing fallback:', ocrErr);
        const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').trim();
        setOcrTags(baseName ? [baseName] : []);
      } finally {
        setOcrLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSearchExtractedText = () => {
    if (ocrText.trim()) {
      const cleanQuery = ocrText.split('\n')[0].slice(0, 80).trim();
      setShowLensModal(false);
      setLensImage(null);
      setInputValue(cleanQuery);
      saveToRecentSearches(cleanQuery);
      onSearch(cleanQuery);
    }
  };

  const handleSearchTag = (tag) => {
    if (tag && tag.trim()) {
      const cleanTag = tag.trim();
      setShowLensModal(false);
      setLensImage(null);
      setInputValue(cleanTag);
      saveToRecentSearches(cleanTag);
      onSearch(cleanTag);
    }
  };

  const handleLensFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleLensDrop = (e) => {
    e.preventDefault();
    setIsDraggingLens(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleLensDragOver = (e) => {
    e.preventDefault();
    setIsDraggingLens(true);
  };

  const handleLensDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingLens(false);
  };

  const handleSearchWithGoogleLens = () => {
    setShowLensModal(false);
    window.location.href = 'https://lens.google.com/';
  };

  const handleSearchImageName = () => {
    if (lensImage && lensImage.name) {
      const cleanName = lensImage.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .trim();
      setShowLensModal(false);
      setInputValue(cleanName);
      onSearch(cleanName);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce timer, speech recognition, and audio visualizer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      stopAudioVisualizer();
    };
  }, []);

  // Dynamic calculation for instant math / unit conversion zero-click answers
  const instantAnswer = evaluateInstantAnswer(inputValue);

  // When input is empty, show recent searches (if any) along with context recommendations
  const historyItems = (!inputValue.trim() && isFocused)
    ? recentSearches.map(phrase => ({
        phrase,
        source: 'history',
        canDelete: true,
        tag: 'Recent'
      }))
    : [];

  const dropdownList = !inputValue.trim()
    ? [...historyItems, ...contextRecommendations]
    : suggestions;

  const isDropdownActive = showDropdown && (dropdownList.length > 0 || !!instantAnswer);

  return (
    <div className="w-full max-w-2xl mx-auto relative" ref={containerRef}>
      {/* Voice Listening Overlay Modal (Real User Speech Recognition + Real-time Audio Visualizer) */}
      {isVoiceListening && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#303134] rounded-3xl p-7 max-w-md w-full mx-4 text-center shadow-2xl border border-slate-200 dark:border-[#5f6368] transition-all">
            {/* Multi-Language Selector Bar */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-700/60 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span>Spoken Language:</span>
              </div>
              <select
                value={selectedVoiceLang}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                title="Select spoken language"
              >
                {SUPPORTED_VOICE_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center mb-4 relative">
              {!voiceError && <span className="absolute inset-0 rounded-full bg-red-400/30 animate-ping"></span>}
              <Mic className={`w-8 h-8 ${voiceError ? 'text-amber-500' : 'text-red-500'}`} />
            </div>

            <h3 className="text-xl font-medium text-slate-800 dark:text-[#e8eaed] mb-1">
              {voiceError ? 'Voice Input Notice' : (voiceTranscript ? 'Transcribing...' : 'Listening to your voice...')}
            </h3>

            {voiceError ? (
              <div className="my-4 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/40 text-xs text-amber-700 dark:text-amber-300">
                {voiceError}
              </div>
            ) : (
              <div className="my-4 min-h-[4rem] flex flex-col items-center justify-center">
                {voiceTranscript ? (
                  <p className="text-base font-semibold text-slate-900 dark:text-white px-3 py-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 max-w-full break-words">
                    "{voiceTranscript}"
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Speak into your microphone in {SUPPORTED_VOICE_LANGUAGES.find(l => l.code === selectedVoiceLang)?.name || 'your language'}...
                  </p>
                )}

                {/* Real-time Frequency Spectrum Waveform Visualizer (Web Audio API AnalyserNode) */}
                <div className="flex items-center justify-center gap-1.5 h-14 px-4 py-2 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 my-3 shadow-inner w-full max-w-xs mx-auto">
                  {waveformBars.map((height, i) => {
                    const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];
                    const barColor = colors[i % colors.length];
                    return (
                      <span
                        key={i}
                        className="w-1.5 rounded-full transition-all duration-75 ease-out shadow-sm"
                        style={{
                          height: `${height}px`,
                          backgroundColor: barColor,
                          minHeight: '6px'
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 mt-4">
              {voiceTranscript && !voiceError && (
                <button
                  type="button"
                  onClick={handleSearchSpokenNow}
                  className="px-4 py-2 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-500/20"
                >
                  Search Now ➔
                </button>
              )}
              {voiceError && (
                <button
                  type="button"
                  onClick={() => handleVoiceClick()}
                  className="px-4 py-2 rounded-full text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all"
                >
                  Try Again
                </button>
              )}
              <button
                type="button"
                onClick={handleCancelVoice}
                className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* velloX Lens Modal (Camera / Image Search) */}
      {showLensModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#303134] rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl border border-slate-200 dark:border-[#5f6368]">
            {/* Hidden File Input for Image Upload */}
            <input
              type="file"
              ref={lensFileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleLensFileChange}
            />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-medium text-slate-800 dark:text-[#e8eaed]">Search any image with velloX Lens</h3>
              </div>
              <button
                onClick={() => {
                  setShowLensModal(false);
                  setLensImage(null);
                }}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!lensImage ? (
              <div
                onDragOver={handleLensDragOver}
                onDragLeave={handleLensDragLeave}
                onDrop={handleLensDrop}
                onClick={() => lensFileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors mb-4 ${
                  isDraggingLens 
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' 
                    : 'border-slate-300 dark:border-slate-600 bg-slate-50 hover:bg-slate-100/70 dark:bg-[#202124]/50 dark:hover:bg-[#202124]'
                }`}
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 font-medium">
                  Drag an image here or <span className="text-blue-500 underline font-semibold">upload a file</span>
                </p>
                <p className="text-xs text-slate-400">
                  Search visual developer diagrams, screenshots, or any photo
                </p>
              </div>
            ) : (
              <div className="mb-4 space-y-3">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 flex items-center justify-center p-2 max-h-52">
                  <img
                    src={lensImage.preview}
                    alt={lensImage.name}
                    className="max-h-44 max-w-full rounded-lg object-contain shadow-md"
                  />
                  <button
                    onClick={() => {
                      setLensImage(null);
                      setOcrText('');
                      setOcrTags([]);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs px-1 text-slate-500 dark:text-slate-400">
                  <span className="truncate max-w-[200px] font-medium text-slate-700 dark:text-slate-300">
                    {lensImage.name}
                  </span>
                  <span>{lensImage.size}</span>
                </div>

                {/* Client-Side OCR Progress Indicator */}
                {ocrLoading && (
                  <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 rounded-2xl border border-blue-200/80 dark:border-blue-800/40 text-left">
                    <div className="flex items-center justify-between text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Extracting text with Client-Side OCR...</span>
                      </span>
                      <span>{ocrProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-150 rounded-full"
                        style={{ width: `${Math.max(5, ocrProgress)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Extracted OCR Text Snippet */}
                {!ocrLoading && ocrText && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700 text-left space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-500" />
                        <span>Extracted Text (Client-Side OCR)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(ocrText);
                          setIsCopiedOcr(true);
                          setTimeout(() => setIsCopiedOcr(false), 2000);
                        }}
                        className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        {isCopiedOcr ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopiedOcr ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 max-h-24 overflow-y-auto font-mono whitespace-pre-wrap select-all">
                      {ocrText}
                    </p>
                  </div>
                )}

                {/* Detected Semantic Search Tags */}
                {!ocrLoading && ocrTags.length > 0 && (
                  <div className="text-left space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-amber-500" />
                      <span>Click any detected tag to search:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {ocrTags.map((tag, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSearchTag(tag)}
                          className="px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:hover:bg-blue-900/80 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 text-xs font-semibold active:scale-95 transition-all"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2 pt-1">
                  {/* Search Extracted Text Button */}
                  {ocrText && !ocrLoading && (
                    <button
                      onClick={handleSearchExtractedText}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Search Extracted Text</span>
                    </button>
                  )}
                  <button
                    onClick={handleSearchWithGoogleLens}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Search with Google Lens</span>
                  </button>
                  <button
                    onClick={handleSearchImageName}
                    className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/60 dark:hover:bg-slate-700 transition-all text-center truncate"
                  >
                    Search Google for "{lensImage.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')}"
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60 pt-3">
              <button
                type="button"
                onClick={() => lensFileInputRef.current?.click()}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{lensImage ? 'Choose another image' : 'Browse computer'}</span>
              </button>
              <button
                onClick={() => {
                  setShowLensModal(false);
                  setLensImage(null);
                }}
                className="google-btn text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offline Alert Banner */}
      {!isOnline && onLaunchOfflineGame && (
        <div 
          onClick={onLaunchOfflineGame}
          className="w-full mb-3 px-4 py-2.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-500 text-xs font-semibold flex items-center justify-between cursor-pointer hover:bg-rose-500/25 transition-all shadow-lg animate-pulse"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-lg">🏄</span>
            <span>You are currently offline (ERR_INTERNET_DISCONNECTED). Click to launch the game directly!</span>
          </div>
          <span className="bg-rose-500 hover:bg-rose-600 text-white text-[11px] px-3 py-1 rounded-xl font-bold shadow-sm transition-transform active:scale-95">
            Play Game Now 🕹️
          </span>
        </div>
      )}

      {/* Unified Search Container (Bar + Dropdown in One Card) */}
      <div 
        style={{ transform: !isFocused && magneticTransform ? magneticTransform : undefined }}
        className={`google-search-wrapper search-wrapper-magnetic w-full ${
          isNear ? 'near' : ''
        } ${
          isFocused ? 'active-focus is-focused' : ''
        } ${
          isDropdownActive 
            ? 'rounded-[24px] google-unified-box dropdown-active z-30' 
            : 'rounded-full google-search-bar'
        } transition-all duration-200 shadow-sm`}
      >
        {/* Search Bar Header Row */}
        <div className="flex items-center w-full h-12 md:h-[48px] px-4">
          {/* Search Magnifying Glass Icon */}
          <div className="flex items-center justify-center pl-0.5 pr-3 text-[#9aa0a6]">
            {isSuggestLoading ? (
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-[#9aa0a6]" />
            )}
          </div>

          {/* Search Input Field */}
          <input
            ref={inputRef}
            type="text"
            id="google-search-input"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setIsFocused(true);
              if (inputValue.trim() && (suggestions.length > 0 || evaluateInstantAnswer(inputValue))) {
                setShowDropdown(true);
              } else if (!inputValue.trim() && (recentSearches.length > 0 || (contextRecommendations && contextRecommendations.length > 0))) {
                setShowDropdown(true);
              }
            }}
            placeholder={activeContext ? `Search ${activeContext.topic} or type any query... (Press / to focus)` : "Search velloX or type a query... (Press / to focus)"}
            className="w-full bg-transparent text-[15px] md:text-[16px] font-normal text-slate-900 dark:text-[#e8eaed] placeholder-[#70757a] dark:placeholder-[#9aa0a6] focus:outline-none tracking-normal leading-normal"
            autoComplete="off"
            spellCheck="false"
          />

          {/* Clear Button (X) */}
          {inputValue && (
            <button
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700/60 text-[#70757a] hover:text-slate-900 dark:hover:text-white transition-colors mr-1"
              title="Clear"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Vertical Separator Line between Clear and Tools */}
          <div className="h-6 w-[1px] bg-slate-200 dark:bg-[#5f6368] mx-2 flex-shrink-0" />

          {/* Voice Search Icon (4-color Mic) */}
          <button
            type="button"
            onClick={handleVoiceClick}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors flex-shrink-0 group"
            title="Search by voice"
          >
            <svg className="w-5 h-5 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
              <path fill="#4285F4" d="m12 15c1.66 0 3-1.34 3-3v-6c0-1.66-1.34-3-3-3s-3 1.34-3 3v6c0 1.66 1.34 3 3 3z"/>
              <path fill="#34A853" d="m11 18.92h2v3.08h-2z"/>
              <path fill="#F4B400" d="m7.05 16.95 1.41-1.41c-1.26-1.26-2.05-3-2.05-4.94h-2c0 2.5 1.02 4.77 2.64 6.35z"/>
              <path fill="#EA4335" d="m16.95 15.54 1.41 1.41c1.62-1.58 2.64-3.85 2.64-6.35h-2c0 1.94-.79 3.68-2.05 4.94z"/>
            </svg>
          </button>

          {/* Lens Camera Icon (Multi-color Camera) */}
          <button
            type="button"
            onClick={() => setShowLensModal(true)}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors flex-shrink-0 group ml-0.5"
            title="Search by image (velloX Lens)"
          >
            <svg className="w-5 h-5 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M5 10a5 5 0 0 1 5-5h2V3h-2a7 7 0 0 0-7 7v2h2v-2z"/>
              <path fill="#EA4335" d="M19 10a5 5 0 0 0-5-5h-2V3h2a7 7 0 0 1 7 7v2h-2v-2z"/>
              <path fill="#FBBC05" d="M5 14a5 5 0 0 0 5 5h2v2h-2a7 7 0 0 1-7-7v-2h2v2z"/>
              <path fill="#34A853" d="M19 14a5 5 0 0 1-5 5h-2v2h2a7 7 0 0 0 7-7v-2h-2v2z"/>
              <circle cx="12" cy="12" r="3.5" fill="#4285F4"/>
            </svg>
          </button>

          {/* Offline Surf Game Icon (Direct trigger) */}
          {onLaunchOfflineGame && (
            <button
              type="button"
              onClick={onLaunchOfflineGame}
              className={`p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-all flex-shrink-0 ml-0.5 ${
                !isOnline ? 'animate-bounce text-rose-500 scale-110' : 'text-cyan-500 hover:scale-110'
              }`}
              title={!isOnline ? "You are offline - Launch Surf & Dino Game directly!" : "Play Offline Surf & Dino Game"}
            >
              <span className="text-lg leading-none select-none">🏄</span>
            </button>
          )}
        </div>

        {/* Dynamic Autocomplete / Context Recommendations Dropdown */}
        {isDropdownActive && (
          <SuggestionDropdown
            suggestions={dropdownList}
            query={inputValue}
            selectedIndex={selectedIndex}
            onSelectSuggestion={handleSelectSuggestion}
            onHoverIndex={(idx) => setSelectedIndex(idx)}
            onDeleteHistory={handleDeleteHistory}
            onClearAllHistory={handleClearAllHistory}
            onVelloXSearch={handleGoogleSearchSubmit}
            onFeelingLucky={handleFeelingLucky}
            latencyMs={!inputValue.trim() ? 0.05 : suggestLatency}
            isContextRecommendation={!inputValue.trim() && contextRecommendations.length > 0 && historyItems.length === 0}
            activeContext={activeContext}
            instantAnswer={instantAnswer}
          />
        )}
      </div>
    </div>
  );
}
