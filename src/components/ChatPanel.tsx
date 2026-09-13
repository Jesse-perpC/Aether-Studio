import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Zap,
  User,
  CheckCircle2,
  FileCode,
  Check,
  ChevronDown,
  BookOpen,
  Cpu,
  Layers,
  HelpCircle,
  ListTodo,
  Terminal,
} from 'lucide-react';
import { ChatMode, DyadApp } from '../types';
import { AVAILABLE_MODELS } from '../data/mockApps';

interface ChatPanelProps {
  currentApp: DyadApp;
  onSendMessage: (text: string, mode: ChatMode, modelId: string) => void;
  onOpenPromptLibrary: () => void;
  isGenerating: boolean;
  activeMode: ChatMode;
  onChangeMode: (mode: ChatMode) => void;
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  onAcceptDiffs: (messageId: string) => void;
  onRevertDiffs: (messageId: string) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  currentApp,
  onSendMessage,
  onOpenPromptLibrary,
  isGenerating,
  activeMode,
  onChangeMode,
  selectedModelId,
  onSelectModel,
  onAcceptDiffs,
  onRevertDiffs,
}) => {
  const [inputText, setInputText] = useState('');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedModel =
    AVAILABLE_MODELS.find((m) => m.id === selectedModelId) || AVAILABLE_MODELS[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentApp.chatHistory, isGenerating]);

  const handleSend = () => {
    if (!inputText.trim() || isGenerating) return;
    onSendMessage(inputText.trim(), activeMode, selectedModelId);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const modes: { id: ChatMode; label: string; icon: any; tooltip: string }[] = [
    { id: 'agent', label: 'AUTONOMOUS', icon: Zap, tooltip: 'End-to-end multi-step neural execution & verification' },
    { id: 'build', label: 'SYNTHESIS', icon: Layers, tooltip: 'Direct code generation & live component patching' },
    { id: 'ask', label: 'COGNITION', icon: HelpCircle, tooltip: 'Deep codebase inquiry without disk mutation' },
    { id: 'plan', label: 'ARCHITECT', icon: ListTodo, tooltip: 'Quantum architecture breakdown & implementation spec' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0a0c12] border-r border-neutral-800/80">
      {/* Neural Mode Selector & Model Picker Header */}
      <div className="p-3 border-b border-cyan-500/15 bg-[#0d1017] space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Futuristic Cyber Modes */}
          <div className="flex bg-[#08090d] border border-neutral-800/90 rounded-lg p-0.5">
            {modes.map((m) => {
              const Icon = m.icon;
              const isActive = activeMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onChangeMode(m.id)}
                  title={m.tooltip}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono tracking-tight transition ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Model Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#08090d] border border-neutral-800 hover:border-cyan-500/40 text-xs text-neutral-300 hover:text-white transition font-mono"
            >
              <Cpu className="w-3 h-3 text-cyan-400" />
              <span className="max-w-[120px] truncate font-medium">{selectedModel.name}</span>
              <ChevronDown className="w-3 h-3 text-neutral-500" />
            </button>

            {isModelDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-72 bg-[#0c0f17] border border-cyan-500/30 rounded-xl shadow-2xl py-1.5 z-50 backdrop-blur-xl">
                <div className="px-3 py-1 text-[10px] font-mono font-semibold text-cyan-400/80 uppercase tracking-wider">
                  Neural Model Engine
                </div>
                {AVAILABLE_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      onSelectModel(model.id);
                      setIsModelDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-[#141926] transition flex flex-col ${
                      model.id === selectedModelId ? 'bg-cyan-500/10 text-cyan-300 border-l-2 border-cyan-400' : 'text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold font-mono">{model.name}</span>
                      {model.tag && (
                        <span className="text-[9px] bg-cyan-950/80 text-cyan-300 font-mono px-1.5 py-0.2 rounded border border-cyan-500/30">
                          {model.tag}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-neutral-400 truncate mt-0.5">{model.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mode telemetry summary */}
        <div className="text-[11px] font-mono text-neutral-400 flex items-center justify-between">
          <span className="truncate pr-2">
            {activeMode === 'agent' && '⚡ Autonomous Agent: tool executions, code modifications & tsgo typecheck.'}
            {activeMode === 'build' && '🔮 Neural Synthesis: instant feature generation with live hot-reloading.'}
            {activeMode === 'ask' && '🧠 Deep Cognition: architectural inquiry without mutating file state.'}
            {activeMode === 'plan' && '📐 Quantum Architect: implementation blueprints with step checklists.'}
          </span>
          <button
            onClick={onOpenPromptLibrary}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium transition shrink-0"
          >
            <BookOpen className="w-3 h-3" />
            <span>LIBRARY</span>
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentApp.chatHistory.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              <Zap className="w-7 h-7 text-cyan-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono tracking-wider text-white uppercase">
                Aether Neural Foundry
              </h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-sm">
                State your architectural requirement or UI enhancement. Aether will synthesize components, test types, and synchronize the live sandbox.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => onSendMessage('Add an interactive dark and light mode toggle with smooth transitions', 'agent', selectedModelId)}
                className="text-[11px] font-mono px-3 py-1.5 rounded-lg bg-[#0e121a] border border-neutral-800 hover:border-cyan-500/40 text-neutral-300 hover:text-cyan-300 transition"
              >
                🌓 Add Theme Synthesizer
              </button>
              <button
                onClick={() => onSendMessage('Add live telemetry search bar with instant regex filtering', 'build', selectedModelId)}
                className="text-[11px] font-mono px-3 py-1.5 rounded-lg bg-[#0e121a] border border-neutral-800 hover:border-cyan-500/40 text-neutral-300 hover:text-cyan-300 transition"
              >
                🔍 Telemetry Search Bar
              </button>
            </div>
          </div>
        )}

        {currentApp.chatHistory.map((msg) => (
          <div key={msg.id} className="space-y-2">
            <div
              className={`flex gap-3 text-xs leading-relaxed ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role !== 'user' && (
                <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5 shadow-[0_0_8px_rgba(6,182,212,0.2)]">
                  <Zap className="w-4 h-4 text-cyan-300" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl p-3.5 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md font-medium'
                    : 'bg-[#0d1017] border border-neutral-800/90 text-neutral-200 shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Neural Agent Execution Telemetry Steps */}
                {msg.steps && msg.steps.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-neutral-800 space-y-1.5">
                    <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-cyan-400/90 flex items-center gap-1.5">
                      <Terminal className="w-3 h-3 text-cyan-400" />
                      Neural Execution Timeline
                    </div>
                    {msg.steps.map((step) => (
                      <div
                        key={step.id}
                        className="flex items-start gap-2 text-[11px] bg-[#07080d] p-2 rounded-lg border border-neutral-800 font-mono"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <span className="text-neutral-200 font-semibold">{step.title}</span>
                          {step.detail && (
                            <p className="text-[10px] text-neutral-400 font-sans mt-0.5">{step.detail}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Diffs Summary Card */}
                {msg.diffs && msg.diffs.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-neutral-800">
                    <div className="flex items-center justify-between text-[11px] mb-2 font-mono">
                      <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                        SYNTAX PATCH ({msg.diffs.length} file)
                      </span>
                      <span className="text-emerald-400 text-[10px]">
                        +{msg.diffs[0].additions} -{msg.diffs[0].deletions}
                      </span>
                    </div>

                    <div className="bg-[#07080d] p-2.5 rounded-lg border border-neutral-800 font-mono text-[10px] text-neutral-300 flex items-center justify-between">
                      <span className="truncate text-cyan-300">{msg.diffs[0].path}</span>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {msg.isApplied ? (
                          <span className="text-emerald-400 font-sans flex items-center gap-1 font-semibold">
                            <Check className="w-3 h-3" /> Applied
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() => onAcceptDiffs(msg.id)}
                              className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-sans transition"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => onRevertDiffs(msg.id)}
                              className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 font-sans transition"
                            >
                              Revert
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 animate-pulse">
              <Zap className="w-4 h-4 text-cyan-300" />
            </div>
            <div className="flex items-center gap-2 bg-[#0d1017] border border-cyan-500/30 px-3 py-2 rounded-xl font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Aether is synthesizing with {selectedModel.name}...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Context Mentions Bar */}
      <div className="px-3 py-1.5 border-t border-neutral-800/60 bg-[#090b10] flex items-center gap-2 text-[11px] text-neutral-400 overflow-x-auto font-mono">
        <span className="text-[10px] text-neutral-500 shrink-0 uppercase">CONTEXT:</span>
        <button
          onClick={() => setInputText((prev) => prev + (prev ? ' ' : '') + '@file:src/App.tsx')}
          className="px-2 py-0.5 rounded bg-[#0d1017] hover:bg-cyan-950/40 border border-neutral-800 hover:border-cyan-500/40 text-neutral-300 hover:text-cyan-300 transition shrink-0"
        >
          @file:App.tsx
        </button>
        <button
          onClick={() => setInputText((prev) => prev + (prev ? ' ' : '') + '@app:' + currentApp.slug)}
          className="px-2 py-0.5 rounded bg-[#0d1017] hover:bg-cyan-950/40 border border-neutral-800 hover:border-cyan-500/40 text-neutral-300 hover:text-cyan-300 transition shrink-0"
        >
          @app:{currentApp.slug}
        </button>
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-neutral-800 bg-[#0d1017]">
        <div className="relative bg-[#07080d] border border-neutral-800 focus-within:border-cyan-500/60 rounded-xl p-2.5 transition shadow-inner">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Instruct Aether in ${activeMode.toUpperCase()} mode... (Cmd + Enter to synthesize)`}
            rows={3}
            className="w-full bg-transparent text-xs text-white placeholder-neutral-500 resize-none focus:outline-hidden leading-relaxed font-sans"
          />

          <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 mt-1">
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-mono">
              <span className="text-neutral-500">ENGINE:</span>
              <span className="text-cyan-400 font-semibold uppercase">{activeMode}</span>
            </div>

            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isGenerating}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                inputText.trim() && !isGenerating
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <span>SYNTHESIZE</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
