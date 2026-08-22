import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import {
  Search, GitBranch, GitCommitHorizontal, GitPullRequest, GitMerge,
  Terminal, Send, FileCode, Folder, Shield, Activity,
  Settings, Code2, Zap, Brain, Rocket, Play, ChevronRight,
  Network, LayoutGrid, Cpu, Disc, Globe, Plus, Check, X,
  ArrowUpRight, Circle, AlertTriangle, Layers, Command
} from "lucide-react";

/* ============================================================================
   GitBrain 3.0 — "Obsidian Cockpit"
   Premium AI Developer Platform UI
   Built with Framer Motion + Tailwind CSS
============================================================================ */

// --- Data ---
const AGENTS = [
  { id: "pm", label: "Project Mgr", icon: Brain, color: "#818CF8", bg: "rgba(129,140,248,0.08)" },
  { id: "reviewer", label: "Reviewer", icon: Search, color: "#34D399", bg: "rgba(52,211,153,0.08)" },
  { id: "cifixer", label: "CI Fixer", icon: Zap, color: "#F472B6", bg: "rgba(244,114,182,0.08)" },
];

const FILE_NODES = [
  { id: 1, label: "ai-orchestrator", icon: Brain, x: "48%", y: "38%", color: "#818CF8", ring: true },
  { id: 2, label: "api-gateway", icon: Network, x: "18%", y: "22%", color: "#34D399", ring: false },
  { id: 3, label: "SynapseApp.tsx", icon: FileCode, x: "72%", y: "58%", color: "#60A5FA", ring: false },
  { id: 4, label: "ci-runner", icon: Cpu, x: "22%", y: "64%", color: "#F472B6", ring: false },
  { id: 5, label: "vcs-storage", icon: Layers, x: "68%", y: "22%", color: "#FBBF24", ring: false },
];

const INIT_STREAM = [
  { id: "1", agent: "pm", time: "22:02", action: "Analyzing repository architecture and dependency graph...", status: "done" },
  { id: "2", agent: "reviewer", time: "22:03", action: "PR #214 — AST cross-check passed. Flagged 2 async race conditions.", status: "done" },
  { id: "3", agent: "cifixer", time: "22:05", action: "Pipeline run #1042 running typecheck on feature/payments-v2...", status: "running" },
];

type MsgStatus = "running" | "done" | "error";
interface Msg { id: string; agent: string; time: string; action: string; status: MsgStatus }

// --- Helpers ---
const springConfig = { type: "spring", stiffness: 400, damping: 30 };
const easeOut = { duration: 0.3, ease: [0.16, 1, 0.3, 1] };

function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============ Main App ============
export default function GitBrainApp() {
  const [activeNav, setActiveNav] = useState("map");
  const [activeAgent, setActiveAgent] = useState("pm");
  const [msgs, setMsgs] = useState<Msg[]>(INIT_STREAM);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

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
      { id: pendingId, agent: "pm", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), action: "Processing...", status: "running" }
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
      setMsgs(p => p.map(m => m.id === pendingId ? { ...m, status: "error", action: "⚠ API Gateway offline. Start backend services first." } : m));
    }
    setIsSending(false);
    scrollToBottom();
  };

  const quickSend = (text: string) => { setInput(text); };

  return (
    <div className="h-[100dvh] w-full bg-[#080808] text-[#A0A0A8] overflow-hidden flex flex-col md:flex-row relative select-none">
      {/* Noise texture overlay */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
      }} />

      {/* ========== SIDEBAR NAVIGATION ========== */}
      <nav className="
        w-full h-14 md:w-[68px] md:h-full
        bg-[#080808] border-t md:border-t-0 md:border-r border-white/[0.05]
        flex flex-row md:flex-col items-center
        justify-around md:justify-start
        md:pt-6 md:pb-5 md:gap-2
        z-20 shrink-0 relative
        order-last md:order-first
      ">
        {/* Logo - desktop only */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, ...easeOut }}
          className="hidden md:flex flex-col items-center mb-6"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>
            <Brain className="w-5 h-5 text-white" />
          </div>
        </motion.div>

        {/* Nav Icons */}
        <div className="flex flex-row md:flex-col gap-1 w-full md:w-auto px-3 md:px-2.5 justify-around md:justify-start">
          {[
            { id: "map", icon: Network, label: "Map" },
            { id: "code", icon: Code2, label: "Code" },
            { id: "prs", icon: GitPullRequest, label: "PRs" },
            { id: "ci", icon: Play, label: "CI" },
            { id: "security", icon: Shield, label: "Security" },
          ].map((item, i) => (
            <SidebarItem
              key={item.id}
              icon={<item.icon />}
              label={item.label}
              active={activeNav === item.id}
              onClick={() => setActiveNav(item.id)}
              delay={i * 0.05}
            />
          ))}
        </div>

        {/* Settings - desktop only */}
        <div className="hidden md:block mt-auto px-2.5">
          <SidebarItem icon={<Settings />} label="Settings" active={activeNav === "settings"} onClick={() => setActiveNav("settings")} delay={0} />
        </div>
      </nav>

      {/* ========== MAIN CONTENT ========== */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden z-10">
        {/* ---- Left Panel: Header + Map ---- */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header Bar */}
          <motion.header
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, ...easeOut }}
            className="h-16 px-5 md:px-6 border-b border-white/[0.05] flex items-center justify-between gap-4 bg-[#080808] shrink-0"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="hidden sm:flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(79,70,229,0.15)", border: "1px solid rgba(79,70,229,0.25)" }}>
                  <Globe className="w-3.5 h-3.5" style={{ color: "#818CF8" }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white/90 tracking-tight">Synapse AI</span>
                    <span className="text-[#404048]">/</span>
                    <span className="text-sm text-[#606068]">core-services</span>
                  </div>
                  <div className="flex items-center gap-2.5 mt-0.5">
                    <Tag label="main" icon={<GitBranch className="w-2.5 h-2.5" />} />
                    <Tag label="4d572a9" icon={<GitCommitHorizontal className="w-2.5 h-2.5" />} />
                    <Tag label="Production" color="green" />
                  </div>
                </div>
              </div>
              {/* Mobile: compact */}
              <div className="sm:hidden">
                <span className="text-sm font-semibold text-white/90">Synapse AI</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <Tag label="main" icon={<GitBranch className="w-2.5 h-2.5" />} />
                  <Tag label="Production" color="green" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <HeaderButton onClick={() => {}} variant="default">
                <Disc className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Snapshot</span>
              </HeaderButton>
              <HeaderButton onClick={() => {}} variant="primary">
                <Zap className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Deploy</span>
              </HeaderButton>
            </div>
          </motion.header>

          {/* Architecture Map (Desktop) / Stats (Mobile) */}
          <div className="flex-1 overflow-hidden">
            {/* Desktop Map */}
            <div className="hidden md:block h-full relative">
              <MapCanvas />
            </div>

            {/* Mobile Stats Cards */}
            <div className="md:hidden h-full overflow-y-auto p-4 flex flex-col gap-3">
              <StatsGrid />
              <RecentActivity />
            </div>
          </div>
        </div>

        {/* ---- Right Panel: AI Console ---- */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, ...easeOut }}
          className="
            w-full h-[55vh] md:h-full md:w-[360px] xl:w-[400px]
            border-t md:border-t-0 md:border-l border-white/[0.05]
            bg-[#080808] flex flex-col shrink-0
          "
        >
          {/* Console Header */}
          <div className="px-5 pt-5 pb-4 border-b border-white/[0.05] shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-semibold text-white/80 uppercase tracking-widest">Antigravity Console</span>
                </div>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-md" style={{ background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.12)" }}>
                <span className="text-[10px] text-indigo-400 font-semibold">3 agents active</span>
              </div>
            </div>

            {/* Agent Tabs */}
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }}>
              {AGENTS.map(a => (
                <AgentTab key={a.id} agent={a} active={activeAgent === a.id} onClick={() => setActiveAgent(a.id)} />
              ))}
            </div>
          </div>

          {/* Stream */}
          <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 scroll-smooth" style={{ scrollbarWidth: "none" }}>
            <AnimatePresence initial={false}>
              {msgs.map((msg, i) => (
                <MessageBubble key={msg.id} msg={msg} index={i} />
              ))}
            </AnimatePresence>
          </div>

          {/* Quick Commands */}
          <div className="px-4 pt-2 pb-1 flex gap-1.5 overflow-x-auto shrink-0" style={{ scrollbarWidth: "none" }}>
            {["/snapshot", "/semantic-merge", "/fix-issue", "/plan-sprint"].map(cmd => (
              <QuickCmd key={cmd} label={cmd} onClick={() => quickSend(cmd)} />
            ))}
          </div>

          {/* Input */}
          <div className="p-4 pt-2 shrink-0">
            <form onSubmit={sendMessage} className="flex items-center gap-2">
              <div className="flex-1 relative flex items-center" style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "12px",
              }}>
                <Command className="absolute left-3 w-3.5 h-3.5 text-[#404048] shrink-0" />
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Instruct the AI system..."
                  className="flex-1 bg-transparent py-2.5 pl-8 pr-3 text-[13px] text-white/80 placeholder-[#404048] focus:outline-none"
                />
              </div>
              <motion.button
                type="submit"
                disabled={!input.trim() || isSending}
                whileTap={{ scale: 0.93 }}
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                style={{
                  background: input.trim() ? "linear-gradient(135deg, #4F46E5, #7C3AED)" : "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </motion.button>
            </form>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}

// ============ Sub-components ============

function SidebarItem({ icon, label, active, onClick, delay }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void; delay: number }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, ...easeOut }}
      className="relative md:w-full flex items-center justify-center md:justify-start gap-3 px-2.5 md:px-3 py-2 md:py-2.5 rounded-xl transition-all group"
      style={{
        background: active ? "rgba(255,255,255,0.06)" : "transparent",
        border: active ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
      }}
      title={label}
    >
      {active && (
        <motion.div
          layoutId="nav-active"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full hidden md:block"
          style={{ background: "linear-gradient(to bottom, #4F46E5, #7C3AED)" }}
          transition={springConfig}
        />
      )}
      <span className={cn("transition-colors", active ? "text-white" : "text-[#606068] group-hover:text-[#A0A0A8]")}>
        {React.cloneElement(icon as React.ReactElement, { className: "w-[18px] h-[18px]" })}
      </span>
    </motion.button>
  );
}

function Tag({ label, icon, color }: { label: string; icon?: React.ReactNode; color?: string }) {
  const styles =
    color === "green"
      ? { background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.15)", color: "#34D399" }
      : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#606068" };

  return (
    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium" style={styles}>
      {icon} {label}
    </span>
  );
}

function HeaderButton({ children, onClick, variant }: { children: React.ReactNode; onClick: () => void; variant: "primary" | "default" }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors"
      style={variant === "primary"
        ? { background: "rgba(79,70,229,0.15)", border: "1px solid rgba(79,70,229,0.25)", color: "#818CF8" }
        : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#A0A0A8" }
      }
    >
      {children}
    </motion.button>
  );
}

function AgentTab({ agent, active, onClick }: { agent: typeof AGENTS[0]; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="flex-1 relative py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5"
      style={{ color: active ? agent.color : "#505058" }}
      whileTap={{ scale: 0.97 }}
    >
      {active && (
        <motion.div
          layoutId="agent-active"
          className="absolute inset-0 rounded-lg"
          style={{ background: agent.bg, border: `1px solid ${agent.color}22` }}
          transition={springConfig}
        />
      )}
      <span className="relative z-10 flex items-center gap-1.5">
        {React.createElement(agent.icon, { className: "w-3 h-3" })}
        {agent.label}
      </span>
    </motion.button>
  );
}

function MessageBubble({ msg, index }: { msg: Msg; index: number }) {
  const isUser = msg.agent === "user";
  const agentInfo = AGENTS.find(a => a.id === msg.agent);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"} items-start`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-6 h-6 rounded-lg shrink-0 mt-0.5 flex items-center justify-center relative" style={{ background: agentInfo?.bg || "rgba(255,255,255,0.05)", border: `1px solid ${agentInfo?.color || "#333"}22` }}>
          {agentInfo && React.createElement(agentInfo.icon, { className: "w-3 h-3", style: { color: agentInfo.color } })}
          {msg.status === "running" && (
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-[#080808]" style={{ background: agentInfo?.color }}>
              <span className="absolute inset-0 rounded-full animate-ping opacity-70" style={{ background: agentInfo?.color }} />
            </span>
          )}
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[82%] ${isUser ? "items-end" : "items-start"}`}>
        <span className="text-[10px] text-[#404048] font-medium tracking-wide">
          {isUser ? "You" : agentInfo?.label || msg.agent} · {msg.time}
        </span>
        <div
          className="px-3 py-2 rounded-xl text-[12.5px] leading-relaxed"
          style={isUser
            ? { background: "rgba(79,70,229,0.15)", border: "1px solid rgba(79,70,229,0.2)", color: "rgba(255,255,255,0.85)" }
            : msg.status === "error"
              ? { background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.15)", color: "#FCA5A5" }
              : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#C0C0C8" }
          }
        >
          {msg.status === "running" ? (
            <span className="flex items-center gap-2">
              <ThinkingDots /> {msg.action}
            </span>
          ) : msg.action}
        </div>
      </div>
    </motion.div>
  );
}

function ThinkingDots() {
  return (
    <span className="flex gap-1 items-center">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-1 h-1 rounded-full bg-indigo-400"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </span>
  );
}

function QuickCmd({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className="whitespace-nowrap text-[11px] px-2.5 py-1 rounded-lg shrink-0 transition-colors"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#505058" }}
    >
      {label}
    </motion.button>
  );
}

function MapCanvas() {
  return (
    <div className="h-full relative flex items-center justify-center overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "radial-gradient(circle, #ffffff0a 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />

      {/* Glow center */}
      <div className="absolute" style={{
        width: 400, height: 400,
        background: "radial-gradient(ellipse, rgba(79,70,229,0.06) 0%, transparent 70%)",
        left: "calc(50% - 200px)", top: "calc(50% - 200px)",
      }} />

      {/* Connection lines SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="line1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0" />
            <stop offset="50%" stopColor="#4F46E5" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="48%" y1="40%" x2="20%" y2="24%" stroke="url(#line1)" strokeWidth="1" />
        <line x1="48%" y1="40%" x2="70%" y2="58%" stroke="url(#line1)" strokeWidth="1" />
        <line x1="48%" y1="40%" x2="24%" y2="64%" stroke="url(#line1)" strokeWidth="1" />
        <line x1="48%" y1="40%" x2="68%" y2="24%" stroke="url(#line1)" strokeWidth="1" />
      </svg>

      {/* Nodes */}
      {FILE_NODES.map((node, i) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.07, ...easeOut }}
          className="absolute flex flex-col items-center gap-2 cursor-pointer group"
          style={{ left: node.x, top: node.y, transform: "translate(-50%, -50%)" }}
        >
          <motion.div
            whileHover={{ scale: 1.15 }}
            transition={springConfig}
            className="relative flex items-center justify-center rounded-2xl"
            style={{
              width: node.ring ? 56 : 44,
              height: node.ring ? 56 : 44,
              background: `${node.color}0F`,
              border: `1px solid ${node.color}${node.ring ? "30" : "18"}`,
              boxShadow: node.ring ? `0 0 20px ${node.color}20, 0 0 40px ${node.color}10` : "none",
            }}
          >
            {React.createElement(node.icon, { className: "w-5 h-5", style: { color: node.color, width: node.ring ? "22px" : "18px", height: node.ring ? "22px" : "18px" } })}
            {node.ring && (
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{ border: `1px solid ${node.color}25` }}
                animate={{ scale: [1, 1.25], opacity: [0.5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
              />
            )}
          </motion.div>
          <span className="text-[11px] font-medium" style={{ color: node.ring ? node.color : "#606068" }}>
            {node.label}
          </span>
        </motion.div>
      ))}

      {/* Search bar at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, ...easeOut }}
        className="absolute bottom-6 inset-x-0 flex justify-center px-6"
      >
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl" style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          maxWidth: 380, width: "100%",
        }}>
          <Search className="w-3.5 h-3.5 text-[#404048] shrink-0" />
          <span className="text-[12px] text-[#404048]">Search codebase, agents, or files...</span>
          <kbd className="ml-auto text-[10px] text-[#303038] px-1.5 py-0.5 rounded border border-[#303038] font-mono">⌘K</kbd>
        </div>
      </motion.div>
    </div>
  );
}

function StatsGrid() {
  const stats = [
    { label: "Active Branches", value: "3", icon: GitBranch, color: "#818CF8" },
    { label: "Open PRs", value: "2", icon: GitPullRequest, color: "#34D399" },
    { label: "CI Status", value: "Passing", icon: Check, color: "#34D399" },
    { label: "Security Alerts", value: "0", icon: Shield, color: "#F472B6" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.05, ...easeOut }}
          className="p-4 rounded-xl flex flex-col gap-2"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${s.color}12` }}>
            {React.createElement(s.icon, { className: "w-3.5 h-3.5", style: { color: s.color } })}
          </div>
          <div>
            <div className="text-lg font-bold text-white/90">{s.value}</div>
            <div className="text-[11px] text-[#505058]">{s.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function RecentActivity() {
  const items = [
    { label: "feat: Add AI semantic merge engine", time: "2m ago", status: "merged" },
    { label: "fix: Payment timeout handler", time: "18m ago", status: "review" },
    { label: "chore: Bump version to 3.0.0", time: "1h ago", status: "done" },
  ];
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="px-4 py-3 border-b border-white/[0.04]">
        <span className="text-[11px] font-semibold text-white/60 uppercase tracking-widest">Recent Activity</span>
      </div>
      {items.map((item, i) => (
        <div key={i} className="px-4 py-3 flex items-center justify-between gap-3 border-b border-white/[0.03] last:border-0">
          <span className="text-[12px] text-[#A0A0A8] truncate">{item.label}</span>
          <span className="text-[11px] text-[#505058] shrink-0">{item.time}</span>
        </div>
      ))}
    </div>
  );
}
