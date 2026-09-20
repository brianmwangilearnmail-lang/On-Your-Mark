import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { Book, Module, Section, ThemeMode } from '../types';
import { getThemeStyles } from '../utils/theme';
import { Search, Bookmark, ArrowRight, BookOpen, Trash2 } from 'lucide-react';

interface SearchViewProps {
  book: Book;
  onSelectModule: (module: Module) => void;
  themeMode?: ThemeMode;
}

export const SearchView: React.FC<SearchViewProps> = ({ book, onSelectModule, themeMode = 'light' }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'bookmarks'>('search');

  const theme = getThemeStyles(themeMode as ThemeMode);

  // Live bookmarks query
  const bookmarks = useLiveQuery(() => db.bookmarks.toArray()) || [];

  // Search logic
  const searchResults: { module: Module; section: Section; matchSnippet: string }[] = [];

  if (query.trim().length >= 2) {
    const qLower = query.toLowerCase();
    book.chapters.forEach((chapter) => {
      chapter.modules.forEach((module) => {
        module.sections.forEach((section) => {
          if (
            section.title.toLowerCase().includes(qLower) ||
            section.content.toLowerCase().includes(qLower)
          ) {
            // Find snippet around first match
            const idx = section.content.toLowerCase().indexOf(qLower);
            let snippet = '';
            if (idx !== -1) {
              const start = Math.max(0, idx - 60);
              const end = Math.min(section.content.length, idx + 100);
              snippet = (start > 0 ? '...' : '') + section.content.substring(start, end) + (end < section.content.length ? '...' : '');
            } else {
              snippet = section.content.substring(0, 150) + '...';
            }

            searchResults.push({ module, section, matchSnippet: snippet });
          }
        });
      });
    });
  }

  const handleDeleteBookmark = async (id?: string | number) => {
    if (id !== undefined && id !== null) {
      if (typeof id === 'number') {
        await db.bookmarks.delete(id);
      } else {
        const parsed = parseInt(id, 10);
        if (!isNaN(parsed)) {
          await db.bookmarks.delete(parsed);
        }
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 font-sans">
      {/* Search Bar and Tab Switcher */}
      <div className="space-y-4">
        <div className={`flex items-center justify-between border-b-2 ${theme.borderClass} pb-4`}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'search'
                  ? 'bg-[#1CB0F6] text-white border-b-4 border-[#189AD6] shadow-sm'
                  : `${theme.cardBg} border-2 ${theme.borderClass} ${theme.mutedText} hover:opacity-80`
              }`}
            >
              <Search className="w-4 h-4 stroke-[3]" />
              <span>Full-Text Search</span>
            </button>
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'bookmarks'
                  ? 'bg-[#1CB0F6] text-white border-b-4 border-[#189AD6] shadow-sm'
                  : `${theme.cardBg} border-2 ${theme.borderClass} ${theme.mutedText} hover:opacity-80`
              }`}
            >
              <Bookmark className="w-4 h-4 stroke-[3]" />
              <span>Saved Bookmarks ({bookmarks.length})</span>
            </button>
          </div>
        </div>

        {activeTab === 'search' && (
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-[#1CB0F6] stroke-[3]" />
            <input
              id="full-text-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by scripture, keyword (e.g. 'righteousness', 'John 3:16', 'baptizo')..."
              className={`w-full ${theme.inputClass} border-2 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold focus:outline-none focus:border-[#1CB0F6] shadow-xs`}
            />
          </div>
        )}
      </div>

      {/* Results Rendering */}
      {activeTab === 'search' ? (
        query.trim().length < 2 ? (
          <div className={`text-center py-16 ${theme.cardBg} border-2 ${theme.cardBorder} rounded-3xl space-y-2 shadow-xs`}>
            <Search className="w-12 h-12 mx-auto text-[#1CB0F6] stroke-[2.5]" />
            <p className={`text-xs font-bold ${theme.mutedText}`}>
              Type at least 2 characters to search the verbatim text of the book.
            </p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className={`text-center py-12 ${theme.cardBg} rounded-3xl border-2 ${theme.cardBorder} ${theme.mutedText} font-bold text-xs shadow-xs`}>
            No matches found for "{query}".
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-[#1CB0F6] font-black uppercase tracking-wider">
              Found {searchResults.length} matches for "{query}"
            </p>

            {searchResults.map((res, idx) => (
              <div 
                key={idx}
                onClick={() => onSelectModule(res.module)}
                className={`${theme.cardBg} border-2 ${theme.cardBorder} border-b-4 border-[#1CB0F6] hover:border-b-8 rounded-3xl p-5 space-y-2 cursor-pointer transition-all group shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#1CB0F6] uppercase">
                    {res.module.title}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#1CB0F6] stroke-[3] group-hover:translate-x-1 transition-transform" />
                </div>
                <h4 className={`font-black text-sm ${theme.headingText}`}>
                  {res.section.title}
                </h4>
                <p className={`text-xs font-bold ${theme.mutedText} italic leading-relaxed`}>
                  "{res.matchSnippet}"
                </p>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Bookmarks Tab */
        bookmarks.length === 0 ? (
          <div className={`text-center py-16 ${theme.cardBg} border-2 ${theme.cardBorder} rounded-3xl space-y-2 shadow-xs`}>
            <Bookmark className="w-12 h-12 mx-auto text-[#FFC800] stroke-[2.5]" />
            <p className={`text-xs font-bold ${theme.mutedText}`}>
              No bookmarks saved yet. Click the Bookmark button while reading any section.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bm) => {
              const allMods = book.chapters.flatMap(c => c.modules);
              const m = allMods.find(mod => mod.id === bm.moduleId);

              return (
                <div 
                  key={bm.id}
                  className={`${theme.cardBg} border-2 ${theme.cardBorder} border-b-4 border-[#FFC800] rounded-3xl p-5 space-y-3 shadow-sm`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-black text-[#1CB0F6]">
                        {m?.title || bm.moduleId}
                      </span>
                      <p className={`text-xs ${theme.headingText} font-bold italic mt-1`}>
                        "{bm.textSnippet}"
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteBookmark(bm.id as any)}
                      className="p-1.5 text-[#FF4B4B] hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
                      title="Delete Bookmark"
                    >
                      <Trash2 className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>

                  {m && (
                    <button
                      onClick={() => onSelectModule(m)}
                      className="flex items-center gap-1.5 text-xs text-[#1CB0F6] font-black uppercase tracking-wider hover:underline pt-1"
                    >
                      <BookOpen className="w-4 h-4 stroke-[3]" />
                      <span>Jump to Micro-Lesson</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
};
