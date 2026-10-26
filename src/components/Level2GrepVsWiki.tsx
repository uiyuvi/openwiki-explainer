import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Check, AlertCircle, XCircle } from 'lucide-react';
import { StrategyType, TaskType } from '../types';
import { SIMULATION_DATA } from '../data/simulationData';

export const Level2GrepVsWiki: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<TaskType>('architectural');
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>('openwiki_mcp');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [packetPos, setPacketPos] = useState<{ x: number; y: number; opacity: number }>({ x: 190, y: 155, opacity: 0 });

  const activeData = SIMULATION_DATA[selectedTask][selectedStrategy];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startSimulation = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveStepIndex(0);
    setIsPlaying(true);

    let currentStep = 0;
    const maxSteps = activeData.steps.length;

    animatePacket();

    timerRef.current = setInterval(() => {
      currentStep++;
      if (currentStep < maxSteps) {
        setActiveStepIndex(currentStep);
        animatePacket();
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsPlaying(false);
      }
    }, 1100);
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPlaying(false);
    } else {
      startSimulation();
    }
  };

  const stepForward = () => {
    if (activeStepIndex < activeData.steps.length - 1) {
      setActiveStepIndex(prev => prev + 1);
      animatePacket();
    }
  };

  const stepBackward = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(prev => prev - 1);
      animatePacket();
    }
  };

  const animatePacket = () => {
    setPacketPos({ x: 190, y: 155, opacity: 1 });
    setTimeout(() => {
      setPacketPos({ x: 370, y: 155, opacity: 1 });
    }, 300);

    setTimeout(() => {
      const destY = selectedStrategy === 'openwiki_mcp' ? 240 : selectedStrategy === 'two_line_short' ? 155 : 70;
      setPacketPos({ x: 550, y: destY, opacity: 1 });
    }, 650);

    setTimeout(() => {
      setPacketPos(prev => ({ ...prev, opacity: 0 }));
    }, 1000);
  };

  useEffect(() => {
    startSimulation();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [selectedTask, selectedStrategy]);

  const verdictStyles = {
    emerald: {
      border: 'border-[#A7F3D0]',
      bg: 'bg-[#ECFDF5]',
      text: 'text-[#065F46]',
      icon: <Check className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
    },
    amber: {
      border: 'border-[#FDE68A]',
      bg: 'bg-[#FFFBEB]',
      text: 'text-[#92400E]',
      icon: <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
    },
    rose: {
      border: 'border-[#FECACA]',
      bg: 'bg-[#FEF2F2]',
      text: 'text-[#991B1B]',
      icon: <XCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
    }
  }[activeData.verdictTone];

  return (
    <section id="grep-vs-wiki" className="space-y-6 scroll-mt-20 py-10 border-b border-[#E7E5E0]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#92400E] font-semibold">
            <span>Level 02</span>
            <span>·</span>
            <span>Live Agent Packet Simulator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917] mt-1">
            Grep vs. Wiki: Live Monorepo Execution Trace
          </h2>
          <p className="text-sm text-[#57534E] mt-1 max-w-3xl leading-relaxed">
            Watch the coding agent evaluate a developer command under different documentation strategies. Compare how tokens, tool calls, and file reads flow across the system.
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5 bg-[#F5F5F0] border border-[#E7E5E0] p-1 rounded-md self-start md:self-auto shrink-0">
          <button
            onClick={stepBackward}
            disabled={activeStepIndex === 0}
            title="Previous Step"
            className="p-1.5 rounded hover:bg-white text-[#78716C] hover:text-[#1C1917] disabled:opacity-40 cursor-pointer"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={togglePlay}
            title={isPlaying ? "Pause" : "Play"}
            className="px-2.5 py-1 text-xs font-semibold bg-white border border-[#D6D3CD] rounded text-[#1C1917] flex items-center gap-1 hover:bg-[#FDFDFC] cursor-pointer shadow-xs"
          >
            {isPlaying ? <Pause className="w-3 h-3 text-[#B45309]" /> : <Play className="w-3 h-3 text-[#059669]" />}
            <span>{isPlaying ? 'Pause' : 'Replay'}</span>
          </button>
          <button
            onClick={stepForward}
            disabled={activeStepIndex === activeData.steps.length - 1}
            title="Next Step"
            className="p-1.5 rounded hover:bg-white text-[#78716C] hover:text-[#1C1917] disabled:opacity-40 cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Control Switchboard (Editorial 2-Step Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Step 1: Workload Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-3 bg-[#F5F5F0] border border-[#E7E5E0] rounded-lg p-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-[#1C1917]">Step 1: Choose Developer Task</span>
            <span className="font-mono text-[#78716C] text-[11px]">Workload Profile</span>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setSelectedTask('trivial')}
              className={`w-full text-left p-3 rounded border transition-all cursor-pointer ${
                selectedTask === 'trivial'
                  ? 'bg-white border-[#B45309] shadow-xs'
                  : 'bg-[#FDFDFC] border-[#E7E5E0] hover:border-[#D6D3CD]'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#1C1917]">A. Trivial Variable Rename</span>
                <span className="text-[10px] font-mono text-[#92400E] font-semibold">1 File</span>
              </div>
              <div className="text-xs font-mono text-[#57534E] mt-1">
                "Rename 'usr' to 'user' in apps/web/Header.tsx"
              </div>
              <p className="text-[11px] text-[#78716C] mt-1">
                Tests if OpenWiki adds useless overhead on tasks where architecture is irrelevant.
              </p>
            </button>

            <button
              onClick={() => setSelectedTask('architectural')}
              className={`w-full text-left p-3 rounded border transition-all cursor-pointer ${
                selectedTask === 'architectural'
                  ? 'bg-white border-[#B45309] shadow-xs'
                  : 'bg-[#FDFDFC] border-[#E7E5E0] hover:border-[#D6D3CD]'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#1C1917]">B. Cross-Package Monorepo Flow</span>
                <span className="text-[10px] font-mono text-[#047857] font-semibold">Cross-Module</span>
              </div>
              <div className="text-xs font-mono text-[#57534E] mt-1">
                "How does Reporter propagate retry events to Billing?"
              </div>
              <p className="text-[11px] text-[#78716C] mt-1">
                Tests how quickly the agent discovers cross-package flow without blind grep.
              </p>
            </button>
          </div>
        </div>

        {/* Step 2: Architecture Selector (7 cols) */}
        <div className="lg:col-span-7 space-y-3 bg-[#F5F5F0] border border-[#E7E5E0] rounded-lg p-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-[#1C1917]">Step 2: Choose Repository AGENTS.md Strategy</span>
            <span className="font-mono text-[#78716C] text-[11px]">4 Approaches</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={() => setSelectedStrategy('blind_grep')}
              className={`text-left p-3 rounded border transition-all cursor-pointer ${
                selectedStrategy === 'blind_grep'
                  ? 'bg-white border-[#DC2626] shadow-xs'
                  : 'bg-[#FDFDFC] border-[#E7E5E0] hover:border-[#D6D3CD]'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#1C1917]">1. Raw Code Only</span>
                <span className="text-[10px] font-mono text-[#991B1B] font-bold">Blind Grep</span>
              </div>
              <p className="text-[11px] text-[#57534E] mt-1">
                0 wiki lines in AGENTS.md. Agent executes sequential grep & read_file across packages.
              </p>
            </button>

            <button
              onClick={() => setSelectedStrategy('two_line_short')}
              className={`text-left p-3 rounded border transition-all cursor-pointer ${
                selectedStrategy === 'two_line_short'
                  ? 'bg-white border-[#D97706] shadow-xs'
                  : 'bg-[#FDFDFC] border-[#E7E5E0] hover:border-[#D6D3CD]'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#1C1917]">2. Shortened 2-Line</span>
                <span className="text-[10px] font-mono text-[#92400E] font-bold">No Guardrail</span>
              </div>
              <p className="text-[11px] text-[#57534E] mt-1">
                Bare path to quickstart.md. Triggers eager exploration reads on simple tasks.
              </p>
            </button>

            <button
              onClick={() => setSelectedStrategy('bloated_adr')}
              className={`text-left p-3 rounded border transition-all cursor-pointer ${
                selectedStrategy === 'bloated_adr'
                  ? 'bg-white border-[#DC2626] shadow-xs'
                  : 'bg-[#FDFDFC] border-[#E7E5E0] hover:border-[#D6D3CD]'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#1C1917]">3. Inlined 500-Line ADRs</span>
                <span className="text-[10px] font-mono text-[#991B1B] font-bold">Context Rot</span>
              </div>
              <p className="text-[11px] text-[#57534E] mt-1">
                Static prose inlined into AGENTS.md. Dilutes model attention and rots over time.
              </p>
            </button>

            <button
              onClick={() => setSelectedStrategy('openwiki_mcp')}
              className={`text-left p-3 rounded border transition-all cursor-pointer ${
                selectedStrategy === 'openwiki_mcp'
                  ? 'bg-white border-[#059669] shadow-xs ring-1 ring-[#10B981]/20'
                  : 'bg-[#FDFDFC] border-[#E7E5E0] hover:border-[#D6D3CD]'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#1C1917]">4. OpenWiki 12-Line + MCP</span>
                <span className="text-[10px] font-mono text-[#047857] font-bold">Just-in-Time</span>
              </div>
              <p className="text-[11px] text-[#57534E] mt-1">
                Negative guardrail preamble (~280 tokens cached) + on-demand local MCP queries.
              </p>
            </button>
          </div>
        </div>

      </div>

      {/* Real-Time Simulation Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#FDFDFC] border border-[#E7E5E0] rounded-xl p-5 shadow-xs">
        
        {/* Left 8 Cols: Architectural Flow Visualizer */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
          
          {/* Telemetry Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F5F5F0] border border-[#E7E5E0] rounded-md p-3 font-mono text-xs">
            <div>
              <div className="text-[10px] text-[#78716C] uppercase">Startup Cost</div>
              <div className="text-sm sm:text-base font-bold text-[#92400E] tabular-nums mt-0.5">
                {activeData.startupTokens} tok <span className="text-[10px] text-[#78716C] font-normal">({activeData.cachedStartupTokens} cached)</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#78716C] uppercase">Exploration Burn</div>
              <div className="text-sm sm:text-base font-bold text-[#1C1917] tabular-nums mt-0.5">
                {activeData.toolTokens.toLocaleString()} tok
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#78716C] uppercase">Tool Calls</div>
              <div className="text-sm sm:text-base font-bold text-[#1C1917] tabular-nums mt-0.5">
                {activeData.toolCalls} call{activeData.toolCalls === 1 ? '' : 's'}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#78716C] uppercase">Total Tokens</div>
              <div className={`text-sm sm:text-base font-bold tabular-nums mt-0.5 ${
                activeData.verdictTone === 'emerald' ? 'text-[#047857]' : activeData.verdictTone === 'amber' ? 'text-[#92400E]' : 'text-[#991B1B]'
              }`}>
                {activeData.totalTokens.toLocaleString()} tok
              </div>
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="relative bg-[#FAFAF9] border border-[#E7E5E0] rounded-md p-3 min-h-[310px] flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 740 310" className="w-full h-auto max-h-[310px] select-none font-mono">
              
              {/* Connector paths */}
              <path d="M 185 155 L 295 155" stroke="#CBD5E1" strokeWidth="2.5" fill="none" />
              <path
                d="M 435 130 C 485 130, 495 70, 545 70"
                stroke={selectedStrategy === 'blind_grep' || selectedStrategy === 'bloated_adr' ? '#DC2626' : '#CBD5E1'}
                strokeWidth="2.5"
                fill="none"
                className={selectedStrategy === 'blind_grep' ? 'flow-line-active' : ''}
              />
              <path
                d="M 435 155 L 545 155"
                stroke={selectedStrategy === 'two_line_short' ? '#D97706' : '#CBD5E1'}
                strokeWidth="2.5"
                fill="none"
                className={selectedStrategy === 'two_line_short' ? 'flow-line-active' : ''}
              />
              <path
                d="M 435 180 C 485 180, 495 240, 545 240"
                stroke={selectedStrategy === 'openwiki_mcp' ? '#059669' : '#CBD5E1'}
                strokeWidth="2.5"
                fill="none"
                className={selectedStrategy === 'openwiki_mcp' ? 'flow-line-active' : ''}
              />

              {/* Node 1: Startup AGENTS.md */}
              <g transform="translate(15, 75)">
                <rect width="170" height="160" rx="6" fill="#FFFFFF" stroke="#B45309" strokeWidth="1.5" />
                <text x="12" y="24" fill="#78716C" fontSize="9" fontWeight="700">STARTUP CONTEXT</text>
                <text x="12" y="44" fill="#1C1917" fontSize="12" fontWeight="700" fontFamily="Plus Jakarta Sans">Root AGENTS.md</text>
                <rect x="10" y="54" width="150" height="66" rx="4" fill="#F5F5F0" stroke="#E7E5E0" />
                <text x="16" y="72" fill="#78350F" fontSize="9" fontWeight="600">{activeData.agentsTitle}</text>
                <text x="16" y="88" fill="#57534E" fontSize="8.5">{activeData.agentsLines[0] || ''}</text>
                <text x="16" y="104" fill="#78716C" fontSize="8.5">{activeData.agentsLines[1] || ''}</text>
                <rect x="10" y="128" width="150" height="22" rx="3" fill="#FEF3C7" stroke="#FDE68A" />
                <text x="85" y="143" textAnchor="middle" fill="#78350F" fontSize="9" fontWeight="600">
                  {selectedStrategy === 'openwiki_mcp' ? 'Prompt Cache Active' : 'No wiki caching'}
                </text>
              </g>

              {/* Node 2: Coding Agent Brain */}
              <g transform="translate(295, 95)">
                <rect width="140" height="120" rx="8" fill="#FFFFFF" stroke="#57534E" strokeWidth="1.5" />
                <circle cx="70" cy="38" r="16" fill="#F5F5F0" stroke="#B45309" strokeWidth="1.2" />
                <text x="70" y="43" textAnchor="middle" fill="#78350F" fontSize="12" fontWeight="700">AI</text>
                <text x="70" y="74" textAnchor="middle" fill="#1C1917" fontSize="12" fontWeight="700" fontFamily="Plus Jakarta Sans">Coding Agent</text>
                <text x="70" y="92" textAnchor="middle" fill="#57534E" fontSize="9.5">
                  {activeData.steps[activeStepIndex]?.status || 'Evaluating'}
                </text>
                <rect x="18" y="98" width="104" height="14" rx="2" fill="#E7E5E0" />
                <text x="70" y="108" textAnchor="middle" fill="#44403C" fontSize="8">
                  Step {activeStepIndex + 1} of {activeData.steps.length}
                </text>
              </g>

              {/* Node 3: Monorepo Raw Packages */}
              <g transform="translate(545, 25)">
                <rect width="180" height="88" rx="6" fill="#FFFFFF" stroke={selectedStrategy === 'blind_grep' ? '#DC2626' : '#CBD5E1'} strokeWidth="1.5" />
                <text x="12" y="22" fill="#1C1917" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans">Monorepo Packages</text>
                <text x="12" y="38" fill="#57534E" fontSize="9">packages/reporter/*</text>
                <text x="12" y="52" fill="#57534E" fontSize="9">packages/billing/*</text>
                <text x="12" y="72" fill={selectedStrategy === 'blind_grep' ? '#DC2626' : '#78716C'} fontSize="9" fontWeight="600">
                  {selectedStrategy === 'blind_grep' ? '7 blind grep calls' : 'Targeted file edit'}
                </text>
              </g>

              {/* Node 4: Raw Markdown File */}
              <g transform="translate(545, 125)">
                <rect width="180" height="60" rx="6" fill="#FFFFFF" stroke={selectedStrategy === 'two_line_short' ? '#D97706' : '#CBD5E1'} strokeWidth="1.5" />
                <text x="12" y="22" fill="#1C1917" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans">openwiki/quickstart.md</text>
                <text x="12" y="42" fill={selectedStrategy === 'two_line_short' ? '#B45309' : '#78716C'} fontSize="9" fontWeight="600">
                  {selectedStrategy === 'two_line_short' ? 'Eager read triggered' : 'Bypassed by rule'}
                </text>
              </g>

              {/* Node 5: OpenWiki MCP Server */}
              <g transform="translate(545, 195)">
                <rect width="180" height="90" rx="6" fill="#FFFFFF" stroke={selectedStrategy === 'openwiki_mcp' ? '#059669' : '#CBD5E1'} strokeWidth="1.5" />
                <text x="12" y="22" fill="#047857" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans">OpenWiki MCP Server</text>
                <text x="12" y="38" fill="#57534E" fontSize="9">.bob/mcp.json (Model-Free)</text>
                <text x="12" y="52" fill="#292524" fontSize="9">openwiki_search()</text>
                <text x="12" y="68" fill="#059669" fontSize="9" fontWeight="600">openwiki_read(#section)</text>
              </g>

              {/* Animated token packet */}
              <circle
                cx={packetPos.x}
                cy={packetPos.y}
                r="6"
                fill={selectedStrategy === 'openwiki_mcp' ? '#059669' : selectedStrategy === 'two_line_short' ? '#D97706' : '#DC2626'}
                opacity={packetPos.opacity}
              />
            </svg>
          </div>

          {/* Verdict Box */}
          <div className={`p-4 rounded border ${verdictStyles.bg} ${verdictStyles.border} flex items-start gap-3`}>
            {verdictStyles.icon}
            <div className="space-y-1">
              <div className={`text-xs font-bold ${verdictStyles.text}`}>
                {activeData.verdictTitle}
              </div>
              <p className="text-xs text-[#44403C] leading-relaxed">
                {activeData.verdictDesc}
              </p>
            </div>
          </div>

        </div>

        {/* Right 4 Cols: Step-by-Step Execution Trace Log */}
        <div className="lg:col-span-4 bg-[#F5F5F0] border border-[#E7E5E0] rounded-lg p-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#E7E5E0] pb-2">
              <span className="text-xs font-semibold text-[#1C1917]">Execution Trace</span>
              <span className="text-xs font-mono text-[#92400E] font-semibold">
                Step {activeStepIndex + 1} of {activeData.steps.length}
              </span>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {activeData.steps.map((step, idx) => {
                const isCurrent = idx === activeStepIndex;
                const isDone = idx < activeStepIndex;
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded border transition-all ${
                      isCurrent
                        ? 'bg-white border-[#B45309] shadow-xs ring-1 ring-[#D97706]/30'
                        : isDone
                        ? 'bg-white/80 border-[#E7E5E0] text-[#57534E]'
                        : 'bg-[#EFEFEA]/50 border-transparent text-[#A8A29E] opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isCurrent ? 'text-[#1C1917]' : 'text-[#57534E]'}`}>
                        {step.title}
                      </span>
                      <span className="font-mono text-[11px] tabular-nums text-[#92400E] font-semibold">
                        {step.tokens}
                      </span>
                    </div>
                    <p className="text-xs text-[#57534E] font-mono mt-1 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Token Burn Bar */}
          <div className="pt-3 border-t border-[#E7E5E0] space-y-1.5 mt-4">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#78716C]">Session Token Burn</span>
              <span className="font-bold text-[#1C1917] tabular-nums">
                {activeData.totalTokens.toLocaleString()} tok
              </span>
            </div>
            <div className="w-full h-2 bg-[#E7E5E0] rounded-sm overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  activeData.verdictTone === 'emerald'
                    ? 'bg-[#059669]'
                    : activeData.verdictTone === 'amber'
                    ? 'bg-[#D97706]'
                    : 'bg-[#DC2626]'
                }`}
                style={{ width: `${Math.min(100, Math.max(5, activeData.barPercent))}%` }}
              />
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
