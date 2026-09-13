import React, { useState } from 'react';
import { X, Search, ArrowRight, Terminal } from 'lucide-react';
import { PROMPT_LIBRARY } from '../data/mockApps';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (promptText: string) => void;
}

export const PromptLibraryModal: React.FC<Props> = ({ isOpen, onClose, onSelectPrompt }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Feature', 'Design', 'Backend', 'Fix'];

  const filtered = PROMPT_LIBRARY.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.prompt.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#0e121a] border border-cyan-500/30 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col max-h-[85vh] font-sans">
        {/* Modal Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-mono text-white uppercase tracking-tight">
                Neural Prompt Codex
              </h2>
              <p className="text-[11px] text-neutral-400">Calibrated directives for Aether autonomous execution modes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Categories */}
        <div className="p-4 border-b border-neutral-800/80 space-y-3 bg-[#0a0c12]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search prompt blueprints by keyword, framework, or capability..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#07080d] border border-neutral-800 rounded-xl text-xs font-mono text-white placeholder-neutral-500 focus:outline-hidden focus:border-cyan-500/60 transition"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 shadow-xs'
                    : 'bg-[#07080d] text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt List */}
        <div className="overflow-y-auto p-4 space-y-2.5 flex-1">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-[#0a0c12] border border-neutral-800/80 hover:border-cyan-500/30 transition group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold font-mono text-white group-hover:text-cyan-300 transition">
                      {item.title}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#07080d] text-cyan-400/80 border border-cyan-500/20">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mb-2">{item.description}</p>
                  <p className="text-[11px] font-mono text-neutral-400 bg-[#07080d] p-2 rounded-lg border border-neutral-800/80 line-clamp-2">
                    {item.prompt}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onSelectPrompt(item.prompt);
                    onClose();
                  }}
                  className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600 hover:to-blue-600 border border-cyan-500/40 text-cyan-300 hover:text-white rounded-lg text-xs font-mono font-semibold transition cursor-pointer"
                >
                  INJECT <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-12 text-center text-xs font-mono text-neutral-500">
              No matching neural directives found. Modify search vectors.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
