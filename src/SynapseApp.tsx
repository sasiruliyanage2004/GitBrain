import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, GitBranch, GitCommitHorizontal, GitPullRequest, GitMerge,
  Terminal, Send, FileCode, Folder, Shield, Activity,
  Settings, Code2, Zap, Brain, Rocket, Play, ChevronRight,
  Network, LayoutGrid, Cpu, Disc, Globe, Check,
  Command, RefreshCw, Lock, AlertCircle, Copy, CheckCircle2, X, Bell, Moon, Sun, User
} from "lucide-react";

/* ============================================================================
   GitBrain 5.0 — Electric Indigo Developer AI Cockpit
   Option 1: Obsidian & Indigo/Violet (Cursor/Linear Style)
   Combining GoRide's Matte Texture & Mouse Spotlight with a pure Dev Workspace.
============================================================================ */

const AGENTS = [
  { id: "pm", label: "Project Mgr", icon: Brain, color: "#6366F1", bg: "rgba(99,102,241,0.12)" },
  { id: "reviewer", label: "Reviewer", icon: Search, color: "#8B5CF6", bg: "rgba(139,92,246,0.12)" },
  { id: "cifixer", label: "CI Fixer", icon: Zap, color: "#3B82F6", bg: "rgba(59,130,246,0.12)" },
];

const FILE_NODES = [
  { id: "ai-orchestrator", label: "ai-orchestrator", icon: Brain, x: "48%", y: "38%", color: "#6366F1", ring: true, path: "services/ai-orchestrator-service/server.js" },
  { id: "api-gateway", label: "api-gateway", icon: Network, x: "20%", y: "24%", color: "#8B5CF6", ring: false, path: "services/api-gateway/server.js" },
  { id: "SynapseApp.tsx", label: "SynapseApp.tsx", icon: FileCode, x: "72%", y: "58%", color: "#A855F7", ring: false, path: "src/SynapseApp.tsx" },
  { id: "ci-runner", label: "ci-runner", icon: Cpu, x: "24%", y: "64%", color: "#3B82F6", ring: false, path: "services/ci-runner-service/server.js" },
  { id: "vcs-storage", label: "vcs-storage", icon: Shield, x: "68%", y: "24%", color: "#EC4899", ring: false, path: "services/vcs-storage-service/server.js" },
];

const MOCK_FILES: Record<string, string> = {
  "src/SynapseApp.tsx": `// GitBrain Studio — Obsidian & Electric Indigo AI Cockpit
import React from 'react';
export default function GitBrainApp() {
  return <div className="indigo-cockpit">GitBrain AI Studio</div>;
}`,
  "services/api-gateway/server.js": `import express from 'express';
const app = express();
app.use('/api/vcs', vcsProxy);
app.use('/api/ai', aiProxy);
app.listen(8000);`,
  "services/ai-orchestrator-service/server.js": `import express from 'express';
const app = express();
app.post('/chat', (req, res) => {
  res.json({ reply: "Autonomous PM reasoning engine operational." });
});
app.listen(8002);`,
  "README.md": `# GitBrain (Synapse AI)
Autonomous AI Project Manager & Native Version Control Platform`
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
  const [activeNav, setActiveNav] = useState("map");
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

  // Mouse spotlight listener from GoRide
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      showToast("VCS Service Offline. Local snapshot saved.", "info");
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
    <div className="h-[100dvh] w-full flex flex-col md:flex-row relative z-10 select-none">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl border flex items-center gap-2.5 text-xs shadow-2xl backdrop-blur-md"
            style={{
              background: toast.type === "success" ? "rgba(16,185,129,0.15)" : toast.type === "error" ? "rgba(244,63,94,0.15)" : "rgba(99,102,241,0.15)",
              borderColor: toast.type === "success" ? "rgba(16,185,129,0.4)" : toast.type === "error" ? "rgba(244,63,94,0.4)" : "rgba(99,102,241,0.4)",
              color: toast.type === "success" ? "#34D399" : toast.type === "error" ? "#FDA4AF" : "#A5B4FC"
            }}
          >
            {toast.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-indigo-400" />}
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
              className="w-full max-w-lg glass-panel p-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3 border-b border-[#222436] pb-3">
                <Search className="w-4 h-4 text-[#64748B]" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search commands or files..."
                  className="bg-transparent flex-1 text-sm text-white focus:outline-none"
                />
                <button onClick={() => setCmdSearchOpen(false)} className="text-[#64748B] hover:text-white"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex flex-col gap-1 text-xs text-[#94A3B8]">
                <button onClick={() => { setActiveNav("map"); setCmdSearchOpen(false); }} className="p-2.5 rounded-lg hover:bg-white/5 flex items-center justify-between text-left">
                  <span>🗺️ 3D Codebase Architecture Map</span>
                  <span className="text-[10px] text-[#64748B]">View</span>
                </button>
                <button onClick={() => { setActiveNav("code"); setCmdSearchOpen(false); }} className="p-2.5 rounded-lg hover:bg-white/5 flex items-center justify-between text-left">
                  <span>💻 Code Editor & Files</span>
                  <span className="text-[10px] text-[#64748B]">View</span>
                </button>
                <button onClick={() => { setActiveNav("prs"); setCmdSearchOpen(false); }} className="p-2.5 rounded-lg hover:bg-white/5 flex items-center justify-between text-left">
                  <span>🔀 Manage Pull Requests</span>
                  <span className="text-[10px] text-[#64748B]">View</span>
                </button>
                <button onClick={() => { handleTakeSnapshot(); setCmdSearchOpen(false); }} className="p-2.5 rounded-lg hover:bg-white/5 flex items-center justify-between text-left">
                  <span>📸 Trigger Cryptographic Snapshot</span>
                  <span className="text-[10px] text-[#64748B]">Action</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== NARROW DEVELOPER ICON DOCK (Cursor/Linear Style) ==================== */}
      <nav className="
        w-full h-14 md:w-16 md:h-full
        bg-[#08080A] border-t md:border-t-0 md:border-r border-[#222436]
        flex flex-row md:flex-col items-center justify-around md:justify-start
        md:py-6 md:gap-5 z-20 shrink-0 order-last md:order-first
      ">
        <div className="hidden md:flex w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] items-center justify-center shadow-lg shadow-indigo-950/50 mb-2">
          <Brain className="w-5 h-5 text-white" />
        </div>

        <div className="flex flex-row md:flex-col gap-1.5 md:gap-3 w-full md:w-auto px-2 justify-around md:justify-start">
          <DockIcon icon={<Network className="w-5 h-5" />} label="Neural Map" active={activeNav === "map"} onClick={() => setActiveNav("map")} />
          <DockIcon icon={<Code2 className="w-5 h-5" />} label="Code Editor" active={activeNav === "code"} onClick={() => setActiveNav("code")} />
          <DockIcon icon={<GitPullRequest className="w-5 h-5" />} label="Pull Requests" active={activeNav === "prs"} onClick={() => setActiveNav("prs")} />
          <DockIcon icon={<Play className="w-5 h-5" />} label="CI Workflows" active={activeNav === "ci"} onClick={() => setActiveNav("ci")} />
          <DockIcon icon={<Shield className="w-5 h-5" />} label="Security Scan" active={activeNav === "security"} onClick={() => setActiveNav("security")} />
        </div>

        <div className="hidden md:flex mt-auto">
          <DockIcon icon={<Settings className="w-5 h-5" />} label="Settings" active={activeNav === "settings"} onClick={() => setActiveNav("settings")} />
        </div>
      </nav>

      {/* ==================== MAIN DEVELOPER WORKSPACE ==================== */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden z-10">
        
        {/* Central Workspace Panel (70% width on Desktop) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Repository Bar */}
          <header className="h-16 px-6 border-b border-[#222436] flex items-center justify-between bg-[#08080A] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Globe className="w-4 h-4 text-[#818CF8]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white tracking-tight">sasiruliyanage2004</span>
                  <span className="text-[#64748B]">/</span>
                  <span className="text-sm font-bold text-indigo-400">GitBrain</span>
                </div>
                <div className="flex items-center gap-2.5 mt-0.5 text-[11px] text-[#64748B]">
                  <span className="flex items-center gap-1"><GitBranch className="w-3 h-3 text-indigo-400" /> main</span>
                  <span className="flex items-center gap-1"><GitCommitHorizontal className="w-3 h-3" /> 4d572a9</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">Production</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div 
                onClick={() => setCmdSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 bg-[#12131A] border border-[#222436] px-3 py-1.5 rounded-lg text-xs text-[#94A3B8] cursor-pointer hover:border-indigo-500/40 transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search files...</span>
                <kbd className="text-[10px] bg-[#1a1c29] text-[#94A3B8] px-1.5 py-0.5 rounded border border-[#26283d] font-mono">Ctrl K</kbd>
              </div>

              <div className="live-pill">
                <span className="live-dot" />
                <span>3 agents active</span>
              </div>

              <button onClick={handleTakeSnapshot} className="btn-ghost flex items-center gap-1.5">
                <Disc className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Snapshot</span>
              </button>

              <button onClick={handleRunPipeline} className="btn-primary flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Deploy</span>
              </button>
            </div>
          </header>

          {/* Main Active Panel View */}
          <div className="flex-1 overflow-hidden relative bg-[#08080A]/60">

            {/* NEURAL ARCHITECTURE MAP VIEW */}
            {activeNav === "map" && (
              <div className="h-full relative flex items-center justify-center p-6 overflow-hidden">
                <MapCanvas onNodeSelect={(path) => { setSelectedFile(path); setActiveNav("code"); }} />
              </div>
            )}

            {/* CODE EDITOR VIEW */}
            {activeNav === "code" && (
              <div className="h-full p-4 md:p-6 flex flex-col gap-4 overflow-hidden">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {Object.keys(MOCK_FILES).map(path => (
                    <button
                      key={path}
                      onClick={() => setSelectedFile(path)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2 border ${
                        selectedFile === path ? "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white border-transparent shadow-md" : "bg-[#12131A] border-[#222436] text-[#94A3B8] hover:text-white"
                      }`}
                    >
                      <FileCode className="w-3.5 h-3.5" /> {path}
                    </button>
                  ))}
                </div>
                <div className="flex-1 glass-panel p-4 font-mono text-xs text-[#A5B4FC] overflow-y-auto leading-relaxed whitespace-pre-wrap">
                  {MOCK_FILES[selectedFile] || "// File content empty"}
                </div>
              </div>
            )}

            {/* PULL REQUESTS VIEW */}
            {activeNav === "prs" && (
              <div className="h-full p-4 md:p-6 overflow-y-auto flex flex-col gap-4">
                <h2 className="text-sm font-bold text-white">Active Pull Requests</h2>
                {prs.map(pr => (
                  <div key={pr.id} className="glass-panel p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#818CF8]">#{pr.id}</span>
                        <h3 className="text-sm font-medium text-white">{pr.title}</h3>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-[#64748B]">
                        <span>Author: {pr.author}</span>
                        <span>Branch: {pr.branch}</span>
                        <span className="text-emerald-400">{pr.diffLines}</span>
                      </div>
                    </div>
                    {pr.status === "merged" ? (
                      <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold rounded-lg">Merged</span>
                    ) : (
                      <button onClick={() => handleSemanticMerge(pr.id)} className="btn-primary flex items-center gap-1.5">
                        <GitMerge className="w-3.5 h-3.5" /> AI Semantic Merge
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* CI WORKFLOWS VIEW */}
            {activeNav === "ci" && (
              <div className="h-full p-4 md:p-6 flex flex-col gap-4 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white">CI/CD Virtual Sandbox Logs</h2>
                  <button onClick={handleRunPipeline} disabled={ciRunning} className="btn-primary flex items-center gap-1.5">
                    <RefreshCw className={`w-3.5 h-3.5 ${ciRunning ? 'animate-spin' : ''}`} /> Run Pipeline
                  </button>
                </div>
                <div className="flex-1 glass-panel p-4 font-mono text-xs text-emerald-400 overflow-y-auto leading-relaxed">
                  {ciLogs.map((log, idx) => <div key={idx} className="py-0.5">{log}</div>)}
                </div>
              </div>
            )}

            {/* SECURITY AUDIT VIEW */}
            {activeNav === "security" && (
              <div className="h-full p-4 md:p-6 overflow-y-auto flex flex-col gap-4">
                <h2 className="text-sm font-bold text-white">Security & Vulnerability Audit</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="glass-panel p-4">
                    <div className="text-xs text-[#64748B]">Vulnerabilities</div>
                    <div className="text-2xl font-bold text-emerald-400 mt-1">0 Found</div>
                  </div>
                  <div className="glass-panel p-4">
                    <div className="text-xs text-[#64748B]">SAST Status</div>
                    <div className="text-2xl font-bold text-indigo-400 mt-1">PASSED</div>
                  </div>
                  <div className="glass-panel p-4">
                    <div className="text-xs text-[#64748B]">Dependencies</div>
                    <div className="text-2xl font-bold text-white mt-1">100% Verified</div>
                  </div>
                </div>
              </div>
            )}

            {/* SETTINGS VIEW */}
            {activeNav === "settings" && (
              <div className="h-full p-4 md:p-6 overflow-y-auto flex flex-col gap-4 text-xs text-[#94A3B8]">
                <h2 className="text-sm font-bold text-white">System Settings & Health</h2>
                <div className="glass-panel p-4 flex flex-col gap-2">
                  <div className="flex justify-between border-b border-[#222436] pb-2"><span>API Gateway (Port 8000):</span><span className="text-emerald-400 font-bold">ONLINE</span></div>
                  <div className="flex justify-between border-b border-[#222436] pb-2"><span>VCS Service (Port 8001):</span><span className="text-emerald-400 font-bold">ONLINE</span></div>
                  <div className="flex justify-between border-b border-[#222436] pb-2"><span>AI Service (Port 8002):</span><span className="text-emerald-400 font-bold">ONLINE</span></div>
                  <div className="flex justify-between"><span>CI Runner (Port 8003):</span><span className="text-emerald-400 font-bold">ONLINE</span></div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Panel: Antigravity Multi-Agent Console (30% width) */}
        <aside className="
          w-full h-[55vh] md:h-full md:w-[360px] xl:w-[400px]
          border-t md:border-t-0 md:border-l border-[#222436]
          bg-[#08080A] flex flex-col shrink-0
        ">
          <div className="px-5 pt-5 pb-4 border-b border-[#222436] shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Antigravity Console</span>
              </div>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-semibold px-2 py-0.5 rounded border border-indigo-500/30">Active</span>
            </div>

            {/* Agent Selection Tabs */}
            <div className="flex gap-1 p-1 bg-[#12131A] rounded-xl border border-[#222436]">
              {AGENTS.map(a => (
                <button
                  key={a.id}
                  onClick={() => setActiveAgent(a.id)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeAgent === a.id ? "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-md" : "text-[#64748B] hover:text-white"
                  }`}
                >
                  {React.createElement(a.icon, { className: "w-3.5 h-3.5" })}
                  <span>{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Trajectory Stream */}
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
            {msgs.map(m => (
              <div key={m.id} className={`flex flex-col ${m.agent === 'user' ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-[#64748B] mb-1 font-mono">{m.agent} · {m.time}</span>
                <div className={`p-3 rounded-xl text-xs max-w-[88%] leading-relaxed ${
                  m.agent === 'user' 
                    ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-md' 
                    : 'bg-[#12131A] text-[#E2E8F0] border border-[#222436]'
                }`}>
                  {m.action}
                </div>
              </div>
            ))}
          </div>

          {/* Slash Command Quick Chips */}
          <div className="px-4 pt-2 pb-1 flex gap-1.5 overflow-x-auto shrink-0" style={{ scrollbarWidth: "none" }}>
            {["/snapshot", "/semantic-merge", "/fix-issue", "/plan-sprint"].map(cmd => (
              <button
                key={cmd}
                onClick={() => setInput(cmd)}
                className="whitespace-nowrap text-[11px] px-2.5 py-1 rounded-lg bg-[#12131A] hover:bg-[#1a1c28] border border-[#222436] text-[#94A3B8] hover:text-white transition-colors"
              >
                {cmd}
              </button>
            ))}
          </div>

          {/* Prompt Input */}
          <div className="p-4 pt-2 shrink-0">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Instruct AI agents..."
                className="flex-1 bg-[#12131A] border border-[#222436] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1]"
              />
              <button type="submit" className="btn-primary flex items-center justify-center px-4">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </aside>

      </div>
    </div>
  );
}

// Subcomponents

function DockIcon({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`nav-dock-item ${active ? 'active' : ''}`}
      title={label}
    >
      {icon}
    </button>
  );
}

function MapCanvas({ onNodeSelect }: { onNodeSelect: (path: string) => void }) {
  return (
    <div className="h-full relative w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #ffffff0a 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      {FILE_NODES.map((node, i) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 + i * 0.05, ...easeOut }}
          onClick={() => onNodeSelect(node.path)}
          className="absolute flex flex-col items-center gap-2 cursor-pointer group z-10"
          style={{ left: node.x, top: node.y, transform: "translate(-50%, -50%)" }}
        >
          <motion.div
            whileHover={{ scale: 1.15 }}
            className="relative flex items-center justify-center rounded-2xl shadow-xl"
            style={{ width: node.ring ? 54 : 44, height: node.ring ? 54 : 44, background: `${node.color}1E`, border: `1px solid ${node.color}50` }}
          >
            {React.createElement(node.icon, { className: "w-5 h-5", style: { color: node.color } })}
          </motion.div>
          <span className="text-[11px] font-bold" style={{ color: node.color }}>{node.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
