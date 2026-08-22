import React, { useState, useEffect, useRef } from "react";
import {
  Search, GitBranch, GitCommitHorizontal, GitPullRequest, GitMerge,
  ChevronRight, Play, Terminal, Send, FileCode, Folder, Shield,
  Settings, MessageSquare, Code2, Zap, Brain, Rocket,
  Network, LayoutGrid, Cpu, Layers, Disc, Globe
} from "lucide-react";

/* ============================================================================
   GitBrain (Synapse AI) — Next-Gen Bento-Box Hacker Cockpit
   Fully revamped from standard GitHub UI to a futuristic Glassmorphism Dashboard
============================================================================ */

export default function GitBrainNextGen() {
  const [activeView, setActiveView] = useState("neural-map");
  const [activeAgent, setActiveAgent] = useState("pm");
  const [inputMessage, setInputMessage] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  const [trajectory, setTrajectory] = useState<{ id: string; agent: string; time: string; action: string; status: 'running' | 'done' | 'error' }[]>([
    { id: "1", agent: "PM Agent", time: "10:02:41", action: "Analyzing repository architecture...", status: "done" },
    { id: "2", agent: "Reviewer Agent", time: "10:03:15", action: "Scanning PR #214 for AST conflict patterns", status: "done" },
    { id: "3", agent: "CI Fixer", time: "10:05:00", action: "Auto-fixing strict mode violations in types.ts", status: "running" },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    setTrajectory(prev => [
      ...prev,
      { id: Date.now().toString(), agent: "User", time: new Date().toLocaleTimeString(), action: inputMessage, status: "done" },
      { id: (Date.now() + 1).toString(), agent: "PM Agent", time: new Date().toLocaleTimeString(), action: "Processing request and allocating sub-agents...", status: "running" }
    ]);
    setInputMessage("");
    setTimeout(() => {
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, 100);
  };

  return (
    <div className="h-screen w-full bg-[#030308] text-gray-300 font-sans overflow-hidden flex selection:bg-cyan-500/30 relative z-0">
      
      {/* 🌌 Background Ambient Mesh Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none z-[-1]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[50%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none z-[-1]" />
      <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] rounded-full bg-blue-600/5 blur-[100px] pointer-events-none z-[-1]" />

      {/* 📌 Left Slim Navigation Dock (Glassmorphism) */}
      <nav className="w-20 h-full border-r border-white/5 bg-white/[0.02] backdrop-blur-2xl flex flex-col items-center py-6 gap-8 z-10 shadow-2xl">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
          <Brain className="w-7 h-7 text-white" />
        </div>
        
        <div className="flex flex-col gap-6 mt-4">
          <NavIcon icon={<Network />} id="neural-map" active={activeView} set={setActiveView} tooltip="Neural Map" />
          <NavIcon icon={<Code2 />} id="code" active={activeView} set={setActiveView} tooltip="Code Editor" />
          <NavIcon icon={<GitPullRequest />} id="prs" active={activeView} set={setActiveView} tooltip="Merge Engine" />
          <NavIcon icon={<Play />} id="ci" active={activeView} set={setActiveView} tooltip="CI Sandbox" />
          <NavIcon icon={<Shield />} id="security" active={activeView} set={setActiveView} tooltip="Security Audit" />
        </div>

        <div className="mt-auto mb-4">
          <NavIcon icon={<Settings />} id="settings" active={activeView} set={setActiveView} tooltip="Settings" />
        </div>
      </nav>

      {/* 🎛️ Main Bento-Box Grid Area */}
      <main className="flex-1 h-full p-4 grid grid-cols-12 grid-rows-6 gap-4 overflow-hidden z-10">
        
        {/* Bento 1: Header / Project Info */}
        <header className="col-span-8 row-span-1 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md p-5 flex items-center justify-between shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
              <Globe className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">Synapse AI <span className="text-gray-500 font-normal">/ Core Services</span></h1>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" /> main</span>
                <span className="flex items-center gap-1"><GitCommitHorizontal className="w-3 h-3" /> 4d572a9</span>
                <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">Production</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all flex items-center gap-2">
              <Disc className="w-4 h-4" /> Snapshot
            </button>
            <button className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-medium transition-all shadow-[0_0_15px_rgba(34,211,238,0.15)] flex items-center gap-2">
              <Zap className="w-4 h-4" /> Deploy
            </button>
          </div>
        </header>

        {/* Bento 2: Codebase Neural Map (Replacement for File List) */}
        <section className="col-span-8 row-span-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md flex flex-col relative overflow-hidden shadow-lg">
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
            <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
              <Network className="w-4 h-4 text-purple-400" /> 3D Codebase Neural Map
            </h2>
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
          </div>
          
          <div className="flex-1 relative flex items-center justify-center p-8">
            {/* Mocking a 3D Node Graph visually */}
            <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
              <path d="M 200 150 Q 350 200 500 100 T 800 250" fill="transparent" stroke="url(#cyan-grad)" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite]" />
              <path d="M 200 150 Q 300 400 600 350 T 800 250" fill="transparent" stroke="url(#purple-grad)" strokeWidth="1.5" />
              <defs>
                <linearGradient id="cyan-grad"><stop offset="0%" stopColor="#22d3ee" stopOpacity="0" /><stop offset="50%" stopColor="#22d3ee" /><stop offset="100%" stopColor="#22d3ee" stopOpacity="0" /></linearGradient>
                <linearGradient id="purple-grad"><stop offset="0%" stopColor="#c084fc" stopOpacity="0" /><stop offset="50%" stopColor="#c084fc" /><stop offset="100%" stopColor="#c084fc" stopOpacity="0" /></linearGradient>
              </defs>
            </svg>

            {/* Nodes */}
            <div className="absolute top-[20%] left-[20%] flex flex-col items-center gap-2 group cursor-pointer hover:scale-110 transition-transform">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-gray-800 to-gray-700 border border-white/10 flex items-center justify-center shadow-xl group-hover:border-cyan-400/50 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                <Folder className="w-8 h-8 text-cyan-400" />
              </div>
              <span className="text-xs text-gray-400 group-hover:text-cyan-400">services/</span>
            </div>

            <div className="absolute top-[40%] left-[50%] flex flex-col items-center gap-2 group cursor-pointer hover:scale-110 transition-transform z-10">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-gray-800 to-gray-700 border-2 border-purple-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                <Brain className="w-10 h-10 text-purple-400 animate-pulse" />
              </div>
              <span className="text-sm font-semibold text-purple-300">ai-orchestrator</span>
              <div className="absolute -right-2 -top-2 w-4 h-4 bg-purple-500 rounded-full border-2 border-[#050510] animate-ping" />
            </div>

            <div className="absolute bottom-[20%] right-[30%] flex flex-col items-center gap-2 group cursor-pointer hover:scale-110 transition-transform">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-gray-800 to-gray-700 border border-white/10 flex items-center justify-center shadow-xl group-hover:border-blue-400/50">
                <FileCode className="w-8 h-8 text-blue-400" />
              </div>
              <span className="text-xs text-gray-400 group-hover:text-blue-400">SynapseApp.tsx</span>
            </div>

            <div className="absolute top-[60%] left-[25%] flex flex-col items-center gap-2 group cursor-pointer hover:scale-110 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-gray-800 to-gray-700 border border-white/10 flex items-center justify-center shadow-xl group-hover:border-green-400/50">
                <Cpu className="w-7 h-7 text-green-400" />
              </div>
              <span className="text-xs text-gray-400 group-hover:text-green-400">ci-runner</span>
            </div>
            
            <div className="absolute inset-x-0 bottom-6 flex justify-center">
              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3 text-xs text-gray-400">
                <Search className="w-4 h-4" /> Search neural map, files, or agents (Ctrl+K)
              </div>
            </div>
          </div>
        </section>

        {/* Bento 3: Antigravity AI Console (Right Sidebar) */}
        <section className="col-span-4 row-span-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-xl shadow-2xl flex flex-col relative overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/5 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent flex flex-col gap-4 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px]" />
            <div className="flex items-center justify-between z-10">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Rocket className="w-4 h-4 text-purple-400" /> Antigravity AI Command
              </h2>
              <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-semibold bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">Active</span>
            </div>
            
            {/* Agent Selector (Floating Orbs style) */}
            <div className="flex gap-2 z-10 p-1 bg-black/40 rounded-xl border border-white/5">
              <AgentTab id="pm" active={activeAgent} set={setActiveAgent} icon={<Brain className="w-4 h-4" />} label="Project Mgr" color="text-purple-400" bg="bg-purple-400/20" />
              <AgentTab id="reviewer" active={activeAgent} set={setActiveAgent} icon={<Search className="w-4 h-4" />} label="Reviewer" color="text-blue-400" bg="bg-blue-400/20" />
              <AgentTab id="cifixer" active={activeAgent} set={setActiveAgent} icon={<Zap className="w-4 h-4" />} label="CI Fixer" color="text-green-400" bg="bg-green-400/20" />
            </div>
          </div>

          {/* Trajectory Stream */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-hide" ref={chatRef}>
            {trajectory.map((msg, idx) => (
              <div key={msg.id} className={`flex gap-3 ${msg.agent === 'User' ? 'flex-row-reverse' : 'flex-row'} items-end group`}>
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  {msg.agent === 'User' ? <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500" /> : <BotIcon agent={msg.agent} status={msg.status} />}
                </div>
                
                <div className={`flex flex-col gap-1 max-w-[80%] ${msg.agent === 'User' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-gray-500 font-mono tracking-wider">{msg.agent} • {msg.time}</span>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed border ${
                    msg.agent === 'User' 
                      ? 'bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border-cyan-500/30 text-cyan-50 rounded-br-sm'
                      : 'bg-white/5 border-white/5 text-gray-300 rounded-bl-sm'
                  }`}>
                    {msg.action}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Context/Action Chips */}
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
             <ActionChip icon={<LayoutGrid />} label="/plan-sprint" />
             <ActionChip icon={<GitMerge />} label="/semantic-merge" />
             <ActionChip icon={<Terminal />} label="/fix-ci" />
          </div>

          {/* Chat Input */}
          <div className="p-4 pt-2 border-t border-white/5 bg-black/20">
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input 
                type="text" 
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder="Give autonomous instructions..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all shadow-inner"
              />
              <button 
                type="submit" 
                disabled={!inputMessage.trim()}
                className="absolute right-2 w-8 h-8 flex items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-cyan-500/20 disabled:hover:text-cyan-400"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </section>

      </main>
      
      {/* CSS for custom scrollbars and animations */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes dash { to { stroke-dashoffset: -100; } }
      `}} />
    </div>
  );
}

// Subcomponents

function NavIcon({ icon, id, active, set, tooltip }: any) {
  const isActive = active === id;
  return (
    <button 
      onClick={() => set(id)}
      className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group ${
        isActive ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
      }`}
      title={tooltip}
    >
      {icon}
      {isActive && (
        <span className="absolute -left-1 w-1 h-6 rounded-r-md bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
      )}
    </button>
  );
}

function AgentTab({ id, active, set, icon, label, color, bg }: any) {
  const isActive = active === id;
  return (
    <button
      onClick={() => set(id)}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
        isActive ? `${bg} ${color} shadow-inner` : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
      }`}
    >
      {icon} <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function BotIcon({ agent, status }: any) {
  let Color = "text-purple-400";
  let Icon = Brain;
  if (agent.includes("Reviewer")) { Color = "text-blue-400"; Icon = Search; }
  if (agent.includes("Fixer")) { Color = "text-green-400"; Icon = Zap; }

  return (
    <div className={`relative ${Color}`}>
      <Icon className="w-4 h-4" />
      {status === 'running' && (
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 bg-current`}></span>
        </span>
      )}
    </div>
  );
}

function ActionChip({ icon, label }: any) {
  return (
    <button className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer">
      {React.cloneElement(icon, { className: "w-3 h-3" })} {label}
    </button>
  );
}
