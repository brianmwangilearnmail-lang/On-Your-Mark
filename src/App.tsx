import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db/db';
import { bookData, allModules, getModuleByIdOrSlug } from './data/bookData';
import { Module, ModuleStatus, ThemeMode, FontFamily, UserStats } from './types';
import { Header } from './components/Header';
import { RoadmapView } from './components/RoadmapView';
import { ModuleReaderView } from './components/ModuleReaderView';
import { JournalView } from './components/JournalView';
import { SearchView } from './components/SearchView';
import { SettingsModal } from './components/SettingsModal';
import { TutorialOverlay } from './components/TutorialOverlay';
import { LandingPage } from './components/LandingPage';
import { AuthForms } from './components/AuthForms';

export default function App() {
  const [authMode, setAuthMode] = useState<'landing' | 'login' | 'signup'>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('oym_user_email');
  });

  const [activeTab, setActiveTab] = useState<'roadmap' | 'journal' | 'search' | 'reader'>('roadmap');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);

  // Check first time visit for tutorial
  useEffect(() => {
    const tutorialDone = localStorage.getItem('oym_tutorial_completed');
    if (!tutorialDone) {
      setIsTutorialOpen(true);
    }
  }, []);

  // Settings preferences state
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [fontFamily, setFontFamily] = useState<FontFamily>('sans');
  const [fontSize, setFontSize] = useState<number>(18);

  // Live progress records from IndexedDB
  const progressRecords = useLiveQuery(() => db.progress.toArray()) || [];
  const statsRecord = useLiveQuery(() => db.stats.get('main'));

  // Build reactive progress map
  const progressMap: Record<string, ModuleStatus> = {};
  
  // Set default: first module unlocked
  if (allModules.length > 0) {
    progressMap[allModules[0].id] = 'unlocked';
  }

  // Hydrate from DB
  progressRecords.forEach((rec) => {
    progressMap[rec.moduleId] = rec.status;
  });

  // Automatically unlock the next module if previous is completed
  for (let i = 0; i < allModules.length; i++) {
    const m = allModules[i];
    if (progressMap[m.id] === 'completed' && i + 1 < allModules.length) {
      const nextM = allModules[i + 1];
      if (!progressMap[nextM.id]) {
        progressMap[nextM.id] = 'unlocked';
      }
    }
  }

  const completedCount = Object.values(progressMap).filter(s => s === 'completed').length;

  const userStats: UserStats = {
    streakDays: statsRecord?.streakDays || 1,
    lastReadDate: statsRecord?.lastReadDate || new Date().toISOString().split('T')[0],
    totalMinutesRead: statsRecord?.totalMinutesRead || 15,
    completedModulesCount: completedCount
  };

  const handleSelectModule = (mod: Module) => {
    setSelectedModuleId(mod.id);
    setActiveTab('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentLookup = selectedModuleId ? getModuleByIdOrSlug(selectedModuleId) : undefined;

  // Sync html data-theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  // Global background styling based on theme
  const getAppBgClass = () => {
    switch (themeMode) {
      case 'sepia':
        return 'bg-[#FBF0D9] text-[#432C1C]';
      case 'dark':
        return 'bg-[#121E24] text-[#F8FAFC]';
      case 'light':
      default:
        return 'bg-[#F8FAF9] text-[#4B4B4B]';
    }
  };

  return (
    <>
      {!isAuthenticated ? (
        authMode === 'landing' ? (
          <LandingPage onNavigateToAuth={(mode) => setAuthMode(mode)} />
        ) : (
          <AuthForms 
            initialMode={authMode === 'login' ? 'login' : 'signup'} 
            onBack={() => setAuthMode('landing')}
            onSuccess={() => setIsAuthenticated(true)}
          />
        )
      ) : (
        <div className={`min-h-screen w-full max-w-full overflow-x-hidden ${getAppBgClass()} transition-colors duration-300 font-sans selection:bg-[#1CB0F6] selection:text-white`}>
      
      {/* Header bar (Visible on non-reader tabs or compact) */}
      {activeTab !== 'reader' && (
        <Header
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          stats={userStats}
          totalModules={allModules.length}
          completedCount={completedCount}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenTutorial={() => setIsTutorialOpen(true)}
        />
      )}

      {/* Main View Router */}
      <div className="pb-16">
        {activeTab === 'roadmap' && (
          <RoadmapView
            book={bookData}
            progressMap={progressMap}
            onSelectModule={handleSelectModule}
            themeMode={themeMode}
          />
        )}

        {activeTab === 'reader' && currentLookup && (
          <ModuleReaderView
            module={currentLookup.module}
            chapter={currentLookup.chapter}
            prevModule={currentLookup.prevModule}
            nextModule={currentLookup.nextModule}
            onBackToRoadmap={() => {
              setActiveTab('roadmap');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateModule={(target) => handleSelectModule(target)}
            themeMode={themeMode}
            setThemeMode={setThemeMode}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            fontSize={fontSize}
            setFontSize={setFontSize}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {activeTab === 'journal' && (
          <JournalView book={bookData} onSelectModule={handleSelectModule} themeMode={themeMode} />
        )}

        {activeTab === 'search' && (
          <SearchView
            book={bookData}
            onSelectModule={handleSelectModule}
            themeMode={themeMode}
          />
        )}
      </div>

      {/* Reader Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
        fontSize={fontSize}
        setFontSize={setFontSize}
        onProgressReset={() => {
          setSelectedModuleId(null);
          setActiveTab('roadmap');
        }}
        onOpenTutorial={() => setIsTutorialOpen(true)}
      />

      {/* Guided Onboarding Tutorial Overlay */}
      <TutorialOverlay
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        themeMode={themeMode}
      />
    </div>
      )}
    </>
  );
}
