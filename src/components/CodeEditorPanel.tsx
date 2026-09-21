import React, { useState, useRef } from "react";
import { 
  FileCode, 
  Folder, 
  Save, 
  Copy, 
  Check, 
  FileJson,
  FileText,
  PanelLeftClose,
  PanelLeft,
  GitCommit,
  GitBranch,
  RefreshCw,
  Layers
} from "lucide-react";
import { AppRecord } from "../types";

interface CodeEditorPanelProps {
  app: AppRecord;
  onUpdateFile: (filename: string, content: string) => void;
  onCommitChanges?: (commitMessage: string) => void;
  onOpenGitHubSync?: () => void;
  gitSyncStatus?: "idle" | "syncing" | "synced" | "error";
  gitRepoName?: string;
  lastCommitHash?: string;
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({ 
  app, 
  onUpdateFile,
  onCommitChanges,
  onOpenGitHubSync,
  gitSyncStatus = "idle",
  gitRepoName,
  lastCommitHash = "c4a921d",
}) => {
  const fileKeys = Object.keys(app.files);
  const [activeFile, setActiveFile] = useState<string>(fileKeys[0] || "src/App.tsx");
  const [fileContent, setFileContent] = useState<string>(app.files[activeFile] || "");
  const [copied, setCopied] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showFileTree, setShowFileTree] = useState(true);
  const [showCommitPrompt, setShowCommitPrompt] = useState(false);
  const [commitMsg, setCommitMsg] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const handleSelectFile = (file: string) => {
    if (hasUnsavedChanges) {
      onUpdateFile(activeFile, fileContent);
      setHasUnsavedChanges(false);
    }
    setActiveFile(file);
    setFileContent(app.files[file] || "");
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFileContent(e.target.value);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    onUpdateFile(activeFile, fileContent);
    setHasUnsavedChanges(false);
  };

  const handleCommitSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (hasUnsavedChanges) {
      onUpdateFile(activeFile, fileContent);
      setHasUnsavedChanges(false);
    }
    const message = commitMsg.trim() || `update ${activeFile}`;
    if (onCommitChanges) {
      onCommitChanges(message);
    }
    setCommitMsg("");
    setShowCommitPrompt(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const lineNumbers = fileContent.split("\n").map((_, i) => i + 1);

  return (
    <div className="flex h-full bg-[#0a0c12] select-none relative overflow-hidden">
      {/* File Tree Explorer (Collapsible on mobile & desktop) */}
      {showFileTree && (
        <div className="w-52 sm:w-56 border-r border-neutral-800 bg-[#0d0f17] flex flex-col shrink-0 z-10 transition-all">
          <div className="p-2.5 sm:p-3 border-b border-neutral-800/80 text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
            <span className="truncate">Files</span>
            <span className="font-mono text-[10px] text-neutral-400">{fileKeys.length} items</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <div className="text-xs text-neutral-400 flex items-center gap-1.5 px-2 py-1 font-semibold truncate">
              <Folder className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{app.name}</span>
            </div>

            <div className="pl-3 sm:pl-4 space-y-0.5">
              {fileKeys.map((file) => {
                const isSelected = activeFile === file;
                const isJson = file.endsWith(".json");
                const isCss = file.endsWith(".css");

                return (
                  <button
                    key={file}
                    onClick={() => handleSelectFile(file)}
                    className={`w-full text-left px-2 py-1.5 rounded-md text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-cyan-950/60 text-cyan-300 border border-cyan-800/50"
                        : "text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200"
                    }`}
                  >
                    {isJson ? (
                      <FileJson className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    ) : isCss ? (
                      <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    ) : (
                      <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    )}
                    <span className="truncate">{file}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tree Footer */}
          <div className="p-2 sm:p-2.5 border-t border-neutral-800 text-[10px] text-neutral-400 flex items-center justify-between font-mono bg-neutral-900/40 shrink-0">
            <span>Dual Target</span>
            <span className="text-cyan-400 flex items-center gap-1">
              <Layers className="w-3 h-3" /> Web + Desktop
            </span>
          </div>
        </div>
      )}

      {/* Editor Main Canvas */}
      <div className="flex-1 flex flex-col bg-[#07080c] min-w-0 overflow-hidden">
        {/* Editor Tab Bar */}
        <div className="h-10 border-b border-neutral-800 bg-[#0d0f17] px-2 sm:px-3 flex items-center justify-between text-xs overflow-x-auto no-scrollbar gap-2 shrink-0">
          <div className="flex items-center gap-2 font-mono text-neutral-300 min-w-0">
            <button
              onClick={() => setShowFileTree(!showFileTree)}
              className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
              title={showFileTree ? "Hide files sidebar" : "Show files sidebar"}
            >
              {showFileTree ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeft className="w-3.5 h-3.5" />}
            </button>
            <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-semibold text-neutral-200 truncate">{activeFile}</span>
            {hasUnsavedChanges && (
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" title="Unsaved changes" />
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {hasUnsavedChanges && (
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-neutral-950 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                <Save className="w-3.5 h-3.5" /> Save
              </button>
            )}

            {/* Commit & Sync Action */}
            <button
              onClick={() => {
                setCommitMsg(`update ${activeFile}`);
                setShowCommitPrompt(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-750 text-cyan-300 text-xs font-mono font-medium transition-colors cursor-pointer whitespace-nowrap border border-neutral-700"
              title="Commit current workspace and sync to GitHub"
            >
              <GitCommit className="w-3.5 h-3.5 text-cyan-400" />
              <span>Commit & Sync</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1 p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
              title="Copy Code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Quick Commit Modal / Banner */}
        {showCommitPrompt && (
          <div className="p-2.5 bg-neutral-900 border-b border-neutral-800 flex items-center gap-2 shrink-0 z-20">
            <GitCommit className="w-4 h-4 text-cyan-400 shrink-0" />
            <form onSubmit={handleCommitSubmit} className="flex-1 flex items-center gap-2">
              <input
                type="text"
                autoFocus
                placeholder="Commit message (e.g. feat: update UI styling)..."
                value={commitMsg}
                onChange={(e) => setCommitMsg(e.target.value)}
                className="flex-1 bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <button
                type="submit"
                className="px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-semibold whitespace-nowrap cursor-pointer"
              >
                Commit & Push
              </button>
              <button
                type="button"
                onClick={() => setShowCommitPrompt(false)}
                className="px-2 py-1 text-neutral-400 hover:text-neutral-200 text-xs cursor-pointer"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Editor Textarea with synced line numbers */}
        <div className="flex-1 relative flex overflow-hidden font-mono text-xs min-h-0">
          {/* Line Numbers */}
          <div 
            ref={lineNumbersRef}
            className="w-10 sm:w-12 bg-[#090b10] border-r border-neutral-850 select-none py-3 text-right pr-2 sm:pr-3 text-neutral-600 font-mono text-[11px] leading-5 overflow-hidden shrink-0"
          >
            {lineNumbers.map((n) => (
              <div key={n}>{n}</div>
            ))}
          </div>

          {/* Interactive Code Area */}
          <textarea
            ref={textareaRef}
            value={fileContent}
            onChange={handleTextChange}
            onScroll={handleScroll}
            spellCheck={false}
            className="flex-1 bg-[#07080c] text-neutral-200 p-3 leading-5 resize-none focus:outline-none font-mono text-xs overflow-auto whitespace-pre selection:bg-cyan-600/30"
          />
        </div>

        {/* Editor Bottom Status Bar */}
        <div className="h-7 border-t border-neutral-800 bg-[#0d0f17] px-2 sm:px-3 flex items-center justify-between text-[10px] sm:text-[11px] text-neutral-400 font-mono overflow-x-auto no-scrollbar whitespace-nowrap gap-3 shrink-0">
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              TypeScript OK
            </span>

            {/* Git Branch & Commit Hash */}
            <span className="flex items-center gap-1 text-neutral-300">
              <GitBranch className="w-3 h-3 text-cyan-400" />
              <span>main</span>
              <span className="text-neutral-500">({lastCommitHash})</span>
            </span>

            {/* GitHub Sync Status Pill */}
            <button
              onClick={onOpenGitHubSync}
              className="flex items-center gap-1 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              {gitSyncStatus === "syncing" ? (
                <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin" />
              ) : (
                <span className={`w-1.5 h-1.5 rounded-full ${
                  gitSyncStatus === "synced" ? "bg-emerald-400" : gitSyncStatus === "error" ? "bg-rose-400" : "bg-neutral-500"
                }`} />
              )}
              <span>GitHub:</span>
              <span className="text-neutral-300 underline underline-offset-2">
                {gitRepoName ? `${gitRepoName.split("/")[1] || gitRepoName} (${gitSyncStatus})` : "Configure Sync"}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-neutral-500">Dual: Desktop & Web</span>
            <span>Lines: {lineNumbers.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

