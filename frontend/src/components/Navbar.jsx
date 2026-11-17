import React, { useState, useRef, useEffect } from 'react';
import { 
  Sun, Moon, Sparkles, 
  User, LogOut, Users, Shield, KeyRound, CheckCircle2, WifiOff 
} from 'lucide-react';

export default function Navbar({ 
  isDark, 
  onToggleTheme, 
  onResetHome,
  interactiveParticles = true,
  onToggleInteractive,
  interfaceMode = 'standard',
  onSwitchToKids,
  activeUser = null,
  onSwitchProfile = null,
  isOnline = true,
  onOpenOfflineGame = null
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full border-b border-slate-200 dark:border-indigo-500/20 bg-white/95 dark:bg-[#090b1e]/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Google / Brand Identity */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          onClick={onResetHome}
          title="Return to Home"
        >
          <img 
            src="/vellox-logo.png" 
            alt="velloX" 
            className="w-7 h-7 rounded-full object-cover ring-1.5 ring-cyan-500/40 shadow-md group-hover:scale-105 transition-transform" 
          />
          <div className="flex items-center gap-1 font-sans text-2xl font-bold tracking-tight">
            <span className="text-[#4285F4]">v</span>
            <span className="text-[#EA4335]">e</span>
            <span className="text-[#FBBC05]">l</span>
            <span className="text-[#4285F4]">l</span>
            <span className="text-[#34A853]">o</span>
            <span className="text-[#EA4335]">X</span>
          </div>
        </div>

        {/* Actions: Kids Mode, Particles, Theme, and Profile Security Pill */}
        <div className="flex items-center gap-2.5">
          {/* Kids Mode / Parental Control Switch */}
          <button
            onClick={onSwitchToKids}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-sm hover:shadow-md hover:scale-105 active:scale-95 ${
              interfaceMode === 'kids'
                ? 'bg-amber-500 text-white border-amber-400 ring-2 ring-amber-300'
                : 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-white border-amber-300/40'
            }`}
            title="Switch to Kids Mode with Strict Parental Control"
          >
            <span className="text-sm">🎈</span>
            <span className="font-extrabold tracking-tight">Kids Mode</span>
            <span className="hidden lg:inline text-[9px] bg-black/20 px-1.5 py-0.5 rounded-full font-mono uppercase tracking-wider">
              Parental Control
            </span>
          </button>

          {/* Particle Effects Toggle Button */}
          <button
            onClick={onToggleInteractive}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
              interactiveParticles
                ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/60 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'bg-slate-100 dark:bg-[#303134] border border-slate-200 dark:border-[#5f6368] text-slate-500 dark:text-slate-400'
            }`}
            title="Toggle Ambient Canvas & Particle Tracing"
          >
            <Sparkles className={`w-3.5 h-3.5 ${interactiveParticles ? 'text-blue-500 animate-pulse' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Effects:</span>
            <span className="font-bold">{interactiveParticles ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={onToggleTheme}
            id="theme-toggle-btn"
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-[#303134] border border-slate-200 dark:border-[#5f6368] text-slate-600 dark:text-[#e8eaed] transition-colors"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            type="button"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* User Profile Security Pill & Dropdown */}
          {activeUser && (
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full text-xs font-medium transition-all border shadow-xs hover:shadow-md cursor-pointer ${
                  activeUser.isGuest
                    ? 'bg-slate-100 dark:bg-[#303134] border-slate-300 dark:border-[#5f6368] text-slate-700 dark:text-slate-300'
                    : 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                }`}
                title="Manage active security session & profile"
              >
                {activeUser.isGuest ? (
                  <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <User className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-tr ${activeUser.color || 'from-amber-500 to-orange-600'} flex items-center justify-center text-white font-bold text-xs shadow-xs`}>
                    {activeUser.initial || activeUser.name?.charAt(0) || 'U'}
                  </div>
                )}

                <span className="font-semibold text-xs truncate max-w-[85px] sm:max-w-[110px]">
                  {activeUser.name}
                </span>

                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  activeUser.isGuest
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    : 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300'
                }`}>
                  {activeUser.isGuest ? 'Guest' : 'Main'}
                </span>
              </button>

              {/* Profile Menu Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#282a30] border border-slate-200 dark:border-slate-700 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* User Profile Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/80">
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${activeUser.color || 'from-amber-500 to-orange-600'} flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0`}>
                      {activeUser.isGuest ? <User className="w-5 h-5 text-white" /> : (activeUser.initial || 'U')}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate">
                        {activeUser.fullName || activeUser.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {activeUser.subtitle || (activeUser.isGuest ? 'Guest Sandbox Session' : 'Verified Profile')}
                      </p>
                    </div>
                  </div>

                  {/* Security Session Details */}
                  <div className="py-3 text-xs space-y-2 font-mono">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span>Encryption:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        AES-256 E2EE
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span>Access Level:</span>
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">
                        {activeUser.isGuest ? 'Ephemeral Guest' : 'Full Workspace'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span>Session:</span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {activeUser.isGuest ? 'No logs stored' : 'Authenticated'}
                      </span>
                    </div>
                  </div>

                  {/* Actions: Switch Profile & Lock Session */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80 flex flex-col gap-1.5">
                    {onSwitchProfile && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          onSwitchProfile();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
                      >
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        <span>Switch User Profile</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        if (onSwitchProfile) onSwitchProfile();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Lock & Switch Profile</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
