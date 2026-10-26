import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 py-8 border-t border-stone-200 text-xs text-stone-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left: Attribution & Scope */}
        <div className="flex flex-wrap items-center gap-2 text-stone-600">
          <span>OpenWiki Architectural Evaluation & Explorable Simulator</span>
          <span aria-hidden="true">·</span>
          <span>Designed for Software Engineers & Tech Leads</span>
        </div>

        {/* Right: Technical References */}
        <div className="flex items-center gap-3 text-stone-500 font-mono text-[11px]">
          <span>Grounded in langchain-ai/openwiki</span>
          <span aria-hidden="true">/</span>
          <span>arXiv:2602.11988</span>
          <span aria-hidden="true">/</span>
          <span>Model Context Protocol (MCP)</span>
        </div>

      </div>
    </footer>
  );
};
