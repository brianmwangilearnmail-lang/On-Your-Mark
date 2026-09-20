import React from 'react';
import { ThemeMode, FontFamily } from '../types';
import { Settings, Sun, Moon, RotateCcw, X, HelpCircle, Check, Sparkles } from 'lucide-react';
import { db } from '../db/db';
import { getThemeStyles } from '../utils/theme';
import { useBodyScrollLock } from '../utils/useBodyScrollLock';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
  setThemeMode: (theme: ThemeMode) => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  onProgressReset: () => void;
  onOpenTutorial?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  themeMode,
  setThemeMode,
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize,
  onProgressReset,
  onOpenTutorial
}) => {
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const theme = getThemeStyles(themeMode);

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset all reading progress and saved reflections? This action cannot be undone.')) {
      await db.progress.clear();
      await db.reflections.clear();
      await db.bookmarks.clear();
      await db.stats.clear();
      onProgressReset();
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs font-sans animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`relative w-full max-w-md ${theme.cardBg} border-2 ${theme.cardBorder} border-b-8 border-[#1CB0F6] rounded-3xl p-5 sm:p-7 ${theme.headingText} shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto my-auto`}>
        
        {/* Header Bar */}
        <div className={`flex items-center justify-between border-b-2 ${theme.borderClass} pb-4`}>
          <div className="flex items-center gap-2.5 text-[#1CB0F6] font-black text-lg">
            <Settings className="w-5 h-5 stroke-[3]" />
            <span>Reading & Display Settings</span>
          </div>
          <button
            onClick={onClose}
            className={`p-2 ${theme.mutedText} hover:${theme.headingText} rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/10`}
            title="Close Settings"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Theme Picker */}
        <div className="space-y-2.5">
          <label className="text-xs font-black uppercase tracking-widest text-[#1CB0F6] block">
            Reading Mode & Color Canvas
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setThemeMode('dark')}
              className={`p-3 rounded-2xl border-2 text-xs font-black uppercase tracking-wider flex flex-col items-center gap-1.5 transition-all relative ${
                themeMode === 'dark'
                  ? 'bg-[#1CB0F6] text-white border-[#189AD6] border-b-4 shadow-sm'
                  : `${theme.cardBg} ${theme.borderClass} ${theme.mutedText} hover:opacity-80`
              }`}
            >
              <Moon className="w-4 h-4 stroke-[3]" />
              <span>Dark</span>
              {themeMode === 'dark' && <Check className="w-3.5 h-3.5 absolute top-1.5 right-1.5 stroke-[3]" />}
            </button>

            <button
              onClick={() => setThemeMode('sepia')}
              className={`p-3 rounded-2xl border-2 text-xs font-black uppercase tracking-wider flex flex-col items-center gap-1.5 transition-all relative ${
                themeMode === 'sepia'
                  ? 'bg-[#FFC800] text-amber-950 border-[#E0A800] border-b-4 shadow-sm'
                  : 'bg-[#FFFBEB] border-[#E5E5E5] text-amber-900'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-800 stroke-[3]" />
              <span>Warm Sepia</span>
              {themeMode === 'sepia' && <Check className="w-3.5 h-3.5 absolute top-1.5 right-1.5 stroke-[3]" />}
            </button>

            <button
              onClick={() => setThemeMode('light')}
              className={`p-3 rounded-2xl border-2 text-xs font-black uppercase tracking-wider flex flex-col items-center gap-1.5 transition-all relative ${
                themeMode === 'light'
                  ? 'bg-[#58CC02] text-white border-[#3B8702] border-b-4 shadow-sm'
                  : `${theme.cardBg} ${theme.borderClass} ${theme.mutedText} hover:opacity-80`
              }`}
            >
              <Sun className="w-4 h-4 stroke-[3]" />
              <span>Pure Light</span>
              {themeMode === 'light' && <Check className="w-3.5 h-3.5 absolute top-1.5 right-1.5 stroke-[3]" />}
            </button>
          </div>
        </div>

        {/* Font Family Selector */}
        <div className="space-y-2.5">
          <label className="text-xs font-black uppercase tracking-widest text-[#1CB0F6] block">
            Typography Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setFontFamily('serif')}
              className={`p-3.5 rounded-2xl border-2 text-xs font-black font-serif transition-all flex items-center justify-between ${
                fontFamily === 'serif'
                  ? 'bg-[#1CB0F6] text-white border-[#189AD6] border-b-4 shadow-sm'
                  : `${theme.cardBg} ${theme.borderClass} ${theme.mutedText} hover:opacity-80`
              }`}
            >
              <span>Georgia Serif</span>
              {fontFamily === 'serif' && <Check className="w-4 h-4 stroke-[3]" />}
            </button>
            <button
              onClick={() => setFontFamily('sans')}
              className={`p-3.5 rounded-2xl border-2 text-xs font-black font-sans transition-all flex items-center justify-between ${
                fontFamily === 'sans'
                  ? 'bg-[#1CB0F6] text-white border-[#189AD6] border-b-4 shadow-sm'
                  : `${theme.cardBg} ${theme.borderClass} ${theme.mutedText} hover:opacity-80`
              }`}
            >
              <span>Clean Sans-Serif</span>
              {fontFamily === 'sans' && <Check className="w-4 h-4 stroke-[3]" />}
            </button>
          </div>
        </div>

        {/* Font Size Adjuster & Live Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="uppercase tracking-widest text-[#1CB0F6]">Font Size</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#1CB0F6]/20 text-[#1CB0F6] font-mono font-bold">
              {fontSize}px
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFontSize(prev => Math.max(14, prev - 1))}
              className={`px-3.5 py-2.5 rounded-2xl ${theme.cardBg} border-2 ${theme.borderClass} border-b-4 text-[#1CB0F6] font-black text-sm active:translate-y-0.5 transition-all hover:bg-sky-50 dark:hover:bg-sky-950/40`}
              title="Decrease Font Size"
            >
              A-
            </button>
            <input
              type="range"
              min="14"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
              className="w-full accent-[#1CB0F6] cursor-pointer"
            />
            <button
              onClick={() => setFontSize(prev => Math.min(24, prev + 1))}
              className={`px-3.5 py-2.5 rounded-2xl ${theme.cardBg} border-2 ${theme.borderClass} border-b-4 text-[#1CB0F6] font-black text-sm active:translate-y-0.5 transition-all hover:bg-sky-50 dark:hover:bg-sky-950/40`}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Live Typography Preview Box */}
          <div className={`p-3.5 rounded-2xl ${theme.innerBox} border-2 ${theme.cardBorder} text-center space-y-1`}>
            <span className="text-[10px] font-black uppercase text-[#1CB0F6] tracking-wider block">Live Typography Preview</span>
            <p 
              className={`font-${fontFamily} ${theme.bodyText} leading-tight truncate`}
              style={{ fontSize: `${fontSize}px` }}
            >
              In the beginning was the Word...
            </p>
          </div>
        </div>

        {/* Reset Progress & Tutorial Section */}
        <div className={`pt-4 border-t-2 ${theme.borderClass} space-y-2.5`}>
          {onOpenTutorial && (
            <button
              onClick={() => {
                onClose();
                onOpenTutorial();
              }}
              className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-[#1CB0F6] hover:bg-[#189AD6] border-b-4 border-[#127bb0] active:border-b-0 active:translate-y-1 text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm"
            >
              <HelpCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Replay Onboarding Tutorial</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-[#FF4B4B] hover:bg-red-600 border-b-4 border-[#D03030] active:border-b-0 active:translate-y-1 text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm"
          >
            <RotateCcw className="w-4 h-4 stroke-[3]" />
            <span>Reset All Reading Progress & Reflections</span>
          </button>
        </div>
      </div>
    </div>
  );
};

