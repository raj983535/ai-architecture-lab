import React from 'react';
import { BookOpen, Bookmark, ExternalLink, X } from 'lucide-react';
import { THEORY_DATA } from '../data/theoryData';

export const TheoryPanel = ({ activeTab, isOpen, onClose }) => {
  const currentTheory = THEORY_DATA[activeTab];

  if (!isOpen || !currentTheory) return null;

  return (
    <aside className="w-full xl:w-96 shrink-0 bg-slate-900 border-l border-slate-800 flex flex-col h-full shadow-2xl z-20 animate-fadeIn">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-purple-400" />
          <h3 className="font-bold text-white text-sm uppercase tracking-wider">Theory & Literature</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close Theory Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Module Title */}
      <div className="p-4 bg-purple-950/20 border-b border-slate-800">
        <div className="text-xs font-bold text-purple-300">{currentTheory.title}</div>
        <div className="text-[11px] text-slate-400 mt-0.5">{currentTheory.subtitle}</div>
      </div>

      {/* Concepts List */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
        {currentTheory.concepts.map((concept, idx) => (
          <div
            key={idx}
            className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 hover:border-purple-500/40 transition-all group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-slate-200 mb-1.5">
              <span>{concept.t}</span>
              <span className="text-[10px] bg-slate-900 text-purple-300 font-mono px-2 py-0.5 rounded border border-purple-500/30">
                {concept.cite}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
              {concept.d}
            </p>
          </div>
        ))}
      </div>

      {/* Footer Citation */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 text-center font-mono">
        Curated from <span className="text-purple-400">"Architecture of Intelligence"</span>
      </div>
    </aside>
  );
};
