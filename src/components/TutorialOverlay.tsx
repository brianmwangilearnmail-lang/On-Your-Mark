import React, { useState, useEffect } from 'react';
import { useBodyScrollLock } from '../utils/useBodyScrollLock';
import { 
  Sparkles, 
  Map, 
  BookOpen, 
  BookmarkCheck, 
  Search, 
  Settings, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  X,
  GraduationCap,
  Download,
  Flame,
  HelpCircle
} from 'lucide-react';

interface TutorialStep {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  targetTab?: 'roadmap' | 'journal' | 'search';
  tips: string[];
}

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: 'roadmap' | 'journal' | 'search') => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Welcome to ON YOUR MARK!",
    subtitle: "By Benjamin Kasankya",
    badge: "Getting Started",
    description: "Welcome to your interactive spiritual study primer! Designed to help you build a strong foundation in faith through guided lesson roadmaps, reflective journaling, and searchable scriptures.",
    icon: <GraduationCap className="w-8 h-8 text-[#1CB0F6]" />,
    targetTab: 'roadmap',
    tips: [
      "Follow step-by-step lessons along your study path",
      "Reflect on guided questions in every chapter",
      "Keep track of your daily study streak"
    ]
  },
  {
    title: "Sequential Learning Roadmap",
    subtitle: "Interactive Study Path",
    badge: "Step 1 of 4",
    description: "The Learning Path organizes foundational lessons into chapters. Click on any unlocked module to open the interactive lesson reader.",
    icon: <Map className="w-8 h-8 text-[#58CC02]" />,
    targetTab: 'roadmap',
    tips: [
      "Lessons unlock automatically as you finish previous ones",
      "Green checkmarks highlight your completed modules",
      "Use 'Continue Journey' to resume right where you left off"
    ]
  },
  {
    title: "Lesson Reader & Reflection Notes",
    subtitle: "Deepen Your Understanding",
    badge: "Step 2 of 4",
    description: "Inside each lesson module, you'll find key scripture references, guided commentary, and reflection questions where you can save personal study notes.",
    icon: <BookOpen className="w-8 h-8 text-[#FFC800]" />,
    targetTab: 'roadmap',
    tips: [
      "Write and save personal notes directly under each question",
      "Mark lessons as 'Complete' to advance along your path",
      "Your notes are securely saved in your browser"
    ]
  },
  {
    title: "Personal Journal & PDF Export",
    subtitle: "Review & Download Notes",
    badge: "Step 3 of 4",
    description: "All your saved study notes are organized in your Journal. Search by topic, copy text, or export your complete journal as a clean PDF document.",
    icon: <Download className="w-8 h-8 text-[#1CB0F6]" />,
    targetTab: 'journal',
    tips: [
      "Click 'Download Notes' to generate a formatted PDF study guide",
      "Notes come embedded with book titles and chapter headers",
      "Delete or edit notes whenever you need to update them"
    ]
  },
  {
    title: "Search & Custom Preferences",
    subtitle: "Fast Lookup & Reading Controls",
    badge: "Step 4 of 4",
    description: "Search across all topics, scriptures, and keywords anytime. Customize your reading experience using the gear icon in the top header.",
    icon: <Search className="w-8 h-8 text-amber-500" />,
    targetTab: 'search',
    tips: [
      "Search any topic or scripture reference instantly",
      "Customize font size and light/dark theme modes in Settings",
      "Track your study streak and progress anytime"
    ]
  }
];

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  isOpen,
  onClose,
  setActiveTab
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStepIdx(0);
    }
  }, [isOpen]);

  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const currentStep = tutorialSteps[currentStepIdx];
  const isLastStep = currentStepIdx === tutorialSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      if (tutorialSteps[nextIdx].targetTab) {
        setActiveTab(tutorialSteps[nextIdx].targetTab!);
      }
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      const prevIdx = currentStepIdx - 1;
      setCurrentStepIdx(prevIdx);
      if (tutorialSteps[prevIdx].targetTab) {
        setActiveTab(tutorialSteps[prevIdx].targetTab!);
      }
    }
  };

  const handleComplete = () => {
    localStorage.setItem('oym_tutorial_completed', 'true');
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('oym_tutorial_completed', 'true');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleSkip();
      }}
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-[#15232B] rounded-3xl border-4 border-black/10 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        
        {/* Top Header Bar */}
        <div className="bg-[#1CB0F6] p-4 text-white flex items-center justify-between border-b-4 border-black/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FFC800] stroke-[3]" />
            <span className="text-xs font-black uppercase tracking-wider">Guided Tour</span>
          </div>
          <button
            onClick={handleSkip}
            className="text-white/80 hover:text-white text-xs font-bold uppercase tracking-wider bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-all"
          >
            Skip Tutorial
          </button>
        </div>

        {/* Step Progress Pills */}
        <div className="flex items-center gap-1.5 px-6 pt-5 pb-2">
          {tutorialSteps.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStepIdx
                  ? 'flex-1 bg-[#1CB0F6]'
                  : idx < currentStepIdx
                  ? 'w-6 bg-[#58CC02]'
                  : 'w-3 bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 flex-1 flex flex-col gap-4">
          
          <div className="flex items-start gap-4">
            <div className="p-3.5 bg-sky-50 dark:bg-sky-950/50 rounded-2xl border-2 border-[#1CB0F6]/20 shrink-0 shadow-xs">
              {currentStep.icon}
            </div>
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 dark:text-amber-200 text-amber-900 text-[10px] font-black uppercase tracking-widest mb-1">
                {currentStep.badge}
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
                {currentStep.title}
              </h3>
              <p className="text-xs font-bold text-[#1CB0F6] uppercase tracking-wider mt-0.5">
                {currentStep.subtitle}
              </p>
            </div>
          </div>

          <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#1C2C35] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            {currentStep.description}
          </p>

          {/* Key Tips List */}
          <div className="space-y-2">
            <p className="text-xs font-black uppercase text-slate-400 tracking-wider">Highlights:</p>
            <div className="space-y-1.5">
              {currentStep.tips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#58CC02] shrink-0 mt-0.5 stroke-[2.5]" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-[#1C2C35] border-t-2 border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-30 disabled:pointer-events-none text-slate-700 dark:text-slate-200 font-black text-xs uppercase tracking-wider transition-all"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>Back</span>
          </button>

          <span className="text-xs font-bold text-slate-400">
            {currentStepIdx + 1} of {tutorialSteps.length}
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#58CC02] hover:bg-[#46A302] border-b-4 border-[#3B8702] active:border-b-0 active:translate-y-0.5 text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all"
          >
            <span>{isLastStep ? "Finish Tutorial" : "Next Step"}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

      </div>
    </div>
  );
};
