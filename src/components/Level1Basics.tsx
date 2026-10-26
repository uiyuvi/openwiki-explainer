import React, { useState } from 'react';
import { Info, HelpCircle } from 'lucide-react';

export const Level1Basics: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<number>(1);
  const [strategyMode, setStrategyMode] = useState<'minimal' | 'bloated' | 'openwiki'>('openwiki');

  const layers = [
    {
      id: 0,
      title: "1. Base System Prompt",
      tokens: 2400,
      description: "Fixed platform identity, instruction format, and safety constraints injected by the agent client (Claude, Cursor, Codex, Bob).",
      annotation: "Identical across all repositories. Cached by model providers."
    },
    {
      id: 1,
      title: "2. Repository AGENTS.md (Root Rules)",
      tokens: strategyMode === 'minimal' ? 150 : strategyMode === 'bloated' ? 6800 : 430,
      description: "Repository instructions parsed by the agent at the start of every session before evaluating any developer command.",
      annotation: strategyMode === 'minimal'
        ? "Minimal linting/formatting rules. Zero architectural orientation."
        : strategyMode === 'bloated'
        ? "Teams inline 25 package architecture manuals into AGENTS.md, causing high attention dilution."
        : "Standard rules + 12-line OpenWiki preamble commanding agent not to preload wikis at task start."
    },
    {
      id: 2,
      title: "3. Tool Schema Definitions (MCP / Native)",
      tokens: strategyMode === 'openwiki' ? 850 : 550,
      description: "JSON-RPC schemas describing callable tools: file readers, linters, bash execution, and MCP search tools.",
      annotation: "Registered in .bob/mcp.json or agent settings."
    },
    {
      id: 3,
      title: "4. Multi-Turn Session History",
      tokens: 4200,
      description: "Accumulated prior user messages, tool calls, bash outputs, and compiler errors in the current conversation.",
      annotation: "On subsequent turns, static prefixes (system prompt + AGENTS.md) hit the prompt cache."
    },
    {
      id: 4,
      title: "5. Active User Command",
      tokens: 45,
      description: "The concrete user instruction (e.g., 'Rename usr to user in Header.tsx').",
      annotation: "The model parses all preceding layers before deciding how to execute this command."
    }
  ];

  const totalBufferTokens = layers.reduce((acc, l) => acc + l.tokens, 0);

  return (
    <section id="basics" className="space-y-6 scroll-mt-20 py-10 border-b border-[#E7E5E0]">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#92400E] font-semibold">
          <span>Level 01</span>
          <span>·</span>
          <span>Context Bootstrapping</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917] mt-1">
          The Anatomy of an Agent's Context Window
        </h2>
        <p className="text-sm text-[#57534E] mt-2 max-w-3xl leading-relaxed">
          When an engineer sends a command to a coding agent, the LLM does not begin with an empty buffer. It constructs a sequential stack of instructions. The size and structure of this stack dictate both startup latency and reasoning accuracy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Visual Context Buffer (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Strategy Toggle */}
          <div className="flex items-center justify-between text-xs border-b border-[#E7E5E0] pb-2">
            <span className="font-semibold text-[#1C1917]">Simulate AGENTS.md Architecture:</span>
            <div className="flex items-center gap-1 bg-[#F5F5F0] p-0.5 rounded border border-[#E7E5E0]">
              <button
                onClick={() => setStrategyMode('minimal')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer text-xs ${
                  strategyMode === 'minimal' ? 'bg-white font-semibold text-[#1C1917] shadow-xs' : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                Minimal Rules
              </button>
              <button
                onClick={() => setStrategyMode('bloated')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer text-xs ${
                  strategyMode === 'bloated' ? 'bg-[#FEE2E2] font-semibold text-[#991B1B]' : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                Inlined ADRs (Bloated)
              </button>
              <button
                onClick={() => setStrategyMode('openwiki')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer text-xs ${
                  strategyMode === 'openwiki' ? 'bg-[#FEF3C7] font-semibold text-[#78350F]' : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                OpenWiki Preamble
              </button>
            </div>
          </div>

          {/* Interactive Stack Visualization */}
          <div className="space-y-1.5 font-mono text-xs">
            {layers.map((layer) => {
              const isSelected = activeLayer === layer.id;
              const widthPct = Math.max(12, Math.round((layer.tokens / totalBufferTokens) * 100));

              return (
                <div
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  className={`p-3 rounded border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#B45309] shadow-xs ring-1 ring-[#D97706]/30'
                      : 'bg-[#FDFDFC] border-[#E7E5E0] hover:border-[#D6D3CD]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-sans font-semibold ${isSelected ? 'text-[#1C1917]' : 'text-[#57534E]'}`}>
                      {layer.title}
                    </span>
                    <span className="text-[#92400E] font-semibold tabular-nums">
                      {layer.tokens.toLocaleString()} tok ({widthPct}%)
                    </span>
                  </div>

                  {/* Relative bar */}
                  <div className="w-full h-1.5 bg-[#EFEFEA] rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full transition-all duration-300 ${
                        layer.id === 1 && strategyMode === 'bloated'
                          ? 'bg-[#DC2626]'
                          : layer.id === 1 && strategyMode === 'openwiki'
                          ? 'bg-[#D97706]'
                          : 'bg-[#78716C]'
                      }`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-xs font-mono pt-1 text-[#78716C]">
            <span>Total Startup Context Buffer</span>
            <span className="font-bold text-[#1C1917] tabular-nums">
              {totalBufferTokens.toLocaleString()} tokens
            </span>
          </div>

        </div>

        {/* Right Column: Sidenote & Deep Inspection (5 cols) */}
        <div className="lg:col-span-5 space-y-4 bg-[#F5F5F0] border border-[#E7E5E0] rounded-lg p-5">
          <div className="border-b border-[#E7E5E0] pb-2 flex justify-between items-center">
            <span className="text-xs font-mono uppercase tracking-wider text-[#92400E] font-semibold">
              Layer Inspection
            </span>
            <span className="text-xs font-mono text-[#78716C]">
              {layers[activeLayer].tokens.toLocaleString()} tokens
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#1C1917]">
              {layers[activeLayer].title}
            </h3>
            <p className="text-xs text-[#57534E] leading-relaxed">
              {layers[activeLayer].description}
            </p>
          </div>

          <div className="pt-2 border-t border-[#E7E5E0] text-xs space-y-1">
            <span className="font-semibold text-[#1C1917]">Operational Consequence:</span>
            <p className="text-[#78716C] leading-relaxed">
              {layers[activeLayer].annotation}
            </p>
          </div>

          {/* Sidenote callout */}
          <div className="pt-3 border-t border-[#E7E5E0] text-xs text-[#57534E] italic font-serif leading-relaxed">
            "Every token placed in AGENTS.md enters the attention matrix prior to user intent. If you paste 500 lines of ADR prose here, a simple variable rename pays for the entire architecture manual on turn 1."
          </div>
        </div>

      </div>

    </section>
  );
};
