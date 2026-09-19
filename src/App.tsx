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
  SecurityFinding 
} from "./types";
import { 
  Code, 
  ListChecks, 
  ShieldAlert, 
  Monitor,
  MessageSquare,
  Layers
} from "lucide-react";

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
  const [isBottomDockOpen, setIsBottomDockOpen] = useState(false);

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
  });

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
    const nextStatus = activeApp.status === "running" ? "stopped" : "running";
    setActiveApp((prev) => {
      const updated = { ...prev, status: nextStatus };
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
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#08090d] text-neutral-100 font-sans">
      {/* Top Header */}
      <Header
        activeApp={activeApp}
        apps={apps}
        onSelectApp={setActiveApp}
        onNewApp={() => setIsNewAppModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenPrompts={() => setIsPromptModalOpen(true)}
        onOpenMcp={() => setIsMcpModalOpen(true)}
        onToggleAppStatus={handleToggleAppStatus}
        chatMode={chatMode}
        onChangeChatMode={setChatMode}
      />

      {/* Mobile Tab Switcher (< md) */}
      <div className="md:hidden flex border-b border-neutral-800 bg-[#0c0e15] px-2 py-1.5 gap-1.5 text-xs shrink-0 select-none">
        <button
          onClick={() => setMobileTab("chat")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg font-medium transition-colors cursor-pointer ${
            mobileTab === "chat"
              ? "bg-neutral-800 text-cyan-400 font-semibold shadow-sm"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Agent Chat</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-700 text-neutral-300 font-mono">
            {messages.length}
          </span>
        </button>

        <button
          onClick={() => setMobileTab("workspace")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg font-medium transition-colors cursor-pointer ${
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
            </div>

            {/* Quick Status / Hot Reload Status */}
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-neutral-400 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Daemon: Connected</span>
            </div>
          </div>

          {/* Active Tab View Body */}
          <div className="flex-1 overflow-hidden min-h-0">
            {previewTab === "preview" && <PreviewPanel app={activeApp} />}
            {previewTab === "code" && (
              <CodeEditorPanel app={activeApp} onUpdateFile={handleUpdateFile} />
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
      />

      {/* Modals */}
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
        onSaveSettings={setSettings}
      />

      <NewAppModal
        isOpen={isNewAppModalOpen}
        onClose={() => setIsNewAppModalOpen(false)}
        onCreateApp={handleCreateApp}
      />
    </div>
  );
}
