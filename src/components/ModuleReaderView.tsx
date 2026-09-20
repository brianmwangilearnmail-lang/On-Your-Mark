import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Bookmark, 
  Type, 
  Sun, 
  Moon, 
  BookOpen,
  Sparkles,
  Save,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Edit3,
  Copy,
  Check,
  FileText,
  Settings,
  Trophy
} from 'lucide-react';
import { Module, Chapter, ThemeMode, FontFamily } from '../types';
import { getThemeStyles } from '../utils/theme';
import { useBodyScrollLock } from '../utils/useBodyScrollLock';
import { 
  getReflectionAnswersForModule, 
  saveReflectionAnswer, 
  saveModuleProgress, 
  addBookmark,
  removeBookmark,
  db
} from '../db/db';

interface ModuleReaderViewProps {
  module: Module;
  chapter: Chapter;
  prevModule?: Module;
  nextModule?: Module;
  onBackToRoadmap: () => void;
  onNavigateModule: (target: Module) => void;
  themeMode: ThemeMode;
  setThemeMode: (theme: ThemeMode) => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  onOpenSettings?: () => void;
}

export const ModuleReaderView: React.FC<ModuleReaderViewProps> = ({
  module,
  chapter,
  prevModule,
  nextModule,
  onBackToRoadmap,
  onNavigateModule,
  themeMode,
  setThemeMode,
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize,
  onOpenSettings,
}) => {
  const [activeSectionIdx, setActiveSectionIdx] = useState<number>(0);
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<number, string>>({});
  const [aiFeedback, setAiFeedback] = useState<Record<number, string>>({});
  const [loadingAiIdx, setLoadingAiIdx] = useState<number | null>(null);
  const [isSavedMap, setIsSavedMap] = useState<Record<number, boolean>>({});
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1);
  const [bookmarkedSections, setBookmarkedSections] = useState<Record<string, boolean>>({});
  const [copiedNote, setCopiedNote] = useState<boolean>(false);
  const [showFinalCompletionModal, setShowFinalCompletionModal] = useState<boolean>(false);

  useBodyScrollLock(showFinalCompletionModal);

  // Load existing reflections and bookmarks on module change
  useEffect(() => {
    async function loadData() {
      const savedAnswers = await getReflectionAnswersForModule(module.id);
      setReflectionAnswers(savedAnswers);
      setActiveSectionIdx(0);
      setAiFeedback({});

      const moduleBookmarks = await db.bookmarks.where('moduleId').equals(module.id).toArray();
      const bMap: Record<string, boolean> = {};
      moduleBookmarks.forEach(b => {
        bMap[b.sectionId] = true;
      });
      setBookmarkedSections(bMap);
    }
    loadData();

    // Set status to in_progress in DB
    saveModuleProgress(module.id, 'in_progress', 0);
  }, [module.id]);

  // Handle Text-To-Speech audio reading
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [module.id, activeSectionIdx]);

  const toggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const currentSection = module.sections[activeSectionIdx];
      if (!currentSection) return;

      const textToRead = `${currentSection.title}. ${currentSection.content}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = speechRate;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleAnswerChange = async (qIndex: number, text: string) => {
    setReflectionAnswers(prev => ({ ...prev, [qIndex]: text }));
    setIsSavedMap(prev => ({ ...prev, [qIndex]: false }));

    const questionText = module.reflectionQuestions?.[qIndex] || `Study Notes: ${module.title}`;
    await saveReflectionAnswer(module.id, qIndex, questionText, text);
    setIsSavedMap(prev => ({ ...prev, [qIndex]: true }));
  };

  const handleAskAiFeedback = async (qIndex: number) => {
    const response = reflectionAnswers[qIndex] || '';
    setLoadingAiIdx(qIndex);
    try {
      const promptContext = response.trim().length > 0 
        ? response 
        : `Please give me 3 inspiring reflection questions or key spiritual takeaways for the lesson "${module.title}".`;

      const res = await fetch('/api/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleTitle: module.title,
          question: module.reflectionQuestions?.[qIndex] || `Study Notes for ${module.title}`,
          userResponse: promptContext
        })
      });
      const data = await res.json();
      setAiFeedback(prev => ({ ...prev, [qIndex]: data.feedback || "Encouraging reflection!" }));
    } catch (err) {
      setAiFeedback(prev => ({ ...prev, [qIndex]: "Your reflection notes are saved! Meditating on God's Word yields enduring fruit." }));
    } finally {
      setLoadingAiIdx(null);
    }
  };

  const handleBookmarkCurrentSection = async () => {
    const currentSec = module.sections[activeSectionIdx];
    if (!currentSec) return;

    if (bookmarkedSections[currentSec.id]) {
      await removeBookmark(undefined, module.id, currentSec.id);
      setBookmarkedSections(prev => ({ ...prev, [currentSec.id]: false }));
    } else {
      await addBookmark(module.id, currentSec.id, currentSec.content.substring(0, 180) + "...");
      setBookmarkedSections(prev => ({ ...prev, [currentSec.id]: true }));
    }
  };

  const handleCompleteModule = async () => {
    // Fire confetti celebration
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.5 }
    });

    await saveModuleProgress(module.id, 'completed', module.sections.length - 1);

    if (nextModule) {
      setTimeout(() => {
        onNavigateModule(nextModule);
      }, 1200);
    } else {
      setShowFinalCompletionModal(true);
    }
  };

  const theme = getThemeStyles(themeMode);

  const currentSection = module.sections[activeSectionIdx];
  const progressPercent = Math.round(((activeSectionIdx + 1) / (module.sections.length || 1)) * 100);

  return (
    <div className={`min-h-screen transition-colors duration-300 font-${fontFamily} ${theme.appBg}`}>
      
      {/* Top Mini-Roadmap Header */}
      <div className="sticky top-0 z-30 bg-[#1CB0F6] border-b-4 border-black/10 px-3 sm:px-4 py-2.5 sm:py-3 shadow-md text-white font-sans">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <button
            id="reader-back-to-roadmap-btn"
            onClick={onBackToRoadmap}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-xs font-black uppercase tracking-wider border border-white/30 transition-all active:scale-95 shrink-0"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Path Roadmap</span>
          </button>

          {/* Module Title & Mini Progress Indicator */}
          <div className="flex-1 text-center min-w-0 px-2">
            <span className="text-[10px] sm:text-[11px] uppercase font-black tracking-wider text-[#FFC800] block truncate leading-tight">
              {chapter.title}
            </span>
            <h2 className="text-xs sm:text-sm font-black text-white truncate uppercase tracking-tight leading-tight mt-0.5">
              {module.title}
            </h2>
          </div>

          {/* Controls: Audio & Appearance */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              id="tts-toggle-btn"
              onClick={toggleAudio}
              className={`p-2 sm:p-2.5 rounded-2xl border border-white/30 transition-all active:scale-95 ${
                isPlayingAudio 
                  ? 'bg-[#FFC800] text-amber-950 border-white shadow-md animate-bounce' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              title={isPlayingAudio ? "Stop Narration" : "Listen to Section (Text-To-Speech)"}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4 stroke-[3]" /> : <Volume2 className="w-4 h-4 stroke-[3]" />}
            </button>

            <button
              id="reader-theme-toggle-btn"
              onClick={() => {
                if (themeMode === 'dark') setThemeMode('sepia');
                else if (themeMode === 'sepia') setThemeMode('light');
                else setThemeMode('dark');
              }}
              className="p-2 sm:p-2.5 bg-white/20 border border-white/30 rounded-2xl text-white hover:bg-white/30 transition-all active:scale-95"
              title="Toggle Theme (Dark / Sepia / Light)"
            >
              {themeMode === 'light' ? <Sun className="w-4 h-4 stroke-[3]" /> : <Moon className="w-4 h-4 stroke-[3]" />}
            </button>
          </div>
        </div>

        {/* Top Progress Bar */}
        <div className="max-w-4xl mx-auto mt-2 sm:mt-2.5">
          <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden p-0.5 border border-white/40">
            <div 
              className="bg-[#58CC02] h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-8 sm:space-y-10">
        
        {/* Module Header Card */}
        <div className={`border-b-2 ${theme.borderClass} pb-5 sm:pb-6 space-y-3`}>
          <div className="flex items-center justify-between gap-3 text-xs font-black text-[#1CB0F6] uppercase tracking-wider font-sans">
            <span className="shrink-0 bg-[#1CB0F6]/10 px-2.5 py-1 rounded-lg">Lesson {module.order}</span>
            <span className="shrink-0 bg-[#1CB0F6]/10 px-2.5 py-1 rounded-lg">Section {activeSectionIdx + 1} of {module.sections.length}</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-black ${theme.headingText} tracking-tight leading-snug sm:leading-tight break-words`}>
            {module.title}
          </h1>
          <p className={`text-xs sm:text-sm font-bold ${theme.mutedText} leading-relaxed font-sans`}>
            {module.description}
          </p>
        </div>

        {/* Verbatim Section Content Display */}
        {currentSection && (
          <motion.article 
            key={currentSection.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
            style={{ fontSize: `${fontSize}px` }}
          >
            <div className={`flex items-center justify-between gap-3 border-b-2 ${theme.borderClass} pb-3 flex-wrap sm:flex-nowrap`}>
              <h3 className="text-lg sm:text-xl font-black text-[#1CB0F6] leading-snug break-words flex-1 min-w-0">
                {currentSection.title}
              </h3>
              <button
                onClick={handleBookmarkCurrentSection}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-2xl border-2 font-black uppercase tracking-wider transition-all shrink-0 ${
                  bookmarkedSections[currentSection.id]
                    ? 'bg-[#FFC800] text-amber-950 border-[#E0A800] shadow-sm'
                    : `${theme.cardBorder} ${theme.mutedText} ${theme.cardBg}`
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 stroke-[3]" />
                <span>{bookmarkedSections[currentSection.id] ? 'Bookmarked' : 'Bookmark'}</span>
              </button>
            </div>

            {/* Verbatim original text formatted into clean paragraphs */}
            <div className={`space-y-4 sm:space-y-5 leading-relaxed tracking-normal font-normal ${theme.bodyText}`}>
              {currentSection.content.split('\n\n').map((para, idx) => (
                <p key={idx} className="whitespace-pre-line text-left leading-relaxed">
                  {para.trim()}
                </p>
              ))}
            </div>
          </motion.article>
        )}

        {/* Section Navigation Buttons */}
        <div className={`flex items-center justify-between pt-6 border-t-2 ${theme.borderClass}`}>
          <button
            id="prev-section-btn"
            onClick={() => setActiveSectionIdx(prev => Math.max(0, prev - 1))}
            disabled={activeSectionIdx === 0}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl ${theme.cardBg} border-2 ${theme.cardBorder} border-b-4 text-xs font-black uppercase tracking-wider ${theme.headingText} disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80 active:translate-y-0.5 transition-all`}
          >
            <ChevronLeft className="w-4 h-4 stroke-[3]" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-black uppercase tracking-widest font-sans text-[#1CB0F6]">
            {activeSectionIdx + 1} / {module.sections.length}
          </span>

          <button
            id="next-section-btn"
            onClick={() => setActiveSectionIdx(prev => Math.min(module.sections.length - 1, prev + 1))}
            disabled={activeSectionIdx === module.sections.length - 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1CB0F6] border-b-4 border-[#189AD6] active:border-b-0 active:translate-y-0.5 text-xs font-black uppercase tracking-wider text-white disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-105 transition-all"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Interactive Lesson Notepad & Takeaways Section */}
        <div className="mt-14 space-y-6 pt-10 border-t-4 border-[#1CB0F6]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#FFC800] text-amber-950 shadow-sm border-2 border-black/10">
                <Edit3 className="w-6 h-6 stroke-[3]" />
              </div>
              <div>
                <h3 className={`text-2xl font-black ${theme.headingText}`}>
                  Lesson Notepad & Study Notes
                </h3>
                <p className={`text-xs font-bold ${theme.mutedText} font-sans`}>
                  Write down what you learned or key insights. Saved directly to your Journal for easy review.
                </p>
              </div>
            </div>

            {isSavedMap[0] && (
              <span className="flex items-center gap-1.5 text-xs text-[#58CC02] bg-[#58CC02]/10 px-3.5 py-1.5 rounded-2xl font-black uppercase tracking-wider border border-[#58CC02]/30 font-sans w-fit">
                <Check className="w-4 h-4 stroke-[3]" />
                Saved to Journal
              </span>
            )}
          </div>

          <div className={`${theme.cardBg} border-2 ${theme.cardBorder} border-b-6 border-[#1CB0F6] rounded-3xl p-5 sm:p-6 space-y-4 shadow-md font-sans`}>
            <div className="flex items-center justify-between text-xs font-black text-[#1CB0F6] uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 stroke-[3]" />
                Notes for Lesson: {module.title}
              </span>
            </div>

            <textarea
              id="lesson-notepad-textarea"
              rows={6}
              value={reflectionAnswers[0] || ''}
              onChange={(e) => handleAnswerChange(0, e.target.value)}
              placeholder="Type your personal study notes, key scriptures learned, personal takeaways, or reflections here..."
              className={`w-full ${theme.inputClass} border-2 border-${theme.borderClass} rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-[#1CB0F6] transition-all font-sans leading-relaxed shadow-inner`}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                {/* Primary Save Note Button */}
                <button
                  id="save-note-btn"
                  onClick={async () => {
                    const currentNote = reflectionAnswers[0] || '';
                    const questionText = `Study Notes: ${module.title}`;
                    await saveReflectionAnswer(module.id, 0, questionText, currentNote);
                    setIsSavedMap(prev => ({ ...prev, [0]: true }));
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#58CC02] hover:bg-[#46A302] text-white text-xs font-black uppercase tracking-wider border-b-4 border-[#3B8A02] active:border-b-0 active:translate-y-0.5 transition-all shadow-sm"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{isSavedMap[0] ? 'Note Saved' : 'Save Note'}</span>
                </button>
              </div>

              {/* Copy Note Button */}
              <button
                onClick={() => {
                  if (reflectionAnswers[0]) {
                    navigator.clipboard.writeText(reflectionAnswers[0]);
                    setCopiedNote(true);
                    setTimeout(() => setCopiedNote(false), 2000);
                  }
                }}
                disabled={!reflectionAnswers[0]}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl ${theme.cardBg} border-2 ${theme.cardBorder} hover:opacity-80 text-xs font-black uppercase ${theme.mutedText} disabled:opacity-40 transition-all`}
              >
                {copiedNote ? <Check className="w-4 h-4 text-[#58CC02] stroke-[3]" /> : <Copy className="w-4 h-4 stroke-[3]" />}
                <span>{copiedNote ? 'Copied' : 'Copy Note'}</span>
              </button>
            </div>

            {/* AI Feedback / Reflection Guidance */}
            {aiFeedback[0] && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`${theme.innerBox} border-2 border-[#1CB0F6] rounded-2xl p-4 text-xs space-y-1.5 font-sans shadow-xs mt-3`}
              >
                <div className="flex items-center gap-1.5 font-black text-[#1CB0F6] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 stroke-[3]" />
                  <span>AI Spiritual Mentor Insights:</span>
                </div>
                <p className={`leading-relaxed font-bold ${theme.bodyText}`}>
                  {aiFeedback[0]}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Completion Action Banner */}
        <div className={`pt-10 border-t-2 ${theme.borderClass} flex flex-col sm:flex-row items-center justify-between gap-4`}>
          <div>
            <h4 className={`font-black text-lg ${theme.headingText}`}>
              Finished Reading This Lesson?
            </h4>
            <p className={`text-xs font-bold ${theme.mutedText} font-sans`}>
              Mark completed to save progress and unlock the next lesson on your roadmap.
            </p>
          </div>

          <button
            id="complete-module-btn"
            onClick={handleCompleteModule}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#58CC02] hover:bg-[#46A302] border-b-4 border-[#3B8702] active:border-b-0 active:translate-y-1 text-white font-black text-base uppercase tracking-wider shadow-lg flex items-center justify-center gap-2.5 transition-all"
          >
            <CheckCircle2 className="w-5 h-5 stroke-[3]" />
            <span>Complete & Continue</span>
          </button>
        </div>

      </main>

      {/* Bottom Sticky Progress Bar */}
      <footer className="sticky bottom-0 z-30 bg-[#1CB0F6] border-t-4 border-black/10 px-4 py-3 text-white font-sans">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-xs font-black uppercase tracking-wider">
          <span>{chapter.title}</span>
          <div className="flex items-center gap-2">
            <span>Section {activeSectionIdx + 1} of {module.sections.length}</span>
          </div>
        </div>
      </footer>

      {/* Final Course Completion Modal */}
      <AnimatePresence>
        {showFinalCompletionModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-fadeIn"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowFinalCompletionModal(false);
                onBackToRoadmap();
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`${theme.cardBg} border-4 border-[#FFC800] rounded-3xl p-6 sm:p-8 max-w-lg w-full ${theme.headingText} shadow-2xl space-y-6 relative text-center my-auto`}
            >
              <div className="mx-auto w-20 h-20 rounded-full bg-[#FFC800] flex items-center justify-center text-amber-950 shadow-lg border-4 border-white/20 animate-bounce">
                <Trophy className="w-10 h-10 stroke-[2.5]" />
              </div>

              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-[#FFC800] bg-[#FFC800]/20 px-4 py-1.5 rounded-full inline-block">
                  Roadmap Completed!
                </span>
                <h2 className="text-2xl sm:text-3xl font-black leading-tight">
                  Congratulations! You have completed all the lessons.
                </h2>
                <p className="text-base font-bold text-[#58CC02] dark:text-[#76E126] leading-relaxed">
                  Now Go, you are equipped to do great and mighty things just like Christ did!
                </p>
              </div>

              <button
                id="final-roadmap-complete-btn"
                onClick={() => {
                  setShowFinalCompletionModal(false);
                  onBackToRoadmap();
                }}
                className="w-full py-4 rounded-2xl bg-[#58CC02] hover:bg-[#46A302] border-b-4 border-[#3B8702] active:border-b-0 active:translate-y-1 text-white font-black text-base uppercase tracking-wider shadow-lg transition-all"
              >
                Return to Roadmap
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
