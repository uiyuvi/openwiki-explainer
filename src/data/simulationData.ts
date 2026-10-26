import { SimulationResult, StrategyType, TaskType } from '../types';

export const SIMULATION_DATA: Record<TaskType, Record<StrategyType, SimulationResult>> = {
  trivial: {
    blind_grep: {
      startupTokens: 0,
      cachedStartupTokens: 0,
      toolTokens: 420,
      toolCalls: 1,
      totalTokens: 420,
      barPercent: 5,
      agentsTitle: "Root AGENTS.md (No Wiki)",
      agentsLines: [
        "(No OpenWiki preamble)",
        "Agent inspects target directly."
      ],
      verdictTone: "amber",
      verdictTitle: "Trivial Prompt Looks Cheap — But Masks Monorepo Risk",
      verdictDesc: "On a 1-line variable rename, having zero OpenWiki preamble costs only 420 tokens. However, this benchmark creates an illusion of efficiency: as soon as the agent faces a cross-package task, it falls back to blind grepping across dozens of packages.",
      steps: [
        {
          title: "1. Ingest AGENTS.md",
          detail: "0 OpenWiki tokens loaded. No architecture guidance present.",
          tokens: "+0 tok",
          tokenDelta: 0,
          highlightPath: 'none',
          status: "Parsing instructions"
        },
        {
          title: "2. Inspect Target File",
          detail: "Agent calls read_file('apps/web/Header.tsx').",
          tokens: "+420 tok",
          tokenDelta: 420,
          highlightPath: 'monorepo',
          status: "Reading Header.tsx"
        },
        {
          title: "3. Apply Variable Rename",
          detail: "Renamed 'usr' to 'user' in Header.tsx. Session finished.",
          tokens: "Total: 420 tok",
          tokenDelta: 0,
          highlightPath: 'none',
          status: "Complete"
        }
      ]
    },
    bloated_adr: {
      startupTokens: 6800,
      cachedStartupTokens: 680,
      toolTokens: 420,
      toolCalls: 1,
      totalTokens: 7220,
      barPercent: 58,
      agentsTitle: "Bloated AGENTS.md (500+ lines inlined)",
      agentsLines: [
        "## Architecture & ADR 001..025",
        "## Legacy Migration Notes",
        "## Full Monorepo Directory Map"
      ],
      verdictTone: "rose",
      verdictTitle: "Severe Attention Dilution & Unnecessary Prefill Burn",
      verdictDesc: "Inlining entire architecture guidelines for 25 packages into AGENTS.md forces the model to attend over 6,800 tokens of backend rules for a simple UI variable rename, slowing down TTFT and diluting attention.",
      steps: [
        {
          title: "1. Ingest 500-Line AGENTS.md",
          detail: "Loads billing, auth, and data-pipeline prose for a simple frontend rename.",
          tokens: "+6,800 tok",
          tokenDelta: 6800,
          highlightPath: 'none',
          status: "Prefilling huge prompt"
        },
        {
          title: "2. Attention Filtering",
          detail: "Model parses irrelevant architectural constraints before identifying the UI file.",
          tokens: "+0 tok (delay)",
          tokenDelta: 0,
          highlightPath: 'none',
          status: "Filtering irrelevant rules"
        },
        {
          title: "3. Inspect & Edit Header.tsx",
          detail: "read_file('apps/web/Header.tsx') and renames 'usr' to 'user'.",
          tokens: "+420 tok",
          tokenDelta: 420,
          highlightPath: 'monorepo',
          status: "Complete"
        }
      ]
    },
    two_line_short: {
      startupTokens: 45,
      cachedStartupTokens: 5,
      toolTokens: 3620,
      toolCalls: 2,
      totalTokens: 3665,
      barPercent: 32,
      agentsTitle: "Shortened 2-Line Block (Missing Guardrails)",
      agentsLines: [
        "## Documentation",
        "Index at openwiki/quickstart.md",
        "<!-- Negative guardrail deleted -->"
      ],
      verdictTone: "rose",
      verdictTitle: "The Eager Exploration Trap: 2-Line Trim Backfires",
      verdictDesc: "Deleting the negative guardrail ('Do not enumerate, preload, or search wikis at task start') removes the stop condition. The agent treats the bare quickstart.md path as mandatory reading—burning 3,200 extra tokens on a simple rename to save 235 startup tokens!",
      steps: [
        {
          title: "1. Ingest 2-Line AGENTS.md",
          detail: "Sees bare pointer: 'openwiki/quickstart.md' with no 'do not preload' constraint.",
          tokens: "+45 tok",
          tokenDelta: 45,
          highlightPath: 'none',
          status: "Saw bare file path"
        },
        {
          title: "2. Eager Exploration Trap",
          detail: "Agent calls read_file('openwiki/quickstart.md') to ensure no rules are missed.",
          tokens: "+3,200 tok",
          tokenDelta: 3200,
          highlightPath: 'raw_wiki',
          status: "Reading quickstart.md"
        },
        {
          title: "3. Edit Target File",
          detail: "read_file('apps/web/Header.tsx') and rename variable.",
          tokens: "+420 tok",
          tokenDelta: 420,
          highlightPath: 'monorepo',
          status: "Complete"
        }
      ]
    },
    openwiki_mcp: {
      startupTokens: 280,
      cachedStartupTokens: 28,
      toolTokens: 420,
      toolCalls: 1,
      totalTokens: 448, // with prompt caching
      barPercent: 6,
      agentsTitle: "OpenWiki 12-Line Guardrail + MCP",
      agentsLines: [
        "Optional just-in-time context.",
        "Do NOT preload at task start.",
        "Use openwiki_search only if needed."
      ],
      verdictTone: "emerald",
      verdictTitle: "Zero False Positives on Trivial Tasks",
      verdictDesc: "Because the 12-line preamble explicitly commands 'Do not enumerate, preload, or search wikis at task start', the agent makes 0 calls to OpenWiki on a rename. With prefix prompt caching, the 280-token preamble costs just ~28 effective tokens after turn 1.",
      steps: [
        {
          title: "1. Ingest 12-Line Guardrail",
          detail: "Reads prompt-cached rule (~28 effective tokens): 'Do not preload wiki at task start'.",
          tokens: "+28 tok (cached)",
          tokenDelta: 28,
          highlightPath: 'none',
          status: "Rule: Skip wiki"
        },
        {
          title: "2. Zero Wiki Tool Calls",
          detail: "Task is local and unambiguous. Agent bypasses openwiki_search completely.",
          tokens: "+0 tok",
          tokenDelta: 0,
          highlightPath: 'none',
          status: "Bypassed wiki"
        },
        {
          title: "3. Direct Target File Edit",
          detail: "read_file('apps/web/Header.tsx') and updates variable directly.",
          tokens: "+420 tok",
          tokenDelta: 420,
          highlightPath: 'monorepo',
          status: "Complete"
        }
      ]
    }
  },
  architectural: {
    blind_grep: {
      startupTokens: 0,
      cachedStartupTokens: 0,
      toolTokens: 22400,
      toolCalls: 7,
      totalTokens: 22400,
      barPercent: 95,
      agentsTitle: "Root AGENTS.md (No Wiki)",
      agentsLines: [
        "(No OpenWiki preamble)",
        "Zero cross-package architecture map."
      ],
      verdictTone: "rose",
      verdictTitle: "The Blind Monorepo Grep Loop (22,400+ Tokens)",
      verdictDesc: "Without an index, the agent runs grep 'Reporter' across 25 packages, matches 43 files, reads multiple candidate files sequentially, and burns over 22,000 tokens rediscovering architecture from scratch.",
      steps: [
        {
          title: "1. Monorepo Blind Grep",
          detail: "grep('Reporter') matches 43 files across packages/reporter, packages/billing, and packages/core.",
          tokens: "+3,100 tok",
          tokenDelta: 3100,
          highlightPath: 'monorepo',
          status: "Running grep"
        },
        {
          title: "2. Ingest Candidate Source Files",
          detail: "Reads packages/legacy-reporter/index.ts, packages/logger/reporter.ts, and dispatcher.ts.",
          tokens: "+11,800 tok",
          tokenDelta: 11800,
          highlightPath: 'monorepo',
          status: "Reading 3 huge files"
        },
        {
          title: "3. Trace Cross-Package Events",
          detail: "Additional grep and read_file calls to trace retry event consumers in packages/billing/events.ts.",
          tokens: "+7,500 tok",
          tokenDelta: 7500,
          highlightPath: 'monorepo',
          status: "Tracing billing consumer"
        }
      ]
    },
    bloated_adr: {
      startupTokens: 6800,
      cachedStartupTokens: 680,
      toolTokens: 8900,
      toolCalls: 4,
      totalTokens: 15700,
      barPercent: 68,
      agentsTitle: "Bloated AGENTS.md (500+ lines inlined)",
      agentsLines: [
        "## Static ADR Prose (Drifted)",
        "## Outdated Class Names",
        "## Unverified Narrative Docs"
      ],
      verdictTone: "rose",
      verdictTitle: "Context Rot: Inlined Prose Drifts from Source Code",
      verdictDesc: "Static ADR prose inlined in AGENTS.md drifts over time. When file paths or class signatures change, the agent gets confused by conflicting instructions, forcing extra grep and verification reads.",
      steps: [
        {
          title: "1. Ingest 500-Line AGENTS.md",
          detail: "Loads 6,800 tokens of static architecture descriptions.",
          tokens: "+6,800 tok",
          tokenDelta: 6800,
          highlightPath: 'none',
          status: "Ingesting stale ADRs"
        },
        {
          title: "2. Path Mismatch Detected",
          detail: "ADR mentions packages/reporter/v1/dispatcher.ts which was moved; agent falls back to grep.",
          tokens: "+4,800 tok",
          tokenDelta: 4800,
          highlightPath: 'monorepo',
          status: "Resolving path drift"
        },
        {
          title: "3. Read Actual Source Files",
          detail: "Reads packages/reporter/src/dispatcher.ts to confirm true runtime implementation.",
          tokens: "+4,100 tok",
          tokenDelta: 4100,
          highlightPath: 'monorepo',
          status: "Confirming source"
        }
      ]
    },
    two_line_short: {
      startupTokens: 45,
      cachedStartupTokens: 5,
      toolTokens: 6400,
      toolCalls: 3,
      totalTokens: 6445,
      barPercent: 44,
      agentsTitle: "Shortened 2-Line Block (Missing MCP Rules)",
      agentsLines: [
        "## Documentation",
        "Index at openwiki/quickstart.md",
        "<!-- MCP instructions omitted -->"
      ],
      verdictTone: "amber",
      verdictTitle: "Reads Full Markdown Files Instead of Focused Sections",
      verdictDesc: "Without the 12-line instructions guiding the agent to call openwiki_search and openwiki_read on specific section anchors, the agent reads whole markdown files sequentially via standard read_file.",
      steps: [
        {
          title: "1. Read Full quickstart.md",
          detail: "Agent reads entire openwiki/quickstart.md (3,200 tokens) to find where Reporter is documented.",
          tokens: "+3,200 tok",
          tokenDelta: 3200,
          highlightPath: 'raw_wiki',
          status: "Reading quickstart.md"
        },
        {
          title: "2. Read Entire Architecture Page",
          detail: "Agent follows link to openwiki/architecture.md and reads full 2,400 token page.",
          tokens: "+2,400 tok",
          tokenDelta: 2400,
          highlightPath: 'raw_wiki',
          status: "Reading architecture.md"
        },
        {
          title: "3. Surgical Source Inspection",
          detail: "Reads packages/reporter/src/dispatcher.ts to confirm implementation.",
          tokens: "+800 tok",
          tokenDelta: 800,
          highlightPath: 'monorepo',
          status: "Inspecting source"
        }
      ]
    },
    openwiki_mcp: {
      startupTokens: 280,
      cachedStartupTokens: 28,
      toolTokens: 920,
      toolCalls: 2,
      totalTokens: 1200,
      barPercent: 8,
      agentsTitle: "OpenWiki 12-Line Guardrail + MCP",
      agentsLines: [
        "Use openwiki_search & openwiki_read.",
        "Stop once grounded.",
        "Code and tests are authoritative."
      ],
      verdictTone: "emerald",
      verdictTitle: "Surgical Just-in-Time Discovery (1,200 tok vs 22,400 tok)",
      verdictDesc: "Guided by the 12-line block and IDE mcp.json (Cursor / VS Code / Windsurf), the agent queries openwiki_search('Reporter retry propagation'), retrieves only the exact section via openwiki_read, follows the grounded claim line pointer, and immediately stops.",
      steps: [
        {
          title: "1. Call openwiki_search (Local MCP)",
          detail: "Model-free indexed search: 'Reporter retry propagation'. Returns ranked section anchor in <100ms.",
          tokens: "+180 tok",
          tokenDelta: 180,
          highlightPath: 'mcp',
          status: "MCP search query"
        },
        {
          title: "2. Call openwiki_read (Targeted Section)",
          detail: "Reads ONLY #reporter-retry section with grounded pointer repo://packages/reporter/src/dispatcher.ts#L40-L82.",
          tokens: "+440 tok",
          tokenDelta: 440,
          highlightPath: 'mcp',
          status: "MCP read section"
        },
        {
          title: "3. Inspect Exact Grounded Lines",
          detail: "Reads L40-L82 of packages/reporter/src/dispatcher.ts. Answers question with full fidelity.",
          tokens: "+300 tok",
          tokenDelta: 300,
          highlightPath: 'monorepo',
          status: "Grounded & Complete"
        }
      ]
    }
  }
};
