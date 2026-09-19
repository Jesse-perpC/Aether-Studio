import React, { useState } from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  RotateCw, 
  FileCode, 
  Sparkles 
} from "lucide-react";
import { SecurityFinding } from "../types";

interface SecurityPanelProps {
  findings: SecurityFinding[];
  onFixFinding: (finding: SecurityFinding) => void;
  onRunAudit: () => void;
}

export const SecurityPanel: React.FC<SecurityPanelProps> = ({
  findings,
  onFixFinding,
  onRunAudit,
}) => {
  const [isAuditing, setIsAuditing] = useState(false);

  const handleAuditClick = () => {
    setIsAuditing(true);
    setTimeout(() => {
      onRunAudit();
      setIsAuditing(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0c12] p-3 sm:p-5 select-none overflow-y-auto min-h-0">
      {/* Header Banner */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-3.5 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </span>
              <h2 className="text-sm font-bold text-neutral-100">
                Security & Static Vulnerability Review
              </h2>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Deterministic AST scanner inspecting IPC boundaries, local storage sanitation, cross-origin referrer leaks, and secret injection.
            </p>
          </div>

          <button
            onClick={handleAuditClick}
            disabled={isAuditing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-neutral-950 text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer self-start sm:self-auto shrink-0"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAuditing ? "animate-spin" : ""}`} />
            <span>{isAuditing ? "Auditing Codebase..." : "Run Security Scan"}</span>
          </button>
        </div>

        {/* Audit Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mt-4 pt-4 border-t border-neutral-800 text-center">
          <div className="bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-800">
            <span className="text-[10px] text-neutral-400 uppercase font-mono">Total Issues</span>
            <p className="text-lg font-bold text-neutral-100 font-mono mt-0.5">{findings.length}</p>
          </div>
          <div className="bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-800">
            <span className="text-[10px] text-neutral-400 uppercase font-mono">Critical / High</span>
            <p className="text-lg font-bold text-rose-400 font-mono mt-0.5">
              {findings.filter((f) => f.severity === "critical" || f.severity === "high").length}
            </p>
          </div>
          <div className="bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-800">
            <span className="text-[10px] text-neutral-400 uppercase font-mono">1-Click Fixes</span>
            <p className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
              {findings.filter((f) => f.fixAvailable).length}
            </p>
          </div>
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        {findings.length === 0 ? (
          <div className="text-center py-12 bg-neutral-900/40 rounded-xl border border-neutral-800">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-200">Zero Security Deficiencies Found</p>
            <p className="text-xs text-neutral-400 mt-1">All AST security checks and IPC guardrails passed.</p>
          </div>
        ) : (
          findings.map((f) => {
            const severityColor =
              f.severity === "critical"
                ? "bg-rose-950/80 text-rose-400 border-rose-800"
                : f.severity === "high"
                ? "bg-orange-950/80 text-orange-400 border-orange-800"
                : f.severity === "medium"
                ? "bg-amber-950/80 text-amber-400 border-amber-800"
                : "bg-blue-950/80 text-blue-400 border-blue-800";

            return (
              <div
                key={f.id}
                className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-3.5 sm:p-4 transition-all hover:border-neutral-700"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${severityColor}`}>
                        {f.severity}
                      </span>
                      <h3 className="text-xs font-bold text-neutral-200">{f.type}</h3>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">{f.description}</p>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-500 mt-2">
                      <FileCode className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{f.file}</span>
                      <span className="shrink-0">:line {f.line}</span>
                    </div>
                  </div>

                  {f.fixAvailable && (
                    <button
                      onClick={() => onFixFinding(f)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/80 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer self-start shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Fix with AI
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
