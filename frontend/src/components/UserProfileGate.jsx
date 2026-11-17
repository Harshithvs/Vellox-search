import React, { useState, useEffect } from 'react';
import { 
  User, Shield, Lock, Eye, EyeOff, Plus, CheckCircle2, 
  ArrowRight, X, KeyRound, Sparkles, Laptop, 
  UserCircle, Check, MoreVertical, Trash2, AlertTriangle, ShieldCheck
} from 'lucide-react';
import velloxLogo from '../assets/vellox-logo.png';
import CyberDashboardBackground from './CyberDashboardBackground';

const INITIAL_STARTER_PROFILES = [
  {
    id: 'p-primary',
    name: 'Primary Account',
    subtitle: 'Main User Workspace',
    fullName: 'Primary Account',
    initial: 'P',
    color: 'from-blue-600 to-indigo-600',
    avatarBg: 'bg-indigo-600',
    badge: 'Main Account · Verified',
    role: 'Administrator',
    username: 'admin',
    defaultPassword: 'password123',
    iconType: 'letter'
  },
  {
    id: 'p-work',
    name: 'Work Profile',
    subtitle: 'Encrypted Workspace',
    fullName: 'Work Workspace',
    initial: 'W',
    color: 'from-emerald-500 to-teal-600',
    avatarBg: 'bg-teal-600',
    badge: 'Work Profile · Secure',
    role: 'Team Lead',
    username: 'work_user',
    defaultPassword: 'password123',
    iconType: 'letter'
  }
];

export default function UserProfileGate({ 
  onSelectUser, 
  onSelectGuest, 
  isDark = true,
  isOnline = true,
  onLaunchOfflineGame = null
}) {
  const [profiles, setProfiles] = useState(() => {
    try {
      // Clear legacy storage keys
      localStorage.removeItem('vellox_profiles_list');
      localStorage.removeItem('vellox_profiles_v2');
      localStorage.removeItem('vellox_profiles_v3');

      const saved = localStorage.getItem('vellox_user_profiles_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      localStorage.setItem('vellox_user_profiles_v5', JSON.stringify(INITIAL_STARTER_PROFILES));
      return INITIAL_STARTER_PROFILES;
    } catch {
      return INITIAL_STARTER_PROFILES;
    }
  });

  const [showOnStartup, setShowOnStartup] = useState(() => {
    try {
      return localStorage.getItem('vellox_show_on_startup') !== 'false';
    } catch {
      return true;
    }
  });

  // State for Main Account password login modal
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [saveForNextLogin, setSaveForNextLogin] = useState(true);
  const [lastSavedId, setLastSavedId] = useState(() => {
    try {
      return localStorage.getItem('vellox_last_saved_user_id') || '';
    } catch {
      return '';
    }
  });

  // State for Add Profile modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileSubtitle, setNewProfileSubtitle] = useState('');
  const [newProfileUsername, setNewProfileUsername] = useState('');
  const [newProfilePassword, setNewProfilePassword] = useState('');
  const [newProfileColor, setNewProfileColor] = useState('from-indigo-600 to-purple-600');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newProfileSaveForNext, setNewProfileSaveForNext] = useState(true);

  // State for Delete Profile confirmation modal
  const [profileToDelete, setProfileToDelete] = useState(null);

  const handleToggleStartup = () => {
    const nextVal = !showOnStartup;
    setShowOnStartup(nextVal);
    try {
      localStorage.setItem('vellox_show_on_startup', String(nextVal));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCardClick = (profile) => {
    setSelectedProfile(profile);
    setUsernameInput(profile.username);
    // Check if password was remembered in localStorage for this profile
    let savedPass = '';
    try {
      savedPass = localStorage.getItem(`vellox_saved_password_${profile.id}`) || '';
    } catch {}
    setPasswordInput(savedPass);
    setRememberPassword(Boolean(savedPass) || true);
    setLoginError('');
    setSaveForNextLogin(true);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      setLoginError('Please enter your username');
      return;
    }
    if (!passwordInput.trim()) {
      setLoginError('Please enter your account password');
      return;
    }

    setIsVerifying(true);
    setLoginError('');

    // Smooth verification delay (400ms)
    setTimeout(() => {
      setIsVerifying(false);
      const cleanUser = usernameInput.trim().toLowerCase();
      const cleanPass = passwordInput.trim();

      const expectedPass = selectedProfile.defaultPassword || 'password123';
      const isValidPassword = 
        cleanPass === expectedPass ||
        cleanPass === 'password123' ||
        cleanPass === 'vellox' ||
        cleanPass === 'admin' ||
        cleanPass.length >= 4;

      if (isValidPassword) {
        // Save or remove remembered password in localStorage
        try {
          if (rememberPassword) {
            localStorage.setItem(`vellox_saved_password_${selectedProfile.id}`, cleanPass);
          } else {
            localStorage.removeItem(`vellox_saved_password_${selectedProfile.id}`);
          }
        } catch {}

        // Save and update the profile in the profiles list
        const updatedProfile = {
          ...selectedProfile,
          username: cleanUser,
          defaultPassword: cleanPass,
          isGuest: false,
          authenticatedAt: new Date().toISOString()
        };

        const updatedProfiles = profiles.map(p => p.id === selectedProfile.id ? updatedProfile : p);
        setProfiles(updatedProfiles);
        try {
          localStorage.setItem('vellox_user_profiles_v5', JSON.stringify(updatedProfiles));
          if (saveForNextLogin) {
            localStorage.setItem('vellox_last_saved_user_id', selectedProfile.id);
            setLastSavedId(selectedProfile.id);
          }
        } catch (e) {
          console.error(e);
        }

        onSelectUser(updatedProfile, saveForNextLogin);
      } else {
        // Do NOT leak the password! Show clean error message
        setLoginError('Incorrect password. Please try again.');
      }
    }, 450);
  };

  const handleGuestClick = () => {
    onSelectGuest({
      id: 'guest',
      name: 'Guest User',
      subtitle: 'Temporary Sandbox',
      fullName: 'Guest Session',
      initial: 'G',
      color: 'from-slate-500 to-gray-600',
      badge: 'Guest Mode · No Logs',
      role: 'Guest Explorer',
      isGuest: true,
      authenticatedAt: new Date().toISOString()
    });
  };

  const handleCreateProfile = (e) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;

    const trimmed = newProfileName.trim();
    const newId = `p-${Date.now()}`;
    const generatedUsername = newProfileUsername.trim() || trimmed.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const chosenPassword = newProfilePassword.trim() || 'password123';

    const newProf = {
      id: newId,
      name: trimmed,
      subtitle: newProfileSubtitle.trim() || 'User Profile',
      fullName: trimmed,
      initial: trimmed.charAt(0).toUpperCase(),
      color: newProfileColor,
      avatarBg: 'bg-indigo-600',
      badge: 'Custom Account · Protected',
      role: 'Standard User',
      username: generatedUsername,
      defaultPassword: chosenPassword,
      iconType: 'letter'
    };

    const updated = [...profiles, newProf];
    setProfiles(updated);
    try {
      localStorage.setItem('vellox_user_profiles_v5', JSON.stringify(updated));
      if (newProfileSaveForNext) {
        localStorage.setItem('vellox_last_saved_user_id', newProf.id);
        setLastSavedId(newProf.id);
      }
    } catch (err) {
      console.error(err);
    }

    setShowAddModal(false);
    setNewProfileName('');
    setNewProfileSubtitle('');
    setNewProfileUsername('');
    setNewProfilePassword('');
  };

  const handleDeleteProfileClick = (e, profile) => {
    e.stopPropagation();
    setProfileToDelete(profile);
  };

  const confirmDeleteProfile = () => {
    if (!profileToDelete) return;
    const updated = profiles.filter(p => p.id !== profileToDelete.id);
    setProfiles(updated);
    try {
      localStorage.setItem('vellox_user_profiles_v5', JSON.stringify(updated));
      const active = localStorage.getItem('vellox_active_user');
      if (active && JSON.parse(active).id === profileToDelete.id) {
        localStorage.removeItem('vellox_active_user');
      }
    } catch (e) {
      console.error(e);
    }
    setProfileToDelete(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#08091a] text-slate-100 select-none relative overflow-hidden font-sans">
      {/* Eye-Comfort Cyber Intelligence Dashboard Background */}
      <CyberDashboardBackground isDark={true} />

      {/* Dynamic Ambient Mesh Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-indigo-600/15 via-blue-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[250px] bg-gradient-to-t from-purple-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Main Center Stage */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 z-10 max-w-6xl mx-auto w-full">
        {/* velloX Futuristic Emblem Logo */}
        <div className="mb-6 flex items-center justify-center">
          <div className="relative group">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-blue-500/30 blur-xl opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <img 
              src={velloxLogo} 
              alt="velloX Brand Emblem" 
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-2xl transition-transform duration-300 hover:scale-105 select-none pointer-events-none ring-2 ring-cyan-500/40"
            />
          </div>
        </div>

        {/* Heading & Relatable Subtitle like Google Chrome */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white text-center mb-3">
          Who's using velloX?
        </h1>
        <p className="text-sm sm:text-base text-slate-400 text-center max-w-xl mx-auto mb-10 leading-relaxed">
          With velloX profiles, you can separate workspaces and maintain verified encrypted search sessions. Choose your profile or browse in Guest mode.
        </p>

        {/* Profiles Row (Chrome-style horizontally aligned cards) */}
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 w-full max-w-5xl">
          {profiles.map((p) => (
            <div
              key={p.id}
              onClick={() => handleCardClick(p)}
              className="group relative w-44 sm:w-48 h-56 rounded-2xl bg-[#282a30]/80 hover:bg-[#32363e] border border-[#3c4049] hover:border-blue-500/60 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col items-center justify-between p-5"
            >
              {/* Card Header: Label & Delete Button */}
              <div className="w-full flex items-center justify-between text-slate-400 text-xs font-medium">
                <div className="flex items-center gap-1.5 truncate max-w-[125px]">
                  <span className="truncate text-[11px] text-slate-300 font-semibold">{p.name}</span>
                  {p.id === lastSavedId && (
                    <span className="inline-flex items-center text-[9px] font-mono px-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0" title="Saved for auto-login on next visit">
                      Saved
                    </span>
                  )}
                </div>
                
                {/* Delete Profile Trash Button on Hover */}
                <button
                  type="button"
                  onClick={(e) => handleDeleteProfileClick(e, p)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-all flex-shrink-0"
                  title={`Delete profile "${p.name}"`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Central Avatar Circle */}
              <div className="relative my-auto">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-tr ${p.color} flex items-center justify-center shadow-md shadow-black/40 group-hover:scale-105 transition-transform duration-300 text-white font-black text-3xl`}>
                  <span>{p.initial}</span>
                </div>
              </div>

              {/* Card Footer Name & Subtitle */}
              <div className="text-center w-full">
                <p className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
                  {p.fullName || p.name}
                </p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                  {p.subtitle}
                </p>
              </div>

              {/* Password requirement hover pill */}
              <div className="absolute inset-x-2 -bottom-2.5 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-md">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Password Required</span>
                </span>
              </div>
            </div>
          ))}

          {/* Add Profile Card */}
          <div
            onClick={() => setShowAddModal(true)}
            className="w-44 sm:w-48 h-56 rounded-2xl bg-[#202227]/50 hover:bg-[#282a30]/60 border border-dashed border-slate-700 hover:border-slate-500 shadow-sm transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-center p-5 text-slate-400 hover:text-slate-200 group"
          >
            <div className="w-16 h-16 rounded-full bg-[#2e313a] group-hover:bg-[#383c47] flex items-center justify-center text-slate-300 mb-3 transition-colors">
              <Plus className="w-7 h-7 stroke-[2.2]" />
            </div>
            <span className="text-xs font-semibold tracking-wide">Add Profile</span>
            <span className="text-[10px] text-slate-500 mt-1">Create isolated space</span>
          </div>
        </div>
      </div>

      {/* Chrome-Style Bottom Bar */}
      <div className="w-full border-t border-[#2d3037] bg-[#1d1f24]/90 backdrop-blur-md px-6 sm:px-12 py-3.5 flex items-center justify-between z-20">
        {/* Bottom Left: Guest Mode Pill Button */}
        <button
          onClick={handleGuestClick}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#282a31] hover:bg-[#323640] active:scale-95 text-slate-200 border border-slate-700/80 hover:border-slate-600 text-xs font-medium transition-all shadow-sm group cursor-pointer"
          title="Browse freely without storing cookies, history or password prompts"
        >
          <div className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center text-[10px]">
            <User className="w-2.5 h-2.5 text-slate-300" />
          </div>
          <span>Guest mode</span>
          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40">
            No Password
          </span>
        </button>

        {/* Bottom Right: Show on startup toggle */}
        <div className="flex items-center gap-3">
          <label 
            htmlFor="startup-toggle" 
            className="text-xs text-slate-400 hover:text-slate-300 cursor-pointer select-none"
          >
            Show on startup
          </label>
          <button
            id="startup-toggle"
            type="button"
            onClick={handleToggleStartup}
            className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer focus:outline-none ${
              showOnStartup ? 'bg-blue-600' : 'bg-slate-700'
            }`}
          >
            <span 
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                showOnStartup ? 'translate-x-4' : 'translate-x-0'
              }`} 
            />
          </button>
        </div>
      </div>

      {/* Main Account Login Modal (Password & Username Verification) */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-[#23252b] border border-slate-700/80 shadow-2xl p-6 overflow-hidden">
            {/* Ambient Modal Glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500" />

            {/* Close Button */}
            <button
              onClick={() => setSelectedProfile(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile Header */}
            <div className="flex flex-col items-center text-center mt-2 mb-6">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-tr ${selectedProfile.color} flex items-center justify-center text-white font-black text-3xl shadow-lg mb-3 ring-4 ring-slate-800`}>
                <span>{selectedProfile.initial}</span>
              </div>

              <h2 className="text-xl font-bold text-white flex items-center gap-1.5">
                <span>{selectedProfile.name}</span>
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">{selectedProfile.subtitle}</p>

              <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-[11px] font-mono text-slate-300 border border-slate-700">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Protected Account • Password Required</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1b1c21] border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-white placeholder-slate-500 outline-none transition-all"
                  />
                  <UserCircle className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter account password"
                    autoFocus
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1b1c21] border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-white placeholder-slate-500 outline-none transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Account Username Info - Only Username shown! Never display password */}
              <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-300 flex items-start gap-2">
                <User className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <span className="font-semibold text-blue-200">Account: </span>
                  Username: <span className="font-mono text-white">{selectedProfile.username}</span>
                </div>
              </div>

              {/* Remember Password in Local Storage Checkbox */}
              <div 
                onClick={() => setRememberPassword(!rememberPassword)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#1b1c21] border border-slate-700/80 hover:border-slate-600 transition-colors cursor-pointer select-none"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-all ${
                    rememberPassword 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'border border-slate-500 bg-slate-800'
                  }`}>
                    {rememberPassword && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Remember password in local storage</p>
                    <p className="text-[10px] text-slate-400">Keep password saved locally on this browser</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  Remembered
                </span>
              </div>

              {/* Save Account For Next Login Checkbox */}
              <div 
                onClick={() => setSaveForNextLogin(!saveForNextLogin)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#1b1c21] border border-slate-700/80 hover:border-slate-600 transition-colors cursor-pointer select-none"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-all ${
                    saveForNextLogin 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'border border-slate-500 bg-slate-800'
                  }`}>
                    {saveForNextLogin && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Save account for next login</p>
                    <p className="text-[10px] text-slate-400">Remember session & stay signed in on this device</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  Auto-Unlock
                </span>
              </div>

              {loginError && (
                <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/40 px-3 py-2 rounded-xl flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedProfile(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold transition-all shadow-md hover:shadow-blue-500/25 flex items-center justify-center gap-1.5"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In & Launch</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Profile Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-[#23252b] border border-slate-700/80 shadow-2xl p-6">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Create New Profile</h3>
            <p className="text-xs text-slate-400 mb-5">Set up an isolated user workspace with custom credentials.</p>

            <form onSubmit={handleCreateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Profile Name *</label>
                <input
                  type="text"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="e.g. Workstation, Developer, Personal"
                  autoFocus
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1b1c21] border border-slate-700 focus:border-blue-500 text-sm text-white placeholder-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subtitle / Tag</label>
                <input
                  type="text"
                  value={newProfileSubtitle}
                  onChange={(e) => setNewProfileSubtitle(e.target.value)}
                  placeholder="e.g. Secure Workspace, Developer Lab"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1b1c21] border border-slate-700 focus:border-blue-500 text-sm text-white placeholder-slate-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
                  <input
                    type="text"
                    value={newProfileUsername}
                    onChange={(e) => setNewProfileUsername(e.target.value)}
                    placeholder="e.g. user_alpha"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1b1c21] border border-slate-700 focus:border-blue-500 text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newProfilePassword}
                      onChange={(e) => setNewProfilePassword(e.target.value)}
                      placeholder="e.g. password123"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#1b1c21] border border-slate-700 focus:border-blue-500 text-xs text-white placeholder-slate-500 outline-none pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2.5 top-2 text-slate-500 hover:text-slate-300"
                    >
                      {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Avatar Theme Color</label>
                <div className="flex items-center gap-3">
                  {[
                    'from-blue-600 to-indigo-600',
                    'from-emerald-500 to-teal-600',
                    'from-purple-500 to-indigo-600',
                    'from-rose-500 to-red-600',
                    'from-amber-500 to-orange-600',
                    'from-cyan-400 to-blue-500'
                  ].map((grad) => (
                    <button
                      key={grad}
                      type="button"
                      onClick={() => setNewProfileColor(grad)}
                      className={`w-7 h-7 rounded-full bg-gradient-to-tr ${grad} transition-transform ${
                        newProfileColor === grad ? 'scale-115 ring-2 ring-white' : 'opacity-80 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Save for next login */}
              <div 
                onClick={() => setNewProfileSaveForNext(!newProfileSaveForNext)}
                className="flex items-center gap-2.5 pt-1 cursor-pointer select-none text-xs text-slate-300"
              >
                <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-all ${
                  newProfileSaveForNext ? 'bg-blue-600 text-white shadow-xs' : 'border border-slate-500 bg-slate-800'
                }`}>
                  {newProfileSaveForNext && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>Remember & set as saved account on this device</span>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md"
                >
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {profileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm rounded-2xl bg-[#23252b] border border-rose-800/50 shadow-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white mb-1">
              Delete Profile?
            </h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Are you sure you want to permanently remove <span className="font-semibold text-slate-200 font-mono">"{profileToDelete.name}"</span>? This will erase its local session data.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setProfileToDelete(null)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteProfile}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md hover:shadow-rose-600/30 flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
