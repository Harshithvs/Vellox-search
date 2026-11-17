import React from 'react';
import dashboardBg from '../assets/dashboard-bg.png';

export default function CyberDashboardBackground({ isDark = true }) {
  if (!isDark) return null;

  return (
    <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden" aria-hidden="true">
      {/* 1. Deep Eye-Comfort Midnight Indigo Base Gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 25%, #15183d 0%, #0d1029 55%, #080918 100%)'
        }}
      />

      {/* 2. Uploaded Dashboard Art Backdrop with Soft Eye-Comfort Blending */}
      <div 
        className="absolute inset-0 opacity-30 mix-blend-screen bg-center bg-cover bg-no-repeat transition-opacity duration-700"
        style={{
          backgroundImage: `url(${dashboardBg})`,
          filter: 'contrast(1.15) brightness(0.9) saturate(1.2)'
        }}
      />

      {/* 3. Blueprint Cyber Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* 4. Ambient Colored Glow Orbs (Soft, Anti-Glare Luminescence) */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-[32rem] h-[32rem] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[28rem] h-[28rem] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* 5. Precision SVG Circuit Traces & PCB Motherboard Lines */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="circuitCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="circuitPurple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Top-Left Circuit Traces */}
        <g stroke="url(#circuitCyan)" strokeWidth="1.2" fill="none" filter="url(#glow)">
          <path d="M 0 120 L 90 120 L 140 170 L 260 170" />
          <path d="M 0 160 L 60 160 L 110 210 L 190 210" />
          <path d="M 120 0 L 120 70 L 170 120 L 170 190" />
          <circle cx="260" cy="170" r="3" fill="#38bdf8" />
          <circle cx="190" cy="210" r="2.5" fill="#818cf8" />
          <circle cx="170" cy="190" r="2.5" fill="#38bdf8" />
        </g>

        {/* Top-Right Circuit Traces */}
        <g stroke="url(#circuitPurple)" strokeWidth="1.2" fill="none" filter="url(#glow)">
          <path d="M 100% 120 L calc(100% - 90px) 120 L calc(100% - 150px) 180 L calc(100% - 280px) 180" />
          <path d="M 100% 160 L calc(100% - 70px) 160 L calc(100% - 120px) 210 L calc(100% - 210px) 210" />
          <path d="M calc(100% - 140px) 0 L calc(100% - 140px) 60 L calc(100% - 190px) 110 L calc(100% - 190px) 170" />
        </g>

        {/* Bottom-Left Circuit Traces */}
        <g stroke="url(#circuitCyan)" strokeWidth="1.2" fill="none" filter="url(#glow)">
          <path d="M 0 calc(100% - 120px) L 80 calc(100% - 120px) L 130 calc(100% - 170px) L 220 calc(100% - 170px)" />
          <path d="M 100 100% L 100 calc(100% - 60px) L 150 calc(100% - 110px) L 210 calc(100% - 110px)" />
          <circle cx="220" cy="calc(100% - 170px)" r="2.5" fill="#38bdf8" />
        </g>

        {/* Bottom-Right Circuit Traces */}
        <g stroke="url(#circuitPurple)" strokeWidth="1.2" fill="none" filter="url(#glow)">
          <path d="M 100% calc(100% - 120px) L calc(100% - 90px) calc(100% - 120px) L calc(100% - 140px) calc(100% - 170px) L calc(100% - 240px) calc(100% - 170px)" />
          <path d="M calc(100% - 110px) 100% L calc(100% - 110px) calc(100% - 70px) L calc(100% - 160px) calc(100% - 120px) L calc(100% - 220px) calc(100% - 120px)" />
        </g>
      </svg>

      {/* 6. Corner Holographic HUD Telemetry Widgets (Matching User's Image) */}
      {/* Top-Left HUD: Radar Telemetry */}
      <div className="hidden lg:flex absolute top-16 left-6 flex-col gap-1 p-2.5 rounded-lg border border-indigo-500/25 bg-[#0f122e]/45 backdrop-blur-sm text-[10px] font-mono text-indigo-300/80 shadow-lg shadow-indigo-950/40">
        <div className="flex items-center justify-between gap-4 border-b border-indigo-500/20 pb-1">
          <span className="text-cyan-400 font-bold tracking-wider">RADAR.TEL</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <div className="relative w-10 h-10 rounded-full border border-cyan-400/40 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border border-dashed border-indigo-400/50"></div>
            <div className="absolute w-full h-[1px] bg-cyan-400/30"></div>
            <div className="absolute h-full w-[1px] bg-cyan-400/30"></div>
          </div>
          <div className="space-y-0.5">
            <div>TARGET: 360° TRIE</div>
            <div className="text-slate-400">LAT: 0.12ms</div>
          </div>
        </div>
      </div>

      {/* Top-Right HUD: Code / Status Stream */}
      <div className="hidden lg:flex absolute top-16 right-6 flex-col gap-1 p-2.5 rounded-lg border border-indigo-500/25 bg-[#0f122e]/45 backdrop-blur-sm text-[10px] font-mono text-purple-300/80 shadow-lg shadow-purple-950/40">
        <div className="flex items-center justify-between gap-4 border-b border-indigo-500/20 pb-1">
          <span className="text-purple-400 font-bold tracking-wider">SYS.MATRIX</span>
          <span className="text-emerald-400 text-[9px]">ENCRYPTED</span>
        </div>
        <div className="space-y-0.5 pt-1 text-[9px] text-slate-400">
          <div>FEDERATED: 5 NODES ACTIVE</div>
          <div>HASH: SHA-256 VERIFIED</div>
          <div className="text-cyan-400/90">&gt; TRIE_LOOKUP: READY</div>
        </div>
      </div>

      {/* Bottom-Left HUD: Diagnostic Monitor */}
      <div className="hidden lg:flex absolute bottom-12 left-6 flex-col gap-1 p-2.5 rounded-lg border border-cyan-500/25 bg-[#0f122e]/45 backdrop-blur-sm text-[10px] font-mono text-cyan-300/80 shadow-lg shadow-cyan-950/40">
        <div className="flex items-center justify-between gap-4 border-b border-cyan-500/20 pb-1">
          <span className="text-cyan-400 font-bold tracking-wider">TELEMETRY</span>
          <span className="text-[9px] text-slate-400">O(L) SPEED</span>
        </div>
        <div className="pt-1 flex items-baseline gap-2">
          <span className="text-emerald-400 text-xs font-bold">100% HEALTH</span>
          <span className="text-[9px] text-slate-400">ZERO LATENCY</span>
        </div>
      </div>

      {/* Bottom-Right HUD: Data Grid Table */}
      <div className="hidden lg:flex absolute bottom-12 right-6 flex-col gap-1 p-2.5 rounded-lg border border-purple-500/25 bg-[#0f122e]/45 backdrop-blur-sm text-[10px] font-mono text-indigo-300/80 shadow-lg shadow-indigo-950/40">
        <div className="flex items-center justify-between gap-4 border-b border-purple-500/20 pb-1">
          <span className="text-indigo-400 font-bold tracking-wider">FEDERATED ENGINE</span>
          <span className="text-[9px] text-emerald-400">SYNCED</span>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1 text-[9px] text-slate-300">
          <div>YT: 99%</div>
          <div>LI: 98%</div>
          <div>IG: 97%</div>
        </div>
      </div>

      {/* 7. Center Vignette to Guarantee Absolute Readability & Eye Comfort */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 48%, rgba(13, 16, 41, 0.4) 0%, rgba(9, 11, 26, 0.75) 70%, rgba(6, 8, 20, 0.95) 100%)'
        }}
      />
    </div>
  );
}

