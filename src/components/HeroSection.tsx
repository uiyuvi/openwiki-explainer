import React, { useState } from 'react';
import { BookOpen, Terminal, Layers, ArrowDown } from 'lucide-react';
import { SectionId } from '../types';

interface HeroSectionProps {
  onExplore: (section: SectionId) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore }) => {
  const [thesisView, setThesisView] = useState<'problem' | 'solution' | 'drawback'>('problem');

  return (
    <section className="relative pt-10 pb-12 border-b border-[#E7E5E0]">
      <div className="max-w-4xl space-y-6">
        
        {/* Editorial Byline & Metadata (Distill.pub style) */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#78716C] font-mono">
          <span className="text-[#92400E] font-semibold">AI Systems Engineering</span>
          <span>·</span>
          <span>Empirical Monorepo Evaluation</span>
          <span>·</span>
          <span>Grounded in arXiv:2602.11988</span>
        </div>

        {/* Lead Headline */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1C1917] leading-[1.15]">
          How OpenWiki Offloads <code className="font-mono text-[#92400E] bg-[#FEF3C7] px-2 py-0.5 rounded text-2xl sm:text-4xl border border-[#FDE68A]">AGENTS.md</code>
          <span className="block mt-2 font-serif font-normal italic text-2xl sm:text-4xl text-[#44403C]">
            — And the hidden costs of adopting it.
          </span>
        </h1>

        {/* Editorial Abstract */}
        <p className="text-[#44403C] text-base sm:text-lg leading-relaxed font-serif italic max-w-3xl border-l-2 border-[#D97706] pl-4 py-1">
          In a large monorepo, an AI coding agent without architecture documentation is forced to run blind searches across dozens of packages. But stuffing complete architecture guides into <span className="font-mono text-xs font-semibold text-[#1C1917]">AGENTS.md</span> causes attention dilution and prompt bloat. OpenWiki attempts to bridge this gap with model-free MCP tools and a 12-line preamble—yet it brings real risks of CI churn and false confidence.
        </p>

        {/* Interactive Thesis Selector (Show, Don't Tell) */}
        <div className="pt-2 bg-[#F5F5F0] border border-[#E7E5E0] rounded-lg p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-[#1C1917]">The Three Monorepo Documentation Realities:</span>
            <div className="flex items-center gap-1 bg-[#EBEBE5] p-0.5 rounded">
              <button
                onClick={() => setThesisView('problem')}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  thesisView === 'problem' ? 'bg-white font-semibold text-[#1C1917] shadow-xs' : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                1. The Grep Tax
              </button>
              <button
                onClick={() => setThesisView('solution')}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  thesisView === 'solution' ? 'bg-white font-semibold text-[#1C1917] shadow-xs' : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                2. The OpenWiki Strategy
              </button>
              <button
                onClick={() => setThesisView('drawback')}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  thesisView === 'drawback' ? 'bg-white font-semibold text-[#1C1917] shadow-xs' : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                3. The 4 Failure Modes
              </button>
            </div>
          </div>

          <div className="text-xs leading-relaxed text-[#57534E]">
            {thesisView === 'problem' && (
              <p>
                <strong>The Blind Grep Reality:</strong> Without a structured index, an agent answering <em>"How does the Reporter pattern propagate retry events?"</em> fires 7 blind <code className="font-mono text-[#991B1B]">grep</code> and <code className="font-mono text-[#991B1B]">read_file</code> calls across packages, burning <span className="font-mono font-semibold text-[#991B1B]">22,400+ tokens</span> rediscovering the codebase from scratch.
              </p>
            )}
            {thesisView === 'solution' && (
              <p>
                <strong>The OpenWiki Strategy:</strong> Injects only a <span className="font-mono font-semibold text-[#065F46]">12-line preamble</span> into root <code className="font-mono text-[#1C1917]">AGENTS.md</code> with negative guardrails commanding the agent <em>not</em> to preload documentation at boot. When needed, it retrieves surgical sections via local, model-free MCP tools (<code className="font-mono text-[#065F46]">openwiki_search</code>), consuming only ~1,200 tokens.
              </p>
            )}
            {thesisView === 'drawback' && (
              <p>
                <strong>The Real Failure Modes:</strong> Automated bot PRs and commits amending <code className="font-mono text-[#92400E]">openwiki/.claims/</code> create severe CI churn on active branches. On repos under 100k lines of code, the setup overhead and MCP debugging tax outweigh token savings.
              </p>
            )}
          </div>
        </div>

        {/* Action quick links */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => onExplore('basics')}
            className="px-4 py-2 text-xs font-semibold text-[#1C1917] bg-[#FDE68A] hover:bg-[#FCD34D] border border-[#F59E0B]/40 rounded transition-all cursor-pointer shadow-xs"
          >
            Start Progressive Curriculum
          </button>
          <button
            onClick={() => onExplore('grep-vs-wiki')}
            className="px-4 py-2 text-xs font-semibold text-[#44403C] bg-white hover:bg-[#F5F5F0] border border-[#D6D3CD] rounded transition-colors cursor-pointer"
          >
            Live Agent Simulator
          </button>
          <button
            onClick={() => onExplore('ci-drawbacks')}
            className="px-4 py-2 text-xs font-semibold text-[#44403C] bg-white hover:bg-[#F5F5F0] border border-[#D6D3CD] rounded transition-colors cursor-pointer"
          >
            Simulate Git-Diff & Failures
          </button>
        </div>

      </div>

      {/* 4 Quantitative Facts Strip (Unboxed, clean editorial rules) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 pt-8 border-t border-[#E7E5E0] text-xs">
        <div className="space-y-1">
          <div className="font-mono text-[11px] text-[#78716C] uppercase tracking-wider">Root Footprint</div>
          <div className="text-xl font-bold font-mono text-[#92400E] tabular-nums">12 Lines · 280 tok</div>
          <p className="text-[#57534E] leading-normal">
            Short preamble in root AGENTS.md, avoiding inlined prose context bloat.
          </p>
        </div>
        <div className="space-y-1">
          <div className="font-mono text-[11px] text-[#78716C] uppercase tracking-wider">Prompt Caching</div>
          <div className="text-xl font-bold font-mono text-[#065F46] tabular-nums">~28 tok / Turn</div>
          <p className="text-[#57534E] leading-normal">
            Modern LLM prefix caching discounts the 280-token preamble by ~90% on Turns 2+.
          </p>
        </div>
        <div className="space-y-1">
          <div className="font-mono text-[11px] text-[#78716C] uppercase tracking-wider">Retrieval Protocol</div>
          <div className="text-xl font-bold font-mono text-[#1C1917]">Model-Free MCP</div>
          <p className="text-[#57534E] leading-normal">
            Zero external LLM API cost during lookup; fast local stdio indexing.
          </p>
        </div>
        <div className="space-y-1">
          <div className="font-mono text-[11px] text-[#78716C] uppercase tracking-wider">Primary Risk</div>
          <div className="text-xl font-bold font-mono text-[#991B1B]">CI Bot Churn</div>
          <p className="text-[#57534E] leading-normal">
            Automated PRs amending .claims/ files can pollute git logs and cause rebase collisions.
          </p>
        </div>
      </div>
    </section>
  );
};
