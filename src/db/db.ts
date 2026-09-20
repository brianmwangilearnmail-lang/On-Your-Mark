import Dexie, { Table } from 'dexie';
import { ModuleStatus, ReflectionAnswer, UserBookmark, UserProgress } from '../types';

export interface UserStatsRecord {
  id?: string;
  key: string;
  streakDays: number;
  lastReadDate: string;
  totalMinutesRead: number;
}

export interface User {
  email: string;
  passwordHash: string;
  name: string;
}

export class OnYourMarkDatabase extends Dexie {
  progress!: Table<UserProgress, string>;
  reflections!: Table<ReflectionAnswer, number>;
  bookmarks!: Table<UserBookmark, number>;
  stats!: Table<UserStatsRecord, string>;
  users!: Table<User, string>;

  constructor() {
    super('OnYourMarkDB');

    this.version(2).stores({
      progress: 'moduleId, status, updatedAt',
      reflections: '++id, [moduleId+questionIndex], moduleId',
      bookmarks: '++id, moduleId, sectionId, createdAt',
      stats: 'key',
      users: 'email'
    });
  }
}

export const db = new OnYourMarkDatabase();

// Helper persistence methods
export async function getModuleStatus(moduleId: string): Promise<ModuleStatus> {
  const record = await db.progress.get(moduleId);
  if (record) {
    return record.status;
  }
  // Default status logic: first module unlocked by default, others locked until previous completed
  return 'not_started';
}

export async function saveModuleProgress(moduleId: string, status: ModuleStatus, lastPositionSection: number = 0) {
  const now = new Date().toISOString();
  await db.progress.put({
    moduleId,
    status,
    lastPositionSection,
    updatedAt: now
  });

  // Update streak & reading stats if completing
  if (status === 'completed') {
    await updateReadingStatsOnCompletion();
  }
}

export async function saveReflectionAnswer(moduleId: string, questionIndex: number, questionText: string, answerText: string) {
  const existing = await db.reflections
    .where({ moduleId, questionIndex })
    .first();

  const now = new Date().toISOString();
  if (existing && existing.id !== undefined) {
    const keyId = typeof existing.id === 'number' ? existing.id : parseInt(existing.id, 10);
    await db.reflections.update(keyId, {
      answerText,
      updatedAt: now
    });
  } else {
    await db.reflections.add({
      moduleId,
      questionIndex,
      questionText,
      answerText,
      updatedAt: now
    });
  }
}

export async function getReflectionAnswersForModule(moduleId: string): Promise<Record<number, string>> {
  const answers = await db.reflections.where('moduleId').equals(moduleId).toArray();
  const map: Record<number, string> = {};
  answers.forEach((a) => {
    map[a.questionIndex] = a.answerText;
  });
  return map;
}

export async function deleteReflection(id?: number | string, moduleId?: string, questionIndex?: number) {
  if (id !== undefined && id !== null) {
    const numericId = typeof id === 'number' ? id : parseInt(id as string, 10);
    if (!isNaN(numericId)) {
      await db.reflections.delete(numericId);
      return;
    }
  }
  if (moduleId !== undefined) {
    if (questionIndex !== undefined) {
      const items = await db.reflections.where('moduleId').equals(moduleId).toArray();
      const match = items.find(i => i.questionIndex === questionIndex);
      if (match && match.id) {
        await db.reflections.delete(match.id as number);
      } else {
        await db.reflections.where({ moduleId, questionIndex }).delete();
      }
    } else {
      await db.reflections.where('moduleId').equals(moduleId).delete();
    }
  }
}

export async function addBookmark(moduleId: string, sectionId: string, textSnippet: string, note?: string) {
  const existing = await db.bookmarks.where({ moduleId, sectionId }).first();
  if (!existing) {
    await db.bookmarks.add({
      moduleId,
      sectionId,
      textSnippet,
      note: note || '',
      createdAt: new Date().toISOString()
    });
  }
}

export async function removeBookmark(id?: number | string, moduleId?: string, sectionId?: string) {
  if (id !== undefined && id !== null) {
    const numericId = typeof id === 'number' ? id : parseInt(id as string, 10);
    if (!isNaN(numericId)) {
      await db.bookmarks.delete(numericId);
      return;
    }
  }
  if (moduleId !== undefined && sectionId !== undefined) {
    const items = await db.bookmarks.where('moduleId').equals(moduleId).toArray();
    const match = items.find(i => i.sectionId === sectionId);
    if (match && match.id) {
      await db.bookmarks.delete(match.id as number);
    } else {
      await db.bookmarks.where({ moduleId, sectionId }).delete();
    }
  } else if (moduleId !== undefined) {
    await db.bookmarks.where('moduleId').equals(moduleId).delete();
  }
}

async function updateReadingStatsOnCompletion() {
  const today = new Date().toISOString().split('T')[0];
  let statsRecord = await db.stats.get('main');
  
  if (!statsRecord) {
    statsRecord = {
      key: 'main',
      streakDays: 1,
      lastReadDate: today,
      totalMinutesRead: 10
    };
  } else {
    const lastDate = statsRecord.lastReadDate;
    const diffDays = Math.floor((new Date(today).getTime() - new Date(lastDate).getTime()) / (1000 * 3600 * 24));
    
    if (diffDays === 1) {
      statsRecord.streakDays += 1;
    } else if (diffDays > 1) {
      statsRecord.streakDays = 1;
    }
    statsRecord.lastReadDate = today;
    statsRecord.totalMinutesRead += 8;
  }

  await db.stats.put(statsRecord);
}
