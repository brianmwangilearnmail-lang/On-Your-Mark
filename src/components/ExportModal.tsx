import React, { useState } from 'react';
import { Book } from '../types';
import { generateSupabaseSQLSchema } from '../data/bookData';
import { Database, Download, Copy, Check, FileCode, Layers, ShieldCheck } from 'lucide-react';

interface ExportModalProps {
  book: Book;
}

export const ExportModal: React.FC<ExportModalProps> = ({ book }) => {
  const [copiedSql, setCopiedCopiedSql] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const jsonString = JSON.stringify(book, null, 2);
  const sqlString = generateSupabaseSQLSchema();

  const handleDownloadJSON = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ON_YOUR_MARK_Structured_Content.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSQL = () => {
    const blob = new Blob([sqlString], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'supabase_schema.sql');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(sqlString);
    setCopiedCopiedSql(true);
    setTimeout(() => setCopiedCopiedSql(false), 2000);
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(jsonString);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 font-sans">
      <div className="border-b-2 border-[#E5E5E5] pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#1CB0F6]">
          <Database className="w-4 h-4 stroke-[3]" />
          <span>Architectural Data & Supabase Integration</span>
        </div>
        <h2 className="text-3xl font-black text-[#4B4B4B]">
          Export Content Model & Database Schema
        </h2>
        <p className="text-xs font-bold text-[#777777] leading-relaxed">
          The complete verbatim text of "ON YOUR MARK" is structured hierarchically into Chapters → Modules → Sections → Reflections. Download JSON for Next.js/Android or copy the Supabase SQL schema.
        </p>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* JSON Export Card */}
        <div className="bg-white border-2 border-[#E5E5E5] border-b-4 border-[#1CB0F6] rounded-3xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 bg-[#1CB0F6]/10 rounded-2xl w-fit text-[#1CB0F6] border border-[#1CB0F6]/20">
              <FileCode className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-lg font-black text-[#4B4B4B]">
              Full Structured Content (JSON)
            </h3>
            <p className="text-xs font-bold text-[#777777] leading-relaxed">
              Complete machine-readable JSON containing all 8 Chapters, 36 Micro-Lesson Modules, verbatim text sections, reflection questions, and page routing slugs.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t-2 border-[#E5E5E5]">
            <button
              id="download-json-btn"
              onClick={handleDownloadJSON}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#58CC02] hover:bg-[#46A302] border-b-4 border-[#3B8702] active:border-b-0 active:translate-y-1 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all"
            >
              <Download className="w-4 h-4 stroke-[3]" />
              <span>Download JSON</span>
            </button>
            <button
              id="copy-json-btn"
              onClick={handleCopyJSON}
              className="px-4 py-3 rounded-2xl bg-white border-2 border-[#E5E5E5] border-b-4 text-[#1CB0F6] text-xs font-black uppercase tracking-wider transition-all hover:bg-slate-50"
              title="Copy JSON"
            >
              {copiedJson ? <Check className="w-4 h-4 text-[#58CC02] stroke-[3]" /> : <Copy className="w-4 h-4 stroke-[3]" />}
            </button>
          </div>
        </div>

        {/* Supabase Schema Export Card */}
        <div className="bg-white border-2 border-[#E5E5E5] border-b-4 border-[#FFC800] rounded-3xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 bg-[#FFC800]/20 rounded-2xl w-fit text-amber-950 border border-[#FFC800]/30">
              <Layers className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-lg font-black text-[#4B4B4B]">
              Supabase SQL DDL Schema
            </h3>
            <p className="text-xs font-bold text-[#777777] leading-relaxed">
              Production-ready PostgreSQL / Supabase migration script with foreign keys, enums, indexed fields, and Row Level Security (RLS) policies matching the PRD specification.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t-2 border-[#E5E5E5]">
            <button
              id="download-sql-btn"
              onClick={handleDownloadSQL}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#FFC800] hover:bg-amber-400 border-b-4 border-[#E0A800] active:border-b-0 active:translate-y-1 text-amber-950 font-black text-xs uppercase tracking-wider shadow-md transition-all"
            >
              <Download className="w-4 h-4 stroke-[3]" />
              <span>Download SQL</span>
            </button>
            <button
              id="copy-sql-btn"
              onClick={handleCopySQL}
              className="px-4 py-3 rounded-2xl bg-white border-2 border-[#E5E5E5] border-b-4 text-[#1CB0F6] text-xs font-black uppercase tracking-wider transition-all hover:bg-slate-50"
              title="Copy SQL Schema"
            >
              {copiedSql ? <Check className="w-4 h-4 text-[#58CC02] stroke-[3]" /> : <Copy className="w-4 h-4 stroke-[3]" />}
            </button>
          </div>
        </div>
      </div>

      {/* PRD Compliance Specs */}
      <div className="bg-white border-2 border-[#E5E5E5] border-b-4 border-[#1CB0F6] rounded-3xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-[#1CB0F6] font-black text-sm uppercase tracking-wider">
          <ShieldCheck className="w-5 h-5 stroke-[3]" />
          <span>PRD Implementation Specifications</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold text-[#4B4B4B]">
          <div className="bg-[#FFFBEB] p-4 rounded-2xl border-2 border-[#E5E5E5]">
            <span className="text-[#1CB0F6] block font-black uppercase mb-1">Hierarchy</span>
            Book → 8 Chapters → 36 Modules → 80+ Verbatim Sections
          </div>
          <div className="bg-[#FFFBEB] p-4 rounded-2xl border-2 border-[#E5E5E5]">
            <span className="text-[#1CB0F6] block font-black uppercase mb-1">Local Storage</span>
            IndexedDB via Dexie.js for queryable offline reading & reflection state
          </div>
          <div className="bg-[#FFFBEB] p-4 rounded-2xl border-2 border-[#E5E5E5]">
            <span className="text-[#1CB0F6] block font-black uppercase mb-1">Cross Platform</span>
            Identical JSON payload ready for Next.js App Router & Jetpack Compose Android
          </div>
        </div>
      </div>
    </div>
  );
};
