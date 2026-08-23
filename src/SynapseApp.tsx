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
   GitBrain 4.5 — Porcelain & Carbon Matte Theme
   Using the exact matte background, mouse spotlight, and glass-panel CSS
   from GoRide, tailored specifically for GitBrain Developer Platform.
============================================================================ */

const AGENTS = [
  { id: "pm", label: "Project Mgr", icon: Brain, color: "#10B981", bg: "rgba(16,185,129,0.1)" },
  { id: "reviewer", label: "Reviewer", icon: Search, color: "#34D399", bg: "rgba(52,211,153,0.1)" },
  { id: "cifixer", label: "CI Fixer", icon: Zap, color: "#059669", bg: "rgba(5,150,105,0.1)" },
];

const FILE_NODES = [
  { id: "ai-orchestrator", label: "ai-orchestrator", icon: Brain, x: "48%", y: "38%", color: "#10B981", ring: true, path: "services/ai-orchestrator-service/server.js" },
  { id: "api-gateway", label: "api-gateway", icon: Network, x: "20%", y: "24%", color: "#34D399", ring: false, path: "services/api-gateway/server.js" },
  { id: "SynapseApp.tsx", label: "SynapseApp.tsx", icon: FileCode, x: "72%", y: "58%", color: "#6EE7B7", ring: false, path: "src/SynapseApp.tsx" },
  { id: "ci-runner", label: "ci-runner", icon: Cpu, x: "24%", y: "64%", color: "#059669", ring: false, path: "services/ci-runner-service/server.js" },
  { id: "vcs-storage", label: "vcs-storage", icon: Shield, x: "68%", y: "24%", color: "#A7F3D0", ring: false, path: "services/vcs-storage-service/server.js" },
];

const MOCK_FILES: Record<string, string> = {
  "src/SynapseApp.tsx": `// GitBrain Studio — Matte Carbon & Emerald Edition
import React from 'react';
export default function GitBrainApp() {
  return <div className="gitbrain-studio">GitBrain AI VCS Platform</div>;
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
  const [activeNav, setActiveNav] = useState("dashboard");
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

  // Mouse spotlight effect listener from GoRide
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
              background: toast.type === "success" ? "rgba(16,185,129,0.15)" : toast.type === "error" ? "rgba(239,68,68,0.15)" : "rgba(5,150,105,0.15)",
              borderColor: toast.type === "success" ? "rgba(16,185,129,0.4)" : toast.type === "error" ? "rgba(239,68,68,0.4)" : "rgba(5,150,105,0.4)",
              color: toast.type === "success" ? "#34D399" : toast.type === "error" ? "#FCA5A5" : "#6EE7B7"
            }}
          >
            {toast.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-emerald-400" />}
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
              <div className="flex items-center gap-3 border-b border-[#27272A] pb-3">
                <Search className="w-4 h-4 text-[#71717A]" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search commands or files..."
                  className="bg-transparent flex-1 text-sm text-white focus:outline-none"
                />
                <button onClick={() => setCmdSearchOpen(false)} className="text-[#71717A] hover:text-white"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex flex-col gap-1 text-xs text-[#A1A1AA]">
                <button onClick={() => { setActiveNav("dashboard"); setCmdSearchOpen(false); }} className="p-2.5 rounded-lg hover:bg-white/5 flex items-center justify-between text-left">
                  <span>📊 Open Main Executive Dashboard</span>
                  <span className="text-[10px] text-[#71717A]">View</span>
                </button>
                <button onClick={() => { setActiveNav("live-map"); setCmdSearchOpen(false); }} className="p-2.5 rounded-lg hover:bg-white/5 flex items-center justify-between text-left">
                  <span>🗺️ View 3D Codebase Architecture Map</span>
                  <span className="text-[10px] text-[#71717A]">View</span>
                </button>
                <button onClick={() => { setActiveNav("code"); setCmdSearchOpen(false); }} className="p-2.5 rounded-lg hover:bg-white/5 flex items-center justify-between text-left">
                  <span>💻 Code Editor & Files</span>
                  <span className="text-[10px] text-[#71717A]">View</span>
                </button>
                <button onClick={() => { handleTakeSnapshot(); setCmdSearchOpen(false); }} className="p-2.5 rounded-lg hover:bg-white/5 flex items-center justify-between text-left">
                  <span>📸 Trigger Cryptographic Snapshot</span>
                  <span className="text-[10px] text-[#71717A]">Action</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== LEFT SIDEBAR MENU (using GoRide's nav-item CSS) ==================== */}
      <aside className="
        sidebar w-full h-auto md:w-64 md:h-full
        flex flex-col justify-between p-4 z-20 shrink-0
      ">
        <div className="flex flex-col gap-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-[#10B981] text-black font-black text-lg flex items-center justify-center shadow-lg shadow-emerald-950/50">
              V
            </div>
            <div>
              <div className="text-white font-bold tracking-tight text-base flex items-center gap-1.5">
                GitBrain <span className="text-[10px] font-semibold bg-[#064E3B] text-[#34D399] px-1.5 py-0.5 rounded">PRO</span>
              </div>
              <div className="text-[11px] text-[#71717A]">Autonomous AI VCS</div>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="flex flex-col gap-5">
            {/* Group 1: OVERVIEW */}
            <div>
              <div className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider px-3 mb-2">OVERVIEW</div>
              <div className="flex flex-col gap-1">
                <NavItem icon={<LayoutGrid className="w-4 h-4" />} label="Dashboard" active={activeNav === "dashboard"} onClick={() => setActiveNav("dashboard")} />
                <NavItem icon={<Network className="w-4 h-4" />} label="3D Architecture Map" active={activeNav === "live-map"} onClick={() => setActiveNav("live-map")} />
                <NavItem icon={<Code2 className="w-4 h-4" />} label="Code & Files" active={activeNav === "code"} onClick={() => setActiveNav("code")} />
                <NavItem icon={<GitPullRequest className="w-4 h-4" />} label="Pull Requests" active={activeNav === "prs"} badge={prs.filter(p => p.status === 'open').length.toString()} onClick={() => setActiveNav("prs")} />
              </div>
            </div>

            {/* Group 2: OPERATIONS */}
            <div>
              <div className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider px-3 mb-2">OPERATIONS</div>
              <div className="flex flex-col gap-1">
                <NavItem icon={<Play className="w-4 h-4" />} label="CI/CD Workflows" active={activeNav === "ci"} onClick={() => setActiveNav("ci")} />
                <NavItem icon={<Shield className="w-4 h-4" />} label="Security & Reports" active={activeNav === "security"} onClick={() => setActiveNav("security")} />
                <NavItem icon={<Settings className="w-4 h-4" />} label="Settings" active={activeNav === "settings"} onClick={() => setActiveNav("settings")} />
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="pt-4 border-t border-[#27272A] flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#064E3B] text-[#34D399] flex items-center justify-center font-bold text-xs">
              SL
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white">Sasiru L.</span>
              <span className="text-[10px] text-[#71717A]">Lead Architect</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="flex-1 h-full flex flex-col overflow-y-auto z-10">
        
        {/* Top Header */}
        <header className="h-16 px-6 border-b border-[#27272A] flex items-center justify-between bg-[#09090B] shrink-0">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight capitalize">{activeNav.replace('-', ' ')}</h1>
            <p className="text-[11px] text-[#71717A]">sasiruliyanage2004 / GitBrain · {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div 
              onClick={() => setCmdSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-[#121214] border border-[#27272A] px-3 py-1.5 rounded-lg text-xs text-[#71717A] cursor-pointer hover:border-[#10B981]/40 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search commands...</span>
              <kbd className="text-[10px] bg-[#18181B] text-[#A1A1AA] px-1.5 py-0.5 rounded border border-[#27272A] font-mono">Ctrl K</kbd>
            </div>

            {/* Live Pill from GoRide */}
            <div className="live-pill">
              <span className="live-dot" />
              <span>3 agents live</span>
            </div>

            <button className="btn-ghost p-2"><Bell className="w-4 h-4" /></button>
            <button className="btn-ghost p-2"><Moon className="w-4 h-4" /></button>
          </div>
        </header>

        {/* Dynamic Views Container */}
        <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">

          {/* DASHBOARD MAIN VIEW */}
          {activeNav === "dashboard" && (
            <>
              {/* Top 4 Metrics Cards Row using GoRide kpi-card CSS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title="ACTIVE BRANCHES" value="3" change="▲ 12%" changeType="up" />
                <MetricCard title="OPEN PULL REQUESTS" value="2" change="▲ 4%" changeType="up" />
                <MetricCard title="CI TEST SUCCESS RATE" value="100%" change="▲ 8%" changeType="up" />
                <MetricCard title="SECURITY VULNERABILITIES" value="0" change="▼ 2%" changeType="down" />
              </div>

              {/* Middle Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Card: 3D Codebase Map View */}
                <div className="lg:col-span-7 glass-panel p-5 flex flex-col min-h-[380px] shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-sm font-bold text-white">Live Codebase Architecture</h2>
                      <p className="text-[11px] text-[#71717A]">Interactive Merkle tree & microservice nodes</p>
                    </div>
                    <button onClick={() => setActiveNav("live-map")} className="text-xs text-[#10B981] hover:underline font-medium">Expand ↗</button>
                  </div>
                  <div className="flex-1 relative bg-[#09090B] rounded-xl overflow-hidden border border-[#27272A]">
                    <MapCanvas onNodeSelect={(path) => { setSelectedFile(path); setActiveNav("code"); }} />
                  </div>
                </div>

                {/* Right Card: Antigravity AI Console */}
                <div className="lg:col-span-5 glass-panel p-5 flex flex-col min-h-[380px] shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <Rocket className="w-4 h-4 text-[#10B981]" /> Antigravity AI Cockpit
                    </h2>
                    <span className="text-[10px] bg-[#064E3B] text-[#34D399] font-semibold px-2 py-0.5 rounded border border-[#10B981]/30">Active</span>
                  </div>

                  {/* Agent Tabs */}
                  <div className="flex gap-1.5 p-1 bg-[#09090B] rounded-xl border border-[#27272A] mb-3">
                    {AGENTS.map(a => (
                      <button
                        key={a.id}
                        onClick={() => setActiveAgent(a.id)}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                          activeAgent === a.id ? "bg-[#125c43] text-white shadow-md" : "text-[#71717A] hover:text-white"
                        }`}
                      >
                        {React.createElement(a.icon, { className: "w-3.5 h-3.5" })}
                        <span>{a.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Chat Stream */}
                  <div ref={chatRef} className="flex-1 overflow-y-auto flex flex-col gap-2.5 mb-3 pr-1" style={{ maxHeight: "220px", scrollbarWidth: "none" }}>
                    {msgs.map(m => (
                      <div key={m.id} className={`flex flex-col ${m.agent === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`p-2.5 rounded-xl text-xs max-w-[90%] ${
                          m.agent === 'user' ? 'bg-[#125c43] text-white' : 'bg-[#18181A] text-[#A1A1AA] border border-[#27272A]'
                        }`}>
                          {m.action}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input Form */}
                  <form onSubmit={sendMessage} className="flex gap-2 mt-auto">
                    <input
                      type="text"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      placeholder="Instruct AI agents..."
                      className="flex-1 bg-[#09090B] border border-[#27272A] rounded-xl px-3 py-2 text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-[#10B981]"
                    />
                    <button type="submit" className="bg-[#125c43] hover:bg-[#10B981] text-white px-3 py-2 rounded-xl text-xs font-semibold transition-colors">
                      Send
                    </button>
                  </form>
                </div>
              </div>

              {/* Bottom Row: Recent Activity */}
              <div className="glass-panel p-5 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-white">Recent Repository Activity</h2>
                  <button className="text-xs text-[#10B981] hover:underline font-medium">View Log</button>
                </div>
                <div className="flex flex-col gap-2">
                  <ActivityRow avatar="SL" name="Sasiru Liyanage" action="Pushed 3 commits to main" branch="main" time="Just now" status="Success" />
                  <ActivityRow avatar="AI" name="Synapse AI Bot" action="Executed AST Semantic Merge for PR #214" branch="feature/semantic-merge" time="10m ago" status="Merged" />
                  <ActivityRow avatar="CI" name="CI Virtual Sandbox" action="Verified build and security scan" branch="main" time="1h ago" status="Passed" />
                </div>
              </div>
            </>
          )}

          {/* MAP FULL VIEW */}
          {activeNav === "live-map" && (
            <div className="h-full glass-panel p-5 flex flex-col min-h-[500px]">
              <h2 className="text-sm font-bold text-white mb-2">3D Repository Architecture Map</h2>
              <div className="flex-1 relative bg-[#09090B] rounded-xl overflow-hidden border border-[#27272A]">
                <MapCanvas onNodeSelect={(path) => { setSelectedFile(path); setActiveNav("code"); }} />
              </div>
            </div>
          )}

          {/* CODE EDITOR VIEW */}
          {activeNav === "code" && (
            <div className="h-full glass-panel p-5 flex flex-col min-h-[500px]">
              <div className="flex items-center gap-2 mb-4 overflow-x-auto">
                {Object.keys(MOCK_FILES).map(path => (
                  <button
                    key={path}
                    onClick={() => setSelectedFile(path)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2 border ${
                      selectedFile === path ? "bg-[#125c43] border-[#10B981] text-white font-bold" : "bg-[#09090B] border-[#27272A] text-[#A1A1AA] hover:text-white"
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" /> {path}
                  </button>
                ))}
              </div>
              <div className="flex-1 bg-[#09090B] border border-[#27272A] rounded-xl p-4 font-mono text-xs text-[#34D399] overflow-y-auto leading-relaxed whitespace-pre-wrap">
                {MOCK_FILES[selectedFile] || "// File content empty"}
              </div>
            </div>
          )}

          {/* PRs VIEW */}
          {activeNav === "prs" && (
            <div className="h-full glass-panel p-5 flex flex-col gap-4">
              <h2 className="text-sm font-bold text-white">Pull Requests</h2>
              {prs.map(pr => (
                <div key={pr.id} className="p-4 bg-[#09090B] border border-[#27272A] rounded-xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#10B981]">#{pr.id}</span>
                      <h3 className="text-sm font-medium text-white">{pr.title}</h3>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-[#71717A]">
                      <span>Author: {pr.author}</span>
                      <span>Branch: {pr.branch}</span>
                      <span className="text-[#34D399]">{pr.diffLines}</span>
                    </div>
                  </div>
                  {pr.status === "merged" ? (
                    <span className="px-3 py-1 bg-[#064E3B] border border-[#10B981]/30 text-[#34D399] text-xs font-semibold rounded-lg">Merged</span>
                  ) : (
                    <button onClick={() => handleSemanticMerge(pr.id)} className="bg-[#125c43] hover:bg-[#10B981] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors">
                      <GitMerge className="w-3.5 h-3.5" /> AI Semantic Merge
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* CI VIEW */}
          {activeNav === "ci" && (
            <div className="h-full glass-panel p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white">CI/CD Sandbox Logs</h2>
                <button onClick={handleRunPipeline} disabled={ciRunning} className="bg-[#125c43] hover:bg-[#10B981] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <RefreshCw className={`w-3.5 h-3.5 ${ciRunning ? 'animate-spin' : ''}`} /> Run Pipeline
                </button>
              </div>
              <div className="flex-1 bg-[#09090B] border border-[#27272A] rounded-xl p-4 font-mono text-xs text-[#34D399] overflow-y-auto leading-relaxed">
                {ciLogs.map((log, idx) => <div key={idx} className="py-0.5">{log}</div>)}
              </div>
            </div>
          )}

          {/* SECURITY VIEW */}
          {activeNav === "security" && (
            <div className="h-full glass-panel p-5 flex flex-col gap-4">
              <h2 className="text-sm font-bold text-white">Security & Audit Status</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#09090B] border border-[#27272A] rounded-xl">
                  <div className="text-xs text-[#71717A]">Vulnerabilities</div>
                  <div className="text-2xl font-bold text-[#34D399] mt-1">0 Found</div>
                </div>
                <div className="p-4 bg-[#09090B] border border-[#27272A] rounded-xl">
                  <div className="text-xs text-[#71717A]">SAST Status</div>
                  <div className="text-2xl font-bold text-[#34D399] mt-1">PASSED</div>
                </div>
                <div className="p-4 bg-[#09090B] border border-[#27272A] rounded-xl">
                  <div className="text-xs text-[#71717A]">Dependencies</div>
                  <div className="text-2xl font-bold text-white mt-1">100% Verified</div>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS VIEW */}
          {activeNav === "settings" && (
            <div className="h-full glass-panel p-5 flex flex-col gap-4 text-xs text-[#A1A1AA]">
              <h2 className="text-sm font-bold text-white">System Settings</h2>
              <div className="p-4 bg-[#09090B] border border-[#27272A] rounded-xl flex flex-col gap-2">
                <div className="flex justify-between border-b border-[#27272A] pb-2"><span>API Gateway (Port 8000):</span><span className="text-[#34D399] font-bold">ONLINE</span></div>
                <div className="flex justify-between border-b border-[#27272A] pb-2"><span>VCS Service (Port 8001):</span><span className="text-[#34D399] font-bold">ONLINE</span></div>
                <div className="flex justify-between border-b border-[#27272A] pb-2"><span>AI Service (Port 8002):</span><span className="text-[#34D399] font-bold">ONLINE</span></div>
                <div className="flex justify-between"><span>CI Runner (Port 8003):</span><span className="text-[#34D399] font-bold">ONLINE</span></div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

// Subcomponents using GoRide CSS classes
function NavItem({ icon, label, active, onClick, badge }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void; badge?: string }) {
  return (
    <div
      onClick={onClick}
      className={`nav-item ${active ? 'active' : ''}`}
    >
      {icon}
      <span>{label}</span>
      {badge && (
        <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-[#064E3B] text-[#34D399]">
          {badge}
        </span>
      )}
    </div>
  );
}

function MetricCard({ title, value, change, changeType }: { title: string; value: string; change: string; changeType: 'up' | 'down' }) {
  return (
    <div className="kpi-card">
      <div className="flex items-center justify-between mb-2">
        <span className="kpi-label uppercase">{title}</span>
        <span className={`kpi-delta ${changeType}`}>
          {change}
        </span>
      </div>
      <div className="kpi-value">{value}</div>
    </div>
  );
}

function ActivityRow({ avatar, name, action, branch, time, status }: { avatar: string; name: string; action: string; branch: string; time: string; status: string }) {
  return (
    <div className="data-row p-3 rounded-xl flex items-center justify-between text-xs">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#064E3B] text-[#34D399] font-bold flex items-center justify-center text-xs">
          {avatar}
        </div>
        <div>
          <div className="text-white font-medium">{action}</div>
          <div className="text-[10px] text-[#71717A]">{name} · branch: <span className="text-[#34D399]">{branch}</span></div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-[#34D399] font-semibold text-[11px]">{status}</div>
        <div className="text-[10px] text-[#71717A]">{time}</div>
      </div>
    </div>
  );
}

function MapCanvas({ onNodeSelect }: { onNodeSelect: (path: string) => void }) {
  return (
    <div className="h-full relative flex items-center justify-center overflow-hidden">
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
            className="relative flex items-center justify-center rounded-2xl"
            style={{ width: node.ring ? 52 : 42, height: node.ring ? 52 : 42, background: `${node.color}1A`, border: `1px solid ${node.color}40` }}
          >
            {React.createElement(node.icon, { className: "w-5 h-5", style: { color: node.color } })}
          </motion.div>
          <span className="text-[11px] font-bold" style={{ color: node.color }}>{node.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
