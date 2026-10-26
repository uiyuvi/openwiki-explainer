import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GitCommit, GitPullRequest, RefreshCw, FileCode, ArrowRight, Check, AlertTriangle, Layers, Zap } from 'lucide-react';

export const Level6CiAndDrawbacks: React.FC = () => {
  const [fileState, setFileState] = useState<'stale' | 'updated'>('updated');
  const [diffViewMode, setDiffViewMode] = useState<'split' | 'unified'>('split');
  const [selectedFile, setSelectedFile] = useState<'dispatcher' | 'auth'>('dispatcher');
  const [reindexingStep, setReindexingStep] = useState<number>(2); // 0: detecting, 1: ast-parsing, 2: reconciled

  const handleToggleState = (targetState: 'stale' | 'updated') => {
    setFileState(targetState);
    if (targetState === 'updated') {
      setReindexingStep(0);
      setTimeout(() => setReindexingStep(1), 350);
      setTimeout(() => setReindexingStep(2), 700);
    } else {
      setReindexingStep(2);
    }
  };

  return (
    <section id="ci-drawbacks" className="space-y-6 scroll-mt-20 py-8 border-b border-zinc-200">
      
      {/* Header with Visual Flow Indicator */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 font-semibold uppercase tracking-wider">
            <span>State Machine 06</span>
            <span>·</span>
            <span>CI Git-Diff & Failure Modes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-black mt-1">
            Automated AST Diff Reconciliation
          </h2>
        </div>

        {/* State Switcher Buttons */}
        <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-lg border border-zinc-200">
          <button
            onClick={() => handleToggleState('stale')}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-all cursor-pointer ${
              fileState === 'stale'
                ? 'bg-black text-white font-bold shadow-xs'
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            State A: Stale (a41f90c)
          </button>
          <button
            onClick={() => handleToggleState('updated')}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-all cursor-pointer ${
              fileState === 'updated'
                ? 'bg-black text-white font-bold shadow-xs'
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            State B: PR Merged (9f82e1b)
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ANIMATED GIT-DIFF VIEWER & LIVE DOCUMENTATION MAPPER (Framer Motion)       */}
      {/* ========================================================================= */}
      <div className="bg-white border border-zinc-300 rounded-lg p-5 shadow-xs space-y-4">
        
        {/* Controls & File Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedFile('dispatcher')}
              className={`px-3 py-1 text-xs font-mono rounded border flex items-center gap-1.5 cursor-pointer transition-colors ${
                selectedFile === 'dispatcher'
                  ? 'bg-black text-white border-black font-semibold'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>packages/reporter/src/dispatcher.ts</span>
              <span className={`text-[10px] px-1 py-0.2 rounded font-sans ${
                fileState === 'updated' ? 'bg-zinc-800 text-white' : 'bg-zinc-200 text-zinc-700'
              }`}>
                {fileState === 'updated' ? 'MODIFIED' : 'CLEAN'}
              </span>
            </button>

            <button
              onClick={() => setSelectedFile('auth')}
              className={`px-3 py-1 text-xs font-mono rounded border flex items-center gap-1.5 cursor-pointer transition-colors ${
                selectedFile === 'auth'
                  ? 'bg-black text-white border-black font-semibold'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>packages/auth/src/verify.ts</span>
              <span className="text-[10px] px-1 py-0.2 rounded font-sans bg-zinc-100 text-zinc-500">
                UNTOUCHED
              </span>
            </button>
          </div>

          <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded border border-zinc-200 text-xs font-mono">
            <button
              onClick={() => setDiffViewMode('split')}
              className={`px-2.5 py-1 rounded cursor-pointer ${
                diffViewMode === 'split' ? 'bg-white text-black font-bold shadow-xs' : 'text-zinc-500'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setDiffViewMode('unified')}
              className={`px-2.5 py-1 rounded cursor-pointer ${
                diffViewMode === 'unified' ? 'bg-white text-black font-bold shadow-xs' : 'text-zinc-500'
              }`}
            >
              Unified Diff
            </button>
          </div>
        </div>

        {/* Live State Machine Pipeline Indicator */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono py-1">
          <div className={`p-2 rounded border flex items-center justify-between ${
            reindexingStep >= 0 ? 'bg-zinc-900 text-white border-black' : 'bg-zinc-50 text-zinc-400 border-zinc-200'
          }`}>
            <span>1. Git Diff Detector</span>
            <span className="text-[10px]">{fileState === 'updated' ? '1 File Changed' : '0 Diffs'}</span>
          </div>

          <div className={`p-2 rounded border flex items-center justify-between transition-colors ${
            reindexingStep >= 1 ? 'bg-zinc-900 text-white border-black' : 'bg-zinc-50 text-zinc-400 border-zinc-200'
          }`}>
            <span>2. AST Range Parser</span>
            <span className="text-[10px]">{fileState === 'updated' ? 'L42-L47 Flagged' : 'Idle'}</span>
          </div>

          <div className={`p-2 rounded border flex items-center justify-between transition-colors ${
            reindexingStep >= 2 ? 'bg-zinc-900 text-white border-black' : 'bg-zinc-50 text-zinc-400 border-zinc-200'
          }`}>
            <span>3. Claim Re-Index</span>
            <span className="text-[10px]">{fileState === 'updated' ? 'Claim #102 Replaced' : 'Cached'}</span>
          </div>
        </div>

        {/* Diff Display with Framer Motion Animation */}
        {selectedFile === 'dispatcher' ? (
          <div className="space-y-4">
            
            {diffViewMode === 'split' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                
                {/* Left Side: Stale Base */}
                <div className="border border-zinc-200 rounded overflow-hidden bg-zinc-50/70">
                  <div className="bg-zinc-100 px-3 py-1.5 border-b border-zinc-200 flex justify-between text-[11px] text-zinc-600 font-sans">
                    <span className="font-semibold">Base: Commit a41f90c</span>
                    <span className="font-mono">v1.2.0</span>
                  </div>
                  <div className="p-3 leading-relaxed space-y-0.5 text-zinc-700">
                    <div className="text-zinc-400">40 | export class ReporterDispatcher &#123;</div>
                    <div className="text-zinc-400">41 |   readonly queueName = "billing_events";</div>
                    <div className={fileState === 'updated' ? 'bg-zinc-200 text-zinc-800 line-through px-1 rounded' : ''}>
                      42 |   retryPolicy = "exponential_backoff";
                    </div>
                    <div className={fileState === 'updated' ? 'bg-zinc-200 text-zinc-800 line-through px-1 rounded' : ''}>
                      43 |   backoffMultiplier = 1.5;
                    </div>
                    <div className="text-zinc-400">44 |   maxAttempts = 3;</div>
                    <div className="text-zinc-400">45 | </div>
                    <div className={fileState === 'updated' ? 'bg-zinc-200 text-zinc-800 line-through px-1 rounded' : ''}>
                      46 |   dispatch(event: BillingEvent) &#123;
                    </div>
                    <div className={fileState === 'updated' ? 'bg-zinc-200 text-zinc-800 line-through px-1 rounded' : ''}>
                      47 |     return this.client.sendWithBackoff(event);
                    </div>
                    <div className="text-stone-400">48 |   &#125;</div>
                    <div className="text-stone-400">49 | &#125;</div>
                  </div>
                </div>

                {/* Right Side: Head with Framer Motion Scanline & Line Highlights */}
                <div className="border border-zinc-200 rounded overflow-hidden bg-white relative">
                  <div className="bg-zinc-100 px-3 py-1.5 border-b border-zinc-200 flex justify-between text-[11px] text-zinc-800 font-sans">
                    <span className="font-semibold">
                      {fileState === 'updated' ? 'PR #412: Commit 9f82e1b' : 'Commit a41f90c'}
                    </span>
                    <span className="font-mono">{fileState === 'updated' ? 'v1.3.0' : 'v1.2.0'}</span>
                  </div>

                  <div className="p-3 leading-relaxed space-y-0.5 text-zinc-900 relative">
                    {/* Animated Scanning Beam for State Transition */}
                    <AnimatePresence mode="wait">
                      {fileState === 'updated' && (
                        <motion.div
                          key="scanline"
                          initial={{ top: 0, opacity: 0.9 }}
                          animate={{ top: '80%', opacity: 0 }}
                          transition={{ duration: 0.8, ease: "easeInOut" }}
                          className="absolute left-0 right-0 h-1 bg-black z-10 pointer-events-none"
                        />
                      )}
                    </AnimatePresence>

                    <div className="text-zinc-400">40 | export class ReporterDispatcher &#123;</div>
                    <div className="text-zinc-400">41 |   readonly queueName = "billing_events";</div>
                    
                    {fileState === 'updated' ? (
                      <motion.div
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, staggerChildren: 0.1 }}
                        className="space-y-0.5"
                      >
                        <motion.div className="bg-zinc-100 border-l-2 border-black px-1 font-bold">
                          42 |   retryPolicy = "circuit_breaker_fast_fail";
                        </motion.div>
                        <motion.div className="bg-zinc-100 border-l-2 border-black px-1 font-bold">
                          43 |   failureThreshold = 5;
                        </motion.div>
                        <motion.div className="bg-zinc-100 border-l-2 border-black px-1 font-bold">
                          44 |   circuitResetTimeoutMs = 30000;
                        </motion.div>
                        <div className="text-zinc-400">45 |   maxAttempts = 3;</div>
                        <motion.div className="bg-zinc-100 border-l-2 border-black px-1 font-bold">
                          46 |   dispatch(event: BillingEvent) &#123;
                        </motion.div>
                        <motion.div className="bg-zinc-100 border-l-2 border-black px-1 font-bold">
                          47 |     return this.circuit.execute(() =&gt; this.client.send(event));
                        </motion.div>
                      </motion.div>
                    ) : (
                      <>
                        <div>42 |   retryPolicy = "exponential_backoff";</div>
                        <div>43 |   backoffMultiplier = 1.5;</div>
                        <div className="text-zinc-400">44 |   maxAttempts = 3;</div>
                        <div className="text-zinc-400">45 | </div>
                        <div>46 |   dispatch(event: BillingEvent) &#123;</div>
                        <div>47 |     return this.client.sendWithBackoff(event);</div>
                      </>
                    )}
                    <div className="text-zinc-400">48 |   &#125;</div>
                    <div className="text-zinc-400">49 | &#125;</div>
                  </div>
                </div>

              </div>
            ) : (
              /* Unified Diff View */
              <div className="border border-zinc-200 rounded overflow-hidden bg-zinc-50 font-mono text-xs">
                <div className="bg-zinc-200 px-3 py-1.5 text-zinc-700 text-[11px] font-sans flex justify-between">
                  <span>diff --git a/packages/reporter/src/dispatcher.ts b/packages/reporter/src/dispatcher.ts</span>
                  <span>@@ -42,7 +42,8 @@</span>
                </div>
                <div className="p-3 leading-relaxed space-y-0.5">
                  <div className="text-zinc-500">  export class ReporterDispatcher &#123;</div>
                  {fileState === 'updated' ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-0.5">
                      <div className="bg-zinc-200 text-zinc-700 px-2 py-0.5 rounded">-   retryPolicy = "exponential_backoff";</div>
                      <div className="bg-zinc-200 text-zinc-700 px-2 py-0.5 rounded">-   backoffMultiplier = 1.5;</div>
                      <div className="bg-black text-white px-2 py-0.5 rounded font-bold">+   retryPolicy = "circuit_breaker_fast_fail";</div>
                      <div className="bg-black text-white px-2 py-0.5 rounded font-bold">+   failureThreshold = 5;</div>
                      <div className="bg-black text-white px-2 py-0.5 rounded font-bold">+   circuitResetTimeoutMs = 30000;</div>
                      <div className="text-zinc-500">    maxAttempts = 3;</div>
                      <div className="bg-zinc-200 text-zinc-700 px-2 py-0.5 rounded">-   dispatch(event: BillingEvent) &#123; ... &#125;</div>
                      <div className="bg-black text-white px-2 py-0.5 rounded font-bold">+   dispatch(event: BillingEvent) &#123; return this.circuit.execute(...); &#125;</div>
                    </motion.div>
                  ) : (
                    <>
                      <div className="text-zinc-700">    retryPolicy = "exponential_backoff";</div>
                      <div className="text-zinc-700">    backoffMultiplier = 1.5;</div>
                      <div className="text-zinc-500">    maxAttempts = 3;</div>
                    </>
                  )}
                  <div className="text-zinc-500">  &#125;</div>
                </div>
              </div>
            )}

            {/* Visual Re-indexing Flow Diagram (Framer Motion) */}
            <div className="border border-zinc-200 rounded-lg p-4 bg-zinc-50 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-black flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>CI Documentation Mapping Event Stream</span>
                </span>
                <span className="text-zinc-500">Duration: ~820ms</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                
                {/* Claim 102 JSON Card with Animated State Transition */}
                <motion.div
                  key={fileState}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-3 rounded bg-white border border-zinc-300 space-y-1.5"
                >
                  <div className="flex justify-between items-center text-[11px] text-zinc-500 border-b border-zinc-100 pb-1">
                    <span className="font-bold text-black">openwiki/.claims/claim_102.json</span>
                    <span className="bg-black text-white px-1.5 py-0.5 rounded text-[10px]">
                      {fileState === 'updated' ? 'HASH: 9f82e1b' : 'HASH: a41f90c'}
                    </span>
                  </div>
                  <pre className="text-[10px] leading-relaxed text-zinc-800 bg-zinc-50 p-2 rounded">
{fileState === 'updated' ? `{
  "claim_id": "claim_102",
  "topic": "reporter-retry",
  "source_pointer": "dispatcher.ts#L42-L47",
  "verified_fact": "uses circuit_breaker_fast_fail (threshold: 5, 30s reset)"
}` : `{
  "claim_id": "claim_102",
  "topic": "reporter-retry",
  "source_pointer": "dispatcher.ts#L42-L44",
  "verified_fact": "uses exponential_backoff (1.5x multiplier)"
}`}
                  </pre>
                  <div className="text-[11px] text-zinc-500">
                    AST parser regenerated only this claim. Untouched packages remain cached.
                  </div>
                </motion.div>

                {/* Markdown Fragment Card */}
                <motion.div
                  key={`md-${fileState}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="p-3 rounded bg-white border border-zinc-300 space-y-1.5"
                >
                  <div className="flex justify-between items-center text-[11px] text-zinc-500 border-b border-zinc-100 pb-1">
                    <span className="font-bold text-black">openwiki/quickstart.md</span>
                    <span className="text-[10px] text-zinc-500">Section Anchor: #reporter</span>
                  </div>
                  <div className="text-[11px] bg-zinc-50 p-2 rounded text-zinc-800 space-y-1">
                    <div className="font-bold">### Reporter Delivery Policy</div>
                    <p className="font-sans text-xs">
                      {fileState === 'updated' ? (
                        <span>
                          The dispatcher trips a <strong className="underline font-bold">circuit_breaker_fast_fail</strong> on 5 failures, isolating billing during outages.
                        </span>
                      ) : (
                        <span>
                          The dispatcher retries failed events with <strong className="underline">exponential_backoff</strong> up to 3 attempts.
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    When Bob calls <code className="font-bold">openwiki_read(#reporter)</code>, it reads this fresh section anchor.
                  </div>
                </motion.div>

              </div>
            </div>

          </div>
        ) : (
          /* Untouched State Demonstration */
          <div className="p-4 rounded bg-zinc-50 border border-zinc-200 text-xs font-mono space-y-2">
            <div className="font-bold text-black flex items-center gap-1.5">
              <Check className="w-4 h-4 text-black" />
              <span>packages/auth/src/verify.ts — 0 Git Diff Tree Detections</span>
            </div>
            <div className="bg-white p-2.5 rounded border border-zinc-200 text-zinc-700">
              claim_101.json: Status = CACHED (0 LLM inference tokens spent, 0 CI seconds burned).
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 4 FAILURE MODES: INTERACTIVE STATE DIAGRAM & WATERFALL                     */}
      {/* ========================================================================= */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
          <h3 className="text-base font-bold text-black flex items-center gap-2">
            <span>The 4 Critical Failure Modes (State Diagram)</span>
          </h3>
          <span className="text-xs font-mono text-zinc-500">Real-World Operational Friction</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          
          {/* Mode 1 */}
          <div className="p-3.5 rounded border border-zinc-200 bg-white space-y-2">
            <div className="flex justify-between items-center text-[10px] text-zinc-400">
              <span>01. CI CHURN</span>
              <span className="text-black font-bold">GIT NOISE</span>
            </div>
            <div className="font-sans font-bold text-black text-sm">
              Bot PR History Clutter
            </div>
            <div className="p-2 rounded bg-zinc-50 text-[11px] space-y-1 text-zinc-600">
              <div>Trigger: PR merge to main</div>
              <div>Action: openwiki --update</div>
              <div className="font-bold text-black">Consequence: Bot commit rebase conflicts on open PRs</div>
            </div>
          </div>

          {/* Mode 2 */}
          <div className="p-3.5 rounded border border-zinc-200 bg-white space-y-2">
            <div className="flex justify-between items-center text-[10px] text-zinc-400">
              <span>02. SMALL-REPO TAX</span>
              <span className="text-black font-bold">&lt;100k LoC</span>
            </div>
            <div className="font-sans font-bold text-black text-sm">
              Negative ROI Threshold
            </div>
            <div className="p-2 rounded bg-zinc-50 text-[11px] space-y-1 text-zinc-600">
              <div>Setup: .bob/mcp.json</div>
              <div>Maintenance: CI workflows</div>
              <div className="font-bold text-black">Consequence: Config debugging exceeds token savings</div>
            </div>
          </div>

          {/* Mode 3 */}
          <div className="p-3.5 rounded border border-zinc-200 bg-white space-y-2">
            <div className="flex justify-between items-center text-[10px] text-zinc-400">
              <span>03. SYNTHETIC DRIFT</span>
              <span className="text-black font-bold">ACCURACY</span>
            </div>
            <div className="font-sans font-bold text-black text-sm">
              Hallucinated Certainty
            </div>
            <div className="p-2 rounded bg-zinc-50 text-[11px] space-y-1 text-zinc-600">
              <div>Risk: Model distills code claim</div>
              <div>Flaw: Misses subtle async race</div>
              <div className="font-bold text-black">Consequence: Agent trusts bad claim over source code</div>
            </div>
          </div>

          {/* Mode 4 */}
          <div className="p-3.5 rounded border border-zinc-200 bg-white space-y-2">
            <div className="flex justify-between items-center text-[10px] text-zinc-400">
              <span>04. MCP LATENCY</span>
              <span className="text-black font-bold">1-3s TAX</span>
            </div>
            <div className="font-sans font-bold text-black text-sm">
              Stdio Execution Delay
            </div>
            <div className="p-2 rounded bg-zinc-50 text-[11px] space-y-1 text-zinc-600">
              <div>Call: openwiki_search()</div>
              <div>Mechanism: JSON-RPC over stdio</div>
              <div className="font-bold text-black">Consequence: Slower TTFT vs in-memory prompt tokens</div>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
