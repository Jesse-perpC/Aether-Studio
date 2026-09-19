import React from "react";
import { 
  Settings, 
  Play, 
  Square, 
  BookOpen, 
  Blocks, 
  ChevronDown,
  Plus
} from "lucide-react";
import { AppRecord, ChatMode } from "../types";

interface HeaderProps {
  activeApp: AppRecord;
  apps: AppRecord[];
  onSelectApp: (app: AppRecord) => void;
  onNewApp: () => void;
  onOpenSettings: () => void;
  onOpenPrompts: () => void;
  onOpenMcp: () => void;
  onToggleAppStatus: () => void;
  chatMode: ChatMode;
  onChangeChatMode: (mode: ChatMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeApp,
  apps,
  onSelectApp,
  onNewApp,
  onOpenSettings,
  onOpenPrompts,
  onOpenMcp,
  onToggleAppStatus,
  chatMode,
  onChangeChatMode,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <header className="h-14 border-b border-neutral-800/80 bg-[#0d0f17]/95 backdrop-blur-md px-2.5 sm:px-4 flex items-center justify-between select-none z-30 overflow-x-auto no-scrollbar">
      {/* Brand & App Selector */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-cyan-600 via-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-black text-xs sm:text-sm tracking-wider border border-cyan-400/30 shrink-0">
            Æ
          </div>
          <div className="hidden xs:block sm:block">
            <span className="font-bold text-xs sm:text-sm tracking-wide text-neutral-100 flex items-center gap-1">
              Aether <span className="text-cyan-400 font-normal text-[10px] sm:text-xs uppercase px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/50 hidden md:inline">Studio</span>
            </span>
          </div>
        </div>

        <div className="h-4 w-[1px] bg-neutral-800 mx-0.5 hidden sm:block shrink-0" />

        {/* Current Active App Picker Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 rounded-md bg-neutral-900/90 hover:bg-neutral-800 text-xs text-neutral-200 border border-neutral-700/60 transition-all cursor-pointer max-w-[130px] sm:max-w-[170px]"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0"></span>
            <span className="font-medium truncate">{activeApp.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-64 max-w-[calc(100vw-2rem)] bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl p-1.5 z-50">
              <div className="text-[11px] font-semibold text-neutral-400 px-2 py-1 uppercase tracking-wider">
                Workspace Applications
              </div>
              <div className="space-y-0.5 max-h-56 overflow-y-auto">
                {apps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => {
                      onSelectApp(app);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-md text-xs flex items-center justify-between transition-colors ${
                      app.id === activeApp.id
                        ? "bg-cyan-950/70 text-cyan-200 border border-cyan-800/40"
                        : "text-neutral-300 hover:bg-neutral-800/70"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-medium truncate">{app.name}</div>
                      <div className="text-[10px] text-neutral-400 font-mono truncate">{app.template}</div>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ${
                      app.status === "running" ? "bg-emerald-950 text-emerald-400" : "bg-neutral-800 text-neutral-400"
                    }`}>
                      {app.status}
                    </span>
                  </button>
                ))}
              </div>
              <div className="pt-1.5 mt-1.5 border-t border-neutral-800">
                <button
                  onClick={() => {
                    onNewApp();
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 py-1.5 rounded-md hover:bg-cyan-950/40 font-medium cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Initialize New App
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Runtime Port & Status indicator */}
        <div className="hidden xl:flex items-center gap-2 text-[11px] text-neutral-400 bg-neutral-900/60 px-2.5 py-1 rounded border border-neutral-800 shrink-0">
          <span className={`w-1.5 h-1.5 rounded-full ${activeApp.status === "running" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
          <span>Local Node:</span>
          <span className="font-mono text-neutral-300">:{activeApp.port}</span>
        </div>
      </div>

      {/* Center: Chat / Orchestration Mode Toggle */}
      <div className="hidden lg:flex items-center bg-neutral-900/80 p-0.5 rounded-lg border border-neutral-800 shrink-0 mx-2">
        {(["local-agent", "build", "ask", "plan"] as ChatMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => onChangeChatMode(mode)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-all cursor-pointer ${
              chatMode === mode
                ? "bg-cyan-600/90 text-neutral-950 shadow-sm font-semibold"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
            }`}
          >
            {mode === "local-agent" ? "Local Agent" : mode}
          </button>
        ))}
      </div>

      {/* Right: Controls & Utilities */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-2">
        {/* Run / Stop App */}
        <button
          onClick={onToggleAppStatus}
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
            activeApp.status === "running"
              ? "bg-amber-950/60 text-amber-300 hover:bg-amber-900/60 border border-amber-700/50"
              : "bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-700/50"
          }`}
          title={activeApp.status === "running" ? "Stop local sandbox server" : "Start local server"}
        >
          {activeApp.status === "running" ? (
            <>
              <Square className="w-3 h-3 fill-amber-300" />
              <span className="hidden sm:inline">Stop</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-emerald-300" />
              <span className="hidden sm:inline">Run</span>
            </>
          )}
        </button>

        {/* MCP Extensions */}
        <button
          onClick={onOpenMcp}
          className="p-1.5 sm:p-2 rounded-md hover:bg-neutral-800 text-neutral-300 hover:text-neutral-100 transition-colors cursor-pointer"
          title="Model Context Protocol (MCP) Extensions"
        >
          <Blocks className="w-4 h-4 text-cyan-400" />
        </button>

        {/* Prompt Library */}
        <button
          onClick={onOpenPrompts}
          className="p-1.5 sm:p-2 rounded-md hover:bg-neutral-800 text-neutral-300 hover:text-neutral-100 transition-colors cursor-pointer"
          title="Prompt Engineering Library"
        >
          <BookOpen className="w-4 h-4 text-indigo-400" />
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 sm:p-2 rounded-md hover:bg-neutral-800 text-neutral-300 hover:text-neutral-100 transition-colors cursor-pointer"
          title="Engine & Sandbox Settings"
        >
          <Settings className="w-4 h-4 text-neutral-400" />
        </button>
      </div>
    </header>
  );
};
