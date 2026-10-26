import React, { useState } from 'react';
import { RefreshCw, AlertTriangle, ShieldCheck, ArrowRight, Check, X } from 'lucide-react';

export const Level5Proposals: React.FC = () => {
  const [selectedProposal, setSelectedProposal] = useState<'skill' | 'shorten' | 'remove'>('shorten');
  const [ciSimulated, setCiSimulated] = useState<boolean>(false);

  const handleSimulateCi = () => {
    setCiSimulated(true);
    setSelectedProposal('shorten');
  };

  return (
    <section id="proposals" className="space-y-6 scroll-mt-20 py-8 border-b border-stone-200">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-amber-700 font-semibold">
          <span>Level 05</span>
          <span aria-hidden="true">·</span>
          <span>Architectural Options</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
          Evaluating the 3 Practical Team Proposals
        </h2>
        <p className="text-sm text-stone-600 mt-2 max-w-3xl leading-relaxed">
          When teams observe the 280-token preamble in <code className="font-mono text-stone-800 bg-stone-100 px-1 py-0.5 rounded text-xs">AGENTS.md</code>, three practical options are commonly proposed. Below is an engineering evaluation of what actually happens in production under each proposal.
        </p>
      </div>

      {/* 3 Proposal Selection Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        <button
          onClick={() => { setSelectedProposal('skill'); setCiSimulated(false); }}
          className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
            selectedProposal === 'skill'
              ? 'bg-white border-amber-600 shadow-sm ring-1 ring-amber-500/20'
              : 'bg-white/70 border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-900">Proposal A: Optional Skill</span>
            <span className="text-[10px] font-mono text-amber-800 font-semibold">Opt-In</span>
          </div>
          <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
            Move the OpenWiki block to a separate skill (<code className="font-mono text-stone-800 bg-stone-100 px-1 py-0.5 rounded">openwiki skill</code>) and activate it only when explicitly requested.
          </p>
        </button>

        <button
          onClick={() => { setSelectedProposal('shorten'); setCiSimulated(false); }}
          className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
            selectedProposal === 'shorten'
              ? 'bg-white border-amber-600 shadow-sm ring-1 ring-amber-500/20'
              : 'bg-white/70 border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-900">Proposal B: Shorten to 2 Lines</span>
            <span className="text-[10px] font-mono text-amber-800 font-semibold">Path Only</span>
          </div>
          <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
            Keep the block but trim it down to just the file path (<code className="font-mono text-stone-800 bg-stone-100 px-1 py-0.5 rounded">openwiki/quickstart.md</code>), deleting all negative instructions.
          </p>
        </button>

        <button
          onClick={() => { setSelectedProposal('remove'); setCiSimulated(false); }}
          className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
            selectedProposal === 'remove'
              ? 'bg-white border-stone-700 shadow-sm ring-1 ring-stone-400/20'
              : 'bg-white/70 border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-900">Proposal C: Remove Entirely</span>
            <span className="text-[10px] font-mono text-stone-600 font-semibold">Raw Repo</span>
          </div>
          <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
            Remove all OpenWiki instructions from AGENTS.md entirely and rely on the agent reading docs on demand.
          </p>
        </button>

      </div>

      {/* Detailed Analysis Canvas */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-5 shadow-xs">
        
        {/* Dynamic Proposal Content */}
        {selectedProposal === 'skill' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Proposal A: Move OpenWiki to an Explicit Optional Skill
                </h3>
                <p className="text-xs text-stone-600">
                  Isolate OpenWiki into <code className="font-mono text-stone-800 bg-stone-100 px-1 py-0.5 rounded">.skills/openwiki/SKILL.md</code>.
                </p>
              </div>
              <span className="text-xs font-mono text-amber-800 font-semibold">0 Tokens on Normal Tasks</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-200 space-y-2">
                <div className="text-xs font-semibold text-emerald-900 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>The Real Benefits:</span>
                </div>
                <ul className="text-xs text-stone-700 space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li><strong>Zero startup token overhead</strong> on everyday variable renames and localized bugfixes.</li>
                  <li>Keeps root <code className="font-mono text-stone-800">AGENTS.md</code> completely pristine and minimal.</li>
                  <li>Developers who know they are doing architectural work can explicitly ask for the skill.</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-200 space-y-2">
                <div className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>The Production Trade-Off:</span>
                </div>
                <ul className="text-xs text-stone-700 space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li><strong>The Discovery Blindspot</strong>: Coding agents rarely know that an unfamiliar task crosses package boundaries until they start grepping. They will not autonomously invoke an optional skill if they don't realize they need it.</li>
                  <li>Requires human developers to remember to explicitly prompt: <em>"Use openwiki skill to investigate this."</em></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {selectedProposal === 'shorten' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Proposal B: Shorten the Block to 2 Lines (The Deceptive Trap)
                </h3>
                <p className="text-xs text-stone-600">
                  Trim the managed block down to just <code className="font-mono text-stone-800 bg-stone-100 px-1 py-0.5 rounded">## OpenWiki \n Index at openwiki/quickstart.md</code>.
                </p>
              </div>
              <button
                onClick={handleSimulateCi}
                className="px-3.5 py-1.5 text-xs font-semibold text-stone-900 bg-amber-500 hover:bg-amber-600 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5 text-stone-900" />
                <span>Simulate CI: openwiki --update</span>
              </button>
            </div>

            {ciSimulated && (
              <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-2.5">
                <RefreshCw className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Scheduled CI Workflow Executed (openwiki --update):</div>
                  <p className="mt-0.5 leading-relaxed text-stone-700">
                    The CLI detected the <code className="font-mono text-stone-900">&lt;!-- OPENWIKI:START --&gt;</code> markers and automatically restored the full 12-line managed block! Any custom manual trims to this section are overwritten by design on scheduled runs.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-rose-50/70 border border-rose-300 space-y-2">
                <div className="text-xs font-semibold text-rose-900 flex items-center gap-1.5">
                  <X className="w-4 h-4 text-rose-700" />
                  <span>Trap 1: The Eager Exploration Penalty</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Empirical research (<code className="font-mono text-stone-800">arXiv:2602.11988</code>) shows that when coding agents see a bare documentation file path without the explicit sentence <em>"Do not preload at task start"</em>, they treat it as mandatory onboarding reading.
                </p>
                <p className="text-xs text-rose-800 font-medium leading-relaxed">
                  The agent calls <code className="font-mono text-rose-900">read_file('openwiki/quickstart.md')</code>—wasting <strong>3,200+ tokens</strong> on a variable rename to save 235 startup tokens!
                </p>
              </div>

              <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-300 space-y-2">
                <div className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Trap 2: CI Git Conflicts & Regeneration</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Per the official OpenWiki documentation (<code className="font-mono text-stone-800">openwiki update</code>), everything enclosed inside <code className="font-mono text-stone-800">&lt;!-- OPENWIKI:START --&gt;</code> is managed by the tool.
                </p>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Editing this block by hand puts your engineering team in a perpetual fight against the scheduled CI bot, which will repeatedly restore the full 12 lines on PR merges.
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedProposal === 'remove' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Proposal C: Remove OpenWiki Entirely from AGENTS.md
                </h3>
                <p className="text-xs text-stone-600">
                  Strip all wiki tooling and rely entirely on standard code search.
                </p>
              </div>
              <span className="text-xs font-mono text-stone-600">Clean Slate</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-200 space-y-2">
                <div className="text-xs font-semibold text-emerald-900 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>When This is the Right Choice:</span>
                </div>
                <ul className="text-xs text-stone-700 space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li><strong>Small-to-medium codebases</strong> (&lt;100k lines of code) with clean directory structures.</li>
                  <li>Teams that cannot tolerate bot PRs or automated commits modifying repository files.</li>
                  <li>Workloads dominated by localized bugfixes where agents never need cross-package maps.</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-rose-50/60 border border-rose-200 space-y-2">
                <div className="text-xs font-semibold text-rose-900 flex items-center gap-1.5">
                  <X className="w-4 h-4 text-rose-700" />
                  <span>The Real Cost in Big Monorepos:</span>
                </div>
                <ul className="text-xs text-stone-700 space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li>Re-introduces the <strong>22,400+ token blind grep loop</strong> every time an agent investigates cross-package dependencies.</li>
                  <li>Agents frequently read wrong legacy modules or hallucinate outdated API signatures.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>

    </section>
  );
};
