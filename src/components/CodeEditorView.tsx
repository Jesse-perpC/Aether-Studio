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
    onAddFile(cleanPath, '// New file created in Dyad\n');
    setSelectedFilePath(cleanPath);
    setEditorBuffer('// New file created in Dyad\n');
    setNewFileName('');
    setIsAddingFile(false);
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.tsx') || fileName.endsWith('.ts')) {
      return <FileCode className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
    }
    if (fileName.endsWith('.json')) {
      return <FileJson className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
    }
    return <File className="w-3.5 h-3.5 text-neutral-400 shrink-0" />;
  };

  // Turn diffs from chat
  const latestDiff = currentApp.chatHistory.find((m) => m.diffs && m.diffs.length > 0)?.diffs?.[0];

  return (
    <div className="flex-1 flex bg-[#0e0f12] overflow-hidden">
      {/* File Tree Explorer Sidebar */}
      <div className="w-64 bg-[#121316] border-r border-neutral-800/80 flex flex-col shrink-0 select-none">
        <div className="p-3 border-b border-neutral-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-neutral-200">
            <Folder className="w-3.5 h-3.5 text-indigo-400" />
            <span>Files</span>
          </div>
          <button
            onClick={() => setIsAddingFile(!isAddingFile)}
            title="Create new file"
            className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* New File Inline Form */}
        {isAddingFile && (
          <div className="p-2 border-b border-neutral-800 bg-[#16171b]">
            <input
              type="text"
              placeholder="e.g. components/Button.tsx"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFile()}
              className="w-full px-2 py-1 text-xs bg-neutral-900 border border-neutral-700 rounded text-white placeholder-neutral-500 mb-1.5"
              autoFocus
            />
            <div className="flex items-center justify-end gap-1">
              <button
                onClick={() => setIsAddingFile(false)}
                className="px-2 py-0.5 text-[10px] text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFile}
                className="px-2 py-0.5 text-[10px] bg-indigo-600 text-white rounded font-medium"
              >
                Create
              </button>
            </div>
          </div>
        )}

        {/* File List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5 text-xs">
          <div className="px-2 py-1 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
            <ChevronDown className="w-3 h-3 text-neutral-600" />
            <span>{currentApp.slug}</span>
          </div>

          {currentApp.files.map((file) => (
            <button
              key={file.path}
              onClick={() => handleSelectFile(file)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left transition ${
                file.path === selectedFilePath
                  ? 'bg-neutral-800 text-white font-medium'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
              }`}
            >
              {getFileIcon(file.name)}
              <span className="truncate font-mono text-[11px]">{file.path}</span>
            </button>
          ))}
        </div>

        {/* Project Info Footer */}
        <div className="p-3 border-t border-neutral-800/80 text-[11px] text-neutral-500 font-mono">
          <div>{currentApp.files.length} project files</div>
          <div className="text-[10px] text-neutral-600 mt-0.5">Vite + React 19 Runtime</div>
        </div>
      </div>

      {/* Editor & Diffs Area */}
      <div className="flex-1 flex flex-col bg-[#0b0c0e] overflow-hidden">
        {/* Editor Tab Bar */}
        <div className="h-10 border-b border-neutral-800/80 bg-[#121316] px-4 flex items-center justify-between text-xs shrink-0 select-none">
          <div className="flex items-center gap-2">
            <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
              <button
                onClick={() => setActiveSubTab('editor')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition ${
                  activeSubTab === 'editor'
                    ? 'bg-neutral-800 text-white'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Editor</span>
              </button>
              <button
                onClick={() => setActiveSubTab('diffs')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition ${
                  activeSubTab === 'diffs'
                    ? 'bg-neutral-800 text-indigo-400'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Turn Diffs</span>
              </button>
            </div>

            <span className="font-mono text-xs text-neutral-400 ml-2">
              {selectedFile?.path || 'No file selected'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
                isSaved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
              }`}
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Saved' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* View Content */}
        {activeSubTab === 'editor' ? (
          <div className="flex-1 flex overflow-hidden font-mono text-xs">
            {/* Line Numbers */}
            <div className="w-12 bg-[#090a0c] border-r border-neutral-900 py-3 select-none text-right pr-3 text-neutral-600 shrink-0">
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
              className="flex-1 bg-transparent p-3 text-neutral-200 resize-none focus:outline-hidden leading-5 font-mono text-[11px] whitespace-pre overflow-auto"
              spellCheck={false}
            />
          </div>
        ) : (
          /* Turn Diffs View */
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <h3 className="text-sm font-semibold text-white">Latest AI Generation Diffs</h3>
                <p className="text-xs text-neutral-400">
                  Review modifications applied in the most recent conversational turn
                </p>
              </div>
              {latestDiff && (
                <span className="font-mono text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/40">
                  +{latestDiff.additions} / -{latestDiff.deletions} lines
                </span>
              )}
            </div>

            {latestDiff ? (
              <div className="bg-[#121316] border border-neutral-800 rounded-xl overflow-hidden font-mono text-xs">
                <div className="p-2.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-300 font-semibold">{latestDiff.path}</span>
                  <span className="text-neutral-500">Unified diff</span>
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
                No code diffs recorded in the current session yet. Send a prompt in the Studio chat to make edits.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
