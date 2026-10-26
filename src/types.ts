export type SectionId = 
  | 'basics' 
  | 'grep-vs-wiki' 
  | 'how-it-loads' 
  | 'benchmark-trap' 
  | 'proposals' 
  | 'ci-drawbacks' 
  | 'scorecard';

export type TaskType = 'trivial' | 'architectural';

export type StrategyType = 'blind_grep' | 'bloated_adr' | 'two_line_short' | 'openwiki_mcp';

export interface SimulationStep {
  title: string;
  detail: string;
  tokens: string;
  tokenDelta: number;
  highlightPath: 'monorepo' | 'raw_wiki' | 'mcp' | 'none';
  status: string;
}

export interface SimulationResult {
  startupTokens: number;
  cachedStartupTokens: number;
  toolTokens: number;
  toolCalls: number;
  totalTokens: number;
  barPercent: number;
  agentsTitle: string;
  agentsLines: string[];
  verdictTone: 'emerald' | 'amber' | 'rose';
  verdictTitle: string;
  verdictDesc: string;
  steps: SimulationStep[];
}

export interface ScorecardAnswer {
  questionId: string;
  selectedOptionIndex: number;
}
