import React from 'react';

/**
 * MonkeyAvatar Component
 * Animated "See-No-Evil" Monkey / Yeti avatar inspired by Darin Senneff's famous login avatar
 * and the user's reference video (https://www.youtube.com/shorts/L0z79Ql-7Yo).
 *
 * States:
 * - isCovering: hands move up to cover both eyes (when entering secret password)
 * - isPeeking: one hand drops slightly so one eye peeks through (when show password eye is toggled)
 * - hasError: startled expression when password is incorrect
 * - isSuccess: happy celebration expression when unlocked
 */
export default function MonkeyAvatar({
  isCovering = false,
  isPeeking = false,
  hasError = false,
  isSuccess = false,
  className = "w-28 h-28"
}) {
  // Hand transform calculation
  // Base resting position: lowered to bottom of the frame
  // Covering position: centered directly over eyes
  // Peeking position: lowered partially with a slight angle
  const getLeftHandTransform = () => {
    if (isSuccess) return 'translate(-20px, 50px) rotate(-25deg)';
    if (hasError) return 'translate(-15px, 60px) rotate(-10deg)';
    if (isPeeking) return 'translate(-14px, 26px) rotate(-18deg)';
    if (isCovering) return 'translate(0px, 0px) rotate(0deg)';
    return 'translate(-10px, 72px) rotate(-12deg)';
  };

  const getRightHandTransform = () => {
    if (isSuccess) return 'translate(20px, 50px) rotate(25deg)';
    if (hasError) return 'translate(15px, 60px) rotate(10deg)';
    if (isPeeking) return 'translate(14px, 26px) rotate(18deg)';
    if (isCovering) return 'translate(0px, 0px) rotate(0deg)';
    return 'translate(10px, 72px) rotate(12deg)';
  };

  return (
    <div className={`relative inline-block select-none ${className} ${hasError ? 'animate-monkey-shake' : ''}`}>
      <svg
        viewBox="0 0 160 160"
        className="w-full h-full drop-shadow-lg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="monkeyBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dbeafe" />
            <stop offset="50%" stopColor="#e0e7ff" />
            <stop offset="100%" stopColor="#fbcfe8" />
          </linearGradient>
          <linearGradient id="furGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8d5b28" />
            <stop offset="100%" stopColor="#6e4219" />
          </linearGradient>
          <linearGradient id="furHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a36b35" />
            <stop offset="100%" stopColor="#7c4a1e" />
          </linearGradient>
          <clipPath id="avatarCircleClip">
            <circle cx="80" cy="80" r="74" />
          </clipPath>
        </defs>

        {/* Circular Outer Frame & Background */}
        <circle
          cx="80"
          cy="80"
          r="74"
          fill="url(#monkeyBgGrad)"
          stroke="#818cf8"
          strokeWidth="3.5"
          className="transition-colors duration-300"
        />

        {/* Inner Content clipped to Circle */}
        <g clipPath="url(#avatarCircleClip)">
          {/* Subtle background glow */}
          <circle cx="80" cy="80" r="60" fill="#ffffff" fillOpacity="0.35" />

          {/* EARS (Behind Head) */}
          {/* Left Ear */}
          <g className="transition-transform duration-300" style={{ transformOrigin: '32px 75px', transform: isCovering ? 'rotate(-6deg)' : 'none' }}>
            <circle cx="32" cy="75" r="19" fill="url(#furGrad)" stroke="#5c3614" strokeWidth="2" />
            <circle cx="32" cy="75" r="12" fill="#fed7aa" />
            <circle cx="33" cy="75" r="7" fill="#fbcfe8" opacity="0.7" />
          </g>
          {/* Right Ear */}
          <g className="transition-transform duration-300" style={{ transformOrigin: '128px 75px', transform: isCovering ? 'rotate(6deg)' : 'none' }}>
            <circle cx="128" cy="75" r="19" fill="url(#furGrad)" stroke="#5c3614" strokeWidth="2" />
            <circle cx="128" cy="75" r="12" fill="#fed7aa" />
            <circle cx="127" cy="75" r="7" fill="#fbcfe8" opacity="0.7" />
          </g>

          {/* SHOULDERS & CHEST */}
          <path
            d="M 24 165 C 24 125, 136 125, 136 165 Z"
            fill="url(#furGrad)"
            stroke="#5c3614"
            strokeWidth="2"
          />
          {/* Chest lighter patch */}
          <path
            d="M 52 165 C 52 138, 108 138, 108 165 Z"
            fill="#fed7aa"
            opacity="0.9"
          />

          {/* MONKEY HEAD */}
          <g className="transition-transform duration-300" style={{ transformOrigin: '80px 85px', transform: hasError ? 'rotate(-4deg)' : (isSuccess ? 'translateY(-2px)' : 'none') }}>
            {/* Main Head Base */}
            <path
              d="M 80 26 C 48 26, 40 54, 40 80 C 40 108, 56 125, 80 125 C 104 125, 120 108, 120 80 C 120 54, 112 26, 80 26 Z"
              fill="url(#furGrad)"
              stroke="#5c3614"
              strokeWidth="2.5"
            />

            {/* Little hair tuft on top */}
            <path
              d="M 74 27 C 70 14, 76 9, 80 14 C 84 9, 90 14, 86 27 Z"
              fill="url(#furHighlight)"
            />

            {/* Face mask - lighter heart / peanut shape */}
            <path
              d="M 80 60 
                 C 72 48, 48 48, 48 68 
                 C 48 88, 62 98, 80 98 
                 C 98 98, 112 88, 112 68 
                 C 112 48, 88 48, 80 60 Z"
              fill="#fef08a"
              opacity="0.15"
            />
            <path
              d="M 80 62 
                 C 73 50, 50 50, 50 68 
                 C 50 86, 64 96, 80 96 
                 C 96 96, 110 86, 110 68 
                 C 110 50, 87 50, 80 62 Z"
              fill="#fed7aa"
              stroke="#e29f68"
              strokeWidth="1.5"
            />

            {/* Snout Area */}
            <ellipse cx="80" cy="88" rx="18" ry="12" fill="#fdba74" opacity="0.8" />

            {/* EYEBROWS */}
            <path
              d={isCovering ? "M 55 58 Q 63 56 71 59" : (hasError ? "M 56 56 Q 63 60 70 57" : (isSuccess ? "M 55 56 Q 63 52 71 55" : "M 56 57 Q 63 53 70 56"))}
              stroke="#45230c"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-200"
            />
            <path
              d={isCovering ? "M 89 59 Q 97 56 105 58" : (hasError ? "M 90 57 Q 97 60 104 56" : (isSuccess ? "M 89 55 Q 97 52 105 56" : "M 90 56 Q 97 53 104 57"))}
              stroke="#45230c"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-200"
            />

            {/* EYES */}
            {/* Left Eye */}
            <g>
              <ellipse cx="63" cy="68" rx="8" ry="9" fill="#ffffff" stroke="#c28e62" strokeWidth="1" />
              {isSuccess ? (
                /* Happy curved eye ^ */
                <path d="M 57 70 Q 63 63 69 70" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              ) : (
                /* Round pupil */
                <>
                  <circle cx="63.5" cy={isCovering ? "66" : "68.5"} r="4.5" fill="#1e293b" className="transition-all duration-150" />
                  <circle cx="62" cy={isCovering ? "64.5" : "67"} r="1.5" fill="#ffffff" />
                  <circle cx="65.5" cy={isCovering ? "67.5" : "70"} r="0.75" fill="#ffffff" />
                </>
              )}
            </g>

            {/* Right Eye */}
            <g>
              <ellipse cx="97" cy="68" rx="8" ry="9" fill="#ffffff" stroke="#c28e62" strokeWidth="1" />
              {isSuccess ? (
                /* Happy curved eye ^ */
                <path d="M 91 70 Q 97 63 103 70" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              ) : (
                /* Round pupil */
                <>
                  <circle cx="96.5" cy={isCovering ? "66" : "68.5"} r="4.5" fill="#1e293b" className="transition-all duration-150" />
                  <circle cx="95" cy={isCovering ? "64.5" : "67"} r="1.5" fill="#ffffff" />
                  <circle cx="98.5" cy={isCovering ? "67.5" : "70"} r="0.75" fill="#ffffff" />
                </>
              )}
            </g>

            {/* Rosy Cheeks */}
            <circle cx="51" cy="78" r="4.5" fill="#f43f5e" opacity="0.35" />
            <circle cx="109" cy="78" r="4.5" fill="#f43f5e" opacity="0.35" />

            {/* NOSE */}
            <circle cx="77" cy="85" r="1.5" fill="#5c3614" />
            <circle cx="83" cy="85" r="1.5" fill="#5c3614" />

            {/* MOUTH */}
            {hasError ? (
              /* Startled / o mouth */
              <ellipse cx="80" cy="93" rx="4" ry="5" fill="#5c3614" />
            ) : isSuccess ? (
              /* Big cheerful smile with pink tongue */
              <g>
                <path d="M 72 90 Q 80 102 88 90 Z" fill="#b91c1c" />
                <path d="M 75 94 Q 80 97 85 94" fill="#fb7185" />
                <path d="M 71 89 Q 80 102 89 89" stroke="#45230c" strokeWidth="2" strokeLinecap="round" fill="none" />
              </g>
            ) : (
              /* Sweet friendly smile */
              <path
                d="M 73 90 Q 80 96 87 90"
                stroke="#5c3614"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </g>

          {/* ======================================================== */}
          {/* ANIMATED HANDS (Cover Eyes on Password Focus)             */}
          {/* ======================================================== */}

          {/* LEFT HAND & ARM */}
          <g
            style={{
              transform: getLeftHandTransform(),
              transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transformOrigin: '40px 120px'
            }}
          >
            {/* Forearm */}
            <path
              d="M 28 150 C 30 115, 48 95, 58 75 C 60 71, 65 72, 63 78 C 54 98, 44 125, 42 155 Z"
              fill="url(#furGrad)"
              stroke="#5c3614"
              strokeWidth="2"
            />
            {/* Left Hand Palm over Eye */}
            <g transform="translate(63, 68)">
              {/* Palm back */}
              <ellipse cx="0" cy="0" rx="14" ry="15" fill="url(#furGrad)" stroke="#5c3614" strokeWidth="2" />
              {/* Soft palm inner patch */}
              <ellipse cx="1" cy="1" rx="9" ry="10" fill="#fed7aa" />
              {/* Knuckles / 4 rounded fingers */}
              {/* Finger 1 */}
              <rect x="-12" y="-14" width="6" height="11" rx="3" fill="url(#furGrad)" stroke="#5c3614" strokeWidth="1.5" />
              <rect x="-11" y="-12" width="4" height="6" rx="2" fill="#fed7aa" />
              {/* Finger 2 */}
              <rect x="-5" y="-17" width="6" height="13" rx="3" fill="url(#furGrad)" stroke="#5c3614" strokeWidth="1.5" />
              <rect x="-4" y="-15" width="4" height="8" rx="2" fill="#fed7aa" />
              {/* Finger 3 */}
              <rect x="2" y="-16" width="6" height="12" rx="3" fill="url(#furGrad)" stroke="#5c3614" strokeWidth="1.5" />
              <rect x="3" y="-14" width="4" height="7" rx="2" fill="#fed7aa" />
              {/* Thumb */}
              <ellipse cx="10" cy="-2" rx="4" ry="7" transform="rotate(30 10 -2)" fill="url(#furGrad)" stroke="#5c3614" strokeWidth="1.5" />
              <ellipse cx="10" cy="-2" rx="2.5" ry="4.5" transform="rotate(30 10 -2)" fill="#fed7aa" />
            </g>
          </g>

          {/* RIGHT HAND & ARM */}
          <g
            style={{
              transform: getRightHandTransform(),
              transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transformOrigin: '120px 120px'
            }}
          >
            {/* Forearm */}
            <path
              d="M 132 150 C 130 115, 112 95, 102 75 C 100 71, 95 72, 97 78 C 106 98, 116 125, 118 155 Z"
              fill="url(#furGrad)"
              stroke="#5c3614"
              strokeWidth="2"
            />
            {/* Right Hand Palm over Eye */}
            <g transform="translate(97, 68)">
              {/* Palm back */}
              <ellipse cx="0" cy="0" rx="14" ry="15" fill="url(#furGrad)" stroke="#5c3614" strokeWidth="2" />
              {/* Soft palm inner patch */}
              <ellipse cx="-1" cy="1" rx="9" ry="10" fill="#fed7aa" />
              {/* Knuckles / 4 rounded fingers */}
              {/* Finger 1 */}
              <rect x="6" y="-14" width="6" height="11" rx="3" fill="url(#furGrad)" stroke="#5c3614" strokeWidth="1.5" />
              <rect x="7" y="-12" width="4" height="6" rx="2" fill="#fed7aa" />
              {/* Finger 2 */}
              <rect x="-1" y="-17" width="6" height="13" rx="3" fill="url(#furGrad)" stroke="#5c3614" strokeWidth="1.5" />
              <rect x="0" y="-15" width="4" height="8" rx="2" fill="#fed7aa" />
              {/* Finger 3 */}
              <rect x="-8" y="-16" width="6" height="12" rx="3" fill="url(#furGrad)" stroke="#5c3614" strokeWidth="1.5" />
              <rect x="-7" y="-14" width="4" height="7" rx="2" fill="#fed7aa" />
              {/* Thumb */}
              <ellipse cx="-10" cy="-2" rx="4" ry="7" transform="rotate(-30 -10 -2)" fill="url(#furGrad)" stroke="#5c3614" strokeWidth="1.5" />
              <ellipse cx="-10" cy="-2" rx="2.5" ry="4.5" transform="rotate(-30 -10 -2)" fill="#fed7aa" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
