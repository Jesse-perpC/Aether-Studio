import React, { useState } from "react";
import { Header } from "./components/Header";
import { ChatPanel } from "./components/ChatPanel";
import { PreviewPanel } from "./components/PreviewPanel";
import { CodeEditorPanel } from "./components/CodeEditorPanel";
import { PlanPanel } from "./components/PlanPanel";
import { SecurityPanel } from "./components/SecurityPanel";
import { PromptLibraryModal } from "./components/PromptLibraryModal";
import { McpModal } from "./components/McpModal";
import { SettingsModal } from "./components/SettingsModal";
import { NewAppModal } from "./components/NewAppModal";
import { GitHubSyncModal } from "./components/GitHubSyncModal";
import { LeaderboardModal } from "./components/LeaderboardModal";
import { BottomDock } from "./components/BottomDock";
import { 
  INITIAL_APPS, 
  INITIAL_MESSAGES, 
  INITIAL_MILESTONES, 
  INITIAL_SECURITY_FINDINGS 
} from "./data/mockData";
import { 
  AppRecord, 
  AppSettings, 
  ChatMessage, 
  ChatMode, 
  PlanMilestone, 
  PreviewTab, 
  SecurityFinding,
  GitHubSyncConfig,
  WorkspaceCommit
} from "./types";
import { 
  Code, 
  ListChecks, 
  ShieldAlert, 
  Monitor,
  MessageSquare,
  Layers,
  CheckCircle2,
  AlertCircle,
  X,
  Trophy
} from "lucide-react";
import { syncWorkspaceToGitHub } from "./utils/githubSyncService";

export default function App() {
  const [apps, setApps] = useState<AppRecord[]>(INITIAL_APPS);
  const [activeApp, setActiveApp] = useState<AppRecord>(INITIAL_APPS[0]);
  const [chatMode, setChatMode] = useState<ChatMode>("local-agent");
  const [previewTab, setPreviewTab] = useState<PreviewTab>("preview");
  const [mobileTab, setMobileTab] = useState<"chat" | "workspace">("workspace");
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [milestones, setMilestones] = useState<PlanMilestone[]>(INITIAL_MILESTONES);
  const [securityFindings, setSecurityFindings] = useState<SecurityFinding[]>(INITIAL_SECURITY_FINDINGS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash");

  // Modals & Dock
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isMcpModalOpen, setIsMcpModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [isBottomDockOpen, setIsBottomDockOpen] = useState(false);

  // GitHub Sync & Commits State
  const [githubSyncConfig, setGithubSyncConfig] = useState<GitHubSyncConfig>({
    enabled: false,
    repoUrl: "",
    branch: "main",
    token: "",
    autoSyncOnCommit: true,
    syncStatus: "idle",
  });
  const [isSyncingGitHub, setIsSyncingGitHub] = useState(false);
  const [commits, setCommits] = useState<WorkspaceCommit[]>([
    {
      id: "commit-init",
      hash: "7f2a1b9",
      message: "chore(workspace): initialize dual desktop & web architecture",
      author: "Aether Agent",
      timestamp: "10:42 AM",
      filesChanged: ["web/package.json", "desktop/package.json", "package.json", "README.md"],
      syncedToGitHub: false,
    },
  ]);
  const [syncToast, setSyncToast] = useState<{
    type: "success" | "error" | "info";
    title: string;
    detail?: string;
  } | null>(null);

  // Settings State
  const [settings, setSettings] = useState<AppSettings>({
    enableAgentV2: true,
    enableSandboxScriptExecution: true,
    enableCloudSandbox: false,
    autoUpdate: true,
    enableNotifications: true,
    defaultMode: "local-agent",
    selectedModel: "gemini-2.5-flash",
    geminiApiKey: "AIzaSy_demo_aether_key",
    anthropicApiKey: "",
    openaiApiKey: "",
    ollamaHost: "http://localhost:11434",
    githubSync: githubSyncConfig,
  });

  // Keep githubSyncConfig and settings.githubSync in sync
  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    if (newSettings.githubSync) {
      setGithubSyncConfig(newSettings.githubSync);
    }
  };

  const handleUpdateGitHubConfig = (newConfig: GitHubSyncConfig) => {
    setGithubSyncConfig(newConfig);
    setSettings((prev) => ({ ...prev, githubSync: newConfig }));
  };

  // Commit & GitHub Sync Handler
  const handleCommitAndSync = async (commitMessage: string) => {
    const shortHash = Math.random().toString(16).substring(2, 9);
    const newCommit: WorkspaceCommit = {
      id: `commit-${Date.now()}`,
      hash: shortHash,
      message: commitMessage,
      author: "Aether Developer",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      filesChanged: Object.keys(activeApp.files),
      syncedToGitHub: false,
    };

    // If GitHub sync is enabled, or if repo & token are configured
    if (githubSyncConfig.repoUrl && githubSyncConfig.token) {
      setIsSyncingGitHub(true);
      setGithubSyncConfig((prev) => ({ ...prev, syncStatus: "syncing" }));

      try {
        const syncResult = await syncWorkspaceToGitHub(
          githubSyncConfig,
          activeApp,
          commitMessage
        );

        if (syncResult.success && syncResult.commit) {
          newCommit.syncedToGitHub = true;
          newCommit.githubCommitUrl = syncResult.commit.githubCommitUrl;

          setGithubSyncConfig((prev) => ({
            ...prev,
            syncStatus: "synced",
            lastSyncedCommit: shortHash,
            lastSyncedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            errorMessage: undefined,
          }));

          setSyncToast({
            type: "success",
            title: `Synced to GitHub [${shortHash}]`,
            detail: `Pushed dual architecture: ${syncResult.webFilesCount} web + ${syncResult.desktopFilesCount} desktop files to ${githubSyncConfig.branch}`,
          });
        } else {
          setGithubSyncConfig((prev) => ({
            ...prev,
            syncStatus: "error",
            errorMessage: syncResult.error,
          }));

          setSyncToast({
            type: "error",
            title: "GitHub Sync Issue",
            detail: syncResult.error || "Failed to push dual workspace files to GitHub",
          });
        }
      } catch (err: any) {
        setGithubSyncConfig((prev) => ({
          ...prev,
          syncStatus: "error",
          errorMessage: err.message,
        }));
        setSyncToast({
          type: "error",
          title: "GitHub Sync Exception",
          detail: err.message,
        });
      } finally {
        setIsSyncingGitHub(false);
      }
    } else {
      // Local commit recorded, inform user that GitHub is not configured
      setSyncToast({
        type: "info",
        title: `Committed Locally [${shortHash}]`,
        detail: "Configure GitHub repository in Sync modal to push changes continuously.",
      });
    }

    setCommits((prev) => [newCommit, ...prev]);
  };

  // App file update handler
  const handleUpdateFile = (filename: string, content: string) => {
    setActiveApp((prev) => {
      const updated = {
        ...prev,
        files: {
          ...prev.files,
          [filename]: content,
        },
      };
      setApps((all) => all.map((a) => (a.id === updated.id ? updated : a)));
      return updated;
    });
  };

  // Toggle App Run/Stop
  const handleToggleAppStatus = () => {
    const nextStatus: "running" | "stopped" = activeApp.status === "running" ? "stopped" : "running";
    setActiveApp((prev) => {
      const updated: AppRecord = { ...prev, status: nextStatus };
      setApps((all) => all.map((a) => (a.id === updated.id ? updated : a)));
      return updated;
    });
  };

  // Chat message submission
  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    // Simulated Agent Orchestration
    setTimeout(() => {
      setIsGenerating(false);

      let responseContent = "";
      let statusMsg = "";
      let toolCalls: any[] = [];
      let diffSummary: any = undefined;

      if (text.toLowerCase().includes("security") || text.toLowerCase().includes("audit")) {
        responseContent = "I analyzed the IPC boundaries and verified that all window communications use strictly validated channels. Sanitized local storage queries.";
        statusMsg = "Security scan complete: 0 critical vulnerabilities";
        toolCalls = [
          { id: "t-1", name: "read_file", status: "completed", target: "src/lib/storage.ts", output: "Reviewed storage sanitizers" },
          { id: "t-2", name: "run_type_checks", status: "completed", output: "Zero strict type violations" },
        ];
      } else if (text.toLowerCase().includes("plan") || chatMode === "plan") {
        responseContent = "Architectural milestone formulated and recorded into the project plan. Ready to execute through the autonomous agent loop.";
        statusMsg = "Plan annotations updated";
      } else {
        responseContent = `I have processed your request ("${text}"). The codebase AST has been validated with tsgo and hot-reloaded into the preview container.`;
        statusMsg = `Vite HMR updated active modules in 14ms`;
        toolCalls = [
          { id: "t-1", name: "read_file", status: "completed", target: "src/App.tsx", output: "Read 92 lines" },
          { id: "t-2", name: "write_file", status: "completed", target: "src/App.tsx", output: "Applied code enhancements" },
          { id: "t-3", name: "run_type_checks", status: "completed", output: "Type check passed [tsgo]" },
        ];
        diffSummary = { filesChanged: 1, additions: 14, deletions: 2 };

        // If auto-sync on commit is enabled, create commit and push to GitHub
        if (githubSyncConfig.enabled && githubSyncConfig.autoSyncOnCommit) {
          handleCommitAndSync(`feat(agent): ${text.slice(0, 45)}`);
        }
      }

      const agentMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: responseContent,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        mode: chatMode,
        statusMessage: statusMsg,
        toolCalls,
        diffSummary,
      };

      setMessages((prev) => [...prev, agentMsg]);
    }, 1100);
  };

  // Milestone Step Toggle
  const handleToggleMilestoneStep = (milestoneId: string, _stepIndex: number) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id !== milestoneId) return m;
        return {
          ...m,
          status: m.status === "completed" ? "in-progress" : "completed",
        };
      })
    );
  };

  const handleAddMilestone = (title: string, description: string) => {
    const newM: PlanMilestone = {
      id: `m-${Date.now()}`,
      title,
      description,
      status: "pending",
      steps: ["Design component architecture", "Write integration tests", "Verify IPC boundary"],
    };
    setMilestones((prev) => [...prev, newM]);
  };

  // Security Fix
  const handleFixFinding = (finding: SecurityFinding) => {
    handleSendMessage(`Fix security issue: ${finding.type} in ${finding.file} at line ${finding.line}`);
    setSecurityFindings((prev) => prev.filter((f) => f.id !== finding.id));
  };

  // New App Creation
  const handleCreateApp = (appData: Partial<AppRecord>) => {
    const newApp: AppRecord = {
      id: `app-${Date.now()}`,
      name: appData.name || "New Application",
      description: appData.description || "Created with Aether Studio.",
      template: appData.template || "Vite React Template",
      version: "v0.1.0",
      status: "running",
      port: 3000 + apps.length,
      lastEdited: "Just now",
      tags: ["React", "Tailwind", "TypeScript"],
      files: {
        "src/App.tsx": `import React from "react";

export default function App() {
  return (
    <div className="min-h-screen bg-[#090b10] text-neutral-100 p-8 flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xl font-bold mb-4">
        ⚡
      </div>
      <h1 className="text-xl font-bold">${appData.name}</h1>
      <p className="text-xs text-neutral-400 mt-2">${appData.description}</p>
    </div>
  );
}`,
        "package.json": `{ "name": "${appData.name?.toLowerCase().replace(/\s+/g, "-")}", "version": "0.1.0" }`,
        "src/index.css": `@import "tailwindcss";`,
      },
    };

    setApps([...apps, newApp]);
    setActiveApp(newApp);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-screen overflow-hidden bg-[#08090d] text-neutral-100 font-sans relative">
      {/* Top Header */}
      <Header
        activeApp={activeApp}
        apps={apps}
        onSelectApp={setActiveApp}
        onNewApp={() => setIsNewAppModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenPrompts={() => setIsPromptModalOpen(true)}
        onOpenMcp={() => setIsMcpModalOpen(true)}
        onOpenGitHubSync={() => setIsGitHubModalOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardModalOpen(true)}
        gitSyncStatus={githubSyncConfig.syncStatus}
        gitRepoName={githubSyncConfig.repoUrl}
        onToggleAppStatus={handleToggleAppStatus}
        chatMode={chatMode}
        onChangeChatMode={setChatMode}
      />

      {/* Mobile Tab Switcher (< md) */}
      <div className="md:hidden flex border-b border-neutral-800 bg-[#0c0e15] px-2 py-1.5 gap-1.5 text-xs shrink-0 select-none overflow-x-auto no-scrollbar">
        <button
          onClick={() => setMobileTab("chat")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
            mobileTab === "chat"
              ? "bg-neutral-800 text-cyan-400 font-semibold shadow-sm"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Agent</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-700 text-neutral-300 font-mono">
            {messages.length}
          </span>
        </button>

        <button
          onClick={() => setMobileTab("workspace")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
            mobileTab === "workspace"
              ? "bg-neutral-800 text-cyan-400 font-semibold shadow-sm"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Workspace</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-mono capitalize">
            {previewTab}
          </span>
        </button>

        <button
          onClick={() => setIsLeaderboardModalOpen(true)}
          className="flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap text-amber-300 bg-amber-500/10 border border-amber-500/30 shrink-0"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>#1 Rank</span>
        </button>
      </div>

      {/* Main Workspace Split */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        {/* Left Column: Chat & Agent Orchestrator */}
        <div
          className={`w-full md:w-[400px] lg:w-[440px] shrink-0 h-full border-r border-neutral-800 flex flex-col min-h-0 ${
            mobileTab === "chat" ? "flex" : "hidden md:flex"
          }`}
        >
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            chatMode={chatMode}
            onChangeChatMode={setChatMode}
            isGenerating={isGenerating}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
            onClearHistory={() => setMessages([])}
          />
        </div>

        {/* Right Column: Dynamic Workspace (Preview, Code, Plan, Security) */}
        <div
          className={`flex-1 flex-col h-full bg-[#0a0c12] overflow-hidden min-h-0 ${
            mobileTab === "workspace" ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Workspace Tab Bar */}
          <div className="h-11 border-b border-neutral-800 bg-[#0d0f17] px-2.5 sm:px-4 flex items-center justify-between text-xs select-none overflow-x-auto no-scrollbar gap-2 shrink-0">
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <button
                onClick={() => setPreviewTab("preview")}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  previewTab === "preview"
                    ? "bg-neutral-800 text-cyan-400 font-semibold"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <Monitor className="w-3.5 h-3.5 shrink-0" />
                <span>Live Preview</span>
              </button>

              <button
                onClick={() => setPreviewTab("code")}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  previewTab === "code"
                    ? "bg-neutral-800 text-cyan-400 font-semibold"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <Code className="w-3.5 h-3.5 shrink-0" />
                <span>Code Editor</span>
              </button>

              <button
                onClick={() => setPreviewTab("plan")}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  previewTab === "plan"
                    ? "bg-neutral-800 text-cyan-400 font-semibold"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <ListChecks className="w-3.5 h-3.5 shrink-0" />
                <span>Plan & Milestones</span>
                <span className="text-[10px] bg-neutral-700 px-1.5 py-0.2 rounded font-mono text-neutral-300">
                  {milestones.length}
                </span>
              </button>

              <button
                onClick={() => setPreviewTab("security")}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  previewTab === "security"
                    ? "bg-neutral-800 text-cyan-400 font-semibold"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>Security Review</span>
                {securityFindings.length > 0 && (
                  <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-1.5 py-0.2 rounded font-mono">
                    {securityFindings.length}
                  </span>
                )}
              </button>

              {/* #1 AI Platform Leaderboard tab */}
              <button
                onClick={() => setIsLeaderboardModalOpen(true)}
                className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30"
                title="Aether Studio Ranked #1 Against Paid Alternatives (Bolt, Lovable, Cursor, Replit)"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="hidden sm:inline font-bold">#1 Ranked (99.4)</span>
                <span className="sm:hidden font-mono text-[10px]">#1</span>
              </button>
            </div>

            {/* Quick Status / GitHub sync shortcut pill */}
            <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-neutral-400 shrink-0">
              <button
                onClick={() => setIsGitHubModalOpen(true)}
                className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors cursor-pointer"
                title="Configure GitHub sync (Desktop & Web targets)"
              >
                <span className={`w-2 h-2 rounded-full ${
                  githubSyncConfig.syncStatus === "synced"
                    ? "bg-emerald-400"
                    : githubSyncConfig.syncStatus === "syncing"
                    ? "bg-cyan-400 animate-pulse"
                    : githubSyncConfig.syncStatus === "error"
                    ? "bg-rose-400"
                    : "bg-neutral-500"
                }`} />
                <span>GitHub Sync:</span>
                <span className="text-neutral-300 font-semibold underline underline-offset-2">
                  {githubSyncConfig.repoUrl ? githubSyncConfig.repoUrl : "Off"}
                </span>
              </button>

              <span className="text-neutral-600">|</span>

              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Daemon OK</span>
              </div>
            </div>
          </div>

          {/* Active Tab View Body */}
          <div className="flex-1 overflow-hidden min-h-0">
            {previewTab === "preview" && <PreviewPanel app={activeApp} />}
            {previewTab === "code" && (
              <CodeEditorPanel 
                app={activeApp} 
                onUpdateFile={handleUpdateFile}
                onCommitChanges={handleCommitAndSync}
                onOpenGitHubSync={() => setIsGitHubModalOpen(true)}
                gitSyncStatus={githubSyncConfig.syncStatus}
                gitRepoName={githubSyncConfig.repoUrl}
                lastCommitHash={commits[0]?.hash || "7f2a1b9"}
              />
            )}
            {previewTab === "plan" && (
              <PlanPanel
                milestones={milestones}
                onToggleStep={handleToggleMilestoneStep}
                onAddMilestone={handleAddMilestone}
                onExecutePlan={() => {
                  setChatMode("local-agent");
                  handleSendMessage("Execute architectural plan milestone 2 (Responsive Viewport Shell)");
                }}
              />
            )}
            {previewTab === "security" && (
              <SecurityPanel
                findings={securityFindings}
                onFixFinding={handleFixFinding}
                onRunAudit={() => {
                  handleSendMessage("Run deep static security audit across all files");
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Collapsible Dock */}
      <BottomDock
        isOpen={isBottomDockOpen}
        onToggle={() => setIsBottomDockOpen(!isBottomDockOpen)}
        onCommitAndSync={handleCommitAndSync}
        onOpenLeaderboard={() => setIsLeaderboardModalOpen(true)}
        gitRepoName={githubSyncConfig.repoUrl}
        branch={githubSyncConfig.branch}
        commits={commits}
      />

      {/* Floating Sync Notification Toast */}
      {syncToast && (
        <div className="fixed bottom-12 right-4 z-50 max-w-sm w-full bg-[#11141e] border border-neutral-700/80 rounded-xl shadow-2xl p-3 flex items-start gap-2.5 animate-in slide-in-from-bottom-2">
          {syncToast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : syncToast.type === "error" ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0 text-xs">
            <p className="font-semibold text-neutral-100">{syncToast.title}</p>
            {syncToast.detail && (
              <p className="text-[11px] text-neutral-400 mt-0.5 break-words font-mono">
                {syncToast.detail}
              </p>
            )}
          </div>
          <button
            onClick={() => setSyncToast(null)}
            className="p-1 text-neutral-500 hover:text-neutral-300 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Modals */}
      <LeaderboardModal
        isOpen={isLeaderboardModalOpen}
        onClose={() => setIsLeaderboardModalOpen(false)}
      />

      <GitHubSyncModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        config={githubSyncConfig}
        onSaveConfig={handleUpdateGitHubConfig}
        app={activeApp}
        commits={commits}
        onManualSync={handleCommitAndSync}
        isSyncing={isSyncingGitHub}
      />

      <PromptLibraryModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        onUsePrompt={(content) => {
          handleSendMessage(content);
        }}
      />

      <McpModal
        isOpen={isMcpModalOpen}
        onClose={() => setIsMcpModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

      <NewAppModal
        isOpen={isNewAppModalOpen}
        onClose={() => setIsNewAppModalOpen(false)}
        onCreateApp={handleCreateApp}
      />
    </div>
  );
}
