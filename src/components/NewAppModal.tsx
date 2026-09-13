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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#141519] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Create New Dyad App</h2>
              <p className="text-xs text-neutral-400">Scaffold a new local project in workspace</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-neutral-300 font-medium mb-1.5">App Name</label>
            <input
              type="text"
              placeholder="e.g. AI Customer Support Widget"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-hidden focus:border-indigo-500"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-neutral-300 font-medium mb-1.5">Description</label>
            <textarea
              placeholder="What does this app do?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 resize-none focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-neutral-300 font-medium mb-1.5">Runtime Architecture</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAppType('react-vite')}
                className={`p-3 rounded-xl border text-left transition ${
                  appType === 'react-vite'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white font-medium'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <div className="font-semibold text-xs">React + Vite</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Ultra-fast SPA (Recommended)</div>
              </button>

              <button
                type="button"
                onClick={() => setAppType('nextjs')}
                className={`p-3 rounded-xl border text-left transition ${
                  appType === 'nextjs'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white font-medium'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <div className="font-semibold text-xs">Next.js App Router</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Fullstack with API routes</div>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Create Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
