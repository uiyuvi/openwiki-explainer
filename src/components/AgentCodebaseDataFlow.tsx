import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Play, Pause, RotateCcw, ChevronRight, ChevronLeft, 
  Terminal, Zap, Activity, ArrowLeftRight, Maximize2, Minimize2
} from 'lucide-react';
import { useGesture } from '../hooks/useGesture';

export interface FlowStep {
  stepIndex: number;
  stage: 'prompt' | 'agents' | 'routing' | 'discovery' | 'patch';
  title: string;
  shortLabel: string;
  description: string;
  wirePayload: string;
  protocol: string;
  outboundSignal: string;
  inboundSignal: string;
  tokensDelta: number;
  cumulativeTokens: number;
  latencyMs: number;
  activePath: 'prompt_to_agent' | 'agent_to_routing' | 'routing_to_codebase' | 'codebase_to_agent' | 'patch_committed';
}

export function AgentCodebaseDataFlow() {
  const [openWikiEnabled, setOpenWikiEnabled] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [fitMobileWidth, setFitMobileWidth] = useState<boolean>(false);

  const diagramGesture = useGesture();

  // Path 1: Without OpenWiki (Chaotic Broadcast Ripgrep Storm across 25 packages)
  const unoptimizedSteps: FlowStep[] = [
    {
      stepIndex: 0,
      stage: 'prompt',
      title: "1. Prompt Ingested into Agent Context",
      shortLabel: "Prompt",
      description: "Developer prompts: 'Fix retry error handling in Billing reporter'. The agent ingests the prompt into its active context window (420 tokens).",
      wirePayload: "USER_PROMPT: 'Fix retry error handling in Billing reporter dispatcher'\nCONTEXT_WINDOW: 420 / 200,000 tokens",
      protocol: "PROMPT_INGEST",
      outboundSignal: "User task prompt (420 tok) → Agent Context",
      inboundSignal: "Awaiting architecture lookup from AGENTS.md",
      tokensDelta: 0,
      cumulativeTokens: 420,
      latencyMs: 15,
      activePath: 'prompt_to_agent'
    },
    {
      stepIndex: 1,
      stage: 'agents',
      title: "2. AGENTS.md Checked (0 Architecture Guidance)",
      shortLabel: "AGENTS.md",
      description: "Agent reads root AGENTS.md. It contains formatting guidelines but ZERO architecture maps or package indices. The agent has no idea where Billing reporter logic lives.",
      wirePayload: "AGENTS.md: Found basic linter rules.\nARCH_GUIDE: NULL (No wiki or index specified). Agent must discover code blindly.",
      protocol: "INSTRUCTION_INGEST",
      outboundSignal: "Agent inspects AGENTS.md for module index",
      inboundSignal: "NULL architecture guidance returned (0 pointers)",
      tokensDelta: 0,
      cumulativeTokens: 420,
      latencyMs: 12,
      activePath: 'agent_to_routing'
    },
    {
      stepIndex: 2,
      stage: 'routing',
      title: "3. Ripgrep Broadcast Storm Across 25 Packages",
      shortLabel: "Grep Storm",
      description: "Having no mental map, the agent fans out ripgrep searches across all 25 monorepo packages simultaneously, flooding the codebase with blind queries.",
      wirePayload: "DISPATCH: grep('Reporter') across 25 packages (500k LoC)\nHITTING: packages/logger, packages/legacy-reporter, packages/billing, packages/auth, packages/reporter...",
      protocol: "POSIX_RIPGREP",
      outboundSignal: "Broadcast grep('Reporter') → 25 Monorepo Packages",
      inboundSignal: "43 unranked file matches flooding back to Agent (+3,100 tok)",
      tokensDelta: 3100,
      cumulativeTokens: 3520,
      latencyMs: 480,
      activePath: 'routing_to_codebase'
    },
    {
      stepIndex: 3,
      stage: 'discovery',
      title: "4. Candidate File Flood & False-Positive Context Bloat",
      shortLabel: "Context Bloat",
      description: "43 candidate files match. The codebase streams thousands of lines of irrelevant legacy files back into the agent's context window, bloating memory by +11,800 tokens.",
      wirePayload: "INSPECT_FILE: packages/legacy-reporter/index.ts (4.2k tok)\nINSPECT_FILE: packages/logger/reporter.ts (3.8k tok)\nINSPECT_FILE: packages/billing/events.ts (3.8k tok)",
      protocol: "TOOL_READ_FILE",
      outboundSignal: "Sequential read_file() calls across 5 packages",
      inboundSignal: "← 4,800+ raw lines (+11,800 tok false-positive bloat) into Agent",
      tokensDelta: 11800,
      cumulativeTokens: 15320,
      latencyMs: 2200,
      activePath: 'codebase_to_agent'
    },
    {
      stepIndex: 4,
      stage: 'patch',
      title: "5. Target Finally Found & Patched (High Burn: 22.8k tok)",
      shortLabel: "Patch Done",
      description: "After 6 bidirectional round-trips and 35 seconds of latency, the agent finally locates dispatcher.ts#L42-L47 and applies the circuit breaker patch.",
      wirePayload: "TARGET_LOCATED: packages/reporter/src/dispatcher.ts#L42-L47\nPATCH: replace exponential_backoff with circuit_breaker\nTOTAL_SESSION_BURN: 22,820 tokens ($0.068) over 6 tool iterations (~35s).",
      protocol: "UNIFIED_PATCH",
      outboundSignal: "Apply circuit_breaker patch → dispatcher.ts#L42-L47",
      inboundSignal: "← Patch verified after 6 round-trips (22,820 total tokens)",
      tokensDelta: 7500,
      cumulativeTokens: 22820,
      latencyMs: 1400,
      activePath: 'patch_committed'
    }
  ];

  // Path 2: With OpenWiki (Bidirectional Grounded Context & Claim Highway)
  const optimizedSteps: FlowStep[] = [
    {
      stepIndex: 0,
      stage: 'prompt',
      title: "1. Prompt Ingested into Agent Context",
      shortLabel: "Prompt",
      description: "Developer prompts: 'Fix retry error handling in Billing reporter'. The agent ingests the prompt into its active context window (420 tokens).",
      wirePayload: "USER_PROMPT: 'Fix retry error handling in Billing reporter dispatcher'\nCONTEXT_WINDOW: 420 / 200,000 tokens",
      protocol: "PROMPT_INGEST",
      outboundSignal: "User task prompt (420 tok) → Agent Context",
      inboundSignal: "AGENTS.md prefix cache warm (@ 28 tok)",
      tokensDelta: 0,
      cumulativeTokens: 420,
      latencyMs: 15,
      activePath: 'prompt_to_agent'
    },
    {
      stepIndex: 1,
      stage: 'agents',
      title: "2. AGENTS.md Directs Agent to openwiki/ Index",
      shortLabel: "AGENTS.md",
      description: "OpenWiki (--init) injects a 12-line managed block in AGENTS.md (~28 tok cached): 'Do not preload at task start. Use openwiki_search / openwiki_read or openwiki/quickstart.md when needed.'",
      wirePayload: "AGENTS.md MANAGED BLOCK: '<!-- OPENWIKI:START --> Optional just-in-time context. Do not enumerate or preload at task start. Use openwiki_search & openwiki_read.'\nCACHE_STATUS: Prefix cache HIT (90% discount).",
      protocol: "INSTRUCTION_INGEST",
      outboundSignal: "Agent reads AGENTS.md routing directive",
      inboundSignal: "← Just-in-time pointer to openwiki/ (+28 tok cached)",
      tokensDelta: 28,
      cumulativeTokens: 448,
      latencyMs: 10,
      activePath: 'agent_to_routing'
    },
    {
      stepIndex: 2,
      stage: 'routing',
      title: "3. Bidirectional OpenWiki Query & Claim Lookup (<50ms)",
      shortLabel: "Wiki Highway",
      description: "Guided by AGENTS.md, the agent calls openwiki_search('Billing reporter retry') (or checks openwiki/quickstart.md) to locate the exact architecture section.",
      wirePayload: "MCP_CALL: tools/call openwiki_search('Billing reporter retry error propagation')\nMATCHED_PAGE: openwiki/architecture/billing-reporter.md (entrypoint: openwiki/quickstart.md)\nCLAIM_SIDECAR: openwiki/.claims/claim_102.json (42ms local stdio).",
      protocol: "OPENWIKI_LOOKUP",
      outboundSignal: "openwiki_search('Billing reporter retry') → openwiki/",
      inboundSignal: "← Section anchor & claim_102 index (+180 tok)",
      tokensDelta: 180,
      cumulativeTokens: 628,
      latencyMs: 42,
      activePath: 'routing_to_codebase'
    },
    {
      stepIndex: 3,
      stage: 'discovery',
      title: "4. Grounded Claim Provenance (repo://#L42-L47) Returned",
      shortLabel: "Claim Pointer",
      description: "OpenWiki returns openwiki_read section & claim_102.json with source URI repo://packages/reporter/src/dispatcher.ts#L42-L47 pinned to commit 9f82e1b.",
      wirePayload: "CLAIM_PAYLOAD: openwiki/.claims/claim_102.json {\n  'claim_id': 'claim_102',\n  'source': 'repo://packages/reporter/src/dispatcher.ts#L42-L47',\n  'fact': 'circuit_breaker_fast_fail (threshold: 5)',\n  'commit': '9f82e1b'\n}",
      protocol: "CLAIM_RETURN",
      outboundSignal: "Verify AST anchor repo://.../dispatcher.ts#L42-L47",
      inboundSignal: "← Claim coordinates returned to Agent (+440 tok)",
      tokensDelta: 440,
      cumulativeTokens: 1068,
      latencyMs: 25,
      activePath: 'codebase_to_agent'
    },
    {
      stepIndex: 4,
      stage: 'patch',
      title: "5. Surgical Bidirectional Read & Patch (94.7% Savings)",
      shortLabel: "Surgical Patch",
      description: "Using the claim coordinates, the agent reads ONLY lines 40–50 of dispatcher.ts (+132 tok) from the Codebase and commits the surgical patch in 1 round-trip.",
      wirePayload: "READ_RANGE: dispatcher.ts#L40-L50 (132 tok)\nPATCH: circuit_breaker applied cleanly.\nTOTAL_SESSION_BURN: 1,200 tokens ($0.0036). 94.7% savings vs 22,820 tokens.",
      protocol: "UNIFIED_PATCH",
      outboundSignal: "Surgical read(L40-50) & patch → dispatcher.ts",
      inboundSignal: "← +132 tok surgical context & claim sync confirmed (1,200 tok total)",
      tokensDelta: 132,
      cumulativeTokens: 1200,
      latencyMs: 35,
      activePath: 'patch_committed'
    }
  ];

  const steps = openWikiEnabled ? optimizedSteps : unoptimizedSteps;
  const activeStep = steps[currentStep] || steps[0];

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2100);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const handleToggle = (enabled: boolean) => {
    setOpenWikiEnabled(enabled);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  // Package Y coordinates in the SVG when !openWikiEnabled
  const packageNodes = [
    { name: 'packages/logger', note: '18 false matches', y: 96, isTarget: false, alert: true },
    { name: 'packages/legacy', note: 'Deprecated code', y: 142, isTarget: false, alert: true },
    { name: 'packages/billing', note: 'Wrong abstraction', y: 188, isTarget: false, alert: false },
    { name: 'packages/auth', note: 'Irrelevant files', y: 234, isTarget: false, alert: false },
    { name: 'packages/reporter', note: 'Found on hop #6', y: 280, isTarget: true, alert: false },
  ];

  return (
    <div className="border-2 border-black rounded-lg bg-white overflow-hidden shadow-xs font-mono text-xs space-y-0">
      
      {/* =================================================================== */}
      {/* 1. MASTER HEADER & TOGGLE SWITCH                                    */}
      {/* =================================================================== */}
      <div className="bg-zinc-100 p-3.5 sm:p-4 border-b border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Activity className="w-4 h-4 text-black animate-pulse" />
            <span className="font-bold tracking-wider text-black text-xs sm:text-sm uppercase">
              Agent &lt;--&gt; Codebase: Bidirectional Context &amp; Claim Flow
            </span>
            <span className="text-[11px] font-bold text-zinc-600">
              · {openWikiEnabled ? 'Grounded Memory Highway' : 'Unoptimized Blind Grep Storm'}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-600 max-w-3xl leading-relaxed">
            Observe the continuous bidirectional exchange between the <strong>Agent Runtime</strong> and the <strong>Codebase</strong>. 
            With <code className="bg-white px-1.5 py-0.5 border border-zinc-300 rounded font-bold text-black">openwiki/</code> enabled, 
            outbound queries return grounded AST claim coordinates (<code className="text-black font-bold">claim_102.json</code>) and surgical 10-line context instead of a 22,820-token file flood.
          </p>
        </div>

        {/* Master Toggle */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-zinc-300 shrink-0 shadow-xs">
          <button
            onClick={() => handleToggle(false)}
            className={`min-h-[42px] px-3.5 py-1.5 rounded transition-all cursor-pointer font-bold flex flex-col items-center justify-center text-center ${
              !openWikiEnabled
                ? 'bg-black text-white shadow-xs'
                : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
            }`}
          >
            <span className="text-xs">Without OpenWiki</span>
            <span className="text-[10px] opacity-75 font-normal">6 Hops · 22.8k tok</span>
          </button>

          <button
            onClick={() => handleToggle(true)}
            className={`min-h-[42px] px-3.5 py-1.5 rounded transition-all cursor-pointer font-bold flex flex-col items-center justify-center text-center ${
              openWikiEnabled
                ? 'bg-black text-white shadow-xs'
                : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
            }`}
          >
            <div className="flex items-center gap-1 text-xs">
              <Zap className="w-3.5 h-3.5 text-white fill-current" />
              <span>With OpenWiki</span>
            </div>
            <span className="text-[10px] opacity-75 font-normal">1 Hop · 1.2k tok</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. PLAYBACK CONTROLS & STEP NAVIGATION                              */}
      {/* =================================================================== */}
      <div className="bg-zinc-50 border-b border-zinc-200 px-3 sm:px-4 py-3 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        {/* Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="min-h-[40px] px-3 py-1.5 bg-black text-white rounded font-bold hover:bg-zinc-800 transition-all cursor-pointer flex items-center gap-1.5 text-xs"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Auto Play Flow'}</span>
          </button>

          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="min-h-[40px] px-3 py-1.5 bg-white border border-zinc-300 text-black rounded font-bold hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 text-xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className="min-h-[40px] px-3 py-1.5 bg-white border border-zinc-300 text-black rounded font-bold hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 text-xs"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleReset}
            className="min-h-[40px] px-2.5 py-1.5 text-zinc-600 hover:text-black rounded transition-all cursor-pointer flex items-center gap-1 ml-1 text-xs"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Step Selector Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full py-0.5">
          {steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentStep(idx);
                setIsPlaying(false);
              }}
              className={`min-h-[36px] px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer border shrink-0 ${
                idx === currentStep 
                  ? 'bg-black text-white border-black shadow-xs' 
                  : idx < currentStep 
                    ? 'bg-zinc-200 text-zinc-800 border-zinc-300' 
                    : 'bg-white text-zinc-500 border-zinc-200 hover:text-black'
              }`}
            >
              {idx + 1}. {s.shortLabel}
            </button>
          ))}
        </div>

        {/* Clean Unboxed Telemetry Metadata */}
        <div className="flex items-center gap-2 text-xs text-zinc-600">
          <span>STEP <strong className="text-black">{currentStep + 1}/{steps.length}</strong></span>
          <span aria-hidden="true">·</span>
          <span>BURN <strong className="text-black tabular-nums">{activeStep.cumulativeTokens.toLocaleString()} tok</strong></span>
          <span aria-hidden="true">·</span>
          <strong className="text-black">
            {openWikiEnabled ? '94.7% SAVINGS' : '22.8k TOK BURN'}
          </strong>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. BIDIRECTIONAL VISUAL FLOW STAGE (UNBROKEN PULSING CONDUITS)      */}
      {/* =================================================================== */}
      <div className="p-3 sm:p-5 bg-white space-y-4">
        
        <div className="border border-zinc-300 rounded-lg p-3 sm:p-4 bg-zinc-50 relative overflow-hidden space-y-3">
          
          {/* Header Info Bar */}
          <div className="flex flex-wrap items-center justify-between pb-2.5 border-b border-zinc-200 text-xs gap-2">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-black shrink-0" />
              <span className="font-bold text-black text-xs sm:text-sm">
                {activeStep.title}
              </span>
            </div>
            <div className="flex items-center gap-3 text-zinc-600 text-xs">
              <span>Round-Trip: <strong className="text-black">{openWikiEnabled ? '1 of 1' : `${Math.min(currentStep + 1, 6)} of 6`}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Step Latency: <strong className="text-black">{activeStep.latencyMs}ms</strong></span>
            </div>
          </div>

          {/* Mobile-Friendly Bidirectional Telemetry Banner (Always visible without horizontal scrolling) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white p-2.5 rounded border border-zinc-300 text-[11px]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-bold text-black shrink-0 uppercase tracking-tight">Outbound (Agent → Code):</span>
              <span className="text-zinc-700 truncate font-sans">{activeStep.outboundSignal}</span>
            </div>
            <div className="flex items-center gap-2 min-w-0 sm:border-l sm:border-zinc-200 sm:pl-2.5">
              <span className="font-bold text-black shrink-0 uppercase tracking-tight">Inbound (Code → Agent):</span>
              <span className="text-zinc-700 truncate font-sans">{activeStep.inboundSignal}</span>
            </div>
          </div>

          {/* Mobile Viewport Control Strip */}
          <div className="flex items-center justify-between gap-2 text-[11px] text-zinc-600 py-0.5">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-black animate-ping" />
              <span className="font-bold text-black">
                {diagramGesture.isDragging ? '⇄ PANNING DIAGRAM...' : 'LIVE BIDIRECTIONAL PULSE ACTIVE'}
              </span>
              <span className="hidden sm:inline text-zinc-500">
                · Solid unbroken lines with continuous outbound &amp; inbound scanning beams
              </span>
            </div>

            {/* Mobile Fit vs Pan Toggle */}
            <button
              type="button"
              onClick={() => setFitMobileWidth(!fitMobileWidth)}
              className="sm:hidden min-h-[34px] px-2.5 py-1 bg-white border border-zinc-300 rounded text-black font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              {fitMobileWidth ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
              <span>{fitMobileWidth ? 'Large Pan View' : 'Fit Mobile Screen'}</span>
            </button>
          </div>

          {/* ================================================================= */}
          {/* INTERACTIVE SVG FLOW CANVAS (UNBROKEN LINES + PULSING SCAN BEAMS) */}
          {/* ================================================================= */}
          <div
            {...diagramGesture.bind()}
            className="relative w-full overflow-x-auto pb-1 touch-pan-x select-none cursor-grab active:cursor-grabbing"
          >
            <div
              className={`${
                fitMobileWidth ? 'w-full min-w-0 h-[270px] sm:h-[380px]' : 'min-w-[860px] h-[360px] sm:h-[385px]'
              } bg-white rounded-lg border-2 border-zinc-300 relative shadow-xs transition-all`}
            >
              <svg 
                className="w-full h-full select-none" 
                viewBox="0 0 920 385" 
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* High-contrast solid arrowheads */}
                  <marker id="arrow-solid-black" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#000000" />
                  </marker>

                  <marker id="arrow-solid-zinc" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#52525b" />
                  </marker>

                  <marker id="arrow-solid-green" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#15803d" />
                  </marker>

                  <marker id="arrow-solid-red" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#b91c1c" />
                  </marker>

                  {/* Subtle technical grid */}
                  <pattern id="flow-grid-clean" width="24" height="24" patternUnits="userSpaceOnUse">
                    <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#f4f4f5" strokeWidth="1" />
                  </pattern>
                </defs>

                <rect width="100%" height="100%" fill="url(#flow-grid-clean)" />

                {/* =========================================================== */}
                {/* TOP BIDIRECTIONAL ARCH: DIRECT AGENT <--> CODEBASE EXCHANGE */}
                {/* Unbroken overhead highway showing end-to-end context/patch  */}
                {/* =========================================================== */}
                <g>
                  {/* Gentle pulsing aura on overhead arch */}
                  <motion.path
                    d="M 278 96 C 278 24, 808 24, 808 96"
                    fill="none"
                    stroke={openWikiEnabled ? "#15803d" : "#b91c1c"}
                    strokeWidth="9"
                    strokeLinecap="round"
                    animate={{ opacity: currentStep >= 3 ? [0.08, 0.26, 0.08] : [0.04, 0.12, 0.04] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {/* Solid unbroken base overhead arch */}
                  <path
                    d="M 278 96 C 278 24, 808 24, 808 96"
                    fill="none"
                    stroke={currentStep >= 3 ? "#000000" : "#71717a"}
                    strokeWidth={currentStep >= 3 ? "3" : "2.2"}
                    markerStart="url(#arrow-solid-black)"
                    markerEnd="url(#arrow-solid-black)"
                  />
                  {/* Scanning pulse beam sweeping across overhead arch */}
                  <motion.path
                    d="M 808 96 C 808 24, 278 24, 278 96"
                    fill="none"
                    stroke={openWikiEnabled ? "#16a34a" : "#dc2626"}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray="36 180"
                    animate={{ strokeDashoffset: [216, 0] }}
                    transition={{ duration: 2.0, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Overhead Bidirectional Callout Label */}
                  <rect x="385" y="18" width="315" height="24" rx="4" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
                  <text x="542" y="34" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#000000">
                    {openWikiEnabled
                      ? 'AGENT ⇄ CODEBASE: SURGICAL READ (L40-50) & CLAIM SYNC (+132 TOK)'
                      : 'AGENT ⇄ CODEBASE: 6 ROUND-TRIPS & 43-FILE CONTEXT FLOOD (+11.8K TOK)'}
                  </text>
                </g>

                {/* =========================================================== */}
                {/* CONDUIT 1: DEVELOPER PROMPT (136,188) -> AGENT (200,188)    */}
                {/* =========================================================== */}
                <g>
                  {/* Pulsing aura */}
                  <motion.path
                    d="M 136 188 L 200 188"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="9"
                    strokeLinecap="round"
                    animate={{ opacity: currentStep === 0 ? [0.12, 0.32, 0.12] : [0.04, 0.1, 0.04] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {/* Unbroken solid line */}
                  <path 
                    d="M 136 188 L 200 188" 
                    fill="none" 
                    stroke="#000000" 
                    strokeWidth="3.5"
                    markerEnd="url(#arrow-solid-black)"
                  />
                  {/* Scanning pulse overlay */}
                  <motion.path
                    d="M 136 188 L 200 188"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray="16 48"
                    animate={{ strokeDashoffset: [64, 0] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Traveling prompt packet */}
                  <motion.circle
                    r="5.5"
                    fill="#000000"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    animate={{ cx: [138, 196], cy: [188, 188] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                  />
                </g>

                {openWikiEnabled ? (
                  // ==========================================================
                  // WITH OPENWIKI: DUAL-LANE BIDIRECTIONAL UNBROKEN CONDUITS
                  // Agent (x=355) <--> OpenWiki (x=455..620) <--> Codebase (x=715)
                  // Upper Lane (y=164): Outbound Query & Surgical File Read/Patch
                  // Lower Lane (y=214): Inbound Grounded Claim & Code Context
                  // ==========================================================
                  <>
                    {/* ------------------------------------------------------- */}
                    {/* SEGMENT A: AGENT RUNTIME (355) <--> OPENWIKI (455)      */}
                    {/* ------------------------------------------------------- */}
                    {/* Upper Lane Aura: Agent -> OpenWiki (Outbound Query) */}
                    <motion.path
                      d="M 355 164 L 455 164"
                      fill="none"
                      stroke="#000000"
                      strokeWidth="9"
                      animate={{ opacity: [0.08, 0.25, 0.08] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Upper Lane Solid Unbroken Line */}
                    <path 
                      d="M 355 164 L 455 164" 
                      fill="none" 
                      stroke="#000000" 
                      strokeWidth="3.5"
                      markerEnd="url(#arrow-solid-black)"
                    />
                    {/* Upper Lane Scanning Beam */}
                    <motion.path
                      d="M 355 164 L 455 164"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeDasharray="22 78"
                      animate={{ strokeDashoffset: [100, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                    />
                    <text x="405" y="153" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#000000">
                      QUERY →
                    </text>

                    {/* Lower Lane Aura: OpenWiki -> Agent (Inbound Claim Coordinates) */}
                    <motion.path
                      d="M 455 214 L 355 214"
                      fill="none"
                      stroke="#15803d"
                      strokeWidth="9"
                      animate={{ opacity: [0.1, 0.28, 0.1] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                    />
                    {/* Lower Lane Solid Unbroken Line */}
                    <path 
                      d="M 455 214 L 355 214" 
                      fill="none" 
                      stroke="#15803d" 
                      strokeWidth="3.5"
                      markerEnd="url(#arrow-solid-green)"
                    />
                    {/* Lower Lane Scanning Beam */}
                    <motion.path
                      d="M 455 214 L 355 214"
                      fill="none"
                      stroke="#4ade80"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeDasharray="22 78"
                      animate={{ strokeDashoffset: [100, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                    />
                    <text x="405" y="230" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#15803d">
                      ← CLAIM_102
                    </text>

                    {/* ------------------------------------------------------- */}
                    {/* SEGMENT B: OPENWIKI (620) <--> CODEBASE (715)           */}
                    {/* ------------------------------------------------------- */}
                    {/* Upper Lane Aura: OpenWiki -> Codebase (Surgical Target Pin) */}
                    <motion.path
                      d="M 620 164 L 715 164"
                      fill="none"
                      stroke="#000000"
                      strokeWidth="9"
                      animate={{ opacity: [0.08, 0.25, 0.08] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                    />
                    {/* Upper Lane Solid Unbroken Line */}
                    <path 
                      d="M 620 164 L 715 164" 
                      fill="none" 
                      stroke="#000000" 
                      strokeWidth="3.5"
                      markerEnd="url(#arrow-solid-black)"
                    />
                    {/* Upper Lane Scanning Beam */}
                    <motion.path
                      d="M 620 164 L 715 164"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeDasharray="22 73"
                      animate={{ strokeDashoffset: [95, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                    />
                    <text x="667" y="153" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#000000">
                      PIN #L42-47 →
                    </text>

                    {/* Lower Lane Aura: Codebase -> OpenWiki (AST Hash & Context) */}
                    <motion.path
                      d="M 715 214 L 620 214"
                      fill="none"
                      stroke="#15803d"
                      strokeWidth="9"
                      animate={{ opacity: [0.1, 0.28, 0.1] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                    />
                    {/* Lower Lane Solid Unbroken Line */}
                    <path 
                      d="M 715 214 L 620 214" 
                      fill="none" 
                      stroke="#15803d" 
                      strokeWidth="3.5"
                      markerEnd="url(#arrow-solid-green)"
                    />
                    {/* Lower Lane Scanning Beam */}
                    <motion.path
                      d="M 715 214 L 620 214"
                      fill="none"
                      stroke="#4ade80"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeDasharray="22 73"
                      animate={{ strokeDashoffset: [95, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                    />
                    <text x="667" y="230" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#15803d">
                      ← AST 9f82e1b
                    </text>

                    {/* ------------------------------------------------------- */}
                    {/* TRAVELING BIDIRECTIONAL DATA PACKETS (WITH OPENWIKI)    */}
                    {/* ------------------------------------------------------- */}
                    {/* Outbound Packet 1: Agent -> OpenWiki */}
                    <motion.circle
                      r="5.5"
                      fill="#000000"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      animate={{ cx: [358, 450], cy: [164, 164] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Outbound Packet 2: OpenWiki -> Codebase */}
                    <motion.circle
                      r="5.5"
                      fill="#000000"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      animate={{ cx: [623, 710], cy: [164, 164] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    />
                    {/* Inbound Claim Packet 1: Codebase -> OpenWiki */}
                    <motion.circle
                      r="5.5"
                      fill="#15803d"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      animate={{ cx: [710, 623], cy: [214, 214] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                    />
                    {/* Inbound Claim Packet 2: OpenWiki -> Agent */}
                    <motion.circle
                      r="5.5"
                      fill="#15803d"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      animate={{ cx: [450, 358], cy: [214, 214] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    />

                    {/* Bottom Return Context Loop: Codebase (808,280) -> Agent (278,280) */}
                    <motion.path
                      d="M 808 280 C 808 352, 278 352, 278 280"
                      fill="none"
                      stroke="#15803d"
                      strokeWidth="8"
                      animate={{ opacity: currentStep >= 3 ? [0.1, 0.26, 0.1] : [0.04, 0.1, 0.04] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <path
                      d="M 808 280 C 808 352, 278 352, 278 280"
                      fill="none"
                      stroke={currentStep >= 3 ? "#15803d" : "#71717a"}
                      strokeWidth="2.8"
                      markerEnd="url(#arrow-solid-green)"
                    />
                    <motion.path
                      d="M 808 280 C 808 352, 278 352, 278 280"
                      fill="none"
                      stroke="#4ade80"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="32 180"
                      animate={{ strokeDashoffset: [212, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                    />
                    <rect x="400" y="330" width="285" height="22" rx="4" fill="#ffffff" stroke="#15803d" strokeWidth="1.5" />
                    <text x="542" y="345" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#15803d">
                      ← VERIFIED CLAIM &amp; SURGICAL CONTEXT (1,200 TOK TOTAL)
                    </text>
                  </>
                ) : (
                  // ==========================================================
                  // WITHOUT OPENWIKI: UNBROKEN FULL MESH ACROSS ALL 5 PACKAGES
                  // Every single package connects cleanly on BOTH left & right
                  // sides + return false-positive flood arc back to Agent!
                  // ==========================================================
                  <>
                    {packageNodes.map((pkg, idx) => {
                      const leftPath = `M 355 188 C 398 188, 412 ${pkg.y}, 455 ${pkg.y}`;
                      const rightPath = `M 620 ${pkg.y} C 662 ${pkg.y}, 675 188, 715 188`;
                      const isPrimary = pkg.isTarget;

                      return (
                        <g key={pkg.name}>
                          {/* Left Conduit Aura (Agent -> Package) */}
                          <motion.path
                            d={leftPath}
                            fill="none"
                            stroke={isPrimary ? "#000000" : "#71717a"}
                            strokeWidth="7"
                            animate={{ opacity: [0.06, 0.2, 0.06] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: idx * 0.12 }}
                          />
                          {/* Left Solid Unbroken Conduit (Agent -> Package) */}
                          <path
                            d={leftPath}
                            fill="none"
                            stroke={isPrimary ? "#000000" : "#52525b"}
                            strokeWidth={isPrimary ? "3.2" : "2.4"}
                            markerEnd={isPrimary ? "url(#arrow-solid-black)" : "url(#arrow-solid-zinc)"}
                          />
                          {/* Left Scanning Beam */}
                          <motion.path
                            d={leftPath}
                            fill="none"
                            stroke={isPrimary ? "#38bdf8" : "#a1a1aa"}
                            strokeWidth="2.8"
                            strokeLinecap="round"
                            strokeDasharray="18 90"
                            animate={{ strokeDashoffset: [108, 0] }}
                            transition={{ duration: 1.3 + idx * 0.1, repeat: Infinity, ease: "linear" }}
                          />

                          {/* Right Conduit Aura (Package -> Target Codebase) */}
                          <motion.path
                            d={rightPath}
                            fill="none"
                            stroke={isPrimary ? "#000000" : "#71717a"}
                            strokeWidth="7"
                            animate={{ opacity: [0.06, 0.2, 0.06] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 + idx * 0.12 }}
                          />
                          {/* Right Solid Unbroken Conduit (Package -> Target Codebase) */}
                          <path
                            d={rightPath}
                            fill="none"
                            stroke={isPrimary ? "#000000" : "#52525b"}
                            strokeWidth={isPrimary ? "3.2" : "2.4"}
                            markerEnd={isPrimary ? "url(#arrow-solid-black)" : "url(#arrow-solid-zinc)"}
                          />
                          {/* Right Scanning Beam */}
                          <motion.path
                            d={rightPath}
                            fill="none"
                            stroke={isPrimary ? "#38bdf8" : "#a1a1aa"}
                            strokeWidth="2.8"
                            strokeLinecap="round"
                            strokeDasharray="18 90"
                            animate={{ strokeDashoffset: [108, 0] }}
                            transition={{ duration: 1.3 + idx * 0.1, repeat: Infinity, ease: "linear" }}
                          />

                          {/* Traveling Outbound Grep Packet */}
                          <motion.circle
                            r={isPrimary ? "5" : "4"}
                            fill={isPrimary ? "#000000" : "#52525b"}
                            stroke="#ffffff"
                            strokeWidth="1"
                            animate={{ cx: [358, 452], cy: [188, pkg.y] }}
                            transition={{ duration: 1.2 + idx * 0.12, repeat: Infinity, ease: "easeInOut" }}
                          />
                          {/* Traveling Inbound/Forward Inspection Packet */}
                          <motion.circle
                            r={isPrimary ? "5" : "4"}
                            fill={isPrimary ? "#000000" : "#dc2626"}
                            stroke="#ffffff"
                            strokeWidth="1"
                            animate={{ cx: [712, 622], cy: [188, pkg.y] }}
                            transition={{ duration: 1.25 + idx * 0.1, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
                          />
                        </g>
                      );
                    })}

                    {/* Bottom Return Context Bloat Loop: Codebase (808,280) -> Agent (278,280) */}
                    <motion.path
                      d="M 808 280 C 808 352, 278 352, 278 280"
                      fill="none"
                      stroke="#b91c1c"
                      strokeWidth="9"
                      animate={{ opacity: [0.1, 0.28, 0.1] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <path
                      d="M 808 280 C 808 352, 278 352, 278 280"
                      fill="none"
                      stroke="#b91c1c"
                      strokeWidth="3"
                      markerEnd="url(#arrow-solid-red)"
                    />
                    <motion.path
                      d="M 808 280 C 808 352, 278 352, 278 280"
                      fill="none"
                      stroke="#f87171"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeDasharray="36 160"
                      animate={{ strokeDashoffset: [196, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                    />
                    <rect x="385" y="330" width="315" height="22" rx="4" fill="#ffffff" stroke="#b91c1c" strokeWidth="1.5" />
                    <text x="542" y="345" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#b91c1c">
                      ← FALSE-POSITIVE CONTEXT FLOOD RETURNED (22,820 TOK BURN)
                    </text>
                  </>
                )}

                {/* =========================================================== */}
                {/* NODE CARDS & SOLID CONNECTION PORT TERMINALS                */}
                {/* =========================================================== */}

                {/* NODE 1: DEVELOPER PROMPT (x=16, y=118, w=120, h=140) */}
                <g transform="translate(16, 118)">
                  <rect 
                    width="120" 
                    height="140" 
                    rx="8" 
                    fill="#ffffff" 
                    stroke={activeStep.stage === 'prompt' ? "#000000" : "#52525b"} 
                    strokeWidth={activeStep.stage === 'prompt' ? "3.5" : "2"}
                  />
                  <rect x="8" y="8" width="104" height="24" rx="4" fill="#000000" />
                  <text x="60" y="24" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#ffffff">1. PROMPT</text>
                  
                  <text x="60" y="50" textAnchor="middle" fontSize="11.5" fontWeight="bold" fill="#000000">User Task</text>
                  <text x="60" y="66" textAnchor="middle" fontSize="10" fill="#52525b">420 tokens</text>
                  
                  <rect x="8" y="78" width="104" height="50" rx="4" fill="#f4f4f5" stroke="#d4d4d8" />
                  <text x="60" y="98" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#000000">&ldquo;Fix retry in</text>
                  <text x="60" y="114" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#000000">Billing reporter&rdquo;</text>
                </g>
                {/* Port Terminal on Node 1 Right Edge (136, 188) */}
                <circle cx="136" cy="188" r="5" fill="#000000" stroke="#ffffff" strokeWidth="1.5" />

                {/* NODE 2: AGENT RUNTIME + AGENTS.MD (x=200, y=96, w=155, h=184) */}
                <g transform="translate(200, 96)">
                  <rect 
                    width="155" 
                    height="184" 
                    rx="8" 
                    fill="#ffffff" 
                    stroke={activeStep.stage === 'agents' ? "#000000" : "#52525b"} 
                    strokeWidth={activeStep.stage === 'agents' ? "3.5" : "2"}
                  />
                  <rect x="8" y="8" width="139" height="25" rx="4" fill="#000000" />
                  <text x="77.5" y="24" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#ffffff">2. AGENT RUNTIME</text>
                  
                  <text x="77.5" y="50" textAnchor="middle" fontSize="11.5" fontWeight="bold" fill="#000000">Coding Agent</text>
                  <text x="77.5" y="66" textAnchor="middle" fontSize="10" fill="#52525b">Context Window</text>
                  
                  {/* Embedded AGENTS.md instruction box */}
                  <rect 
                    x="8" 
                    y="78" 
                    width="139" 
                    height="94" 
                    rx="4" 
                    fill={openWikiEnabled ? "#18181b" : "#f4f4f5"} 
                    stroke={openWikiEnabled ? "#000000" : "#d4d4d8"}
                    strokeWidth="1.5"
                  />
                  <text 
                    x="77.5" 
                    y="98" 
                    textAnchor="middle" 
                    fontSize="10.5" 
                    fontWeight="bold" 
                    fill={openWikiEnabled ? "#ffffff" : "#000000"}
                  >
                    AGENTS.md
                  </text>
                  <text 
                    x="77.5" 
                    y="118" 
                    textAnchor="middle" 
                    fontSize="9.5" 
                    fontWeight="bold"
                    fill={openWikiEnabled ? "#38bdf8" : "#b91c1c"}
                  >
                    {openWikiEnabled ? '→ Query openwiki/' : '0 Arch Guidance'}
                  </text>
                  <text 
                    x="77.5" 
                    y="136" 
                    textAnchor="middle" 
                    fontSize="9" 
                    fill={openWikiEnabled ? "#e4e4e7" : "#52525b"}
                  >
                    {openWikiEnabled ? 'Prefix Cached (28 tok)' : 'Blind Grep Required'}
                  </text>
                  <text 
                    x="77.5" 
                    y="156" 
                    textAnchor="middle" 
                    fontSize="9" 
                    fontWeight="bold"
                    fill={openWikiEnabled ? "#4ade80" : "#dc2626"}
                  >
                    {openWikiEnabled ? '⇄ 1 Surgical Hop' : '⇄ 6 Brute-Force Hops'}
                  </text>
                </g>
                {/* Port Terminals on Node 2 */}
                <circle cx="200" cy="188" r="5" fill="#000000" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="278" cy="96" r="5" fill="#000000" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="278" cy="280" r="5" fill={openWikiEnabled ? "#15803d" : "#b91c1c"} stroke="#ffffff" strokeWidth="1.5" />
                {openWikiEnabled ? (
                  <>
                    <circle cx="355" cy="164" r="5" fill="#000000" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="355" cy="214" r="5" fill="#15803d" stroke="#ffffff" strokeWidth="1.5" />
                  </>
                ) : (
                  <circle cx="355" cy="188" r="5.5" fill="#000000" stroke="#ffffff" strokeWidth="1.5" />
                )}

                {/* NODE 3: ROUTING / MEMORY LAYER */}
                {openWikiEnabled ? (
                  // OpenWiki Memory Layer Node (x=455, y=96, w=165, h=184)
                  <g>
                    <g transform="translate(455, 96)">
                      <rect 
                        width="165" 
                        height="184" 
                        rx="8" 
                        fill="#ffffff" 
                        stroke={activeStep.stage === 'routing' || activeStep.stage === 'discovery' ? "#000000" : "#52525b"} 
                        strokeWidth={activeStep.stage === 'routing' || activeStep.stage === 'discovery' ? "3.5" : "2"}
                      />
                      <rect x="8" y="8" width="149" height="25" rx="4" fill="#000000" />
                      <text x="82.5" y="24" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#ffffff">3. OPENWIKI MEMORY</text>
                      
                      <text x="82.5" y="50" textAnchor="middle" fontSize="11.5" fontWeight="bold" fill="#000000">openwiki/ Index</text>
                      <text x="82.5" y="66" textAnchor="middle" fontSize="10" fill="#52525b">Bidirectional Claims</text>
                      
                      <rect x="8" y="78" width="149" height="94" rx="4" fill="#f4f4f5" stroke="#d4d4d8" strokeWidth="1.5" />
                      <text x="82.5" y="98" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#000000">claim_102.json</text>
                      <text x="82.5" y="116" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#15803d">⇄ dispatcher.ts</text>
                      <text x="82.5" y="134" textAnchor="middle" fontSize="9" fill="#52525b">Lines 42–47 (9f82e1b)</text>
                      <text x="82.5" y="156" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#000000">AST Claim Verified</text>
                    </g>
                    {/* Solid Port Terminals on OpenWiki Node */}
                    <circle cx="455" cy="164" r="5" fill="#000000" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="455" cy="214" r="5" fill="#15803d" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="620" cy="164" r="5" fill="#000000" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="620" cy="214" r="5" fill="#15803d" stroke="#ffffff" strokeWidth="1.5" />
                  </g>
                ) : (
                  // Unoptimized 25 Monorepo Packages Stack (x=455, y=46, w=165, h=262)
                  <g>
                    <g transform="translate(455, 46)">
                      <rect 
                        width="165" 
                        height="262" 
                        rx="8" 
                        fill="#ffffff" 
                        stroke="#000000" 
                        strokeWidth="2.5"
                      />
                      <rect x="8" y="6" width="149" height="22" rx="4" fill="#000000" />
                      <text x="82.5" y="21" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ffffff">3. 25 MONOREPO PKGS</text>

                      {packageNodes.map((pkg) => {
                        const localY = pkg.y - 46 - 19;
                        return (
                          <g key={pkg.name} transform={`translate(8, ${localY})`}>
                            <rect
                              width="149"
                              height="38"
                              rx="4"
                              fill={pkg.isTarget ? "#18181b" : "#f4f4f5"}
                              stroke={pkg.isTarget ? "#000000" : "#d4d4d8"}
                              strokeWidth="1.5"
                            />
                            <text
                              x="74.5"
                              y="16"
                              textAnchor="middle"
                              fontSize="9.5"
                              fontWeight="bold"
                              fill={pkg.isTarget ? "#ffffff" : "#18181b"}
                            >
                              {pkg.name}
                            </text>
                            <text
                              x="74.5"
                              y="30"
                              textAnchor="middle"
                              fontSize="8.5"
                              fontWeight="bold"
                              fill={pkg.isTarget ? "#4ade80" : pkg.alert ? "#dc2626" : "#52525b"}
                            >
                              {pkg.note}
                            </text>
                          </g>
                        );
                      })}
                    </g>

                    {/* Solid Port Terminals on Both Sides of Every Package Row */}
                    {packageNodes.map((pkg) => (
                      <React.Fragment key={`ports-${pkg.name}`}>
                        <circle
                          cx="455"
                          cy={pkg.y}
                          r="4.5"
                          fill={pkg.isTarget ? "#000000" : "#52525b"}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                        <circle
                          cx="620"
                          cy={pkg.y}
                          r="4.5"
                          fill={pkg.isTarget ? "#000000" : "#52525b"}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                      </React.Fragment>
                    ))}
                  </g>
                )}

                {/* NODE 4: TARGET CODEBASE (x=715, y=96, w=188, h=184) */}
                <g transform="translate(715, 96)">
                  <rect 
                    width="188" 
                    height="184" 
                    rx="8" 
                    fill="#ffffff" 
                    stroke={activeStep.stage === 'patch' ? "#000000" : "#52525b"} 
                    strokeWidth={activeStep.stage === 'patch' ? "3.5" : "2"}
                  />
                  <rect x="8" y="8" width="172" height="25" rx="4" fill="#000000" />
                  <text x="94" y="24" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#ffffff">4. TARGET CODEBASE</text>
                  
                  <text x="94" y="50" textAnchor="middle" fontSize="11.5" fontWeight="bold" fill="#000000">dispatcher.ts</text>
                  <text x="94" y="66" textAnchor="middle" fontSize="10" fill="#52525b">Lines 42–47 (Circuit Breaker)</text>
                  
                  <rect x="8" y="78" width="172" height="94" rx="4" fill="#f4f4f5" stroke="#d4d4d8" strokeWidth="1.5" />
                  <text x="94" y="98" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#000000">
                    {openWikiEnabled ? 'Surgical 10-Line Exchange' : '4,800+ Lines Flooded'}
                  </text>
                  <text x="94" y="118" textAnchor="middle" fontSize="9.5" fill="#52525b">
                    {openWikiEnabled ? '⇄ +132 tokens context' : '⇄ +11,800 tokens bloat'}
                  </text>
                  <text x="94" y="138" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill={openWikiEnabled ? "#15803d" : "#b91c1c"}>
                    {openWikiEnabled ? '✓ 94.7% TOKEN SAVINGS' : '⚠️ 22,820 TOK BURNED'}
                  </text>
                  <text x="94" y="158" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#000000">
                    {openWikiEnabled ? 'Claim & Code in Sync' : 'No Persistent Memory'}
                  </text>
                </g>
                {/* Port Terminals on Node 4 */}
                <circle cx="808" cy="96" r="5" fill="#000000" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="808" cy="280" r="5" fill={openWikiEnabled ? "#15803d" : "#b91c1c"} stroke="#ffffff" strokeWidth="1.5" />
                {openWikiEnabled ? (
                  <>
                    <circle cx="715" cy="164" r="5" fill="#000000" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="715" cy="214" r="5" fill="#15803d" stroke="#ffffff" strokeWidth="1.5" />
                  </>
                ) : (
                  <circle cx="715" cy="188" r="5.5" fill="#000000" stroke="#ffffff" strokeWidth="1.5" />
                )}

              </svg>
            </div>
          </div>

          {/* Detailed Callout Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-3.5 bg-white rounded border border-zinc-200 space-y-1">
              <div className="font-bold text-black flex items-center justify-between">
                <span>Active Step Explanation</span>
                <span className="text-[10px] text-zinc-500 font-mono">PROTOCOL · {activeStep.protocol}</span>
              </div>
              <p className="text-zinc-700 font-sans leading-relaxed text-xs">
                {activeStep.description}
              </p>
            </div>

            <div className="p-3.5 bg-white rounded border border-zinc-200 space-y-1">
              <div className="font-bold text-black flex items-center justify-between">
                <span>Bidirectional Context &amp; Claim Contrast</span>
                <span className="text-[10px] text-zinc-500">CUMULATIVE · {activeStep.cumulativeTokens.toLocaleString()} TOK</span>
              </div>
              <p className="text-zinc-600 font-sans leading-relaxed text-xs">
                {openWikiEnabled ? (
                  <>OpenWiki maintains an unbroken bidirectional circuit: the Agent queries <code className="text-black font-bold">openwiki/</code>, receives AST-verified <code className="text-black font-bold">claim_102.json</code> coordinates, and reads only 10 target lines from the Codebase.</>
                ) : (
                  <>Without OpenWiki, the Agent broadcasts ripgrep calls across all 25 packages and ingests 43 false-positive files back from the Codebase, burning 22,820 tokens over 6 round-trips.</>
                )}
              </p>
            </div>
          </div>

        </div>

        {/* =================================================================== */}
        {/* 4. WIRE-LEVEL DATA PACKET INSPECTION CONSOLE                        */}
        {/* =================================================================== */}
        <div className="border border-zinc-300 rounded bg-white overflow-hidden shadow-xs">
          
          <div className="bg-zinc-100 px-3.5 py-2.5 border-b border-zinc-200 flex flex-wrap items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-black" />
              <span className="font-bold text-black">DATA PACKET INSPECTION CONSOLE</span>
              <span className="text-zinc-500 text-[11px]">
                · STEP {currentStep + 1} OF {steps.length}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-zinc-500">WIRE CHANNEL:</span>
              <code className="bg-white px-1.5 py-0.5 border border-zinc-300 rounded text-black font-bold">
                {activeStep.protocol}
              </code>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 space-y-3 font-mono text-xs">
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center justify-between">
                <span>Raw Wire Payload</span>
                <span className="text-zinc-400 text-[10px]">stdio / JSON-RPC</span>
              </div>
              <div className="bg-zinc-900 text-zinc-100 p-3 rounded border border-black font-mono text-xs overflow-x-auto leading-relaxed whitespace-pre-wrap selection:bg-zinc-700">
                {activeStep.wirePayload}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-zinc-200 text-xs">
              <div className="bg-zinc-50 p-2.5 rounded border border-zinc-200">
                <span className="text-zinc-500 block text-[11px]">Step Token Delta:</span>
                <strong className="text-black text-xs font-mono">
                  {activeStep.tokensDelta > 0 ? `+${activeStep.tokensDelta.toLocaleString()} tok` : '0 tok (Cached/Local)'}
                </strong>
              </div>

              <div className="bg-zinc-50 p-2.5 rounded border border-zinc-200">
                <span className="text-zinc-500 block text-[11px]">Cumulative Tokens:</span>
                <strong className="text-black text-xs font-mono tabular-nums">
                  {activeStep.cumulativeTokens.toLocaleString()} tokens
                </strong>
              </div>

              <div className="bg-zinc-50 p-2.5 rounded border border-zinc-200">
                <span className="text-zinc-500 block text-[11px]">Bidirectional Efficiency:</span>
                <strong className={openWikiEnabled ? 'text-black font-bold' : 'text-zinc-700'}>
                  {openWikiEnabled ? '1 Round-Trip (Surgical)' : '6 Round-Trips (Trial & Error)'}
                </strong>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
