import React, { useState, useEffect } from "react";
import { 
  RotateCw, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Terminal, 
  Activity, 
  ShieldCheck, 
  ArrowUpRight, 
  Wallet
} from "lucide-react";
import { AppRecord, DeviceMode } from "../types";

interface PreviewPanelProps {
  app: AppRecord;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ app }) => {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [balance, setBalance] = useState(24850.40);
  const [gasGwei, setGasGwei] = useState(18);
  const [walletConnected, setWalletConnected] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    `[Vite] dev server running at: http://localhost:${app.port}/`,
    `[HMR] connected to websocket port ${app.port}`,
    `[Aether Sandbox] Runtime v1.15 initialized in 18ms`,
  ]);

  // Simulate gas fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setGasGwei((prev) => Math.max(12, Math.min(45, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setLogs((prev) => [...prev, `[HMR] forced page reload at ${new Date().toLocaleTimeString()}`]);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const [assets, setAssets] = useState([
    { symbol: "ETH", name: "Ethereum", price: 3420.50, change: "+4.12%", holding: 4.5 },
    { symbol: "BTC", name: "Bitcoin", price: 88400.00, change: "+2.85%", holding: 0.12 },
    { symbol: "SOL", name: "Solana", price: 194.20, change: "+9.34%", holding: 22.0 },
    { symbol: "AETH", name: "Aether Protocol", price: 42.10, change: "+18.60%", holding: 150.0 },
  ]);

  const handleTradeSimulation = (symbol: string) => {
    const asset = assets.find((a) => a.symbol === symbol);
    if (asset) {
      setBalance((b) => +(b + asset.price).toFixed(2));
    }
    setAssets((prev) =>
      prev.map((a) => (a.symbol === symbol ? { ...a, holding: +(a.holding + 1).toFixed(2) } : a))
    );
    setLogs((prev) => [...prev, `[Contract] Executed mint/swap order for +1 ${symbol}`]);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0c12] select-none">
      {/* Sandbox Header & Address Bar */}
      <div className="h-11 border-b border-neutral-800 bg-[#0d0f17] px-2.5 sm:px-3 flex items-center justify-between text-xs select-none overflow-x-auto no-scrollbar gap-2 shrink-0">
        {/* Device Switcher */}
        <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5 shrink-0">
          <button
            onClick={() => setDeviceMode("desktop")}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              deviceMode === "desktop" ? "bg-neutral-800 text-cyan-400" : "text-neutral-400 hover:text-neutral-200"
            }`}
            title="Desktop View (100%)"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeviceMode("tablet")}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              deviceMode === "tablet" ? "bg-neutral-800 text-cyan-400" : "text-neutral-400 hover:text-neutral-200"
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeviceMode("mobile")}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              deviceMode === "mobile" ? "bg-neutral-800 text-cyan-400" : "text-neutral-400 hover:text-neutral-200"
            }`}
            title="Mobile View (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* URL Bar */}
        <div className="flex-1 max-w-md mx-1 sm:mx-3 min-w-[110px]">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-neutral-900/90 border border-neutral-800 px-2 sm:px-3 py-1 rounded-md text-[10px] sm:text-[11px] font-mono text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
            <span className="text-neutral-400 truncate">http://localhost:{app.port}/</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            onClick={handleRefresh}
            className={`p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer ${
              isRefreshing ? "animate-spin text-cyan-400" : ""
            }`}
            title="Reload Sandbox"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowConsole(!showConsole)}
            className={`p-1.5 rounded hover:bg-neutral-800 transition-colors cursor-pointer ${
              showConsole ? "bg-neutral-800 text-cyan-400" : "text-neutral-400 hover:text-neutral-200"
            }`}
            title="Toggle Embedded Logs Console"
          >
            <Terminal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sandbox Screen Canvas */}
      <div className="flex-1 overflow-auto bg-[#07080c] p-2 sm:p-4 flex flex-col items-center justify-start min-h-0">
        <div
          className={`min-h-[420px] transition-all duration-300 shadow-2xl rounded-xl border border-neutral-800 overflow-hidden flex flex-col bg-[#090b10] ${
            deviceMode === "desktop"
              ? "w-full min-w-[300px] flex-1"
              : deviceMode === "tablet"
              ? "w-[768px] max-w-none flex-1 shrink-0"
              : "w-[375px] max-w-full flex-1 shrink-0"
          }`}
        >
          {/* Simulated App Top Bar */}
          <div className="p-3 sm:p-4 border-b border-neutral-800/80 bg-[#0d0f17]/90 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0">
                ⚡
              </div>
              <div>
                <h1 className="font-semibold text-xs text-neutral-100">{app.name}</h1>
                <p className="text-[10px] text-neutral-400">Sandbox Port: {app.port}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {gasGwei} Gwei
              </span>
              <button
                onClick={() => setWalletConnected(!walletConnected)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  walletConnected
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                    : "bg-cyan-500 hover:bg-cyan-400 text-neutral-950"
                }`}
              >
                <Wallet className="w-3 h-3" />
                {walletConnected ? "0x7F...3B9" : "Connect Wallet"}
              </button>
            </div>
          </div>

          {/* Simulated Live Content Body */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 min-h-0">
            {/* Top Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
              <div className="bg-neutral-900/90 border border-neutral-800/90 rounded-xl p-3">
                <p className="text-[11px] text-neutral-400">Portfolio Value</p>
                <p className="text-xl font-bold text-neutral-100 mt-0.5 font-mono">
                  ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-1">
                  <ArrowUpRight className="w-3 h-3" /> +14.2% (24h)
                </div>
              </div>

              <div className="bg-neutral-900/90 border border-neutral-800/90 rounded-xl p-3">
                <p className="text-[11px] text-neutral-400">Yield Vaults</p>
                <p className="text-xl font-bold text-neutral-100 mt-0.5 font-mono">5 Active</p>
                <div className="flex items-center gap-1 text-[10px] text-cyan-400 mt-1">
                  <Activity className="w-3 h-3" /> APY 8.2% avg
                </div>
              </div>

              <div className="bg-neutral-900/90 border border-neutral-800/90 rounded-xl p-3 sm:col-span-2 lg:col-span-1">
                <p className="text-[11px] text-neutral-400">Security Audit</p>
                <p className="text-xl font-bold text-emerald-400 mt-0.5 font-mono">PASSED</p>
                <div className="flex items-center gap-1 text-[10px] text-neutral-400 mt-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Bytecode verified
                </div>
              </div>
            </div>

            {/* Asset Table */}
            <div className="bg-neutral-900/90 border border-neutral-800/90 rounded-xl p-3 sm:p-3.5">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-1">
                <h2 className="text-xs font-semibold text-neutral-200">Tracked Assets</h2>
                <span className="text-[10px] text-neutral-400">Click +1 to execute test trade</span>
              </div>
              <div className="space-y-2">
                {assets.map((asset) => (
                  <div
                    key={asset.symbol}
                    className="p-2 sm:p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/60 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar"
                  >
                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-neutral-800 flex items-center justify-center font-bold text-xs text-cyan-400 font-mono shrink-0">
                        {asset.symbol.slice(0, 3)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-neutral-200 truncate">{asset.name}</p>
                        <p className="text-[10px] text-neutral-400 font-mono truncate">
                          Holding: {asset.holding} {asset.symbol}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-xs font-semibold text-neutral-100 font-mono">
                          ${asset.price.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-emerald-400 font-mono">{asset.change}</p>
                      </div>
                      <button
                        onClick={() => handleTradeSimulation(asset.symbol)}
                        className="text-[10px] bg-cyan-950 hover:bg-cyan-900 text-cyan-300 px-2 py-1 rounded border border-cyan-800 transition-colors font-mono cursor-pointer whitespace-nowrap"
                      >
                        +1 {asset.symbol}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Console Drawer */}
      {showConsole && (
        <div className="h-40 border-t border-neutral-800 bg-[#090b10] p-3 flex flex-col font-mono text-[11px]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800/80 text-neutral-400">
            <span className="flex items-center gap-1.5 text-cyan-400 font-semibold text-xs">
              <Terminal className="w-3.5 h-3.5" /> Sandbox Terminal & HMR Logs
            </span>
            <button
              onClick={() => setLogs([])}
              className="text-[10px] hover:text-neutral-200 px-1.5 py-0.5 rounded hover:bg-neutral-800"
            >
              Clear
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 text-neutral-300">
            {logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-neutral-500">{idx + 1}</span>
                <span className="text-cyan-200/90">{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
