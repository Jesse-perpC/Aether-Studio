import React, { useState } from 'react';
import {
  Folder,
  File,
  FileCode,
  FileJson,
  Plus,
  Save,
  Check,
  ChevronDown,
  GitCompare,
  Code,
  Cpu,
} from 'lucide-react';
import { DyadApp, ProjectFile } from '../types';

interface CodeEditorViewProps {
  currentApp: DyadApp;
  onUpdateFile: (path: string, newContent: string) => void;
  onAddFile: (path: string, content: string) => void;
}

export const CodeEditorView: React.FC<CodeEditorViewProps> = ({
  currentApp,
  onUpdateFile,
  onAddFile,
}) => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>(
    currentApp.files[0]?.path || 'src/App.tsx'
  );
  const [activeSubTab, setActiveSubTab] = useState<'editor' | 'diffs'>('editor');
  const [isSaved, setIsSaved] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [isAddingFile, setIsAddingFile] = useState(false);

  const selectedFile =
    currentApp.files.find((f) => f.path === selectedFilePath) || currentApp.files[0];
  const [editorBuffer, setEditorBuffer] = useState<string>(selectedFile?.content || '');

  const handleSelectFile = (file: ProjectFile) => {
    setSelectedFilePath(file.path);
    setEditorBuffer(file.content);
    setIsSaved(false);
  };

  const handleSave = () => {
    onUpdateFile(selectedFilePath, editorBuffer);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;
    const cleanPath = newFileName.startsWith('src/') ? newFileName : `src/${newFileName}`;
    onAddFile(cleanPath, '// New module initialized in Aether\n');
    setSelectedFilePath(cleanPath);
    setEditorBuffer('// New module initialized in Aether\n');
    setNewFileName('');
    setIsAddingFile(false);
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.tsx') || fileName.endsWith('.ts')) {
      return <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
    }
    if (fileName.endsWith('.json')) {
      return <FileJson className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
    }
    return <File className="w-3.5 h-3.5 text-neutral-400 shrink-0" />;
  };

  // Turn diffs from chat
  const latestDiff = currentApp.chatHistory.find((m) => m.diffs && m.diffs.length > 0)?.diffs?.[0];

  return (
    <div className="flex-1 flex bg-[#090b10] overflow-hidden font-sans">
      {/* File Tree Explorer Sidebar */}
      <div className="w-64 bg-[#0a0c12] border-r border-neutral-800/80 flex flex-col shrink-0 select-none">
        <div className="p-3 border-b border-neutral-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-mono font-bold text-neutral-200">
            <Folder className="w-3.5 h-3.5 text-cyan-400" />
            <span className="uppercase tracking-wider text-[11px]">WORKSPACE TREE</span>
          </div>
          <button
            onClick={() => setIsAddingFile(!isAddingFile)}
            title="Create new file"
            className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-cyan-300 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* New File Inline Form */}
        {isAddingFile && (
          <div className="p-2.5 border-b border-cyan-500/30 bg-[#0e121a]">
            <input
              type="text"
              placeholder="e.g. components/SensorCard.tsx"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFile()}
              className="w-full px-2 py-1 text-xs bg-[#07080d] border border-neutral-700 rounded text-white placeholder-neutral-500 mb-1.5 font-mono focus:outline-hidden focus:border-cyan-500"
              autoFocus
            />
            <div className="flex items-center justify-end gap-1 font-mono">
              <button
                onClick={() => setIsAddingFile(false)}
                className="px-2 py-0.5 text-[10px] text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFile}
                className="px-2 py-0.5 text-[10px] bg-cyan-600 text-white rounded font-bold hover:bg-cyan-500"
              >
                CREATE
              </button>
            </div>
          </div>
        )}

        {/* File List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5 text-xs">
          <div className="px-2 py-1 text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
            <ChevronDown className="w-3 h-3 text-cyan-500/70" />
            <span className="truncate">{currentApp.slug}</span>
          </div>

          {currentApp.files.map((file) => (
            <button
              key={file.path}
              onClick={() => handleSelectFile(file)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left transition font-mono text-[11px] ${
                file.path === selectedFilePath
                  ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
              }`}
            >
              {getFileIcon(file.name)}
              <span className="truncate">{file.path}</span>
            </button>
          ))}
        </div>

        {/* Project Info Footer */}
        <div className="p-3 border-t border-neutral-800/80 text-[10px] text-neutral-500 font-mono">
          <div className="text-cyan-400/80 flex items-center gap-1">
            <Cpu className="w-3 h-3" />
            <span>{currentApp.files.length} MODULES MONITORED</span>
          </div>
          <div className="text-neutral-500 mt-0.5">Vite 5.4 + React 19 Runtime</div>
        </div>
      </div>

      {/* Editor & Diffs Area */}
      <div className="flex-1 flex flex-col bg-[#07080d] overflow-hidden">
        {/* Editor Tab Bar */}
        <div className="h-10 border-b border-neutral-800/80 bg-[#0a0c12] px-4 flex items-center justify-between text-xs shrink-0 select-none font-mono">
          <div className="flex items-center gap-2">
            <div className="flex bg-[#07080d] border border-neutral-800 rounded-lg p-0.5">
              <button
                onClick={() => setActiveSubTab('editor')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition ${
                  activeSubTab === 'editor'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>CODE VIEW</span>
              </button>
              <button
                onClick={() => setActiveSubTab('diffs')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition ${
                  activeSubTab === 'diffs'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>SYNTHESIS DIFFS</span>
              </button>
            </div>

            <span className="font-mono text-xs text-neutral-400 ml-2">
              {selectedFile?.path || 'No file selected'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                isSaved
                  ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.2)]'
              }`}
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'SAVED' : 'SAVE FILE'}</span>
            </button>
          </div>
        </div>

        {/* View Content */}
        {activeSubTab === 'editor' ? (
          <div className="flex-1 flex overflow-hidden font-mono text-xs">
            {/* Line Numbers */}
            <div className="w-12 bg-[#050608] border-r border-neutral-900 py-3 select-none text-right pr-3 text-neutral-600 shrink-0">
              {editorBuffer.split('\n').map((_, i) => (
                <div key={i} className="leading-5 text-[11px]">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Code Input Area */}
            <textarea
              value={editorBuffer}
              onChange={(e) => setEditorBuffer(e.target.value)}
              className="flex-1 bg-transparent p-3 text-cyan-100/90 resize-none focus:outline-hidden leading-5 font-mono text-[11px] whitespace-pre overflow-auto"
              spellCheck={false}
            />
          </div>
        ) : (
          /* Turn Diffs View */
          <div className="flex-1 p-6 overflow-y-auto space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                  Autonomous Synthesis Diffs
                </h3>
                <p className="text-xs text-neutral-400 font-sans mt-0.5">
                  Review mutations applied in the most recent conversational agent turn
                </p>
              </div>
              {latestDiff && (
                <span className="font-mono text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/40">
                  +{latestDiff.additions} / -{latestDiff.deletions} lines
                </span>
              )}
            </div>

            {latestDiff ? (
              <div className="bg-[#0a0c12] border border-neutral-800 rounded-xl overflow-hidden font-mono text-xs">
                <div className="p-2.5 bg-[#0e121a] border-b border-neutral-800 flex items-center justify-between text-[11px]">
                  <span className="text-cyan-300 font-semibold">{latestDiff.path}</span>
                  <span className="text-neutral-500">Unified diff patch</span>
                </div>
                <div className="p-4 space-y-1">
                  <div className="text-rose-400 bg-rose-950/30 px-2 py-0.5 rounded">
                    - {latestDiff.oldContent}
                  </div>
                  <div className="text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded">
                    + {latestDiff.newContent}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-xs text-neutral-500">
                No code diffs recorded in the current session yet. Dispatch a prompt in the Studio chat to synthesize changes.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
