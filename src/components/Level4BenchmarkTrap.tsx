import React, { useState } from 'react';
import { Calculator, ArrowRight, Check, AlertCircle } from 'lucide-react';

export const Level4BenchmarkTrap: React.FC = () => {
  const [teamSize, setTeamSize] = useState<number>(5);
  const [trivialPerDev, setTrivialPerDev] = useState<number>(20);
  const [archPerDev, setArchPerDev] = useState<number>(3);
  const [promptCaching, setPromptCaching] = useState<boolean>(true);

  // Amortized math grounded in empirical findings:
  // 1. Blind Grep:
  //    Trivial prompt = 420 tokens
  //    Arch prompt = 22,400 tokens (7 grep/read calls across packages)
  const totalGrep = ((trivialPerDev * 420) + (archPerDev * 22400)) * teamSize;

  // 2. Shortened 2-Line Path (strips negative guardrails):
  //    Trivial prompt: 35% trigger eager read_file('quickstart.md') = 3,200 tok penalty
  //    Arch prompt: 6,400 tokens
  const twoLineStartupPerDev = promptCaching
    ? 45 + Math.max(0, trivialPerDev + archPerDev - 1) * 5
    : (trivialPerDev + archPerDev) * 45;
  const eagerPenalty = Math.round(trivialPerDev * 0.35 * 3200);
  const totalShort = (((trivialPerDev * 420) + eagerPenalty + (archPerDev * 6400)) + twoLineStartupPerDev) * teamSize;

  // 3. OpenWiki 12-Line + MCP:
  //    Startup = 280 tokens on Turn 1; ~28 tokens on Turns 2+ (cached)
  //    Trivial = 420 tokens (0 wiki tool calls due to negative guardrail)
  //    Arch = 1,200 tokens (surgical search + read)
  const openwikiStartupPerDev = promptCaching
    ? (trivialPerDev + archPerDev > 0 ? 280 + (trivialPerDev + archPerDev - 1) * 28 : 0)
    : (trivialPerDev + archPerDev) * 280;
  const totalOpenWiki = (((trivialPerDev * 420) + (archPerDev * 1200)) + openwikiStartupPerDev) * teamSize;

  const maxVal = Math.max(totalGrep, totalShort, totalOpenWiki, 1000);
  const percentSaved = Math.round(((totalGrep - totalOpenWiki) / totalGrep) * 100);

  return (
    <section id="benchmark-trap" className="space-y-6 scroll-mt-20 py-10 border-b border-[#E7E5E0]">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#92400E] font-semibold">
          <span>Level 04</span>
          <span>·</span>
          <span>Amortized Mathematics</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917] mt-1">
          The "Rename Variable" Evaluation Trap & Token Physics
        </h2>
        <p className="text-sm text-[#57534E] mt-2 max-w-3xl leading-relaxed">
          Teams frequently evaluate OpenWiki by opening a new agent session, typing <code className="font-mono text-xs bg-[#F5F5F0] px-1 py-0.5 rounded text-[#1C1917]">"rename usr to user in Header.tsx"</code>, and noticing that the 280-token preamble was loaded for an irrelevant task. While technically true, testing isolated trivial prompts commits a fundamental sampling bias.
        </p>
      </div>

      {/* Reactive Essay Block (Bret Victor / Tangle Style) */}
      <div className="p-5 rounded-lg bg-[#F5F5F0] border border-[#E7E5E0] space-y-4 text-sm text-[#44403C] leading-relaxed">
        <div className="flex items-center justify-between border-b border-[#E7E5E0] pb-2 text-xs">
          <span className="font-semibold text-[#1C1917]">Interactive Workload Simulator: Click or drag numbers below</span>
          <label className="flex items-center gap-1.5 cursor-pointer text-[#78716C] font-mono">
            <input
              type="checkbox"
              checked={promptCaching}
              onChange={(e) => setPromptCaching(e.target.checked)}
              className="accent-[#B45309] rounded cursor-pointer"
            />
            <span>Prompt Caching Active</span>
          </label>
        </div>

        <p className="font-serif text-base sm:text-lg text-[#1C1917]">
          Suppose your engineering team of{' '}
          <span className="tangle-token" onClick={() => setTeamSize(teamSize === 20 ? 1 : teamSize + 1)}>
            {teamSize} developers
          </span>{' '}
          averages{' '}
          <span className="tangle-token" onClick={() => setTrivialPerDev(trivialPerDev >= 50 ? 5 : trivialPerDev + 5)}>
            {trivialPerDev} trivial prompts
          </span>{' '}
          and{' '}
          <span className="tangle-token" onClick={() => setArchPerDev(archPerDev >= 10 ? 0 : archPerDev + 1)}>
            {archPerDev} cross-package tasks
          </span>{' '}
          per person per day.
        </p>

        {/* Sliders for precision control */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs font-mono">
          <div className="space-y-1">
            <div className="flex justify-between text-[#78716C]">
              <span>Team Size</span>
              <span className="font-bold text-[#1C1917]">{teamSize}</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              value={teamSize}
              onChange={(e) => setTeamSize(parseInt(e.target.value, 10))}
              className="w-full accent-[#B45309] cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[#78716C]">
              <span>Trivial Prompts / Day</span>
              <span className="font-bold text-[#1C1917]">{trivialPerDev}</span>
            </div>
            <input
              type="range"
              min="1"
              max="60"
              value={trivialPerDev}
              onChange={(e) => setTrivialPerDev(parseInt(e.target.value, 10))}
              className="w-full accent-[#B45309] cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[#78716C]">
              <span>Cross-Package Tasks / Day</span>
              <span className="font-bold text-[#1C1917]">{archPerDev}</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              value={archPerDev}
              onChange={(e) => setArchPerDev(parseInt(e.target.value, 10))}
              className="w-full accent-[#B45309] cursor-pointer"
            />
          </div>
        </div>

        {/* Amortized token comparison bar chart */}
        <div className="space-y-3 pt-4 border-t border-[#E7E5E0]">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-semibold text-[#1C1917]">Daily Cumulative Token Consumption:</span>
            <span className={`font-bold ${percentSaved > 0 ? 'text-[#047857]' : 'text-[#78716C]'}`}>
              {percentSaved > 0 ? `${percentSaved}% Net Token Savings with OpenWiki` : 'Equal or Higher Overhead'}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            {/* 1. Raw Code */}
            <div>
              <div className="flex justify-between pb-1 text-[#78716C]">
                <span>1. Raw Monorepo (Blind Grep)</span>
                <span className="text-[#991B1B] font-bold tabular-nums">{totalGrep.toLocaleString()} tokens</span>
              </div>
              <div className="w-full h-2.5 bg-[#E7E5E0] rounded-sm overflow-hidden">
                <div
                  className="h-full bg-[#B91C1C] transition-all duration-300"
                  style={{ width: `${Math.max(4, Math.round((totalGrep / maxVal) * 100))}%` }}
                />
              </div>
            </div>

            {/* 2. Shortened 2-Line */}
            <div>
              <div className="flex justify-between pb-1 text-[#78716C]">
                <span>2. Shortened 2-Line Path (Eager file read penalty)</span>
                <span className="text-[#B45309] font-bold tabular-nums">{totalShort.toLocaleString()} tokens</span>
              </div>
              <div className="w-full h-2.5 bg-[#E7E5E0] rounded-sm overflow-hidden">
                <div
                  className="h-full bg-[#D97706] transition-all duration-300"
                  style={{ width: `${Math.max(4, Math.round((totalShort / maxVal) * 100))}%` }}
                />
              </div>
            </div>

            {/* 3. OpenWiki 12-Line + MCP */}
            <div>
              <div className="flex justify-between pb-1 text-[#78716C]">
                <span className="text-[#065F46] font-bold">3. OpenWiki 12-Line Managed Block + MCP</span>
                <span className="text-[#047857] font-bold tabular-nums">{totalOpenWiki.toLocaleString()} tokens</span>
              </div>
              <div className="w-full h-2.5 bg-[#E7E5E0] rounded-sm overflow-hidden">
                <div
                  className="h-full bg-[#059669] transition-all duration-300"
                  style={{ width: `${Math.max(4, Math.round((totalOpenWiki / maxVal) * 100))}%` }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* The 3 Proper Team Benchmarks Protocol */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-bold text-[#1C1917]">
          How to Run Your Team's 3 Benchmarks Without Sampling Bias:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded border border-[#E7E5E0] bg-[#FDFDFC] space-y-1.5">
            <div className="font-mono text-[#92400E] font-bold">1. Token Baseline</div>
            <p className="text-[#57534E] leading-relaxed">
              Compare trivial tasks with vs. without OpenWiki across <em>multi-turn</em> sessions to account for prompt cache hits (~28 tokens after turn 1).
            </p>
          </div>
          <div className="p-3.5 rounded border border-[#E7E5E0] bg-[#FDFDFC] space-y-1.5">
            <div className="font-mono text-[#047857] font-bold">2. Accuracy Check</div>
            <p className="text-[#57534E] leading-relaxed">
              Confirm the agent uses <code className="font-mono text-[#1C1917]">openwiki_search</code> for architecture queries instead of hallucinating outdated ADR prose.
            </p>
          </div>
          <div className="p-3.5 rounded border border-[#E7E5E0] bg-[#FDFDFC] space-y-1.5">
            <div className="font-mono text-[#78350F] font-bold">3. False Positive Rate</div>
            <p className="text-[#57534E] leading-relaxed">
              Count how often the agent mentions OpenWiki in tasks that have nothing to do with it. With the 12-line guardrail, it is <strong>0/10</strong>.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
};
