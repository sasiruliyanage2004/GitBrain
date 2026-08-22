import React, { useState, useRef } from "react";
import {
  Search, GitBranch, GitCommitHorizontal, GitPullRequest, GitMerge,
  Terminal, Send, FileCode, Folder, Shield,
  Settings, Code2, Zap, Brain, Rocket,
  Network, LayoutGrid, Cpu, Disc, Globe
} from "lucide-react";

/* ============================================================================
   GitBrain (Synapse AI) — Matte Professional Next-Level Edition
   Clean, sophisticated, flat/matte design language (Linear/Apple Pro style)
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    const userMsg = inputMessage;
    const processId = (Date.now() + 1).toString();
    
    setTrajectory(prev => [
      ...prev,
      { id: Date.now().toString(), agent: "User", time: new Date().toLocaleTimeString(), action: userMsg, status: "done" },
      { id: processId, agent: "PM Agent", time: new Date().toLocaleTimeString(), action: "Analyzing command and querying API Gateway...", status: "running" }
    ]);
    setInputMessage("");
    setTimeout(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, 100);

    try {
      const response = await fetch('http://localhost:8000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, repositoryState: "main-branch" })
      });
      const data = await response.json();
      
      setTrajectory(prev => 
        prev.map(item => item.id === processId ? { ...item, status: "done", action: "Response generated." } : item)
      );

      setTrajectory(prev => [
        ...prev,
        { id: Date.now().toString(), agent: "Antigravity Core", time: new Date().toLocaleTimeString(), action: data.reply || "Done.", status: "done" }
      ]);
      setTimeout(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, 100);

    } catch (error) {
      setTrajectory(prev => 
        prev.map(item => item.id === processId ? { ...item, status: "error", action: "Error: Could not connect to API Gateway on Port 8000. Is start-all.bat running?" } : item)
      );
    }
  };

  return (
    // bg-[#09090b] is a very deep matte zinc.
    <div className="h-[100dvh] w-full bg-[#09090b] text-[#A1A1AA] font-sans overflow-hidden flex flex-col-reverse md:flex-row relative z-0 selection:bg-indigo-500/30">
      
      {/* Matte Texture Overlay (Subtle noise/grain) */}
      <div 
        className="absolute inset-0 z-[-1] opacity-20 pointer-events-none" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />
      
      {/* 📌 Navigation Dock (Bottom on Mobile, Left on Desktop) */}
      <nav className="w-full h-16 md:w-16 md:h-full border-t md:border-t-0 md:border-r border-white/[0.04] bg-[#09090b] flex flex-row md:flex-col items-center justify-around md:justify-start md:py-6 md:gap-8 z-20 shrink-0">
        <div className="hidden md:flex w-9 h-9 rounded-lg bg-indigo-500/10 items-center justify-center border border-indigo-500/20 shrink-0">
          <Brain className="w-5 h-5 text-indigo-400" />
        </div>
        
        <div className="flex flex-row md:flex-col gap-2 md:gap-5 px-2 md:px-0 md:mt-4 w-full md:w-auto justify-around md:justify-center">
          <NavIcon icon={<Network />} id="neural-map" active={activeView} set={setActiveView} tooltip="Neural Map" />
          <NavIcon icon={<Code2 />} id="code" active={activeView} set={setActiveView} tooltip="Code Editor" />
          <NavIcon icon={<GitPullRequest />} id="prs" active={activeView} set={setActiveView} tooltip="Merge Engine" />
          <NavIcon icon={<Play />} id="ci" active={activeView} set={setActiveView} tooltip="CI Sandbox" />
          <NavIcon icon={<Shield />} id="security" active={activeView} set={setActiveView} tooltip="Security Audit" />
          <div className="md:hidden flex">
             <NavIcon icon={<Settings />} id="settings" active={activeView} set={setActiveView} tooltip="Settings" />
          </div>
        </div>

        <div className="hidden md:flex mt-auto mb-2">
          <NavIcon icon={<Settings />} id="settings" active={activeView} set={setActiveView} tooltip="Settings" />
        </div>
      </nav>

      {/* 🎛️ Main Area (Scrollable flex on Mobile, Bento Grid on Desktop) */}
      <main className="flex-1 h-full p-3 md:p-6 flex flex-col md:grid md:grid-cols-12 md:grid-rows-6 gap-3 md:gap-6 overflow-y-auto md:overflow-hidden z-10 pb-20 md:pb-6">
        
        {/* Bento 1: Header / Project Info */}
        <header className="md:col-span-8 md:row-span-1 rounded-xl bg-[#121214] border border-white/[0.04] p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 shadow-sm relative overflow-hidden shrink-0">
          <div className="flex items-center gap-3 md:gap-4 z-10">
            <div className="hidden sm:flex w-10 h-10 rounded-md bg-[#18181B] items-center justify-center border border-white/[0.04]">
              <Globe className="w-5 h-5 text-[#D4D4D8]" />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-medium text-[#FAFAFA] tracking-tight">Synapse AI <span className="text-[#71717A] font-normal hidden sm:inline">/ Core Services</span></h1>
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1 md:mt-0.5 text-[10px] md:text-xs text-[#71717A] tracking-wide">
                <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" /> main</span>
                <span className="flex items-center gap-1"><GitCommitHorizontal className="w-3 h-3" /> 4d572a9</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] md:text-xs text-indigo-400/80 border border-indigo-400/20 bg-indigo-400/5">Production</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 md:gap-3 z-10 w-full md:w-auto">
            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 rounded-lg bg-[#18181B] hover:bg-[#27272A] border border-white/[0.04] text-[11px] md:text-xs font-medium text-[#E4E4E7] transition-all flex items-center gap-2">
              <Disc className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Snapshot</span>
            </button>
            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 text-[11px] md:text-xs font-medium transition-all flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Deploy</span>
            </button>
          </div>
        </header>

        {/* Bento 2: Codebase Neural Map (Matte/Sophisticated Variant) */}
        <section className="hidden md:flex md:col-span-8 md:row-span-5 rounded-xl bg-[#121214] border border-white/[0.04] flex-col relative overflow-hidden shadow-sm shrink-0 min-h-[250px]">
          <div className="px-5 py-3 border-b border-white/[0.04] flex items-center justify-between bg-[#121214]">
            <h2 className="text-xs font-medium text-[#E4E4E7] uppercase tracking-widest flex items-center gap-2">
              <Network className="w-3.5 h-3.5 text-[#A1A1AA]" /> Architecture Map
            </h2>
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#27272A]" />
              <span className="w-2 h-2 rounded-full bg-[#27272A]" />
              <span className="w-2 h-2 rounded-full bg-[#3F3F46]" />
            </div>
          </div>
          
          <div className="flex-1 relative flex items-center justify-center p-8 bg-[#09090B]/50">
            {/* Elegant, thin, flat SVG lines */}
            <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
              <path d="M 200 150 Q 350 200 500 100 T 800 250" fill="transparent" stroke="#3F3F46" strokeWidth="1" strokeDasharray="4,4" className="animate-[dash_30s_linear_infinite]" />
              <path d="M 200 150 Q 300 400 600 350 T 800 250" fill="transparent" stroke="#27272A" strokeWidth="1" />
            </svg>

            {/* Nodes: Professional, flat, minimal */}
            <div className="absolute top-[20%] left-[20%] flex flex-col items-center gap-3 group cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-[#18181B] border border-white/[0.04] flex items-center justify-center group-hover:bg-[#27272A] transition-colors">
                <Folder className="w-5 h-5 text-[#A1A1AA]" />
              </div>
              <span className="text-[11px] text-[#71717A] tracking-wider group-hover:text-[#D4D4D8]">services/</span>
            </div>

            <div className="absolute top-[40%] left-[50%] flex flex-col items-center gap-3 group cursor-pointer z-10">
              <div className="w-14 h-14 rounded-lg bg-[#18181B] border border-indigo-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.05)]">
                <Brain className="w-6 h-6 text-indigo-400" />
              </div>
              <span className="text-xs font-medium text-[#E4E4E7] tracking-wide">ai-orchestrator</span>
              <div className="absolute -right-1 -top-1 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-[#121214]" />
            </div>

            <div className="absolute bottom-[20%] right-[30%] flex flex-col items-center gap-3 group cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-[#18181B] border border-white/[0.04] flex items-center justify-center group-hover:bg-[#27272A] transition-colors">
                <FileCode className="w-5 h-5 text-[#A1A1AA]" />
              </div>
              <span className="text-[11px] text-[#71717A] tracking-wider group-hover:text-[#D4D4D8]">SynapseApp.tsx</span>
            </div>

            <div className="absolute top-[60%] left-[25%] flex flex-col items-center gap-3 group cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-[#18181B] border border-white/[0.04] flex items-center justify-center group-hover:bg-[#27272A] transition-colors">
                <Cpu className="w-5 h-5 text-[#A1A1AA]" />
              </div>
              <span className="text-[11px] text-[#71717A] tracking-wider group-hover:text-[#D4D4D8]">ci-runner</span>
            </div>
            
            <div className="absolute inset-x-0 bottom-6 flex justify-center">
              <div className="px-4 py-2 rounded-md bg-[#18181B] border border-white/[0.04] flex items-center gap-3 text-[11px] text-[#71717A] tracking-wide">
                <Search className="w-3.5 h-3.5" /> Search neural map, files, or agents (Ctrl+K)
              </div>
            </div>
          </div>
        </section>

        {/* Bento 3: Antigravity AI Console (Matte Right Sidebar) */}
        <section className="flex-1 md:col-span-4 md:row-span-6 rounded-xl bg-[#121214] border border-white/[0.04] shadow-sm flex flex-col relative overflow-hidden shrink-0 min-h-[400px]">
          {/* Header */}
          <div className="px-4 md:px-5 py-3 md:py-4 border-b border-white/[0.04] bg-[#121214] flex flex-col gap-3 md:gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-[#FAFAFA] flex items-center gap-2">
                <Rocket className="w-4 h-4 text-[#A1A1AA]" /> AI Command Center
              </h2>
              <span className="text-[9px] uppercase tracking-widest text-indigo-400 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" /> Active
              </span>
            </div>
            
            {/* Agent Selector (Minimal, Flat Tabs) */}
            <div className="flex gap-1 p-1 bg-[#09090B] rounded-lg border border-white/[0.02]">
              <AgentTab id="pm" active={activeAgent} set={setActiveAgent} label="PM Agent" />
              <AgentTab id="reviewer" active={activeAgent} set={setActiveAgent} label="Reviewer" />
              <AgentTab id="cifixer" active={activeAgent} set={setActiveAgent} label="CI Fixer" />
            </div>
          </div>

          {/* Trajectory Stream */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 scrollbar-hide" ref={chatRef}>
            {trajectory.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.agent === 'User' ? 'flex-row-reverse' : 'flex-row'} items-start group`}>
                
                {msg.agent !== 'User' && (
                  <div className="w-6 h-6 rounded-md bg-[#18181B] border border-white/[0.04] flex items-center justify-center shrink-0 mt-1">
                    <BotIcon agent={msg.agent} status={msg.status} />
                  </div>
                )}
                
                <div className={`flex flex-col gap-1.5 max-w-[85%] ${msg.agent === 'User' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-[#52525B] font-medium tracking-wide uppercase">{msg.agent} • {msg.time}</span>
                  <div className={`py-2 px-3.5 text-[13px] leading-relaxed rounded-lg ${
                    msg.agent === 'User' 
                      ? 'bg-[#27272A] text-[#FAFAFA]'
                      : 'bg-[#18181B] text-[#D4D4D8] border border-white/[0.04]'
                  }`}>
                    {msg.action}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Context/Action Chips */}
          <div className="px-5 pb-3 flex gap-2 overflow-x-auto scrollbar-hide pt-2">
             <ActionChip icon={<LayoutGrid />} label="/snapshot" onClick={() => setInputMessage("/snapshot")} />
             <ActionChip icon={<GitMerge />} label="/semantic-merge" onClick={() => setInputMessage("/semantic-merge")} />
             <ActionChip icon={<Terminal />} label="/fix-issue" onClick={() => setInputMessage("/fix-issue")} />
          </div>

          {/* Chat Input */}
          <div className="p-4 pt-0 border-t border-white/[0.04] bg-[#121214] mt-2">
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input 
                type="text" 
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder="Instruct the AI system..." 
                className="w-full bg-[#09090B] border border-white/[0.06] rounded-lg py-2.5 pl-3 pr-10 text-sm text-[#FAFAFA] placeholder-[#52525B] focus:outline-none focus:border-indigo-500/30 transition-all"
              />
              <button 
                type="submit" 
                disabled={!inputMessage.trim()}
                className="absolute right-2 w-7 h-7 flex items-center justify-center rounded-md bg-[#18181B] text-[#A1A1AA] hover:bg-[#27272A] hover:text-[#FAFAFA] transition-colors disabled:opacity-40 disabled:hover:bg-[#18181B]"
              >
                <Send className="w-3.5 h-3.5" />
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
      className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 group ${
        isActive ? 'bg-[#18181B] text-[#FAFAFA] border border-white/[0.04]' : 'text-[#71717A] hover:text-[#D4D4D8] hover:bg-[#18181B]'
      }`}
      title={tooltip}
    >
      {React.cloneElement(icon, { className: "w-5 h-5" })}
      {isActive && (
        <span className="absolute -left-1.5 w-1 h-5 rounded-r-md bg-indigo-500" />
      )}
    </button>
  );
}

function AgentTab({ id, active, set, label }: any) {
  const isActive = active === id;
  return (
    <button
      onClick={() => set(id)}
      className={`flex-1 flex items-center justify-center py-1.5 px-2 rounded-md text-[11px] font-medium transition-all ${
        isActive ? 'bg-[#27272A] text-[#FAFAFA] shadow-sm' : 'text-[#71717A] hover:text-[#A1A1AA]'
      }`}
    >
      {label}
    </button>
  );
}

function BotIcon({ agent, status }: any) {
  let Icon = Brain;
  if (agent.includes("Reviewer")) Icon = Search;
  if (agent.includes("Fixer")) Icon = Zap;

  return (
    <div className="relative text-[#A1A1AA]">
      <Icon className="w-3.5 h-3.5" />
      {status === 'running' && (
        <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-indigo-400`}></span>
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500`}></span>
        </span>
      )}
    </div>
  );
}

function ActionChip({ icon, label, onClick }: any) {
  return (
    <button onClick={onClick} className="whitespace-nowrap flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#18181B] hover:bg-[#27272A] border border-white/[0.04] text-[11px] text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors cursor-pointer">
      {React.cloneElement(icon, { className: "w-3 h-3" })} {label}
    </button>
  );
}
