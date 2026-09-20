import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Lock, 
  Play, 
  Clock, 
  BookOpen, 
  ChevronRight, 
  Sparkles, 
  Trophy,
  ArrowRight,
  X
} from 'lucide-react';
import { Book, Module, ModuleStatus, ThemeMode } from '../types';
import { getThemeStyles } from '../utils/theme';
import { useBodyScrollLock } from '../utils/useBodyScrollLock';

interface RoadmapViewProps {
  book: Book;
  progressMap: Record<string, ModuleStatus>;
  onSelectModule: (module: Module) => void;
  themeMode?: ThemeMode;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  book,
  progressMap,
  onSelectModule,
  themeMode = 'light',
}) => {
  const [selectedPreviewModule, setSelectedPreviewModule] = useState<Module | null>(null);
  const theme = getThemeStyles(themeMode as ThemeMode);

  useBodyScrollLock(!!selectedPreviewModule);

  // Find the current active/unlocked module to feature in Hero banner
  const allModulesList = book.chapters.flatMap(c => c.modules);
  const isAllCompleted = allModulesList.length > 0 && allModulesList.every(m => progressMap[m.id] === 'completed');
  const nextUpModule = allModulesList.find(
    m => progressMap[m.id] === 'in_progress' || progressMap[m.id] === 'unlocked'
  ) || allModulesList[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10 font-sans">
      {/* Hero Continue or Completion Banner */}
      {isAllCompleted ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`relative overflow-hidden rounded-3xl ${theme.cardBg} border-4 border-[#FFC800] p-6 sm:p-8 ${theme.headingText} shadow-xl transition-colors bg-gradient-to-br from-[#FFC800]/15 via-transparent to-[#58CC02]/15`}
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-950 bg-[#FFC800] px-3.5 py-1 rounded-full w-fit shadow-sm">
                <Trophy className="w-3.5 h-3.5 fill-amber-950 stroke-[2.5]" />
                <span>Roadmap Completed</span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-black ${theme.headingText} tracking-tight leading-tight`}>
                Congratulations! You have completed all the lessons.
              </h2>
              <p className="text-sm sm:text-base font-bold text-[#58CC02] dark:text-[#76E126] leading-relaxed">
                Now Go, you are equipped to do great and mighty things just like Christ did!
              </p>
            </div>

            <button
              id="hero-review-first-btn"
              onClick={() => onSelectModule(allModulesList[0])}
              className="group flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-[#58CC02] hover:bg-[#46A302] border-b-4 border-[#3B8702] active:border-b-0 active:translate-y-1 text-white font-black text-sm uppercase tracking-wider shadow-lg hover:scale-105 transition-all whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-5 h-5 stroke-[2.5]" />
              <span>Review Lessons</span>
            </button>
          </div>
        </motion.div>
      ) : nextUpModule && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-3xl ${theme.cardBg} border-2 ${theme.cardBorder} border-b-8 border-b-[#1CB0F6] p-6 sm:p-8 ${theme.headingText} shadow-md transition-colors`}
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-950 bg-[#FFC800] px-3.5 py-1 rounded-full w-fit shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-amber-950 stroke-[2.5]" />
                <span>Current Lesson</span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-black ${theme.headingText} tracking-tight`}>
                {nextUpModule.title}
              </h2>
              <p className={`${theme.mutedText} font-bold text-sm max-w-xl line-clamp-2`}>
                {nextUpModule.description}
              </p>
              <div className="flex items-center gap-4 text-xs font-black text-[#1CB0F6] pt-1 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 stroke-[3]" />
                  {nextUpModule.estimatedMinutes} min read
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4 stroke-[3]" />
                  {nextUpModule.sections.length} subtopics
                </span>
              </div>
            </div>

            <button
              id="hero-continue-reading-btn"
              onClick={() => onSelectModule(nextUpModule)}
              className="group flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#58CC02] hover:bg-[#46A302] border-b-4 border-[#3B8702] active:border-b-0 active:translate-y-1 text-white font-black text-base uppercase tracking-wider shadow-lg hover:scale-105 transition-all whitespace-nowrap"
            >
              <Play className="w-5 h-5 fill-white stroke-none" />
              <span>Continue Journey</span>
              <ArrowRight className="w-5 h-5 stroke-[3] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Course Path Breakdown */}
      <div className="space-y-12">
        {book.chapters.map((chapter, chapterIdx) => {
          return (
            <div key={chapter.id} className="space-y-6">
              {/* Chapter Banner */}
              <div className={`sticky top-24 z-20 backdrop-blur-md ${theme.cardBg}/95 border-2 ${theme.cardBorder} border-b-4 border-b-[#1CB0F6] rounded-2xl p-3.5 sm:p-4 shadow-sm flex items-center justify-between gap-3 transition-colors`}>
                <div className="min-w-0 flex-1">
                  <span className="text-xs uppercase font-black tracking-wider text-[#1CB0F6] block">
                    Chapter {chapter.order}
                  </span>
                  <h3 className={`text-base sm:text-lg font-black ${theme.headingText} leading-snug break-words`}>
                    {chapter.title}
                  </h3>
                  {chapter.description && (
                    <p className={`text-xs font-bold ${theme.mutedText} mt-0.5 line-clamp-1`}>
                      {chapter.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-black text-white bg-[#1CB0F6] px-3 py-1.5 rounded-xl shadow-sm uppercase tracking-wider shrink-0 whitespace-nowrap">
                  <BookOpen className="w-4 h-4 stroke-[3]" />
                  <span>{chapter.modules.length} Lessons</span>
                </div>
              </div>

              {/* Duolingo Style Nodes Column */}
              <div className="relative flex flex-col items-center py-4 space-y-10">
                {/* Vertical Path Connector Line */}
                <div className={`absolute top-6 bottom-6 w-2.5 ${themeMode === 'dark' ? 'bg-[#2D424F]' : 'bg-[#E5E5E5]'} -z-0 rounded-full`} />

                {chapter.modules.map((mod, modIdx) => {
                  const status = progressMap[mod.id] || (modIdx === 0 && chapterIdx === 0 ? 'unlocked' : 'locked');
                  
                  // Calculate zigzag horizontal offset for Duolingo feel
                  const offsets = [0, 48, 72, 48, 0, -48, -72, -48];
                  const xOffset = offsets[(chapterIdx * 3 + modIdx) % offsets.length];

                  const isCompleted = status === 'completed';
                  const isInProgress = status === 'in_progress';
                  const isUnlocked = status === 'unlocked' || isCompleted || isInProgress;

                  return (
                    <motion.div
                      key={mod.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: modIdx * 0.05 }}
                      className="relative z-10 flex flex-col items-center"
                      style={{ transform: `translateX(${xOffset}px)` }}
                    >
                      {/* Interactive Node Button */}
                      <button
                        id={`module-node-${mod.id}`}
                        onClick={() => {
                          if (isUnlocked) {
                            setSelectedPreviewModule(mod);
                          }
                        }}
                        disabled={!isUnlocked}
                        className={`relative group w-20 h-20 sm:w-22 sm:h-22 rounded-3xl flex items-center justify-center transition-all duration-200 active:translate-y-1 ${
                          isCompleted
                            ? 'bg-[#58CC02] border-b-[8px] border-[#46A302] text-white shadow-lg hover:brightness-105'
                            : isInProgress
                            ? 'bg-[#1CB0F6] border-b-[8px] border-[#189AD6] text-white ring-8 ring-[#1CB0F6]/20 shadow-xl hover:brightness-105'
                            : isUnlocked
                            ? 'bg-[#FFC800] border-b-[8px] border-[#E0A800] text-amber-950 shadow-md hover:brightness-105'
                            : `${themeMode === 'dark' ? 'bg-[#2D424F] border-[#1C2C35] text-slate-500' : 'bg-[#E5E5E5] border-[#C8C8C8] text-[#AFAFAF]'} border-b-[8px] cursor-not-allowed opacity-70`
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-10 h-10 stroke-[3]" />
                        ) : isInProgress ? (
                          <Play className="w-10 h-10 fill-white stroke-none ml-1" />
                        ) : isUnlocked ? (
                          <BookOpen className="w-8 h-8 stroke-[3]" />
                        ) : (
                          <Lock className="w-7 h-7 stroke-[2.5]" />
                        )}

                        {/* Order Badge */}
                        <div className="absolute -bottom-3 px-2.5 py-0.5 rounded-full bg-[#4B4B4B] text-white border-2 border-white text-[10px] font-black shadow-sm">
                          {mod.order}
                        </div>
                      </button>

                      {/* Label Card */}
                      <div 
                        onClick={() => isUnlocked && setSelectedPreviewModule(mod)}
                        className={`mt-4 text-center max-w-[200px] cursor-pointer ${isUnlocked ? 'hover:scale-105' : 'opacity-60'} transition-transform`}
                      >
                        <h4 className={`font-black text-sm ${theme.headingText} leading-snug line-clamp-2`}>
                          {mod.title}
                        </h4>
                        <span className="text-[11px] text-[#1CB0F6] font-black uppercase tracking-wider flex items-center justify-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 stroke-[3]" />
                          {mod.estimatedMinutes} mins
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Module Preview Modal Drawer */}
      <AnimatePresence>
        {selectedPreviewModule && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fadeIn"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedPreviewModule(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`${theme.cardBg} border-4 border-[#1CB0F6] rounded-3xl p-5 sm:p-7 max-w-lg w-full ${theme.headingText} shadow-2xl space-y-5 relative my-auto max-h-[90vh] flex flex-col overflow-y-auto`}
            >
              <button
                onClick={() => setSelectedPreviewModule(null)}
                className={`absolute top-4 right-4 p-2 ${theme.mutedText} hover:${theme.headingText} rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/10`}
                title="Close"
              >
                <X className="w-5 h-5 stroke-[3]" />
              </button>

              <div className="space-y-2 pr-8">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#1CB0F6] bg-[#1CB0F6]/10 px-3 py-1 rounded-full inline-block">
                  Micro-Lesson {selectedPreviewModule.order}
                </span>
                <h3 className={`text-2xl font-black ${theme.headingText} leading-tight`}>
                  {selectedPreviewModule.title}
                </h3>
                <p className={`${theme.mutedText} font-bold text-xs sm:text-sm leading-relaxed`}>
                  {selectedPreviewModule.description}
                </p>
              </div>

              <div className={`grid grid-cols-2 gap-3 ${theme.innerBox} p-3.5 sm:p-4 rounded-2xl border-2 text-xs font-black`}>
                <div>
                  <span className="text-[#1CB0F6] block font-black uppercase text-[10px]">Reading Time</span>
                  <span className="text-xs sm:text-sm">~{selectedPreviewModule.estimatedMinutes} Mins</span>
                </div>
                <div>
                  <span className="text-[#1CB0F6] block font-black uppercase text-[10px]">Subtopics</span>
                  <span className="text-xs sm:text-sm">{selectedPreviewModule.sections.length} Sections</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  id="preview-modal-cancel-btn"
                  onClick={() => setSelectedPreviewModule(null)}
                  className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border-2 ${theme.borderClass} ${theme.mutedText} hover:opacity-80 text-xs font-black uppercase tracking-wider transition-colors`}
                >
                  Close
                </button>
                <button
                  id="preview-modal-start-btn"
                  onClick={() => {
                    const m = selectedPreviewModule;
                    setSelectedPreviewModule(null);
                    onSelectModule(m);
                  }}
                  className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-2xl bg-[#58CC02] hover:bg-[#46A302] border-b-4 border-[#3B8702] active:border-b-0 active:translate-y-1 text-white text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-2 transition-all"
                >
                  <Play className="w-4 h-4 fill-white stroke-none" />
                  <span>Start Micro-Lesson</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
