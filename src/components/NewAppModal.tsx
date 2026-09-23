import React, { useState } from "react";
import { X, Sparkles, Box } from "lucide-react";
import { AppRecord } from "../types";

interface NewAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateApp: (app: Partial<AppRecord>) => void;
}

const TEMPLATES = [
  {
    id: "vite-react",
    name: "Vite + React 19 (Tailwind CSS)",
    description: "Ultra-fast client bundle with Tailwind v4, Lucide icons, and hot module replacement.",
    tag: "Recommended",
  },
  {
    id: "nextjs-app",
    name: "Next.js 15 App Router",
    description: "Full-stack server actions, streaming SSR, and edge route support.",
    tag: "Full-Stack",
  },
  {
    id: "node-agent",
    name: "Autonomous Node.js Agent Host",
    description: "Headless daemon with MCP server integration, SQLite ORM, and WebSocket feed.",
    tag: "Backend",
  },
];

export const NewAppModal: React.FC<NewAppModalProps> = ({
  isOpen,
  onClose,
  onCreateApp,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("Vite React Template");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateApp({
      name: name.trim(),
      description: description.trim() || "Dynamic application created in Aether Studio.",
      template: selectedTemplate,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-2 sm:p-4 select-none overflow-y-auto">
      <div className="bg-[#0e111a] border border-neutral-800 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden my-auto">
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0">
              <Box className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-neutral-100">Initialize New Application</h2>
              <p className="text-xs text-neutral-400">Scaffold a fresh sandbox container with pre-configured toolchains</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-3.5 sm:p-5 space-y-3.5 sm:space-y-4 overflow-y-auto flex-1 min-h-0">
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">Application Name</label>
            <input
              type="text"
              placeholder="e.g. Nexus Neural Matrix"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">Description</label>
            <textarea
              placeholder="Brief summary of app purpose and features..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-2">Foundation Template</label>
            <div className="space-y-2">
              {TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl.name)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedTemplate === tpl.name
                      ? "bg-cyan-950/40 border-cyan-700 text-neutral-100"
                      : "bg-neutral-900/60 border-neutral-800/80 text-neutral-400 hover:border-neutral-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                    <span className="text-xs font-bold text-neutral-200">{tpl.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-cyan-400 border border-neutral-700">
                      {tpl.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400">{tpl.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-neutral-800 shrink-0">
            <span className="text-[10px] text-neutral-400 font-mono">
              Perp Corp Media & AI Solutions • <span className="text-cyan-400">Jesse Lepota</span>
            </span>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> Scaffold Application
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
