import React, { useState } from 'react';
import { Layers, Terminal, Database, FileText, Check, ShieldAlert } from 'lucide-react';

export const Level3HowItLoads: React.FC = () => {
  const [selectedPreambleLine, setSelectedPreambleLine] = useState<number>(0);

  const preambleLines = [
    {
      id: 0,
      code: "<!-- OPENWIKI:START -->\n## OpenWiki",
      title: "1. The Managed Section Anchors",
      description: "Delimits the block injected and maintained by OpenWiki tooling. Allows scheduled workflows to refresh it cleanly without merge conflicts.",
      agentImpact: "Agent identifies the section header and recognizes it as tooling instructions."
    },
    {
      id: 1,
      code: "This repository has a generated openwiki/ evidence index. It is optional just-in-time context, not required startup reading.",
      title: "2. The 'Just-in-Time' Negative Guardrail",
      description: "Crucial line. Tells the LLM that this is NOT mandatory reading at boot. Overrides the model's natural instinct to ingest all mentioned files.",
      agentImpact: "Prevents the model from preloading quickstart.md when a task is simple."
    },
    {
      id: 2,
      code: "- Do not enumerate, preload, or search wikis at task start. Use retrieval when the user asks for it, when unfamiliar architecture or dependency behavior materially affects the task, or when source inspection leaves an important uncertainty. Stop once the question is grounded.",
      title: "3. The Operational Stop Constraint",
      description: "Explicit negative command. Forbids automatic browsing and commands early termination as soon as the specific anchor is found.",
      agentImpact: "Saves ~3,200 tokens on simple tasks by forcing the agent to skip wiki tools unless genuinely stuck."
    },
    {
      id: 3,
      code: "- When those conditions apply and OpenWiki retrieval tools are available, use openwiki_search for just-in-time context and openwiki_read for the relevant complete sections.",
      title: "4. The MCP Routing Directive",
      description: "Directs the agent to query the local MCP server rather than loading raw markdown files from disk. MCP returns compact, ranked section anchors.",
      agentImpact: "Agent calls openwiki_search() via .bob/mcp.json, returning ~180 tokens rather than reading entire pages."
    },
    {
      id: 4,
      code: "- If the retrieval tools are unavailable, read openwiki/quickstart.md and follow its links to the relevant pages.",
      title: "5. The Fallback Protocol",
      description: "Ensures agents running without MCP can still discover architecture through quickstart.md links.",
      agentImpact: "Graceful fallback if MCP isn't registered in the IDE."
    },
    {
      id: 5,
      code: "- Treat source code and tests as authoritative. The scheduled OpenWiki workflow refreshes the repository wiki. Do not hand-edit generated OpenWiki pages...",
      title: "6. Ground Truth Authority Rule",
      description: "Establishes that actual TypeScript/Go/Python source code overrides wiki claims if a discrepancy exists.",
      agentImpact: "Prevents the agent from trusting stale documentation if a recent uncommitted change contradicts it."
    }
  ];

  return (
    <section id="how-it-loads" className="space-y-6 scroll-mt-20 py-8 border-b border-stone-200">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-amber-700 font-semibold">
          <span>Level 03</span>
          <span aria-hidden="true">·</span>
          <span>Demystifying Context Loading</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
          How OpenWiki Actually Loads: The 3-Tier Architecture
        </h2>
        <p className="text-sm text-stone-600 mt-2 max-w-3xl leading-relaxed">
          The most widespread misconception among engineers is that OpenWiki inlines generated documentation into the agent's prompt. In reality, OpenWiki never inlines pages. It decouples context into three distinct architectural tiers.
        </p>
      </div>

      {/* 3-Tier Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Tier 1 */}
        <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-amber-800 font-semibold">Tier 1 · In-Context</span>
            <span className="text-[11px] text-stone-500 font-mono">~280 tok</span>
          </div>
          <h3 className="text-sm font-bold text-stone-900">Root AGENTS.md Preamble</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            A static, 12-line managed block in the repository root. Contains negative guardrails commanding the agent <em>not</em> to preload documentation on startup.
          </p>
          <div className="pt-2 text-[11px] text-emerald-700 font-mono font-medium">
            Discounted by ~90% on Turns 2+ via Prompt Caching.
          </div>
        </div>

        {/* Tier 2 */}
        <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-800 font-semibold">Tier 2 · On-Demand</span>
            <span className="text-[11px] text-stone-500 font-mono">Model-Free</span>
          </div>
          <h3 className="text-sm font-bold text-stone-900">Local MCP Server (.bob/mcp.json)</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Registered in the developer's agent config. Exposes <code className="font-mono text-stone-800 bg-stone-100 px-1 py-0.5 rounded">openwiki_search</code> and <code className="font-mono text-stone-800 bg-stone-100 px-1 py-0.5 rounded">openwiki_read</code> over stdio. Runs local keyword queries with zero external LLM API cost.
          </p>
          <div className="pt-2 text-[11px] text-stone-500 font-mono">
            Returns surgical section anchors (&lt;500 tokens).
          </div>
        </div>

        {/* Tier 3 */}
        <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-stone-800 font-semibold">Tier 3 · Repository Files</span>
            <span className="text-[11px] text-stone-500 font-mono">Disk Storage</span>
          </div>
          <h3 className="text-sm font-bold text-stone-900">Grounded Claims (.claims/)</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Generated Markdown pages and claim sidecars stored in <code className="font-mono text-stone-800 bg-stone-100 px-1 py-0.5 rounded">openwiki/.claims/</code>. Every claim links a factual assertion to an exact file range and commit hash.
          </p>
          <div className="pt-2 text-[11px] text-stone-500 font-mono">
            Never inlined into AGENTS.md directly.
          </div>
        </div>

      </div>

      {/* Interactive 12-Line X-Ray */}
      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-900">
            Interactive X-Ray: Why Every Line in the 12-Line Block Matters
          </h3>
          <span className="text-xs text-stone-500">Click any block to inspect its agent behavioral impact</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Code Block Inspector (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
            <div className="bg-stone-100 px-4 py-2 border-b border-stone-200 flex items-center justify-between text-xs font-mono text-stone-600">
              <span>AGENTS.md &gt; &lt;!-- OPENWIKI:START --&gt;</span>
              <span className="text-emerald-700 font-semibold">~280 input tokens</span>
            </div>

            <div className="p-4 font-mono text-xs space-y-2 leading-relaxed bg-stone-50/50">
              {preambleLines.map((line) => {
                const isSelected = selectedPreambleLine === line.id;
                return (
                  <div
                    key={line.id}
                    onClick={() => setSelectedPreambleLine(line.id)}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50 border-amber-500 text-stone-900 shadow-xs'
                        : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300'
                    }`}
                  >
                    <pre className="whitespace-pre-wrap">{line.code}</pre>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Behavioral Impact Card (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-stone-200 rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-xs font-semibold text-amber-800">Behavioral Impact</span>
                <span className="text-xs font-mono text-stone-500">
                  Block {selectedPreambleLine + 1} of {preambleLines.length}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  {preambleLines[selectedPreambleLine].title}
                </h4>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {preambleLines[selectedPreambleLine].description}
                </p>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-1.5">
                <div className="text-xs font-semibold text-stone-800">Observed Agent Behavior:</div>
                <p className="text-xs text-amber-900 font-mono leading-relaxed">
                  {preambleLines[selectedPreambleLine].agentImpact}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 text-[11px] text-stone-500 leading-relaxed">
              <strong>Key Rule:</strong> Do not shorten or delete the negative guardrail words. Deleting line 2 or 3 removes the stop condition and triggers false-positive file reads.
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
