import React, { useState } from "react";
import { Terminal, AlertCircle, ChevronUp, ChevronDown, CheckCircle2, Trash2 } from "lucide-react";

interface BottomDockProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({ isOpen, onToggle }) => {
  const [activeTab, setActiveTab] = useState<"terminal" | "problems" | "output">("terminal");
  const [terminalCommand, setTerminalCommand] = useState("");
  const [history, setHistory] = useState<string[]>([
    "aether-agent --version",
    "Aether Studio IPC Daemon v2.4.1 [linux-x64]",
    "tsgo --strict: 0 errors in 18 source files [142ms]",
    "Vite v6.2.0 ready in 189 ms",
    "➜  Local:   http://localhost:3000/",
    "➜  Network: use --host to expose",
  ]);

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalCommand.trim();
    if (!cmd) return;

    let response = "";
    if (cmd.startsWith("tsgo") || cmd.includes("check") || cmd.includes("ts")) {
      response = "✓ tsgo strict pass: No diagnostic errors found in AST.";
    } else if (cmd.startsWith("git") || cmd.includes("status")) {
      response = "On branch main. Your branch is up to date with 'origin/main'. Nothing to commit, working tree clean.";
    } else if (cmd.includes("lint")) {
      response = "✓ oxlint: 0 problems found across 18 modules [8ms].";
    } else if (cmd.includes("test")) {
      response = "✓ vitest: 6 suites passed, 24 tests passed [210ms].";
    } else {
      response = `[exec] Command '${cmd}' executed successfully with exit code 0.`;
    }

    setHistory((prev) => [...prev, `$ ${cmd}`, response]);
    setTerminalCommand("");
  };

  return (
    <div
      className={`border-t border-neutral-800 bg-[#0c0e15] flex flex-col transition-all duration-200 select-none shrink-0 ${
        isOpen ? "h-44 sm:h-52" : "h-8"
      }`}
    >
      {/* Dock Bar */}
      <div className="h-8 px-2 sm:px-3 border-b border-neutral-800 flex items-center justify-between text-xs bg-neutral-900/60 shrink-0 overflow-x-auto no-scrollbar gap-2">
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={() => {
              setActiveTab("terminal");
              if (!isOpen) onToggle();
            }}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "terminal" && isOpen
                ? "bg-neutral-800 text-cyan-400 font-semibold"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("problems");
              if (!isOpen) onToggle();
            }}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "problems" && isOpen
                ? "bg-neutral-800 text-cyan-400 font-semibold"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Problems (0)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("output");
              if (!isOpen) onToggle();
            }}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "output" && isOpen
                ? "bg-neutral-800 text-cyan-400 font-semibold"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <span>Output</span>
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isOpen && activeTab === "terminal" && (
            <button
              onClick={() => setHistory([])}
              className="p-1 rounded text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
              title="Clear terminal"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={onToggle}
            className="p-1 rounded text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Dock Content */}
      {isOpen && (
        <div className="flex-1 overflow-hidden flex flex-col font-mono text-xs">
          {activeTab === "terminal" && (
            <div className="flex-1 flex flex-col bg-[#07080c] p-3 overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-1 text-neutral-300">
                {history.map((line, idx) => (
                  <div
                    key={idx}
                    className={
                      line.startsWith("$")
                        ? "text-cyan-400 font-semibold"
                        : line.includes("error")
                        ? "text-rose-400"
                        : line.includes("✓")
                        ? "text-emerald-400"
                        : "text-neutral-400"
                    }
                  >
                    {line}
                  </div>
                ))}
              </div>

              <form onSubmit={handleRunCommand} className="mt-2 flex items-center gap-2 border-t border-neutral-800/80 pt-2">
                <span className="text-cyan-400 font-bold">$</span>
                <input
                  type="text"
                  placeholder="Type shell command (e.g. tsgo, npm test, git status)..."
                  value={terminalCommand}
                  onChange={(e) => setTerminalCommand(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-neutral-200 focus:outline-none placeholder-neutral-600"
                />
              </form>
            </div>
          )}

          {activeTab === "problems" && (
            <div className="flex-1 p-4 bg-[#07080c] flex items-center justify-center text-center">
              <div className="space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs text-neutral-200 font-semibold">No Problems Detected</p>
                <p className="text-[11px] text-neutral-500">
                  TypeScript strict checks, syntax trees, and oxlint are completely clean.
                </p>
              </div>
            </div>
          )}

          {activeTab === "output" && (
            <div className="flex-1 p-3 bg-[#07080c] overflow-y-auto space-y-1 text-neutral-400 text-[11px]">
              <div>[Aether Engine] Bootstrapped local node process on PID 4209</div>
              <div>[IPC Boundary] Established secure Electron pipe between main and renderer</div>
              <div>[HMR Socket] Heartbeat OK (12ms ping)</div>
              <div>[Sandbox Manager] Storage mapped to ~/.config/aether/workspaces/app-crypto-pulse</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
