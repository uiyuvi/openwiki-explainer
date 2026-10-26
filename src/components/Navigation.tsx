import React from 'react';
import { SectionId } from '../types';

interface NavigationProps {
  activeSection: SectionId;
  onSelectSection: (section: SectionId) => void;
  onResetAll: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  onSelectSection,
  onResetAll
}) => {
  const navItems: { id: SectionId; label: string; number: string }[] = [
    { id: 'basics', label: 'Context Stack', number: '01' },
    { id: 'grep-vs-wiki', label: 'Grep vs. Wiki', number: '02' },
    { id: 'how-it-loads', label: 'Context Loading', number: '03' },
    { id: 'benchmark-trap', label: 'Token Economics', number: '04' },
    { id: 'proposals', label: 'Team Proposals', number: '05' },
    { id: 'ci-drawbacks', label: 'Git Diff & CI', number: '06' },
    { id: 'scorecard', label: 'Decision Rubric', number: '07' }
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-6">
        
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              onSelectSection('basics');
            }}
            className="text-base font-bold tracking-tight text-black hover:opacity-70 transition-opacity"
          >
            OpenWiki <span className="font-mono text-xs font-normal text-zinc-500">· State Explorable</span>
          </a>
        </div>

        {/* Zone 2: Navigation */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-zinc-600">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`transition-colors cursor-pointer py-1 flex items-baseline gap-1 ${
                  isActive
                    ? 'text-black font-bold border-b-2 border-black'
                    : 'hover:text-black'
                }`}
              >
                <span className="text-[10px] font-mono text-zinc-400">{item.number}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onSelectSection('scorecard')}
            className="px-3 py-1.5 text-xs font-mono font-bold text-white bg-black hover:bg-zinc-800 rounded transition-all cursor-pointer shadow-xs active:translate-y-0.5"
          >
            Run Decision Rubric
          </button>
          <button
            onClick={onResetAll}
            title="Reset simulation parameters to defaults"
            className="hidden sm:inline-flex px-2 py-1.5 text-xs font-mono text-zinc-600 hover:text-black hover:bg-zinc-100 rounded transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>

      </div>

      {/* Mobile navigation strip */}
      <div className="lg:hidden px-4 py-2 border-t border-zinc-200 overflow-x-auto flex items-center gap-4 text-xs font-medium bg-zinc-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectSection(item.id)}
            className={`whitespace-nowrap shrink-0 py-0.5 cursor-pointer ${
              activeSection === item.id
                ? 'text-black font-bold border-b-2 border-black'
                : 'text-zinc-500 hover:text-black'
            }`}
          >
            {item.number}. {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
