export type ChatMode = 'agent' | 'build' | 'ask' | 'plan';

export type ViewTab = 'studio' | 'code' | 'templates' | 'releases' | 'settings';

export type DeviceViewport = 'desktop' | 'tablet' | 'mobile';

export type PreviewTab = 'preview' | 'logs' | 'problems';

export interface WorkflowRun {
  id: string;
  name: string;
  workflowFile: string;
  commitSha: string;
  commitMessage: string;
  branch: string;
  status: 'completed' | 'in_progress' | 'queued' | 'failed';
  conclusion: 'success' | 'failure' | 'cancelled' | null;
  startedAt: string;
  duration: string;
  platform: 'windows' | 'matrix' | 'ci' | 'release';
  artifacts: {
    name: string;
    size: string;
    downloadUrl: string;
    type: 'installer' | 'portable' | 'matrix';
  }[];
}

export interface DesktopRelease {
  id: string;
  tag: string;
  name: string;
  publishedAt: string;
  isPrerelease: boolean;
  channel: 'stable' | 'nightly' | 'beta';
  downloadsCount: number;
  changelog: string[];
  assets: {
    name: string;
    platform: 'win32' | 'darwin' | 'linux';
    arch: 'x64' | 'arm64' | 'universal';
    size: string;
    type: 'exe' | 'zip' | 'dmg' | 'deb';
    downloadUrl: string;
  }[];
}

export interface AppUpdateInfo {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string;
  channel: 'stable' | 'nightly';
  releaseUrl: string;
  publishedAt: string;
  notes: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: 'anthropic' | 'openai' | 'google' | 'ollama' | 'deepseek';
  description: string;
  contextWindow: string;
  tag?: string;
}

export interface ProjectFile {
  path: string;
  name: string;
  content: string;
  language: string;
  isModified?: boolean;
}

export interface FileDiff {
  path: string;
  oldContent: string;
  newContent: string;
  additions: number;
  deletions: number;
}

export interface AgentStep {
  id: string;
  type: 'read_file' | 'edit_file' | 'run_command' | 'typecheck' | 'install_package' | 'thought';
  title: string;
  detail?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  mode?: ChatMode;
  modelId?: string;
  steps?: AgentStep[];
  diffs?: FileDiff[];
  isApplied?: boolean;
}

export interface DyadApp {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  icon: string;
  updatedAt: string;
  files: ProjectFile[];
  chatHistory: ChatMessage[];
  appType: 'react-vite' | 'nextjs';
  previewComponent: string;
}

export interface ProviderConfig {
  anthropicKey: string;
  openaiKey: string;
  geminiKey: string;
  ollamaHost: string;
  defaultMode: ChatMode;
  defaultModel: string;
  autoApproveTools: boolean;
  theme: 'dark' | 'light' | 'system';
  releaseChannel: 'stable' | 'beta';
}

export interface PromptTemplate {
  id: string;
  title: string;
  category: 'Feature' | 'Design' | 'Fix' | 'Backend';
  description: string;
  prompt: string;
}
