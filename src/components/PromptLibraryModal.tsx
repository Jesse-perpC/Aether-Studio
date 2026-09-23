import React, { useState } from "react";
import { X, Search, BookOpen, Copy, Check, ArrowRight } from "lucide-react";
import { PromptTemplate } from "../types";
import { PROMPT_LIBRARY_DATA } from "../data/mockData";

interface PromptLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUsePrompt: (content: string) => void;
}

export const PromptLibraryModal: React.FC<PromptLibraryModalProps> = ({
  isOpen,
  onClose,
  onUsePrompt,
}) => {
  if (!isOpen) return null;

  const [prompts] = useState<PromptTemplate[]>(PROMPT_LIBRARY_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ["All", "Refactoring", "Security", "Architectural", "Performance"];

  const filteredPrompts = prompts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-2 sm:p-4 select-none overflow-y-auto">
      <div className="bg-[#0e111a] border border-neutral-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-neutral-100">Prompt Engineering Catalog</h2>
              <p className="text-xs text-neutral-400">Curated high-precision system prompts for Aether Agent</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-3 sm:p-4 border-b border-neutral-800/80 bg-neutral-900/40 flex flex-col gap-2.5 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search prompts or task templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white font-medium"
                    : "bg-neutral-900 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Prompts Feed */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 min-h-0">
          {filteredPrompts.map((p) => (
            <div
              key={p.id}
              className="bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 rounded-xl p-3 sm:p-3.5 transition-all"
            >
              <div className="flex items-start justify-between gap-2.5 sm:gap-3 mb-1.5">
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase bg-neutral-800 text-indigo-300 px-2 py-0.5 rounded border border-neutral-700">
                    {p.category}
                  </span>
                  <h3 className="text-xs font-bold text-neutral-100 mt-1.5">{p.title}</h3>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCopy(p.id, p.content)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 cursor-pointer"
                    title="Copy Prompt"
                  >
                    {copiedId === p.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      onUsePrompt(p.content);
                      onClose();
                    }}
                    className="flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    <span>Use</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-neutral-400 mb-2 leading-relaxed">{p.description}</p>

              <div className="bg-neutral-950/80 p-2.5 rounded-lg border border-neutral-800/80 font-mono text-[11px] text-neutral-300 max-h-24 overflow-y-auto">
                {p.content}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-neutral-800 bg-[#0d0f17] flex items-center justify-between text-xs shrink-0 flex-wrap gap-2">
          <span className="text-[10px] text-neutral-400 font-mono">
            Perp Corp Media & AI Solutions • <span className="text-cyan-400 font-semibold">Jesse Lepota</span>
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors cursor-pointer ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
