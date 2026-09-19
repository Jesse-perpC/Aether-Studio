import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  CheckCircle2, 
  Terminal, 
  Cpu, 
  GitCommit
} from "lucide-react";
import { ChatMessage, ChatMode } from "../types";

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  chatMode: ChatMode;
  onChangeChatMode?: (mode: ChatMode) => void;
  isGenerating: boolean;
  selectedModel: string;
  onSelectModel: (model: string) => void;
  onClearHistory: () => void;
}

const AVAILABLE_MODELS = [
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "Google DeepMind", speed: "Instant", ctx: "1M tokens" },
  { id: "claude-3.7-sonnet", name: "Claude 3.7 Sonnet (Hybrid)", provider: "Anthropic", speed: "Fast", ctx: "200k tokens" },
  { id: "gpt-4o", name: "GPT-4o Omnimodal", provider: "OpenAI", speed: "Fast", ctx: "128k tokens" },
  { id: "deepseek-r1", name: "DeepSeek-R1 Distill", provider: "DeepSeek", speed: "Reasoning", ctx: "64k tokens" },
  { id: "ollama-llama3", name: "Llama 3.3 70B Local", provider: "Ollama IPC", speed: "Local", ctx: "32k tokens" },
];

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  chatMode,
  isGenerating,
  selectedModel,
  onSelectModel,
  onClearHistory,
}) => {
  const [inputText, setInputText] = useState("");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isGenerating) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const currentModelObj = AVAILABLE_MODELS.find((m) => m.id === selectedModel) || AVAILABLE_MODELS[0];

  const quickPrompts = [
    "Refactor state to custom hooks",
    "Add dark mode palette",
    "Fix TypeScript errors",
    "Run security vulnerability audit",
  ];

  return (
    <div className="flex flex-col h-full bg-[#0d0f17] border-r border-neutral-800/80">
      {/* Top Chat Toolbar: Model Picker & Mode */}
      <div className="p-2.5 sm:p-3 border-b border-neutral-800/80 flex items-center justify-between gap-2 bg-neutral-900/40 flex-wrap sm:flex-nowrap">
        <div className="relative min-w-0">
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            className="flex items-center gap-1.5 sm:gap-2 text-xs bg-neutral-900 border border-neutral-700/60 rounded-lg px-2 sm:px-2.5 py-1.5 hover:bg-neutral-800 text-neutral-200 transition-colors cursor-pointer max-w-[200px] sm:max-w-none"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="font-semibold truncate">{currentModelObj.name}</span>
            <span className="text-[10px] text-neutral-400 shrink-0 hidden xs:inline">({currentModelObj.speed})</span>
          </button>

          {showModelDropdown && (
            <div className="absolute left-0 mt-1.5 w-64 max-w-[calc(100vw-2rem)] bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-1.5 z-50 max-h-72 overflow-y-auto">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-2 py-1">
                Active Reasoning Engines
              </div>
              <div className="space-y-1">
                {AVAILABLE_MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectModel(m.id);
                      setShowModelDropdown(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      m.id === selectedModel
                        ? "bg-cyan-950/60 text-cyan-200 border border-cyan-800/40"
                        : "text-neutral-300 hover:bg-neutral-800/60"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-medium text-neutral-100 truncate">{m.name}</p>
                      <p className="text-[10px] text-neutral-400 truncate">{m.provider} • {m.ctx}</p>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono shrink-0">
                      {m.speed}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
            chatMode === "local-agent" ? "bg-cyan-950/80 text-cyan-400 border-cyan-800" :
            chatMode === "build" ? "bg-emerald-950/80 text-emerald-400 border-emerald-800" :
            chatMode === "ask" ? "bg-amber-950/80 text-amber-400 border-amber-800" :
            "bg-indigo-950/80 text-indigo-400 border-indigo-800"
          }`}>
            {chatMode}
          </span>
          <button
            onClick={onClearHistory}
            className="text-[11px] text-neutral-400 hover:text-neutral-200 px-2 py-1 rounded hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Reset conversation"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 min-h-0">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
            <div className="flex items-center gap-2 mb-1 px-1">
              <span className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1">
                {msg.role === "assistant" ? (
                  <>
                    <Bot className="w-3.5 h-3.5 text-cyan-400" /> Aether Agent
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-neutral-300" /> Jesse (Developer)
                  </>
                )}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">{msg.timestamp}</span>
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[95%] sm:max-w-[92%] rounded-xl p-3 sm:p-3.5 text-xs leading-relaxed break-words ${
                msg.role === "user"
                  ? "bg-cyan-900/40 border border-cyan-700/50 text-neutral-100 shadow-md"
                  : "bg-neutral-900/90 border border-neutral-800 text-neutral-200 shadow-lg"
              }`}
            >
              <div className="whitespace-pre-wrap break-words">{msg.content}</div>

              {/* Status Message */}
              {msg.statusMessage && (
                <div className="mt-2.5 pt-2 border-t border-neutral-800 flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{msg.statusMessage}</span>
                </div>
              )}

              {/* Tool Execution Cards */}
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3 h-3 text-cyan-400" /> Autonomous Agent Steps
                  </div>
                  {msg.toolCalls.map((tool) => (
                    <div
                      key={tool.id}
                      className="bg-[#090b10] border border-neutral-800 rounded-lg p-2.5 font-mono text-[11px] overflow-hidden"
                    >
                      <div className="flex items-center justify-between text-neutral-300 gap-2">
                        <span className="text-cyan-300 font-semibold truncate">{tool.name}</span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800 shrink-0">
                          {tool.status}
                        </span>
                      </div>
                      {tool.target && (
                        <div className="text-[10px] text-neutral-400 mt-1 truncate">
                          Target: <span className="text-neutral-300">{tool.target}</span>
                        </div>
                      )}
                      {tool.output && (
                        <div className="text-[10px] text-neutral-400 mt-1 bg-neutral-900/80 p-1.5 rounded border border-neutral-800/80 break-all max-h-32 overflow-y-auto">
                          {tool.output}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Diff summary if present */}
              {msg.diffSummary && (
                <div className="mt-2.5 pt-2 border-t border-neutral-800/80 flex items-center gap-3 text-[10px] font-mono text-neutral-400">
                  <span className="flex items-center gap-1 text-cyan-400">
                    <GitCommit className="w-3 h-3" /> {msg.diffSummary.filesChanged} file changed
                  </span>
                  <span className="text-emerald-400">+{msg.diffSummary.additions} lines</span>
                  <span className="text-rose-400">-{msg.diffSummary.deletions} lines</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 mb-1 px-1">
              <span className="text-[11px] font-semibold text-cyan-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 animate-spin" /> Neural Synthesis in Progress...
              </span>
            </div>
            <div className="bg-neutral-900 border border-cyan-800/60 rounded-xl p-3 text-xs text-neutral-300 max-w-[85%] flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-neutral-400 font-mono text-[11px]">
                Invoking tool `write_file` and compiling AST via tsgo...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 border-t border-neutral-800/60 bg-neutral-900/30 flex gap-2 overflow-x-auto no-scrollbar">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(p)}
            className="whitespace-nowrap text-[10px] bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-cyan-300 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-neutral-800/80 bg-[#0d0f17]">
        <div className="relative bg-neutral-900/90 border border-neutral-800 rounded-xl p-2 focus-within:border-cyan-500/80 transition-all">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={
              chatMode === "local-agent"
                ? "Instruct Aether Agent (e.g. 'Add real-time price tick simulation with WebSockets')..."
                : chatMode === "plan"
                ? "Draft milestone plan or add architectural annotation..."
                : chatMode === "build"
                ? "Direct code modification instruction..."
                : "Ask anything about current repository, AST, or IPC..."
            }
            rows={2}
            className="w-full bg-transparent text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none resize-none"
          />

          <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60">
            <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
              <span className="font-mono text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-300">
                ↵ to send
              </span>
              <span className="text-[10px] text-neutral-400">Shift+↵ newline</span>
            </div>

            <button
              type="submit"
              disabled={!inputText.trim() || isGenerating}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                inputText.trim() && !isGenerating
                  ? "bg-cyan-500 hover:bg-cyan-400 text-neutral-950 shadow-md shadow-cyan-500/20"
                  : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
              }`}
            >
              <Send className="w-3.5 h-3.5" /> Run
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
