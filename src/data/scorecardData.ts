export interface ScorecardQuestion {
  id: string;
  category: string;
  question: string;
  context: string;
  options: {
    label: string;
    description: string;
    points: number; // positive = favors OpenWiki, neutral = favors ADRs, negative = favors Raw Code
  }[];
}

export const SCORECARD_QUESTIONS: ScorecardQuestion[] = [
  {
    id: 'repo-scale',
    category: 'Repository Scale & Topology',
    question: 'How large and fragmented is your codebase?',
    context: 'OpenWiki overhead scales down poorly on small codebases, but excels in massive multi-package monorepos.',
    options: [
      {
        label: 'Massive Monorepo (500k+ LoC, 15+ internal packages)',
        description: 'Cross-package discovery is difficult and developers struggle to trace dependency flow.',
        points: 25
      },
      {
        label: 'Medium Multi-Package Repo (100k–500k LoC, 4–14 packages)',
        description: 'Moderately complex with recurring cross-boundary feature work.',
        points: 15
      },
      {
        label: 'Compact Repo or Monolith (<100k LoC, 1–3 packages)',
        description: 'Single cohesive codebase where ripgrep finds exact symbols in seconds.',
        points: -10
      }
    ]
  },
  {
    id: 'task-profile',
    category: 'Daily Task Composition',
    question: 'What percentage of your coding agent prompts are cross-package vs. localized fixes?',
    context: 'If 95% of tasks are local variable renames or 1-file bugfixes, OpenWiki adds startup friction without payback.',
    options: [
      {
        label: 'Heavy Cross-Package Work (>30% cross-module architectural tasks)',
        description: 'Frequent refactors, event tracing, contract changes, and inter-service migrations.',
        points: 25
      },
      {
        label: 'Mixed Workload (10–30% cross-package exploration)',
        description: 'Regular balance between local feature implementation and broader architectural queries.',
        points: 12
      },
      {
        label: 'Predominantly Local (<10% cross-package work)',
        description: 'Almost entirely UI tweaks, localized unit tests, or isolated bugfixes.',
        points: -15
      }
    ]
  },
  {
    id: 'ci-budget',
    category: 'CI Workflow & Bot PR Tolerance',
    question: 'Can your team tolerate automated bot commits and extra CI run time?',
    context: 'OpenWiki scheduled workflows generate automated diffs in openwiki/.claims/ to track code changes.',
    options: [
      {
        label: 'High Automation Tolerance (Dedicated CI runners, bot PRs welcome)',
        description: 'Team already uses Renovate/Dependabot and has ample CI concurrency.',
        points: 20
      },
      {
        label: 'Moderate Tolerance (CI minutes monitored, prefer batched nightly runs)',
        description: 'Acceptable if bot PRs are scheduled off-peak or consolidated into release branches.',
        points: 10
      },
      {
        label: 'Zero Bot Churn (Strict git history, constrained CI budget)',
        description: 'Developers dislike bot-generated commits and rebase conflicts on active branches.',
        points: -20
      }
    ]
  },
  {
    id: 'agent-frequency',
    category: 'Agent Adoption & Prompt Caching',
    question: 'How frequently do developers use AI coding agents (Claude, Codex, IBM Bob)?',
    context: 'Prompt caching discounts static AGENTS.md overhead by ~90% on multi-turn sessions.',
    options: [
      {
        label: 'Deep Daily Agent Usage (Multi-turn pair-programming throughout the day)',
        description: 'High prompt cache hit rate amortizes the 280-token preamble down to ~28 tokens per turn.',
        points: 20
      },
      {
        label: 'Occasional Agent Usage (Sporadic single-turn questions)',
        description: 'Moderate cache utilization across isolated developer sessions.',
        points: 5
      },
      {
        label: 'Rare or Experimental Usage (Manual coding is standard)',
        description: 'Low prompt volume means tooling setup and maintenance overhead will dominate.',
        points: -15
      }
    ]
  },
  {
    id: 'doc-hygiene',
    category: 'Existing Architecture Documentation',
    question: 'What is the current state of your architectural documentation and ADRs?',
    context: 'If documentation is inlined in AGENTS.md, it rots quickly; if non-existent, agents explore blindly.',
    options: [
      {
        label: 'Scattered or Stale Docs (Outdated ADRs causing agent confusion)',
        description: 'OpenWiki grounded claims provide automated verification against actual code commit hashes.',
        points: 20
      },
      {
        label: 'Well-Maintained Modular Docs (Clean docs/ folder and clear READMEs)',
        description: 'Lightweight selective indexing or explicit skill triggers may be sufficient.',
        points: 5
      },
      {
        label: 'Self-Documenting Code (Strong TypeScript types, clean boundaries)',
        description: 'Agents already navigate accurately using native symbol search and type definitions.',
        points: -10
      }
    ]
  }
];

export interface ScorecardVerdict {
  recommendation: 'adopt' | 'consider_adr' | 'avoid';
  title: string;
  subtitle: string;
  score: number;
  badgeColor: string;
  analysis: string;
  actionItems: string[];
}

export function computeScorecardVerdict(answers: Record<string, number>): ScorecardVerdict {
  let totalScore = 0;
  
  SCORECARD_QUESTIONS.forEach(q => {
    const selectedIdx = answers[q.id];
    if (selectedIdx !== undefined && q.options[selectedIdx]) {
      totalScore += q.options[selectedIdx].points;
    }
  });

  // Score ranges from -70 to 110. Normalized into 0-100 scale:
  const normalizedScore = Math.max(0, Math.min(100, Math.round(((totalScore + 70) / 180) * 100)));

  if (normalizedScore >= 65) {
    return {
      recommendation: 'adopt',
      title: 'Strong Fit: Adopt OpenWiki + MCP',
      subtitle: 'Your monorepo scale and cross-package task frequency justify OpenWiki tooling.',
      score: normalizedScore,
      badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
      analysis: 'Your team frequently executes complex cross-package architectural work where blind grepping burns tens of thousands of tokens per developer per day. The 280-token startup cost in AGENTS.md will be amortized rapidly, and prompt caching will discount subsequent turns by ~90%.',
      actionItems: [
        'Keep the full 12-line managed block in AGENTS.md with negative guardrails intact.',
        'Install the local MCP configuration (e.g. openwiki integrations install bob --project).',
        'Configure CI to run openwiki --update on a nightly cron or PR merge rather than on every commit to curb CI churn.'
      ]
    };
  } else if (normalizedScore >= 40) {
    return {
      recommendation: 'consider_adr',
      title: 'Selective Fit: Consider Lightweight ADRs or Optional Skill',
      subtitle: 'OpenWiki offers benefits, but evaluate CI churn vs. manual maintenance.',
      score: normalizedScore,
      badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
      analysis: 'Your codebase has moderate complexity. While OpenWiki can prevent blind exploration on larger tasks, your team should consider whether the CI bot commit churn and MCP maintenance overhead align with your workflow priorities.',
      actionItems: [
        'Run the 3 Recommended Benchmarks (Token Baseline, Accuracy Check, False-Positive Rate) before full rollout.',
        'Test moving OpenWiki to an explicit optional skill (Proposal A) if trivial tasks dominate your workflow.',
        'Review existing docs/adr/ architecture to see if standard markdown files satisfy agent discovery.'
      ]
    };
  } else {
    return {
      recommendation: 'avoid',
      title: 'Negative ROI: Stick with Raw Code & Modular Boundaries',
      subtitle: 'OpenWiki tooling overhead outweighs token savings on your current repo.',
      score: normalizedScore,
      badgeColor: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
      analysis: 'Your repository is either compact or heavily dominated by localized 1-file tasks. Adding OpenWiki introduces unwanted CI churn, MCP server setup, and prompt noise with almost zero opportunity to amortize the startup token cost.',
      actionItems: [
        'Keep root AGENTS.md minimal (rules and project conventions only).',
        'Rely on ripgrep, TypeScript type definitions, and standard directory naming for agent discovery.',
        'Avoid inlining large prose docs in AGENTS.md to prevent context rot.'
      ]
    };
  }
}
