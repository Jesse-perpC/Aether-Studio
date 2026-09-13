import React, { useState } from 'react';
import {
  Sparkles,
  FolderOpen,
  Plus,
  ChevronDown,
  Layers,
  Code2,
  LayoutGrid,
  Settings as SettingsIcon,
  Download,
  CheckCircle2,
  Rocket,
} from 'lucide-react';
import { ViewTab, DyadApp } from '../types';

interface HeaderProps {
  currentApp: DyadApp;
  apps: DyadApp[];
  onSelectApp: (app: DyadApp) => void;
  onNewApp: () => void;
  activeTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  onExportApp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentApp,
  apps,
  onSelectApp,
  onNewApp,
  activeTab,
  onSelectTab,
  onExportApp,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="h-13 bg-[#111215] border-b border-neutral-800/80 px-4 flex items-center justify-between select-none z-20 shrink-0">
      {/* Brand & App Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 pr-3 border-r border-neutral-800">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-sm shadow-inner">
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm tracking-tight text-white">Dyad</span>
              <span className="text-[10px] bg-neutral-800 text-neutral-400 font-mono px-1.5 py-0.2 rounded border border-neutral-700/60">
                v1.15.0
              </span>
            </div>
          </div>
        </div>

        {/* App Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 text-xs font-medium text-neutral-200 transition"
          >
            <FolderOpen className="w-3.5 h-3.5 text-neutral-400" />
            <span className="max-w-[140px] truncate">{currentApp.name}</span>
            <ChevronDown className="w-3 h-3 text-neutral-400 ml-1" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-60 bg-[#16171b] border border-neutral-800 rounded-xl shadow-2xl py-1.5 z-50">
              <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-neutral-500 uppercase">
                Your Apps
              </div>
              {apps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => {
                    onSelectApp(app);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-neutral-800/60 transition ${
                    app.id === currentApp.id ? 'text-indigo-400 bg-indigo-500/10 font-medium' : 'text-neutral-300'
                  }`}
                >
                  <span className="truncate">{app.name}</span>
                  <span className="text-[10px] text-neutral-500">{app.category}</span>
                </button>
              ))}
              <div className="my-1 border-t border-neutral-800" />
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  onNewApp();
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-indigo-400 hover:bg-indigo-500/10 flex items-center gap-2 font-medium transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Create New App...
              </button>
            </div>
          )}
        </div>

        {/* Runtime Status Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-medium">
          <CheckCircle2 className="w-3 h-3" />
          <span>Dev Server Online (Port 3000)</span>
        </div>
      </div>

      {/* Main View Tabs */}
      <nav className="flex items-center bg-neutral-900/90 border border-neutral-800/90 rounded-lg p-0.5 text-xs font-medium">
        <button
          onClick={() => onSelectTab('studio')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
            activeTab === 'studio'
              ? 'bg-neutral-800 text-white shadow-xs'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Studio
        </button>

        <button
          onClick={() => onSelectTab('code')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
            activeTab === 'code'
              ? 'bg-neutral-800 text-white shadow-xs'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          Code & Diffs
        </button>

        <button
          onClick={() => onSelectTab('templates')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
            activeTab === 'templates'
              ? 'bg-neutral-800 text-white shadow-xs'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          Templates
        </button>

        <button
          onClick={() => onSelectTab('releases')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
            activeTab === 'releases'
              ? 'bg-neutral-800 text-white shadow-xs'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Rocket className="w-3.5 h-3.5 text-indigo-400" />
          Releases & CI
        </button>

        <button
          onClick={() => onSelectTab('settings')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
            activeTab === 'settings'
              ? 'bg-neutral-800 text-white shadow-xs'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <SettingsIcon className="w-3.5 h-3.5" />
          Settings
        </button>
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onExportApp}
          title="Export current project files as JSON/ZIP"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-300 font-medium transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </header>
  );
};
