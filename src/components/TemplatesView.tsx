import React from 'react';
import {
  Sparkles,
  BarChart3,
  Kanban,
  FileText,
  Boxes,
  ArrowRight,
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
      title: 'SaaS Analytics Dashboard',
      category: 'Analytics',
      description: 'MRR tracking, subscription trends, KPI cards, and quarterly trajectory visualizers.',
      icon: BarChart3,
      badge: 'Popular',
      tech: 'React 19 + Tailwind + Lucide',
    },
    {
      id: 'app-kanban',
      title: 'FlowBoard Kanban',
      category: 'Productivity',
      description: 'Drag-and-drop styled sprint planning board with status columns and quick task entry.',
      icon: Kanban,
      badge: 'Interactive',
      tech: 'React 19 + Local State',
    },
    {
      id: 'app-markdown',
      title: 'Ink & Paper Notes',
      category: 'Writing',
      description: 'Minimalist markdown scratchpad with live word counting, tags, and formatting tools.',
      icon: FileText,
      badge: 'Minimal',
      tech: 'React 19 + Markdown',
    },
    {
      id: 'app-ecommerce',
      title: 'Storefront & Cart Checkout',
      category: 'E-Commerce',
      description: 'Product catalog with filter tags, shopping cart drawer, and checkout price calculation.',
      icon: Boxes,
      badge: 'Starter',
      tech: 'React 19 + Vite',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#0d0e11]">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-neutral-800 pb-6">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">App Starter Templates</h1>
          </div>
          <p className="text-sm text-neutral-400">
            Kickstart your next application. Each template includes complete code, interactive previews, and full Dyad chat agent support.
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
                className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/90 hover:border-neutral-700 transition flex flex-col justify-between group shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-full border border-neutral-700/60">
                      {tpl.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 transition">
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
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                  >
                    <span>Open in Studio</span>
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
