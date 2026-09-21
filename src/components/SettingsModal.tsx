import React, { useState } from "react";
import { X, Settings, Cpu, Key, Check, GitBranch } from "lucide-react";
import { AppSettings } from "../types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  if (!isOpen) return null;

  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(localSettings);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-2 sm:p-4 select-none">
      <div className="bg-[#0e111a] border border-neutral-800 w-full max-w-xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-neutral-800 text-cyan-400 shrink-0">
              <Settings className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-neutral-100">Aether Studio Configuration</h2>
              <p className="text-xs text-neutral-400">Engine parameters, API keys, and sandbox permissions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4 sm:space-y-5 min-h-0">
          {/* Agent V2 & Orchestration */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-neutral-200 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Autonomous Agent Engine
            </h3>
            <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-3.5 space-y-3">
              <label className="flex items-center justify-between cursor-pointer gap-2">
                <div>
                  <p className="text-xs font-medium text-neutral-200">Enable Agent V2 Multi-Step Tooling</p>
                  <p className="text-[11px] text-neutral-400">Allows the agent to plan, execute AST rewrites, and verify with tsgo</p>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.enableAgentV2}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, enableAgentV2: e.target.checked })
                  }
                  className="rounded bg-neutral-800 border-neutral-700 text-cyan-500 focus:ring-0 w-4 h-4 shrink-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-neutral-800 gap-2">
                <div>
                  <p className="text-xs font-medium text-neutral-200">Sandbox Script Execution</p>
                  <p className="text-[11px] text-neutral-400">Execute npm install and build commands within isolated container</p>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.enableSandboxScriptExecution}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      enableSandboxScriptExecution: e.target.checked,
                    })
                  }
                  className="rounded bg-neutral-800 border-neutral-700 text-cyan-500 focus:ring-0 w-4 h-4 shrink-0"
                />
              </label>
            </div>
          </div>

          {/* Model API Keys */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-neutral-200 flex items-center gap-2">
              <Key className="w-3.5 h-3.5 text-indigo-400" /> Reasoning Model Keys & Endpoints
            </h3>
            <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-3.5 space-y-3">
              <div>
                <label className="text-xs text-neutral-300 mb-1 block">Gemini API Key</label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={localSettings.geminiApiKey}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, geminiApiKey: e.target.value })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-300 mb-1 block">Anthropic API Key</label>
                <input
                  type="password"
                  placeholder="sk-ant-..."
                  value={localSettings.anthropicApiKey}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, anthropicApiKey: e.target.value })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-300 mb-1 block">Ollama Local Endpoint</label>
                <input
                  type="text"
                  placeholder="http://127.0.0.1:11434"
                  value={localSettings.ollamaHost}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, ollamaHost: e.target.value })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* GitHub Continuous Workspace Sync */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-neutral-200 flex items-center gap-2">
              <GitBranch className="w-3.5 h-3.5 text-emerald-400" /> GitHub Repository Sync (Desktop & Web)
            </h3>
            <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-3.5 space-y-3">
              <label className="flex items-center justify-between cursor-pointer gap-2">
                <div>
                  <p className="text-xs font-medium text-neutral-200">Auto-Sync on Every Commit</p>
                  <p className="text-[11px] text-neutral-400">
                    Pushes dual-target architecture (Electron Desktop + Vite Web) on every commit
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.githubSync?.enabled ?? false}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      githubSync: {
                        enabled: e.target.checked,
                        repoUrl: localSettings.githubSync?.repoUrl || "",
                        branch: localSettings.githubSync?.branch || "main",
                        token: localSettings.githubSync?.token || "",
                        autoSyncOnCommit: e.target.checked,
                        syncStatus: localSettings.githubSync?.syncStatus || "idle",
                      },
                    })
                  }
                  className="rounded bg-neutral-800 border-neutral-700 text-cyan-500 focus:ring-0 w-4 h-4 shrink-0"
                />
              </label>

              <div className="pt-2 border-t border-neutral-800 space-y-2.5">
                <div>
                  <label className="text-xs text-neutral-300 mb-1 block">GitHub Repository</label>
                  <input
                    type="text"
                    placeholder="owner/repo (e.g. octocat/my-app)"
                    value={localSettings.githubSync?.repoUrl || ""}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        githubSync: {
                          enabled: localSettings.githubSync?.enabled ?? true,
                          repoUrl: e.target.value,
                          branch: localSettings.githubSync?.branch || "main",
                          token: localSettings.githubSync?.token || "",
                          autoSyncOnCommit: localSettings.githubSync?.autoSyncOnCommit ?? true,
                          syncStatus: localSettings.githubSync?.syncStatus || "idle",
                        },
                      })
                    }
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-300 mb-1 block">Personal Access Token (PAT)</label>
                  <input
                    type="password"
                    placeholder="ghp_••••••••••••••••••••••••"
                    value={localSettings.githubSync?.token || ""}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        githubSync: {
                          enabled: localSettings.githubSync?.enabled ?? true,
                          repoUrl: localSettings.githubSync?.repoUrl || "",
                          branch: localSettings.githubSync?.branch || "main",
                          token: e.target.value,
                          autoSyncOnCommit: localSettings.githubSync?.autoSyncOnCommit ?? true,
                          syncStatus: localSettings.githubSync?.syncStatus || "idle",
                        },
                      })
                    }
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Save */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-neutral-500 font-mono">Aether Foundry v2.4.1 (Clean Build)</span>
            <div className="flex gap-2 justify-end">
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
                {savedNotice ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{savedNotice ? "Saved!" : "Save Preferences"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
