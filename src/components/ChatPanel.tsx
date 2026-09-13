import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  CheckCircle2,
  FileCode,
  Check,
  ChevronDown,
  BookOpen,
  Wand2,
  Cpu,
  Layers,
  HelpCircle,
  ListTodo,
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
    { id: 'agent', label: 'Agent', icon: Wand2, tooltip: 'Autonomous multi-step coding & verification' },
    { id: 'build', label: 'Build', icon: Layers, tooltip: 'Direct code edits & feature generation' },
    { id: 'ask', label: 'Ask', icon: HelpCircle, tooltip: 'Explain code and architecture without edits' },
    { id: 'plan', label: 'Plan', icon: ListTodo, tooltip: 'Generate detailed implementation specs' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#111215] border-r border-neutral-800/80">
      {/* Mode Selector & Model Picker Header */}
      <div className="p-3 border-b border-neutral-800/80 bg-[#141519] space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Chat Modes */}
          <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
            {modes.map((m) => {
              const Icon = m.icon;
              const isActive = activeMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onChangeMode(m.id)}
                  title={m.tooltip}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                    isActive
                      ? 'bg-neutral-800 text-indigo-400 font-semibold shadow-xs'
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
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 hover:text-white transition"
            >
              <Cpu className="w-3 h-3 text-indigo-400" />
              <span className="max-w-[110px] truncate font-medium">{selectedModel.name}</span>
              <ChevronDown className="w-3 h-3 text-neutral-500" />
            </button>

            {isModelDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-[#18191e] border border-neutral-800 rounded-xl shadow-xl py-1 z-50">
                <div className="px-3 py-1 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                  Available AI Providers
                </div>
                {AVAILABLE_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      onSelectModel(model.id);
                      setIsModelDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-neutral-800/80 transition flex flex-col ${
                      model.id === selectedModelId ? 'bg-indigo-500/10 text-indigo-300' : 'text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{model.name}</span>
                      {model.tag && (
                        <span className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.2 rounded border border-neutral-700">
                          {model.tag}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-neutral-500 truncate">{model.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mode context summary */}
        <div className="text-[11px] text-neutral-400 flex items-center justify-between">
          <span>
            {activeMode === 'agent' && '⚡ Agent mode: plans, edits code, and self-corrects using tools.'}
            {activeMode === 'build' && '🔨 Build mode: rapid generation of components and code changes.'}
            {activeMode === 'ask' && '💡 Ask mode: read-only architecture inquiries and debugging.'}
            {activeMode === 'plan' && '📋 Plan mode: breaks requests into an implementation checklist.'}
          </span>
          <button
            onClick={onOpenPromptLibrary}
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium transition"
          >
            <BookOpen className="w-3 h-3" />
            Prompts
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentApp.chatHistory.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Start Building "{currentApp.name}"</h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                Describe a feature, UI change, or ask questions. Dyad will modify code and refresh your preview.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => onSendMessage('Add an interactive dark and light mode toggle with smooth transitions', 'agent', selectedModelId)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition"
              >
                🌓 Add Dark Mode Toggle
              </button>
              <button
                onClick={() => onSendMessage('Add an instant search bar with live filtering', 'build', selectedModelId)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition"
              >
                🔍 Add Live Search
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
                <div className="w-6 h-6 rounded-md bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl p-3.5 ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-neutral-900/90 border border-neutral-800 text-neutral-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Dyad Agent Status Steps */}
                {msg.steps && msg.steps.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-neutral-800 space-y-1.5">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Agent Execution Steps
                    </div>
                    {msg.steps.map((step) => (
                      <div
                        key={step.id}
                        className="flex items-start gap-2 text-[11px] bg-neutral-950/60 p-2 rounded-lg border border-neutral-800/80 font-mono"
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
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                        Code Modifications ({msg.diffs.length} file)
                      </span>
                      <span className="text-emerald-400 font-mono text-[10px]">
                        +{msg.diffs[0].additions} -{msg.diffs[0].deletions}
                      </span>
                    </div>

                    <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 font-mono text-[10px] text-neutral-300 flex items-center justify-between">
                      <span className="truncate">{msg.diffs[0].path}</span>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        {msg.isApplied ? (
                          <span className="text-emerald-400 font-sans flex items-center gap-1">
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
                <div className="w-6 h-6 rounded-md bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300 shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <div className="w-6 h-6 rounded-md bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 animate-pulse">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-2 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span>Dyad is generating solution with {selectedModel.name}...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Context Mentions Bar */}
      <div className="px-3 py-1.5 border-t border-neutral-800/60 bg-[#121316] flex items-center gap-2 text-[11px] text-neutral-400 overflow-x-auto">
        <span className="font-mono text-[10px] text-neutral-500 shrink-0">Add Context:</span>
        <button
          onClick={() => setInputText((prev) => prev + (prev ? ' ' : '') + '@file:src/App.tsx')}
          className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-mono transition shrink-0"
        >
          @file:App.tsx
        </button>
        <button
          onClick={() => setInputText((prev) => prev + (prev ? ' ' : '') + '@app:' + currentApp.slug)}
          className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-mono transition shrink-0"
        >
          @app:{currentApp.slug}
        </button>
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-neutral-800 bg-[#141519]">
        <div className="relative bg-neutral-900/90 border border-neutral-800 focus-within:border-indigo-500/80 rounded-xl p-2 transition">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask Dyad in ${activeMode} mode... (Cmd + Enter to send)`}
            rows={3}
            className="w-full bg-transparent text-xs text-white placeholder-neutral-500 resize-none focus:outline-hidden leading-relaxed"
          />

          <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60 mt-1">
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
              <span className="font-mono">Mode:</span>
              <span className="text-neutral-300 font-semibold uppercase">{activeMode}</span>
            </div>

            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isGenerating}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                inputText.trim() && !isGenerating
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <span>Send</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
