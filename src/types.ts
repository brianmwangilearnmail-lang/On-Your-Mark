export interface Section {
  id: string;
  title: string;
  order: number;
  content: string;
}

export interface Module {
  id: string;
  chapterId: string;
  slug: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  order: number;
  sections: Section[];
  reflectionQuestions: string[];
}

export interface Chapter {
  id: string;
  title: string;
  slug: string;
  order: number;
  description?: string;
  modules: Module[];
}

export interface Book {
  bookTitle: string;
  subtitle?: string;
  author: string;
  isbn?: string;
  publisher?: string;
  chapters: Chapter[];
}

export type ModuleStatus = 'not_started' | 'locked' | 'unlocked' | 'in_progress' | 'completed';

export interface UserProgress {
  id?: number | string;
  userId?: string;
  moduleId: string;
  status: ModuleStatus;
  lastPositionSection: number;
  completedAt?: string;
  updatedAt: string;
}

export interface ReflectionAnswer {
  id?: number | string;
  moduleId: string;
  questionIndex: number;
  questionText: string;
  answerText: string;
  updatedAt: string;
}

export interface UserBookmark {
  id?: number | string;
  moduleId: string;
  sectionId: string;
  textSnippet: string;
  note?: string;
  createdAt: string;
}

export interface UserStats {
  streakDays: number;
  lastReadDate: string;
  totalMinutesRead: number;
  completedModulesCount: number;
}

export type ThemeMode = 'light' | 'dark' | 'sepia';
export type FontFamily = 'sans' | 'serif';
