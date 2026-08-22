import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search, Star, Eye, GitFork, GitBranch, GitCommitHorizontal, GitPullRequest, GitMerge,
  ChevronDown, ChevronRight, ChevronLeft, ChevronUp, X, Plus, Circle, CheckCircle2, XCircle,
  Clock, Zap, Bot, Sparkles, Terminal, Send, FileText, FileCode, Folder, Download, Shield,
  ShieldAlert, ShieldCheck, BarChart3, Settings, Tag, AlertCircle, AlertTriangle, MessageSquare,
  Code2, Play, Loader2, RefreshCw, ArrowUpRight, Copy, ExternalLink, ThumbsUp, Activity, Cpu,
  Layers, Brain, Wrench, Waypoints, PanelRightClose, PanelRightOpen, Check, Lock,
  Globe, History, Package, Trash2, GitBranchPlus, Gauge
} from "lucide-react";

/* ============================================================================
   GitBrain (Synapse AI) — Real State & Authentic GitHub + Antigravity Cockpit
============================================================================ */

const uid = () => `id_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
const avatar = (seed: string) => `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(seed)}&backgroundColor=161b22`;

const OctocatIcon = ({ className, size = 22 }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} className={className} fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.64 0 8.13c0 3.6 2.29 6.65 5.47 7.72.4.08.55-.18.55-.39 0-.19-.01-.82-.01-1.49-2.01.38-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.15-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.24 1.87.89 2.33.68.07-.53.28-.89.51-1.1-1.78-.2-3.64-.91-3.64-4.02 0-.89.31-1.62.82-2.19-.08-.2-.36-1.03.08-2.15 0 0 .67-.22 2.2.84a7.4 7.4 0 0 1 4 0c1.53-1.06 2.2-.84 2.2-.84.44 1.12.16 1.95.08 2.15.51.57.82 1.29.82 2.19 0 3.13-1.87 3.82-3.65 4.02.29.26.54.76.54 1.53 0 1.11-.01 2-.01 2.27 0 .21.15.48.55.39A8.13 8.13 0 0 0 16 8.13C16 3.64 12.42 0 8 0Z" />
  </svg>
);

const cx = (...a: any[]) => a.filter(Boolean).join(" ");

function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: string }) {
  const tones: Record<string, string> = {
    default: "bg-[#21262D] text-[#8B949E] border-[#30363D]",
    green: "bg-[#0d1f14] text-[#3FB950] border-[#1a3d24]",
    red: "bg-[#2a1215] text-[#F85149] border-[#4a1d21]",
    purple: "bg-[#1e1631] text-[#8957E5] border-[#33244f]",
    amber: "bg-[#241a05] text-[#D29922] border-[#3d2c0c]",
    blue: "bg-[#0c1e30] text-[#58A6FF] border-[#163955]",
    cyan: "bg-[#04262a] text-[#00F2FE] border-[#0a4249]",
  };
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-[1px] text-[11px] font-medium leading-5", tones[tone] || tones.default)}>
      {children}
    </span>
  );
}

function LabelPill({ label }: { label: string }) {
  const map: Record<string, { bg: string; fg: string }> = {
    bug: { bg: "#4a0d10", fg: "#f8afa9" },
    enhancement: { bg: "#0b2b52", fg: "#a5cdff" },
    "high-priority": { bg: "#4a2a05", fg: "#f6c880" },
    security: { bg: "#1f1438", fg: "#d2a8ff" },
  };
  const c = map[label] || { bg: "#21262D", fg: "#c9d1d9" };
  return (
    <span className="rounded-full px-2 py-[1px] text-[11px] font-medium" style={{ backgroundColor: c.bg, color: c.fg }}>
      {label}
    </span>
  );
}

function Avatar({ seed, size = 20, ring }: { seed: string; size?: number; ring?: boolean }) {
  return (
    <img
      src={avatar(seed)}
      alt={seed}
      width={size}
      height={size}
      className={cx("rounded-full bg-[#21262D]", ring && "ring-2 ring-[#00F2FE]/40")}
      style={{ width: size, height: size }}
    />
  );
}

function Btn({ children, onClick, tone = "default", size = "md", icon: Icon, className, disabled, title }: any) {
  const tones: Record<string, string> = {
    default: "bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] border-[#30363D]",
    green: "bg-[#238636] hover:bg-[#2ea043] text-white border-[#2ea043]",
    danger: "bg-[#21262D] hover:bg-[#3a1618] text-[#F85149] border-[#30363D]",
    ghost: "bg-transparent hover:bg-[#21262D] text-[#C9D1D9] border-transparent",
    agent: "bg-gradient-to-r from-[#6366F1] to-[#00F2FE] hover:brightness-110 text-[#0D1117] font-semibold border-transparent",
  };
  const sizes: Record<string, string> = { sm: "text-xs px-2 py-1", md: "text-sm px-3 py-1.5" };
  return (
    <button
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-1.5 rounded-md border font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        tones[tone] || tones.default, sizes[size] || sizes.md, className
      )}
    >
      {Icon && <Icon size={size === "sm" ? 13 : 15} />}
      {children}
    </button>
  );
}

function Modal({ title, onClose, children, wide }: any) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onMouseDown={onClose}>
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className={cx("w-full rounded-xl border border-[#30363D] bg-[#161B22] shadow-2xl", wide ? "max-w-2xl" : "max-w-md")}
      >
        <div className="flex items-center justify-between border-b border-[#30363D] px-4 py-3">
          <h3 className="text-sm font-semibold text-[#C9D1D9]">{title}</h3>
          <button onClick={onClose} className="rounded-md p-1 text-[#8B949E] hover:bg-[#21262D] hover:text-[#C9D1D9]">
            <X size={16} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

function SectionCard({ children, className }: any) {
  return <div className={cx("rounded-md border border-[#30363D] bg-[#0D1117]", className)}>{children}</div>;
}

const AGENT_DEFS = [
  { key: "pm", name: "PM Agent", role: "Planning sprints & roadmaps", icon: Bot, color: "#6366F1" },
  { key: "reviewer", name: "Reviewer Agent", role: "Auditing PRs & security", icon: Sparkles, color: "#00F2FE" },
  { key: "cifixer", name: "CI Fixer Agent", role: "Resolving build errors", icon: Zap, color: "#3FB950" },
];

const QUICK_ACTIONS = [
  { label: "📸 Snapshot", cmd: "/snapshot" },
  { label: "🔀 Smart Merge", cmd: "/merge" },
  { label: "🛠️ Auto-Fix Issue #104", cmd: "/fix 104" },
  { label: "📊 Re-plan Sprint", cmd: "/plan" },
];

export default function GitBrainApp() {
  const [activeTab, setActiveTab] = useState("code");
  const [sidecarOpen, setSidecarOpen] = useState(true);

  const [starred, setStarred] = useState(false);
  const [starCount, setStarCount] = useState(1420);
  const [watching, setWatching] = useState(false);
  const [watchCount, setWatchCount] = useState(48);
  const [forkCount, setForkCount] = useState(182);

  const [branches, setBranches] = useState(["main", "feature/payments-v2", "refactor/auth"]);
  const [branch, setBranch] = useState("main");
  const [branchMenuOpen, setBranchMenuOpen] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [newBranchName, setNewBranchName] = useState("");
  const [codeMenuOpen, setCodeMenuOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // REAL REPOSITORY CODE & FILES
  const [filesState, setFilesState] = useState<Record<string, { content: string; lang: string; msg: string; time: string }>>({
    "src/SynapseApp.tsx": {
      lang: "tsx",
      msg: "feat: Wire Antigravity Multi-Agent Console with authentic GitHub UI",
      time: "just now",
      content: `// GitBrain Core Studio Application
export default function GitBrainApp() {
  // Autonomous Version Control & AI Orchestration
  return <div className="gitbrain-studio">...</div>;
}`
    },
    "docker-compose.yml": {
      lang: "yaml",
      msg: "feat: Add Enterprise Microservices Architecture with Docker Compose",
      time: "1 hour ago",
      content: `version: '3.8'
services:
  api-gateway:
    build: ./services/api-gateway
    ports: ["8000:8000"]
  vcs-storage-service:
    build: ./services/vcs-storage-service
    ports: ["8001:8001"]
  ai-orchestrator-service:
    build: ./services/ai-orchestrator-service
    ports: ["8002:8002"]
  ci-runner-service:
    build: ./services/ci-runner-service
    ports: ["8003:8003"]
  postgres:
    image: postgres:16-alpine
  redis:
    image: redis:7-alpine`
    },
    "package.json": {
      lang: "json",
      msg: "chore: Bump version to 2.4.0 with microservices support",
      time: "2 hours ago",
      content: `{
  "name": "gitbrain",
  "version": "2.4.0",
  "private": true,
  "dependencies": {
    "react": "^18.3.1",
    "lucide-react": "^1.16.0",
    "diff": "^7.0.0",
    "zustand": "^5.0.3"
  }
}`
    },
    "README.md": {
      lang: "markdown",
      msg: "docs: Update README with Microservices Architecture & Docker quickstart",
      time: "2 hours ago",
      content: `# ⚡ GitBrain (Synapse AI)
### Autonomous AI Project Manager & Native Version Control Studio
#### Enterprise Microservices Architecture

> An authentic, all-in-one developer platform that replaces traditional Git & GitHub with an autonomous AI Project Manager, built-in cryptographic snapshots, automated CI/CD actions, and zero-conflict semantic merges.`
    },
    "tsconfig.json": {
      lang: "json",
      msg: "chore: Strict mode enabled across workspace",
      time: "1 day ago",
      content: `{\n  "compilerOptions": {\n    "target": "ES2020",\n    "strict": true,\n    "jsx": "react-jsx"\n  }\n}`
    },
    ".gitignore": {
      lang: "text",
      msg: "chore: Exclude node_modules, dist and logs",
      time: "1 day ago",
      content: "node_modules/\ndist/\n*.log\n.env"
    }
  });

  const [prs, setPrs] = useState([
    {
      id: 214, title: "feat(payments): Implement exponential backoff retry boundary", author: "sasiruliyanage2004", status: "open",
      source: "feature/payments-v2", target: "main", comments: 6, filesChanged: 4, additions: 142, deletions: 18,
      body: "Introduces idempotency keys on the /charge endpoint to prevent duplicate captures during network timeouts.",
      aiConfidence: 99,
    },
    {
      id: 211, title: "refactor(auth): Harden JWT refresh rotation & encrypted sessions", author: "sasiruliyanage2004", status: "open",
      source: "refactor/auth", target: "main", comments: 3, filesChanged: 3, additions: 88, deletions: 31,
      body: "Rotates refresh tokens on every use and revokes the prior token family on reuse detection.",
      aiConfidence: 96,
    }
  ]);
  const [selectedPr, setSelectedPr] = useState<any>(null);
  const [prFilter, setPrFilter] = useState("open");

  const [issues, setIssues] = useState([
    {
      id: 104, title: "Unhandled async rejection in Payments charge() under network timeout", status: "open",
      labels: ["bug", "high-priority"], author: "sasiruliyanage2004", comments: 4, opened: "3 hours ago",
      body: "When the Stripe endpoint takes more than 5000ms, the charge function throws an uncaught error instead of initiating the exponential retry wrapper.",
    },
    {
      id: 103, title: "Add OAuth 2.0 PKCE authentication flow for mobile clients", status: "open",
      labels: ["enhancement"], author: "sasiruliyanage2004", comments: 2, opened: "1 day ago",
      body: "Mobile clients require PKCE code challenge support in auth.ts to securely authenticate without client secrets.",
    },
    {
      id: 102, title: "Dependency security check: update core token cipher", status: "closed",
      labels: ["security"], author: "Synapse AI Bot", comments: 1, opened: "3 days ago",
      body: "Automated Dependabot scan passed. Upgraded encryption keys to AES-GCM 256.",
    }
  ]);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [issueFilter, setIssueFilter] = useState("open");
  const [showNewIssue, setShowNewIssue] = useState(false);
  const [newIssueTitle, setNewIssueTitle] = useState("");
  const [newIssueBody, setNewIssueBody] = useState("");
  const [newIssueLabels, setNewIssueLabels] = useState<string[]>([]);
  const [autoFixState, setAutoFixState] = useState<Record<number, string>>({});

  const [workflows, setWorkflows] = useState([
    {
      id: "run-1042", name: "Synapse CI / typecheck-test-audit", branch: "feature/payments-v2", status: "running",
      startedAgo: "25s ago",
      steps: [
        { name: "Typecheck & Lint", status: "done", lines: ["$ tsc --noEmit", "Found 0 errors in 18 files.", "✓ typecheck passed in 1.4s"] },
        { name: "Unit & Integration Tests", status: "running", lines: ["$ vitest run", "✓ payments/intents.spec.ts (12)", "✓ auth/rotation.spec.ts (8)", "running vcs.snapshot.spec.ts ..."] },
        { name: "Cryptographic Security Audit", status: "queued", lines: [] },
      ],
    },
    {
      id: "run-1041", name: "Security & Secret Leak Scanner", branch: "main", status: "passed",
      startedAgo: "20 min ago",
      steps: [
        { name: "Scan for hardcoded secrets", status: "done", lines: ["$ synapse audit --secrets", "0 private keys or tokens exposed.", "✓ secret scan passed in 0.8s"] },
        { name: "Validate AES Cipher integrity", status: "done", lines: ["$ synapse audit --cipher", "100% cryptographic integrity verified.", "✓ audit passed in 1.2s"] },
      ],
    }
  ]);
  const [selectedRun, setSelectedRun] = useState("run-1042");

  const [timeline, setTimeline] = useState([
    { sha: "12bb4f9", msg: "feat: Add Enterprise Microservices Architecture with Docker Compose", branch: "main", color: "#58A6FF", time: "just now" },
    { sha: "2fc2d9a", msg: "feat: Initial release of GitBrain - Autonomous AI PM & Native VCS", branch: "main", color: "#58A6FF", time: "1d ago" },
    { sha: "a91c3f0", msg: "Antigravity sidecar wired into main canvas", branch: "main", color: "#58A6FF", time: "2d ago" },
  ]);

  const [toasts, setToasts] = useState<any[]>([]);
  const removeToast = useCallback((id: string) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const addToast = useCallback((type: string, msg: string, title?: string) => {
    const id = uid();
    setToasts((t) => [...t, { id, type, msg, title }]);
    setTimeout(() => removeToast(id), 3800);
  }, [removeToast]);

  const [agents, setAgents] = useState({
    pm: { status: "idle", task: "Monitoring sprint roadmap & backlog" },
    reviewer: { status: "active", task: "Reviewing PR #214" },
    cifixer: { status: "active", task: "Monitoring run-1042 pipeline" },
  });
  const [focusedAgent, setFocusedAgent] = useState("all");
  const [trajectory, setTrajectory] = useState<any[]>([
    { id: uid(), agent: "cifixer", type: "thought", text: "Pipeline run-1042 started on feature/payments-v2. Running typecheck and tests.", t: "12:45:02" },
    { id: uid(), agent: "reviewer", type: "thought", text: "PR #214 touches payment intent flow. Cross-checking AST logic before approving.", t: "12:41:41" },
    { id: uid(), agent: "reviewer", type: "tool", text: "tool: calculate_semantic_diff(pr=214, base=\"main\")", t: "12:41:44" },
    { id: uid(), agent: "reviewer", type: "result", text: "Zero logic conflicts detected. Confidence 99% — ready for AI semantic merge.", t: "12:41:47" },
  ]);
  const [chat, setChat] = useState<any[]>([
    { id: uid(), role: "agent", agent: "pm", text: "👋 **Hello Sasiru!** I am your Autonomous Project Manager & Repository Architect. Everything is in sync across **6 repository files, 2 open PRs, and 2 active issues**.", t: "12:30" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [agentBusy, setAgentBusy] = useState(false);
  const trajEndRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { trajEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [trajectory]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat]);

  const pushTrajectory = (agent: string, type: string, text: string) => {
    setTrajectory((tr) => [...tr, { id: uid(), agent, type, text, t: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) }]);
  };
  const setAgentState = (key: string, status: string, task: string) => setAgents((a) => ({ ...a, [key]: { status, task } }));

  const toggleStar = () => {
    setStarred(!starred);
    setStarCount((c) => (starred ? c - 1 : c + 1));
    addToast(starred ? "info" : "success", starred ? "You unstarred this repository" : "You starred this repository");
  };
  const toggleWatch = () => {
    setWatching(!watching);
    setWatchCount((c) => (watching ? c - 1 : c + 1));
    addToast("info", watching ? "Stopped watching" : "You are now watching this repository");
  };
  const doFork = () => {
    setForkCount((c) => c + 1);
    addToast("success", "Fork created under your account", "GitBrain forked");
  };

  const createBranch = () => {
    if (!newBranchName.trim()) return;
    setBranches([...branches, newBranchName.trim()]);
    setBranch(newBranchName.trim());
    addToast("success", `Branch "${newBranchName.trim()}" created from ${branch}`, "New branch");
    setNewBranchName("");
    setShowBranchModal(false);
  };

  const takeSnapshot = (fromAgent?: boolean) => {
    const sha = Math.random().toString(16).slice(2, 9);
    setTimeline((tl) => [{ sha, msg: fromAgent ? "AI Agent-triggered snapshot before change" : "Manual snapshot from Code tab", branch, color: "#00F2FE", time: "just now" }, ...tl]);
    addToast("success", `Signed snapshot ${sha} created on ${branch}`, "Snapshot created");
    return sha;
  };

  const rollback = (node: any) => {
    addToast("warn", `Repository state rolled back to ${node.sha} (${node.branch})`, "Rollback complete");
    pushTrajectory("cifixer", "tool", `tool: verify_snapshot_signature(sha="${node.sha}")`);
    setTimeout(() => pushTrajectory("cifixer", "result", `Signature valid. Working tree reset to ${node.sha}.`), 500);
  };

  const mergePr = (pr: any) => {
    setPrs((list) => list.map((p) => (p.id === pr.id ? { ...p, status: "merged" } : p)));
    setSelectedPr((p: any) => (p && p.id === pr.id ? { ...p, status: "merged" } : p));
    addToast("success", `PR #${pr.id} merged into ${pr.target} via AI Semantic Merge`, "Merged");
    pushTrajectory("reviewer", "tool", `tool: semantic_merge(pr=${pr.id}, strategy="squash")`);
    setTimeout(() => pushTrajectory("reviewer", "result", `Merged #${pr.id} cleanly. 0 conflicts, ${pr.filesChanged} files updated.`), 500);
  };

  const submitIssue = () => {
    if (!newIssueTitle.trim()) return;
    const iss = { id: issues.length + 105, title: newIssueTitle.trim(), status: "open", labels: newIssueLabels.length > 0 ? newIssueLabels : ["enhancement"], author: "sasiruliyanage2004", comments: 0, opened: "just now", body: newIssueBody || "No description provided." };
    setIssues([iss, ...issues]);
    addToast("success", `Issue #${iss.id} opened`, "New issue");
    setShowNewIssue(false);
    setNewIssueTitle(""); setNewIssueBody(""); setNewIssueLabels([]);
  };

  const autoFixIssue = (issue: any) => {
    setAutoFixState((s) => ({ ...s, [issue.id]: "running" }));
    setAgentState("cifixer", "active", `Auto-fixing #${issue.id}`);
    setFocusedAgent("cifixer");
    if (!sidecarOpen) setSidecarOpen(true);
    const steps = [
      ["thought", `Reproducing #${issue.id}: "${issue.title}". Pulling error stack trace.`],
      ["tool", `tool: fetch_ci_logs(issue=${issue.id})`],
      ["result", "Timeout unhandled rejection confirmed in charge handler."],
      ["tool", "tool: calculate_diff(strategy=\"add-retry-wrapper\")"],
      ["result", "Patch drafted: wraps charge() in 3x exponential backoff retry boundary."],
    ];
    steps.forEach(([type, text], i) => {
      setTimeout(() => pushTrajectory("cifixer", type, text), 500 + i * 650);
    });
    setTimeout(() => {
      setAutoFixState((s) => ({ ...s, [issue.id]: "staged" }));
      setAgentState("cifixer", "idle", "Awaiting next task");
      addToast("agent", `Patch staged for #${issue.id} — ready to open as a PR`, "CI Fixer Agent");
    }, 500 + steps.length * 650 + 300);
  };

  const createPrFromPatch = (issue: any) => {
    const pr = { id: prs.length + 215, title: `Fix: ${issue.title}`, author: "CI Fixer Agent", status: "open", source: `fix/issue-${issue.id}`, target: "main", comments: 0, filesChanged: 2, additions: 34, deletions: 6, body: `Automated patch generated by CI Fixer Agent for #${issue.id}.`, aiConfidence: 98 };
    setPrs([pr, ...prs]);
    addToast("success", `PR #${pr.id} opened from staged patch`, "CI Fixer Agent");
    setActiveTab("pulls");
    setSelectedPr(pr);
  };

  const runCommand = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    setChat((c) => [...c, { id: uid(), role: "user", text, t: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setChatInput("");
    setAgentBusy(true);

    const respond = (agent: string, delay: number, msg: string) => setTimeout(() => {
      setChat((c) => [...c, { id: uid(), role: "agent", agent, text: msg, t: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    }, delay);

    if (/^\/snapshot/.test(text)) {
      setFocusedAgent("cifixer"); if (!sidecarOpen) setSidecarOpen(true);
      pushTrajectory("cifixer", "thought", "User requested manual snapshot. Verifying working tree integrity.");
      setTimeout(() => pushTrajectory("cifixer", "tool", "tool: create_snapshot(sign=true)"), 500);
      setTimeout(() => { const sha = takeSnapshot(true); pushTrajectory("cifixer", "result", `Snapshot ${sha} signed and pushed to the timeline.`); }, 1100);
      respond("cifixer", 1500, "Done — a signed cryptographic snapshot is now on the Subway Timeline.");
    } else if (/^\/merge/.test(text)) {
      const target = prs.find((p) => p.status === "open");
      setFocusedAgent("reviewer"); if (!sidecarOpen) setSidecarOpen(true);
      if (target) {
        pushTrajectory("reviewer", "thought", `Re-verifying PR #${target.id} before semantic merge.`);
        setTimeout(() => pushTrajectory("reviewer", "tool", `tool: calculate_diff(pr=${target.id}, base="${target.target}")`), 450);
        setTimeout(() => { mergePr(target); }, 1000);
        respond("reviewer", 1500, `Merged PR #${target.id} "${target.title}" into ${target.target}. Confidence was ${target.aiConfidence}%, zero logic conflicts.`);
      } else {
        respond("reviewer", 500, "All pull requests are already merged!");
      }
    } else if (/^\/fix/.test(text)) {
      const target = issues.find((i) => i.status === "open");
      if (target) {
        autoFixIssue(target);
        respond("cifixer", 400, `On it — diagnosing #${target.id} "${target.title}" now. Watch the trajectory stream for progress.`);
      } else {
        respond("cifixer", 500, "No open issues found to fix.");
      }
    } else if (/^\/plan/.test(text)) {
      setFocusedAgent("pm"); if (!sidecarOpen) setSidecarOpen(true);
      setAgentState("pm", "active", "Re-planning Sprint Roadmap");
      pushTrajectory("pm", "thought", "Analyzing sprint velocity across microservices and PRs.");
      setTimeout(() => pushTrajectory("pm", "tool", "tool: reallocate_capacity()"), 500);
      setTimeout(() => pushTrajectory("pm", "result", "Sprint 14 velocity optimized. Ahead of schedule by 18%."), 1050);
      setTimeout(() => setAgentState("pm", "idle", "Sprint rebalanced"), 1400);
      respond("pm", 1500, "Sprint re-planned. Issue #104 prioritized for the current milestone.");
    } else {
      setFocusedAgent("pm");
      respond("pm", 700, "Got it. I'll fold that into planning — try `/snapshot`, `/merge`, `/fix` or `/plan` for a live agent action.");
    }
    setTimeout(() => setAgentBusy(false), 1600);
  };

  const openTab = (tab: string) => { setActiveTab(tab); setSelectedFile(null); setSelectedPr(null); setSelectedIssue(null); };

  /* ------------------------------- HEADER ---------------------------------- */
  const Header = () => (
    <header className="sticky top-0 z-40 border-b border-[#30363D] bg-[#161B22]">
      <div className="flex items-center gap-3 px-4 py-2.5">
        <OctocatIcon size={30} className="text-[#C9D1D9] shrink-0" />
        <div className="flex items-center gap-1.5 text-[15px] min-w-0">
          <span className="text-[#8B949E] truncate">sasiruliyanage2004</span>
          <span className="text-[#8B949E]">/</span>
          <span className="font-semibold text-[#C9D1D9] truncate">GitBrain</span>
          <Badge>Public</Badge>
        </div>

        <div className="ml-4 hidden flex-1 max-w-md items-center gap-2 rounded-md border border-[#30363D] bg-[#0D1117] px-3 py-1.5 text-[#8B949E] md:flex">
          <Search size={14} />
          <span className="text-sm">Type <kbd className="rounded border border-[#30363D] bg-[#21262D] px-1 text-[11px]">/</kbd> to search</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Btn icon={Eye} onClick={toggleWatch}>
            {watching ? "Watching" : "Watch"} <Badge>{watchCount}</Badge>
          </Btn>
          <Btn icon={GitFork} onClick={doFork}>
            Fork <Badge>{forkCount}</Badge>
          </Btn>
          <Btn icon={Star} onClick={toggleStar} className={starred ? "!text-[#D29922] !border-[#D29922]/40" : ""}>
            {starred ? "Starred" : "Star"} <Badge>{starCount}</Badge>
          </Btn>
          <button
            onClick={() => setSidecarOpen(!sidecarOpen)}
            className={cx(
              "ml-1 inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-semibold transition-all",
              sidecarOpen
                ? "border-[#00F2FE]/50 bg-gradient-to-r from-[#6366F1]/20 to-[#00F2FE]/20 text-[#00F2FE] shadow-[0_0_14px_-2px_rgba(0,242,254,0.5)]"
                : "border-[#30363D] bg-[#21262D] text-[#C9D1D9] hover:bg-[#30363D]"
            )}
          >
            <Zap size={14} className={sidecarOpen ? "animate-pulse" : ""} />
            Antigravity AI Sidecar
            {sidecarOpen ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
          </button>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 text-sm text-[#8B949E]">
        {[
          { key: "code", label: "Code", icon: Code2 },
          { key: "issues", label: "Issues", icon: Circle, badge: issues.filter((i) => i.status === "open").length },
          { key: "pulls", label: "Pull requests", icon: GitPullRequest, badge: prs.filter((p) => p.status === "open").length },
          { key: "actions", label: "Actions", icon: Play },
          { key: "projects", label: "Projects", icon: Layers },
          { key: "releases", label: "Releases", icon: Tag },
          { key: "timeline", label: "Subway Timeline", icon: Waypoints },
          { key: "security", label: "Security", icon: Shield },
          { key: "insights", label: "Insights", icon: BarChart3 },
          { key: "settings", label: "Settings", icon: Settings },
        ].map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => openTab(t.key)}
              className={cx(
                "flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 font-medium transition-colors",
                active ? "border-[#F78166] text-[#C9D1D9]" : "border-transparent hover:text-[#C9D1D9]"
              )}
            >
              <Icon size={15} />
              {t.label}
              {!!t.badge && <span className="ml-0.5 rounded-full bg-[#21262D] px-1.5 text-[11px] text-[#8B949E]">{t.badge}</span>}
            </button>
          );
        })}
      </nav>
    </header>
  );

  /* -------------------------------- CODE TAB -------------------------------- */
  const CodeTab = () => (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Btn icon={GitBranch} onClick={() => setBranchMenuOpen(!branchMenuOpen)}>
            {branch} <ChevronDown size={13} />
          </Btn>
          {branchMenuOpen && (
            <div className="absolute z-30 mt-1 w-56 rounded-md border border-[#30363D] bg-[#161B22] p-1 shadow-2xl">
              {branches.map((b) => (
                <button
                  key={b}
                  onClick={() => { setBranch(b); setBranchMenuOpen(false); }}
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm text-[#C9D1D9] hover:bg-[#21262D]"
                >
                  <GitBranch size={13} className="text-[#8B949E]" /> {b}
                  {b === branch && <Check size={13} className="ml-auto text-[#3FB950]" />}
                </button>
              ))}
              <div className="my-1 border-t border-[#30363D]" />
              <button
                onClick={() => { setBranchMenuOpen(false); setShowBranchModal(true); }}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm text-[#58A6FF] hover:bg-[#21262D]"
              >
                <GitBranchPlus size={13} /> Create branch
              </button>
            </div>
          )}
        </div>

        <div className="text-sm text-[#8B949E]">
          <span className="font-semibold text-[#C9D1D9]">{branches.length}</span> branches · <span className="font-semibold text-[#C9D1D9]">{timeline.length}</span> tags
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Btn tone="green" icon={Sparkles} onClick={() => takeSnapshot(false)}>Take Snapshot</Btn>
          <div className="relative">
            <Btn tone="green" onClick={() => setCodeMenuOpen(!codeMenuOpen)}>Code <ChevronDown size={13} /></Btn>
            {codeMenuOpen && (
              <div className="absolute right-0 z-30 mt-1 w-72 rounded-md border border-[#30363D] bg-[#161B22] p-3 shadow-2xl">
                <div className="mb-2 text-xs font-semibold text-[#C9D1D9]">Clone Repository</div>
                <div className="mb-2 flex items-center gap-1 rounded-md border border-[#30363D] bg-[#0D1117] px-2 py-1.5">
                  <span className="flex-1 truncate font-mono text-[11px] text-[#C9D1D9]">
                    https://github.com/sasiruliyanage2004/GitBrain.git
                  </span>
                  <button
                    onClick={() => { navigator.clipboard?.writeText("https://github.com/sasiruliyanage2004/GitBrain.git"); addToast("success", "URL copied to clipboard"); setCodeMenuOpen(false); }}
                    className="rounded p-1 text-[#8B949E] hover:bg-[#21262D] hover:text-[#C9D1D9]"
                  ><Copy size={12} /></button>
                </div>
                <button
                  onClick={() => {
                    const data = JSON.stringify(filesState, null, 2);
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = "GitBrain-source.json";
                    a.click();
                    addToast("success", "Downloaded repository source files");
                    setCodeMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-[#C9D1D9] hover:bg-[#21262D]"
                ><Download size={14} /> Download ZIP / Source</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedFile ? (
        <SectionCard className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-[#30363D] bg-[#161B22] px-3 py-2">
            <button onClick={() => setSelectedFile(null)} className="rounded p-1 text-[#8B949E] hover:bg-[#21262D] hover:text-[#C9D1D9]">
              <ChevronLeft size={15} />
            </button>
            <FileCode size={14} className="text-[#8B949E]" />
            <span className="font-mono text-sm text-[#C9D1D9]">{selectedFile}</span>
            <span className="ml-auto text-xs text-[#8B949E]">
              {(filesState[selectedFile]?.content || '').split("\n").length} lines
            </span>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-6">
            {(filesState[selectedFile]?.content || '').split("\n").map((l, i) => (
              <div key={i} className="flex">
                <span className="mr-4 w-8 shrink-0 select-none text-right text-[#484F58]">{i + 1}</span>
                <span className="text-[#C9D1D9]">{l}</span>
              </div>
            ))}
          </pre>
        </SectionCard>
      ) : (
        <>
          <SectionCard>
            <div className="flex items-center gap-2 border-b border-[#30363D] px-3 py-2.5 text-sm">
              <Avatar seed="sasiruliyanage2004" />
              <span className="font-semibold text-[#C9D1D9]">sasiruliyanage2004</span>
              <span className="truncate text-[#8B949E]">feat: Add Enterprise Microservices Architecture with Docker Compose</span>
              <span className="ml-auto hidden shrink-0 items-center gap-3 text-[#8B949E] sm:flex">
                <span className="font-mono text-xs">12bb4f9</span>
                <span className="flex items-center gap-1"><History size={12} /> {timeline.length} commits</span>
                <span>just now</span>
              </span>
            </div>
            <div>
              {Object.entries(filesState).map(([name, f], i, arr) => (
                <button
                  key={name}
                  onClick={() => setSelectedFile(name)}
                  className={cx(
                    "flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-[#161B22] transition-colors",
                    i !== arr.length - 1 && "border-b border-[#21262D]"
                  )}
                >
                  <FileText size={15} className="shrink-0 text-[#8B949E]" />
                  <span className="w-56 shrink-0 truncate text-[#58A6FF] font-mono">{name}</span>
                  <span className="flex-1 truncate text-[#8B949E]">{f.msg}</span>
                  <span className="shrink-0 text-xs text-[#8B949E] font-mono">{f.time}</span>
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-[#30363D] px-4 py-2.5">
              <FileText size={14} className="text-[#8B949E]" />
              <span className="text-sm font-semibold text-[#C9D1D9]">README.md</span>
            </div>
            <div className="px-6 py-6 text-xs leading-relaxed text-[#C9D1D9]">
              <h1 className="text-2xl font-bold text-cyan-400 mb-2">⚡ GitBrain (Synapse AI)</h1>
              <p className="text-sm font-semibold text-[#8B949E] mb-3">
                Autonomous AI Project Manager & Native Version Control Studio
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">React 18.3</span>
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">TypeScript 5.7</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">Docker Compose</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">MIT License</span>
              </div>
              <p className="text-[#8B949E] mb-4">
                GitBrain pairs an authentic GitHub workflow with the Antigravity multi-agent cockpit — a Project Manager Agent, a Code Reviewer Agent and a CI/CD Fixer Agent that plan sprints, audit pull requests and repair failing builds autonomously.
              </p>
              <div className="p-4 bg-[#161B22] rounded border border-[#30363D] font-mono text-[11px] text-[#7EE787]">
                <div># Launch complete Microservices cluster</div>
                <div>docker-compose up --build</div>
              </div>
            </div>
          </SectionCard>
        </>
      )}
    </div>
  );

  /* -------------------------------- PULLS TAB ------------------------------- */
  const PullsTab = () => {
    const filtered = prs.filter((p) => (prFilter === "open" ? p.status === "open" : p.status === "merged"));
    if (selectedPr) {
      const pr = prs.find((p) => p.id === selectedPr.id) || selectedPr;
      return (
        <div className="flex flex-col gap-3 p-4">
          <button onClick={() => setSelectedPr(null)} className="flex w-fit items-center gap-1 text-sm text-[#58A6FF] hover:underline">
            <ChevronLeft size={14} /> Back to pull requests
          </button>
          <div>
            <h1 className="text-xl font-semibold text-[#C9D1D9]">{pr.title} <span className="font-normal text-[#8B949E]">#{pr.id}</span></h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <Badge tone={pr.status === "merged" ? "purple" : "green"}>
                {pr.status === "merged" ? <GitMerge size={12} /> : <GitPullRequest size={12} />}
                {pr.status === "merged" ? "Merged" : "Open"}
              </Badge>
              <span className="text-[#8B949E]">
                <span className="text-[#C9D1D9]">{pr.author}</span> wants to merge into
              </span>
              <Badge>{pr.target}</Badge>
              <span className="text-[#8B949E]">from</span>
              <Badge>{pr.source}</Badge>
            </div>
          </div>

          <SectionCard className="p-4 text-sm text-[#C9D1D9]">{pr.body}</SectionCard>

          <div className="flex flex-wrap gap-3 text-xs text-[#8B949E]">
            <span>{pr.filesChanged} files changed</span>
            <span className="text-[#3FB950]">+{pr.additions}</span>
            <span className="text-[#F85149]">−{pr.deletions}</span>
            <span>{pr.comments} comments</span>
          </div>

          <div className="rounded-md border border-[#00F2FE]/30 bg-gradient-to-r from-[#0a1a2b] to-[#0a2620] p-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#00F2FE]" />
              <span className="text-sm font-semibold text-[#C9D1D9]">Reviewer Agent — automated code review</span>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-[#7EE787]">
              <CheckCircle2 size={14} /> Confidence {pr.aiConfidence}% — Zero logic conflicts
            </p>
            <p className="mt-1 text-xs text-[#8B949E]">AST Diff cross-checked against {pr.target}. Reconciled async signature without breaking base trunk.</p>
            {pr.status !== "merged" ? (
              <Btn tone="green" icon={GitMerge} className="mt-3" onClick={() => mergePr(pr)}>AI Semantic Merge</Btn>
            ) : (
              <Badge tone="purple">Merged into {pr.target}</Badge>
            )}
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          {["open", "merged"].map((f) => (
            <button
              key={f}
              onClick={() => setPrFilter(f)}
              className={cx("rounded-md border px-3 py-1.5 text-sm font-medium capitalize", prFilter === f ? "border-[#30363D] bg-[#21262D] text-[#C9D1D9]" : "border-transparent text-[#8B949E] hover:bg-[#161B22]")}
            >
              {f === "open" ? <GitPullRequest size={13} className="mr-1 inline" /> : <GitMerge size={13} className="mr-1 inline" />}
              {f} <Badge>{prs.filter((p) => p.status === f).length}</Badge>
            </button>
          ))}
        </div>
        <SectionCard>
          {filtered.map((pr, i) => (
            <button key={pr.id} onClick={() => setSelectedPr(pr)} className={cx("flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-[#161B22]", i !== filtered.length - 1 && "border-b border-[#21262D]")}>
              {pr.status === "merged" ? <GitMerge size={16} className="mt-0.5 shrink-0 text-[#8957E5]" /> : <GitPullRequest size={16} className="mt-0.5 shrink-0 text-[#3FB950]" />}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-[#C9D1D9]">{pr.title}</div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-[#8B949E]">
                  <span>#{pr.id} opened by {pr.author}</span>
                  <Badge>{pr.source}</Badge>
                  <ArrowUpRight size={10} />
                  <Badge>{pr.target}</Badge>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1 text-xs text-[#8B949E]">
                <MessageSquare size={12} /> {pr.comments}
              </div>
            </button>
          ))}
        </SectionCard>
      </div>
    );
  };

  /* -------------------------------- ISSUES TAB ------------------------------ */
  const IssuesTab = () => {
    const filtered = issues.filter((i) => i.status === issueFilter);
    if (selectedIssue) {
      const issue = issues.find((i) => i.id === selectedIssue.id) || selectedIssue;
      const fixState = autoFixState[issue.id];
      return (
        <div className="flex flex-col gap-3 p-4">
          <button onClick={() => setSelectedIssue(null)} className="flex w-fit items-center gap-1 text-sm text-[#58A6FF] hover:underline">
            <ChevronLeft size={14} /> Back to issues
          </button>
          <div>
            <h1 className="text-xl font-semibold text-[#C9D1D9]">{issue.title} <span className="font-normal text-[#8B949E]">#{issue.id}</span></h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <Badge tone={issue.status === "open" ? "green" : "purple"}>
                <Circle size={10} /> {issue.status === "open" ? "Open" : "Closed"}
              </Badge>
              <span className="text-[#8B949E]"><span className="text-[#C9D1D9]">{issue.author}</span> opened {issue.opened}</span>
              {issue.labels.map((l: string) => <LabelPill key={l} label={l} />)}
            </div>
          </div>
          <SectionCard className="p-4 text-sm text-[#C9D1D9]">{issue.body}</SectionCard>

          {issue.status === "open" && (
            <div className="rounded-md border border-[#00F2FE]/30 bg-gradient-to-r from-[#0a1a2b] to-[#0a2620] p-4">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-[#3FB950]" />
                <span className="text-sm font-semibold text-[#C9D1D9]">CI Fixer Agent</span>
              </div>
              {!fixState && (
                <>
                  <p className="mt-1 text-xs text-[#8B949E]">Let the CI Fixer Agent reproduce this issue and stage a patch automatically.</p>
                  <Btn tone="agent" icon={Sparkles} className="mt-3" onClick={() => autoFixIssue(issue)}>Ask AI to Auto-Fix</Btn>
                </>
              )}
              {fixState === "running" && (
                <p className="mt-2 flex items-center gap-2 text-sm text-[#D29922]">
                  <Loader2 size={14} className="animate-spin" /> Diagnosing and drafting a patch — watch the trajectory stream →
                </p>
              )}
              {fixState === "staged" && (
                <div className="mt-2">
                  <p className="flex items-center gap-1.5 text-sm text-[#7EE787]"><CheckCircle2 size={14} /> Patch staged: adds exponential backoff retry boundary.</p>
                  <Btn tone="green" icon={GitPullRequest} className="mt-2" onClick={() => createPrFromPatch(issue)}>Create PR from patch</Btn>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          {["open", "closed"].map((f) => (
            <button key={f} onClick={() => setIssueFilter(f)} className={cx("rounded-md border px-3 py-1.5 text-sm font-medium capitalize", issueFilter === f ? "border-[#30363D] bg-[#21262D] text-[#C9D1D9]" : "border-transparent text-[#8B949E] hover:bg-[#161B22]")}>
              <Circle size={13} className="mr-1 inline" /> {f} <Badge>{issues.filter((i) => i.status === f).length}</Badge>
            </button>
          ))}
          <Btn tone="green" icon={Plus} className="ml-auto" onClick={() => setShowNewIssue(true)}>New Issue</Btn>
        </div>
        <SectionCard>
          {filtered.map((issue, i) => (
            <button key={issue.id} onClick={() => setSelectedIssue(issue)} className={cx("flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-[#161B22]", i !== filtered.length - 1 && "border-b border-[#21262D]")}>
              <Circle size={15} className={cx("mt-0.5 shrink-0", issue.status === "open" ? "text-[#3FB950]" : "text-[#8957E5]")} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="truncate text-sm font-medium text-[#C9D1D9]">{issue.title}</span>
                  {issue.labels.map((l: string) => <LabelPill key={l} label={l} />)}
                </div>
                <div className="mt-1 text-xs text-[#8B949E]">#{issue.id} opened {issue.opened} by {issue.author}</div>
              </div>
              <div className="flex shrink-0 items-center gap-1 text-xs text-[#8B949E]"><MessageSquare size={12} /> {issue.comments}</div>
            </button>
          ))}
        </SectionCard>

        {showNewIssue && (
          <Modal title="New issue" onClose={() => setShowNewIssue(false)} wide>
            <div className="flex flex-col gap-3">
              <input value={newIssueTitle} onChange={(e) => setNewIssueTitle(e.target.value)} placeholder="Title" className="rounded-md border border-[#30363D] bg-[#0D1117] px-3 py-2 text-sm text-[#C9D1D9] outline-none focus:border-[#58A6FF]" />
              <textarea value={newIssueBody} onChange={(e) => setNewIssueBody(e.target.value)} placeholder="Leave a description..." rows={4} className="resize-none rounded-md border border-[#30363D] bg-[#0D1117] px-3 py-2 text-sm text-[#C9D1D9] outline-none focus:border-[#58A6FF]" />
              <div className="mt-1 flex justify-end gap-2">
                <Btn onClick={() => setShowNewIssue(false)}>Cancel</Btn>
                <Btn tone="green" onClick={submitIssue} disabled={!newIssueTitle.trim()}>Submit new issue</Btn>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  };

  /* -------------------------------- ACTIONS TAB ------------------------------ */
  const ActionsTab = () => {
    const run = workflows.find((w) => w.id === selectedRun) || workflows[0];
    const statusIcon: Record<string, any> = { running: <Loader2 size={14} className="animate-spin text-[#D29922]" />, passed: <CheckCircle2 size={14} className="text-[#3FB950]" />, failed: <XCircle size={14} className="text-[#F85149]" /> };
    return (
      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[300px_1fr]">
        <SectionCard className="h-fit">
          {workflows.map((w, i) => (
            <button key={w.id} onClick={() => setSelectedRun(w.id)} className={cx("flex w-full items-start gap-2.5 px-3 py-3 text-left hover:bg-[#161B22]", i !== workflows.length - 1 && "border-b border-[#21262D]", selectedRun === w.id && "bg-[#161B22]")}>
              {statusIcon[w.status]}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-[#C9D1D9]">{w.name}</div>
                <div className="mt-0.5 flex items-center gap-1 text-xs text-[#8B949E]">
                  <GitBranch size={11} /> {w.branch} · {w.startedAgo}
                </div>
              </div>
            </button>
          ))}
        </SectionCard>

        <SectionCard className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-[#30363D] px-4 py-2.5">
            {statusIcon[run.status]}
            <span className="text-sm font-semibold text-[#C9D1D9]">{run.name}</span>
            <Badge>{run.branch}</Badge>
            <span className="ml-auto text-xs text-[#8B949E] font-mono">{run.id}</span>
          </div>
          <div className="divide-y divide-[#21262D]">
            {run.steps.map((s) => (
              <div key={s.name} className="p-3">
                <div className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#C9D1D9]">
                  <CheckCircle2 size={13} className="text-[#3FB950]" />
                  <span>{s.name}</span>
                </div>
                {s.lines.length > 0 && (
                  <pre className="overflow-x-auto rounded-md bg-[#0D1117] p-2.5 font-mono text-[12px] leading-5 text-[#8B949E]">
                    {s.lines.map((l, idx) => (
                      <div key={idx} className={cx(l.startsWith("✓") && "text-[#3FB950]", l.startsWith("$") && "text-[#58A6FF]")}>{l}</div>
                    ))}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    );
  };

  /* -------------------------------- TIMELINE TAB ------------------------------ */
  const TimelineTab = () => (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-2">
        <Waypoints size={16} className="text-cyan-400" />
        <h2 className="text-sm font-semibold text-[#C9D1D9]">Subway Version Timeline & Cryptographic Graph</h2>
        <Badge tone="cyan">SHA-256 Verified</Badge>
      </div>
      <SectionCard className="p-4">
        <div className="relative pl-6">
          <div className="absolute bottom-2 left-[9px] top-2 w-[2px] bg-gradient-to-b from-[#00F2FE] via-[#30363D] to-[#30363D]" />
          <div className="flex flex-col gap-5">
            {timeline.map((n) => (
              <div key={n.sha} className="relative flex items-start gap-3">
                <div className="absolute -left-[3px] top-1 h-3 w-3 rounded-full border-2" style={{ borderColor: n.color, backgroundColor: "#0D1117" }} />
                <div className="ml-6 flex-1 rounded-md border border-[#30363D] bg-[#0D1117] p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-[#8B949E]">#{n.sha}</span>
                    <span className="text-sm text-[#C9D1D9]">{n.msg}</span>
                    <span className="rounded-full px-2 py-[1px] text-[11px]" style={{ backgroundColor: n.color + "22", color: n.color }}>{n.branch}</span>
                    <span className="ml-auto shrink-0 text-xs text-[#8B949E] font-mono">{n.time}</span>
                  </div>
                  <button onClick={() => rollback(n)} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#58A6FF] hover:underline">
                    <RefreshCw size={11} /> Rollback here
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );

  /* -------------------------------- PROJECTS TAB ------------------------------ */
  const ProjectsTab = () => (
    <div className="p-4">
      <div className="mb-3 flex items-center gap-2">
        <Layers size={16} className="text-[#8B949E]" />
        <h2 className="text-sm font-semibold text-[#C9D1D9]">Sprint 14 Roadmap</h2>
        <Badge tone="cyan">PM Agent Maintained</Badge>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { key: "todo", label: "Backlog", items: ["#103 OAuth PKCE Flow", "Multi-region Delta Compression", "Draft Sprint 15 epics"] },
          { key: "progress", label: "In progress", items: ["#104 Unhandled async rejection in payments", "#214 Payments idempotency keys"] },
          { key: "review", label: "In review", items: ["#211 JWT refresh rotation hardening", "Microservices Docker documentation"] },
          { key: "done", label: "Done", items: ["Enterprise Microservices Scaffold", "Cryptographic Snapshot Ledger", "GitHub Authentic Ecosystem"] },
        ].map((c) => (
          <div key={c.key} className="rounded-md border border-[#30363D] bg-[#0D1117]">
            <div className="border-b border-[#30363D] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#8B949E]">{c.label} <span className="text-[#484F58]">{c.items.length}</span></div>
            <div className="flex flex-col gap-2 p-2">
              {c.items.map((it) => (
                <div key={it} className="rounded-md border border-[#30363D] bg-[#161B22] p-2.5 text-xs text-[#C9D1D9]">{it}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* -------------------------------- RELEASES TAB ------------------------------ */
  const ReleasesTab = () => (
    <div className="flex flex-col gap-3 p-4">
      {[
        { tag: "v2.4.0", name: "Antigravity Sidecar & Enterprise Microservices", latest: true, date: "just now", notes: ["Authentic GitHub UI fused with Antigravity Multi-Agent cockpit.", "Docker Compose microservices orchestration with API Gateway and VCS Storage."] },
        { tag: "v2.0.0", name: "Native Zero-Git VCS Architecture", latest: false, date: "1 week ago", notes: ["Cryptographic SHA-256 snapshot engine.", "Semantic 3-Way Merge without Git command complexity."] }
      ].map((r) => (
        <SectionCard key={r.tag} className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Tag size={15} className="text-[#8B949E]" />
            <span className="font-semibold text-[#C9D1D9] font-mono">{r.tag}</span>
            <span className="text-[#8B949E]">{r.name}</span>
            {r.latest && <Badge tone="green">Latest</Badge>}
            <span className="ml-auto text-xs text-[#8B949E] font-mono">{r.date}</span>
          </div>
          <ul className="mt-3 space-y-1.5">
            {r.notes.map((n, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#C9D1D9]">
                <Sparkles size={12} className="mt-1 shrink-0 text-[#00F2FE]" />
                {n}
              </li>
            ))}
          </ul>
        </SectionCard>
      ))}
    </div>
  );

  /* -------------------------------- SECURITY TAB ------------------------------ */
  const SecurityTab = () => (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <Shield size={16} className="text-[#8B949E]" />
        <h2 className="text-sm font-semibold text-[#C9D1D9]">Security Overview & Secret Scanning</h2>
      </div>
      <SectionCard className="flex items-center gap-2 p-4 text-sm text-emerald-400">
        <ShieldCheck size={18} /> 0 Vulnerabilities & Leaked Secrets detected in repository files.
      </SectionCard>
    </div>
  );

  /* -------------------------------- INSIGHTS TAB ------------------------------ */
  const InsightsTab = () => (
    <div className="flex flex-col gap-4 p-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Commits (30d)", value: "214", icon: GitCommitHorizontal },
          { label: "PRs merged", value: "38", icon: GitMerge },
          { label: "Agent actions", value: "1,420", icon: Cpu },
          { label: "Build Velocity", value: "1.48s", icon: Gauge },
        ].map((s) => (
          <SectionCard key={s.label} className="p-3">
            <s.icon size={15} className="text-[#8B949E]" />
            <div className="mt-2 text-xl font-semibold text-[#C9D1D9] font-mono">{s.value}</div>
            <div className="text-xs text-[#8B949E]">{s.label}</div>
          </SectionCard>
        ))}
      </div>
    </div>
  );

  /* -------------------------------- SETTINGS TAB ------------------------------ */
  const SettingsTab = () => (
    <div className="flex flex-col gap-4 p-4">
      <SectionCard className="p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#C9D1D9]"><Globe size={15} /> General Repository Settings</div>
        <label className="mb-1 block text-xs text-[#8B949E]">Repository name</label>
        <input defaultValue="GitBrain" className="mb-3 w-full max-w-sm rounded-md border border-[#30363D] bg-[#0D1117] px-3 py-1.5 text-sm text-[#C9D1D9] outline-none" />
        <label className="mb-1 block text-xs text-[#8B949E]">Description</label>
        <input defaultValue="Autonomous AI Project Manager & Native Version Control Studio" className="w-full max-w-sm rounded-md border border-[#30363D] bg-[#0D1117] px-3 py-1.5 text-sm text-[#C9D1D9] outline-none" />
      </SectionCard>
    </div>
  );

  const TAB_VIEWS: Record<string, any> = { code: CodeTab, issues: IssuesTab, pulls: PullsTab, actions: ActionsTab, projects: ProjectsTab, releases: ReleasesTab, timeline: TimelineTab, security: SecurityTab, insights: InsightsTab, settings: SettingsTab };
  const ActiveView = TAB_VIEWS[activeTab] || CodeTab;

  /* ============================ Antigravity Sidecar =========================== */
  const typeIcon: Record<string, any> = { thought: Brain, tool: Wrench, result: CheckCircle2 };
  const typeColor: Record<string, string> = { thought: "#6366F1", tool: "#00F2FE", result: "#3FB950" };

  const Sidecar = () => (
    <aside className="flex h-full w-[380px] shrink-0 flex-col border-l border-[#30363D] bg-[#0B0E14]">
      <div className="relative overflow-hidden border-b border-[#30363D] bg-gradient-to-br from-[#12101f] to-[#0b1a1c] px-4 py-3">
        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#00F2FE]/10 blur-2xl" />
        <div className="relative flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3FB950] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3FB950]" />
          </span>
          <h2 className="text-sm font-semibold text-[#E6EDF3]">Antigravity Multi-Agent Console</h2>
          <button onClick={() => setSidecarOpen(false)} className="ml-auto rounded p-1 text-[#8B949E] hover:bg-white/5 hover:text-white">
            <PanelRightClose size={15} />
          </button>
        </div>
        <div className="relative mt-1 flex items-center gap-1.5 text-[11px] text-[#8B949E]">
          <Cpu size={11} /> Gemini 3.7 Pro Agent · 3 sub-agents active
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-[#30363D] px-3 py-2.5">
        <button onClick={() => setFocusedAgent("all")} className={cx("shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium", focusedAgent === "all" ? "border-[#00F2FE]/50 bg-[#00F2FE]/10 text-[#00F2FE]" : "border-[#30363D] text-[#8B949E]")}>All</button>
        {AGENT_DEFS.map((a) => {
          const st = (agents as any)[a.key];
          const Icon = a.icon;
          const active = st?.status === "active";
          return (
            <button
              key={a.key}
              onClick={() => setFocusedAgent(a.key)}
              className={cx(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all",
                focusedAgent === a.key ? "bg-white/5" : ""
              )}
              style={{ borderColor: active ? a.color + "80" : "#30363D", color: active ? a.color : "#8B949E" }}
            >
              <Icon size={11} /> {a.name}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B949E]">
          <Activity size={12} /> Live Trajectory Stream
        </div>
        <div className="flex flex-col gap-2">
          {trajectory.filter((t) => focusedAgent === "all" || t.agent === focusedAgent).map((t) => {
            const Icon = typeIcon[t.type] || Activity;
            const agentDef = AGENT_DEFS.find((a) => a.key === t.agent);
            return (
              <div key={t.id} className="rounded-md border border-[#21262D] bg-[#11151c] p-2.5">
                <div className="mb-1 flex items-center gap-1.5 text-[10px] text-[#6E7681]">
                  <Icon size={11} style={{ color: typeColor[t.type] || "#8B949E" }} />
                  <span style={{ color: agentDef?.color }}>{agentDef?.name}</span>
                  <span className="ml-auto font-mono">{t.t}</span>
                </div>
                <div className={cx("text-[12px] leading-5 text-[#C9D1D9]", t.type === "tool" && "font-mono text-[#00F2FE]")}>{t.text}</div>
              </div>
            );
          })}
          <div ref={trajEndRef} />
        </div>

        <div className="mb-2 mt-4 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B949E]">
          <MessageSquare size={12} /> Agent Conversation
        </div>
        <div className="flex flex-col gap-2">
          {chat.map((m) => (
            <div key={m.id} className={cx("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cx("max-w-[85%] rounded-lg px-3 py-2 text-[12px] leading-5", m.role === "user" ? "bg-[#21262D] text-[#C9D1D9]" : "border border-[#6366F1]/30 bg-gradient-to-br from-[#12101f] to-[#0b1a1c] text-[#C9D1D9]")}>
                {m.text}
              </div>
            </div>
          ))}
          {agentBusy && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#8B949E]">
              <Loader2 size={12} className="animate-spin" /> agent working…
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="border-t border-[#30363D] p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {QUICK_ACTIONS.map((q) => (
            <button key={q.cmd} onClick={() => runCommand(q.cmd)} className="rounded-full border border-[#30363D] bg-[#11151c] px-2.5 py-1 text-[11px] text-[#C9D1D9] hover:border-[#6366F1]/50 hover:bg-[#6366F1]/10">
              {q.label}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); runCommand(chatInput); }}
          className="flex items-center gap-2 rounded-md border border-[#30363D] bg-[#11151c] px-2.5 py-1.5 focus-within:border-[#00F2FE]/50"
        >
          <Terminal size={14} className="shrink-0 text-[#6366F1]" />
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask agents or use /plan, /snapshot, /merge, /fix"
            className="flex-1 bg-transparent text-[12px] font-mono text-[#C9D1D9] outline-none placeholder:text-[#484F58]"
          />
          <button type="submit" disabled={!chatInput.trim()} className="shrink-0 rounded p-1 text-[#00F2FE] hover:bg-white/5 disabled:opacity-40">
            <Send size={14} />
          </button>
        </form>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#0D1117] text-[#C9D1D9] font-sans">
      <Header />

      <div className="flex min-h-0 flex-1">
        <main className="min-w-0 flex-1 overflow-y-auto">
          <ActiveView />
        </main>
        {sidecarOpen && <Sidecar />}
      </div>

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 z-[100] flex w-80 flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="flex items-start gap-2 rounded-md border border-[#30363D] border-l-4 border-l-[#00F2FE] bg-[#161B22] p-3 shadow-2xl">
            <Sparkles size={16} className="mt-0.5 shrink-0 text-[#00F2FE]" />
            <div className="min-w-0 flex-1">
              {t.title && <div className="text-xs font-semibold text-[#C9D1D9]">{t.title}</div>}
              <div className="text-xs text-[#8B949E]">{t.msg}</div>
            </div>
            <button onClick={() => removeToast(t.id)} className="text-[#8B949E] hover:text-[#C9D1D9]">
              <X size={13} />
            </button>
          </div>
        ))}
      </div>

      {showBranchModal && (
        <Modal title="Create a new branch" onClose={() => setShowBranchModal(false)}>
          <div className="flex flex-col gap-3">
            <div className="text-xs text-[#8B949E]">Branching from <span className="font-mono text-[#58A6FF]">{branch}</span></div>
            <input
              autoFocus
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createBranch()}
              placeholder="feature/my-new-branch"
              className="rounded-md border border-[#30363D] bg-[#0D1117] px-3 py-2 font-mono text-sm text-[#C9D1D9] outline-none focus:border-[#58A6FF]"
            />
            <div className="flex justify-end gap-2">
              <Btn onClick={() => setShowBranchModal(false)}>Cancel</Btn>
              <Btn tone="green" icon={GitBranchPlus} onClick={createBranch} disabled={!newBranchName.trim()}>Create branch</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
