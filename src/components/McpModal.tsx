import React, { useState } from "react";
import { X, Blocks, Plus, Server } from "lucide-react";
import { McpPlugin } from "../types";
import { MCP_PLUGINS_DATA } from "../data/mockData";

interface McpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const McpModal: React.FC<McpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [plugins, setPlugins] = useState<McpPlugin[]>(MCP_PLUGINS_DATA);
  const [newServerName, setNewServerName] = useState("");
  const [newServerUrl, setNewServerUrl] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const toggleStatus = (id: string) => {
    setPlugins((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "connected" ? "disconnected" : "connected" }
          : p
      )
    );
  };

  const handleAddServer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServerName.trim() || !newServerUrl.trim()) return;

    const newPlugin: McpPlugin = {
      id: `mcp-${Date.now()}`,
      name: newServerName.trim(),
      description: "Custom user-configured Model Context Protocol daemon endpoint.",
      status: "connected",
      version: "v1.0.0",
      endpoint: newServerUrl.trim(),
      tools: ["custom_tool_exec", "query_ast"],
    };

    setPlugins([...plugins, newPlugin]);
    setNewServerName("");
    setNewServerUrl("");
    setShowAdd(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-2 sm:p-4 select-none overflow-y-auto">
      <div className="bg-[#0e111a] border border-neutral-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden my-auto">
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0">
              <Blocks className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-neutral-100">Model Context Protocol (MCP) Hub</h2>
              <p className="text-xs text-neutral-400">Integrate external tool servers, database drivers, and native daemons</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-3 border-b border-neutral-800 bg-neutral-900/40 flex items-center justify-between flex-wrap gap-2 shrink-0">
          <div className="text-xs text-neutral-400 font-mono">
            Active Servers: {plugins.filter((p) => p.status === "connected").length} / {plugins.length}
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-1 text-xs bg-cyan-600 hover:bg-cyan-500 text-neutral-950 font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" /> Connect Server
          </button>
        </div>

        {/* Add Server Form */}
        {showAdd && (
          <form onSubmit={handleAddServer} className="p-3.5 sm:p-4 border-b border-neutral-800 bg-neutral-900/80 space-y-3 shrink-0">
            <h3 className="text-xs font-semibold text-neutral-200">Register New MCP Endpoint</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Server Name (e.g. Postgres Dev DB)"
                value={newServerName}
                onChange={(e) => setNewServerName(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500"
              />
              <input
                type="text"
                placeholder="Endpoint URI (e.g. mcp://localhost:5050)"
                value={newServerUrl}
                onChange={(e) => setNewServerUrl(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="text-xs text-neutral-400 hover:text-neutral-200 px-3 py-1 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-xs bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
              >
                Register & Bind
              </button>
            </div>
          </form>
        )}

        {/* Server Cards List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 min-h-0">
          {plugins.map((plugin) => (
            <div
              key={plugin.id}
              className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-3.5 sm:p-4 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-3 mb-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-cyan-400 shrink-0">
                    <Server className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-neutral-100 flex items-center gap-2 flex-wrap">
                      <span className="truncate">{plugin.name}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">({plugin.version})</span>
                    </h3>
                    <p className="text-[11px] text-neutral-400 font-mono mt-0.5 truncate">{plugin.endpoint}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      plugin.status === "connected"
                        ? "bg-emerald-950/80 text-emerald-400 border-emerald-800"
                        : "bg-neutral-800 text-neutral-500 border-neutral-700"
                    }`}
                  >
                    {plugin.status}
                  </span>
                  <button
                    onClick={() => toggleStatus(plugin.id)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {plugin.status === "connected" ? "Disconnect" : "Connect"}
                  </button>
                </div>
              </div>

              <p className="text-xs text-neutral-300 mb-3 leading-relaxed">{plugin.description}</p>

              {/* Tools Exported */}
              <div className="pt-2 border-t border-neutral-800 flex flex-wrap gap-1.5 items-center">
                <span className="text-[10px] font-mono text-neutral-500 uppercase mr-1 shrink-0">Exposed Tools:</span>
                {plugin.tools.map((tool) => (
                  <span
                    key={tool}
                    className="text-[10px] font-mono bg-neutral-950 text-cyan-400 border border-neutral-800 px-2 py-0.5 rounded shrink-0"
                  >
                    {tool}()
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-800 bg-[#0d0f17] flex items-center justify-between text-xs shrink-0 flex-wrap gap-2">
          <span className="text-[10px] text-neutral-400 font-mono">
            Perp Corp Media & AI Solutions • <span className="text-cyan-400 font-semibold">Jesse Lepota</span>
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors cursor-pointer ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
