import React, { useState } from 'react';
import { 
  Activity, ShieldCheck, Gauge, 
  ExternalLink, Terminal, Sparkles 
} from 'lucide-react';
import { Youtube, Linkedin, Instagram, Monster, Foundit } from './PlatformIcons';

export default function ContentInspector({ item, queryLatency = 0, platformLatencies = {} }) {
  const [showRawJson, setShowRawJson] = useState(false);

  if (!item) {
    return (
      <div className="h-full rounded-2xl glass-panel bg-slate-900/60 dark:bg-slate-900/60 light:bg-white/70 border border-slate-800 dark:border-slate-800 light:border-slate-200 p-6 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 animate-subtle-pulse">
          <Activity className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-200 dark:text-slate-200 light:text-slate-700 mb-1">
          Content Intelligence Inspector
        </h4>
        <p className="text-xs text-slate-400 max-w-[240px]">
          Hover over any result card to inspect live entity metadata, latency metrics, and relevance scores.
        </p>
      </div>
    );
  }

  const isYouTube = item.platform === 'YouTube';
  const isLinkedIn = item.platform === 'LinkedIn';
  const isMonster = item.platform === 'Monster';
  const isFoundit = item.platform === 'Foundit';
  const isInstagram = item.platform === 'Instagram';

  let PlatformIcon = Youtube;
  let themeColor = 'text-red-400 bg-red-500/10 border-red-500/30';
  let haloGlow = 'rgba(255, 0, 51, 0.2)';

  if (isLinkedIn) {
    PlatformIcon = Linkedin;
    themeColor = 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    haloGlow = 'rgba(10, 102, 194, 0.2)';
  } else if (isMonster) {
    PlatformIcon = Monster;
    themeColor = 'text-purple-400 bg-purple-500/10 border-purple-500/30';
    haloGlow = 'rgba(110, 0, 255, 0.2)';
  } else if (isFoundit) {
    PlatformIcon = Foundit;
    themeColor = 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    haloGlow = 'rgba(255, 79, 0, 0.2)';
  } else if (isInstagram) {
    PlatformIcon = Instagram;
    themeColor = 'text-pink-400 bg-pink-500/10 border-pink-500/30';
    haloGlow = 'rgba(225, 48, 108, 0.2)';
  }

  const engineLatency = platformLatencies[item.platform] || 24.5;

  return (
    <div 
      className="rounded-2xl glass-panel bg-slate-900/90 dark:bg-slate-900/90 light:bg-white/95 border border-indigo-500/30 shadow-2xl p-5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
      style={{ boxShadow: `0 0 35px ${haloGlow}` }}
    >
      {/* Background Accent Glow */}
      <div 
        className="absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: isYouTube ? '#ff0033' : isLinkedIn ? '#0a66c2' : isMonster ? '#6e00ff' : isFoundit ? '#ff4f00' : '#e1306c' }}
      />

      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
              Live Intelligence Node
            </span>
          </div>

          <button
            onClick={() => setShowRawJson(!showRawJson)}
            className="flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <Terminal className="w-3 h-3" />
            <span>{showRawJson ? 'View UI' : 'Raw JSON'}</span>
          </button>
        </div>

        {showRawJson ? (
          <div className="mt-4 p-3 rounded-xl bg-slate-950 font-mono text-[10px] text-emerald-400 overflow-x-auto max-h-96 border border-slate-800">
            <pre>{JSON.stringify(item, null, 2)}</pre>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {/* Entity Identification */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${themeColor}`}>
                  <PlatformIcon className="w-3.5 h-3.5" />
                  <span>{item.platform} Source</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  ID: #{item.id}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-100 dark:text-slate-100 light:text-slate-800 leading-snug line-clamp-2">
                {item.title}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">{item.subtitle}</p>
            </div>

            {/* Micro-Telemetry Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Relevance Metric */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    <span>Relevance</span>
                  </span>
                  <span className="font-mono font-bold text-indigo-400">{item.relevance_score}%</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full"
                    style={{ width: `${item.relevance_score}%` }}
                  />
                </div>
              </div>

              {/* Federated Latency Metric */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-emerald-400" />
                    <span>Latency</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-400">{engineLatency}ms</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  Total Query: {queryLatency}ms
                </div>
              </div>
            </div>

            {/* Vector Search Telemetry */}
            {item.vector_score && (
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 font-mono text-purple-300 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                    Semantic Vector Match
                  </span>
                  <span className="font-mono text-xs text-purple-300 font-bold">
                    {(item.vector_score * 100).toFixed(1)}% Cosine
                  </span>
                </div>
                <div className="w-full bg-purple-950/80 h-1.5 rounded-full overflow-hidden mb-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-indigo-400 h-full rounded-full"
                    style={{ width: `${Math.min(100, item.vector_score * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-purple-900/40">
                  <span>Concept:</span>
                  <span className="text-purple-300 font-medium">{item.semantic_concept || "Technology & Systems"}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Embedding Space:</span>
                  <span className="text-slate-300">{item.vector_dimensions || 512}-D Ontological Vector</span>
                </div>
              </div>
            )}

            {/* Deep Metadata Attributes */}
            <div className="space-y-2 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Content Format:</span>
                <span className="text-slate-200 font-medium">{item.content_format}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Engagement Rate:</span>
                <span className="text-emerald-400 font-semibold">{item.engagement_rate}</span>
              </div>
              <div className="flex flex-col gap-0.5 pt-1 border-t border-slate-800/60">
                <span className="text-slate-400 text-[10px]">Verified Platform API Endpoint:</span>
                <span className="text-indigo-300 text-[10px] truncate" title={item.verified_endpoint}>
                  {item.verified_endpoint}
                </span>
              </div>
            </div>

            {/* Privacy & Constraint Certificate */}
            <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/30 flex items-start gap-2 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-emerald-300 block text-[11px]">
                  Enterprise Privacy Verified
                </span>
                <span className="text-[10px] text-emerald-400/80 leading-relaxed block">
                  Public index aggregation only. WhatsApp strictly excluded (E2EE/Zero-telemetry policy enforced).
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* External Target CTA */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-colors"
        >
          <span>Open Live Source on {item.platform}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
