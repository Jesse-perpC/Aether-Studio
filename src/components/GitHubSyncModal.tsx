import React, { useState, useEffect, useMemo } from "react";
import { 
  GitBranch, 
  GitCommit, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Layers, 
  FileCode, 
  Check, 
  Eye, 
  EyeOff, 
  Globe, 
  Monitor, 
  Smartphone,
  Folder, 
  ShieldCheck, 
  Send,
  Download,
  Search,
  Sparkles,
  Workflow,
  Plus
} from "lucide-react";
import JSZip from "jszip";
import { AppRecord, GitHubBranch, GitHubSyncConfig, WorkspaceCommit, WorkspaceTarget } from "../types";
import { 
  testGitHubConnection, 
  GitHubRepoInfo, 
  parseGitHubRepo,
  fetchGitHubBranches,
  createGitHubBranch
} from "../utils/githubSyncService";
import { generateDualWorkspaceStructure } from "../utils/workspaceStructureGenerator";

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GitHubSyncConfig;
  onSaveConfig: (config: GitHubSyncConfig) => void;
  app: AppRecord;
  commits: WorkspaceCommit[];
  onManualSync: (commitMessage?: string) => Promise<void>;
  isSyncing: boolean;
}

const DEFAULT_BRANCH_SUGGESTIONS: GitHubBranch[] = [
  { name: "main", commitSha: "", isProtected: true, isDefault: true },
  { name: "develop", commitSha: "", isProtected: false },
  { name: "feature/mobile-app", commitSha: "", isProtected: false },
  { name: "feature/windows-desktop", commitSha: "", isProtected: false },
  { name: "staging", commitSha: "", isProtected: false },
  { name: "preview", commitSha: "", isProtected: false },
];

const COMMIT_SUGGESTIONS = [
  "feat: update application UI and state logic",
  "mobile: synchronize Android APK assets & Capacitor configuration",
  "desktop: configure Windows Electron Forge installer package",
  "build: trigger automated Android & Windows CI/CD compilation",
  "chore: sync multi-target workspace across web, desktop, and mobile",
  "style: polish responsive layouts for mobile and desktop screens",
];

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  app,
  commits,
  onManualSync,
  isSyncing,
}) => {
  if (!isOpen) return null;

  const [localConfig, setLocalConfig] = useState<GitHubSyncConfig>(config);
  const [activeTab, setActiveTab] = useState<"settings" | "sync_display" | "history" | "cicd">("settings");
  const [showToken, setShowToken] = useState(false);
  const [testState, setTestState] = useState<{
    loading: boolean;
    repoInfo?: GitHubRepoInfo;
    error?: string;
  }>({ loading: false });
  const [customCommitMessage, setCustomCommitMessage] = useState("");
  const [selectedPreviewFile, setSelectedPreviewFile] = useState<string>("README.md");
  const [savedBanner, setSavedBanner] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [targetFilter, setTargetFilter] = useState<"all" | WorkspaceTarget>("all");
  const [isExportingZip, setIsExportingZip] = useState(false);

  // Branch management states
  const [branches, setBranches] = useState<GitHubBranch[]>(DEFAULT_BRANCH_SUGGESTIONS);
  const [isFetchingBranches, setIsFetchingBranches] = useState(false);
  const [showNewBranchInput, setShowNewBranchInput] = useState(false);
  const [newBranchInput, setNewBranchInput] = useState("");
  const [branchActionStatus, setBranchActionStatus] = useState<string | null>(null);

  // Generate real-time dual/triple multi-target structure preview
  const multiTargetStructure = useMemo(() => generateDualWorkspaceStructure(app), [app]);
  const previewFilesList = Object.keys(multiTargetStructure.files);

  const parsedRepo = parseGitHubRepo(localConfig.repoUrl);

  // Fetch branches from GitHub
  const handleFetchBranches = async () => {
    if (!localConfig.repoUrl || !localConfig.token) return;
    setIsFetchingBranches(true);
    setBranchActionStatus(null);
    const res = await fetchGitHubBranches(localConfig.repoUrl, localConfig.token);
    setIsFetchingBranches(false);
    if (res.ok && res.branches.length > 0) {
      setBranches(res.branches);
      setBranchActionStatus(`Loaded ${res.branches.length} branches from GitHub`);
      setTimeout(() => setBranchActionStatus(null), 3000);
    } else if (res.error) {
      setBranchActionStatus(`Warning: ${res.error}`);
    }
  };

  // Automatically attempt branch fetch when repo & token exist
  useEffect(() => {
    if (localConfig.repoUrl && localConfig.token && localConfig.token.startsWith("ghp_")) {
      handleFetchBranches();
    }
  }, [localConfig.repoUrl]);

  const handleTestConnection = async () => {
    setTestState({ loading: true });
    const res = await testGitHubConnection(localConfig.repoUrl, localConfig.token);
    if (res.ok && res.repoInfo) {
      setTestState({ loading: false, repoInfo: res.repoInfo });
      if (!localConfig.branch && res.repoInfo.defaultBranch) {
        setLocalConfig((prev) => ({ ...prev, branch: res.repoInfo!.defaultBranch }));
      }
      // Also fetch remote branches
      handleFetchBranches();
    } else {
      setTestState({ loading: false, error: res.error || "Connection failed." });
    }
  };

  const handleCreateNewBranch = async () => {
    const cleanBranch = newBranchInput.trim();
    if (!cleanBranch) return;

    if (localConfig.repoUrl && localConfig.token) {
      setBranchActionStatus("Creating branch on GitHub...");
      const res = await createGitHubBranch(
        localConfig.repoUrl,
        localConfig.token,
        cleanBranch,
        localConfig.branch || "main"
      );
      if (res.ok) {
        setBranches((prev) => [{ name: cleanBranch, commitSha: "", isProtected: false }, ...prev]);
        setLocalConfig((prev) => ({ ...prev, branch: cleanBranch }));
        setShowNewBranchInput(false);
        setNewBranchInput("");
        setBranchActionStatus(`Switched to new branch '${cleanBranch}'!`);
        setTimeout(() => setBranchActionStatus(null), 3500);
      } else {
        setBranchActionStatus(`Failed: ${res.error}`);
      }
    } else {
      // Local addition
      setBranches((prev) => [{ name: cleanBranch, commitSha: "", isProtected: false }, ...prev]);
      setLocalConfig((prev) => ({ ...prev, branch: cleanBranch }));
      setShowNewBranchInput(false);
      setNewBranchInput("");
    }
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSaveConfig(localConfig);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2000);
  };

  const handleTriggerSync = async () => {
    onSaveConfig(localConfig);
    const msg = customCommitMessage.trim() || `chore(sync): update ${app.name} workspace across web, desktop, and mobile`;
    await onManualSync(msg);
    setCustomCommitMessage("");
  };

  const handleDownloadZip = async () => {
    setIsExportingZip(true);
    try {
      const zip = new JSZip();
      for (const [filePath, content] of Object.entries(multiTargetStructure.files)) {
        zip.file(filePath, content);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${app.name.toLowerCase().replace(/[^a-z0-9-_]/g, "-")}-workspace.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate zip", err);
    } finally {
      setIsExportingZip(false);
    }
  };

  // Helper to categorize file
  const getFileTarget = (path: string): WorkspaceTarget => {
    if (path.startsWith("web/")) return "web";
    if (path.startsWith("desktop/")) return "desktop";
    if (path.startsWith("mobile/")) return "mobile";
    if (path.startsWith(".github/")) return "workflow";
    return "root";
  };

  // Filtered files for File Sync Display
  const filteredFiles = useMemo(() => {
    return previewFilesList.filter((filePath) => {
      const target = getFileTarget(filePath);
      const matchesTarget = targetFilter === "all" || target === targetFilter;
      const matchesSearch = !searchQuery.trim() || filePath.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTarget && matchesSearch;
    });
  }, [previewFilesList, targetFilter, searchQuery]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 select-none overflow-y-auto">
      <div className="bg-[#0e111a] border border-neutral-800 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[94vh] sm:max-h-[90vh] overflow-hidden my-auto">
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-neutral-800 flex items-center justify-between shrink-0 bg-[#0d0f17]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-neutral-800 text-cyan-400 shrink-0">
              <GitBranch className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-bold text-neutral-100">GitHub Workspace Sync</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-mono">
                  Web • Desktop • Mobile (Android & Windows CI)
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Continuous repository synchronization with automated Android APK & Windows builds
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="h-10 border-b border-neutral-800 bg-[#090b10] px-3 sm:px-4 flex items-center gap-1 text-xs shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "settings"
                ? "bg-neutral-800 text-cyan-400 font-semibold"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Repository & Branch</span>
          </button>

          <button
            onClick={() => setActiveTab("sync_display")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "sync_display"
                ? "bg-neutral-800 text-cyan-400 font-semibold"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>File Sync Display</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-700 text-neutral-300 font-mono">
              {previewFilesList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "history"
                ? "bg-neutral-800 text-cyan-400 font-semibold"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>Commit & Push</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-700 text-neutral-300 font-mono">
              {commits.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("cicd")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "cicd"
                ? "bg-neutral-800 text-cyan-400 font-semibold"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Workflow className="w-3.5 h-3.5 text-emerald-400" />
            <span>CI/CD Android & Windows</span>
          </button>
        </div>

        {/* Tab 1: Repository, Branch Selector & Auth Settings */}
        {activeTab === "settings" && (
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4 min-h-0">
            {/* Sync Toggle */}
            <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                  <RefreshCw className={`w-3.5 h-3.5 ${localConfig.enabled ? "text-cyan-400" : "text-neutral-500"}`} />
                  Auto-Sync on Every Commit
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Every workspace commit synchronizes Web, Desktop, Mobile, and CI/CD files to GitHub
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localConfig.enabled}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      enabled: e.target.checked,
                      autoSyncOnCommit: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>

            {/* Target GitHub Repository */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-300">
                  Target GitHub Repository
                </label>
                <span className="text-[11px] text-neutral-500 font-mono">owner/repo or URL</span>
              </div>
              <input
                type="text"
                placeholder="username/my-app"
                value={localConfig.repoUrl}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, repoUrl: e.target.value })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
              {parsedRepo && (
                <p className="text-[11px] text-cyan-400 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3 h-3" /> Target repo: {parsedRepo.owner}/{parsedRepo.repo}
                </p>
              )}
            </div>

            {/* Branch Selector Dropdown & Switcher */}
            <div className="space-y-1.5 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                  Target Branch Selector
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleFetchBranches}
                    disabled={isFetchingBranches || !localConfig.repoUrl}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono disabled:opacity-50 cursor-pointer"
                    title="Fetch all branches from remote GitHub repository"
                  >
                    <RefreshCw className={`w-3 h-3 ${isFetchingBranches ? "animate-spin" : ""}`} />
                    <span>Fetch Branches</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewBranchInput(!showNewBranchInput)}
                    className="text-[11px] text-neutral-400 hover:text-neutral-200 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>New Branch</span>
                  </button>
                </div>
              </div>

              {/* Branch Selector Dropdown */}
              <div className="flex gap-2">
                <select
                  value={localConfig.branch || "main"}
                  onChange={(e) => setLocalConfig({ ...localConfig, branch: e.target.value })}
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 font-mono cursor-pointer"
                >
                  {branches.map((b) => (
                    <option key={b.name} value={b.name}>
                      {b.name} {b.isDefault ? "(default)" : ""} {b.isProtected ? "🔒" : ""}
                    </option>
                  ))}
                  {!branches.some((b) => b.name === (localConfig.branch || "main")) && (
                    <option value={localConfig.branch}>
                      {localConfig.branch} (custom)
                    </option>
                  )}
                </select>

                <div className="flex items-center px-3 py-1 rounded-lg bg-neutral-800/80 border border-neutral-700 text-xs font-mono text-cyan-300">
                  refs/heads/{localConfig.branch || "main"}
                </div>
              </div>

              {/* Inline New Branch Creation Input */}
              {showNewBranchInput && (
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="feature/new-mobile-target"
                    value={newBranchInput}
                    onChange={(e) => setNewBranchInput(e.target.value)}
                    className="flex-1 bg-neutral-950 border border-cyan-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none font-mono"
                  />
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={handleCreateNewBranch}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Create & Select
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewBranchInput(false)}
                      className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {branchActionStatus && (
                <p className="text-[11px] text-cyan-400 font-mono mt-1">
                  {branchActionStatus}
                </p>
              )}
            </div>

            {/* GitHub Personal Access Token */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-300">
                  GitHub Personal Access Token (PAT)
                </label>
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo,workflow"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  Generate Token (repo scope) <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showToken ? "text" : "password"}
                  placeholder="ghp_••••••••••••••••••••••••••••••••"
                  value={localConfig.token}
                  onChange={(e) =>
                    setLocalConfig({ ...localConfig, token: e.target.value })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-3 pr-9 py-2 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-2 text-neutral-400 hover:text-neutral-200 cursor-pointer p-1"
                >
                  {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-neutral-400">
                Requires <span className="text-neutral-200 font-mono font-semibold">repo</span> and <span className="text-neutral-200 font-mono font-semibold">workflow</span> scopes to push multi-target trees and trigger GitHub Actions.
              </p>
            </div>

            {/* Connection Test Action & Results */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testState.loading || !localConfig.repoUrl || !localConfig.token}
                className="w-full py-2 px-3 rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {testState.loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    <span>Verifying Repository Access...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Test GitHub Connection & Permissions</span>
                  </>
                )}
              </button>

              {testState.repoInfo && (
                <div className="mt-3 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/60 text-xs space-y-1">
                  <div className="flex items-center justify-between text-emerald-400 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Connected to {testState.repoInfo.fullName}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-200 font-mono">
                      {testState.repoInfo.isPrivate ? "Private" : "Public"}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-300">
                    Default: <span className="font-mono text-neutral-100">{testState.repoInfo.defaultBranch}</span> • Write Push: <span className="text-emerald-400 font-medium">{testState.repoInfo.canPush ? "Confirmed" : "Read Only"}</span>
                  </p>
                </div>
              )}

              {testState.error && (
                <div className="mt-3 p-3 rounded-xl bg-rose-950/30 border border-rose-800/60 text-xs flex items-start gap-2 text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <div>
                    <p className="font-semibold">Connection Check Failed</p>
                    <p className="text-[11px] text-neutral-300 mt-0.5">{testState.error}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Save Button Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
              {savedBanner ? (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Settings Saved!
                </span>
              ) : (
                <span className="text-[11px] text-neutral-500 font-mono">
                  State securely preserved in session
                </span>
              )}
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-semibold transition-all cursor-pointer shadow-md shadow-cyan-500/20"
              >
                Save Settings
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: File Sync Display (Full Breakdown across Web, Desktop, Mobile & Workflows) */}
        {activeTab === "sync_display" && (
          <div className="flex-1 flex flex-col min-h-0 bg-[#07080c]">
            {/* Top Multi-Target Architecture Stats Bar */}
            <div className="p-3 bg-[#0c0e16] border-b border-neutral-800 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <div 
                onClick={() => setTargetFilter("web")}
                className={`p-2 rounded-lg border cursor-pointer transition-all ${
                  targetFilter === "web" ? "bg-cyan-950/60 border-cyan-500/60 text-cyan-300" : "bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-cyan-400">
                  <Globe className="w-3 h-3" /> Web Target
                </div>
                <div className="text-sm font-bold font-mono mt-0.5">{multiTargetStructure.webFilesCount} files</div>
                <div className="text-[9px] text-neutral-400">Vite + React 19</div>
              </div>

              <div 
                onClick={() => setTargetFilter("desktop")}
                className={`p-2 rounded-lg border cursor-pointer transition-all ${
                  targetFilter === "desktop" ? "bg-indigo-950/60 border-indigo-500/60 text-indigo-300" : "bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-indigo-400">
                  <Monitor className="w-3 h-3" /> Desktop Target
                </div>
                <div className="text-sm font-bold font-mono mt-0.5">{multiTargetStructure.desktopFilesCount} files</div>
                <div className="text-[9px] text-neutral-400">Windows/macOS Forge</div>
              </div>

              <div 
                onClick={() => setTargetFilter("mobile")}
                className={`p-2 rounded-lg border cursor-pointer transition-all ${
                  targetFilter === "mobile" ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-300" : "bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                  <Smartphone className="w-3 h-3" /> Mobile Target
                </div>
                <div className="text-sm font-bold font-mono mt-0.5">{multiTargetStructure.mobileFilesCount} files</div>
                <div className="text-[9px] text-neutral-400">Android APK & Gradle</div>
              </div>

              <div 
                onClick={() => setTargetFilter("workflow")}
                className={`p-2 rounded-lg border cursor-pointer transition-all ${
                  targetFilter === "workflow" ? "bg-amber-950/60 border-amber-500/60 text-amber-300" : "bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-amber-400">
                  <Workflow className="w-3 h-3" /> CI/CD Automation
                </div>
                <div className="text-sm font-bold font-mono mt-0.5">{multiTargetStructure.workflowFilesCount} files</div>
                <div className="text-[9px] text-neutral-400">Android & Windows</div>
              </div>

              <div 
                onClick={() => setTargetFilter("all")}
                className={`p-2 rounded-lg border cursor-pointer transition-all col-span-2 sm:col-span-1 ${
                  targetFilter === "all" ? "bg-neutral-800 border-neutral-600 text-neutral-100" : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-300">
                  <Layers className="w-3 h-3" /> Monorepo Total
                </div>
                <div className="text-sm font-bold font-mono mt-0.5">{previewFilesList.length} files</div>
                <div className="text-[9px] text-neutral-400">Synchronized</div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-2.5 bg-[#090b11] border-b border-neutral-800 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
                <Search className="w-3.5 h-3.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Filter files (e.g., App.tsx, build.gradle, workflows)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadZip}
                  disabled={isExportingZip}
                  className="px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Download complete monorepo bundle as a .ZIP archive"
                >
                  <Download className="w-3 h-3 text-cyan-400" />
                  <span>{isExportingZip ? "Zipping..." : "Export Monorepo ZIP"}</span>
                </button>
              </div>
            </div>

            {/* Two-Column Explorer & Content Preview */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
              {/* File list */}
              <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-neutral-800 bg-[#0d0f17] flex flex-col shrink-0 overflow-y-auto p-2 space-y-1 font-mono text-xs">
                {filteredFiles.map((filePath) => {
                  const target = getFileTarget(filePath);
                  const isSelected = selectedPreviewFile === filePath;

                  return (
                    <button
                      key={filePath}
                      onClick={() => setSelectedPreviewFile(filePath)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] flex items-center justify-between gap-1.5 cursor-pointer transition-all ${
                        isSelected
                          ? "bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 font-semibold"
                          : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        {target === "web" && <Globe className="w-3 h-3 text-cyan-400 shrink-0" />}
                        {target === "desktop" && <Monitor className="w-3 h-3 text-indigo-400 shrink-0" />}
                        {target === "mobile" && <Smartphone className="w-3 h-3 text-emerald-400 shrink-0" />}
                        {target === "workflow" && <Workflow className="w-3 h-3 text-amber-400 shrink-0" />}
                        {target === "root" && <Folder className="w-3 h-3 text-neutral-400 shrink-0" />}
                        <span className="truncate">{filePath}</span>
                      </div>

                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-800/80 text-neutral-300 shrink-0 font-mono">
                        {target.toUpperCase()}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Code viewer */}
              <div className="flex-1 flex flex-col min-h-0 bg-[#07080c]">
                <div className="h-9 border-b border-neutral-800 px-3 flex items-center justify-between text-xs bg-[#0b0d14] font-mono text-neutral-300 shrink-0">
                  <div className="flex items-center gap-1.5 truncate">
                    <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="font-semibold text-neutral-200 truncate">{selectedPreviewFile}</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">
                      SYNC READY
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {multiTargetStructure.files[selectedPreviewFile]?.split("\n").length || 0} lines
                  </span>
                </div>
                <pre className="flex-1 overflow-auto p-3 text-[11px] font-mono leading-relaxed text-neutral-300 bg-[#07080c] whitespace-pre select-text">
                  {multiTargetStructure.files[selectedPreviewFile] || "// File empty"}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Commit History & Manual Push */}
        {activeTab === "history" && (
          <div className="flex-1 flex flex-col p-3.5 sm:p-4 overflow-hidden min-h-0 space-y-4">
            {/* Quick Trigger Bar with Smart Commit Message Suggestions */}
            <div className="p-3.5 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2.5 shrink-0">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-cyan-400" /> Commit & Push Multi-Target State to GitHub
                </p>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  Branch: {localConfig.branch || "main"}
                </span>
              </div>

              {/* Suggestions chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[10px]">
                <span className="text-neutral-500 shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" /> Suggestions:
                </span>
                {COMMIT_SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCustomCommitMessage(s)}
                    className="px-2 py-0.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 truncate max-w-[200px] shrink-0 cursor-pointer transition-colors border border-neutral-700"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Commit message (e.g. feat: add camera & biometric support to mobile and desktop)..."
                  value={customCommitMessage}
                  onChange={(e) => setCustomCommitMessage(e.target.value)}
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
                <button
                  type="button"
                  onClick={handleTriggerSync}
                  disabled={isSyncing || !localConfig.repoUrl || !localConfig.token}
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-md shadow-cyan-500/20"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Pushing Workspace...</span>
                    </>
                  ) : (
                    <>
                      <GitCommit className="w-3.5 h-3.5" />
                      <span>Commit & Push</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Commits List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
              <h3 className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <GitCommit className="w-3.5 h-3.5 text-cyan-400" /> Commit Logs & Synced Revisions
              </h3>

              {commits.length === 0 ? (
                <div className="p-8 text-center bg-neutral-900/40 border border-neutral-800 rounded-xl space-y-2">
                  <GitCommit className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="text-xs text-neutral-300 font-medium">No Commits Recorded Yet</p>
                  <p className="text-[11px] text-neutral-500 max-w-sm mx-auto">
                    Save changes in the code editor, command the AI agent, or click "Commit & Push" above to push your multi-target workspace.
                  </p>
                </div>
              ) : (
                commits.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-neutral-800 text-cyan-400 font-mono text-[11px] border border-neutral-700">
                          {c.hash}
                        </span>
                        <span className="font-semibold text-neutral-100">{c.message}</span>
                      </div>
                      <span className="text-[11px] text-neutral-500 font-mono">{c.timestamp}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-neutral-400 flex-wrap gap-2 pt-1 border-t border-neutral-800/60">
                      <span className="font-mono">
                        Author: <span className="text-neutral-300">{c.author}</span> • Total Files: {c.filesChanged.length}
                      </span>
                      {c.syncedToGitHub && c.githubCommitUrl ? (
                        <a
                          href={c.githubCommitUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono cursor-pointer"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Synced to GitHub <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span className="text-amber-400 font-mono flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Local commit only
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 4: CI/CD Pipeline Automation (Android APK & Windows App compilation) */}
        {activeTab === "cicd" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 min-h-0">
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-indigo-950/40 border border-emerald-800/60 space-y-2">
              <div className="flex items-center gap-2">
                <Workflow className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-neutral-100">
                  Continuous Android APK & Windows Desktop Build Matrix
                </h3>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Whenever you commit and push to <strong className="text-cyan-300 font-mono">refs/heads/{localConfig.branch || "main"}</strong>, GitHub Actions automatically compiles and packages your application for both mobile and desktop targets.
              </p>
            </div>

            {/* Matrix Jobs Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Android Job */}
              <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4" /> Android Mobile APK
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    ubuntu-latest
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Builds web assets, syncs to Capacitor, and runs Gradle <code className="text-neutral-200">assembleDebug</code> to produce Android APK.
                </p>
                <div className="pt-2 border-t border-neutral-800 text-[10px] font-mono text-neutral-400">
                  Output: <span className="text-emerald-300">app-debug.apk</span>
                </div>
              </div>

              {/* Windows Job */}
              <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                    <Monitor className="w-4 h-4" /> Windows Desktop (.exe)
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    windows-latest
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Packages Electron 40 main and renderer processes into a standalone Windows installer using Electron Forge.
                </p>
                <div className="pt-2 border-t border-neutral-800 text-[10px] font-mono text-neutral-400">
                  Output: <span className="text-indigo-300">windows-desktop-installer.exe</span>
                </div>
              </div>

              {/* Web Job */}
              <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Globe className="w-4 h-4" /> Web SPA Preview
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    ubuntu-latest
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Compiles production web distribution with Vite and React 19, uploading live static assets.
                </p>
                <div className="pt-2 border-t border-neutral-800 text-[10px] font-mono text-neutral-400">
                  Output: <span className="text-cyan-300">web-dist.zip</span>
                </div>
              </div>
            </div>

            {/* Workflow File Reference & Actions Link */}
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Workflow className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-neutral-300">
                  .github/workflows/build-and-release.yml
                </span>
              </div>

              {parsedRepo ? (
                <a
                  href={`https://github.com/${parsedRepo.owner}/${parsedRepo.repo}/actions`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span>View GitHub Actions Runs</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-[11px] text-neutral-500 font-mono">
                  Configure repository to view live Action runs
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-neutral-800 bg-[#0d0f17] flex items-center justify-between text-xs shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-[11px] text-neutral-400">
            <span className={`w-2 h-2 rounded-full ${localConfig.enabled ? "bg-emerald-400" : "bg-neutral-600"}`} />
            <span>Target: <strong className="text-neutral-200 font-mono">{localConfig.branch || "main"}</strong> ({localConfig.enabled ? "Auto-Sync Active" : "Manual Sync"})</span>
            <span className="hidden md:inline text-neutral-600">·</span>
            <span className="hidden md:inline text-cyan-400/80">Perp Corp Media & AI Solutions (Jesse Lepota)</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
