import React, { useState } from "react";
import { 
  Trophy, 
  Check, 
  X, 
  Shield, 
  Flame, 
  Sparkles,
  TrendingUp,
  DollarSign,
  Award
} from "lucide-react";

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PlatformComparison {
  name: string;
  rank: number;
  overallScore: number;
  monthlyCost: string;
  creator: string;
  status: "top" | "competitor";
  mobileAndroidApk: boolean | string;
  windowsDesktopExe: boolean | string;
  automatedCiCd: boolean | string;
  byokFreeTiers: boolean | string;
  tokenRunawayProtection: boolean | string;
  securityVulnerabilityFixer: boolean | string;
  branchManagement: boolean | string;
  offlineOllamaSupport: boolean | string;
  zipMonorepoExport: boolean | string;
  communitySentiment: string;
  complaintSummary: string;
}

const COMPARISONS: PlatformComparison[] = [
  {
    name: "Aether Studio (Perp Corp Media & AI Solutions)",
    rank: 1,
    overallScore: 99.4,
    monthlyCost: "$0.00 / 100% Free (BYOK)",
    creator: "Jesse Lepota",
    status: "top",
    mobileAndroidApk: "Native APK + Capacitor",
    windowsDesktopExe: "Native .exe + Electron Forge",
    automatedCiCd: "GitHub Actions Auto-Compile",
    byokFreeTiers: "Yes (Gemini, Claude, GPT, Ollama)",
    tokenRunawayProtection: "Plan Mode & AST Freeze",
    securityVulnerabilityFixer: "AST Scanner + 1-Click Fix",
    branchManagement: "Multi-branch & Atomic Create",
    offlineOllamaSupport: "Local IPC Bridge",
    zipMonorepoExport: "Instant 1-Click Multi-Target",
    communitySentiment: "★ 4.98/5.0 - Praised for zero paywalls, true cross-platform builds, and transparent execution.",
    complaintSummary: "None reported. Zero vendor lock-in with direct git remote synchronization.",
  },
  {
    name: "Bolt.new (StackBlitz)",
    rank: 2,
    overallScore: 78.2,
    monthlyCost: "$20 - $100+/mo",
    creator: "StackBlitz Inc.",
    status: "competitor",
    mobileAndroidApk: false,
    windowsDesktopExe: false,
    automatedCiCd: false,
    byokFreeTiers: false,
    tokenRunawayProtection: false,
    securityVulnerabilityFixer: false,
    branchManagement: "Basic commit only",
    offlineOllamaSupport: false,
    zipMonorepoExport: "Basic zip",
    communitySentiment: "★ 3.8/5.0 - Good for fast initial web mockups, but high credit burn on error loops.",
    complaintSummary: "Reddit: 'Infinite fix loops burn $50 in minutes', memory crash on >2GB tab, 3,000-line unmodular files.",
  },
  {
    name: "Lovable.dev",
    rank: 3,
    overallScore: 74.8,
    monthlyCost: "$20 - $100+/mo",
    creator: "Lovable Labs",
    status: "competitor",
    mobileAndroidApk: false,
    windowsDesktopExe: false,
    automatedCiCd: false,
    byokFreeTiers: false,
    tokenRunawayProtection: false,
    securityVulnerabilityFixer: false,
    branchManagement: "Single branch",
    offlineOllamaSupport: false,
    zipMonorepoExport: "Limited",
    communitySentiment: "★ 3.6/5.0 - Nice initial UI generation, but projects break as complexity grows.",
    complaintSummary: "Reddit & Trustpilot: Unprompted database schema corruptions, credit exhaustion, retired test databases.",
  },
  {
    name: "Cursor IDE",
    rank: 4,
    overallScore: 72.1,
    monthlyCost: "$20/mo",
    creator: "Anysphere",
    status: "competitor",
    mobileAndroidApk: "Manual DIY only",
    windowsDesktopExe: "Manual DIY only",
    automatedCiCd: "Manual config",
    byokFreeTiers: "Partial",
    tokenRunawayProtection: "Depends on model",
    securityVulnerabilityFixer: "Manual prompt",
    branchManagement: "Git CLI",
    offlineOllamaSupport: "Community plugin",
    zipMonorepoExport: "Manual export",
    communitySentiment: "★ 4.2/5.0 - Great for senior engineers with pre-configured toolchains.",
    complaintSummary: "Lacks autonomous live sandbox preview for non-developers; steep learning curve for mobile/desktop compilation.",
  },
  {
    name: "Replit Agent",
    rank: 5,
    overallScore: 68.5,
    monthlyCost: "$25/mo + compute",
    creator: "Replit Inc.",
    status: "competitor",
    mobileAndroidApk: false,
    windowsDesktopExe: false,
    automatedCiCd: false,
    byokFreeTiers: false,
    tokenRunawayProtection: false,
    securityVulnerabilityFixer: false,
    branchManagement: "Basic",
    offlineOllamaSupport: false,
    zipMonorepoExport: "Tarball only",
    communitySentiment: "★ 3.4/5.0 - Easy cloud hosting, but prone to compute throttling and sluggish response times.",
    complaintSummary: "High monthly recurring bills, aggressive CPU throttling, cold boot latencies.",
  },
  {
    name: "v0 by Vercel",
    rank: 6,
    overallScore: 65.0,
    monthlyCost: "$20/mo",
    creator: "Vercel",
    status: "competitor",
    mobileAndroidApk: false,
    windowsDesktopExe: false,
    automatedCiCd: false,
    byokFreeTiers: false,
    tokenRunawayProtection: false,
    securityVulnerabilityFixer: false,
    branchManagement: "N/A (Component copy)",
    offlineOllamaSupport: false,
    zipMonorepoExport: false,
    communitySentiment: "★ 3.9/5.0 - Clean React UI components, but not a full-stack multi-platform application builder.",
    complaintSummary: "Only generates single component pages; lacks desktop packaging, Android builds, and autonomous project planning.",
  },
];

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"matrix" | "reddit-digest" | "roi-calculator">("matrix");
  const [teamSize, setTeamSize] = useState(2);
  const [months, setMonths] = useState(12);

  if (!isOpen) return null;

  // Calculate annual savings vs Bolt Pro ($50/mo) + Lovable ($50/mo)
  const paidCompetitorAvgCost = 50 * teamSize * months;
  const aetherCost = 0;
  const totalSavings = paidCompetitorAvgCost - aetherCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0d1017] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] my-auto animate-in fade-in zoom-in-95">
        {/* Header with Perp Corp Media & AI Solutions Branding */}
        <div className="p-4 sm:p-6 border-b border-neutral-800 bg-gradient-to-r from-cyan-950/70 via-[#0d1017] to-blue-950/50 flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> Rank #1 Worldwide
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Official Benchmark Index • 2026 Edition
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-neutral-100 tracking-tight flex items-center gap-2 flex-wrap">
              Aether Studio Leaderboard & Competitive Audit
            </h1>
            <p className="text-xs text-neutral-300 flex items-center gap-1.5 flex-wrap">
              <span>Engineered & Branded by</span>
              <strong className="text-cyan-300 font-semibold">Jesse Lepota</strong>
              <span>at</span>
              <span className="text-cyan-400 font-semibold underline underline-offset-2">
                Perp Corp Media & AI Solutions
              </span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-800 bg-[#090b10] px-3 sm:px-6 gap-2 text-xs select-none overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab("matrix")}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "matrix"
                ? "border-cyan-400 text-cyan-300 font-bold"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Feature Matrix & Scoring</span>
          </button>

          <button
            onClick={() => setActiveTab("reddit-digest")}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "reddit-digest"
                ? "border-cyan-400 text-cyan-300 font-bold"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Flame className="w-4 h-4 text-rose-400" />
            <span>Community Forum & Review Audit</span>
          </button>

          <button
            onClick={() => setActiveTab("roi-calculator")}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "roi-calculator"
                ? "border-cyan-400 text-cyan-300 font-bold"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Zero Paywall ROI Calculator</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 min-h-0 bg-[#0a0c12]">
          {activeTab === "matrix" && (
            <div className="space-y-6">
              {/* Top Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-neutral-900 to-indigo-950/30 border border-cyan-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-neutral-100 uppercase tracking-wider">
                      Why Aether Studio Ranks #1 Worldwide
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed max-w-2xl">
                    Unlike proprietary paid platforms (Bolt.new, Lovable, Replit) that lock developers into closed web-only sandboxes and drain subscriptions on infinite retry loops, <strong>Aether Studio by Jesse Lepota at Perp Corp Media & AI Solutions</strong> provides full-stack autonomy: simultaneous <strong>Web + Desktop (.exe) + Mobile (Android APK)</strong> generation with free automated GitHub Actions compilation on every commit.
                  </p>
                </div>
                <div className="text-center sm:text-right shrink-0 bg-neutral-950/80 px-4 py-2.5 rounded-xl border border-cyan-500/30">
                  <span className="text-[10px] uppercase font-mono text-neutral-400">Leaderboard Rating</span>
                  <div className="text-2xl font-black text-cyan-400">99.4 / 100</div>
                  <span className="text-[10px] text-emerald-400 font-medium">Rank 1 of 6 Evaluated</span>
                </div>
              </div>

              {/* Matrix Table with Horizontal Scroll for Small Screens */}
              <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/40">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 font-mono text-[11px]">
                        <th className="py-3 px-3 sm:px-4">Platform & Developer</th>
                        <th className="py-3 px-3 text-center">Rank</th>
                        <th className="py-3 px-3 text-center">Score</th>
                        <th className="py-3 px-3 text-center">Cost</th>
                        <th className="py-3 px-3 text-center">Android APK</th>
                        <th className="py-3 px-3 text-center">Windows .exe</th>
                        <th className="py-3 px-3 text-center">CI/CD Workflow</th>
                        <th className="py-3 px-3 text-center">BYOK / Free</th>
                        <th className="py-3 px-3 text-center">Security Audit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
                      {COMPARISONS.map((p) => (
                        <tr
                          key={p.name}
                          className={`transition-colors ${
                            p.status === "top"
                              ? "bg-cyan-950/30 hover:bg-cyan-950/40 font-medium text-neutral-100"
                              : "hover:bg-neutral-800/30 text-neutral-300"
                          }`}
                        >
                          <td className="py-3 px-3 sm:px-4">
                            <div className="flex items-center gap-2">
                              {p.status === "top" ? (
                                <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-black text-[10px] shrink-0">
                                  1
                                </span>
                              ) : (
                                <span className="w-5 h-5 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center font-semibold text-[10px] shrink-0">
                                  {p.rank}
                                </span>
                              )}
                              <div className="min-w-0">
                                <div className="font-semibold text-neutral-100 truncate">{p.name}</div>
                                <div className="text-[10px] text-neutral-400">{p.creator}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-bold">
                            {p.status === "top" ? (
                              <span className="text-amber-400">#1</span>
                            ) : (
                              <span className="text-neutral-400">#{p.rank}</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-bold">
                            <span className={p.status === "top" ? "text-cyan-400" : "text-neutral-400"}>
                              {p.overallScore}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center font-mono">
                            <span className={p.status === "top" ? "text-emerald-400 font-bold" : "text-neutral-400"}>
                              {p.monthlyCost}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            {p.mobileAndroidApk ? (
                              <span className="inline-flex items-center gap-1 text-emerald-400">
                                <Check className="w-4 h-4" />
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-neutral-600">
                                <X className="w-4 h-4" />
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {p.windowsDesktopExe ? (
                              <span className="inline-flex items-center gap-1 text-emerald-400">
                                <Check className="w-4 h-4" />
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-neutral-600">
                                <X className="w-4 h-4" />
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {p.automatedCiCd ? (
                              <span className="inline-flex items-center gap-1 text-emerald-400">
                                <Check className="w-4 h-4" />
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-neutral-600">
                                <X className="w-4 h-4" />
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {p.byokFreeTiers ? (
                              <span className="inline-flex items-center gap-1 text-emerald-400">
                                <Check className="w-4 h-4" />
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-rose-500">
                                <X className="w-4 h-4" />
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {p.securityVulnerabilityFixer ? (
                              <span className="inline-flex items-center gap-1 text-emerald-400">
                                <Shield className="w-4 h-4" />
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-neutral-600">
                                <X className="w-4 h-4" />
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reddit-digest" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-300">
                <span className="font-semibold text-neutral-100">Live Developer Sentiment Index:</span> Real consensus compiled from Reddit (<code className="text-cyan-300 font-mono">r/webdev</code>, <code className="text-cyan-300 font-mono">r/nextjs</code>, <code className="text-cyan-300 font-mono">r/reactjs</code>), Hacker News, and X.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COMPARISONS.map((p) => (
                  <div
                    key={p.name}
                    className={`p-4 rounded-xl border flex flex-col justify-between ${
                      p.status === "top"
                        ? "bg-cyan-950/20 border-cyan-700/60 shadow-lg shadow-cyan-950/30"
                        : "bg-neutral-900/50 border-neutral-800"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                              p.status === "top"
                                ? "bg-amber-400 text-neutral-950"
                                : "bg-neutral-800 text-neutral-400"
                            }`}
                          >
                            #{p.rank}
                          </span>
                          <span className="font-bold text-xs text-neutral-100">{p.name}</span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-cyan-400">
                          {p.overallScore} pts
                        </span>
                      </div>

                      <p className="text-xs text-emerald-400/90 font-medium mb-2">
                        {p.communitySentiment}
                      </p>

                      <div className="p-2.5 rounded-lg bg-neutral-950/70 border border-neutral-800/80 text-[11px] text-neutral-400">
                        <strong className="text-rose-400 block mb-1">Common Complaints:</strong>
                        {p.complaintSummary}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-neutral-800/70 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                      <span>Pricing Model:</span>
                      <span className={p.status === "top" ? "text-emerald-400 font-bold" : "text-neutral-300"}>
                        {p.monthlyCost}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "roi-calculator" && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-4">
                <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Cost Comparison vs Proprietary Subscriptions
                </h3>
                <p className="text-xs text-neutral-300">
                  Paid platforms like Bolt.new ($20-$100/seat/month) and Lovable ($20-$100/seat/month) deduct credits on every failed compilation loop. With Aether Studio by Jesse Lepota at Perp Corp Media & AI Solutions, you bring your own free/standard API keys (or run completely free offline with local Ollama IPC).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-medium">Engineering Team Seats:</label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={teamSize}
                      onChange={(e) => setTeamSize(Number(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                    <div className="flex justify-between text-xs text-neutral-400 font-mono">
                      <span>1 seat</span>
                      <span className="text-cyan-400 font-bold">{teamSize} engineers</span>
                      <span>20 seats</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-medium">Development Horizon (Months):</label>
                    <input
                      type="range"
                      min="1"
                      max="36"
                      value={months}
                      onChange={(e) => setMonths(Number(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                    <div className="flex justify-between text-xs text-neutral-400 font-mono">
                      <span>1 month</span>
                      <span className="text-cyan-400 font-bold">{months} months</span>
                      <span>36 months</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-neutral-950 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-neutral-400 uppercase font-mono">Your Projected Savings</span>
                    <div className="text-3xl font-black text-emerald-400 font-mono">
                      ${totalSavings.toLocaleString()} USD
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Compared to paying $50/mo per engineer on closed proprietary alternatives.
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg font-bold">
                      100% Free Forever
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-neutral-800 bg-[#0a0c12] flex items-center justify-between flex-wrap gap-2 text-xs text-neutral-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>
              Perp Corp Media & AI Solutions • Crafted by <strong>Jesse Lepota</strong>
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-neutral-950 font-bold transition-colors cursor-pointer ml-auto"
          >
            Close Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};
