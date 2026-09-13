import React, { useState } from 'react';
import {
  Zap,
  FolderGit2,
  Plus,
  ChevronDown,
  Layers,
  Code2,
  LayoutGrid,
  Settings as SettingsIcon,
  Download,
  Rocket,
  Activity,
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
    <header className="h-14 bg-[#090b10] border-b border-cyan-500/20 px-4 flex items-center justify-between select-none z-30 shrink-0 shadow-lg shadow-black/40">
      {/* Brand & App Selector */}
      <div className="flex items-center gap-3">
        {/* Futuristic Brand Badge */}
        <div className="flex items-center gap-2.5 pr-3 border-r border-neutral-800/80">
          <div className="relative group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-indigo-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black text-sm shadow-[0_0_12px_rgba(6,182,212,0.25)]">
              <Zap className="w-4 h-4 text-cyan-300" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-[#090b10] animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-wider text-white uppercase font-mono">
                Aether
              </span>
              <span className="text-[9px] bg-cyan-950/80 text-cyan-300 font-mono px-1.5 py-0.5 rounded border border-cyan-500/30 tracking-widest font-semibold">
                v2.4.0
              </span>
            </div>
            <p className="text-[9px] text-neutral-500 font-mono tracking-tight hidden sm:block">
              NEURAL FOUNDRY
            </p>
          </div>
        </div>

        {/* App Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#0e1118] hover:bg-[#141824] border border-neutral-800 hover:border-cyan-500/30 text-xs font-medium text-neutral-200 transition"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="max-w-[130px] truncate font-medium">{currentApp.name}</span>
            <ChevronDown className="w-3 h-3 text-neutral-400 ml-0.5" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-64 bg-[#0d1017] border border-cyan-500/30 rounded-xl shadow-2xl py-1.5 z-50 backdrop-blur-xl">
              <div className="px-3 py-1 text-[10px] font-mono tracking-wider text-cyan-400/80 uppercase">
                Active Projects
              </div>
              {apps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => {
                    onSelectApp(app);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#141926] transition ${
                    app.id === currentApp.id
                      ? 'text-cyan-300 bg-cyan-500/10 font-semibold border-l-2 border-cyan-400'
                      : 'text-neutral-300'
                  }`}
                >
                  <span className="truncate">{app.name}</span>
                  <span className="text-[10px] font-mono text-neutral-500">{app.category}</span>
                </button>
              ))}
              <div className="my-1 border-t border-neutral-800" />
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  onNewApp();
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-cyan-400 hover:bg-cyan-500/10 flex items-center gap-2 font-medium transition font-mono"
              >
                <Plus className="w-3.5 h-3.5" />
                + INITIALIZE NEW PROJECT...
              </button>
            </div>
          )}
        </div>

        {/* Telemetry Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-950/30 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>PORT 3000 • ONLINE</span>
          <span className="text-neutral-600">|</span>
          <Activity className="w-3 h-3 text-cyan-400" />
          <span className="text-neutral-400">0.4ms</span>
        </div>
      </div>

      {/* Main View Tabs (Futuristic Cyber HUD) */}
      <nav className="flex items-center bg-[#0d1017] border border-neutral-800 rounded-lg p-0.5 text-xs font-medium font-mono">
        <button
          onClick={() => onSelectTab('studio')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
            activeTab === 'studio'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-xs'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          STUDIO
        </button>

        <button
          onClick={() => onSelectTab('code')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
            activeTab === 'code'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-xs'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          SYNTAX & DIFFS
        </button>

        <button
          onClick={() => onSelectTab('templates')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
            activeTab === 'templates'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-xs'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          SCAFFOLDS
        </button>

        <button
          onClick={() => onSelectTab('releases')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
            activeTab === 'releases'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-xs'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Rocket className="w-3.5 h-3.5 text-cyan-400" />
          MATRIX & CI
        </button>

        <button
          onClick={() => onSelectTab('settings')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
            activeTab === 'settings'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-xs'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <SettingsIcon className="w-3.5 h-3.5" />
          CONFIG
        </button>
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onExportApp}
          title="Export current project bundle"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0e1118] hover:bg-cyan-950/40 border border-neutral-800 hover:border-cyan-500/30 text-xs font-mono text-cyan-400 font-medium transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">EXPORT BUNDLE</span>
        </button>
      </div>
    </header>
  );
};
