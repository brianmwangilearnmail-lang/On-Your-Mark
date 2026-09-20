import React from 'react';
import { BookOpen, Flame, Search, Settings, Sparkles, BookmarkCheck, HelpCircle } from 'lucide-react';
import { UserStats } from '../types';

interface HeaderProps {
  activeTab: 'roadmap' | 'journal' | 'search';
  setActiveTab: (tab: 'roadmap' | 'journal' | 'search') => void;
  stats: UserStats;
  totalModules: number;
  completedCount: number;
  onOpenSettings: () => void;
  onOpenTutorial?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  stats,
  totalModules,
  completedCount,
  onOpenSettings,
  onOpenTutorial,
}) => {
  const progressPercent = Math.round((completedCount / (totalModules || 1)) * 100);

  return (
    <header className="sticky top-0 z-40 bg-[#1CB0F6] border-b-4 border-black/10 text-white shadow-md w-full max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
            onClick={() => setActiveTab('roadmap')}
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-white rounded-xl sm:rounded-2xl shadow-[0_3px_0_0_rgba(0,0,0,0.1)] flex items-center justify-center text-[#FFC800] group-hover:scale-105 active:scale-95 transition-all shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3] text-[#1CB0F6]" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="font-black text-base sm:text-lg lg:text-xl tracking-tight text-white uppercase leading-none group-hover:text-amber-200 transition-colors">
                  ON YOUR MARK
                </h1>
              </div>
              <p className="text-[10px] sm:text-[11px] text-white/90 font-bold uppercase tracking-wider hidden md:block mt-0.5 leading-none">
                By Benjamin Kasankya
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs (Visible on large screens) */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-[#189AD6] p-1.5 rounded-2xl border-2 border-black/10 shrink-0">
            <button
              id="nav-roadmap-btn"
              onClick={() => setActiveTab('roadmap')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'roadmap'
                  ? 'bg-white text-[#1CB0F6] shadow-[0_3px_0_0_rgba(0,0,0,0.1)] scale-102'
                  : 'text-white/90 hover:text-white hover:bg-white/20'
              }`}
            >
              <Sparkles className="w-4 h-4 stroke-[3]" />
              Learning Path
            </button>

            <button
              id="nav-journal-btn"
              onClick={() => setActiveTab('journal')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'journal'
                  ? 'bg-white text-[#1CB0F6] shadow-[0_3px_0_0_rgba(0,0,0,0.1)] scale-102'
                  : 'text-white/90 hover:text-white hover:bg-white/20'
              }`}
            >
              <BookmarkCheck className="w-4 h-4 stroke-[3]" />
              Journal
            </button>

            <button
              id="nav-search-btn"
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'search'
                  ? 'bg-white text-[#1CB0F6] shadow-[0_3px_0_0_rgba(0,0,0,0.1)] scale-102'
                  : 'text-white/90 hover:text-white hover:bg-white/20'
              }`}
            >
              <Search className="w-4 h-4 stroke-[3]" />
              Search
            </button>
          </nav>

          {/* Right Status Controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Streak Counter */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-[#FFC800] text-[#4B4B4B] rounded-xl sm:rounded-2xl border-b-4 border-black/10 font-black text-[10px] sm:text-xs shadow-xs whitespace-nowrap">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF4B4B] fill-[#FF4B4B] animate-bounce shrink-0" />
              <span className="hidden sm:inline">{stats.streakDays} DAY STREAK</span>
              <span className="sm:hidden">{stats.streakDays}d</span>
            </div>

            {/* Overall Progress */}
            <div className="hidden md:flex items-center gap-2 bg-white/20 px-3 py-2 rounded-2xl border border-white/30 text-xs font-black whitespace-nowrap">
              <div className="w-12 sm:w-14 bg-white/40 rounded-full h-2.5 overflow-hidden p-0.5 border border-white/50">
                <div 
                  className="bg-[#58CC02] h-full rounded-full transition-all duration-500 shadow-inner"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-white text-[11px]">{progressPercent}%</span>
            </div>

            {/* Tutorial Button */}
            {onOpenTutorial && (
              <button
                id="header-tutorial-btn"
                onClick={onOpenTutorial}
                className="p-1.5 sm:p-2 bg-amber-400 hover:bg-amber-300 text-amber-950 rounded-xl sm:rounded-2xl border border-amber-500/30 transition-all active:scale-95 shrink-0 shadow-xs"
                title="App Tutorial & Guide"
              >
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </button>
            )}

            {/* Settings Button */}
            <button
              id="header-settings-btn"
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl sm:rounded-2xl border border-white/30 transition-all active:scale-95 shrink-0 shadow-xs"
              title="Reader Settings"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              <span className="text-xs font-black uppercase tracking-wider hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Bar (Visible on screens smaller than lg) */}
      <div className="lg:hidden flex items-center justify-around border-t-2 border-black/10 bg-[#189AD6] px-1 py-1.5 text-xs font-black uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2 px-3 py-1 rounded-xl transition-all ${activeTab === 'roadmap' ? 'bg-white text-[#1CB0F6] shadow-sm' : 'text-white/90 hover:text-white'}`}
        >
          <Sparkles className="w-4 h-4 stroke-[3]" />
          <span className="text-[10px] sm:text-xs">Path</span>
        </button>
        <button
          onClick={() => setActiveTab('journal')}
          className={`flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2 px-3 py-1 rounded-xl transition-all ${activeTab === 'journal' ? 'bg-white text-[#1CB0F6] shadow-sm' : 'text-white/90 hover:text-white'}`}
        >
          <BookmarkCheck className="w-4 h-4 stroke-[3]" />
          <span className="text-[10px] sm:text-xs">Journal</span>
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2 px-3 py-1 rounded-xl transition-all ${activeTab === 'search' ? 'bg-white text-[#1CB0F6] shadow-sm' : 'text-white/90 hover:text-white'}`}
        >
          <Search className="w-4 h-4 stroke-[3]" />
          <span className="text-[10px] sm:text-xs">Search</span>
        </button>
      </div>
    </header>
  );
};
