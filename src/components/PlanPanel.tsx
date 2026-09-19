import React, { useState } from "react";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  ListChecks, 
  Play, 
  Plus, 
  Sparkles
} from "lucide-react";
import { PlanMilestone } from "../types";

interface PlanPanelProps {
  milestones: PlanMilestone[];
  onToggleStep: (milestoneId: string, stepIndex: number) => void;
  onAddMilestone: (title: string, description: string) => void;
  onExecutePlan: () => void;
}

export const PlanPanel: React.FC<PlanPanelProps> = ({
  milestones,
  onToggleStep,
  onAddMilestone,
  onExecutePlan,
}) => {
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddMilestone(newTitle.trim(), newDesc.trim());
    setNewTitle("");
    setNewDesc("");
    setShowAddForm(false);
  };

  const completedCount = milestones.filter((m) => m.status === "completed").length;
  const progressPercent = Math.round((completedCount / (milestones.length || 1)) * 100);

  return (
    <div className="flex flex-col h-full bg-[#0a0c12] p-3 sm:p-5 select-none overflow-y-auto min-h-0">
      {/* Header Banner */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-3.5 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
                <ListChecks className="w-4 h-4" />
              </span>
              <h2 className="text-sm font-bold text-neutral-100">
                Architectural Roadmap & Plan Annotations
              </h2>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Deterministic task decomposition. The autonomous agent reviews these milestones before modifying codebase AST.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> New Milestone
            </button>
            <button
              onClick={onExecutePlan}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-neutral-950" /> Execute Plan
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-4 border-t border-neutral-800">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
            <span>Overall Roadmap Completion</span>
            <span className="font-mono text-cyan-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* New Milestone Form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="mb-6 bg-neutral-900 border border-cyan-800/60 rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-semibold text-neutral-200 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Add Architectural Milestone
          </h3>
          <input
            type="text"
            placeholder="Milestone title (e.g. 4. Zero-Knowledge Proof Verifier Engine)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
          />
          <textarea
            placeholder="Description and architectural constraints..."
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            rows={2}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-cyan-500 resize-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-neutral-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-neutral-950 font-semibold text-xs transition-colors"
            >
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* Milestones List */}
      <div className="space-y-4">
        {milestones.map((m) => (
          <div
            key={m.id}
            className={`border rounded-xl p-4 transition-all ${
              m.status === "completed"
                ? "bg-neutral-900/40 border-neutral-800"
                : m.status === "in-progress"
                ? "bg-neutral-900/90 border-cyan-800/70 shadow-lg shadow-cyan-950/30"
                : "bg-neutral-900/60 border-neutral-800"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <span className="mt-0.5">
                  {m.status === "completed" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : m.status === "in-progress" ? (
                    <Clock className="w-4 h-4 text-cyan-400 animate-spin" />
                  ) : (
                    <Circle className="w-4 h-4 text-neutral-600" />
                  )}
                </span>
                <div>
                  <h3 className="text-xs font-bold text-neutral-100">{m.title}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">{m.description}</p>
                </div>
              </div>

              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                  m.status === "completed"
                    ? "bg-emerald-950/80 text-emerald-400 border-emerald-800"
                    : m.status === "in-progress"
                    ? "bg-cyan-950/80 text-cyan-400 border-cyan-800"
                    : "bg-neutral-800 text-neutral-400 border-neutral-700"
                }`}
              >
                {m.status}
              </span>
            </div>

            {/* Checklist items */}
            {m.steps && m.steps.length > 0 && (
              <div className="mt-3.5 pl-7 space-y-2 border-t border-neutral-800/60 pt-3">
                {m.steps.map((step, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2.5 text-xs text-neutral-300 hover:text-neutral-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={m.status === "completed"}
                      onChange={() => onToggleStep(m.id, idx)}
                      className="rounded border-neutral-700 bg-neutral-800 text-cyan-500 focus:ring-0 w-3.5 h-3.5"
                    />
                    <span className="font-mono text-[11px] text-neutral-300">{step}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
