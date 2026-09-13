import { DyadApp, AIModel, PromptTemplate } from '../types';

export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: 'anthropic',
    description: 'Anthropic’s flagship hybrid reasoning & coding model',
    contextWindow: '200k tokens',
    tag: 'Recommended',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    description: 'High-speed multimodal flagship model from OpenAI',
    contextWindow: '128k tokens',
  },
  {
    id: 'gemini-2-5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'google',
    description: 'Next-generation ultra-fast coding and agentic model',
    contextWindow: '1M tokens',
    tag: 'Fastest',
  },
  {
    id: 'ollama-llama3',
    name: 'Ollama: Llama 3.3 (Local)',
    provider: 'ollama',
    description: 'Runs 100% locally on your machine with 0 telemetry or external API calls',
    contextWindow: '128k tokens',
    tag: 'Local & Private',
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    provider: 'deepseek',
    description: 'Open-weight state-of-the-art coding powerhouse',
    contextWindow: '64k tokens',
  },
];

export const PROMPT_LIBRARY: PromptTemplate[] = [
  {
    id: 'p-dark-mode',
    title: 'Add Fluid Dark/Light Mode',
    category: 'Design',
    description: 'Implements an accessible theme toggle switch with persistent local storage.',
    prompt: 'Add an accessible Dark and Light theme toggle in the header. Use Tailwind dark classes, save user preference in localStorage, and ensure smooth background and text contrast transitions.',
  },
  {
    id: 'p-supabase-auth',
    title: 'Integrate Supabase Auth Modal',
    category: 'Backend',
    description: 'Scaffolds email/password authentication dialog with sign-in and sign-up tabs.',
    prompt: 'Create a clean authentication dialog component with Supabase client support. Include tabs for Login and Sign Up, email and password inputs, form validation, and session state persistence.',
  },
  {
    id: 'p-export-csv',
    title: 'Add CSV & JSON Data Export',
    category: 'Feature',
    description: 'Adds an export action button allowing users to download formatted table data.',
    prompt: 'Add an "Export Data" button above the table that lets users export records as either CSV or JSON files with proper MIME types and date stamps.',
  },
  {
    id: 'p-filter-search',
    title: 'Add Instant Search & Multi-Tag Filters',
    category: 'Feature',
    description: 'Live fuzzy search input with active category chips and clear button.',
    prompt: 'Add a live search input field with instant fuzzy filtering and multi-select category filter chips. Include an active filter counter and a "Clear all" button.',
  },
  {
    id: 'p-responsive-nav',
    title: 'Make Layout Mobile-Responsive',
    category: 'Design',
    description: 'Optimizes cards, tables, and sidebars for tablet and mobile viewport sizes.',
    prompt: 'Refactor the grid and navigation layouts to be fully responsive across mobile (375px), tablet (768px), and desktop. Add a collapsible slide-over menu on smaller viewports.',
  },
  {
    id: 'p-typecheck-fix',
    title: 'Fix TypeScript Interface & Null Checks',
    category: 'Fix',
    description: 'Audits types, handles optional chaining, and eliminates any implicit any errors.',
    prompt: 'Review all components for strict TypeScript compliance. Ensure all props and state variables have explicit interfaces and add proper null guards to prevent runtime crashes.',
  },
];

export const INITIAL_APPS: DyadApp[] = [
  {
    id: 'app-analytics',
    name: 'SaaS Pulse Analytics',
    slug: 'saas-pulse-analytics',
    description: 'Real-time MRR, active subscribers, retention cohorts, and conversion funnel analytics.',
    category: 'Analytics',
    icon: 'BarChart3',
    updatedAt: 'Just now',
    appType: 'react-vite',
    previewComponent: 'SaaSAnalyticsPreview',
    files: [
      {
        path: 'src/App.tsx',
        name: 'App.tsx',
        language: 'typescript',
        content: `import React, { useState } from 'react';
import { MetricsGrid } from './components/MetricsGrid';
import { RevenueChart } from './components/RevenueChart';
import { RecentActivity } from './components/RecentActivity';
import { TrendingUp, Users, DollarSign, CreditCard, Download } from 'lucide-react';

export default function App() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 font-sans">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            SaaS Pulse Dashboard
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">Live telemetry synced via Dyad local preview</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg p-0.5 text-xs">
            {(['7d', '30d', '90d'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={\`px-3 py-1 rounded-md transition-colors \${timeRange === range ? 'bg-neutral-800 text-white font-medium shadow-xs' : 'text-neutral-400 hover:text-neutral-200'}\`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-sm transition">
            <Download className="w-3.5 h-3.5" />
            Export Report
          </button>
        </div>
      </header>

      <main className="mt-6 space-y-6">
        <MetricsGrid timeRange={timeRange} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-5">
            <RevenueChart timeRange={timeRange} />
          </div>
          <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-5">
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  );
}`,
      },
      {
        path: 'src/components/MetricsGrid.tsx',
        name: 'MetricsGrid.tsx',
        language: 'typescript',
        content: `import React from 'react';
import { DollarSign, Users, TrendingUp, CreditCard } from 'lucide-react';

interface Props {
  timeRange: '7d' | '30d' | '90d';
}

export function MetricsGrid({ timeRange }: Props) {
  const multiplier = timeRange === '7d' ? 0.3 : timeRange === '90d' ? 2.8 : 1;
  const mrr = Math.round(48250 * multiplier);
  const users = Math.round(1420 * multiplier);

  const metrics = [
    { title: 'Monthly Recurring Revenue', value: \`$\${mrr.toLocaleString()}\`, change: '+14.2%', trend: 'up', icon: DollarSign, color: 'text-emerald-400' },
    { title: 'Active Subscribers', value: users.toLocaleString(), change: '+8.1%', trend: 'up', icon: Users, color: 'text-indigo-400' },
    { title: 'Avg Revenue Per User', value: '$34.00', change: '+2.4%', trend: 'up', icon: CreditCard, color: 'text-sky-400' },
    { title: 'Churn Rate', value: '1.8%', change: '-0.4%', trend: 'down', icon: TrendingUp, color: 'text-emerald-400' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div key={idx} className="bg-neutral-900/70 border border-neutral-800/80 rounded-xl p-4 hover:border-neutral-700 transition">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-medium">{m.title}</span>
              <Icon className={\`w-4 h-4 \${m.color}\`} />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-semibold tracking-tight text-white">{m.value}</span>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
                {m.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}`,
      },
      {
        path: 'src/components/RevenueChart.tsx',
        name: 'RevenueChart.tsx',
        language: 'typescript',
        content: `import React from 'react';

export function RevenueChart({ timeRange }: { timeRange: string }) {
  const bars = [42, 58, 65, 50, 78, 88, 72, 94, 110, 102, 125, 140];
  const max = Math.max(...bars);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Revenue Trajectory</h2>
          <p className="text-xs text-neutral-400">Comparison against previous quarterly cohort</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Current period</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neutral-700" /> Previous period</span>
        </div>
      </div>
      <div className="h-44 flex items-end gap-2 pt-4">
        {bars.map((val, i) => {
          const heightPercent = (val / max) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div
                style={{ height: \`\${heightPercent}%\` }}
                className="w-full bg-indigo-600/80 group-hover:bg-indigo-500 rounded-t transition-all duration-300 relative"
              >
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-neutral-800 text-[10px] text-white px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                  \${val}k
                </div>
              </div>
              <span className="text-[10px] text-neutral-500 font-mono">M{i + 1}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}`,
      },
      {
        path: 'src/components/RecentActivity.tsx',
        name: 'RecentActivity.tsx',
        language: 'typescript',
        content: `import React from 'react';

export function RecentActivity() {
  const events = [
    { user: 'Sarah Jenkins', plan: 'Enterprise Team', amount: '+$499/mo', time: '2m ago' },
    { user: 'Alex Rivkin', plan: 'Pro Annual', amount: '+$240/yr', time: '14m ago' },
    { user: 'Acme Software', plan: 'Scale Add-on', amount: '+$89/mo', time: '1h ago' },
    { user: 'Elena Costa', plan: 'Pro Monthly', amount: '+$29/mo', time: '2h ago' },
  ];

  return (
    <div>
      <h2 className="text-sm font-semibold text-white mb-3">Live Subscription Events</h2>
      <div className="space-y-3">
        {events.map((evt, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 border-b border-neutral-800/60 last:border-0 text-xs">
            <div>
              <p className="font-medium text-neutral-200">{evt.user}</p>
              <p className="text-[11px] text-neutral-400">{evt.plan}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-emerald-400 font-medium">{evt.amount}</p>
              <p className="text-[10px] text-neutral-500">{evt.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`,
      },
      {
        path: 'package.json',
        name: 'package.json',
        language: 'json',
        content: `{
  "name": "saas-pulse-analytics",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.487.0"
  }
}`,
      },
    ],
    chatHistory: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Create a high-density SaaS analytics dashboard with live MRR metrics, quarterly trajectory chart, and real-time subscription feed.',
        timestamp: '10:14 AM',
        mode: 'agent',
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: 'I have created the SaaS Pulse dashboard with an interactive time range selector (7d / 30d / 90d), responsive KPI cards with trend indicators, and real-time event logs.',
        timestamp: '10:15 AM',
        mode: 'agent',
        steps: [
          { id: 's-1', type: 'read_file', title: 'Inspecting project directory', detail: 'Checked existing package.json and dependencies', status: 'completed', timestamp: '10:14:22' },
          { id: 's-2', type: 'edit_file', title: 'Creating src/App.tsx', detail: 'Built dashboard layout and navigation', status: 'completed', timestamp: '10:14:38' },
          { id: 's-3', type: 'edit_file', title: 'Creating src/components/RevenueChart.tsx', detail: 'Added responsive CSS column trajectory visualizer', status: 'completed', timestamp: '10:14:52' },
          { id: 's-4', type: 'typecheck', title: 'Running TypeScript check', detail: '0 errors found across 4 files', status: 'completed', timestamp: '10:15:01' },
        ],
        diffs: [
          {
            path: 'src/App.tsx',
            oldContent: '// initial scaffold',
            newContent: '// SaaS Pulse Dashboard code',
            additions: 54,
            deletions: 2,
          },
        ],
        isApplied: true,
      },
    ],
  },
  {
    id: 'app-kanban',
    name: 'FlowBoard Kanban',
    slug: 'flowboard-kanban',
    description: 'Streamlined collaborative task board with priority badges, status columns, and quick entry.',
    category: 'Productivity',
    icon: 'Kanban',
    updatedAt: '2 hours ago',
    appType: 'react-vite',
    previewComponent: 'KanbanPreview',
    files: [
      {
        path: 'src/App.tsx',
        name: 'App.tsx',
        language: 'typescript',
        content: `import React, { useState } from 'react';
import { Plus, MoreHorizontal, Clock, Tag } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Implement Stripe Checkout webhook', column: 'todo', priority: 'high', tag: 'Backend' },
    { id: 2, title: 'Audit contrast ratios for WCAG AA', column: 'in_progress', priority: 'medium', tag: 'Design' },
    { id: 3, title: 'Setup SQLite local persistent cache', column: 'done', priority: 'low', tag: 'Infra' },
  ]);

  return (
    <div className="min-h-screen bg-[#0d0e12] text-neutral-100 p-6">
      <header className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-white">Sprint 14 Kanban</h1>
          <p className="text-xs text-neutral-400">Organize and execute project milestones</p>
        </div>
      </header>
    </div>
  );
}`,
      },
    ],
    chatHistory: [],
  },
  {
    id: 'app-markdown',
    name: 'Ink & Paper Notes',
    slug: 'ink-paper-notes',
    description: 'Distraction-free markdown editor with live side-by-side rendering, export, and tags.',
    category: 'Writing',
    icon: 'FileText',
    updatedAt: 'Yesterday',
    appType: 'react-vite',
    previewComponent: 'MarkdownPreview',
    files: [
      {
        path: 'src/App.tsx',
        name: 'App.tsx',
        language: 'typescript',
        content: `import React, { useState } from 'react';
export default function App() {
  const [doc, setDoc] = useState('# Project Charter\\n\\nWelcome to Ink & Paper notes.');
  return <div className="p-6">{doc}</div>;
}`,
      },
    ],
    chatHistory: [],
  },
];
