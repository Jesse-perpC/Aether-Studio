import React from 'react';
import {
  BarChart3,
  Kanban,
  FileText,
  Boxes,
  ArrowRight,
  Cpu,
} from 'lucide-react';
import { DyadApp } from '../types';

interface TemplatesViewProps {
  onSelectTemplate: (app: DyadApp) => void;
  apps: DyadApp[];
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({ onSelectTemplate, apps }) => {
  const templates = [
    {
      id: 'app-analytics',
      title: 'Aether Neural Analytics Hub',
      category: 'Telemetry',
      description: 'Autonomous token velocity tracking, MRR telemetry, latency gauges, and performance heatmaps.',
      icon: BarChart3,
      badge: 'Neural',
      tech: 'React 19 + Tailwind + Recharts',
    },
    {
      id: 'app-kanban',
      title: 'CyberFlow Kanban Matrix',
      category: 'Operations',
      description: 'Real-time task state machine with priority tags, sprint vectors, and autonomous dispatch.',
      icon: Kanban,
      badge: 'Interactive',
      tech: 'React 19 + Local State',
    },
    {
      id: 'app-markdown',
      title: 'Neural Codex Scratchpad',
      category: 'Documentation',
      description: 'High-speed markdown and prompt notebook with instant token evaluation and export hooks.',
      icon: FileText,
      badge: 'Minimal',
      tech: 'React 19 + Markdown',
    },
    {
      id: 'app-ecommerce',
      title: 'Nexus Commerce Engine',
      category: 'Transactions',
      description: 'Dynamic hardware & software licensing catalog, responsive cart drawer, and checkout logic.',
      icon: Boxes,
      badge: 'Starter',
      tech: 'React 19 + Vite',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#090b10] font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-cyan-500/20 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
              BLUEPRINT REPOSITORY
            </span>
          </div>
          <h1 className="text-xl font-bold font-mono uppercase text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Aether Starter Blueprints & Architecture Kits
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Pre-compiled full-stack blueprints. Each template comes equipped with TypeScript strict-mode adherence, interactive previews, and Aether AI agent support.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((tpl) => {
            const Icon = tpl.icon;
            const existingApp = apps.find((a) => a.id === tpl.id);

            return (
              <div
                key={tpl.id}
                className="p-5 rounded-2xl bg-[#0e121a] border border-neutral-800/90 hover:border-cyan-500/40 transition flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-[#07080d] text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/25">
                      {tpl.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-mono text-white group-hover:text-cyan-300 transition">
                    {tpl.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">{tpl.description}</p>
                </div>

                <div className="pt-5 mt-4 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-500">{tpl.tech}</span>
                  <button
                    onClick={() => {
                      if (existingApp) {
                        onSelectTemplate(existingApp);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-mono font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)] transition cursor-pointer"
                  >
                    <span>INITIALIZE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
