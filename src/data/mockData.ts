import { AppRecord, ChatMessage, McpPlugin, PlanMilestone, PromptTemplate, SecurityFinding } from "../types";

export const INITIAL_APPS: AppRecord[] = [
  {
    id: "app-crypto-pulse",
    name: "CryptoPulse Dashboard",
    description: "High-frequency DeFi order-book visualizer and real-time gas tracker with interactive charts.",
    template: "Vite React Template",
    version: "v1.4.2",
    status: "running",
    port: 3000,
    lastEdited: "10 mins ago",
    tags: ["React", "Tailwind", "WebSockets", "Finance"],
    files: {
      "src/App.tsx": `import React, { useState, useEffect } from "react";
import { TrendingUp, Activity, ShieldCheck, ArrowUpRight, DollarSign, Wallet } from "lucide-react";

export default function App() {
  const [balance, setBalance] = useState(24850.40);
  const [gasGwei, setGasGwei] = useState(18);
  const [activeToken, setActiveToken] = useState("ETH");
  const [assets, setAssets] = useState([
    { symbol: "ETH", name: "Ethereum", price: 3420.50, change: "+4.12%", holding: 4.5 },
    { symbol: "BTC", name: "Bitcoin", price: 88400.00, change: "+2.85%", holding: 0.12 },
    { symbol: "SOL", name: "Solana", price: 194.20, change: "+9.34%", holding: 22.0 },
  ]);

  return (
    <div className="min-h-screen bg-[#090b10] text-neutral-100 p-6 font-sans">
      <header className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            ⚡
          </div>
          <div>
            <h1 className="font-semibold text-lg text-neutral-100">CryptoPulse Terminal</h1>
            <p className="text-xs text-neutral-400">Live Sandbox: Port 3000 • Connected to Mainnet Simulator</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Gas: {gasGwei} Gwei
          </span>
          <button className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-neutral-950 font-medium text-xs px-3 py-1.5 rounded-lg transition-colors">
            <Wallet className="w-3.5 h-3.5" /> Connect Wallet
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4">
          <p className="text-xs text-neutral-400">Total Portfolio Value</p>
          <p className="text-2xl font-bold text-neutral-100 mt-1">\${balance.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-xs text-emerald-400 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" /> +12.4% vs last week
          </div>
        </div>
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4">
          <p className="text-xs text-neutral-400">Active Yield Vaults</p>
          <p className="text-2xl font-bold text-neutral-100 mt-1">4 Pools</p>
          <div className="flex items-center gap-1 text-xs text-cyan-400 mt-2">
            <Activity className="w-3.5 h-3.5" /> APY averaging 7.8%
          </div>
        </div>
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4">
          <p className="text-xs text-neutral-400">Smart Contract Health</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">Audited (100%)</p>
          <div className="flex items-center gap-1 text-xs text-neutral-400 mt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Multi-sig secured
          </div>
        </div>
      </div>

      <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-neutral-200 mb-4">Tracked Assets</h2>
        <div className="divide-y divide-neutral-800">
          {assets.map((asset) => (
            <div key={asset.symbol} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center font-bold text-xs text-cyan-400">
                  {asset.symbol}
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-200">{asset.name}</p>
                  <p className="text-xs text-neutral-400">{asset.holding} {asset.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-neutral-100">\${asset.price.toLocaleString()}</p>
                <p className="text-xs text-emerald-400">{asset.change}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`,
      "package.json": `{
  "name": "cryptopulse",
  "private": true,
  "version": "1.4.2",
  "dependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "lucide-react": "^0.487.0"
  }
}`,
      "src/index.css": `@import "tailwindcss";`,
    },
  },
  {
    id: "app-kanban-flow",
    name: "Kanban Quantum Sprint",
    description: "Multi-agent issue management board with automated PR summaries and ticket decomposition.",
    template: "Next.js Template",
    version: "v2.0.1",
    status: "running",
    port: 3001,
    lastEdited: "1 hour ago",
    tags: ["Next.js", "TypeScript", "Tailwind", "Productivity"],
    files: {
      "src/App.tsx": `export default function Kanban() {
  return <div className="p-8 text-neutral-200">Quantum Kanban Workspace Active</div>;
}`,
      "package.json": `{ "name": "kanban-quantum", "version": "2.0.1" }`,
    },
  },
  {
    id: "app-neural-chat",
    name: "SynthStream Realtime Engine",
    description: "End-to-end voice and streaming socket server with neural speech synthesis integration.",
    template: "Vite React Template",
    version: "v0.9.0",
    status: "stopped",
    port: 3002,
    lastEdited: "Yesterday",
    tags: ["WebSockets", "Audio", "WebRTC"],
    files: {
      "src/App.tsx": `export default function Synth() {
  return <div className="p-8 text-neutral-200">SynthStream Engine Ready</div>;
}`,
      "package.json": `{ "name": "synthstream", "version": "0.9.0" }`,
    },
  },
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    role: "assistant",
    content: "Welcome to Aether Studio. I am ready to orchestrate, synthesize, or inspect your full-stack application. How would you like to proceed?",
    timestamp: "10:30 AM",
    mode: "local-agent",
    statusMessage: "Sandbox daemon ready on localhost:3000",
  },
  {
    id: "msg-2",
    role: "user",
    content: "Add a live gas tracker badge with Gwei indicator to the header and an interactive wallet connect trigger.",
    timestamp: "10:31 AM",
  },
  {
    id: "msg-3",
    role: "assistant",
    content: "I have updated `src/App.tsx` with a live gas status pill and responsive wallet connection trigger. Running type safety checks with `tsgo` and verifying hot-reloaded DOM output.",
    timestamp: "10:32 AM",
    mode: "local-agent",
    toolCalls: [
      {
        id: "tool-1",
        name: "read_file",
        status: "completed",
        target: "src/App.tsx",
        output: "Read 84 lines successfully",
      },
      {
        id: "tool-2",
        name: "write_file",
        status: "completed",
        target: "src/App.tsx",
        output: "Updated gas tracker component with Gwei interval hook",
      },
      {
        id: "tool-3",
        name: "run_type_checks",
        status: "completed",
        output: "Zero TypeScript errors found across 4 modules",
      },
    ],
    diffSummary: {
      filesChanged: 1,
      additions: 18,
      deletions: 4,
    },
  },
];

export const INITIAL_MILESTONES: PlanMilestone[] = [
  {
    id: "m-1",
    title: "1. Core State & Order Book Hydration",
    status: "completed",
    annotationId: "anno-state-1",
    description: "Establish centralized state machine for DeFi tick feed and responsive portfolio balances.",
    steps: [
      "Initialize high-performance memory cache for asset quotes",
      "Wire reactive web-socket listener with automatic exponential backoff",
      "Validate schema payload using strict Zod parser",
    ],
  },
  {
    id: "m-2",
    title: "2. Visual Layout & Responsive Viewport Shell",
    status: "in-progress",
    annotationId: "anno-viewport-2",
    description: "Construct dark-mode glassmorphic cards with responsive breakpoints for mobile, tablet, and widescreen.",
    steps: [
      "Draft token summary cards with 24h percentage delta indicators",
      "Implement multi-range timeframe picker (1H, 24H, 7D, 1M)",
      "Embed interactive touch gestures for rapid token swap previews",
    ],
  },
  {
    id: "m-3",
    title: "3. Automated Type Validation & Forge Desktop Packaging",
    status: "pending",
    annotationId: "anno-forge-3",
    description: "Compile production bundles and assemble cross-platform installers for Windows x64, macOS Mach-O, and Linux AppImage.",
    steps: [
      "Run tsgo strict type pass across all renderer handlers",
      "Trigger Electron Forge maker with Squirrel installer target",
      "Verify code-signing certificate hashes before publishing",
    ],
  },
];

export const INITIAL_SECURITY_FINDINGS: SecurityFinding[] = [
  {
    id: "sec-1",
    severity: "medium",
    type: "Unsanitized LocalStorage Access",
    file: "src/lib/storage.ts",
    line: 34,
    description: "Storage key reads should be guarded against corrupted JSON input with zod validator fallback.",
    fixAvailable: true,
  },
  {
    id: "sec-2",
    severity: "low",
    type: "Missing Referrer Policy",
    file: "index.html",
    line: 12,
    description: "External asset links should enforce strict-origin-when-cross-origin to prevent token leakage.",
    fixAvailable: true,
  },
];

export const PROMPT_LIBRARY_DATA: PromptTemplate[] = [
  {
    id: "p-1",
    title: "Refactor Clean Architecture",
    description: "Extract monolithic components into reusable UI hooks and services.",
    slug: "refactor-clean-arch",
    content: "Analyze the current file tree and isolate data-fetching logic into dedicated custom hooks and types. Ensure strict separation of presentation and business logic.",
    category: "Refactoring",
  },
  {
    id: "p-2",
    title: "Security & Vulnerability Audit",
    description: "Scan source files for hardcoded secrets, injection vectors, and untrusted inputs.",
    slug: "audit-security",
    content: "Perform a deep static security analysis. Check for unvalidated inputs, raw HTML injections, exposed environment secrets, and insecure IPC event listeners.",
    category: "Security",
  },
  {
    id: "p-3",
    title: "Add Dark & High-Contrast Theme",
    description: "Implement accessible color palette supporting system preference toggles.",
    slug: "theme-accessible",
    content: "Configure Tailwind CSS variables to support WCAG AA 4.5:1 contrast standards for dark and light modes with smooth CSS transitions.",
    category: "Architectural",
  },
  {
    id: "p-4",
    title: "Bundle Size & Performance Optimization",
    description: "Audit bundle imports and replace bulky dependencies with lightweight equivalents.",
    slug: "optimize-perf",
    content: "Analyze bundle size metrics. Recommend code-splitting strategies with React.lazy and identify opportunities to trim tree-shakable packages.",
    category: "Performance",
  },
];

export const MCP_PLUGINS_DATA: McpPlugin[] = [
  {
    id: "mcp-sqlite",
    name: "SQLite & Relational Explorer",
    description: "Inspect local database schemas, run migrations, and execute parameterized queries in-memory.",
    status: "connected",
    version: "v1.2.0",
    endpoint: "mcp://localhost:4040/sqlite",
    tools: ["execute_sql", "get_schema", "describe_table", "seed_fixtures"],
  },
  {
    id: "mcp-fetch",
    name: "Web Crawler & Fetch Engine",
    description: "Deep crawl external documentation, APIs, and fetch live web data without CORS restrictions.",
    status: "connected",
    version: "v2.0.4",
    endpoint: "mcp://localhost:4041/web-fetch",
    tools: ["web_fetch", "scrape_markdown", "extract_meta"],
  },
  {
    id: "mcp-git",
    name: "Git Repository Controller",
    description: "Manage branch switches, staging, atomic commits, and remote push synchronizations.",
    status: "connected",
    version: "v1.8.1",
    endpoint: "mcp://localhost:4042/git",
    tools: ["git_status", "git_diff", "git_commit", "git_log"],
  },
  {
    id: "mcp-node-sandbox",
    name: "Node.js Process Sandbox",
    description: "Isolated ephemeral process manager for executing test suites, linters, and build tasks.",
    status: "disconnected",
    version: "v3.0.0",
    endpoint: "mcp://localhost:4043/sandbox",
    tools: ["run_command", "kill_process", "get_logs"],
  },
];
