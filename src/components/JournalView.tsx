import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import jsPDF from 'jspdf';
import { db, deleteReflection, removeBookmark } from '../db/db';
import { Book, Module, ThemeMode } from '../types';
import { getThemeStyles } from '../utils/theme';
import { 
  BookmarkCheck, 
  Bookmark,
  Download, 
  Search, 
  Copy, 
  Check, 
  BookOpen, 
  ArrowRight, 
  Trash2, 
  Edit3
} from 'lucide-react';

interface JournalViewProps {
  book: Book;
  onSelectModule?: (module: Module) => void;
  themeMode?: ThemeMode;
}

export const JournalView: React.FC<JournalViewProps> = ({ book, onSelectModule, themeMode = 'light' }) => {
  const [activeSubTab, setActiveSubTab] = useState<'notes' | 'bookmarks'>('notes');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

  const theme = getThemeStyles(themeMode as ThemeMode);

  // Live queries for reflections and bookmarks from Dexie
  const reflections = useLiveQuery(() => db.reflections.toArray()) || [];
  const bookmarks = useLiveQuery(() => db.bookmarks.toArray()) || [];

  // Flatten all modules with chapter context
  const allModulesList = book.chapters.flatMap(c => 
    c.modules.map(m => ({ ...m, chapterTitle: c.title }))
  );

  const handleCopyText = (id: string | number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteNote = async (id?: number | string, moduleId?: string, questionIndex?: number) => {
    await deleteReflection(id, moduleId, questionIndex);
  };

  const handleDeleteBookmark = async (id?: number | string, moduleId?: string, sectionId?: string) => {
    await removeBookmark(id, moduleId, sectionId);
  };

  const handleDownloadNotesPDF = () => {
    const doc = new jsPDF({
      unit: 'pt',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const contentWidth = pageWidth - margin * 2;
    let y = 0;

    // Top Header Banner
    doc.setFillColor(28, 176, 246);
    doc.rect(0, 0, pageWidth, 75, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(book.title.toUpperCase(), margin, 35);

    doc.setFontSize(11);
    doc.setFont('Helvetica', 'normal');
    doc.text(`${book.subtitle || 'An Essential Primer for New Believers'}  |  By ${book.author}`, margin, 54);

    y = 100;

    doc.setTextColor(75, 75, 75);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Personal Study Notes & Reflection Journal', margin, y);
    y += 18;

    doc.setFontSize(9);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    doc.text(`Exported: ${new Date().toLocaleDateString()}   •   Total Notes: ${reflections.length}`, margin, y);
    y += 20;

    doc.setDrawColor(225, 225, 225);
    doc.setLineWidth(1);
    doc.line(margin, y, pageWidth - margin, y);
    y += 20;

    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - 50) {
        doc.addPage();
        y = 50;
      }
    };

    reflections.forEach((ref) => {
      const mod = allModulesList.find(m => m.id === ref.moduleId || m.slug === ref.moduleId);
      const chapterTitle = mod?.chapterTitle || 'General Reflection';
      const lessonTopic = mod?.title || `Lesson Topic: ${ref.moduleId}`;
      const savedDate = new Date(ref.updatedAt).toLocaleDateString();

      const noteText = ref.answerText || '';
      const splitNoteLines = doc.splitTextToSize(noteText, contentWidth - 28);
      const boxHeight = Math.max(60, splitNoteLines.length * 14 + 48);

      checkPageBreak(boxHeight + 20);

      doc.setFillColor(252, 253, 255);
      doc.setDrawColor(28, 176, 246);
      doc.setLineWidth(1.5);
      doc.roundedRect(margin, y, contentWidth, boxHeight, 6, 6, 'FD');

      doc.setFillColor(255, 200, 0);
      doc.rect(margin + 12, y + 12, 4, 16, 'F');

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(28, 176, 246);
      doc.text(`${chapterTitle.toUpperCase()}  >  ${lessonTopic}`, margin + 22, y + 24);

      doc.setFontSize(8);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(140, 140, 140);
      doc.text(savedDate, pageWidth - margin - 60, y + 24);

      doc.setDrawColor(235, 238, 242);
      doc.setLineWidth(0.5);
      doc.line(margin + 12, y + 34, pageWidth - margin - 12, y + 34);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text(splitNoteLines, margin + 14, y + 49);

      y += boxHeight + 16;
    });

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(160, 160, 160);
      doc.text(`${book.title} - Study Notes  |  Page ${i} of ${totalPages}`, margin, pageHeight - 20);
    }

    doc.save(`On_Your_Mark_Study_Notes_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const filteredReflections = reflections.filter(r => {
    const mod = allModulesList.find(m => m.id === r.moduleId || m.slug === r.moduleId);
    const modTitle = mod ? mod.title : '';
    const chapTitle = mod ? mod.chapterTitle : '';
    const query = searchTerm.toLowerCase();

    return (
      r.answerText.toLowerCase().includes(query) ||
      r.questionText.toLowerCase().includes(query) ||
      modTitle.toLowerCase().includes(query) ||
      chapTitle.toLowerCase().includes(query)
    );
  });

  const filteredBookmarks = bookmarks.filter(b => {
    const mod = allModulesList.find(m => m.id === b.moduleId || m.slug === b.moduleId);
    const modTitle = mod ? mod.title : '';
    const chapTitle = mod ? mod.chapterTitle : '';
    const query = searchTerm.toLowerCase();

    return (
      b.textSnippet.toLowerCase().includes(query) ||
      modTitle.toLowerCase().includes(query) ||
      chapTitle.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 font-sans">
      {/* Page Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 ${theme.borderClass} pb-6`}>
        <div>
          <div className="flex items-center gap-2 text-[#1CB0F6] text-xs font-black uppercase tracking-widest">
            <BookmarkCheck className="w-4 h-4 stroke-[3]" />
            <span>Personal Study Hub</span>
          </div>
          <h2 className={`text-3xl font-black ${theme.headingText} mt-1`}>
            My Study Notes & Journal
          </h2>
          <p className={`text-xs font-bold ${theme.mutedText} mt-1`}>
            Review saved study notes and section bookmarks. Jump directly back to any lesson topic anytime.
          </p>
        </div>

        {reflections.length > 0 && (
          <button
            id="download-notes-pdf-btn"
            onClick={handleDownloadNotesPDF}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#58CC02] hover:bg-[#46A302] border-b-4 border-[#3B8702] active:border-b-0 active:translate-y-1 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all w-fit shrink-0"
          >
            <Download className="w-4 h-4 stroke-[3]" />
            <span>DOWNLOAD NOTES (PDF)</span>
          </button>
        )}
      </div>

      {/* Sub-Nav Toggle: Study Notes vs Bookmarks */}
      <div className={`flex items-center gap-2 p-1.5 ${theme.subNavBg} rounded-2xl border-2`}>
        <button
          id="tab-study-notes"
          onClick={() => setActiveSubTab('notes')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
            activeSubTab === 'notes'
              ? `${theme.cardBg} text-[#1CB0F6] shadow-md border-2 border-[#1CB0F6]/30`
              : `${theme.mutedText} hover:${theme.headingText}`
          }`}
        >
          <Edit3 className="w-4 h-4 stroke-[2.5]" />
          <span>Study Notes</span>
          <span className="px-2 py-0.5 rounded-full bg-[#1CB0F6]/10 text-[#1CB0F6] text-[10px] font-black">
            {reflections.length}
          </span>
        </button>

        <button
          id="tab-saved-bookmarks"
          onClick={() => setActiveSubTab('bookmarks')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
            activeSubTab === 'bookmarks'
              ? `${theme.cardBg} text-[#FFC800] shadow-md border-2 border-[#FFC800]/40`
              : `${theme.mutedText} hover:${theme.headingText}`
          }`}
        >
          <Bookmark className="w-4 h-4 stroke-[2.5]" />
          <span>Saved Bookmarks</span>
          <span className="px-2 py-0.5 rounded-full bg-[#FFC800]/20 text-amber-500 font-black">
            {bookmarks.length}
          </span>
        </button>
      </div>

      {/* Search Bar */}
      {(reflections.length > 0 || bookmarks.length > 0) && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-3.5 text-[#1CB0F6] stroke-[3]" />
          <input
            id="journal-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={activeSubTab === 'notes' ? "Search study notes or lesson topics..." : "Search bookmarked quotes or lessons..."}
            className={`w-full ${theme.inputClass} border-2 rounded-2xl pl-11 pr-4 py-3 text-sm font-bold focus:outline-none focus:border-[#1CB0F6] shadow-xs`}
          />
        </div>
      )}

      {/* TAB 1: STUDY NOTES */}
      {activeSubTab === 'notes' && (
        <div>
          {filteredReflections.length === 0 ? (
            <div className={`text-center py-16 ${theme.cardBg} border-2 ${theme.cardBorder} rounded-3xl space-y-3 shadow-xs`}>
              <Edit3 className="w-12 h-12 mx-auto text-[#FFC800] stroke-[2.5]" />
              <h3 className={`text-lg font-black ${theme.headingText}`}>
                No Study Notes Found
              </h3>
              <p className={`text-xs font-bold ${theme.mutedText} max-w-sm mx-auto`}>
                As you read lessons on your study path, type notes into the Lesson Notepad to save them here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredReflections.map((ref) => {
                const mod = allModulesList.find(m => m.id === ref.moduleId || m.slug === ref.moduleId);

                return (
                  <div 
                    key={ref.id || `${ref.moduleId}-${ref.questionIndex}`}
                    className={`${theme.cardBg} border-2 ${theme.cardBorder} border-b-4 border-[#1CB0F6] rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all`}
                  >
                    {/* Header */}
                    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 ${theme.borderClass} pb-3`}>
                      <div>
                        {mod && (
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#FFC800] bg-amber-950 px-2.5 py-0.5 rounded-full inline-block mb-1">
                            {mod.chapterTitle}
                          </span>
                        )}
                        <h3 className={`font-black text-base ${theme.headingText}`}>
                          {mod ? mod.title : `Module: ${ref.moduleId}`}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] ${theme.mutedText} font-black uppercase`}>
                          {new Date(ref.updatedAt).toLocaleDateString()}
                        </span>

                        <button
                          onClick={() => handleCopyText(ref.id || ref.moduleId, ref.answerText)}
                          className="p-2 rounded-xl text-[#1CB0F6] hover:bg-sky-50 dark:hover:bg-[#121E24] transition-colors"
                          title="Copy Note Text"
                        >
                          {copiedId === (ref.id || ref.moduleId) ? <Check className="w-4 h-4 text-[#58CC02] stroke-[3]" /> : <Copy className="w-4 h-4 stroke-[3]" />}
                        </button>

                        <button
                          onClick={() => handleDeleteNote(ref.id, ref.moduleId, ref.questionIndex)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-[#FF4B4B] rounded-xl border border-red-200 transition-all active:scale-95"
                          title="Delete Note"
                        >
                          <Trash2 className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>

                    {/* Content Box */}
                    <div className={`p-4 rounded-2xl ${theme.innerBox} border-2 text-sm font-bold leading-relaxed whitespace-pre-wrap`}>
                      {ref.answerText}
                    </div>

                    {/* Action Button */}
                    {mod && onSelectModule && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => onSelectModule(mod)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1CB0F6] hover:bg-[#189AD6] border-b-4 border-[#147FB3] active:border-b-0 active:translate-y-0.5 text-white font-black text-xs uppercase tracking-wider transition-all shadow-sm"
                        >
                          <BookOpen className="w-4 h-4 stroke-[3]" />
                          <span>Return to Lesson Topic</span>
                          <ArrowRight className="w-4 h-4 stroke-[3]" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED BOOKMARKS */}
      {activeSubTab === 'bookmarks' && (
        <div>
          {filteredBookmarks.length === 0 ? (
            <div className={`text-center py-16 ${theme.cardBg} border-2 ${theme.cardBorder} rounded-3xl space-y-3 shadow-xs`}>
              <Bookmark className="w-12 h-12 mx-auto text-[#FFC800] stroke-[2.5]" />
              <h3 className={`text-lg font-black ${theme.headingText}`}>
                No Bookmarks Saved Yet
              </h3>
              <p className={`text-xs font-bold ${theme.mutedText} max-w-sm mx-auto`}>
                While reading lesson sections, tap the "Bookmark" button at the top of any section to save key scriptures or points here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBookmarks.map((b) => {
                const mod = allModulesList.find(m => m.id === b.moduleId || m.slug === b.moduleId);
                const sectionObj = mod?.sections.find(s => s.id === b.sectionId);

                return (
                  <div 
                    key={b.id || `${b.moduleId}-${b.sectionId}`}
                    className={`${theme.cardBg} border-2 ${theme.cardBorder} border-b-4 border-[#FFC800] rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all`}
                  >
                    {/* Header */}
                    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 ${theme.borderClass} pb-3`}>
                      <div>
                        {mod && (
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#FFC800] bg-amber-950 px-2.5 py-0.5 rounded-full inline-block mb-1">
                            {mod.chapterTitle}
                          </span>
                        )}
                        <h3 className={`font-black text-base ${theme.headingText}`}>
                          {mod ? mod.title : `Module: ${b.moduleId}`}
                          {sectionObj && <span className="text-xs text-[#1CB0F6] font-bold block sm:inline sm:ml-2">• {sectionObj.title}</span>}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] ${theme.mutedText} font-black uppercase`}>
                          {new Date(b.createdAt).toLocaleDateString()}
                        </span>

                        <button
                          onClick={() => handleDeleteBookmark(b.id, b.moduleId, b.sectionId)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-[#FF4B4B] rounded-xl border border-red-200 transition-all active:scale-95"
                          title="Remove Bookmark"
                        >
                          <Trash2 className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>

                    {/* Bookmarked Text Snippet */}
                    <div className={`p-4 rounded-2xl ${theme.innerBox} border-2 text-sm font-bold leading-relaxed italic relative`}>
                      "{b.textSnippet}"
                    </div>

                    {/* Jump to Lesson Button */}
                    {mod && onSelectModule && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => onSelectModule(mod)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FFC800] hover:bg-[#e5b300] border-b-4 border-[#c79b00] active:border-b-0 active:translate-y-0.5 text-amber-950 font-black text-xs uppercase tracking-wider transition-all shadow-sm"
                        >
                          <BookOpen className="w-4 h-4 stroke-[3]" />
                          <span>Open Lesson Section</span>
                          <ArrowRight className="w-4 h-4 stroke-[3]" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

