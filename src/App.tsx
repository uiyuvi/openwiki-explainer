import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, RotateCcw, FileCode, Check, AlertTriangle, 
  X, ArrowRight, Zap, RefreshCw, GitCommit, Layers, Cpu, BarChart2, ShieldAlert,
  Terminal, Search, Database, ChevronRight, Activity, Sliders, ShieldCheck, Lock, Server, Laptop, Ban, Copy,
  CheckCircle2, XCircle, FileText, CornerDownRight, MessageSquare
} from 'lucide-react';
import { StrategyType, TaskType } from './types';
import { SIMULATION_DATA } from './data/simulationData';
import { SCORECARD_QUESTIONS, computeScorecardVerdict } from './data/scorecardData';
import { AgentCodebaseDataFlow } from './components/AgentCodebaseDataFlow';
import { useGesture } from './hooks/useGesture';

export default function App() {
  // Navigation tab state: Intro Flow, Git-Diff CI, Benchmarks, Context Privacy, Decision Rubric
  const [activeTab, setActiveTab] = useState<'intro' | 'diff' | 'simulator' | 'flow' | 'rubric'>('intro');

  // Simulator & Benchmark Scenarios state
  const [selectedScenario, setSelectedScenario] = useState<'arch' | 'rename' | 'twoline' | 'keyword'>('arch');
  const [selectedTask, setSelectedTask] = useState<TaskType>('architectural');
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>('openwiki_mcp');
  const simData = SIMULATION_DATA[selectedTask][selectedStrategy];

  // Screen 2 (Variable Rename Trap) interactive state
  const [renameTurn, setRenameTurn] = useState<number>(2); // 1: Cold (280 tok), 2+: Cached (28 tok)
  const [amortizationRenamesCount, setAmortizationRenamesCount] = useState<number>(35);

  // Screen 3 (2-Line Path Trim Trap) interactive state
  const [twoLineViewMode, setTwoLineViewMode] = useState<'comparison' | 'trace'>('comparison');

  // Screen 4 (Keyword Mention Trap) interactive state
  const [keywordRegexInput, setKeywordRegexInput] = useState<string>('openwiki');
  const [simulatedMcpCallsCount, setSimulatedMcpCallsCount] = useState<number>(2);

  // Git-Diff Framer Motion state
  const [diffState, setDiffState] = useState<'stale' | 'updated'>('updated');
  const [diffViewMode, setDiffViewMode] = useState<'split' | 'unified'>('split');
  const [reindexingStep, setReindexingStep] = useState<number>(2); // 0: detect, 1: ast-parse, 2: claim-synced

  // Touch-friendly horizontal scroll gesture handlers for Git-Diff code panes
  const leftDiffGesture = useGesture<HTMLDivElement>();
  const rightDiffGesture = useGesture<HTMLDivElement>();
  const unifiedDiffGesture = useGesture<HTMLDivElement>();

  const activeDiffProgress =
    diffViewMode === 'split'
      ? Math.max(leftDiffGesture.scrollProgress, rightDiffGesture.scrollProgress)
      : unifiedDiffGesture.scrollProgress;

  const isDiffDragging =
    leftDiffGesture.isDragging || rightDiffGesture.isDragging || unifiedDiffGesture.isDragging;

  const handlePanDiffCode = (deltaPx: number) => {
    if (diffViewMode === 'split') {
      leftDiffGesture.scrollByDelta(deltaPx);
      rightDiffGesture.scrollByDelta(deltaPx);
    } else {
      unifiedDiffGesture.scrollByDelta(deltaPx);
    }
  };

  const handleScrubDiffCode = (percent: number) => {
    if (diffViewMode === 'split') {
      leftDiffGesture.scrollToPercent(percent);
      rightDiffGesture.scrollToPercent(percent);
    } else {
      unifiedDiffGesture.scrollToPercent(percent);
    }
  };

  // IDE and Enterprise Privacy state
  const [selectedIde, setSelectedIde] = useState<'cursor' | 'vscode' | 'windsurf' | 'jetbrains'>('cursor');
  const [copiedConfig, setCopiedConfig] = useState<boolean>(false);

  // Calculator state
  const [teamSize, setTeamSize] = useState<number>(5);
  const [trivialPerDay, setTrivialPerDay] = useState<number>(20);
  const [archPerDay, setArchPerDay] = useState<number>(3);
  const [promptCaching, setPromptCaching] = useState<boolean>(true);

  // Rubric state
  const [rubricAnswers, setRubricAnswers] = useState<Record<string, number>>({
    'repo-scale': 0,
    'task-profile': 1,
    'ci-budget': 0,
    'agent-frequency': 0,
    'doc-hygiene': 0
  });

  // Git-Diff scanning beam duration constants
  const SCAN_BEAM_DURATION_SEC = 0.65;
  const SCAN_BEAM_DURATION_MS = 650;

  // Diff trigger handler with animated steps matching the Git-Diff scanning beam duration
  const handleToggleDiff = (state: 'stale' | 'updated') => {
    setDiffState(state);
    if (state === 'updated') {
      setReindexingStep(0);
      setTimeout(() => setReindexingStep(1), 280);
      setTimeout(() => setReindexingStep(2), SCAN_BEAM_DURATION_MS);
    } else {
      setReindexingStep(0);
      setTimeout(() => setReindexingStep(1), 280);
      setTimeout(() => setReindexingStep(2), SCAN_BEAM_DURATION_MS);
    }
  };

  // Scenario selection handler
  const handleSelectScenario = (scenario: 'arch' | 'rename' | 'twoline' | 'keyword') => {
    setSelectedScenario(scenario);
    if (scenario === 'arch') {
      setSelectedTask('architectural');
      setSelectedStrategy('openwiki_mcp');
    } else if (scenario === 'rename') {
      setSelectedTask('trivial');
      setSelectedStrategy('openwiki_mcp');
    } else if (scenario === 'twoline') {
      setSelectedTask('trivial');
      setSelectedStrategy('two_line_short');
    } else if (scenario === 'keyword') {
      setSelectedTask('architectural');
      setSelectedStrategy('openwiki_mcp');
    }
  };

  // Calculator math
  const totalGrep = ((trivialPerDay * 420) + (archPerDay * 22400)) * teamSize;
  const openwikiStartup = promptCaching
    ? (trivialPerDay + archPerDay > 0 ? 280 + (trivialPerDay + archPerDay - 1) * 28 : 0)
    : (trivialPerDay + archPerDay) * 280;
  const totalOpenWiki = (((trivialPerDay * 420) + (archPerDay * 1200)) + openwikiStartup) * teamSize;
  const maxVal = Math.max(totalGrep, totalOpenWiki, 1000);
  const percentSaved = Math.round(((totalGrep - totalOpenWiki) / totalGrep) * 100);

  const verdict = computeScorecardVerdict(rubricAnswers);

  const navItems = [
    { id: 'intro' as const, label: 'Intro & Flow', icon: Activity },
    { id: 'diff' as const, label: 'Git-Diff & CI', icon: GitCommit },
    { id: 'simulator' as const, label: 'Packet Trace & Benchmarks', icon: Play },
    { id: 'flow' as const, label: 'Context & Privacy', icon: Layers },
    { id: 'rubric' as const, label: 'Decision Rubric', icon: BarChart2 }
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white pb-24 md:pb-12">
      
      {/* Desktop & Tablet Top Navigation */}
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-bold tracking-tight text-base sm:text-lg">OpenWiki Explainer</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop Nav Tabs */}
            <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive ? 'bg-black text-white font-bold' : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <a
              href="https://github.com/uiyuvi/openwiki-explainer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium border border-zinc-200 hover:border-black rounded transition-colors text-zinc-700 hover:text-black"
              title="GitHub repository: uiyuvi/openwiki-explainer"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Visual Laboratory */}
      <main className="max-w-6xl mx-auto px-4 py-4 sm:py-6 space-y-6">
        
        {/* ========================================================================= */}
        {/* TAB 0: INTRODUCTORY DATA FLOW ANIMATION (AGENT <--> CODEBASE)             */}
        {/* ========================================================================= */}
        {activeTab === 'intro' && <AgentCodebaseDataFlow />}
        
        {/* ========================================================================= */}
        {/* TAB 1: FRAMER MOTION GIT-DIFF VIEWER & LIVE CI MAPPING                    */}
        {/* ========================================================================= */}
        {activeTab === 'diff' && (
          <div className="space-y-4">
            
            {/* Visual State Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-3">
              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight">Git-Diff CI Claim Sync Simulator</h1>
                <p className="text-xs font-mono text-zinc-500 mt-0.5">
                  Visualizing how OpenWiki detects modified AST ranges and triggers surgical claim updates.
                </p>
              </div>

              {/* State Controls (Mobile-friendly min-h 48px touch targets) */}
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 bg-zinc-100 p-1 rounded border border-zinc-200 text-xs font-mono">
                <button
                  onClick={() => handleToggleDiff('stale')}
                  className={`min-h-[44px] sm:min-h-0 px-3 py-1.5 rounded transition-all cursor-pointer flex items-center justify-center text-center ${
                    diffState === 'stale' ? 'bg-black text-white font-bold shadow-xs' : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  State A: Stale (a41f90c)
                </button>
                <button
                  onClick={() => handleToggleDiff('updated')}
                  className={`min-h-[44px] sm:min-h-0 px-3 py-1.5 rounded transition-all cursor-pointer flex items-center justify-center text-center ${
                    diffState === 'updated' ? 'bg-black text-white font-bold shadow-xs' : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  State B: Merged (9f82e1b)
                </button>
              </div>
            </div>

            {/* =================================================================== */}
            {/* THE EXACT PROBLEM THIS SOLVES (EXECUTIVE CALLOUT)                   */}
            {/* =================================================================== */}
            <div className="border border-black bg-zinc-50 rounded-lg p-3 sm:p-4 font-mono text-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-1 border-b border-zinc-200 pb-1.5">
                <span className="font-bold uppercase tracking-wider text-black">
                  The Problem This Solves: Silent Doc Rot & Expensive Monorepo Re-indexing
                </span>
                <span className="bg-black text-white px-2 py-0.5 rounded text-[10px] font-bold">
                  PROBLEM VS SOLUTION
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] leading-relaxed pt-1">
                <div className="space-y-1">
                  <div className="font-bold text-zinc-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-zinc-400"></span>
                    <span>The Problem in Production Monorepos:</span>
                  </div>
                  <div className="text-zinc-600">
                    When an engineer modifies code in a PR (e.g. replacing exponential backoff with a circuit breaker), static markdown docs/ADRs silently rot. Re-indexing a 500k-line monorepo with an LLM on every commit would burn <strong>$50+ and 20 minutes per PR</strong>.
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-black flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-black"></span>
                    <span>OpenWiki's CI Solution:</span>
                  </div>
                  <div className="text-zinc-800">
                    OpenWiki runs an incremental AST git-diff in CI. It isolates <em>only the 4 modified lines</em> in <code className="bg-zinc-200 px-1 font-bold">dispatcher.ts</code>, invalidates only <code className="bg-zinc-200 px-1 font-bold">claim_102.json</code> in <strong>2 seconds for $0.001</strong>, and keeps all other packages 100% cached against Git commit hashes.
                  </div>
                </div>
              </div>
            </div>

            {/* Pipeline Stage Tracker */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 font-mono text-xs">
              <div className={`p-2 sm:p-2.5 rounded border transition-colors ${
                reindexingStep >= 0 ? 'bg-black text-white border-black font-semibold' : 'bg-zinc-50 text-zinc-400 border-zinc-200'
              }`}>
                <div className="text-[9px] sm:text-[10px] opacity-70">STAGE 01</div>
                <div className="truncate font-bold">1. Git Tree Diff</div>
                <div className="text-[10px] opacity-80 truncate">{diffState === 'updated' ? 'dispatcher.ts modified' : '0 changes'}</div>
              </div>
              <div className={`p-2 sm:p-2.5 rounded border transition-colors ${
                reindexingStep >= 1 ? 'bg-black text-white border-black font-semibold' : 'bg-zinc-50 text-zinc-400 border-zinc-200'
              }`}>
                <div className="text-[9px] sm:text-[10px] opacity-70">STAGE 02</div>
                <div className="truncate font-bold">2. AST Parser</div>
                <div className="text-[10px] opacity-80 truncate">{diffState === 'updated' ? 'L42-L47 isolated' : 'Idle'}</div>
              </div>
              <div className={`p-2 sm:p-2.5 rounded border transition-colors ${
                reindexingStep >= 2 ? 'bg-black text-white border-black font-semibold' : 'bg-zinc-50 text-zinc-400 border-zinc-200'
              }`}>
                <div className="text-[9px] sm:text-[10px] opacity-70">STAGE 03</div>
                <div className="truncate font-bold">3. Claim #102</div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`stage-hash-${diffState}`}
                    initial={{ opacity: 0, y: 1 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -1 }}
                    transition={{ duration: SCAN_BEAM_DURATION_SEC, ease: "easeInOut" }}
                    className="text-[10px] opacity-80 truncate font-mono"
                  >
                    {diffState === 'updated' ? 'Hash 9f82e1b' : 'Hash a41f90c'}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Interactive Git Diff Code Window with Touch-Friendly Horizontal Gesture Handler */}
            <div className="border border-zinc-300 rounded overflow-hidden bg-white shadow-xs">
              
              {/* File header strip */}
              <div className="bg-zinc-100 px-3 sm:px-4 py-2 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-1.5 sm:gap-2 truncate">
                  <span className="font-bold truncate">packages/reporter/src/dispatcher.ts</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`badge-${diffState}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: SCAN_BEAM_DURATION_SEC, ease: "easeInOut" }}
                      className="bg-zinc-200 text-zinc-800 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0"
                    >
                      {diffState === 'updated' ? 'MODIFIED (+4 / -2)' : 'CLEAN'}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDiffViewMode(diffViewMode === 'split' ? 'unified' : 'split')}
                    className="underline text-zinc-700 hover:text-black cursor-pointer text-[11px]"
                  >
                    Switch to {diffViewMode === 'split' ? 'Unified Diff' : 'Split View'}
                  </button>
                </div>
              </div>

              {/* Touch-Friendly Horizontal Gesture & Pan Control Bar */}
              <div className="bg-zinc-50 px-3 py-1.5 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                    isDiffDragging ? 'bg-black text-white' : 'bg-zinc-200 text-zinc-700'
                  }`}>
                    {isDiffDragging ? '⇄ PANNING CODE...' : '⇄ TOUCH-DRAG ENABLED'}
                  </span>
                  <span className="text-zinc-500 hidden sm:inline text-[10px]">
                    Swipe or drag code horizontally (kinetic momentum active)
                  </span>
                </div>

                <div className="flex items-center gap-1.5 ml-auto">
                  <button
                    type="button"
                    onClick={() => handlePanDiffCode(-140)}
                    className="min-h-[28px] px-2 py-0.5 bg-white border border-zinc-300 rounded text-[10px] font-bold text-black hover:bg-zinc-100 active:bg-zinc-200 cursor-pointer"
                    title="Scroll code left"
                  >
                    &larr; Pan
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activeDiffProgress}
                    onChange={(e) => handleScrubDiffCode(parseInt(e.target.value, 10))}
                    aria-label="Horizontal code scroll position"
                    className="w-20 sm:w-28 accent-black cursor-pointer h-1.5"
                  />
                  <button
                    type="button"
                    onClick={() => handlePanDiffCode(140)}
                    className="min-h-[28px] px-2 py-0.5 bg-white border border-zinc-300 rounded text-[10px] font-bold text-black hover:bg-zinc-100 active:bg-zinc-200 cursor-pointer"
                    title="Scroll code right"
                  >
                    Pan &rarr;
                  </button>
                </div>
              </div>

              {/* Diff Code Area with Framer Motion Scanline & useGesture Binding */}
              {diffViewMode === 'split' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-200 font-mono text-xs">
                  
                  {/* Left: Previous State (Gesture Bound) */}
                  <div
                    {...leftDiffGesture.bind()}
                    className="p-3 bg-zinc-50 space-y-0.5 text-zinc-600 leading-relaxed overflow-x-auto touch-pan-x select-none cursor-grab active:cursor-grabbing"
                  >
                    <div className="min-w-[520px] whitespace-nowrap space-y-0.5">
                      <div className="text-zinc-400 text-[11px] pb-1 border-b border-zinc-200 font-mono">
                        Commit a41f90c (v1.2.0 — Baseline)
                      </div>
                      <div className="text-zinc-400">40 | export class ReporterDispatcher &#123;</div>
                      <div className="text-zinc-400">41 |   readonly queueName = "billing_events_primary";</div>
                      <div className={diffState === 'updated' ? 'bg-zinc-200 text-zinc-800 line-through px-1 rounded transition-colors duration-500' : 'transition-colors duration-500'}>
                        42 |   retryPolicy: RetryStrategy = "exponential_backoff";
                      </div>
                      <div className={diffState === 'updated' ? 'bg-zinc-200 text-zinc-800 line-through px-1 rounded transition-colors duration-500' : 'transition-colors duration-500'}>
                        43 |   backoffMultiplier: number = 1.5;
                      </div>
                      <div className="text-zinc-400">44 |   maxAttempts: number = 3;</div>
                      <div className={diffState === 'updated' ? 'bg-zinc-200 text-zinc-800 line-through px-1 rounded transition-colors duration-500' : 'transition-colors duration-500'}>
                        45 |   async dispatch(event: BillingEventPayload): Promise&lt;DispatchAck&gt; &#123;
                      </div>
                      <div className={diffState === 'updated' ? 'bg-zinc-200 text-zinc-800 line-through px-1 rounded transition-colors duration-500' : 'transition-colors duration-500'}>
                        46 |     return await this.client.sendWithBackoff(event, this.backoffMultiplier);
                      </div>
                      <div className="text-zinc-400">47 |   &#125;</div>
                      <div className="text-zinc-400">48 | &#125;</div>
                    </div>
                  </div>

                  {/* Right: Head State with Framer Motion Animation (Gesture Bound) */}
                  <div
                    {...rightDiffGesture.bind()}
                    className="p-3 bg-white space-y-0.5 text-black leading-relaxed relative overflow-x-auto touch-pan-x select-none cursor-grab active:cursor-grabbing"
                  >
                    <div className="min-w-[540px] whitespace-nowrap space-y-0.5">
                      <div className="text-zinc-400 text-[11px] pb-1 border-b border-zinc-200 flex justify-between items-center font-mono">
                        <div className="flex items-center gap-1">
                          <span>Commit:</span>
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={`commit-head-${diffState}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: SCAN_BEAM_DURATION_SEC, ease: "easeInOut" }}
                              className="font-bold text-black"
                            >
                              {diffState === 'updated' ? '9f82e1b (Head PR #412)' : 'a41f90c (v1.2.0)'}
                            </motion.span>
                          </AnimatePresence>
                        </div>
                        <AnimatePresence mode="wait">
                          {diffState === 'updated' && (
                            <motion.span
                              key="ast-tag"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: SCAN_BEAM_DURATION_SEC, ease: "easeInOut" }}
                              className="font-bold text-black text-[10px]"
                            >
                              AST DIFF TRIGGERED
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Animated Scanning Beam */}
                      <AnimatePresence mode="wait">
                        {diffState === 'updated' && (
                          <motion.div
                            key="scanline"
                            initial={{ top: 20, opacity: 1 }}
                            animate={{ top: '80%', opacity: 0 }}
                            transition={{ duration: SCAN_BEAM_DURATION_SEC, ease: "easeOut" }}
                            className="absolute left-0 right-0 h-1 bg-black z-10 pointer-events-none shadow-sm"
                          />
                        )}
                      </AnimatePresence>

                      <div className="text-zinc-400">40 | export class ReporterDispatcher &#123;</div>
                      <div className="text-zinc-400">41 |   readonly queueName = "billing_events_primary";</div>

                      <AnimatePresence mode="wait">
                        {diffState === 'updated' ? (
                          <motion.div
                            key="code-updated"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: SCAN_BEAM_DURATION_SEC, ease: "easeInOut" }}
                            className="space-y-0.5"
                          >
                            <div className="bg-zinc-100 border-l-2 border-black px-1 font-bold">
                              42 |   retryPolicy: RetryStrategy = "circuit_breaker_fast_fail";
                            </div>
                            <div className="bg-zinc-100 border-l-2 border-black px-1 font-bold">
                              43 |   failureThreshold: number = 5;
                            </div>
                            <div className="bg-zinc-100 border-l-2 border-black px-1 font-bold">
                              44 |   circuitResetTimeoutMs: number = 30000;
                            </div>
                            <div className="text-zinc-400">45 |   maxAttempts: number = 3;</div>
                            <div className="bg-zinc-100 border-l-2 border-black px-1 font-bold">
                              46 |   async dispatch(event: BillingEventPayload): Promise&lt;DispatchAck&gt; &#123;
                            </div>
                            <div className="bg-zinc-100 border-l-2 border-black px-1 font-bold">
                              47 |     return await this.circuit.execute(() =&gt; this.client.send(event));
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="code-stale"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: SCAN_BEAM_DURATION_SEC, ease: "easeInOut" }}
                            className="space-y-0.5"
                          >
                            <div>42 |   retryPolicy: RetryStrategy = "exponential_backoff";</div>
                            <div>43 |   backoffMultiplier: number = 1.5;</div>
                            <div className="text-zinc-400">44 |   maxAttempts: number = 3;</div>
                            <div>45 |   async dispatch(event: BillingEventPayload): Promise&lt;DispatchAck&gt; &#123;</div>
                            <div>46 |     return await this.client.sendWithBackoff(event, this.backoffMultiplier);</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="text-zinc-400">47 |   &#125;</div>
                      <div className="text-zinc-400">48 | &#125;</div>
                    </div>
                  </div>

                </div>
              ) : (
                /* Unified Diff (Gesture Bound) */
                <div
                  {...unifiedDiffGesture.bind()}
                  className="p-3 font-mono text-xs bg-zinc-50 space-y-0.5 overflow-x-auto touch-pan-x select-none cursor-grab active:cursor-grabbing"
                >
                  <div className="min-w-[540px] whitespace-nowrap space-y-0.5">
                    <div className="text-zinc-400 text-[11px] pb-1 border-b border-zinc-200">
                      @@ -42,5 +42,6 @@ export class ReporterDispatcher
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`unified-${diffState}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: SCAN_BEAM_DURATION_SEC, ease: "easeInOut" }}
                        className="space-y-0.5"
                      >
                        {diffState === 'updated' ? (
                          <>
                            <div className="bg-zinc-200 text-zinc-700 px-2 line-through">-   retryPolicy: RetryStrategy = "exponential_backoff";</div>
                            <div className="bg-zinc-200 text-zinc-700 px-2 line-through">-   return await this.client.sendWithBackoff(event, this.backoffMultiplier);</div>
                            <div className="bg-black text-white px-2 font-bold">+   retryPolicy: RetryStrategy = "circuit_breaker_fast_fail";</div>
                            <div className="bg-black text-white px-2 font-bold">+   failureThreshold: number = 5;</div>
                            <div className="bg-black text-white px-2 font-bold">+   circuitResetTimeoutMs: number = 30000;</div>
                            <div className="bg-black text-white px-2 font-bold">+   return await this.circuit.execute(() =&gt; this.client.send(event));</div>
                          </>
                        ) : (
                          <div className="text-zinc-700 px-2">    retryPolicy: RetryStrategy = "exponential_backoff";</div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>

            {/* Live Synchronized Claim & Quickstart Mapping Output */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              
              {/* Claim JSON Output */}
              <motion.div
                key={`claim-card-${diffState}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: SCAN_BEAM_DURATION_SEC, ease: "easeInOut" }}
                className="p-3 border border-zinc-300 rounded bg-zinc-50 space-y-2"
              >
                <div className="flex justify-between items-center text-[11px] border-b border-zinc-200 pb-1">
                  <span className="font-bold">openwiki/.claims/claim_102.json</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`claim-hash-${diffState}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: SCAN_BEAM_DURATION_SEC, ease: "easeInOut" }}
                      className="bg-black text-white px-1.5 py-0.2 rounded text-[10px] font-mono font-bold"
                    >
                      {diffState === 'updated' ? 'HASH: 9f82e1b' : 'HASH: a41f90c'}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <AnimatePresence mode="wait">
                  <motion.pre
                    key={`claim-json-${diffState}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: SCAN_BEAM_DURATION_SEC, ease: "easeInOut" }}
                    className="text-[11px] leading-relaxed bg-white p-2 border border-zinc-200 rounded text-zinc-900 overflow-x-auto"
                  >
{diffState === 'updated' ? `{
  "claim_id": "claim_102",
  "source": "dispatcher.ts#L42-L47",
  "fact": "uses circuit_breaker_fast_fail (thresh: 5)"
}` : `{
  "claim_id": "claim_102",
  "source": "dispatcher.ts#L42-L44",
  "fact": "uses exponential_backoff (1.5x)"
}`}
                  </motion.pre>
                </AnimatePresence>
                <div className="text-[10px] text-zinc-500">
                  AST mapping: Untouched packages (auth, billing) remained 100% cached.
                </div>
              </motion.div>

              {/* Rotting Static ADR vs Live OpenWiki */}
              <div className="p-3 border border-zinc-300 rounded bg-zinc-50 space-y-2">
                <div className="flex justify-between items-center text-[11px] border-b border-zinc-200 pb-1">
                  <span className="font-bold">Context Rot Comparison</span>
                  <span className="text-zinc-500 text-[10px]">Static docs/ vs OpenWiki</span>
                </div>
                <div className="p-2 bg-white border border-zinc-200 rounded space-y-1.5 text-[11px]">
                  <div className="text-zinc-500">docs/adr/004.md (Static inlined):</div>
                  <div className="line-through text-zinc-500">"Always retries using exponential_backoff."</div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`rot-msg-${diffState}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: SCAN_BEAM_DURATION_SEC, ease: "easeInOut" }}
                      className="text-[10px] text-black font-bold"
                    >
                      {diffState === 'updated' ? '⚠️ SILENT ROT: Stale ADR misleads agent!' : 'Matches source'}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="text-[10px] text-zinc-500">
                  OpenWiki prevents this by anchoring claims to git tree commit hashes.
                </div>
              </div>

            </div>

            {/* The 4 Failure Modes */}
            <div className="pt-2 border-t border-zinc-200 space-y-2">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                The 4 Operational Failure Modes (Why Teams Hesitate)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 font-mono text-xs">
                <div className="p-2.5 border border-zinc-200 rounded bg-white space-y-1">
                  <div className="text-[10px] text-zinc-400 font-bold">01. BOT CHURN</div>
                  <div className="font-bold">Git Log Pollution</div>
                  <div className="text-[10px] text-zinc-500">CI bot commits to .claims/ create rebase friction on active PRs.</div>
                </div>
                <div className="p-2.5 border border-zinc-200 rounded bg-white space-y-1">
                  <div className="text-[10px] text-zinc-400 font-bold">02. SMALL REPOS</div>
                  <div className="font-bold">&lt;100k LoC Negative ROI</div>
                  <div className="text-[10px] text-zinc-500">Tooling & MCP setup time exceeds any minor token savings.</div>
                </div>
                <div className="p-2.5 border border-zinc-200 rounded bg-white space-y-1">
                  <div className="text-[10px] text-zinc-400 font-bold">03. SYNTHETIC DRIFT</div>
                  <div className="font-bold">False Certainty</div>
                  <div className="text-[10px] text-zinc-500">LLM summarizer can misread edge cases and codify subtle falsehoods.</div>
                </div>
                <div className="p-2.5 border border-zinc-200 rounded bg-white space-y-1">
                  <div className="text-[10px] text-zinc-400 font-bold">04. MCP DELAY</div>
                  <div className="font-bold">1–3s Stdio Overhead</div>
                  <div className="text-[10px] text-zinc-500">Local JSON-RPC round-trip is slower than in-memory prompt tokens.</div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PACKET TRACE & BENCHMARK SCENARIOS (UNIFIED SINGLE LABORATORY)     */}
        {/* ========================================================================= */}
        {activeTab === 'simulator' && (
          <div className="space-y-4">
            
            <div className="border-b border-zinc-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">Agent Packet Execution Trace & Benchmark Scenarios</h2>
                <p className="text-xs font-mono text-zinc-500 mt-0.5">
                  Real-time Codex / Antigravity styled token telemetry with 4 dedicated laboratory screens deconstructing production execution and flawed benchmarks.
                </p>
              </div>
              <div className="text-xs font-mono bg-zinc-100 border border-zinc-300 px-2.5 py-1 rounded text-black font-bold shrink-0 self-start sm:self-auto">
                ACTIVE LAB SCREEN: {selectedScenario === 'arch' ? '1' : selectedScenario === 'rename' ? '2' : selectedScenario === 'twoline' ? '3' : '4'} OF 4
              </div>
            </div>

            {/* =================================================================== */}
            {/* 4 DEDICATED BENCHMARK SCREEN TABS                                   */}
            {/* =================================================================== */}
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold text-zinc-700 flex items-center justify-between">
                <span>Select Laboratory Screen:</span>
                <span className="text-[11px] text-zinc-500 font-normal">Click any screen to view its dedicated visualization</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 font-mono text-xs">
                
                <button
                  onClick={() => handleSelectScenario('arch')}
                  className={`min-h-[52px] p-2.5 rounded border text-left cursor-pointer transition-all ${
                    selectedScenario === 'arch'
                      ? 'bg-black text-white border-black font-bold shadow-xs'
                      : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50'
                  }`}
                >
                  <div className="text-[10px] opacity-70">SCREEN 1 · MONOREPO TASK</div>
                  <div className="font-bold text-sm">Cross-Package Task</div>
                  <div className="text-[10px] opacity-80 truncate">Blind Grep (22.4k tok) vs JIT MCP</div>
                </button>

                <button
                  onClick={() => handleSelectScenario('rename')}
                  className={`min-h-[52px] p-2.5 rounded border text-left cursor-pointer transition-all ${
                    selectedScenario === 'rename'
                      ? 'bg-black text-white border-black font-bold shadow-xs'
                      : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50'
                  }`}
                >
                  <div className="text-[10px] opacity-70">SCREEN 2 · BENCHMARK TRAP #1</div>
                  <div className="font-bold text-sm">Variable Rename Trap</div>
                  <div className="text-[10px] opacity-80 truncate">1-File Isolation Bias & Caching</div>
                </button>

                <button
                  onClick={() => handleSelectScenario('twoline')}
                  className={`min-h-[52px] p-2.5 rounded border text-left cursor-pointer transition-all ${
                    selectedScenario === 'twoline'
                      ? 'bg-black text-white border-black font-bold shadow-xs'
                      : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50'
                  }`}
                >
                  <div className="text-[10px] opacity-70">SCREEN 3 · BENCHMARK TRAP #2</div>
                  <div className="font-bold text-sm">2-Line Path Trim Trap</div>
                  <div className="text-[10px] opacity-80 truncate">Eager exploration burns 3,200 tok</div>
                </button>

                <button
                  onClick={() => handleSelectScenario('keyword')}
                  className={`min-h-[52px] p-2.5 rounded border text-left cursor-pointer transition-all ${
                    selectedScenario === 'keyword'
                      ? 'bg-black text-white border-black font-bold shadow-xs'
                      : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50'
                  }`}
                >
                  <div className="text-[10px] opacity-70">SCREEN 4 · BENCHMARK TRAP #3</div>
                  <div className="font-bold text-sm">Keyword Mention Trap</div>
                  <div className="text-[10px] opacity-80 truncate">Silent MCP Stdio vs Chat Regex</div>
                </button>

              </div>
            </div>

            {/* =================================================================== */}
            {/* SCREEN 1: CROSS-PACKAGE ARCHITECTURE DISCOVERY SCREEN               */}
            {/* =================================================================== */}
            {selectedScenario === 'arch' && (
              <motion.div 
                key="screen-arch"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Executive Callout */}
                <div className="border border-black bg-zinc-50 rounded p-3 font-mono text-xs space-y-1.5">
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-1">
                    <span className="font-bold text-black uppercase tracking-wider">
                      Screen 1 · Cross-Package Architecture Discovery (The Blind Grep Tax)
                    </span>
                    <span className="bg-black text-white px-2 py-0.5 rounded text-[10px] font-bold">
                      94.6% TOKEN REDUCTION
                    </span>
                  </div>
                  <div className="text-zinc-700 text-[11px] leading-relaxed">
                    When answering cross-package questions like <em>"How does Reporter propagate retry events to Billing?"</em> in a 25-package monorepo, 
                    blind grep matches 43 files and burns <strong>22,400+ tokens</strong> across 7 sequential tool calls. 
                    OpenWiki queries the local MCP server and retrieves only the exact 42 lines in <strong>1,200 tokens</strong>.
                  </div>
                </div>

                {/* Architecture Strategy Filter */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-50 p-2 rounded border border-zinc-200 font-mono text-xs">
                  <span className="font-bold text-zinc-700">Simulate Architecture Strategy:</span>
                  <div className="flex flex-wrap items-center gap-1">
                    {(['blind_grep', 'two_line_short', 'bloated_adr', 'openwiki_mcp'] as StrategyType[]).map((strat) => (
                      <button
                        key={strat}
                        onClick={() => setSelectedStrategy(strat)}
                        className={`px-2.5 py-1 rounded cursor-pointer transition-all ${
                          selectedStrategy === strat
                            ? 'bg-black text-white font-bold'
                            : 'bg-white text-zinc-700 border border-zinc-200 hover:border-zinc-400'
                        }`}
                      >
                        {strat === 'blind_grep' ? 'Raw Blind Grep' : strat === 'two_line_short' ? '2-Line Path' : strat === 'bloated_adr' ? '500-Line ADR' : 'OpenWiki 12-Line + MCP'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CODEX / ANTIGRAVITY HUD */}
                <div className="border-2 border-black bg-white text-black rounded-lg p-4 font-mono text-xs space-y-3 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between border-b border-zinc-200 pb-2 text-[11px] gap-2">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-black" />
                      <span className="font-bold tracking-wider">CODEX / ANTIGRAVITY TELEMETRY ENGINE</span>
                      <span className="bg-zinc-100 text-zinc-600 px-1.5 py-0.2 rounded text-[10px]">v2.4-agent</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-600 text-[11px]">
                      <span>MODEL: claude-3-7-sonnet</span>
                      <span className="font-bold text-black border border-black px-1.5 py-0.5 rounded text-[10px]">
                        {selectedStrategy === 'openwiki_mcp' ? 'CACHE: HIT (90%)' : 'CACHE: MISS (0%)'}
                      </span>
                    </div>
                  </div>

                  {/* Context Window Capacity Gauge */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-baseline text-[11px]">
                      <span className="font-bold">CONTEXT WINDOW UTILIZATION (200k Cap)</span>
                      <span className="font-bold tabular-nums">
                        {simData.totalTokens.toLocaleString()} / 200,000 tokens ({(simData.totalTokens / 2000).toFixed(2)}%)
                      </span>
                    </div>

                    <div className="w-full h-3 bg-zinc-100 rounded-xs overflow-hidden flex border border-zinc-300">
                      <div 
                        title={`Startup: ${simData.startupTokens} tokens`}
                        className="h-full bg-black transition-all duration-300" 
                        style={{ width: `${Math.max(1, (simData.startupTokens / 200000) * 100 * 4)}%` }} 
                      />
                      <div 
                        title={`Tool Exploration: ${simData.toolTokens} tokens`}
                        className="h-full bg-zinc-400 transition-all duration-300" 
                        style={{ width: `${Math.max(2, (simData.toolTokens / 200000) * 100 * 4)}%` }} 
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-[10px] text-zinc-500 pt-0.5">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-xs bg-black inline-block"></span> 
                          <span>Startup Preamble ({simData.startupTokens} tok)</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-xs bg-zinc-400 inline-block"></span> 
                          <span>Tool Call Payload ({simData.toolTokens.toLocaleString()} tok)</span>
                        </span>
                      </div>
                      <span>Available Buffer: {(200000 - simData.totalTokens).toLocaleString()} tok</span>
                    </div>
                  </div>

                  {/* Grid Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-200 text-[11px]">
                    <div className="bg-zinc-50 p-2.5 rounded border border-zinc-200">
                      <div className="text-zinc-500 text-[10px] font-bold">SESSION BURN</div>
                      <div className="text-base font-bold text-black tabular-nums">{simData.totalTokens.toLocaleString()} tok</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">Prompt + Tool calls</div>
                    </div>
                    <div className="bg-zinc-50 p-2.5 rounded border border-zinc-200">
                      <div className="text-zinc-500 text-[10px] font-bold">CACHE DISCOUNT</div>
                      <div className="text-base font-bold text-black tabular-nums">
                        {simData.cachedStartupTokens > 0 ? `${simData.cachedStartupTokens} tok` : '0 tok'}
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">~90% discount on Turns 2+</div>
                    </div>
                    <div className="bg-zinc-50 p-2.5 rounded border border-zinc-200">
                      <div className="text-zinc-500 text-[10px] font-bold">TOOL DISPATCHES</div>
                      <div className="text-base font-bold text-black tabular-nums">{simData.toolCalls} calls</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{selectedStrategy === 'blind_grep' ? 'Blind monorepo loop' : 'Surgical JIT calls'}</div>
                    </div>
                    <div className="bg-zinc-50 p-2.5 rounded border border-zinc-200">
                      <div className="text-zinc-500 text-[10px] font-bold">ESTIMATED COST</div>
                      <div className="text-base font-bold text-black tabular-nums">${((simData.totalTokens / 1000) * 0.003).toFixed(4)}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">
                        {selectedStrategy === 'openwiki_mcp' ? '94.6% saved vs grep' : 'Unoptimized burn'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monorepo Cascade Inspector: 25 Packages & 43 Matches */}
                <div className="border border-zinc-200 rounded p-3 bg-zinc-50 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-1.5">
                    <span className="font-bold text-black">Why Blind Grep Explodes: 25-Package Monorepo File Matches</span>
                    <span className="text-[10px] text-zinc-500">grep("Reporter") &rarr; 43 files</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div className="bg-white p-2 rounded border border-zinc-200">
                      <div className="font-bold text-black">packages/reporter/</div>
                      <div className="text-[10px] text-zinc-500">4 candidate files</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-zinc-200">
                      <div className="font-bold text-black">packages/billing/</div>
                      <div className="text-[10px] text-zinc-500">12 candidate files</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-zinc-200">
                      <div className="font-bold text-black">packages/logger/</div>
                      <div className="text-[10px] text-zinc-500">9 candidate files</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-zinc-200">
                      <div className="font-bold text-black">packages/core/</div>
                      <div className="text-[10px] text-zinc-500">18 candidate files</div>
                    </div>
                  </div>
                </div>

                {/* Step Trace */}
                <div className="border border-zinc-200 rounded p-3 sm:p-4 bg-white space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                    <span className="font-bold text-black flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Tool Dispatch Log for Strategy: {simData.agentsTitle}</span>
                    </span>
                    <span className="text-[11px] text-zinc-500">Step {simData.steps.length} of {simData.steps.length} completed</span>
                  </div>
                  <div className="space-y-2">
                    {simData.steps.map((step, idx) => (
                      <div key={idx} className="p-2.5 border border-zinc-200 rounded bg-zinc-50 flex flex-wrap items-center justify-between gap-2">
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="bg-black text-white px-1.5 py-0.2 rounded text-[10px] font-bold">EVENT #{idx + 1}</span>
                            <span className="font-bold text-black">{step.title}</span>
                          </div>
                          <div className="text-[11px] text-zinc-600 mt-1 break-words leading-relaxed">{step.detail}</div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="bg-white border border-zinc-300 text-black font-bold px-2 py-0.5 rounded text-[10px] tabular-nums">
                            {step.tokens}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* =================================================================== */}
            {/* SCREEN 2: VARIABLE RENAME TRAP SCREEN (ISOLATION BIAS & CACHING)   */}
            {/* =================================================================== */}
            {selectedScenario === 'rename' && (
              <motion.div 
                key="screen-rename"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Executive Callout */}
                <div className="border border-black bg-zinc-50 rounded p-3 font-mono text-xs space-y-1.5">
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-1">
                    <span className="font-bold text-black uppercase tracking-wider">
                      Screen 2 · Benchmark Trap #1: Single-Variable Rename (1-File Isolation Bias)
                    </span>
                    <span className="bg-black text-white px-2 py-0.5 rounded text-[10px] font-bold">
                      FLAWED EVALUATION DEBUNKED
                    </span>
                  </div>
                  <div className="text-zinc-700 text-[11px] leading-relaxed">
                    Engineers test renaming variable <code>usr</code> to <code>user</code> in <code>Header.tsx</code>. 
                    Without OpenWiki it costs 420 tokens; with OpenWiki on Turn 1 it loads 280 startup tokens (total 700). 
                    Testers assume OpenWiki adds 66% wasted overhead on every prompt! 
                    In reality, this ignores modern <strong>prefix prompt caching</strong> (~90% discount on Turns 2+) and 
                    the fact that saving 21,200 tokens on 1 cross-package task covers 75+ rename prompts.
                  </div>
                </div>

                {/* Turn-by-Turn Prefix Prompt Caching Station */}
                <div className="border-2 border-black rounded-lg p-4 bg-white font-mono text-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-2 gap-2">
                    <div>
                      <div className="font-bold text-sm">Interactive Prompt Caching Station</div>
                      <div className="text-[11px] text-zinc-500">Toggle turn number to observe how prefix caching slashes preamble cost</div>
                    </div>
                    <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded border border-zinc-200 text-xs">
                      {[1, 2, 3, 4].map((turn) => (
                        <button
                          key={turn}
                          onClick={() => setRenameTurn(turn)}
                          className={`min-h-[36px] sm:min-h-0 px-2.5 py-1 rounded cursor-pointer transition-all ${
                            renameTurn === turn ? 'bg-black text-white font-bold' : 'text-zinc-700 hover:text-black'
                          }`}
                        >
                          Turn {turn} {turn === 1 ? '(Cold)' : '(Cache Hit)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Side-by-Side Turn Comparison Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    
                    {/* Without OpenWiki (Raw) */}
                    <div className="p-3 bg-zinc-50 border border-zinc-300 rounded space-y-2">
                      <div className="flex items-center justify-between border-b border-zinc-200 pb-1">
                        <span className="font-bold text-black">Raw Code (No AGENTS.md Wiki)</span>
                        <span className="text-[10px] text-zinc-500">Constant Cost</span>
                      </div>
                      <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-zinc-600">Startup Preamble:</span>
                          <span className="font-bold">0 tokens</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-600">Inspect & Edit Header.tsx:</span>
                          <span className="font-bold">420 tokens</span>
                        </div>
                        <div className="flex justify-between border-t border-zinc-200 pt-1 font-bold text-black">
                          <span>Total Turn {renameTurn} Cost:</span>
                          <span>420 tokens</span>
                        </div>
                      </div>
                      <div className="text-[10px] text-zinc-500 border-t border-zinc-200 pt-1">
                        Looks cheap in isolation on 1 file, but fails on cross-package tasks.
                      </div>
                    </div>

                    {/* With OpenWiki 12-Line Guardrail */}
                    <div className="p-3 bg-white border-2 border-black rounded space-y-2">
                      <div className="flex items-center justify-between border-b border-zinc-200 pb-1">
                        <span className="font-bold text-black">OpenWiki 12-Line + MCP</span>
                        <span className="bg-black text-white px-1.5 py-0.2 rounded text-[10px] font-bold">
                          {renameTurn === 1 ? 'TURN 1: COLD PREFILL' : 'TURNS 2+: 90% CACHED'}
                        </span>
                      </div>
                      <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-zinc-600">Startup Preamble:</span>
                          <span className="font-bold">
                            {renameTurn === 1 ? '280 tokens (cold)' : '28 tokens (cached @ 90% discount)'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-600">Inspect & Edit Header.tsx:</span>
                          <span className="font-bold">420 tokens</span>
                        </div>
                        <div className="flex justify-between border-t border-zinc-200 pt-1 font-bold text-black">
                          <span>Total Turn {renameTurn} Cost:</span>
                          <span>{renameTurn === 1 ? '700 tokens' : '448 tokens (only +28 tok diff!)'}</span>
                        </div>
                      </div>
                      <div className="text-[10px] text-black font-bold border-t border-zinc-200 pt-1">
                        {renameTurn === 1 
                          ? '⚠️ Naive reviewers stop at Turn 1 and declare OpenWiki adds 280 wasted tokens.'
                          : '✅ Prompt caching amortizes Turn 2+ down to 28 tokens, preserving full monorepo index readiness!'}
                      </div>
                    </div>

                  </div>
                </div>

                {/* The 1-to-75 Asymmetric Monorepo Payoff Math */}
                <div className="border border-zinc-300 rounded p-4 bg-zinc-50 font-mono text-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-2 gap-1">
                    <span className="font-bold text-black text-sm">The 1-to-75 Monorepo Amortization Formula</span>
                    <span className="text-zinc-500 text-[11px]">How 1 architectural discovery task subsidizes hundreds of renames</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[11px]">
                      <span>Model Trivial Renames Evaluated:</span>
                      <span className="font-bold text-black">{amortizationRenamesCount} prompts</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={amortizationRenamesCount}
                      onChange={(e) => setAmortizationRenamesCount(parseInt(e.target.value, 10))}
                      className="w-full accent-black cursor-pointer h-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
                    <div className="bg-white p-2.5 rounded border border-zinc-200 space-y-0.5">
                      <div className="text-zinc-500 text-[10px]">1 Cross-Package Discovery Saved</div>
                      <div className="text-base font-bold text-black">+21,200 tok</div>
                      <div className="text-[10px] text-zinc-500">22,400 tok (grep) - 1,200 (MCP)</div>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-zinc-200 space-y-0.5">
                      <div className="text-zinc-500 text-[10px]">Uncached Renames Covered</div>
                      <div className="text-base font-bold text-black">75.7 prompts</div>
                      <div className="text-[10px] text-zinc-500">21,200 tok / 280 startup tok</div>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-zinc-200 space-y-0.5">
                      <div className="text-zinc-500 text-[10px]">Cached Turns Covered</div>
                      <div className="text-base font-bold text-black">757.1 turns</div>
                      <div className="text-[10px] text-zinc-500">21,200 tok / 28 cached tok</div>
                    </div>
                  </div>
                </div>

                {/* False Positive Check */}
                <div className="border border-zinc-200 rounded p-3 bg-white font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-black" />
                    <div>
                      <span className="font-bold">Zero False-Positive Wiki Tool Calls:</span>
                      <span className="text-zinc-600 text-[11px] ml-1">On 10 trivial tasks, openwiki_search was called <strong>0 / 10 times</strong>.</span>
                    </div>
                  </div>
                  <span className="bg-zinc-100 text-zinc-800 border border-zinc-300 px-2 py-0.5 rounded text-[10px] font-bold">
                    NEGATIVE GUARDRAIL VERIFIED
                  </span>
                </div>
              </motion.div>
            )}

            {/* =================================================================== */}
            {/* SCREEN 3: 2-LINE PATH TRIM TRAP SCREEN (EAGER EXPLORATION)          */}
            {/* =================================================================== */}
            {selectedScenario === 'twoline' && (
              <motion.div 
                key="screen-twoline"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Executive Callout */}
                <div className="border border-black bg-zinc-50 rounded p-3 font-mono text-xs space-y-1.5">
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-1">
                    <span className="font-bold text-black uppercase tracking-wider">
                      Screen 3 · Benchmark Trap #2: The 2-Line Path Trim Trap (Missing Negative Guardrail)
                    </span>
                    <span className="bg-black text-white px-2 py-0.5 rounded text-[10px] font-bold">
                      BURNS 3,200 EXTRA TOKENS
                    </span>
                  </div>
                  <div className="text-zinc-700 text-[11px] leading-relaxed">
                    Teams try to "optimize" AGENTS.md by trimming the 12-line preamble down to 2 lines: 
                    <code>"## Docs: openwiki/quickstart.md"</code>, attempting to save 235 startup tokens. 
                    Deleting the negative guardrail (<em>"Do not enumerate, preload, or search wikis at task start"</em>) 
                    causes the agent to treat <code>quickstart.md</code> as mandatory reading—burning <strong>3,200 tokens</strong> on a 1-line variable rename!
                  </div>
                </div>

                {/* Side-by-Side AGENTS.md Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                  
                  {/* Left: The Naive 2-Line Trim */}
                  <div className="border border-zinc-300 rounded bg-white overflow-hidden">
                    <div className="bg-zinc-100 p-2.5 border-b border-zinc-200 flex items-center justify-between">
                      <span className="font-bold text-zinc-800">Variant A: Naive 2-Line Trim (Failed)</span>
                      <span className="text-[10px] bg-zinc-200 px-1.5 py-0.2 rounded font-bold">~45 TOKENS</span>
                    </div>
                    <pre className="p-3 bg-zinc-50 text-[11px] leading-relaxed text-zinc-900 overflow-x-auto">
{`## Documentation
Index at openwiki/quickstart.md
<!-- Negative guardrail deleted to "save" tokens -->`}
                    </pre>
                    <div className="p-2.5 bg-zinc-100 border-t border-zinc-200 text-[10px] text-zinc-600">
                      ❌ Missing stop condition! Agent greedily preloads quickstart.md.
                    </div>
                  </div>

                  {/* Right: The 12-Line Guardrail */}
                  <div className="border-2 border-black rounded bg-white overflow-hidden">
                    <div className="bg-black text-white p-2.5 flex items-center justify-between">
                      <span className="font-bold">Variant B: OpenWiki 12-Line Guardrail</span>
                      <span className="text-[10px] bg-zinc-800 text-white px-1.5 py-0.2 rounded font-bold">~280 TOK (~28 CACHED)</span>
                    </div>
                    <pre className="p-3 bg-zinc-50 text-[11px] leading-relaxed text-zinc-900 overflow-x-auto">
{`<!-- OPENWIKI:START -->
## OpenWiki
Optional just-in-time context, NOT required startup reading.
- Do not enumerate, preload, or search wikis at task start.
- Stop once the question is grounded.
<!-- OPENWIKI:END -->`}
                    </pre>
                    <div className="p-2.5 bg-zinc-100 border-t border-zinc-200 text-[10px] text-black font-bold">
                      ✅ Explicit negative constraint forces agent to bypass wiki on local edits.
                    </div>
                  </div>

                </div>

                {/* Step Execution Comparison on a 1-Line Rename */}
                <div className="border border-zinc-300 rounded p-4 bg-zinc-50 font-mono text-xs space-y-3">
                  <div className="font-bold text-sm text-black">Execution Result When Asked To Rename Variable `usr` &rarr; `user`:</div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                    <div className="bg-white p-3 rounded border border-zinc-200 space-y-2">
                      <div className="font-bold text-zinc-800 border-b border-zinc-200 pb-1">With 2-Line Trim (No Guardrail):</div>
                      <div className="space-y-1">
                        <div>1. Ingest 2-line preamble: <span className="font-bold">+45 tok</span></div>
                        <div className="text-black font-bold bg-zinc-100 p-1 rounded">
                          2. EAGER READ: read_file("openwiki/quickstart.md") &rarr; <span className="underline">+3,200 tok</span>
                        </div>
                        <div>3. Edit Header.tsx: <span className="font-bold">+420 tok</span></div>
                        <div className="border-t border-zinc-200 pt-1 font-bold text-black flex justify-between">
                          <span>Total Burn:</span>
                          <span className="text-black">3,665 tokens</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded border border-black space-y-2">
                      <div className="font-bold text-black border-b border-zinc-200 pb-1">With 12-Line Guardrail:</div>
                      <div className="space-y-1">
                        <div>1. Ingest cached guardrail: <span className="font-bold">+28 tok (cached)</span></div>
                        <div className="text-black font-bold bg-zinc-100 p-1 rounded">
                          2. STOP CONDITION TRIGGERED: Wiki tool call bypassed &rarr; <span className="underline">0 tok</span>
                        </div>
                        <div>3. Edit Header.tsx: <span className="font-bold">+420 tok</span></div>
                        <div className="border-t border-zinc-200 pt-1 font-bold text-black flex justify-between">
                          <span>Total Burn:</span>
                          <span className="text-black">448 tokens (87.7% cheaper!)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CI Bot Collision / Overwrite Notice */}
                <div className="border border-zinc-200 rounded p-3 bg-white font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-black" />
                    <div>
                      <span className="font-bold">CI Bot Reversion Notice:</span>
                      <span className="text-zinc-600 text-[11px] ml-1">
                        If an engineer manually trims AGENTS.md, the OpenWiki CI job detects missing <code>&lt;!-- OPENWIKI:START --&gt;</code> markers and overwrites it on the next PR merge.
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* =================================================================== */}
            {/* SCREEN 4: KEYWORD MENTION TRAP SCREEN (SILENT MCP STDIO VS CHAT)    */}
            {/* =================================================================== */}
            {selectedScenario === 'keyword' && (
              <motion.div 
                key="screen-keyword"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Executive Callout */}
                <div className="border border-black bg-zinc-50 rounded p-3 font-mono text-xs space-y-1.5">
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-1">
                    <span className="font-bold text-black uppercase tracking-wider">
                      Screen 4 · Benchmark Trap #3: The Keyword Mention Trap (Silent MCP Execution)
                    </span>
                    <span className="bg-black text-white px-2 py-0.5 rounded text-[10px] font-bold">
                      0 CHAT WORDS ≠ 0 MCP CALLS
                    </span>
                  </div>
                  <div className="text-zinc-700 text-[11px] leading-relaxed">
                    Reviewers write test scripts regexing for the keyword <code>"OpenWiki"</code> in the agent's conversational chat response. 
                    Seeing 0 occurrences, they conclude: <em>"The agent completely ignored the documentation!"</em> 
                    In reality, agents communicate with OpenWiki via <strong>local MCP JSON-RPC over stdio</strong>. 
                    The agent calls <code>openwiki_search</code>, reads the claim, and outputs code diffs silently without ever uttering the word "OpenWiki" in chat.
                  </div>
                </div>

                {/* Live Dual-Pane Inspector */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                  
                  {/* Left Pane: Human Chat Window */}
                  <div className="border border-zinc-300 rounded-lg bg-white overflow-hidden space-y-0">
                    <div className="bg-zinc-100 p-2.5 border-b border-zinc-200 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-black" />
                        <span className="font-bold">Agent Chat Transcript (Regex Target)</span>
                      </div>
                      <span className="bg-zinc-200 text-zinc-800 px-1.5 py-0.2 rounded text-[10px] font-bold">
                        MATCHES: 0 / 10
                      </span>
                    </div>

                    <div className="p-3 space-y-2 text-[11px] bg-zinc-50">
                      <div className="p-2 bg-white border border-zinc-200 rounded">
                        <div className="text-[10px] text-zinc-400 font-bold">USER PROMPT</div>
                        <div className="text-zinc-800 mt-0.5">"Fix retry error handling in the Billing reporter dispatcher."</div>
                      </div>

                      <div className="p-2 bg-white border border-zinc-200 rounded space-y-1">
                        <div className="text-[10px] text-zinc-400 font-bold">AGENT CHAT RESPONSE</div>
                        <div className="text-zinc-800">
                          "Updated <code>packages/reporter/src/dispatcher.ts</code> to use circuit breaker fast-fail with threshold 5."
                        </div>
                        <pre className="text-[10px] bg-zinc-100 p-1.5 rounded text-zinc-700 overflow-x-auto">
{`+   retryPolicy = "circuit_breaker_fast_fail";
+   failureThreshold = 5;`}
                        </pre>
                      </div>
                    </div>

                    {/* Regex Tester Widget */}
                    <div className="p-2.5 border-t border-zinc-200 bg-white space-y-1 text-[11px]">
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold">
                        <span>NAIVE TEST: REGEX SEARCH IN CHAT</span>
                        <span className="text-black font-bold">RESULT: 0 OCCURRENCES</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={keywordRegexInput}
                          onChange={(e) => setKeywordRegexInput(e.target.value)}
                          placeholder="/openwiki/gi"
                          className="w-full bg-zinc-100 border border-zinc-300 rounded px-2 py-1 text-xs font-mono"
                        />
                        <span className="bg-black text-white px-2 py-1 rounded text-[10px] font-bold shrink-0">
                          0 MATCHES
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        Naive evaluation declares: <em>"Doc system was ignored."</em>
                      </div>
                    </div>
                  </div>

                  {/* Right Pane: MCP JSON-RPC Stdio Inspector */}
                  <div className="border-2 border-black rounded-lg bg-white overflow-hidden space-y-0">
                    <div className="bg-black text-white p-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-white" />
                        <span className="font-bold">MCP JSON-RPC Stdio Inspector (Under The Hood)</span>
                      </div>
                      <span className="bg-zinc-800 text-white px-1.5 py-0.2 rounded text-[10px] font-bold">
                        2 / 2 DISPATCHED
                      </span>
                    </div>

                    <div className="p-3 space-y-1.5 text-[11px] bg-zinc-50 overflow-x-auto max-h-[300px]">
                      <div className="text-[10px] text-zinc-400 font-bold pb-1 border-b border-zinc-200">
                        LOCAL SUBPROCESS EVENT STREAM (POSIX STDIO)
                      </div>

                      <div className="space-y-1 font-mono text-[10px]">
                        <div className="text-zinc-600">[09:24:01.102] <span className="font-bold text-black">&rarr; tools/call: openwiki_search</span></div>
                        <div className="bg-white p-1 rounded border border-zinc-200 text-zinc-800">
                          {`{"query": "Reporter retry propagation"}`}
                        </div>

                        <div className="text-zinc-600">[09:24:01.145] <span className="font-bold text-black">&larr; result: [claim_102]</span></div>
                        <div className="bg-white p-1 rounded border border-zinc-200 text-zinc-800">
                          {`{"claims": ["claim_102"], "summary": "circuit_breaker"}`}
                        </div>

                        <div className="text-zinc-600">[09:24:01.148] <span className="font-bold text-black">&rarr; tools/call: openwiki_read</span></div>
                        <div className="bg-white p-1 rounded border border-zinc-200 text-zinc-800">
                          {`{"claim_id": "claim_102"}`}
                        </div>

                        <div className="text-zinc-600">[09:24:01.189] <span className="font-bold text-black">&larr; result: source pointer</span></div>
                        <div className="bg-white p-1 rounded border border-zinc-200 text-zinc-800">
                          {`{"source": "dispatcher.ts#L42-L47", "hash": "9f82e1b"}`}
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 border-t border-zinc-200 bg-white flex items-center justify-between text-[10px]">
                      <span className="font-bold text-black">GROUND TRUTH: 100% MCP ADOPTION</span>
                      <span className="text-zinc-500">2 tool calls, 87ms round-trip latency</span>
                    </div>
                  </div>

                </div>

                {/* Summary Callout */}
                <div className="border border-zinc-300 rounded p-3 bg-zinc-50 font-mono text-xs space-y-1">
                  <div className="font-bold text-black">Why This Misleads Benchmark Testers:</div>
                  <div className="text-zinc-700 text-[11px] leading-relaxed">
                    Chatbot evaluations (like traditional RAG) look for citations in conversational markdown output. 
                    Modern agentic coding environments (Cursor, VS Code / Cline, Windsurf, JetBrains) consume documentation through 
                    <strong>sub-agent tool calls</strong>. The agent uses the information to write code, not to talk about the wiki. 
                    Testing for keyword mentions in chat produces a 100% false negative rate!
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CONTEXT STATE FLOW & ENTERPRISE DATA BOUNDARY                      */}
        {/* ========================================================================= */}
        {activeTab === 'flow' && (
          <div className="space-y-6">
            
            <div className="border-b border-zinc-200 pb-3">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">Context Architecture & Enterprise Data Boundary</h2>
              <p className="text-xs font-mono text-zinc-500 mt-0.5">
                How OpenWiki runs locally via standard stdio MCP into any favorite IDE, with zero code or telemetry sent to LangChain.
              </p>
            </div>

            {/* ===================================================================== */}
            {/* ENTERPRISE AIRGAP & DATA FLOW DIAGRAM (VISUAL ARCHITECTURE)           */}
            {/* ===================================================================== */}
            <div className="border-2 border-black rounded-lg p-4 bg-zinc-50 space-y-4 font-mono text-xs">
              <div className="flex flex-wrap items-center justify-between border-b border-zinc-300 pb-2 gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <span className="font-bold text-sm">Enterprise Data Governance & Airgap Guarantee</span>
                </div>
                <span className="bg-black text-white px-2 py-0.5 rounded text-[10px] font-bold">
                  STRICT AIRGAP: 0 BYTES TO LANGCHAIN
                </span>
              </div>

              {/* 3-Zone Architecture Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                
                {/* Zone 1: Local Machine */}
                <div className="p-3.5 bg-white border border-zinc-300 rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-500">ZONE 01 · 100% LOCAL</span>
                    <Laptop className="w-3.5 h-3.5 text-zinc-700" />
                  </div>
                  <div className="font-bold text-sm text-black">Your Workstation / CI</div>
                  <div className="text-[11px] text-zinc-700 space-y-1">
                    <div>• Local Git repo + <code className="bg-zinc-100 px-1 font-bold">openwiki/.claims/</code></div>
                    <div>• Local stdio MCP Process (<code className="font-bold">openwiki-mcp</code>)</div>
                    <div>• Your Favorite Agentic IDE (Cursor, VS Code, Windsurf, JetBrains)</div>
                  </div>
                  <div className="text-[10px] text-zinc-500 border-t border-zinc-100 pt-1.5">
                    No open network ports. Child process runs over standard in/out.
                  </div>
                </div>

                {/* Zone 2: Enterprise Model */}
                <div className="p-3.5 bg-white border border-black rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-500">ZONE 02 · ENTERPRISE HOSTED</span>
                    <Server className="w-3.5 h-3.5 text-black" />
                  </div>
                  <div className="font-bold text-sm text-black">Your Enterprise Model</div>
                  <div className="text-[11px] text-zinc-700 space-y-1">
                    <div>• Private VPC Endpoint / On-Prem</div>
                    <div>• Self-hosted vLLM, Ollama, Azure OpenAI Private Link, AWS Bedrock VPC</div>
                    <div>• Direct TLS tunnel from IDE to model</div>
                  </div>
                  <div className="text-[10px] font-bold text-black border-t border-zinc-200 pt-1.5">
                    Prompt tokens travel only to your authorized enterprise model.
                  </div>
                </div>

                {/* Zone 3: LangChain Servers (Air-gapped) */}
                <div className="p-3.5 bg-zinc-100 border border-zinc-300 rounded space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-500">ZONE 03 · EXTERNAL SAAS</span>
                    <Ban className="w-3.5 h-3.5 text-zinc-500" />
                  </div>
                  <div className="font-bold text-sm text-zinc-600 line-through">LangChain Cloud Servers</div>
                  <div className="text-[11px] text-zinc-500 space-y-1">
                    <div>✕ 0 source code sent</div>
                    <div>✕ 0 claims or AST nodes sent</div>
                    <div>✕ 0 telemetry or tracking pings</div>
                  </div>
                  <div className="text-[10px] font-bold text-black border-t border-zinc-200 pt-1.5">
                    AIRGAP VERIFIED: OpenWiki is an offline open-source CLI indexer.
                  </div>
                </div>

              </div>

              {/* 3 Privacy & Data Governance Key Takeaways */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                <div className="p-2.5 bg-white border border-zinc-200 rounded space-y-0.5">
                  <div className="font-bold text-black">1. Zero Phone-Home</div>
                  <div className="text-zinc-600 text-[10px]">OpenWiki contains no telemetry code, analytics trackers, or account login requirements.</div>
                </div>
                <div className="p-2.5 bg-white border border-zinc-200 rounded space-y-0.5">
                  <div className="font-bold text-black">2. Enterprise Model Agnostic</div>
                  <div className="text-zinc-600 text-[10px]">Use any self-hosted model or internal VPC endpoint supported by your favorite editor.</div>
                </div>
                <div className="p-2.5 bg-white border border-zinc-200 rounded space-y-0.5">
                  <div className="font-bold text-black">3. POSIX stdio Pipe Isolation</div>
                  <div className="text-zinc-600 text-[10px]">MCP server communicates directly through parent process I/O with 0 listening network sockets.</div>
                </div>
              </div>
            </div>

            {/* ===================================================================== */}
            {/* UNIVERSAL IDE MCP CONFIGURATION (CURSOR, VS CODE, WINDSURF, JETBRAINS)*/}
            {/* ===================================================================== */}
            <div className="border border-zinc-300 rounded-lg p-4 bg-white space-y-3 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-2 gap-2">
                <div>
                  <div className="font-bold text-sm">Universal IDE Integration via Standard MCP</div>
                  <div className="text-[11px] text-zinc-500">Configure OpenWiki in your favorite agentic IDE or editor.</div>
                </div>
                
                {/* IDE Tab Switcher */}
                <div className="flex flex-wrap items-center gap-1 bg-zinc-100 p-1 rounded border border-zinc-200 text-xs">
                  {(['cursor', 'vscode', 'windsurf', 'jetbrains'] as const).map((ide) => (
                    <button
                      key={ide}
                      onClick={() => setSelectedIde(ide)}
                      className={`min-h-[36px] sm:min-h-0 px-2.5 py-1 rounded cursor-pointer transition-all ${
                        selectedIde === ide ? 'bg-black text-white font-bold' : 'text-zinc-700 hover:text-black'
                      }`}
                    >
                      {ide === 'cursor' ? 'Cursor' : ide === 'vscode' ? 'VS Code / Cline' : ide === 'windsurf' ? 'Windsurf' : 'JetBrains'}
                    </button>
                  ))}
                </div>
              </div>

              {/* IDE Path & Snippet View */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between text-[11px] text-zinc-600">
                  <span>Configuration file path: <code className="bg-zinc-100 px-1 py-0.5 font-bold text-black">
                    {selectedIde === 'cursor' ? '.cursor/mcp.json (or ~/.cursor/mcp.json)' :
                     selectedIde === 'vscode' ? '.vscode/mcp.json (or cline_mcp_settings.json)' :
                     selectedIde === 'windsurf' ? '~/.codeium/windsurf/mcp_config.json' :
                     '.idea/mcp.json'}
                  </code></span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`{\n  "mcpServers": {\n    "openwiki": {\n      "command": "openwiki-mcp",\n      "args": ["--path", "./openwiki"]\n    }\n  }\n}`);
                      setCopiedConfig(true);
                      setTimeout(() => setCopiedConfig(false), 2000);
                    }}
                    className="flex items-center gap-1 text-black font-bold hover:underline cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedConfig ? 'Copied!' : 'Copy Config'}</span>
                  </button>
                </div>

                <pre className="p-3 bg-zinc-50 border border-zinc-200 rounded font-mono text-[11px] text-zinc-900 overflow-x-auto leading-relaxed">
{`{
  "mcpServers": {
    "openwiki": {
      "command": "openwiki-mcp",
      "args": ["--path", "./openwiki"]
    }
  }
}`}
                </pre>
                <div className="text-[10px] text-zinc-500">
                  {selectedIde === 'cursor' && 'Cursor registers openwiki_search and openwiki_read as native agentic tools.'}
                  {selectedIde === 'vscode' && 'Compatible with Cline, Roo Code, GitHub Copilot, and standard VS Code MCP clients.'}
                  {selectedIde === 'windsurf' && 'Windsurf Cascade leverages local MCP tools for surgical repo exploration.'}
                  {selectedIde === 'jetbrains' && 'Supported natively in JetBrains AI Assistant / Junie MCP integration.'}
                </div>
              </div>
            </div>

            {/* ===================================================================== */}
            {/* 3-TIER LAYER STACK & 12-LINE ROOT GUARDRAIL                           */}
            {/* ===================================================================== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 sm:p-4 border border-zinc-300 rounded bg-white space-y-1.5">
                <div className="text-[10px] text-zinc-400 font-bold">TIER 01 · ROOT INSTRUCTION</div>
                <div className="font-bold text-sm">AGENTS.md Preamble</div>
                <div className="text-zinc-600 text-[11px]">
                  12 lines with negative guardrail: <br/>
                  <code className="bg-zinc-100 px-1 py-0.5 font-bold">"Do not preload wiki at task start"</code>.
                </div>
                <div className="pt-2 text-[10px] text-zinc-400">Cost: ~280 tok (~28 cached)</div>
              </div>

              <div className="p-3 sm:p-4 border border-zinc-300 rounded bg-white space-y-1.5">
                <div className="text-[10px] text-zinc-400 font-bold">TIER 02 · ON-DEMAND RETRIEVAL</div>
                <div className="font-bold text-sm">Local stdio MCP Server</div>
                <div className="text-zinc-600 text-[11px]">
                  Registered in your IDE <code className="bg-zinc-100 px-1">mcp.json</code>. Exposes <code className="font-bold">openwiki_search</code> & <code className="font-bold">openwiki_read</code> locally.
                </div>
                <div className="pt-2 text-[10px] text-zinc-400">Cost: 0 external LLM API tokens</div>
              </div>

              <div className="p-3 sm:p-4 border border-zinc-300 rounded bg-white space-y-1.5">
                <div className="text-[10px] text-zinc-400 font-bold">TIER 03 · GROUNDED SIDECAR</div>
                <div className="font-bold text-sm">openwiki/.claims/</div>
                <div className="text-zinc-600 text-[11px]">
                  Sparse JSON claims anchoring architectural assertions directly to git tree commit hashes.
                </div>
                <div className="pt-2 text-[10px] text-zinc-400">Cost: Local disk storage, never inlined</div>
              </div>
            </div>

            {/* The 12-Line Code Box */}
            <div className="border border-zinc-300 rounded overflow-hidden bg-white">
              <div className="bg-zinc-100 px-4 py-2 border-b border-zinc-200 flex justify-between text-xs font-mono">
                <span className="font-bold">Root AGENTS.md (Lines 1–12)</span>
                <span>~280 tokens</span>
              </div>
              <pre className="p-3 sm:p-4 font-mono text-xs text-zinc-800 leading-relaxed overflow-x-auto bg-zinc-50">
{`<!-- OPENWIKI:START -->
## OpenWiki
This repository has a generated openwiki/ evidence index. It is optional just-in-time context, not required startup reading.
- Do not enumerate, preload, or search wikis at task start. Use retrieval when the user asks for it, when unfamiliar architecture or dependency behavior materially affects the task, or when source inspection leaves an important uncertainty. Stop once the question is grounded.
- When those conditions apply and OpenWiki retrieval tools are available, use openwiki_search for just-in-time context and openwiki_read for the relevant complete sections.
- If the retrieval tools are unavailable, read openwiki/quickstart.md and follow its links to the relevant pages.
- Treat source code and tests as authoritative.
The scheduled OpenWiki workflow refreshes the repository wiki. Do not hand-edit generated OpenWiki pages...
<!-- OPENWIKI:END -->`}
              </pre>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: DECISION RUBRIC & REACTIVE TOKEN CALCULATOR                        */}
        {/* ========================================================================= */}
        {activeTab === 'rubric' && (
          <div className="space-y-6">
            
            <div className="border-b border-zinc-200 pb-3">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">Team Decision Matrix & Token Math</h2>
              <p className="text-xs font-mono text-zinc-500 mt-0.5">
                Answer 5 questions to determine if your monorepo needs OpenWiki or minimal code.
              </p>
            </div>

            {/* Reactive Sliders */}
            <div className="border border-zinc-200 rounded p-4 bg-zinc-50 space-y-3 font-mono text-xs">
              <div className="font-bold">Model Team Workload:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Team Size:</span>
                    <span className="font-bold">{teamSize} devs</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={teamSize}
                    onChange={(e) => setTeamSize(parseInt(e.target.value, 10))}
                    className="w-full accent-black cursor-pointer h-2"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Trivial Prompts / Day:</span>
                    <span className="font-bold">{trivialPerDay}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={trivialPerDay}
                    onChange={(e) => setTrivialPerDay(parseInt(e.target.value, 10))}
                    className="w-full accent-black cursor-pointer h-2"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Cross-Package Tasks:</span>
                    <span className="font-bold">{archPerDay}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={archPerDay}
                    onChange={(e) => setArchPerDay(parseInt(e.target.value, 10))}
                    className="w-full accent-black cursor-pointer h-2"
                  />
                </div>
              </div>

              {/* Comparative Bar Chart */}
              <div className="pt-2 border-t border-zinc-200 space-y-2">
                <div className="flex justify-between font-bold">
                  <span>Cumulative Daily Tokens:</span>
                  <span>{percentSaved > 0 ? `${percentSaved}% Savings with OpenWiki` : 'Equal Cost'}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-zinc-500">
                    <span>Raw Code (Blind Grep)</span>
                    <span className="font-bold text-black">{totalGrep.toLocaleString()} tok</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-200 rounded overflow-hidden">
                    <div className="h-full bg-zinc-400" style={{ width: `${Math.round((totalGrep / maxVal) * 100)}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-black font-bold">
                    <span>OpenWiki 12-Line + MCP</span>
                    <span>{totalOpenWiki.toLocaleString()} tok</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-200 rounded overflow-hidden">
                    <div className="h-full bg-black" style={{ width: `${Math.round((totalOpenWiki / maxVal) * 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Question Interactive Rubric Grid (Touch friendly min 44px) */}
            <div className="space-y-3 font-mono text-xs">
              <div className="font-bold">5-Point Team Readiness Assessment:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SCORECARD_QUESTIONS.map((q) => {
                  const currentSelected = rubricAnswers[q.id] ?? 0;
                  return (
                    <div key={q.id} className="p-3 border border-zinc-200 rounded bg-white space-y-2">
                      <div className="font-bold text-black">{q.question}</div>
                      <div className="space-y-1.5">
                        {q.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => setRubricAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                            className={`min-h-[44px] w-full text-left p-2 rounded border transition-all cursor-pointer text-[11px] flex items-center ${
                              currentSelected === optIdx ? 'bg-black text-white font-bold border-black' : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-400'
                            }`}
                          >
                            <span>{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live Computed Verdict */}
              <div className="p-4 border-2 border-black rounded bg-zinc-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-zinc-500 font-bold">ALGORITHMIC VERDICT (SCORE: {verdict.score}/100)</div>
                  <div className="text-base font-bold text-black">{verdict.title}</div>
                  <div className="text-xs text-zinc-600 mt-0.5">{verdict.subtitle}</div>
                </div>
                <span className="min-h-[44px] sm:min-h-0 flex items-center justify-center bg-black text-white px-3 py-1.5 rounded font-bold text-xs shrink-0">
                  {verdict.recommendation === 'adopt' ? 'ADOPT OPENWIKI' : verdict.recommendation === 'consider_adr' ? 'USE ADRS' : 'AVOID / RAW CODE'}
                </span>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Docked Bottom Navigation Bar for Mobile (Thumb Reachable, >= 48px touch targets) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-zinc-300 z-50 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`min-h-[48px] min-w-[56px] flex flex-col items-center justify-center gap-0.5 rounded-lg px-2 transition-all cursor-pointer ${
                isActive ? 'text-black font-bold' : 'text-zinc-500 hover:text-black'
              }`}
            >
              <div className={`p-1 rounded ${isActive ? 'bg-zinc-100 text-black' : ''}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono leading-none tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
