import React, { useState } from 'react';
import { ChevronRight, BookOpen, TrendingUp, PenTool } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LandingPageProps {
  onNavigateToAuth: (mode: 'login' | 'signup') => void;
}

const slides = [
  {
    id: 0,
    title: "Welcome to On Your Mark",
    description: "Your comprehensive interactive guide to mastering performance marketing.",
    icon: <BookOpen size={64} className="text-[#1CB0F6]" />,
    color: "from-[#1CB0F6]/20 to-[#0A8FCC]/20",
  },
  {
    id: 1,
    title: "Master the Strategies",
    description: "Learn the secrets of digital marketing used by top agencies to drive growth.",
    icon: <TrendingUp size={64} className="text-[#FF9600]" />,
    color: "from-[#FF9600]/20 to-[#FF7B00]/20",
  },
  {
    id: 2,
    title: "Track Your Journey",
    description: "Read interactively, track your progress, and journal your personalized insights.",
    icon: <PenTool size={64} className="text-[#58CC02]" />,
    color: "from-[#58CC02]/20 to-[#46A302]/20",
  }
];

export function LandingPage({ onNavigateToAuth }: LandingPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = offset.x;
    if (swipe < -50) {
      nextSlide();
    } else if (swipe > 50) {
      prevSlide();
    }
  };

  return (
    <div className="h-screen w-full bg-[#F8FAF9] text-[#4B4B4B] font-sans overflow-hidden flex flex-col relative selection:bg-[#1CB0F6] selection:text-white">
      {/* Top Bar Logo */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-center z-50 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1CB0F6] to-[#0A8FCC] flex items-center justify-center">
            <BookOpen size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#111827]">On Your Mark</span>
        </div>
      </div>

      {/* Carousel */}
      <div className="flex-1 relative flex items-center justify-center pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center cursor-grab active:cursor-grabbing"
          >
            <div className={`w-40 h-40 rounded-full bg-gradient-to-tr ${slides[currentSlide].color} flex items-center justify-center mb-10 shadow-lg`}>
              {slides[currentSlide].icon}
            </div>
            <h1 className="text-3xl font-extrabold text-[#111827] mb-4">
              {slides[currentSlide].title}
            </h1>
            <p className="text-lg text-[#6B7280] max-w-sm leading-relaxed">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="p-8 pb-12 flex flex-col items-center gap-6 z-40 bg-white/50 backdrop-blur-md rounded-t-3xl border-t border-gray-100">
        
        {/* Pagination Dots */}
        <div className="flex gap-2 mb-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === index ? "w-8 bg-[#1CB0F6]" : "w-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="w-full max-w-sm flex flex-col gap-3">
          {currentSlide === slides.length - 1 ? (
            <button
              onClick={() => onNavigateToAuth('signup')}
              className="w-full bg-[#1CB0F6] hover:bg-[#0A8FCC] text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-[0_4px_0_0_#0A8FCC] active:shadow-[0_0px_0_0_#0A8FCC] active:translate-y-1 flex items-center justify-center gap-2"
            >
              Start Reading <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={nextSlide}
              className="w-full bg-gray-100 hover:bg-gray-200 text-[#4B4B4B] py-4 rounded-2xl font-bold text-lg transition-all"
            >
              Next
            </button>
          )}
          
          {/* Always show login option below */}
          <div className="text-center mt-2">
            <button
              onClick={() => onNavigateToAuth('login')}
              className="text-[#6B7280] font-medium hover:text-[#111827]"
            >
              Already have an account? Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
