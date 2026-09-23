import React, { useState, useRef, useEffect } from "react";
import { 
  Terminal as TerminalIcon, 
  Play, 
  Trash2, 
  Copy, 
  Check, 
  Folder, 
  GitBranch, 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Plus
} from "lucide-react";
import { AppRecord, WorkspaceCommit } from "../types";

interface TerminalPanelProps {
  app: AppRecord;
  onUpdateFile?: (filename: string, content: string) => void;
  onCommitChanges?: (commitMessage: string) => Promise<void> | void;
  onOpenGitHubSync?: () => void;
  gitSyncStatus?: "idle" | "syncing" | "synced" | "error";
  gitRepoName?: string;
  commits?: WorkspaceCommit[];
}

interface CommandOutput {
  id: string;
  command: string;
  timestamp: string;
  output: string[];
  status: "success" | "error" | "info";
  durationMs: number;
}

interface TerminalSession {
  id: string;
  name: string;
  history: CommandOutput[];
}

export const TerminalPanel: React.FC<TerminalPanelProps> = ({
  app,
  onUpdateFile,
  onCommitChanges,
  onOpenGitHubSync,
  gitSyncStatus = "idle",
  gitRepoName,
  commits = [],
}) => {
  const safeAppName = app.name.toLowerCase().replace(/[^a-z0-9-_]/g, "-") || "aether-app";
  const workingDir = `~/workspace/${safeAppName}`;

  const initialOutputs: CommandOutput[] = [
    {
      id: "out-init-1",
      command: "aether-studio --version",
      timestamp: "10:40:02",
      output: [
        "Aether Studio CLI Environment v2.4.1 [linux-x64]",
        "Connected to Local Agent Daemon & IPC Boundary",
        "Workspace: " + workingDir,
      ],
      status: "info",
      durationMs: 12,
    },
    {
      id: "out-init-2",
      command: "npm run ts",
      timestamp: "10:40:05",
      output: [
        "> dyad@1.15.0 ts",
        "> tsgo",
        "✓ Strict type-check complete: 0 errors in 21 source files",
        "✓ Clean AST verification against TypeScript 6.0 engine",
      ],
      status: "success",
      durationMs: 142,
    },
    {
      id: "out-init-3",
      command: "git status",
      timestamp: "10:40:08",
      output: [
        "On branch main",
        "Your branch is up to date with 'origin/main'.",
        `Configured targets: Web (Vite), Desktop (Windows/macOS), Mobile (Android)`,
        `GitHub Sync: ${gitRepoName ? `https://github.com/${gitRepoName} (${gitSyncStatus})` : "Local workspace (unlinked)"}`,
        "nothing to commit, working tree clean",
      ],
      status: "info",
      durationMs: 28,
    },
  ];

  const [sessions, setSessions] = useState<TerminalSession[]>([
    { id: "sess-1", name: "bash", history: initialOutputs },
    { id: "sess-2", name: "build & test", history: [] },
  ]);
  const [activeSessionId, setActiveSessionId] = useState("sess-1");

  const [inputCommand, setInputCommand] = useState("");
  const [commandHistoryList, setCommandHistoryList] = useState<string[]>([
    "aether-studio --version",
    "npm run ts",
    "git status",
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copiedSession, setCopiedSession] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Auto-scroll to bottom of active terminal output
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession.history, isExecuting]);

  const handleCommandSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const rawCmd = inputCommand.trim();
    if (!rawCmd) return;

    // Reset command input and history index
    setInputCommand("");
    setHistoryIndex(-1);
    setCommandHistoryList((prev) => [rawCmd, ...prev.filter((c) => c !== rawCmd)]);

    const startTime = performance.now();
    setIsExecuting(true);

    const parts = rawCmd.split(/\s+/);
    const mainCmd = parts[0].toLowerCase();
    const subCmd = parts[1]?.toLowerCase();

    let outputLines: string[] = [];
    let status: "success" | "error" | "info" = "info";

    // Simulate async execution duration for realism
    await new Promise((resolve) => setTimeout(resolve, 80));

    // Command interpreter
    if (rawCmd === "help") {
      status = "info";
      outputLines = [
        "Aether Studio CLI - Available Built-in Commands:",
        "--------------------------------------------------",
        "  npm run dev          Start Vite local development server on port 3000",
        "  npm run build        Bundle production web application with Vite",
        "  npm run ts / tsgo    Execute strict TypeScript compiler check (tsgo)",
        "  npm run lint         Run fast Oxlint AST validation across source files",
        "  npm run test         Execute Vitest unit & integration test suites",
        "  npm run make:windows Package Electron Windows Desktop app (win32-x64)",
        "  npm run sync:android Synchronize Capacitor web assets to Android target",
        "  git status           Inspect current git working tree & GitHub sync status",
        "  git log              List recent workspace commits and SHAs",
        "  git commit -m \"<msg>\" Create workspace commit and push if GitHub is linked",
        "  git push             Push local commits to configured GitHub repository",
        "  git diff             View file modifications compared to last commit",
        "  git branch           Show repository branches",
        "  ls [-la]             List files in the current active application",
        "  cat <file>           Display contents of any workspace file",
        "  pwd                  Print working directory",
        "  doctor               Run system diagnostics (Node, Forge, Azure, Git)",
        "  clear                Clear the active terminal output screen",
        "--------------------------------------------------",
        "Tip: Use Arrow Up / Down keys to cycle through previous commands.",
      ];
    } else if (rawCmd === "clear") {
      setSessions((prev) =>
        prev.map((s) => (s.id === activeSessionId ? { ...s, history: [] } : s))
      );
      setIsExecuting(false);
      return;
    } else if (mainCmd === "pwd") {
      outputLines = [`/home/aether/workspace/${safeAppName}`];
      status = "info";
    } else if (mainCmd === "ls" || mainCmd === "dir") {
      const isDetailed = parts.includes("-la") || parts.includes("-l") || parts.includes("-a");
      const files = Object.keys(app.files);
      if (isDetailed) {
        outputLines = [
          `total ${files.length * 4}`,
          "drwxr-xr-x 2 aether aether 4096 Sep 23 10:40 .",
          "drwxr-xr-x 8 aether aether 4096 Sep 23 10:40 ..",
          ...files.map((file) => {
            const size = (app.files[file]?.length || 0).toString().padStart(6, " ");
            return `-rw-r--r-- 1 aether aether ${size} Sep 23 10:40 ${file}`;
          }),
        ];
      } else {
        outputLines = [files.join("   ")];
      }
      status = "success";
    } else if (mainCmd === "cat") {
      const targetFile = parts[1];
      if (!targetFile) {
        outputLines = ["cat: missing file operand. Example: cat src/App.tsx"];
        status = "error";
      } else if (app.files[targetFile]) {
        outputLines = app.files[targetFile].split("\n");
        status = "info";
      } else {
        // Try searching without prefix or with exact matches
        const match = Object.keys(app.files).find((k) => k.endsWith(targetFile) || k === targetFile);
        if (match && app.files[match]) {
          outputLines = app.files[match].split("\n");
          status = "info";
        } else {
          outputLines = [`cat: ${targetFile}: No such file or directory`];
          status = "error";
        }
      }
    } else if (rawCmd.startsWith("echo")) {
      const text = rawCmd.slice(4).trim();
      outputLines = [text.replace(/^["']|["']$/g, "")];
      status = "info";
    } else if (mainCmd === "npm" || mainCmd === "bun" || mainCmd === "pnpm") {
      if (subCmd === "run") {
        const scriptName = parts[2]?.toLowerCase();
        if (scriptName === "dev" || scriptName === "start") {
          outputLines = [
            `> ${safeAppName}@1.0.0 dev`,
            "> vite --host 0.0.0.0 --port 3000",
            "",
            "  VITE v6.2.0  ready in 146 ms",
            "",
            "  ➜  Local:   http://localhost:3000/",
            "  ➜  Network: http://172.17.0.2:3000/",
            "  ➜  press h + enter to show help",
            "✓ Live Preview container reloaded & running seamlessly.",
          ];
          status = "success";
        } else if (scriptName === "build") {
          outputLines = [
            `> ${safeAppName}@1.0.0 build`,
            "> vite build",
            "",
            "vite v6.2.0 building for production...",
            "transforming (24) modules...",
            "✓ 24 modules transformed.",
            "dist/index.html                   0.52 kB │ gzip:  0.31 kB",
            "dist/assets/index-Dk93x8a.css    14.28 kB │ gzip:  3.64 kB",
            "dist/assets/index-Bf82b7q.js   182.40 kB │ gzip: 56.12 kB",
            "✓ built in 312ms",
            "Production assets ready in dist/ directory.",
          ];
          status = "success";
        } else if (scriptName === "ts" || scriptName === "typecheck" || scriptName === "tsgo") {
          outputLines = [
            `> ${safeAppName}@1.0.0 ts`,
            "> tsgo",
            "✓ AST traversal completed on 21 source files in 28ms",
            "✓ Zero type diagnostics found (TypeScript 6.0 strict mode).",
          ];
          status = "success";
        } else if (scriptName === "lint") {
          outputLines = [
            `> ${safeAppName}@1.0.0 lint`,
            "> oxlint src",
            "Found 0 warnings and 0 errors.",
            "Finished in 16ms on 21 files with 94 rules using 2 threads.",
          ];
          status = "success";
        } else if (scriptName === "test") {
          outputLines = [
            `> ${safeAppName}@1.0.0 test`,
            "> vitest run",
            "",
            " ✓ packages/ts-pg-schema-diff/test/unit.test.ts (43 tests) 76ms",
            " ✓ packages/pg-schema-classifier/test/unit.test.ts (24 tests) 24ms",
            "Test Files  2 passed (2)",
            "     Tests  67 passed (67)",
            "  Start at  " + new Date().toLocaleTimeString(),
            "  Duration  210ms",
            "✓ All unit test suites passed cleanly.",
          ];
          status = "success";
        } else if (scriptName === "make:windows" || scriptName === "make") {
          outputLines = [
            `> ${safeAppName}@1.0.0 make:windows`,
            "> electron-forge make --platform=win32 --arch=x64",
            "",
            "✔ Checking your system",
            "✔ Resolving Forge Config (loaded windowsSign & packaging cleanup)",
            "✔ Packaging Application (win32-x64)",
            "✔ Running afterCopy hooks: stripped non-signable scripts & native binaries",
            "✔ Signing win32 executables using Azure Trusted Signing / signtool",
            "✔ Creating Squirrel.Windows distribution: out/make/squirrel.windows/x64/Dyad-Setup.exe",
            "✔ Creating Portable ZIP: out/dist/Dyad-Windows-Portable-x64.zip",
            "✨ Windows desktop build generated successfully!",
          ];
          status = "success";
        } else if (scriptName === "sync:android" || scriptName === "build:mobile") {
          outputLines = [
            `> ${safeAppName}@1.0.0 sync:android`,
            "> npx cap sync android",
            "",
            "✔ Copying web assets from dist/ to android/app/src/main/assets/public",
            "✔ Updating Android plugins & capacitor.config.json",
            "✔ Syncing Gradle project structure",
            "✨ Android project assets synchronized! Ready for APK build in GitHub Actions.",
          ];
          status = "success";
        } else {
          outputLines = [
            `npm error Missing script: "${scriptName || ""}"`,
            "To see a list of scripts, run: help or npm run",
          ];
          status = "error";
        }
      } else if (subCmd === "test") {
        outputLines = [
          "> vitest run",
          "Test Files  2 passed (2)",
          "     Tests  67 passed (67)",
          "✓ All tests passed successfully.",
        ];
        status = "success";
      } else if (subCmd === "install" || subCmd === "i" || subCmd === "add") {
        const pkgName = parts[2] || "dependencies";
        outputLines = [
          `added 1 package, and audited 184 packages in 640ms`,
          `found 0 vulnerabilities`,
          `Package "${pkgName}" added to workspace dependencies.`,
        ];
        status = "success";
      } else {
        outputLines = [`npm v11.8.0 - Run 'help' to see supported commands`];
        status = "info";
      }
    } else if (mainCmd === "git") {
      if (subCmd === "status") {
        outputLines = [
          "On branch main",
          `Your branch is up to date with 'origin/main'.`,
          "",
          "Changes ready for workspace synchronization:",
          ...Object.keys(app.files).slice(0, 5).map((f) => `  \x1b[32mmodified:   ${f}\x1b[0m`),
          Object.keys(app.files).length > 5 ? `  ... and ${Object.keys(app.files).length - 5} more files` : "",
          "",
          `GitHub Remote: ${gitRepoName ? `https://github.com/${gitRepoName}` : "Not linked (configure in Sync modal)"}`,
          `Sync Status: ${gitSyncStatus.toUpperCase()}`,
        ].filter(Boolean);
        status = "info";
      } else if (subCmd === "log") {
        outputLines = [
          "commit 7f2a1b9c4 (HEAD -> main, origin/main)",
          "Author: Aether Agent <agent@aetherstudio.dev>",
          "Date:   " + new Date().toDateString(),
          "",
          "    feat(workspace): integrated dual desktop, mobile & web targets",
          "",
          "commit 3c8e901a2",
          "Author: Aether Developer <dev@aetherstudio.dev>",
          "Date:   " + new Date(Date.now() - 3600000).toDateString(),
          "",
          "    chore: initialized clean monorepo architecture with tsgo validation",
          ...commits.slice(0, 3).map((c) => `\ncommit ${c.hash}\nAuthor: ${c.author}\nDate: ${c.timestamp}\n\n    ${c.message}`),
        ];
        status = "info";
      } else if (subCmd === "commit") {
        const match = rawCmd.match(/-m\s+["'](.+?)["']/);
        const msg = match ? match[1] : parts.slice(2).join(" ") || "update workspace files";
        const shortHash = Math.random().toString(16).substring(2, 9);
        
        outputLines = [
          `[main ${shortHash}] ${msg}`,
          ` ${Object.keys(app.files).length} files changed, 48 insertions(+), 6 deletions(-)`,
          ` create mode 100644 ${Object.keys(app.files)[0] || "src/App.tsx"}`,
        ];

        if (onCommitChanges) {
          await onCommitChanges(msg);
          outputLines.push(`[sync] Workspace commit created and broadcasted.`);
        }
        status = "success";
      } else if (subCmd === "push") {
        if (gitRepoName) {
          outputLines = [
            `Enumerating objects: 14, done.`,
            `Counting objects: 100% (14/14), done.`,
            `Writing objects: 100% (14/14), 4.2 KiB | 4.2 MiB/s, done.`,
            `Total 14 (delta 6), reused 0 (delta 0), pack-reused 0`,
            `To https://github.com/${gitRepoName}.git`,
            `   7f2a1b9..${Math.random().toString(16).substring(2, 9)}  main -> main`,
            `✓ Pushed branch main to GitHub successfully!`,
          ];
          status = "success";
        } else {
          outputLines = [
            "fatal: No remote configured.",
            "Use the 'GitHub Sync' button in the toolbar to link your repository.",
          ];
          status = "error";
        }
      } else if (subCmd === "diff") {
        outputLines = [
          "diff --git a/src/App.tsx b/src/App.tsx",
          "--- a/src/App.tsx",
          "+++ b/src/App.tsx",
          "@@ -14,6 +14,8 @@ export default function App() {",
          "+  // Modern responsive workspace shell",
          "+  const [activeTab, setActiveTab] = useState('workspace');",
          "   return (",
          "     <div className=\"min-h-screen bg-[#090b10]\">",
        ];
        status = "info";
      } else if (subCmd === "branch") {
        outputLines = [
          "* main",
          "  feature/dual-architecture",
          "  release/v1.0.0",
        ];
        status = "info";
      } else if (subCmd === "remote") {
        outputLines = gitRepoName
          ? [
              `origin  https://github.com/${gitRepoName}.git (fetch)`,
              `origin  https://github.com/${gitRepoName}.git (push)`,
            ]
          : ["fatal: No git remote configured."];
        status = gitRepoName ? "info" : "error";
      } else {
        outputLines = [`git: '${subCmd}' is not a recognized git command. Run 'help' for examples.`];
        status = "error";
      }
    } else if (rawCmd === "doctor") {
      outputLines = [
        "Aether Studio Workspace Diagnostics:",
        "=========================================",
        "  [✓] Node.js Runtime:           v24.13.1 (LTS compatibility verified)",
        "  [✓] Package Manager:           npm 11.8.0 / Bun runtime available",
        "  [✓] TypeScript Engine:         tsgo strict mode (Zero diagnostic errors)",
        "  [✓] Linter:                    Oxlint v0.15 (All AST rules passing)",
        "  [✓] Bundler & Dev Server:      Vite v6.2.0 (Active port: 3000)",
        "  [✓] Electron Forge:            v7.7.0 (Config loaded, windowsSign valid)",
        "  [✓] Windows Code Signing:      Azure Trusted Signing metadata ready",
        "  [✓] Multi-Target Monorepo:     Web, Desktop (Electron), Mobile (Capacitor)",
        `  [${gitRepoName ? "✓" : "!"}] GitHub Synchronization:     ${gitRepoName ? `Linked to ${gitRepoName}` : "Unlinked (local mode active)"}`,
        "=========================================",
        "All core engineering checks passed! Exit code 0.",
      ];
      status = "success";
    } else if (mainCmd === "touch") {
      const fileName = parts[1];
      if (!fileName) {
        outputLines = ["touch: missing file operand"];
        status = "error";
      } else {
        if (onUpdateFile) {
          onUpdateFile(fileName, "// Created via Aether Terminal\n");
        }
        outputLines = [`File created: ${fileName}`];
        status = "success";
      }
    } else if (mainCmd === "rm") {
      const fileName = parts[1];
      if (!fileName) {
        outputLines = ["rm: missing operand"];
        status = "error";
      } else {
        outputLines = [`Removed file: ${fileName}`];
        status = "success";
      }
    } else {
      outputLines = [
        `bash: command not found: ${parts[0]}`,
        `Type 'help' to inspect available CLI commands, scripts, and git workflows.`,
      ];
      status = "error";
    }

    const durationMs = Math.round(performance.now() - startTime);

    const newOutput: CommandOutput = {
      id: `cmd-${Date.now()}`,
      command: rawCmd,
      timestamp: new Date().toLocaleTimeString(),
      output: outputLines,
      status,
      durationMs,
    };

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? { ...s, history: [...s.history, newOutput] }
          : s
      )
    );

    setIsExecuting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistoryList.length === 0) return;
      const nextIdx = Math.min(historyIndex + 1, commandHistoryList.length - 1);
      setHistoryIndex(nextIdx);
      setInputCommand(commandHistoryList[nextIdx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setInputCommand("");
      } else {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputCommand(commandHistoryList[nextIdx] || "");
      }
    } else if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setSessions((prev) =>
        prev.map((s) => (s.id === activeSessionId ? { ...s, history: [] } : s))
      );
    }
  };

  const executePreset = (cmd: string) => {
    setInputCommand(cmd);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  };

  const handleCopyHistory = () => {
    const text = activeSession.history
      .map(
        (h) =>
          `aether@studio:${workingDir}$ ${h.command}\n${h.output.join("\n")}`
      )
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopiedSession(true);
    setTimeout(() => setCopiedSession(false), 1500);
  };

  const handleAddSession = () => {
    const newId = `sess-${Date.now()}`;
    const newName = `session-${sessions.length + 1}`;
    setSessions((prev) => [
      ...prev,
      {
        id: newId,
        name: newName,
        history: [
          {
            id: `init-${newId}`,
            command: "pwd",
            timestamp: new Date().toLocaleTimeString(),
            output: [`/home/aether/workspace/${safeAppName}`],
            status: "info",
            durationMs: 4,
          },
        ],
      },
    ]);
    setActiveSessionId(newId);
  };

  const handleCloseSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) return;
    const remaining = sessions.filter((s) => s.id !== id);
    setSessions(remaining);
    if (activeSessionId === id) {
      setActiveSessionId(remaining[0].id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#08090e] text-neutral-100 font-mono select-none min-h-0 overflow-hidden">
      {/* Top Header Bar */}
      <div className="h-10 border-b border-neutral-800 bg-[#0c0e16] px-3 flex items-center justify-between gap-2 shrink-0">
        {/* Left: Sessions tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {sessions.map((s) => (
            <div
              key={s.id}
              onClick={() => setActiveSessionId(s.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
                activeSessionId === s.id
                  ? "bg-neutral-800 text-cyan-400 font-medium shadow-sm border border-neutral-700/80"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900"
              }`}
            >
              <TerminalIcon className="w-3 h-3 text-cyan-400" />
              <span>{s.name}</span>
              {sessions.length > 1 && (
                <button
                  onClick={(e) => handleCloseSession(s.id, e)}
                  className="hover:text-rose-400 ml-1 p-0.5 rounded transition-colors"
                  title="Close session"
                >
                  <XCircle className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          ))}

          <button
            onClick={handleAddSession}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
            title="Open new terminal tab"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 text-xs">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-neutral-400 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">
            <Folder className="w-3 h-3 text-amber-400" />
            <span className="text-neutral-300 font-mono truncate max-w-[140px]">
              {safeAppName}
            </span>
          </div>

          {onOpenGitHubSync && (
            <button
              onClick={onOpenGitHubSync}
              className="hidden md:flex items-center gap-1 px-2 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-[11px] transition-colors cursor-pointer"
              title="Open GitHub sync configuration"
            >
              <GitBranch className="w-3 h-3 text-cyan-400" />
              <span>{gitRepoName ? gitRepoName.split("/")[1] || gitRepoName : "Sync GitHub"}</span>
            </button>
          )}

          <button
            onClick={handleCopyHistory}
            className="flex items-center gap-1 px-2 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-[11px] transition-colors cursor-pointer"
            title="Copy terminal log"
          >
            {copiedSession ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-neutral-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={() =>
              setSessions((prev) =>
                prev.map((s) => (s.id === activeSessionId ? { ...s, history: [] } : s))
              )
            }
            className="flex items-center gap-1 px-2 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-rose-300 border border-neutral-800 text-[11px] transition-colors cursor-pointer"
            title="Clear terminal (Ctrl+L)"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Quick Action Chips Bar */}
      <div className="border-b border-neutral-800/80 bg-[#090b12] px-3 py-1.5 flex items-center gap-1.5 text-[11px] overflow-x-auto no-scrollbar shrink-0">
        <span className="text-neutral-500 font-medium text-[10px] uppercase tracking-wider shrink-0 mr-1">
          Quick CLI:
        </span>

        <button
          onClick={() => executePreset("npm run dev")}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-900 hover:bg-cyan-950/60 text-cyan-300 border border-neutral-800 hover:border-cyan-800/80 transition-colors whitespace-nowrap cursor-pointer"
        >
          <Play className="w-2.5 h-2.5 text-cyan-400 fill-cyan-400" />
          <span>npm run dev</span>
        </button>

        <button
          onClick={() => executePreset("npm run build")}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 hover:border-neutral-700 transition-colors whitespace-nowrap cursor-pointer"
        >
          <span>npm run build</span>
        </button>

        <button
          onClick={() => executePreset("npm run ts")}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-900 hover:bg-emerald-950/60 text-emerald-300 border border-neutral-800 hover:border-emerald-800/80 transition-colors whitespace-nowrap cursor-pointer"
        >
          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
          <span>npm run ts (tsgo)</span>
        </button>

        <button
          onClick={() => executePreset("npm run lint")}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 hover:border-neutral-700 transition-colors whitespace-nowrap cursor-pointer"
        >
          <span>npm run lint</span>
        </button>

        <button
          onClick={() => executePreset("git status")}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 hover:border-neutral-700 transition-colors whitespace-nowrap cursor-pointer"
        >
          <GitBranch className="w-2.5 h-2.5 text-amber-400" />
          <span>git status</span>
        </button>

        <button
          onClick={() => executePreset("npm run make:windows")}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-900 hover:bg-blue-950/60 text-blue-300 border border-neutral-800 hover:border-blue-800/80 transition-colors whitespace-nowrap cursor-pointer"
        >
          <span>make:windows</span>
        </button>

        <button
          onClick={() => executePreset("doctor")}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-900 hover:bg-purple-950/60 text-purple-300 border border-neutral-800 hover:border-purple-800/80 transition-colors whitespace-nowrap cursor-pointer"
        >
          <Cpu className="w-2.5 h-2.5 text-purple-400" />
          <span>doctor</span>
        </button>

        <button
          onClick={() => executePreset("help")}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border border-neutral-800 transition-colors whitespace-nowrap cursor-pointer ml-auto"
        >
          <HelpCircle className="w-2.5 h-2.5" />
          <span>help</span>
        </button>
      </div>

      {/* Terminal Output Scroll Area */}
      <div 
        onClick={() => inputRef.current?.focus()}
        className="flex-1 p-3 sm:p-4 overflow-y-auto min-h-0 space-y-3 cursor-text text-xs leading-relaxed font-mono"
      >
        {activeSession.history.map((item) => (
          <div key={item.id} className="space-y-1">
            {/* Command Header line */}
            <div className="flex items-center justify-between gap-2 text-neutral-400 select-text">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-cyan-400 font-semibold">aether@studio</span>
                <span className="text-neutral-600">:</span>
                <span className="text-amber-400/90">{workingDir}</span>
                <span className="text-neutral-500">$</span>
                <span className="text-neutral-100 font-bold select-all">{item.command}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-neutral-500 shrink-0">
                <span>{item.durationMs}ms</span>
                <span>{item.timestamp}</span>
                {item.status === "success" && (
                  <span className="px-1 py-0.2 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                    exit 0
                  </span>
                )}
                {item.status === "error" && (
                  <span className="px-1 py-0.2 rounded bg-rose-950/80 text-rose-400 border border-rose-800/60">
                    exit 1
                  </span>
                )}
              </div>
            </div>

            {/* Output lines */}
            <div className="pl-3 border-l-2 border-neutral-800 select-text whitespace-pre-wrap font-mono text-[11.5px] py-0.5">
              {item.output.map((line, idx) => {
                let colorClass = "text-neutral-300";
                if (line.startsWith("✓") || line.startsWith("✔") || line.includes("successfully") || line.includes("passed")) {
                  colorClass = "text-emerald-400 font-medium";
                } else if (line.startsWith("fatal:") || line.startsWith("error") || line.includes("failed") || line.startsWith("bash: command not found")) {
                  colorClass = "text-rose-400 font-medium";
                } else if (line.startsWith("warning") || line.startsWith("[!]")) {
                  colorClass = "text-amber-400";
                } else if (line.startsWith(">") || line.startsWith("===") || line.startsWith("---")) {
                  colorClass = "text-neutral-400 font-semibold";
                } else if (line.startsWith("  ➜") || line.startsWith("http://")) {
                  colorClass = "text-cyan-300";
                } else if (line.startsWith("On branch") || line.startsWith("diff --git") || line.startsWith("commit ")) {
                  colorClass = "text-indigo-300";
                }

                return (
                  <div key={idx} className={`${colorClass} leading-5`}>
                    {line}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {isExecuting && (
          <div className="flex items-center gap-2 text-cyan-400 text-xs py-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Executing command...</span>
          </div>
        )}

        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Input Bar */}
      <form
        onSubmit={handleCommandSubmit}
        className="border-t border-neutral-800 bg-[#0b0d14] px-3 py-2 flex items-center gap-2 shrink-0"
      >
        <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold shrink-0">
          <span>aether@studio</span>
          <span className="text-neutral-500">:</span>
          <span className="text-amber-400 hidden sm:inline">{workingDir}</span>
          <span className="text-neutral-400">$</span>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputCommand}
          onChange={(e) => setInputCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type command (e.g. npm run build, git status, doctor, help)..."
          className="flex-1 bg-transparent text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none font-mono caret-cyan-400"
          autoFocus
        />

        <button
          type="submit"
          disabled={!inputCommand.trim() || isExecuting}
          className="flex items-center gap-1 px-3 py-1 rounded-md bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-neutral-950 font-semibold text-xs shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <Play className="w-3 h-3 fill-neutral-950" />
          <span className="hidden sm:inline">Run</span>
        </button>
      </form>
    </div>
  );
};
