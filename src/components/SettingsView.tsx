import React, { useState } from 'react';
import {
  Key,
  Save,
  Check,
  Server,
  Sliders,
  ShieldCheck,
} from 'lucide-react';
import { ProviderConfig, ChatMode } from '../types';

interface SettingsViewProps {
  config: ProviderConfig;
  onSaveConfig: (newConfig: ProviderConfig) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ config, onSaveConfig }) => {
  const [form, setForm] = useState<ProviderConfig>(config);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(form);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#090b10] font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-cyan-500/20 pb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                SYSTEM CONFIGURATION
              </span>
            </div>
            <h1 className="text-xl font-bold font-mono uppercase text-white tracking-tight">
              Aether Engine & Hardware Settings
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Manage BYOK API keys, local Ollama endpoints, and autonomous execution policies
            </p>
          </div>
          <button
            onClick={handleSubmit}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold shadow-xs transition cursor-pointer ${
              isSaved
                ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.25)]'
            }`}
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'SAVED TO LOCAL ENGINE' : 'SAVE CONFIGURATION'}</span>
          </button>
        </div>

        {/* API Credentials Section */}
        <div className="p-6 rounded-2xl bg-[#0e121a] border border-neutral-800 hover:border-cyan-500/30 space-y-5 transition shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-semibold font-mono text-white">NEURAL PROVIDER KEYS (BYOK)</h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Local Encryption Active
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            Keys are encrypted within local secure storage and never transmitted to telemetry hubs.
          </p>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-300 font-mono text-[11px] mb-1.5">
                ANTHROPIC API KEY (Claude 3.7 Sonnet)
              </label>
              <input
                type="password"
                placeholder="sk-ant-api03-..."
                value={form.anthropicKey}
                onChange={(e) => setForm({ ...form, anthropicKey: e.target.value })}
                className="w-full px-3 py-2 bg-[#07080d] border border-neutral-800 rounded-xl text-white placeholder-neutral-600 font-mono focus:outline-hidden focus:border-cyan-500/60"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-mono text-[11px] mb-1.5">
                OPENAI API KEY (GPT-4o)
              </label>
              <input
                type="password"
                placeholder="sk-proj-..."
                value={form.openaiKey}
                onChange={(e) => setForm({ ...form, openaiKey: e.target.value })}
                className="w-full px-3 py-2 bg-[#07080d] border border-neutral-800 rounded-xl text-white placeholder-neutral-600 font-mono focus:outline-hidden focus:border-cyan-500/60"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-mono text-[11px] mb-1.5">
                GOOGLE GEMINI API KEY (Gemini 2.5 Flash)
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={form.geminiKey}
                onChange={(e) => setForm({ ...form, geminiKey: e.target.value })}
                className="w-full px-3 py-2 bg-[#07080d] border border-neutral-800 rounded-xl text-white placeholder-neutral-600 font-mono focus:outline-hidden focus:border-cyan-500/60"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-mono text-[11px] mb-1.5">
                LOCAL OLLAMA HOST (Zero External Telemetry)
              </label>
              <input
                type="text"
                placeholder="http://localhost:11434"
                value={form.ollamaHost}
                onChange={(e) => setForm({ ...form, ollamaHost: e.target.value })}
                className="w-full px-3 py-2 bg-[#07080d] border border-neutral-800 rounded-xl text-white placeholder-neutral-600 font-mono focus:outline-hidden focus:border-cyan-500/60"
              />
            </div>
          </div>
        </div>

        {/* Agent Behavior & Execution */}
        <div className="p-6 rounded-2xl bg-[#0e121a] border border-neutral-800 hover:border-cyan-500/30 space-y-5 transition shadow-xl">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold font-mono text-white">AUTONOMOUS EXECUTION POLICIES</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-300 font-mono text-[11px] mb-2">
                DEFAULT NEURAL OPERATION MODE
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['agent', 'build', 'ask', 'plan'] as ChatMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setForm({ ...form, defaultMode: mode })}
                    className={`p-3 rounded-xl border text-left transition ${
                      form.defaultMode === mode
                        ? 'bg-cyan-500/15 border-cyan-500/50 text-white font-semibold shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                        : 'bg-[#07080d] border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="font-mono text-xs block uppercase text-cyan-300">{mode}</span>
                    <span className="text-[10px] text-neutral-500 font-sans block mt-0.5">
                      {mode === 'agent' && 'Autonomous verification'}
                      {mode === 'build' && 'Instant synthesis'}
                      {mode === 'ask' && 'Read-only inquiry'}
                      {mode === 'plan' && 'Architecture spec'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
              <div>
                <p className="font-medium text-neutral-200 font-mono text-xs">Auto-Apply Verified Patches</p>
                <p className="text-[11px] text-neutral-500">
                  Automatically apply clean syntax patches when tsgo strict typechecking reports 0 errors
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.autoApproveTools}
                onChange={(e) => setForm({ ...form, autoApproveTools: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Runtime Diagnostics */}
        <div className="p-5 rounded-2xl bg-[#07080d] border border-cyan-500/20 flex items-center justify-between text-xs text-neutral-400 font-mono shadow-inner">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <span>SANDBOX BINDING: 0.0.0.0:3000 (CONTAINER PORT INGRESS)</span>
          </div>
          <span className="text-cyan-400/80">Vite 5.4 • React 19 • Strict tsgo</span>
        </div>
      </div>
    </div>
  );
};
