import { Book, Chapter, Module } from '../types';
import { chapter0 } from './chapters/ch0_intro';
import { chapter1 } from './chapters/ch1_new_creation';
import { chapter2 } from './chapters/ch2_eternal_security';
import { chapter3 } from './chapters/ch3_baptisms';
import { chapter4 } from './chapters/ch4_prayer';
import { chapter5 } from './chapters/ch5_word';
import { chapter6 } from './chapters/ch6_witness';
import { chapter7 } from './chapters/ch7_church';

export const bookData: Book = {
  bookTitle: 'ON YOUR MARK',
  subtitle: 'GET READY TO WIN YOUR RACE',
  author: 'Benjamin Kasankya',
  isbn: '978-9914-744-39-2',
  publisher: 'Ayanda Publishing House',
  chapters: [
    chapter0,
    chapter1,
    chapter2,
    chapter3,
    chapter4,
    chapter5,
    chapter6,
    chapter7,
  ]
};

// Flattened list of all modules in reading sequence
export const allModules: Module[] = bookData.chapters.flatMap((ch) => ch.modules);

// Helper function to find module by ID or slug
export function getModuleByIdOrSlug(idOrSlug: string): { module: Module; chapter: Chapter; prevModule?: Module; nextModule?: Module } | undefined {
  let foundIndex = -1;
  const list = allModules;

  for (let i = 0; i < list.length; i++) {
    if (list[i].id === idOrSlug || list[i].slug === idOrSlug) {
      foundIndex = i;
      break;
    }
  }

  if (foundIndex === -1) return undefined;

  const module = list[foundIndex];
  const chapter = bookData.chapters.find((c) => c.id === module.chapterId)!;
  const prevModule = foundIndex > 0 ? list[foundIndex - 1] : undefined;
  const nextModule = foundIndex < list.length - 1 ? list[foundIndex + 1] : undefined;

  return { module, chapter, prevModule, nextModule };
}

// Generate Supabase DDL SQL Schema matching the PRD specification
export function generateSupabaseSQLSchema(): string {
  return `-- ========================================================
-- Supabase Database Migration Schema for "ON YOUR MARK" App
-- ========================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CHAPTERS TABLE
CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    "order" INT NOT NULL
);

-- 2. MODULES TABLE
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    "order" INT NOT NULL,
    estimated_minutes INT NOT NULL DEFAULT 5
);

-- 3. SECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    "order" INT NOT NULL
);

-- 4. REFLECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.reflections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    "order" INT NOT NULL
);

-- 5. USER PROGRESS TABLE
CREATE TYPE IF NOT EXISTS public.module_status_enum AS ENUM ('not_started', 'in_progress', 'completed');

CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    status public.module_status_enum DEFAULT 'not_started',
    last_position INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, module_id)
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Public Read for Book Content
CREATE POLICY "Allow public read access to chapters" ON public.chapters FOR SELECT USING (true);
CREATE POLICY "Allow public read access to modules" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Allow public read access to sections" ON public.sections FOR SELECT USING (true);
CREATE POLICY "Allow public read access to reflections" ON public.reflections FOR SELECT USING (true);

-- User Progress RLS
CREATE POLICY "Users can view their own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert/update their own progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id);
`;
}
