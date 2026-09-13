import React, { useState } from 'react';
import {
  Key,
  Save,
  Check,
  Server,
  Sliders,
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
    <div className="flex-1 overflow-y-auto p-8 bg-[#0d0e11]">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-neutral-800 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Dyad Preferences & Settings</h1>
            <p className="text-xs text-neutral-400 mt-1">
              Manage BYOK API credentials, local LLM endpoints, and default agent behaviors
            </p>
          </div>
          <button
            onClick={handleSubmit}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition ${
              isSaved ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Saved Preferences' : 'Save Changes'}</span>
          </button>
        </div>

        {/* API Credentials Section */}
        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/90 space-y-5">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Key className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">AI Provider API Keys (BYOK)</h2>
          </div>
          <p className="text-xs text-neutral-400">
            Keys are encrypted locally and never transmitted to external logging services.
          </p>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-300 font-medium mb-1.5">Anthropic API Key</label>
              <input
                type="password"
                placeholder="sk-ant-api03-..."
                value={form.anthropicKey}
                onChange={(e) => setForm({ ...form, anthropicKey: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 font-mono focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1.5">OpenAI API Key</label>
              <input
                type="password"
                placeholder="sk-proj-..."
                value={form.openaiKey}
                onChange={(e) => setForm({ ...form, openaiKey: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 font-mono focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1.5">Google Gemini API Key</label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={form.geminiKey}
                onChange={(e) => setForm({ ...form, geminiKey: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 font-mono focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1.5">
                Local Ollama Endpoint (Zero Cloud Telemetry)
              </label>
              <input
                type="text"
                placeholder="http://localhost:11434"
                value={form.ollamaHost}
                onChange={(e) => setForm({ ...form, ollamaHost: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 font-mono focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Agent Behavior & Execution */}
        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/90 space-y-5">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Default Chat & Agent Execution</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-300 font-medium mb-2">Default Starting Chat Mode</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['agent', 'build', 'ask', 'plan'] as ChatMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setForm({ ...form, defaultMode: mode })}
                    className={`p-3 rounded-xl border text-left transition ${
                      form.defaultMode === mode
                        ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="capitalize text-xs block">{mode}</span>
                    <span className="text-[10px] text-neutral-500 font-normal">
                      {mode === 'agent' && 'Autonomous'}
                      {mode === 'build' && 'Direct Edits'}
                      {mode === 'ask' && 'Inquiries'}
                      {mode === 'plan' && 'Specification'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
              <div>
                <p className="font-medium text-neutral-200">Auto-Apply Safe File Modifications</p>
                <p className="text-[11px] text-neutral-500">
                  Automatically apply clean code edits to the preview workspace without manual diff confirmation
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.autoApproveTools}
                onChange={(e) => setForm({ ...form, autoApproveTools: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Runtime Diagnostics */}
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800/60 flex items-center justify-between text-xs text-neutral-400 font-mono">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <span>Local Dev Server Binding: 0.0.0.0:3000</span>
          </div>
          <span className="text-neutral-500">Vite 5.4 + React 19 + TypeScript</span>
        </div>
      </div>
    </div>
  );
};
