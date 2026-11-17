import React, { useEffect, useState, useRef } from 'react';
import { FastForward } from 'lucide-react';

/* ========================================================================== */
/* YOUTUBE KIDS (2015-2017) AUTHENTIC INTRO ANIMATION COMPONENT               */
/* Reference: YouTube Kids classic ident (squishy red TV, bold typography,    */
/* animated broccoli character on spoon scooter with goggle eyes & bug buddy) */
/* ========================================================================== */

// Synthesize authentic 4-note marimba chime melody
function playYouTubeKidsChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    // Iconic YouTube Kids 4-tone marimba bounce: C5, E5, G5, C6
    const notes = [
      { f: 523.25, t: 0.05, dur: 0.28, vol: 0.22 },  // C5
      { f: 659.25, t: 0.22, dur: 0.28, vol: 0.24 },  // E5
      { f: 783.99, t: 0.39, dur: 0.30, vol: 0.26 },  // G5
      { f: 1046.50, t: 0.58, dur: 0.45, vol: 0.28 }, // C6 (Bright finish)
      { f: 1318.51, t: 0.62, dur: 0.35, vol: 0.16 }  // Harmonic shimmer
    ];

    notes.forEach(({ f, t, dur, vol }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Warm marimba timbre: combination of sine and slight triangle harmonics
      osc.type = 'triangle';
      const startTime = ctx.currentTime + t;
      osc.frequency.setValueAtTime(f, startTime);

      // Acoustic percussive strike envelope: immediate attack + snappy decay
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + dur);
    });
  } catch {
    // Graceful fallback if audio context blocked by browser policy
  }
}

/* -------------------------------------------------------------------------- */
/* 1. Squishy Red TV Play Button (Organic wobbly outline, tilted ~-4deg)       */
/* -------------------------------------------------------------------------- */
function SquishyPlayButton() {
  return (
    <div className="relative inline-flex items-center justify-center select-none transform -rotate-[3.5deg] hover:rotate-0 transition-transform duration-300">
      <svg
        viewBox="0 0 170 120"
        className="w-24 sm:w-32 md:w-40 lg:w-44 h-auto overflow-visible filter drop-shadow-[0_8px_18px_rgba(230,33,23,0.22)]"
      >
        {/* Squishy Red TV Body */}
        <path
          d="M 28 14 
             C 12 18, 5 36, 4 60 
             C 3 84, 8 104, 26 109 
             C 52 116, 122 114, 144 107 
             C 162 101, 166 85, 166 61 
             C 166 37, 160 20, 142 14 
             C 112 4, 52 7, 28 14 Z"
          fill="#ff0000"
          stroke="#1e1e1e"
          strokeWidth="6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Characteristic soft top-left specular gleam */}
        <path
          d="M 32 24 C 20 28, 16 38, 15 52"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.35"
          fill="none"
        />
        {/* Play Triangle with rounded corners and cartoon border */}
        <polygon
          points="70,38 70,84 116,61"
          fill="#ffffff"
          stroke="#1e1e1e"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. Authentic Character: Broccoli on Spoon-Scooter (2015-2017 ident)       */
/* -------------------------------------------------------------------------- */
function BroccoliScooterCharacter() {
  return (
    <div className="relative select-none pointer-events-none w-32 sm:w-40 md:w-48 h-auto">
      <svg viewBox="0 0 200 180" className="w-full h-full overflow-visible">
        <defs>
          {/* Wheel drop shadow */}
          <filter id="ch-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.12" />
          </filter>
        </defs>

        <g filter="url(#ch-shadow)">
          {/* 1. SPOON SCOOTER CHASSIS */}
          {/* Rear Wheels */}
          <g>
            <circle cx="150" cy="154" r="11" fill="#334155" stroke="#1e1e1e" strokeWidth="3" />
            <circle cx="150" cy="154" r="4.5" fill="#94a3b8" />
          </g>

          {/* Front Wheels (under bowl) */}
          <g>
            <circle cx="48" cy="156" r="10" fill="#334155" stroke="#1e1e1e" strokeWidth="3" />
            <circle cx="48" cy="156" r="4" fill="#94a3b8" />
          </g>

          {/* Spoon Base (White / Silver with bold cartoon outline) */}
          <path
            d="M 22 142 
               C 16 148, 20 162, 45 162 
               C 70 162, 78 146, 105 142 
               L 165 142 
               C 174 142, 178 148, 176 153 
               C 174 158, 168 160, 155 160 
               L 100 160 
               C 75 160, 65 168, 42 168 
               C 15 168, 8 152, 18 138 Z"
            fill="#f1f5f9"
            stroke="#1e1e1e"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Mint Ice Cream / Gel Mound inside spoon bowl */}
          <path
            d="M 26 146 C 26 132, 42 128, 54 135 C 64 141, 62 148, 60 152 Z"
            fill="#86efac"
            stroke="#1e1e1e"
            strokeWidth="2.5"
          />
          {/* Cute Sprinkles on mint blob */}
          <circle cx="38" cy="140" r="1.8" fill="#15803d" />
          <circle cx="48" cy="136" r="1.8" fill="#15803d" />
          <circle cx="44" cy="144" r="1.5" fill="#15803d" />

          {/* 2. TINY LADYBUG BUDDY RIDING ON THE REAR SPOON */}
          <g className="origin-center" style={{ animation: 'bug-flutter 0.35s ease-in-out infinite alternate' }}>
            {/* Fluttering Yellow Cape */}
            <path
              d="M 152 124 C 168 120, 185 116, 196 122 C 188 128, 174 130, 152 130 Z"
              fill="#facc15"
              stroke="#1e1e1e"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Ladybug Body */}
            <ellipse cx="146" cy="132" rx="9" ry="8" fill="#ef4444" stroke="#1e1e1e" strokeWidth="2.5" />
            <path d="M 146 124 L 146 140" stroke="#1e1e1e" strokeWidth="2" />
            <circle cx="142" cy="130" r="1.5" fill="#1e1e1e" />
            <circle cx="150" cy="134" r="1.5" fill="#1e1e1e" />
            {/* Ladybug Head */}
            <circle cx="138" cy="132" r="5" fill="#1e1e1e" />
            {/* Tiny Antennae */}
            <path d="M 136 127 Q 133 122 130 124" stroke="#1e1e1e" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <path d="M 137 128 Q 136 121 138 120" stroke="#1e1e1e" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            {/* Eye */}
            <circle cx="137" cy="131" r="1" fill="#ffffff" />
          </g>

          {/* 3. BROCCOLI CHARACTER BODY & TRUNK */}
          {/* Lower Stem / Striped Legs resting on spoon */}
          <g>
            <path
              d="M 82 118 L 74 148 C 74 153, 98 153, 98 148 L 102 118 Z"
              fill="#5eead4"
              stroke="#1e1e1e"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* Striped sock bands */}
            <path d="M 76 130 Q 88 132 100 130" stroke="#ffffff" strokeWidth="3" fill="none" />
            <path d="M 75 140 Q 88 142 98 140" stroke="#ffffff" strokeWidth="3" fill="none" />
            {/* Golden Belt / Waistband */}
            <rect x="76" y="114" width="28" height="6" rx="2" fill="#fbbf24" stroke="#1e1e1e" strokeWidth="2" />
          </g>

          {/* 4. BROCCOLI PUFFY HEAD (Turquoise green crown with organic cloud lobes) */}
          <path
            d="M 52 100
               C 34 96, 26 80, 32 64 
               C 22 50, 34 32, 50 30 
               C 56 16, 76 12, 92 20 
               C 106 10, 126 14, 134 26 
               C 148 24, 160 38, 156 54 
               C 166 68, 160 88, 146 96 
               C 142 106, 126 112, 114 108 
               C 100 114, 70 114, 52 100 Z"
            fill="#00e5a3"
            stroke="#1e1e1e"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Inner Shading / Foliage details */}
          <path
            d="M 44 60 C 48 46, 62 44, 70 48"
            stroke="#059669"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 112 36 C 122 36, 134 44, 132 54"
            stroke="#059669"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* 5. ICONIC RED GOGGLES & BIG EYES */}
          {/* Goggle Strap */}
          <path d="M 42 76 Q 88 66 140 74" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M 42 76 Q 88 66 140 74" stroke="#1e1e1e" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* Left Red Goggle Ring */}
          <circle cx="68" cy="74" r="17" fill="#ef4444" stroke="#1e1e1e" strokeWidth="3.5" />
          {/* Left Blue Lens */}
          <circle cx="68" cy="74" r="11" fill="#38bdf8" stroke="#1e1e1e" strokeWidth="2" />
          {/* Left Lens Glint */}
          <ellipse cx="65" cy="70" rx="4" ry="2.5" fill="#ffffff" transform="rotate(-20 65 70)" />

          {/* Right Red Goggle Ring */}
          <circle cx="104" cy="74" r="17" fill="#ef4444" stroke="#1e1e1e" strokeWidth="3.5" />
          {/* Right Blue Lens */}
          <circle cx="104" cy="74" r="11" fill="#38bdf8" stroke="#1e1e1e" strokeWidth="2" />
          {/* Right Lens Glint */}
          <ellipse cx="101" cy="70" rx="4" ry="2.5" fill="#ffffff" transform="rotate(-20 101 70)" />

          {/* Goggles Bridge Connector */}
          <path d="M 85 74 L 88 74" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
          <path d="M 85 74 L 88 74" stroke="#1e1e1e" strokeWidth="2" strokeLinecap="round" />

          {/* 6. CHEERFUL MOUTH & CHEEKS */}
          {/* Cheerful open smile */}
          <path
            d="M 80 94 Q 86 102 94 94 Z"
            fill="#dc2626"
            stroke="#1e1e1e"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Rosy Cheeks */}
          <ellipse cx="56" cy="88" rx="4" ry="2.5" fill="#fb7185" opacity="0.6" />
          <ellipse cx="116" cy="88" rx="4" ry="2.5" fill="#fb7185" opacity="0.6" />

          {/* Hands holding the spoon rail */}
          <circle cx="70" cy="116" r="5" fill="#5eead4" stroke="#1e1e1e" strokeWidth="2.5" />
          <circle cx="102" cy="116" r="5" fill="#5eead4" stroke="#1e1e1e" strokeWidth="2.5" />
        </g>
      </svg>
    </div>
  );
}

/* ========================================================================== */
/* MAIN KIDS MODE ENTRANCE SPLASH                                             */
/* ========================================================================== */
export default function KidsModeEntranceSplash({ onComplete }) {
  const [fadingOut, setFadingOut] = useState(false);
  const audioStartedRef = useRef(false);

  useEffect(() => {
    // 1. Play signature YouTube Kids marimba chime upon component mount
    if (!audioStartedRef.current) {
      audioStartedRef.current = true;
      playYouTubeKidsChime();
    }

    // 2. Smoothly complete intro at 2.8s
    const TOTAL_DURATION_MS = 2800;
    const FADE_OUT_START_MS = 2500;

    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, FADE_OUT_START_MS);

    const finishTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, TOTAL_DURATION_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  // Instant Skip handler
  const handleSkip = () => {
    setFadingOut(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 150);
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none bg-white transition-all duration-400 ease-out ${
        fadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: '#ffffff',
      }}
    >
      {/* Google Web Fonts for Authentic Rounded Condensed Typography */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Nunito:wght@800;900&display=swap');

        /* Logo elastic bounce pop-in */
        @keyframes ytk-logo-pop {
          0% {
            opacity: 0;
            transform: scale(0.4) translateY(-30px);
          }
          55% {
            opacity: 1;
            transform: scale(1.08) translateY(6px);
          }
          75% {
            transform: scale(0.96) translateY(-2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* Character scooter glide across the screen beneath logo */
        @keyframes ytk-scooter-drive {
          0% {
            transform: translateX(110vw) translateY(0);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          45% {
            transform: translateX(5vw) translateY(-4px);
          }
          55% {
            transform: translateX(-5vw) translateY(3px);
          }
          92% {
            opacity: 1;
          }
          100% {
            transform: translateX(-110vw) translateY(0);
            opacity: 0;
          }
        }

        /* Subtle organic bounce for riding motion */
        @keyframes scooter-bob {
          0%, 100% {
            transform: translateY(0) rotate(0.5deg);
          }
          50% {
            transform: translateY(-6px) rotate(-1deg);
          }
        }

        /* Ladybug yellow cape flutter */
        @keyframes bug-flutter {
          0% {
            transform: rotate(-3deg) scaleY(0.95);
          }
          100% {
            transform: rotate(4deg) scaleY(1.08);
          }
        }

        /* Playful speed trail dust puff */
        @keyframes speed-dust {
          0% {
            opacity: 0.8;
            transform: scale(0.5) translateX(0);
          }
          100% {
            opacity: 0;
            transform: scale(1.6) translateX(40px);
          }
        }
      `}</style>

      {/* Top Bar Skip Control */}
      <div className="absolute top-5 right-6 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all shadow-sm"
          title="Jump directly to Kids Space"
        >
          <span>Skip</span>
          <FastForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ==================================================================== */}
      {/* CENTER LOGO LOCKUP: SQUISHY RED TV + BOLD "velloX Kids" TYPOGRAPHY  */}
      {/* ==================================================================== */}
      <div
        className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5 px-4"
        style={{
          animation: 'ytk-logo-pop 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        }}
      >
        {/* Squishy Red TV Play Button */}
        <SquishyPlayButton />

        {/* Brand Text: Authentic condensed, rounded bold style */}
        <div
          className="flex items-baseline tracking-tight font-extrabold select-none text-[#212121]"
          style={{
            fontFamily: "'Fredoka', 'Nunito', 'Segoe UI Rounded', 'Arial Rounded MT Bold', sans-serif",
            fontSize: 'clamp(2.4rem, 6.2vw, 4.8rem)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          {/* velloX portion */}
          <span className="text-[#212121]">
            vello<span className="text-[#ff0000]">X</span>
          </span>

          {/* Kids portion with authentic YouTube Kids spacing & presence */}
          <span
            className="ml-2 sm:ml-3 text-[#212121] tracking-normal font-black"
            style={{
              letterSpacing: '-0.02em',
            }}
          >
            Kids
          </span>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* ANIMATED CHARACTERS GLIDING UNDERNEATH THE LOGO                       */}
      {/* ==================================================================== */}
      <div
        className="absolute bottom-16 sm:bottom-20 md:bottom-24 pointer-events-none"
        style={{
          animation: 'ytk-scooter-drive 2.5s cubic-bezier(0.25, 0.1, 0.25, 1) 0.15s forwards',
        }}
      >
        <div style={{ animation: 'scooter-bob 0.45s ease-in-out infinite' }}>
          <BroccoliScooterCharacter />
        </div>

        {/* Playful speed trail dust puff behind spoon */}
        <div
          className="absolute right-2 bottom-2 w-4 h-4 rounded-full bg-slate-200 pointer-events-none"
          style={{ animation: 'speed-dust 0.5s ease-out infinite' }}
        />
        <div
          className="absolute right-6 bottom-4 w-3 h-3 rounded-full bg-slate-300 pointer-events-none"
          style={{ animation: 'speed-dust 0.5s ease-out 0.2s infinite' }}
        />
      </div>

      {/* Gentle helper label at bottom */}
      <div className="absolute bottom-6 text-[11px] font-medium text-slate-400 select-none tracking-wide">
        velloX Kids • Safe, Fun Exploration for Young Minds
      </div>
    </div>
  );
}
