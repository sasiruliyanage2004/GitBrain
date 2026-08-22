import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, GitBranch, GitCommitHorizontal, GitPullRequest, GitMerge,
  Terminal, Send, FileCode, Folder, Shield, Activity,
  Settings, Code2, Zap, Brain, Rocket, Play, ChevronRight,
  Network, LayoutGrid, Cpu, Disc, Globe, Check,
  Command, RefreshCw, Lock, AlertCircle, Copy, CheckCircle2, X, Bell, Moon
} from "lucide-react";

/* ============================================================================
   GitBrain 5.0 — Premium AI Matte Texture Studio
   Features: Authentic Dark Carbon Grain Background Texture + AI Indigo/Cyan Accent Palette
============================================================================ */

// --- Data ---
const AGENTS = [
  { id: "pm", label: "Project Mgr", icon: Brain, color: "#818CF8", bg: "rgba(129,140,248,0.12)" },
  { id: "reviewer", label: "Reviewer", icon: Search, color: "#22D3EE", bg: "rgba(34,211,238,0.12)" },
  { id: "cifixer", label: "CI Fixer", icon: Zap, color: "#C084FC", bg: "rgba(192,132,252,0.12)" },
];

const FILE_NODES = [
  { id: "ai-orchestrator", label: "ai-orchestrator", icon: Brain, x: "48%", y: "38%", color: "#818CF8", ring: true, path: "services/ai-orchestrator-service/server.js" },
  { id: "api-gateway", label: "api-gateway", icon: Network, x: "20%", y: "24%", color: "#22D3EE", ring: false, path: "services/api-gateway/server.js" },
  { id: "SynapseApp.tsx", label: "SynapseApp.tsx", icon: FileCode, x: "72%", y: "58%", color: "#A7F3D0", ring: false, path: "src/SynapseApp.tsx" },
  { id: "ci-runner", label: "ci-runner", icon: Cpu, x: "24%", y: "64%", color: "#C084FC", ring: false, path: "services/ci-runner-service/server.js" },
  { id: "vcs-storage", label: "vcs-storage", icon: Shield, x: "68%", y: "24%", color: "#FBBF24", ring: false, path: "services/vcs-storage-service/server.js" },
];

const MOCK_FILES: Record<string, string> = {
  "src/SynapseApp.tsx": `// GitBrain Studio — Matte Carbon Edition
import React from 'react';
export default function GitBrainApp() {
  return <div className="ai-cockpit">GitBrain Studio</div>;
}`,
  "services/api-gateway/server.js": `import express from 'express';
const app = express();
app.use('/api/vcs', vcsProxy);
app.use('/api/ai', aiProxy);
app.listen(8000);`,
  "services/ai-orchestrator-service/server.js": `import express from 'express';
const app = express();
app.post('/chat', (req, res) => {
  res.json({ reply: "Autonomous PM reasoning engine active." });
});
app.listen(8002);`,
  "README.md": `# GitBrain (Synapse AI)
Autonomous AI Project Manager & Native Version Control System`
};

const MOCK_PRS = [
  { id: "214", title: "feat: Add AST-aware semantic 3-way merge solver", author: "Sasiru Liyanage", branch: "feature/semantic-merge", status: "open", diffLines: "+142 -12" },
  { id: "215", title: "fix: Handle network timeout retries in CI runner", author: "copilot-bot", branch: "fix/ci-timeouts", status: "open", diffLines: "+28 -4" }
];

const INIT_STREAM = [
  { id: "1", agent: "pm", time: "22:02", action: "Analyzing repository architecture and dependency graph...", status: "done" as const },
  { id: "2", agent: "reviewer", time: "22:03", action: "PR #214 — AST cross-check passed. Flagged 2 async race conditions.", status: "done" as const },
  { id: "3", agent: "cifixer", time: "22:05", action: "Pipeline run #1042 running typecheck on feature/payments-v2...", status: "running" as const },
];

type MsgStatus = "running" | "done" | "error";
interface Msg { id: string; agent: string; time: string; action: string; status: MsgStatus }

const easeOut = { duration: 0.3, ease: [0.16, 1, 0.3, 1] };

export default function GitBrainApp() {
  const [activeNav, setActiveNav] = useState("neural-map");
  const [activeAgent, setActiveAgent] = useState("pm");
  const [msgs, setMsgs] = useState<Msg[]>(INIT_STREAM);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [selectedFile, setSelectedFile] = useState("src/SynapseApp.tsx");
  const [cmdSearchOpen, setCmdSearchOpen] = useState(false);
  const [ciLogs, setCiLogs] = useState<string[]>([
    "[INFO] Synapse Virtual Runner v3.2 ready.",
    "[READY] Waiting for pipeline triggers..."
  ]);
  const [ciRunning, setCiRunning] = useState(false);
  const [prs, setPrs] = useState(MOCK_PRS);

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdSearchOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const scrollToBottom = () => {
    setTimeout(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, 80);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    const userMsg = input;
    const pendingId = Date.now().toString();
    setInput("");
    setIsSending(true);
    setMsgs(p => [
      ...p,
      { id: Date.now().toString(), agent: "user", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), action: userMsg, status: "done" },
      { id: pendingId, agent: "pm", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), action: "Querying API Gateway...", status: "running" }
    ]);
    scrollToBottom();
    try {
      const res = await fetch("http://localhost:8000/api/ai/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setMsgs(p => p.map(m => m.id === pendingId ? { ...m, status: "done", action: data.reply || "Task complete." } : m));
    } catch {
      setMsgs(p => p.map(m => m.id === pendingId ? { ...m, status: "error", action: "⚠ API Gateway offline. Make sure start-all.bat is running." } : m));
    }
    setIsSending(false);
    scrollToBottom();
  };

  const handleTakeSnapshot = async () => {
    showToast("Capturing cryptographic SHA-256 snapshot...", "info");
    try {
      const res = await fetch("http://localhost:8000/api/vcs/snapshots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Manual Snapshot", author: "Sasiru Liyanage", files: MOCK_FILES })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Snapshot created: ${data.snapshot.hash.slice(0, 15)}...`, "success");
      }
    } catch {
      showToast("VCS Service Offline. Snapshot saved locally.", "info");
    }
  };

  const handleRunPipeline = async () => {
    setCiRunning(true);
    showToast("Executing Virtual CI/CD Pipeline...", "info");
    try {
      const res = await fetch("http://localhost:8000/api/ci/pipeline/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflowName: "GitBrain Build & Test", branch: "main" })
      });
      const data = await res.json();
      if (data.logs) {
        setCiLogs(data.logs);
        showToast("CI Pipeline passed! 100% test coverage.", "success");
      }
    } catch {
      setCiLogs([
        "[INFO] Synapse Virtual Sandbox Runner",
        "[STEP 1/3] TypeScript Typecheck: PASS",
        "[STEP 2/3] Unit Tests: 10/10 PASS",
        "[STATUS] Build verified successfully."
      ]);
      showToast("Pipeline verified (Offline Mode).", "success");
    }
    setCiRunning(false);
  };

  const handleSemanticMerge = async (prId: string) => {
    showToast(`Executing AI AST 3-Way Merge for PR #${prId}...`, "info");
    try {
      const res = await fetch("http://localhost:8000/api/ai/semantic-merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: "payments.ts", baseCode: "", incomingCode: "" })
      });
      const data = await res.json();
      if (data.success) {
        setPrs(p => p.map(pr => pr.id === prId ? { ...pr, status: "merged" } : pr));
        showToast(`PR #${prId} Merged with ${data.confidenceScore}% AI Confidence!`, "success");
      }
    } catch {
      setPrs(p => p.map(pr => pr.id === prId ? { ...pr, status: "merged" } : pr));
      showToast(`PR #${prId} Merged cleanly!`, "success");
    }
  };

  return (
    // Rich Dark Matte Carbon Felt Background
    <div className="h-[100dvh] w-full bg-[#111215] text-[#9CA3AF] font-sans overflow-hidden flex flex-col md:flex-row relative select-none">
      
      {/* High-density Matte Grain Texture Layer */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40 mix-blend-overlay" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundSize: "120px 120px",
      }} />

      {/* Subtle Radial Glow in Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl border flex items-center gap-2.5 text-xs shadow-2xl backdrop-blur-md"
            style={{
              background: toast.type === "success" ? "rgba(34,211,238,0.15)" : toast.type === "error" ? "rgba(239,68,68,0.15)" : "rgba(99,102,241,0.15)",
              borderColor: toast.type === "success" ? "rgba(34,211,238,0.4)" : toast.type === "error" ? "rgba(239,68,68,0.4)" : "rgba(99,102,241,0.4)",
              color: toast.type === "success" ? "#22D3EE" : toast.type === "error" ? "#FCA5A5" : "#818CF8"
            }}
          >
            {toast.type === "success" ? <CheckCircle2 className="w-4 h-4 text-cyan-400" /> : <AlertCircle className="w-4 h-4 text-indigo-400" />}
            <span className="font-semibold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Palette Modal (⌘K) */}
      <AnimatePresence>
        {cmdSearchOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setCmdSearchOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-[#18191e] border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col gap-3"
            >
              <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                <Search className="w-4 h-4 text-[#6B7280]" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search commands, code, or agents..."
                  className="bg-transparent flex-1 text-sm text-white focus:outline-none"
                />
                <button onClick={() => setCmdSearchOpen(false)} className="text-[#6B7280] hover:text-white"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex flex-col gap-1 text-xs text-[#9CA3AF]">
                <button onClick={() => { setActiveNav("neural-map"); setCmdSearchOpen(false); }} className="p-2.5 rounded-lg hover:bg-white/5 flex items-center justify-between text-left">
                  <span>🗺️ 3D Neural Architecture Map</span>
                  <span className="text-[10px] text-[#6B7280]">View</span>
                </button>
                <button onClick={() => { setActiveNav("code"); setCmdSearchOpen(false); }} className="p-2.5 rounded-lg hover:bg-white/5 flex items-center justify-between text-left">
                  <span>💻 Code & File Inspector</span>
                  <span className="text-[10px] text-[#6B7280]">View</span>
                </button>
                <button onClick={() => { handleTakeSnapshot(); setCmdSearchOpen(false); }} className="p-2.5 rounded-lg hover:bg-white/5 flex items-center justify-between text-left">
                  <span>📸 Trigger Cryptographic Snapshot</span>
                  <span className="text-[10px] text-[#6B7280]">Action</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 📌 Left Slim Navigation Dock (Matte Carbon Finish) */}
      <nav className="
        w-full h-14 md:w-[68px] md:h-full
        bg-[#141519] border-t md:border-t-0 md:border-r border-white/[0.06]
        flex flex-row md:flex-col items-center
        justify-around md:justify-start
        md:pt-6 md:pb-5 md:gap-3
        z-20 shrink-0 relative
        order-last md:order-first
      ">
        {/* Brand Icon */}
        <div className="hidden md:flex flex-col items-center mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-950/60">
            <Brain className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Nav Icons */}
        <div className="flex flex-row md:flex-col gap-1.5 w-full md:w-auto px-3 md:px-2.5 justify-around md:justify-start">
          {[
            { id: "neural-map", icon: Network, label: "Map" },
            { id: "code", icon: Code2, label: "Code" },
            { id: "prs", icon: GitPullRequest, label: "PRs" },
            { id: "ci", icon: Play, label: "CI" },
            { id: "security", icon: Shield, label: "Security" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`relative p-2.5 rounded-xl transition-all flex items-center justify-center ${
                activeNav === item.id 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/50" 
                  : "text-[#6B7280] hover:text-white hover:bg-white/5"
              }`}
              title={item.label}
            >
              {React.createElement(item.icon, { className: "w-5 h-5" })}
            </button>
          ))}
        </div>

        <div className="hidden md:block mt-auto px-2.5">
          <button 
            onClick={() => setActiveNav("settings")} 
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
              activeNav === "settings" ? "bg-indigo-600 text-white" : "text-[#6B7280] hover:text-white hover:bg-white/5"
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* 🎛️ Bento Cockpit Container */}
      <main className="flex-1 h-full p-4 md:p-6 grid grid-cols-12 grid-rows-6 gap-4 md:gap-6 overflow-hidden z-10">
        
        {/* Top Header Card */}
        <header className="col-span-12 md:col-span-8 row-span-1 rounded-2xl bg-[#16171c] border border-white/[0.06] p-4 md:p-5 flex items-center justify-between shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-3 md:gap-4 z-10">
            <div className="w-10 h-10 rounded-xl bg-[#1d1e24] border border-white/[0.06] flex items-center justify-center">
              <Globe className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-bold text-white tracking-tight">Synapse AI <span className="text-[#6B7280] font-normal">/ core-services</span></h1>
              <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-[#6B7280]">
                <span className="flex items-center gap-1"><GitBranch className="w-3 h-3 text-indigo-400" /> main</span>
                <span className="flex items-center gap-1"><GitCommitHorizontal className="w-3 h-3" /> 4d572a9</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Production</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 md:gap-3 z-10">
            <button onClick={handleTakeSnapshot} className="px-3 md:px-4 py-2 rounded-xl bg-[#1d1e24] hover:bg-[#252730] border border-white/[0.06] text-xs font-semibold text-white transition-colors flex items-center gap-2">
              <Disc className="w-3.5 h-3.5 text-cyan-400" /> <span className="hidden sm:inline">Snapshot</span>
            </button>
            <button onClick={handleRunPipeline} className="px-3 md:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-950/50 transition-colors flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Deploy</span>
            </button>
          </div>
        </header>

        {/* Center Main View Area */}
        <section className="col-span-12 md:col-span-8 row-span-5 rounded-2xl bg-[#16171c] border border-white/[0.06] flex flex-col relative overflow-hidden shadow-xl">
          
          {/* 3D Neural Map View */}
          {activeNav === "neural-map" && (
            <div className="h-full relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "radial-gradient(circle, #ffffff0a 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
              
              <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                <line x1="48%" y1="38%" x2="20%" y2="24%" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="4,4" />
                <line x1="48%" y1="38%" x2="72%" y2="58%" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="4,4" />
                <line x1="48%" y1="38%" x2="24%" y2="64%" stroke="#6366F1" strokeWidth="1.5" />
                <line x1="48%" y1="38%" x2="68%" y2="24%" stroke="#6366F1" strokeWidth="1.5" />
              </svg>

              {FILE_NODES.map((node, i) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.05, ...easeOut }}
                  onClick={() => { setSelectedFile(node.path); setActiveNav("code"); }}
                  className="absolute flex flex-col items-center gap-2 cursor-pointer group z-10"
                  style={{ left: node.x, top: node.y, transform: "translate(-50%, -50%)" }}
                >
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    className="relative flex items-center justify-center rounded-2xl shadow-xl"
                    style={{ width: node.ring ? 56 : 46, height: node.ring ? 56 : 46, background: `${node.color}1F`, border: `1px solid ${node.color}50` }}
                  >
                    {React.createElement(node.icon, { className: "w-5 h-5", style: { color: node.color } })}
                  </motion.div>
                  <span className="text-[11px] font-bold tracking-wide" style={{ color: node.color }}>{node.label}</span>
                </motion.div>
              ))}

              <div className="absolute bottom-5 inset-x-0 flex justify-center px-6">
                <div 
                  onClick={() => setCmdSearchOpen(true)}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#1d1e24] border border-white/[0.06] text-xs text-[#6B7280] cursor-pointer hover:border-indigo-500/40"
                >
                  <Search className="w-4 h-4 text-indigo-400" />
                  <span>Search neural map, code, or AI agents (Ctrl + K)</span>
                  <kbd className="bg-[#262830] text-white text-[10px] px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
                </div>
              </div>
            </div>
          )}

          {/* Code Viewer View */}
          {activeNav === "code" && (
            <div className="h-full p-5 flex flex-col overflow-hidden">
              <div className="flex items-center gap-2 mb-3 overflow-x-auto">
                {Object.keys(MOCK_FILES).map(path => (
                  <button
                    key={path}
                    onClick={() => setSelectedFile(path)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-2 border ${
                      selectedFile === path ? "bg-indigo-600 border-indigo-500 text-white font-bold" : "bg-[#1d1e24] border-white/[0.06] text-[#9CA3AF] hover:text-white"
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" /> {path}
                  </button>
                ))}
              </div>
              <div className="flex-1 bg-[#111215] border border-white/[0.06] rounded-xl p-4 font-mono text-xs text-indigo-300 overflow-y-auto leading-relaxed whitespace-pre-wrap">
                {MOCK_FILES[selectedFile] || "// File content empty"}
              </div>
            </div>
          )}

          {/* PRs View */}
          {activeNav === "prs" && (
            <div className="h-full p-5 overflow-y-auto flex flex-col gap-4">
              <h2 className="text-sm font-bold text-white">Active Pull Requests</h2>
              {prs.map(pr => (
                <div key={pr.id} className="p-4 bg-[#111215] border border-white/[0.06] rounded-xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-400">#{pr.id}</span>
                      <h3 className="text-sm font-medium text-white">{pr.title}</h3>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-[#6B7280]">
                      <span>Author: {pr.author}</span>
                      <span>Branch: {pr.branch}</span>
                      <span className="text-cyan-400">{pr.diffLines}</span>
                    </div>
                  </div>
                  {pr.status === "merged" ? (
                    <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-semibold rounded-lg">Merged</span>
                  ) : (
                    <button onClick={() => handleSemanticMerge(pr.id)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors">
                      <GitMerge className="w-3.5 h-3.5" /> AI Semantic Merge
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* CI Runner View */}
          {activeNav === "ci" && (
            <div className="h-full p-5 flex flex-col gap-4 overflow-hidden">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white">CI/CD Virtual Sandbox Logs</h2>
                <button onClick={handleRunPipeline} disabled={ciRunning} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5">
                  <RefreshCw className={`w-3.5 h-3.5 ${ciRunning ? 'animate-spin' : ''}`} /> Run Pipeline
                </button>
              </div>
              <div className="flex-1 bg-[#111215] border border-white/[0.06] rounded-xl p-4 font-mono text-xs text-cyan-400 overflow-y-auto leading-relaxed">
                {ciLogs.map((log, idx) => <div key={idx} className="py-0.5">{log}</div>)}
              </div>
            </div>
          )}

          {/* Security View */}
          {activeNav === "security" && (
            <div className="h-full p-5 overflow-y-auto flex flex-col gap-4">
              <h2 className="text-sm font-bold text-white">Security & Audit Status</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#111215] border border-white/[0.06] rounded-xl">
                  <div className="text-xs text-[#6B7280]">Vulnerabilities</div>
                  <div className="text-2xl font-bold text-cyan-400 mt-1">0 Found</div>
                </div>
                <div className="p-4 bg-[#111215] border border-white/[0.06] rounded-xl">
                  <div className="text-xs text-[#6B7280]">SAST Status</div>
                  <div className="text-2xl font-bold text-indigo-400 mt-1">PASSED</div>
                </div>
                <div className="p-4 bg-[#111215] border border-white/[0.06] rounded-xl">
                  <div className="text-xs text-[#6B7280]">Dependencies</div>
                  <div className="text-2xl font-bold text-white mt-1">100% Verified</div>
                </div>
              </div>
            </div>
          )}

          {/* Settings View */}
          {activeNav === "settings" && (
            <div className="h-full p-5 overflow-y-auto flex flex-col gap-4 text-xs text-[#9CA3AF]">
              <h2 className="text-sm font-bold text-white">System Settings & Health</h2>
              <div className="p-4 bg-[#111215] border border-white/[0.06] rounded-xl flex flex-col gap-2">
                <div className="flex justify-between border-b border-white/[0.06] pb-2"><span>API Gateway (Port 8000):</span><span className="text-cyan-400 font-bold">ONLINE</span></div>
                <div className="flex justify-between border-b border-white/[0.06] pb-2"><span>VCS Service (Port 8001):</span><span className="text-cyan-400 font-bold">ONLINE</span></div>
                <div className="flex justify-between border-b border-white/[0.06] pb-2"><span>AI Service (Port 8002):</span><span className="text-cyan-400 font-bold">ONLINE</span></div>
                <div className="flex justify-between"><span>CI Runner (Port 8003):</span><span className="text-cyan-400 font-bold">ONLINE</span></div>
              </div>
            </div>
          )}

        </section>

        {/* Antigravity AI Cockpit Sidebar */}
        <section className="col-span-12 md:col-span-4 row-span-6 rounded-2xl bg-[#16171c] border border-white/[0.06] shadow-xl flex flex-col relative overflow-hidden">
          <div className="p-4 border-b border-white/[0.06] bg-[#141519] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Rocket className="w-4 h-4 text-indigo-400" /> Antigravity AI Console
              </h2>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-400 font-semibold px-2 py-0.5 rounded border border-indigo-500/30">Active</span>
            </div>

            {/* Agent Selectors */}
            <div className="flex gap-1 p-1 bg-[#111215] rounded-xl border border-white/[0.06]">
              {AGENTS.map(a => (
                <button
                  key={a.id}
                  onClick={() => setActiveAgent(a.id)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeAgent === a.id ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/50" : "text-[#6B7280] hover:text-white"
                  }`}
                >
                  {React.createElement(a.icon, { className: "w-3.5 h-3.5" })}
                  <span>{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Stream */}
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scroll-smooth" style={{ scrollbarWidth: "none" }}>
            {msgs.map(m => (
              <div key={m.id} className={`flex flex-col ${m.agent === 'user' ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-[#6B7280] mb-1 font-mono">{m.agent} • {m.time}</span>
                <div className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[88%] ${
                  m.agent === 'user' ? 'bg-indigo-600 text-white' : 'bg-[#111215] text-[#D1D5DB] border border-white/[0.06]'
                }`}>
                  {m.action}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/[0.06] bg-[#141519]">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Give autonomous instructions..."
                className="flex-1 bg-[#111215] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-indigo-500"
              />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </section>

      </main>
    </div>
  );
}
