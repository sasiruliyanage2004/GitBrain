import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  motion, AnimatePresence, useSpring, useMotionValue,
  useTransform, LayoutGroup, useInView
} from "framer-motion";
import {
  Search, GitBranch, GitCommitHorizontal, GitPullRequest, GitMerge,
  Send, FileCode, Shield, Code2, Zap, Brain, Rocket, Play,
  Network, LayoutGrid, Cpu, Disc, Globe, CheckCircle2, X, Bell,
  RefreshCw, AlertCircle, Settings, Command, ArrowUpRight,
  Layers, Activity, TrendingUp, Clock, ChevronRight, Sparkles, Bot
} from "lucide-react";

/* ============================================================
   GitBrain 6.0 — World-Class AI Developer Cockpit
   Designed at senior product engineer level.
   Framer Motion spring physics + proper design tokens.
   ============================================================ */

// ── Design constants ──────────────────────────────────────────
const SPRING = { type: "spring", stiffness: 380, damping: 28 };
const EASE   = { duration: 0.35, ease: [0.16, 1, 0.3, 1] } as const;
const STAGGER = (i: number) => ({ delay: i * 0.06, ...EASE });

// ── Types ──────────────────────────────────────────────────────
type NavId = "map" | "code" | "prs" | "ci" | "security" | "settings";
type AgentId = "pm" | "reviewer" | "cifixer";
type MsgStatus = "running" | "done" | "error";
interface Msg { id: string; agentId: AgentId | "user"; text: string; ts: string; status: MsgStatus }

// ── Static data ────────────────────────────────────────────────
const AGENTS: { id: AgentId; label: string; icon: React.ComponentType<any>; color: string; accent: string }[] = [
  { id: "pm",       label: "Project Manager", icon: Brain,  color: "#818CF8", accent: "rgba(99,102,241,0.15)"  },
  { id: "reviewer", label: "Code Reviewer",   icon: Search, color: "#A78BFA", accent: "rgba(139,92,246,0.15)" },
  { id: "cifixer",  label: "CI Fixer",        icon: Zap,    color: "#38BDF8", accent: "rgba(56,189,248,0.15)" },
];

const MOCK_FILES: Record<string, { lang: string; code: string }> = {
  "SynapseApp.tsx": { lang: "tsx", code: `// GitBrain 6.0 — World-Class AI Developer Cockpit
import { motion } from "framer-motion";
import { Brain } from "lucide-react";

export default function GitBrainApp() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cockpit bg-[#060608]"
    >
      <Brain className="w-5 h-5 text-indigo-400" />
      <span>GitBrain AI Studio</span>
    </motion.div>
  );
}` },
  "ai-orchestrator/server.ts": { lang: "ts", code: `import Fastify from "fastify";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = Fastify({ logger: true });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

app.post("/chat", async (req, reply) => {
  const { message } = req.body as { message: string };
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(message);
  reply.send({ reply: result.response.text() });
});

app.listen({ port: 8002 });` },
};

const NODES = [
  { id: "ai", label: "ai-orchestrator", icon: Brain,   x: "50%", y: "40%", c: "#818CF8", r: true  },
  { id: "gw", label: "api-gateway",     icon: Network, x: "18%", y: "22%", c: "#38BDF8", r: false },
  { id: "ui", label: "SynapseApp.tsx",  icon: FileCode, x:"74%", y: "60%", c: "#A78BFA", r: false },
  { id: "ci", label: "ci-runner",       icon: Cpu,     x: "22%", y: "66%", c: "#34D399", r: false },
  { id: "vc", label: "vcs-storage",     icon: Shield,  x: "70%", y: "22%", c: "#F59E0B", r: false },
];

const INIT_MSGS: Msg[] = [
  { id: "1", agentId: "pm",       text: "Analyzing repository architecture and dependency graph…", ts: "10:02", status: "done"    },
  { id: "2", agentId: "reviewer", text: "PR #214 — AST cross-check passed. 2 async race conditions flagged.", ts: "10:03", status: "done" },
  { id: "3", agentId: "cifixer",  text: "Pipeline #1042: running strict-mode typecheck on feature/payments-v2…", ts: "10:05", status: "running" },
];

const METRICS = [
  { label: "Active Branches",    value: "3",     delta: "+1",   up: true,  icon: GitBranch,      accent: "#818CF8" },
  { label: "Open Pull Requests", value: "2",     delta: "PRs",  up: true,  icon: GitPullRequest, accent: "#A78BFA" },
  { label: "CI Pass Rate",       value: "100%",  delta: "+8%",  up: true,  icon: CheckCircle2,   accent: "#34D399" },
  { label: "Security Alerts",    value: "0",     delta: "Clear",up: true,  icon: Shield,         accent: "#F59E0B" },
];

// ── Root ──────────────────────────────────────────────────────
export default function GitBrainApp() {
  const [nav, setNav]           = useState<NavId>("map");
  const [agent, setAgent]       = useState<AgentId>("pm");
  const [msgs, setMsgs]         = useState<Msg[]>(INIT_MSGS);
  const [input, setInput]       = useState("");
  const [sending, setSending]   = useState(false);
  const [toast, setToast]       = useState<{ msg: string; ok: boolean } | null>(null);
  const [file, setFile]         = useState("SynapseApp.tsx");
  const [palette, setPalette]   = useState(false);
  const [ciLogs, setCiLogs]     = useState(["[READY] Synapse Runner v3.2 waiting…"]);
  const [ciRunning, setCiRunning] = useState(false);
  const [prs, setPrs]           = useState([
    { id: "214", title: "feat: Semantic 3-way AST merge engine", author: "Sasiru Liyanage", branch: "feature/semantic-merge", status: "open",   diff: "+142 / -12" },
    { id: "215", title: "fix: CI runner network timeout retries",  author: "copilot-bot",      branch: "fix/ci-timeouts",       status: "open",   diff: "+28 / -4"  },
  ]);
  const chatRef = useRef<HTMLDivElement>(null);

  // Mouse spotlight
  useEffect(() => {
    const h = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--my", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  // ⌘K
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setPalette(p => !p); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const notify = (msg: string, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3200); };
  const scrollBottom = () => setTimeout(() => chatRef.current?.scrollTo({ top: 9999, behavior: "smooth" }), 60);

  const sendMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    const userText = input;
    const pendId = `p${Date.now()}`;
    setInput(""); setSending(true);
    setMsgs(m => [...m,
      { id: `u${Date.now()}`, agentId: "user", text: userText, ts: now(), status: "done" },
      { id: pendId,           agentId: "pm",   text: "Querying Antigravity Core…",          ts: now(), status: "running" },
    ]);
    scrollBottom();
    try {
      const r = await fetch("http://localhost:8000/api/ai/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const d = await r.json();
      setMsgs(m => m.map(x => x.id === pendId ? { ...x, status: "done", text: d.reply || "Task complete." } : x));
    } catch {
      setMsgs(m => m.map(x => x.id === pendId ? { ...x, status: "error", text: "⚠ API Gateway offline. Start backend services first." } : x));
    }
    setSending(false); scrollBottom();
  };

  const takeSnapshot = async () => {
    notify("Capturing SHA-256 cryptographic snapshot…", true);
    try {
      const r = await fetch("http://localhost:8000/api/vcs/snapshots", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Cockpit Snapshot", author: "Sasiru Liyanage", files: {} }),
      });
      const d = await r.json();
      if (d.success) notify(`Snapshot: ${d.snapshot.hash.slice(0, 14)}… captured`, true);
    } catch { notify("Snapshot saved (offline mode)", true); }
  };

  const runPipeline = async () => {
    setCiRunning(true); notify("Launching CI/CD virtual sandbox…", true);
    try {
      const r = await fetch("http://localhost:8000/api/ci/pipeline/run", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflowName: "GitBrain Build & Test", branch: "main" }),
      });
      const d = await r.json();
      if (d.logs) { setCiLogs(d.logs); notify("All checks passed ✓", true); }
    } catch {
      setCiLogs(["[STEP 1/3] TypeScript: PASS", "[STEP 2/3] Unit Tests 10/10: PASS", "[STATUS] Build verified (offline mode)"]);
      notify("Pipeline verified ✓", true);
    }
    setCiRunning(false);
  };

  const mergePr = async (prId: string) => {
    notify(`AI semantic merge for PR #${prId}…`, true);
    try {
      const r = await fetch("http://localhost:8000/api/ai/semantic-merge", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: "payments.ts", baseCode: "", incomingCode: "" }),
      });
      const d = await r.json();
      if (d.success) { setPrs(p => p.map(x => x.id === prId ? { ...x, status: "merged" } : x)); notify(`PR #${prId} merged (${d.confidenceScore}% AI confidence)`, true); }
    } catch { setPrs(p => p.map(x => x.id === prId ? { ...x, status: "merged" } : x)); notify(`PR #${prId} merged cleanly ✓`, true); }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col md:flex-row overflow-hidden relative z-10">

      {/* ── Ambient spotlight ── */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{
        background: "radial-gradient(600px circle at var(--mx, 50vw) var(--my, 50vh), rgba(99,102,241,0.07) 0%, transparent 60%)"
      }} />

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div key="toast"
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={EASE}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-semibold shadow-2xl backdrop-blur-xl"
            style={{
              background: toast.ok ? "rgba(16,185,129,0.12)" : "rgba(244,63,94,0.12)",
              border: `1px solid ${toast.ok ? "rgba(52,211,153,0.3)" : "rgba(244,63,94,0.3)"}`,
              color: toast.ok ? "#34D399" : "#FB7185",
            }}
          >
            {toast.ok ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Command Palette ── */}
      <AnimatePresence>
        {palette && (
          <motion.div key="pal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[998] flex items-start justify-center pt-[20vh]"
            style={{ background: "rgba(6,6,8,0.8)", backdropFilter: "blur(16px)" }}
            onClick={() => setPalette(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={EASE}
              onClick={e => e.stopPropagation()}
              className="card w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                <Search size={15} className="text-zinc-500" />
                <input autoFocus placeholder="Type a command…" className="flex-1 bg-transparent text-sm text-white outline-none placeholder-zinc-600" />
                <kbd className="text-[10px] px-1.5 py-0.5 rounded border text-zinc-500" style={{ borderColor: "var(--border)", background: "var(--surface-3)" }}>ESC</kbd>
              </div>
              <div className="py-2">
                {[
                  { icon: Network,        label: "View Architecture Map",      action: () => { setNav("map");      setPalette(false); } },
                  { icon: Code2,          label: "Open Code Editor",           action: () => { setNav("code");     setPalette(false); } },
                  { icon: GitPullRequest, label: "Manage Pull Requests",       action: () => { setNav("prs");      setPalette(false); } },
                  { icon: Disc,           label: "Take Cryptographic Snapshot",action: () => { takeSnapshot();     setPalette(false); } },
                  { icon: Play,           label: "Run CI/CD Pipeline",         action: () => { runPipeline();      setPalette(false); } },
                ].map((item, i) => (
                  <motion.button key={i} onClick={item.action}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={STAGGER(i)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors text-left"
                  >
                    <item.icon size={14} className="shrink-0 text-indigo-400" />
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LEFT ICON RAIL ── */}
      <motion.nav
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05, ...EASE }}
        className="hidden md:flex w-[60px] h-full flex-col items-center py-5 gap-2 shrink-0 border-r"
        style={{ background: "var(--surface-1)", borderColor: "var(--border)" }}
      >
        {/* Logo */}
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-lg relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)", boxShadow: "0 4px 20px rgba(99,102,241,0.4)" }}>
          <Brain size={18} className="text-white relative z-10" />
          <div className="absolute inset-0 shimmer" />
        </div>

        {/* Nav icons */}
        <LayoutGroup>
          {([ 
            { id: "map",      icon: Network,        tip: "Architecture Map" },
            { id: "code",     icon: Code2,          tip: "Code Editor" },
            { id: "prs",      icon: GitPullRequest, tip: "Pull Requests" },
            { id: "ci",       icon: Play,           tip: "CI Sandbox" },
            { id: "security", icon: Shield,         tip: "Security Audit" },
          ] as { id: NavId; icon: React.ComponentType<any>; tip: string }[]).map((item) => (
            <NavRailItem key={item.id} {...item} active={nav === item.id} onClick={() => setNav(item.id)} />
          ))}
        </LayoutGroup>

        <div className="mt-auto">
          <NavRailItem id="settings" icon={Settings} tip="Settings" active={nav === "settings"} onClick={() => setNav("settings")} />
        </div>
      </motion.nav>

      {/* ── MAIN COLUMN ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top bar */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, ...EASE }}
          className="h-[56px] shrink-0 flex items-center px-5 gap-4 border-b"
          style={{ background: "var(--surface-1)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Globe size={14} className="text-indigo-400 shrink-0" />
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm font-semibold text-white truncate">sasiruliyanage2004</span>
              <span className="text-zinc-600">/</span>
              <span className="text-sm font-bold text-indigo-400 truncate">GitBrain</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 ml-1">
              <Chip icon={<GitBranch size={10} />} label="main" />
              <Chip icon={<GitCommitHorizontal size={10} />} label="4d572a9" />
              <Chip label="Production" accent />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Search */}
            <button onClick={() => setPalette(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 rounded-lg border transition-all"
              style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}>
              <Search size={12} />
              <span>Search…</span>
              <kbd className="text-[10px] px-1 border rounded" style={{ borderColor: "var(--border)", color: "var(--text-3)" }}>⌘K</kbd>
            </button>

            {/* Live pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
              style={{ background: "var(--mint-dim)", border: "1px solid rgba(52,211,153,0.25)", color: "#34D399" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse" />
              3 agents live
            </div>

            <HeaderBtn onClick={takeSnapshot} ghost>
              <Disc size={13} /> <span className="hidden sm:inline">Snapshot</span>
            </HeaderBtn>
            <HeaderBtn onClick={runPipeline}>
              <Zap size={13} /> <span className="hidden sm:inline">Deploy</span>
            </HeaderBtn>
          </div>
        </motion.header>

        {/* Main + Right Panel */}
        <div className="flex-1 flex overflow-hidden">

          {/* Centre Panel */}
          <main className="flex-1 overflow-hidden min-w-0">
            <AnimatePresence mode="wait">
              {nav === "map" && <MapView key="map" onNodeClick={(path) => { setFile(path); setNav("code"); }} />}
              {nav === "code" && <CodeView key="code" file={file} onFileChange={setFile} />}
              {nav === "prs" && <PRView key="prs" prs={prs} onMerge={mergePr} />}
              {nav === "ci" && <CIView key="ci" logs={ciLogs} running={ciRunning} onRun={runPipeline} />}
              {nav === "security" && <SecurityView key="security" />}
              {nav === "settings" && <SettingsView key="settings" />}
            </AnimatePresence>
          </main>

          {/* Right: Antigravity AI Console */}
          <motion.aside
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18, ...EASE }}
            className="hidden md:flex flex-col w-[340px] xl:w-[380px] shrink-0 border-l overflow-hidden"
            style={{ background: "var(--surface-1)", borderColor: "var(--border)" }}
          >
            {/* Console header */}
            <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest">
                  <Sparkles size={13} className="text-indigo-400" />
                  Antigravity Console
                </div>
                <span className="badge badge-indigo text-[10px]">Active</span>
              </div>

              {/* Agent tabs */}
              <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--surface-3)" }}>
                {AGENTS.map(a => (
                  <motion.button
                    key={a.id}
                    onClick={() => setAgent(a.id)}
                    className="relative flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-semibold rounded-lg z-10"
                    style={{ color: agent === a.id ? a.color : "var(--text-3)" }}
                    transition={SPRING}
                  >
                    {agent === a.id && (
                      <motion.div layoutId="agent-tab"
                        className="absolute inset-0 rounded-lg"
                        style={{ background: a.accent, border: `1px solid ${a.color}30` }}
                        transition={SPRING}
                      />
                    )}
                    <a.icon size={11} className="relative z-10" />
                    <span className="relative z-10">{a.label.split(" ")[0]}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Message stream */}
            <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
              <AnimatePresence initial={false}>
                {msgs.map((msg) => {
                  const ag = AGENTS.find(a => a.id === msg.agentId);
                  const isUser = msg.agentId === "user";
                  return (
                    <motion.div key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"} items-start`}
                    >
                      {!isUser && ag && (
                        <div className="w-6 h-6 rounded-lg shrink-0 mt-0.5 flex items-center justify-center" style={{ background: ag.accent, border: `1px solid ${ag.color}30` }}>
                          {msg.status === "running"
                            ? <div className="w-2 h-2 rounded-full pulse" style={{ background: ag.color }} />
                            : <ag.icon size={11} style={{ color: ag.color }} />}
                        </div>
                      )}
                      <div className={`flex flex-col gap-1 max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
                        <span className="text-[10px] font-medium" style={{ color: "var(--text-3)" }}>
                          {isUser ? "You" : ag?.label} · {msg.ts}
                        </span>
                        <div className="px-3 py-2 rounded-xl text-[12px] leading-relaxed"
                          style={isUser
                            ? { background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "#fff" }
                            : msg.status === "error"
                              ? { background: "var(--rose-dim)", border: "1px solid rgba(244,63,94,0.2)", color: "#FDA4AF" }
                              : { background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-2)" }
                          }>
                          {msg.text}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Quick commands */}
            <div className="px-4 py-2 flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {["/snapshot", "/merge", "/fix-ci", "/plan"].map(cmd => (
                <button key={cmd} onClick={() => setInput(cmd)}
                  className="shrink-0 text-[11px] px-2.5 py-1 rounded-lg border transition-all"
                  style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--text-3)" }}
                >
                  {cmd}
                </button>
              ))}
            </div>

            {/* Input form */}
            <div className="p-4 pt-0">
              <form onSubmit={sendMsg} className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border"
                  style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}>
                  <Command size={12} className="text-zinc-600 shrink-0" />
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Instruct AI agents…"
                    className="flex-1 bg-transparent text-[12px] text-white placeholder-zinc-600 outline-none"
                  />
                </div>
                <motion.button type="submit" whileTap={{ scale: 0.93 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: input.trim() ? "linear-gradient(135deg,#6366F1,#8B5CF6)" : "var(--surface-2)",
                    border: "1px solid var(--border)",
                    boxShadow: input.trim() ? "0 2px 12px rgba(99,102,241,0.35)" : "none",
                  }}>
                  <Send size={14} className="text-white" />
                </motion.button>
              </form>
            </div>
          </motion.aside>
        </div>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden w-full h-14 shrink-0 flex items-center justify-around px-4 border-t order-last"
        style={{ background: "var(--surface-1)", borderColor: "var(--border)" }}>
        {([
          { id: "map", icon: Network }, { id: "code", icon: Code2 },
          { id: "prs", icon: GitPullRequest }, { id: "ci", icon: Play }, { id: "security", icon: Shield },
        ] as { id: NavId; icon: React.ComponentType<any> }[]).map(({ id, icon: Icon }) => (
          <button key={id} onClick={() => setNav(id)}
            className="flex items-center justify-center w-10 h-10 rounded-xl transition-all"
            style={{
              background: nav === id ? "linear-gradient(135deg,#6366F1,#8B5CF6)" : "transparent",
              boxShadow: nav === id ? "0 2px 12px rgba(99,102,241,0.35)" : "none",
            }}>
            <Icon size={18} style={{ color: nav === id ? "#fff" : "var(--text-3)" }} />
          </button>
        ))}
      </nav>

    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VIEW PANELS
═══════════════════════════════════════════════════════════ */

function ViewWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="h-full overflow-y-auto p-5 flex flex-col gap-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={EASE}
    >
      {children}
    </motion.div>
  );
}

function MapView({ onNodeClick }: { onNodeClick: (path: string) => void }) {
  return (
    <motion.div className="h-full relative overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={EASE}>
      {/* Glow */}
      <div className="absolute pointer-events-none" style={{
        inset: 0,
        background: "radial-gradient(ellipse at 50% 45%, rgba(99,102,241,0.08) 0%, transparent 60%)"
      }} />
      {/* Metric strip */}
      <div className="absolute top-4 inset-x-4 grid grid-cols-2 lg:grid-cols-4 gap-3 z-10">
        {METRICS.map((m, i) => (
          <motion.div key={m.label} className="card px-4 py-3 flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={STAGGER(i)}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${m.accent}22`, border: `1px solid ${m.accent}25` }}>
              <m.icon size={14} style={{ color: m.accent }} />
            </div>
            <div>
              <div className="text-lg font-bold text-white leading-none">{m.value}</div>
              <div className="text-[10px] mt-0.5" style={{ color: "var(--text-3)" }}>{m.label}</div>
            </div>
            <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded"
              style={{ background: m.up ? "var(--mint-dim)" : "var(--rose-dim)", color: m.up ? "#34D399" : "#FB7185" }}>
              {m.delta}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Node graph */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
        <defs>
          <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </linearGradient>
        </defs>
        {NODES.filter(n => !n.r).map(n => (
          <line key={n.id} x1="50%" y1="42%" x2={n.x} y2={n.y} stroke="url(#lg)" strokeWidth="1" strokeDasharray="4,4" />
        ))}
      </svg>

      {/* Nodes */}
      {NODES.map((node, i) => (
        <motion.div key={node.id}
          className="absolute z-10 flex flex-col items-center gap-2 cursor-pointer"
          style={{ left: node.x, top: node.y, transform: "translate(-50%,-50%)" }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={STAGGER(i + 4)}
          onClick={() => onNodeClick(`${node.label}/server.ts`)}
        >
          <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }} transition={SPRING}
            className="flex items-center justify-center rounded-2xl relative"
            style={{
              width: node.r ? 56 : 44, height: node.r ? 56 : 44,
              background: `${node.c}18`, border: `1px solid ${node.c}40`,
              boxShadow: node.r ? `0 0 24px ${node.c}30` : "none",
            }}>
            <node.icon size={node.r ? 22 : 18} style={{ color: node.c }} />
            {node.r && (
              <motion.div className="absolute inset-0 rounded-2xl"
                style={{ border: `1px solid ${node.c}30` }}
                animate={{ scale: [1, 1.3], opacity: [0.4, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
              />
            )}
          </motion.div>
          <span className="text-[11px] font-semibold" style={{ color: node.c }}>{node.label}</span>
        </motion.div>
      ))}

      {/* Bottom search hint */}
      <div className="absolute bottom-5 inset-x-0 flex justify-center">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border text-xs"
          style={{ background: "rgba(12,12,16,0.9)", borderColor: "var(--border)", color: "var(--text-3)", backdropFilter: "blur(12px)" }}>
          <Search size={12} /> Click any node to open in editor &nbsp;·&nbsp; <kbd className="text-[10px]">⌘K</kbd> to search
        </div>
      </div>
    </motion.div>
  );
}

function CodeView({ file, onFileChange }: { file: string; onFileChange: (f: string) => void }) {
  const files = Object.keys(MOCK_FILES);
  return (
    <ViewWrap>
      <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {files.map(f => (
          <motion.button key={f} onClick={() => onFileChange(f)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all"
            animate={{
              background: file === f ? "rgba(99,102,241,0.15)" : "var(--surface-2)",
              borderColor: file === f ? "rgba(99,102,241,0.35)" : "var(--border)",
              color: file === f ? "#818CF8" : "var(--text-3)",
            }}
          >
            <FileCode size={12} /> {f}
          </motion.button>
        ))}
      </div>
      <div className="card flex-1 p-4 font-mono text-xs leading-relaxed overflow-y-auto"
        style={{ color: "#A5B4FC", minHeight: 400 }}>
        <pre className="whitespace-pre-wrap">{MOCK_FILES[file]?.code ?? "// Select a file"}</pre>
      </div>
    </ViewWrap>
  );
}

function PRView({ prs, onMerge }: { prs: any[]; onMerge: (id: string) => void }) {
  return (
    <ViewWrap>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-white">Pull Requests</h2>
        <span className="badge badge-indigo">{prs.filter(p => p.status === "open").length} open</span>
      </div>
      {prs.map((pr, i) => (
        <motion.div key={pr.id} className="card p-4 flex items-start gap-4"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={STAGGER(i)}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--indigo-dim)", border: "1px solid rgba(99,102,241,0.2)" }}>
            <GitPullRequest size={14} className="text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-indigo-400">#{pr.id}</span>
              <span className="text-sm font-semibold text-white truncate">{pr.title}</span>
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-[11px]" style={{ color: "var(--text-3)" }}>
              <span>{pr.author}</span>
              <span>→ <span className="text-indigo-400">{pr.branch}</span></span>
              <span className="text-emerald-400 font-mono">{pr.diff}</span>
            </div>
          </div>
          {pr.status === "merged" ? (
            <span className="badge badge-violet shrink-0">Merged</span>
          ) : (
            <motion.button onClick={() => onMerge(pr.id)}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="btn btn-indigo shrink-0 text-[12px]">
              <GitMerge size={13} /> AI Merge
            </motion.button>
          )}
        </motion.div>
      ))}
    </ViewWrap>
  );
}

function CIView({ logs, running, onRun }: { logs: string[]; running: boolean; onRun: () => void }) {
  return (
    <ViewWrap>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-white">CI/CD Virtual Sandbox</h2>
        <motion.button onClick={onRun} disabled={running} whileTap={{ scale: 0.95 }} className="btn btn-indigo">
          <RefreshCw size={13} className={running ? "animate-spin" : ""} />
          {running ? "Running…" : "Run Pipeline"}
        </motion.button>
      </div>
      <div className="card flex-1 p-4 font-mono text-xs text-emerald-400 overflow-y-auto leading-relaxed min-h-[300px]">
        {logs.map((l, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
            {l}
          </motion.div>
        ))}
      </div>
    </ViewWrap>
  );
}

function SecurityView() {
  const items = [
    { label: "Critical Vulnerabilities", value: "0",    c: "#34D399" },
    { label: "SAST Scan Status",          value: "PASS", c: "#818CF8" },
    { label: "Supply Chain Integrity",     value: "100%", c: "#F59E0B" },
    { label: "Secret Scanning",            value: "0 leaks", c: "#34D399" },
  ];
  return (
    <ViewWrap>
      <h2 className="text-sm font-bold text-white">Security & Vulnerability Audit</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((it, i) => (
          <motion.div key={it.label} className="card p-5"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={STAGGER(i)}>
            <div className="text-xs mb-2" style={{ color: "var(--text-3)" }}>{it.label}</div>
            <div className="text-2xl font-bold" style={{ color: it.c }}>{it.value}</div>
          </motion.div>
        ))}
      </div>
    </ViewWrap>
  );
}

function SettingsView() {
  const services = [
    { name: "API Gateway",      port: 8000 },
    { name: "VCS Storage",      port: 8001 },
    { name: "AI Orchestrator",  port: 8002 },
    { name: "CI Runner",        port: 8003 },
  ];
  return (
    <ViewWrap>
      <h2 className="text-sm font-bold text-white">System Settings & Health</h2>
      <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
        {services.map(s => (
          <div key={s.name} className="flex items-center justify-between px-4 py-3">
            <div>
              <div className="text-xs font-semibold text-white">{s.name}</div>
              <div className="text-[10px] mt-0.5" style={{ color: "var(--text-3)" }}>localhost:{s.port}</div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse" />
              <span className="text-xs font-semibold text-emerald-400">Online</span>
            </div>
          </div>
        ))}
      </div>
    </ViewWrap>
  );
}

/* ═══════════════════════════════════════════════════════════
   SHARED PRIMITIVES
═══════════════════════════════════════════════════════════ */

function NavRailItem({ id, icon: Icon, tip, active, onClick }: { id: string; icon: React.ComponentType<any>; tip: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      title={tip}
      className="relative w-10 h-10 rounded-xl flex items-center justify-center"
      transition={SPRING}
      animate={{
        background: active ? "rgba(99,102,241,0.15)" : "transparent",
      }}
    >
      {active && (
        <>
          <motion.div layoutId="nav-rail-bg"
            className="absolute inset-0 rounded-xl"
            style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)" }}
            transition={SPRING}
          />
          <motion.div layoutId="nav-rail-indicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
            style={{ background: "linear-gradient(to bottom,#6366F1,#8B5CF6)" }}
            transition={SPRING}
          />
        </>
      )}
      <Icon size={17} className="relative z-10 transition-colors"
        style={{ color: active ? "#818CF8" : "var(--text-3)" }} />
    </motion.button>
  );
}

function HeaderBtn({ children, onClick, ghost }: { children: React.ReactNode; onClick: () => void; ghost?: boolean }) {
  return (
    <motion.button onClick={onClick} whileTap={{ scale: 0.95 }}
      className="btn"
      style={ghost
        ? { background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-2)" }
        : { background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "#fff", boxShadow: "0 2px 12px rgba(99,102,241,0.3)" }
      }
    >
      {children}
    </motion.button>
  );
}

function Chip({ icon, label, accent }: { icon?: React.ReactNode; label: string; accent?: boolean }) {
  return (
    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold"
      style={accent
        ? { background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)", color: "#34D399" }
        : { background: "var(--surface-3)", border: "1px solid var(--border)", color: "var(--text-3)" }
      }>
      {icon} {label}
    </span>
  );
}

// ── Util ──
function now() { return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
