import React, { useState } from 'react';
import {
  Download,
  Play,
  CheckCircle2,
  Clock,
  ExternalLink,
  RefreshCw,
  GitBranch,
  Terminal,
  FileCode,
  ArrowDownToLine,
  Check,
  Zap,
  Cpu,
} from 'lucide-react';
import { WorkflowRun, DesktopRelease, AppUpdateInfo } from '../types';
import { INITIAL_WORKFLOW_RUNS, DESKTOP_RELEASES, INITIAL_UPDATE_INFO } from '../data/releasesData';

export const ReleasesView: React.FC = () => {
  const [runs, setRuns] = useState<WorkflowRun[]>(INITIAL_WORKFLOW_RUNS);
  const [releases] = useState<DesktopRelease[]>(DESKTOP_RELEASES);
  const [updateInfo, setUpdateInfo] = useState<AppUpdateInfo>(INITIAL_UPDATE_INFO);
  const [activeTab, setActiveTab] = useState<'runs' | 'downloads' | 'updater' | 'workflow'>('runs');
  const [selectedBranch, setSelectedBranch] = useState<'main' | 'feat/faster-ipc' | 'all'>('all');
  const [isTriggering, setIsTriggering] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [triggerSuccess, setTriggerSuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Filter runs
  const filteredRuns = runs.filter(
    (run) => selectedBranch === 'all' || run.branch === selectedBranch
  );

  const handleTriggerBuild = () => {
    setIsTriggering(true);
    setTriggerSuccess(false);

    setTimeout(() => {
      const newSha = Math.random().toString(16).substring(2, 9);
      const newRun: WorkflowRun = {
        id: `run-${Date.now()}`,
        name: 'Build Windows Desktop App',
        workflowFile: 'build-windows.yml',
        commitSha: newSha,
        commitMessage: 'manual: dispatch Aether desktop compile ' + newSha,
        branch: selectedBranch === 'all' ? 'main' : selectedBranch,
        status: 'in_progress',
        conclusion: null,
        startedAt: 'Just now',
        duration: '1m 20s (compiling...)',
        platform: 'windows',
        artifacts: [
          {
            name: `Aether-Setup-x64-${newSha}.exe`,
            size: '108.3 MB',
            downloadUrl: '#',
            type: 'installer',
          },
          {
            name: `Aether-Windows-Portable-x64-${newSha}.zip`,
            size: '98.1 MB',
            downloadUrl: '#',
            type: 'portable',
          },
        ],
      };

      setRuns([newRun, ...runs]);
      setIsTriggering(false);
      setTriggerSuccess(true);
      setTimeout(() => setTriggerSuccess(false), 4000);
    }, 1200);
  };

  const handleCheckUpdate = () => {
    setIsCheckingUpdate(true);
    setTimeout(() => {
      setIsCheckingUpdate(false);
      setUpdateInfo({
        ...updateInfo,
        hasUpdate: true,
        notes: 'Latest build synchronized with commit ' + runs[0].commitSha + ' on branch ' + runs[0].branch,
      });
    }, 1000);
  };

  const handleMockDownload = (assetName: string) => {
    setDownloadSuccess(assetName);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="flex-1 bg-[#090b10] overflow-y-auto p-6 text-neutral-200 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header Cyber HUD Card */}
        <div className="bg-[#0e121a] border border-cyan-500/25 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/40 shadow-xs">
                  NEURAL COMPILATION MATRIX
                </span>
                <span className="text-[11px] text-neutral-400 font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  GitHub Actions Runner: Online
                </span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight font-mono uppercase">
                Aether Desktop Matrix & Continuous Releases
              </h1>
              <p className="text-xs text-neutral-400 max-w-2xl mt-1 leading-relaxed">
                Automated per-commit desktop compilation pipeline. Windows (<code className="text-cyan-300 font-mono">.exe</code> & <code className="text-cyan-300 font-mono">.zip</code>) builds continuously on every commit, while macOS and Linux cross-compile via the multi-platform matrix.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleTriggerBuild}
                disabled={isTriggering}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-mono font-bold rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] transition cursor-pointer"
              >
                {isTriggering ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                {isTriggering ? 'DISPATCHING RUNNER...' : 'COMPILE WINDOWS BUILD'}
              </button>

              <a
                href="https://github.com/aether-foundry/aether/actions"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 bg-[#090b10] hover:bg-neutral-800 border border-neutral-800 text-xs font-mono text-neutral-300 rounded-xl transition"
              >
                <span>ACTIONS</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </a>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-neutral-800/80">
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-500 font-mono uppercase">LATEST BUILD</span>
              <span className="text-base font-bold text-white font-mono mt-0.5">
                {runs[0]?.commitSha || 'd3e91fa'}
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">windows-2022 runner</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-500 font-mono uppercase">PIPELINE DURATION</span>
              <span className="text-base font-bold text-emerald-400 font-mono mt-0.5">6m 42s</span>
              <span className="text-[10px] text-neutral-400 font-mono">parallel compilation</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-500 font-mono uppercase">TARGET ARCH</span>
              <span className="text-base font-bold text-white font-mono mt-0.5">x64 / Universal</span>
              <span className="text-[10px] text-neutral-400 font-mono">Win • macOS • Linux</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-500 font-mono uppercase">DELTA AUTO-UPDATER</span>
              <span className="text-base font-bold text-cyan-400 font-mono mt-0.5">Squirrel Ready</span>
              <span className="text-[10px] text-neutral-400 font-mono">RELEASES manifest synced</span>
            </div>
          </div>
        </div>

        {triggerSuccess && (
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-xs text-cyan-300 font-mono flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Workflow dispatched successfully to GitHub Actions. Runner initializing workspace...</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('runs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                activeTab === 'runs'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              RUNS & COMMITS ({runs.length})
            </button>
            <button
              onClick={() => setActiveTab('downloads')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                activeTab === 'downloads'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              BINARY HUB
            </button>
            <button
              onClick={() => setActiveTab('updater')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                activeTab === 'updater'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              AUTO-UPDATER
            </button>
            <button
              onClick={() => setActiveTab('workflow')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                activeTab === 'workflow'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              CI DEFINITIONS
            </button>
          </div>

          {activeTab === 'runs' && (
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-neutral-500">BRANCH:</span>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value as any)}
                className="bg-[#0e121a] border border-neutral-800 text-neutral-300 rounded-lg px-2 py-1 text-xs focus:outline-hidden font-mono"
              >
                <option value="all">all branches</option>
                <option value="main">main (production)</option>
                <option value="feat/faster-ipc">feat/faster-ipc</option>
              </select>
            </div>
          )}
        </div>

        {/* Tab 1: Workflow Runs */}
        {activeTab === 'runs' && (
          <div className="space-y-3">
            <div className="space-y-2">
              {filteredRuns.map((run) => (
                <div
                  key={run.id}
                  className="bg-[#0e121a] border border-neutral-800/80 hover:border-cyan-500/30 rounded-xl p-4 transition shadow-xs"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {run.status === 'completed' && run.conclusion === 'success' ? (
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          </div>
                        ) : run.status === 'in_progress' ? (
                          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center animate-pulse">
                            <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-rose-400" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white font-mono">
                            {run.name}
                          </span>
                          <span className="text-[10px] bg-[#090b10] text-neutral-400 font-mono px-1.5 py-0.5 rounded border border-neutral-800">
                            {run.workflowFile}
                          </span>
                          <span className="text-[10px] bg-cyan-500/10 text-cyan-400 font-mono px-1.5 py-0.5 rounded border border-cyan-500/20 flex items-center gap-1">
                            <GitBranch className="w-3 h-3" />
                            {run.branch}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-300 mt-1 font-sans">
                          {run.commitMessage}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-1 font-mono">
                          <span className="text-cyan-400/80">sha: {run.commitSha}</span>
                          <span>•</span>
                          <span>{run.startedAt}</span>
                          <span>•</span>
                          <span>duration: {run.duration}</span>
                        </div>
                      </div>
                    </div>

                    {/* Artifacts Download */}
                    {run.artifacts.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap md:justify-end">
                        {run.artifacts.map((artifact, i) => (
                          <button
                            key={i}
                            onClick={() => handleMockDownload(artifact.name)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#090b10] hover:bg-cyan-950/40 border border-neutral-800 hover:border-cyan-500/40 text-xs font-mono text-cyan-300 rounded-lg transition"
                          >
                            <Download className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{artifact.name}</span>
                            <span className="text-[10px] text-neutral-500">
                              ({artifact.size})
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {downloadSuccess && (
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-xs font-mono text-cyan-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Downloaded artifact: {downloadSuccess}</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Downloads Hub */}
        {activeTab === 'downloads' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Windows Card */}
              <div className="bg-[#0e121a] border border-cyan-500/25 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                    🪟
                  </div>
                  <span className="text-[10px] bg-cyan-500/15 text-cyan-300 px-2 py-0.5 rounded-full font-mono font-medium border border-cyan-500/30">
                    PER-COMMIT CI
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono uppercase">Windows</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Windows 10 / 11 (64-bit architecture)
                  </p>
                </div>
                <div className="space-y-2 pt-2 border-t border-neutral-800/80">
                  <button
                    onClick={() => handleMockDownload('Aether-Setup-x64.exe')}
                    className="w-full flex items-center justify-between px-3 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-mono font-semibold rounded-xl transition shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                  >
                    <span className="flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5" />
                      Installer (.exe)
                    </span>
                    <span className="text-[11px] opacity-80">108 MB</span>
                  </button>
                  <button
                    onClick={() => handleMockDownload('Aether-Windows-Portable-x64.zip')}
                    className="w-full flex items-center justify-between px-3 py-2 bg-[#090b10] hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-mono font-medium rounded-xl transition"
                  >
                    <span className="flex items-center gap-1.5">
                      <ArrowDownToLine className="w-3.5 h-3.5 text-neutral-400" />
                      Portable (.zip)
                    </span>
                    <span className="text-[11px] text-neutral-500">98 MB</span>
                  </button>
                </div>
              </div>

              {/* macOS Card */}
              <div className="bg-[#0e121a] border border-neutral-800/80 hover:border-cyan-500/30 rounded-2xl p-5 space-y-4 shadow-xl transition">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                    🍎
                  </div>
                  <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full font-mono font-medium border border-purple-500/20">
                    UNIVERSAL
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono uppercase">macOS</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Apple Silicon (M1/M2/M3/M4) & Intel
                  </p>
                </div>
                <div className="space-y-2 pt-2 border-t border-neutral-800/80">
                  <button
                    onClick={() => handleMockDownload('Aether-2.4.0-arm64.dmg')}
                    className="w-full flex items-center justify-between px-3 py-2 bg-[#090b10] hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-mono font-medium rounded-xl transition"
                  >
                    <span className="flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5 text-purple-400" />
                      Apple Silicon (.dmg)
                    </span>
                    <span className="text-[11px] text-neutral-500">112 MB</span>
                  </button>
                  <button
                    onClick={() => handleMockDownload('Aether-2.4.0-x64.dmg')}
                    className="w-full flex items-center justify-between px-3 py-2 bg-[#090b10] hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-mono font-medium rounded-xl transition"
                  >
                    <span className="flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5 text-neutral-400" />
                      Intel (.dmg)
                    </span>
                    <span className="text-[11px] text-neutral-500">114 MB</span>
                  </button>
                </div>
              </div>

              {/* Linux Card */}
              <div className="bg-[#0e121a] border border-neutral-800/80 hover:border-cyan-500/30 rounded-2xl p-5 space-y-4 shadow-xl transition">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                    🐧
                  </div>
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-mono font-medium border border-amber-500/20">
                    MATRIX CI
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono uppercase">Linux</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Debian, Ubuntu, Fedora, AppImage
                  </p>
                </div>
                <div className="space-y-2 pt-2 border-t border-neutral-800/80">
                  <button
                    onClick={() => handleMockDownload('aether_2.4.0_amd64.deb')}
                    className="w-full flex items-center justify-between px-3 py-2 bg-[#090b10] hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-mono font-medium rounded-xl transition"
                  >
                    <span className="flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      Debian / Ubuntu (.deb)
                    </span>
                    <span className="text-[11px] text-neutral-500">92 MB</span>
                  </button>
                  <button
                    onClick={() => handleMockDownload('Aether-2.4.0.AppImage')}
                    className="w-full flex items-center justify-between px-3 py-2 bg-[#090b10] hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-mono font-medium rounded-xl transition"
                  >
                    <span className="flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5 text-neutral-400" />
                      Universal AppImage
                    </span>
                    <span className="text-[11px] text-neutral-500">96 MB</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Releases History */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
                Release History & Changelogs
              </h3>
              {releases.map((rel) => (
                <div
                  key={rel.id}
                  className="bg-[#0e121a] border border-neutral-800/90 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white font-mono">{rel.name}</span>
                      <span className="text-[10px] bg-[#090b10] text-cyan-300 px-2 py-0.5 rounded font-mono border border-neutral-800">
                        {rel.tag}
                      </span>
                      {rel.isPrerelease && (
                        <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-mono font-medium">
                          Pre-release
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-neutral-400 font-mono">{rel.publishedAt}</span>
                  </div>

                  <ul className="space-y-1 text-xs text-neutral-300 list-disc list-inside">
                    {rel.changelog.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Auto-Updater Status */}
        {activeTab === 'updater' && (
          <div className="bg-[#0e121a] border border-cyan-500/20 rounded-2xl p-6 space-y-6 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
              <div>
                <h3 className="text-base font-bold text-white font-mono uppercase flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Squirrel Delta Auto-Updater
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Aether checks the GitHub Releases stream on startup for delta packages (<code className="text-cyan-300 font-mono">.nupkg</code>) and applies updates seamlessly in the background.
                </p>
              </div>

              <button
                onClick={handleCheckUpdate}
                disabled={isCheckingUpdate}
                className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-mono font-medium rounded-xl transition shadow-[0_0_12px_rgba(6,182,212,0.25)]"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCheckingUpdate ? 'animate-spin' : ''}`} />
                {isCheckingUpdate ? 'CHECKING API...' : 'CHECK FOR UPDATES NOW'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#090b10] border border-neutral-800 rounded-xl space-y-2">
                <div className="text-xs font-mono text-neutral-500">CURRENT RUNTIME VERSION</div>
                <div className="text-xl font-mono font-bold text-white">
                  v{updateInfo.currentVersion}
                </div>
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Channel: {updateInfo.channel} (continuous)
                </div>
              </div>

              <div className="p-4 bg-[#090b10] border border-neutral-800 rounded-xl space-y-2">
                <div className="text-xs font-mono text-neutral-500">LATEST VERIFIED BUILD</div>
                <div className="text-xl font-mono font-bold text-cyan-400">
                  {updateInfo.latestVersion}
                </div>
                <div className="text-[11px] font-mono text-neutral-400">
                  Published: {updateInfo.publishedAt}
                </div>
              </div>
            </div>

            <div className="p-4 bg-cyan-950/20 border border-cyan-500/25 rounded-xl text-xs text-neutral-300 space-y-2">
              <div className="font-semibold font-mono text-cyan-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                DELTA UPDATE STREAM SPECIFICATION
              </div>
              <p className="font-mono text-[11px] text-neutral-400">{updateInfo.notes}</p>
            </div>
          </div>
        )}

        {/* Tab 4: Workflow Configs (.github) */}
        {activeTab === 'workflow' && (
          <div className="space-y-4">
            <div className="bg-[#0e121a] border border-cyan-500/20 rounded-2xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-xs text-white">
                    .github/workflows/build-windows.yml
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                  Trigger: on push to all branches
                </span>
              </div>
              <div className="bg-[#07080d] rounded-xl p-4 border border-neutral-800 text-xs font-mono text-neutral-300 overflow-x-auto">
                <pre>{`name: Build Windows Desktop App
on:
  push:
    branches: ['**']
    tags: ['**']
  pull_request:
    types: [opened, synchronize, reopened]
  workflow_dispatch:

jobs:
  build-windows:
    runs-on: windows-2022
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx electron-forge make --platform win32 --arch x64
      - run: Compress-Archive -Path out/aether-win32-x64/* -DestinationPath out/dist/Aether-Windows-Portable-x64.zip
      - uses: actions/upload-artifact@v4
        with:
          name: Aether-Windows-x64-\${{ github.sha }}
          path: out/dist/*
      # Automated PR comment bot with direct download links
      - uses: actions/github-script@v7
        if: github.event_name == 'pull_request'`}</pre>
              </div>
            </div>

            <div className="bg-[#0e121a] border border-neutral-800/90 rounded-2xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span className="font-mono text-xs text-white">
                    .github/workflows/build-desktop-matrix.yml
                  </span>
                </div>
                <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-mono">
                  Matrix: Windows, macOS, Linux
                </span>
              </div>
              <div className="bg-[#07080d] rounded-xl p-4 border border-neutral-800 text-xs font-mono text-neutral-300 overflow-x-auto">
                <pre>{`matrix:
  os:
    - { name: windows, runner: windows-2022, cmd: npx electron-forge make --platform win32 --arch x64 }
    - { name: macos, runner: macos-latest, cmd: npx electron-forge make --platform darwin }
    - { name: linux, runner: ubuntu-22.04, cmd: npx electron-forge make --platform linux --arch x64 }`}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
