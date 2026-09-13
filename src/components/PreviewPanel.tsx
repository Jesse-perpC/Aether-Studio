import React, { useState } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  Lock,
  Terminal,
  AlertCircle,
  Eye,
  CheckCircle2,
  TrendingUp,
  Users,
  CreditCard,
  DollarSign,
  Download,
  Plus,
  Trash2,
} from 'lucide-react';
import { DeviceViewport, PreviewTab, DyadApp } from '../types';

interface PreviewPanelProps {
  currentApp: DyadApp;
  onOpenExternal?: () => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ currentApp }) => {
  const [viewport, setViewport] = useState<DeviceViewport>('desktop');
  const [activeBottomTab, setActiveBottomTab] = useState<PreviewTab>('preview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Interactive state for SaaS Pulse Preview
  const [saasRange, setSaasRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Interactive state for Kanban Preview
  const [kanbanTasks, setKanbanTasks] = useState([
    { id: 1, title: 'Implement Stripe Checkout webhook', col: 'todo', priority: 'high', tag: 'Backend' },
    { id: 2, title: 'Audit contrast ratios for WCAG AA', col: 'in_progress', priority: 'medium', tag: 'Design' },
    { id: 3, title: 'Setup SQLite local persistent cache', col: 'done', priority: 'low', tag: 'Infra' },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Interactive state for Markdown Preview
  const [notesContent, setNotesContent] = useState(
    `# Engineering Sprint 14 Notes\n\n- [x] Initialized Dyad local AI environment\n- [x] Verified port 3000 container mapping\n- [ ] Deploy client-side SPA bundle\n\n*Built with Dyad local app studio.*`
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleExport = () => {
    setExportNotice('Exported saas-pulse-report.csv to downloads');
    setTimeout(() => setExportNotice(null), 3000);
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    setKanbanTasks([
      ...kanbanTasks,
      { id: Date.now(), title: newTaskTitle.trim(), col: 'todo', priority: 'medium', tag: 'Feature' },
    ]);
    setNewTaskTitle('');
  };

  const moveTask = (id: number, nextCol: string) => {
    setKanbanTasks(kanbanTasks.map((t) => (t.id === id ? { ...t, col: nextCol } : t)));
  };

  const deleteTask = (id: number) => {
    setKanbanTasks(kanbanTasks.filter((t) => t.id !== id));
  };

  const logs = [
    { time: '10:14:02', level: 'info', message: '[vite] connecting...' },
    { time: '10:14:03', level: 'info', message: '[vite] connected.' },
    { time: '10:14:40', level: 'info', message: '[vite] hmr update /src/App.tsx' },
    { time: '10:15:02', level: 'info', message: 'GET /api/metrics - 200 OK (14ms)' },
    { time: '10:15:10', level: 'info', message: '[dyad] active preview synchronized with code' },
  ];

  const getViewportClass = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-[375px] h-[667px] shadow-2xl rounded-2xl border-4 border-neutral-800';
      case 'tablet':
        return 'w-[768px] h-full shadow-xl rounded-xl border border-neutral-800';
      case 'desktop':
      default:
        return 'w-full h-full';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0e0f12] overflow-hidden">
      {/* Top Preview Bar */}
      <div className="h-10 px-3 border-b border-neutral-800/80 bg-[#121317] flex items-center justify-between text-xs shrink-0 select-none">
        {/* Device Viewport Selector */}
        <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
          <button
            onClick={() => setViewport('desktop')}
            title="Desktop view (100%)"
            className={`p-1 rounded transition ${
              viewport === 'desktop' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            title="Tablet view (768px)"
            className={`p-1 rounded transition ${
              viewport === 'tablet' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            title="Mobile view (375px)"
            className={`p-1 rounded transition ${
              viewport === 'mobile' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mock Address Bar */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900/90 border border-neutral-800 rounded-md text-[11px] text-neutral-400 font-mono max-w-sm w-full mx-4 truncate">
          <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="truncate">http://localhost:5173/{currentApp.slug}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRefresh}
            title="Reload Preview"
            className={`p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition ${
              isRefreshing ? 'animate-spin text-indigo-400' : ''
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Preview Sandbox Canvas */}
      <div className="flex-1 overflow-auto bg-neutral-950 p-4 flex items-center justify-center relative">
        <div className={`transition-all duration-200 bg-neutral-950 overflow-auto flex flex-col ${getViewportClass()}`}>
          {/* RENDER ACTIVE APP PREVIEW */}
          {currentApp.id === 'app-analytics' ? (
            <div className="min-h-full p-5 bg-neutral-950 text-neutral-100 font-sans">
              {/* Export Toast Banner */}
              {exportNotice && (
                <div className="mb-4 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{exportNotice}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-neutral-800">
                <div>
                  <h1 className="text-base font-semibold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    SaaS Pulse Analytics
                  </h1>
                  <p className="text-xs text-neutral-400">Live preview environment</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg p-0.5 text-xs">
                    {(['7d', '30d', '90d'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setSaasRange(r)}
                        className={`px-2.5 py-1 rounded-md transition ${
                          saasRange === r ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-xs transition"
                  >
                    <Download className="w-3 h-3" />
                    Export
                  </button>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                {[
                  {
                    title: 'MRR',
                    val: saasRange === '7d' ? '$14,475' : saasRange === '90d' ? '$135,100' : '$48,250',
                    change: '+14.2%',
                    icon: DollarSign,
                    color: 'text-emerald-400',
                  },
                  {
                    title: 'Active Users',
                    val: saasRange === '7d' ? '426' : saasRange === '90d' ? '3,976' : '1,420',
                    change: '+8.1%',
                    icon: Users,
                    color: 'text-indigo-400',
                  },
                  { title: 'ARPU', val: '$34.00', change: '+2.4%', icon: CreditCard, color: 'text-sky-400' },
                  { title: 'Churn', val: '1.8%', change: '-0.4%', icon: TrendingUp, color: 'text-emerald-400' },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="bg-neutral-900/60 border border-neutral-800/80 p-3.5 rounded-xl">
                      <div className="flex items-center justify-between text-neutral-400 mb-1">
                        <span className="text-[11px] font-medium">{item.title}</span>
                        <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-lg font-bold text-white tracking-tight">{item.val}</span>
                        <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/30">
                          {item.change}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chart & Activities */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                <div className="lg:col-span-2 bg-neutral-900/60 border border-neutral-800/80 p-4 rounded-xl">
                  <h3 className="text-xs font-semibold text-white mb-1">Revenue Trajectory ({saasRange})</h3>
                  <p className="text-[11px] text-neutral-400 mb-4">Quarterly recurring subscription volume</p>
                  <div className="h-32 flex items-end gap-2 pt-2">
                    {[38, 52, 60, 48, 72, 85, 68, 92, 108, 98, 118, 134].map((v, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 group justify-end h-full">
                        <div
                          style={{ height: `${(v / 134) * 100}%` }}
                          className="w-full bg-indigo-600/80 group-hover:bg-indigo-400 rounded-t transition-all"
                        />
                        <span className="text-[9px] text-neutral-500 font-mono">M{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-neutral-900/60 border border-neutral-800/80 p-4 rounded-xl">
                  <h3 className="text-xs font-semibold text-white mb-3">Live Subscription Feed</h3>
                  <div className="space-y-2.5 text-xs">
                    {[
                      { name: 'Sarah Jenkins', plan: 'Enterprise', amount: '+$499/mo' },
                      { name: 'Alex Rivkin', plan: 'Pro Annual', amount: '+$240/yr' },
                      { name: 'Elena Costa', plan: 'Pro Monthly', amount: '+$29/mo' },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center justify-between pb-2 border-b border-neutral-800/50 last:border-0">
                        <div>
                          <p className="font-medium text-neutral-200 text-[11px]">{row.name}</p>
                          <p className="text-[10px] text-neutral-500">{row.plan}</p>
                        </div>
                        <span className="font-mono text-emerald-400 text-xs font-medium">{row.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : currentApp.id === 'app-kanban' ? (
            <div className="min-h-full p-5 bg-neutral-950 text-neutral-100 font-sans">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div>
                  <h1 className="text-base font-bold text-white">FlowBoard Kanban</h1>
                  <p className="text-xs text-neutral-400">Interactive sprint planning board</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="New task..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                    className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500"
                  />
                  <button
                    onClick={handleAddTask}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                {[
                  { id: 'todo', label: 'To Do', color: 'border-amber-500/40' },
                  { id: 'in_progress', label: 'In Progress', color: 'border-indigo-500/40' },
                  { id: 'done', label: 'Done', color: 'border-emerald-500/40' },
                ].map((col) => {
                  const tasksInCol = kanbanTasks.filter((t) => t.col === col.id);
                  return (
                    <div key={col.id} className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-3 flex flex-col">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800">
                        <span className="text-xs font-semibold text-white">{col.label}</span>
                        <span className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 rounded-full font-mono">
                          {tasksInCol.length}
                        </span>
                      </div>
                      <div className="space-y-2 flex-1">
                        {tasksInCol.map((task) => (
                          <div key={task.id} className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs space-y-1.5 shadow-xs">
                            <div className="flex items-start justify-between gap-1">
                              <span className="font-medium text-neutral-200">{task.title}</span>
                              <button onClick={() => deleteTask(task.id)} className="text-neutral-500 hover:text-rose-400">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-neutral-400">
                              <span className="bg-neutral-800 px-1.5 py-0.2 rounded font-mono">{task.tag}</span>
                              <div className="flex gap-1">
                                {col.id !== 'todo' && (
                                  <button onClick={() => moveTask(task.id, 'todo')} className="hover:text-indigo-300">
                                    ← Todo
                                  </button>
                                )}
                                {col.id !== 'in_progress' && (
                                  <button onClick={() => moveTask(task.id, 'in_progress')} className="hover:text-indigo-300">
                                    Work
                                  </button>
                                )}
                                {col.id !== 'done' && (
                                  <button onClick={() => moveTask(task.id, 'done')} className="hover:text-emerald-300">
                                    Done →
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="min-h-full p-5 bg-neutral-950 text-neutral-100 font-sans flex flex-col">
              <div className="pb-3 border-b border-neutral-800 flex items-center justify-between">
                <h1 className="text-base font-bold text-white">{currentApp.name}</h1>
                <span className="text-xs text-neutral-400 font-mono">
                  {notesContent.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                value={notesContent}
                onChange={(e) => setNotesContent(e.target.value)}
                className="flex-1 w-full mt-4 bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 text-xs font-mono text-neutral-200 resize-none focus:outline-hidden"
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Diagnostics / Tabs Bar */}
      <div className="border-t border-neutral-800/80 bg-[#121316] text-xs shrink-0">
        <div className="flex items-center justify-between px-3 h-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveBottomTab('preview')}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium transition ${
                activeBottomTab === 'preview' ? 'text-indigo-400 bg-neutral-800' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Eye className="w-3 h-3" />
              Preview
            </button>
            <button
              onClick={() => setActiveBottomTab('logs')}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium transition ${
                activeBottomTab === 'logs' ? 'text-indigo-400 bg-neutral-800' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3 h-3" />
              Console Logs
            </button>
            <button
              onClick={() => setActiveBottomTab('problems')}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium transition ${
                activeBottomTab === 'problems' ? 'text-indigo-400 bg-neutral-800' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <AlertCircle className="w-3 h-3" />
              Problems (0)
            </button>
          </div>

          <div className="text-[10px] text-neutral-500 font-mono flex items-center gap-2">
            <span>HMR: active</span>
            <span>•</span>
            <span className="text-emerald-400">Port: 3000</span>
          </div>
        </div>

        {/* Collapsible Console Drawer */}
        {activeBottomTab === 'logs' && (
          <div className="h-28 bg-[#0a0b0d] border-t border-neutral-800/80 p-2.5 font-mono text-[11px] overflow-y-auto space-y-1">
            {logs.map((l, idx) => (
              <div key={idx} className="flex items-center gap-2 text-neutral-400">
                <span className="text-neutral-600">{l.time}</span>
                <span className="text-indigo-400 font-semibold">[{l.level}]</span>
                <span className="text-neutral-300">{l.message}</span>
              </div>
            ))}
          </div>
        )}

        {activeBottomTab === 'problems' && (
          <div className="h-24 bg-[#0a0b0d] border-t border-neutral-800/80 p-3 text-xs flex items-center justify-center text-neutral-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2" />
            No TypeScript diagnostics or compile errors found in current workspace.
          </div>
        )}
      </div>
    </div>
  );
};
