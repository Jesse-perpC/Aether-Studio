export type ChatMode = "local-agent" | "build" | "ask" | "plan";

export type ViewTab = "apps" | "templates" | "library" | "plugins" | "settings";

export type PreviewTab = "preview" | "code" | "plan" | "security" | "terminal";

export type DeviceMode = "desktop" | "tablet" | "mobile";

export interface AppRecord {
  id: string;
  name: string;
  description: string;
  template: string;
  version: string;
  status: "running" | "stopped" | "building";
  port: number;
  lastEdited: string;
  tags: string[];
  files: Record<string, string>;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  mode?: ChatMode;
  toolCalls?: AgentToolCall[];
  statusMessage?: string;
  diffSummary?: {
    filesChanged: number;
    additions: number;
    deletions: number;
  };
}

export interface AgentToolCall {
  id: string;
  name: "read_file" | "write_file" | "execute_command" | "run_type_checks" | "web_fetch" | "mcp_query";
  status: "pending" | "running" | "completed" | "failed";
  target?: string;
  args?: Record<string, any>;
  output?: string;
}

export interface PlanMilestone {
  id: string;
  title: string;
  status: "pending" | "in-progress" | "completed";
  annotationId?: string;
  description: string;
  steps: string[];
}

export interface SecurityFinding {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  type: string;
  file: string;
  line: number;
  description: string;
  fixAvailable: boolean;
}

export interface PromptTemplate {
  id: string;
  title: string;
  description?: string;
  slug?: string;
  content: string;
  category: "Architectural" | "Refactoring" | "Security" | "Performance" | "Custom";
}

export interface McpPlugin {
  id: string;
  name: string;
  description: string;
  status: "connected" | "disconnected";
  version: string;
  endpoint: string;
  tools: string[];
}

export interface GitHubBranch {
  name: string;
  commitSha: string;
  isProtected: boolean;
  isDefault?: boolean;
}

export type WorkspaceTarget = "web" | "desktop" | "mobile" | "workflow" | "root";

export interface FileSyncItem {
  path: string;
  target: WorkspaceTarget;
  status: "added" | "modified" | "synced";
  sizeBytes: number;
  linesCount: number;
  description: string;
}

export interface GitHubSyncConfig {
  enabled: boolean;
  repoUrl: string; // e.g. "owner/repo" or "https://github.com/owner/repo"
  branch: string;  // e.g. "main", "develop", "feature/mobile-app"
  token: string;   // GitHub PAT
  autoSyncOnCommit: boolean;
  lastSyncedCommit?: string;
  lastSyncedAt?: string;
  syncStatus: "idle" | "syncing" | "synced" | "error";
  errorMessage?: string;
}

export interface WorkspaceCommit {
  id: string;
  hash: string;
  message: string;
  author: string;
  timestamp: string;
  filesChanged: string[];
  syncedToGitHub: boolean;
  githubCommitUrl?: string;
}

export interface AppSettings {
  enableAgentV2: boolean;
  enableSandboxScriptExecution: boolean;
  enableCloudSandbox: boolean;
  autoUpdate: boolean;
  enableNotifications: boolean;
  defaultMode: ChatMode;
  selectedModel: string;
  geminiApiKey: string;
  anthropicApiKey: string;
  openaiApiKey: string;
  ollamaHost: string;
  githubSync?: GitHubSyncConfig;
}
