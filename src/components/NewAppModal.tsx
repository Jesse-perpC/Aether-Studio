import React, { useState } from 'react';
import { X, FolderPlus, Rocket } from 'lucide-react';

interface NewAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateApp: (name: string, description: string, templateType: 'react-vite' | 'nextjs') => void;
}

export const NewAppModal: React.FC<NewAppModalProps> = ({ isOpen, onClose, onCreateApp }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [appType, setAppType] = useState<'react-vite' | 'nextjs'>('react-vite');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateApp(name.trim(), description.trim(), appType);
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#0e121a] border border-cyan-500/30 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] overflow-hidden font-sans">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-mono text-white uppercase tracking-tight">
                Initialize Aether Project
              </h2>
              <p className="text-[11px] text-neutral-400">Scaffold isolated workspace container</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-neutral-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-neutral-300 font-mono text-[11px] mb-1.5">PROJECT DESIGNATION</label>
            <input
              type="text"
              placeholder="e.g. Neural Vector Visualizer"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#07080d] border border-neutral-800 rounded-xl text-white placeholder-neutral-600 font-mono focus:outline-hidden focus:border-cyan-500/60"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-neutral-300 font-mono text-[11px] mb-1.5">OPERATIONAL SPECIFICATION</label>
            <textarea
              placeholder="What task will this neural application perform?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-[#07080d] border border-neutral-800 rounded-xl text-white placeholder-neutral-600 resize-none font-sans focus:outline-hidden focus:border-cyan-500/60"
            />
          </div>

          <div>
            <label className="block text-neutral-300 font-mono text-[11px] mb-1.5">RUNTIME STACK</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAppType('react-vite')}
                className={`p-3 rounded-xl border text-left transition ${
                  appType === 'react-vite'
                    ? 'bg-cyan-500/15 border-cyan-500/50 text-white font-medium shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                    : 'bg-[#07080d] border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <div className="font-mono font-bold text-xs text-cyan-300">React + Vite</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">High-speed SPA (Recommended)</div>
              </button>

              <button
                type="button"
                onClick={() => setAppType('nextjs')}
                className={`p-3 rounded-xl border text-left transition ${
                  appType === 'nextjs'
                    ? 'bg-cyan-500/15 border-cyan-500/50 text-white font-medium shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                    : 'bg-[#07080d] border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <div className="font-mono font-bold text-xs text-neutral-300">Next.js App Router</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Fullstack with API routes</div>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-neutral-400 hover:text-white font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-mono font-bold rounded-xl flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.25)] transition cursor-pointer"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>SCAFFOLD</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
