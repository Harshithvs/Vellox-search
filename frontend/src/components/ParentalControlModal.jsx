import React, { useState } from 'react';
import { ShieldCheck, Lock, Unlock, KeyRound, AlertCircle, X } from 'lucide-react';
import MonkeyAvatar from './MonkeyAvatar';

export default function ParentalControlModal({
  isOpen,
  onClose,
  onUnlockSuccess
}) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const correctPassword = '1234';

  if (!isOpen) return null;

  // Eyes close with hands only while entering password; otherwise eyes stay open
  const isEntering = isFocused && password.length > 0;
  const isCovering = isEntering && !isSuccess;

  const handleVerify = (e) => {
    e.preventDefault();
    if (password.trim() === correctPassword) {
      setError('');
      setIsSuccess(true);
      setTimeout(() => {
        setPassword('');
        setIsSuccess(false);
        onUnlockSuccess();
      }, 650);
    } else {
      setError('Incorrect password. (Default parent password is 1234)');
    }
  };

  const handleClose = () => {
    setError('');
    setPassword('');
    setIsFocused(false);
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-[#202124] rounded-3xl border border-slate-200 dark:border-[#3c4043] shadow-2xl p-6 relative overflow-hidden transition-all"
        role="dialog"
        aria-modal="true"
      >
        {/* Playful Gradient Top Header Glow */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-500" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          type="button"
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-[#303134] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          title="Stay in Kids Mode"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Parent Verification Gate
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                Active
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter parent password to exit Kids Space and return to normal mode.
            </p>
          </div>
        </div>

        {/* Animated Monkey Avatar Section (No text captions) */}
        <div className="flex flex-col items-center justify-center my-2">
          <MonkeyAvatar
            isCovering={isCovering}
            hasError={Boolean(error)}
            isSuccess={isSuccess}
            className="w-28 h-28"
          />
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="bg-slate-50 dark:bg-[#181a1f] p-4 rounded-2xl border border-slate-200 dark:border-[#3c4043]">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-2">
              Enter Parent Password:
            </label>
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="password"
                value={password}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter password (e.g. 1234)"
                className="flex-1 px-4 py-2 rounded-xl bg-white dark:bg-[#202124] border border-slate-300 dark:border-[#5f6368] text-slate-900 dark:text-white font-mono tracking-widest text-center text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Default password is <strong className="text-slate-600 dark:text-slate-200 font-mono">1234</strong>
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-[#5f6368] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#303134] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02]"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Exit Kids Mode</span>
            </button>
          </div>
        </form>

        {/* Guardrail Policy Info */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-[#3c4043]/60 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Strict G/TV-Y7 Rating Enforced
          </span>
          <span>Kids Safe Engine v2.0</span>
        </div>
      </div>
    </div>
  );
}

