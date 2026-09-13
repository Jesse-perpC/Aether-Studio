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
  Sparkles,
  ArrowDownToLine,
  Check,
  Zap,
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
        commitMessage: 'manual: dispatch build on commit ' + newSha,
        branch: selectedBranch === 'all' ? 'main' : selectedBranch,
        status: 'in_progress',
        conclusion: null,
        startedAt: 'Just now',
        duration: '1m 20s (building...)',
        platform: 'windows',
        artifacts: [
          {
            name: `Dyad-Setup-x64-${newSha}.exe`,
            size: '108.3 MB',
            downloadUrl: '#',
            type: 'installer',
          },
          {
            name: `Dyad-Windows-Portable-x64-${newSha}.zip`,
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
    <div className="flex-1 bg-[#0d0e11] overflow-y-auto p-6 text-neutral-200">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="bg-[#14161b] border border-neutral-800/90 rounded-2xl p-6 relative overflow-hidden shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                  Automated CI/CD Pipeline
                </span>
                <span className="text-xs text-neutral-400 font-mono flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  GitHub Actions Active
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Desktop Builds & Releases
              </h1>
              <p className="text-sm text-neutral-400 max-w-2xl mt-1">
                Every commit automatically triggers a Windows desktop build (`.exe` installer & `.zip` portable). Multi-platform matrix builds compile macOS and Linux on push.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleTriggerBuild}
                disabled={isTriggering}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition cursor-pointer"
              >
                {isTriggering ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                {isTriggering ? 'Dispatching...' : 'Trigger Windows Build'}
              </button>

              <a
                href="https://github.com/dyad-sh/dyad/actions"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-medium text-neutral-300 rounded-xl transition"
              >
                <span>GitHub Actions</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </a>
            </div>
          </div>

          {triggerSuccess && (
            <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Workflow dispatched successfully! New Windows build job queued.</span>
            </div>
          )}
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
          <button
            onClick={() => setActiveTab('runs')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'runs'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Workflow Runs ({runs.length})
          </button>

          <button
            onClick={() => setActiveTab('downloads')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'downloads'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Download Binaries (.exe / .zip)
          </button>

          <button
            onClick={() => setActiveTab('updater')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'updater'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Auto-Updater Status
          </button>

          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'workflow'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Workflow Configs (.github)
          </button>
        </div>

        {/* Tab 1: Workflow Runs on Commit */}
        {activeTab === 'runs' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">Filter Branch:</span>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value as any)}
                  className="bg-neutral-900 border border-neutral-800 text-xs rounded-lg px-2.5 py-1 text-neutral-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All Branches</option>
                  <option value="main">main</option>
                  <option value="feat/faster-ipc">feat/faster-ipc</option>
                </select>
              </div>

              <span className="text-xs text-neutral-500 font-mono">
                Showing {filteredRuns.length} runs
              </span>
            </div>

            {/* Runs List */}
            <div className="space-y-2.5">
              {filteredRuns.map((run) => (
                <div
                  key={run.id}
                  className="bg-[#14161b] border border-neutral-800/80 hover:border-neutral-700/80 rounded-xl p-4 transition shadow-xs"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {run.status === 'in_progress' ? (
                          <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                            <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                          </div>
                        ) : run.conclusion === 'success' ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                            <Clock className="w-3.5 h-3.5 text-rose-400" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-white">
                            {run.name}
                          </span>
                          <span className="text-[11px] bg-neutral-800 text-neutral-300 font-mono px-1.5 py-0.2 rounded border border-neutral-700/60">
                            {run.workflowFile}
                          </span>
                          <span className="text-[11px] bg-indigo-500/10 text-indigo-400 font-mono px-1.5 py-0.2 rounded border border-indigo-500/20 flex items-center gap-1">
                            <GitBranch className="w-3 h-3" />
                            {run.branch}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1">
                          {run.commitMessage}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-1 font-mono">
                          <span>commit {run.commitSha}</span>
                          <span>•</span>
                          <span>{run.startedAt}</span>
                          <span>•</span>
                          <span>duration {run.duration}</span>
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
                            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-300 rounded-lg transition"
                          >
                            <Download className="w-3.5 h-3.5 text-indigo-400" />
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
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-xs text-indigo-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Downloaded: {downloadSuccess}</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Downloads Hub */}
        {activeTab === 'downloads' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Windows Card */}
              <div className="bg-[#14161b] border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                    🪟
                  </div>
                  <span className="text-[11px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-mono font-medium">
                    Every Commit
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Windows</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Windows 10 / 11 (64-bit architecture)
                  </p>
                </div>
                <div className="space-y-2 pt-2 border-t border-neutral-800/80">
                  <button
                    onClick={() => handleMockDownload('Dyad-Setup-x64.exe')}
                    className="w-full flex items-center justify-between px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition"
                  >
                    <span className="flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5" />
                      Installer (.exe)
                    </span>
                    <span className="text-[11px] opacity-80">108 MB</span>
                  </button>
                  <button
                    onClick={() => handleMockDownload('Dyad-Windows-Portable-x64.zip')}
                    className="w-full flex items-center justify-between px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-medium rounded-xl transition"
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
              <div className="bg-[#14161b] border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                    🍎
                  </div>
                  <span className="text-[11px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full font-mono font-medium">
                    Universal
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">macOS</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Apple Silicon (M1/M2/M3/M4) & Intel
                  </p>
                </div>
                <div className="space-y-2 pt-2 border-t border-neutral-800/80">
                  <button
                    onClick={() => handleMockDownload('Dyad-1.15.0-arm64.dmg')}
                    className="w-full flex items-center justify-between px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-medium rounded-xl transition"
                  >
                    <span className="flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5 text-purple-400" />
                      Apple Silicon (.dmg)
                    </span>
                    <span className="text-[11px] text-neutral-500">112 MB</span>
                  </button>
                  <button
                    onClick={() => handleMockDownload('Dyad-1.15.0-x64.dmg')}
                    className="w-full flex items-center justify-between px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-medium rounded-xl transition"
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
              <div className="bg-[#14161b] border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
                    🐧
                  </div>
                  <span className="text-[11px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full font-mono font-medium">
                    Matrix CI
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Linux</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Debian, Ubuntu, Fedora, AppImage
                  </p>
                </div>
                <div className="space-y-2 pt-2 border-t border-neutral-800/80">
                  <button
                    onClick={() => handleMockDownload('dyad_1.15.0_amd64.deb')}
                    className="w-full flex items-center justify-between px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-medium rounded-xl transition"
                  >
                    <span className="flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5 text-orange-400" />
                      Debian / Ubuntu (.deb)
                    </span>
                    <span className="text-[11px] text-neutral-500">92 MB</span>
                  </button>
                  <button
                    onClick={() => handleMockDownload('Dyad-1.15.0.AppImage')}
                    className="w-full flex items-center justify-between px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-medium rounded-xl transition"
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
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Release History & Changelogs
              </h3>
              {releases.map((rel) => (
                <div
                  key={rel.id}
                  className="bg-[#14161b] border border-neutral-800 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{rel.name}</span>
                      <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded font-mono">
                        {rel.tag}
                      </span>
                      {rel.isPrerelease && (
                        <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-medium">
                          Pre-release
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-neutral-400">{rel.publishedAt}</span>
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
          <div className="bg-[#14161b] border border-neutral-800/80 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  In-App Squirrel Auto-Updater
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Dyad checks the GitHub Releases API on startup for delta packages (`.nupkg`) and applies background updates seamlessly.
                </p>
              </div>

              <button
                onClick={handleCheckUpdate}
                disabled={isCheckingUpdate}
                className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCheckingUpdate ? 'animate-spin' : ''}`} />
                {isCheckingUpdate ? 'Checking API...' : 'Check for Updates Now'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2">
                <div className="text-xs text-neutral-500">Current App Version</div>
                <div className="text-xl font-mono font-bold text-white">
                  v{updateInfo.currentVersion}
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active Release Channel: {updateInfo.channel}
                </div>
              </div>

              <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2">
                <div className="text-xs text-neutral-500">Latest Commit Build</div>
                <div className="text-xl font-mono font-bold text-indigo-400">
                  {updateInfo.latestVersion}
                </div>
                <div className="text-[11px] text-neutral-400">
                  Published: {updateInfo.publishedAt}
                </div>
              </div>
            </div>

            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-neutral-300 space-y-2">
              <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Update Channel & Delta Notes
              </div>
              <p>{updateInfo.notes}</p>
            </div>
          </div>
        )}

        {/* Tab 4: Workflow Configs (.github) */}
        {activeTab === 'workflow' && (
          <div className="space-y-4">
            <div className="bg-[#14161b] border border-neutral-800/80 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-indigo-400" />
                  <span className="font-mono text-xs text-white">
                    .github/workflows/build-windows.yml
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                  Trigger: on push to all branches
                </span>
              </div>
              <div className="bg-[#0b0c0e] rounded-xl p-4 border border-neutral-800/80 text-xs font-mono text-neutral-300 overflow-x-auto">
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
      - run: npm install -g npm@11.8.0
      - run: npm ci
      - run: npx electron-forge make --platform win32 --arch x64
      - run: Compress-Archive -Path out/dyad-win32-x64/* -DestinationPath out/dist/Dyad-Windows-Portable-x64.zip
      - uses: actions/upload-artifact@v4
        with:
          name: Dyad-Windows-x64-\${{ github.sha }}
          path: out/dist/*
      # Automated PR comment with download link
      - uses: actions/github-script@v7
        if: github.event_name == 'pull_request'`}</pre>
              </div>
            </div>

            <div className="bg-[#14161b] border border-neutral-800/80 rounded-2xl p-5 space-y-3">
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
              <div className="bg-[#0b0c0e] rounded-xl p-4 border border-neutral-800/80 text-xs font-mono text-neutral-300 overflow-x-auto">
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
