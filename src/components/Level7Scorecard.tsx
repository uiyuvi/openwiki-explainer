import React, { useState } from 'react';
import { CheckSquare, ArrowRight, Copy, Check, ShieldCheck, AlertCircle } from 'lucide-react';
import { SCORECARD_QUESTIONS, computeScorecardVerdict } from '../data/scorecardData';

export const Level7Scorecard: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({
    'repo-scale': 0, // default: massive monorepo
    'task-profile': 1, // default: mixed
    'ci-budget': 0, // default: high automation
    'agent-frequency': 0, // default: deep daily
    'doc-hygiene': 0 // default: scattered/stale
  });

  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const verdict = computeScorecardVerdict(answers);

  const handleCopyReport = () => {
    const textReport = `OPENWIKI TEAM FIT EVALUATION REPORT
Verdict: ${verdict.title}
Score: ${verdict.score}/100
Analysis: ${verdict.analysis}

Actionable Recommendations:
${verdict.actionItems.map(item => `• ${item}`).join('\n')}

Evaluated via OpenWiki Explorable Engineering Framework.`;

    navigator.clipboard.writeText(textReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="scorecard" className="space-y-6 scroll-mt-20 py-8 border-b border-stone-200">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-amber-700 font-semibold">
          <span>Level 07</span>
          <span aria-hidden="true">·</span>
          <span>Decision Scorecard</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
          The Team Decision Matrix: Should You Adopt OpenWiki?
        </h2>
        <p className="text-sm text-stone-600 mt-2 max-w-3xl leading-relaxed">
          Answer these 5 technical questions about your repository scale, task frequency, CI budget, and documentation health to generate an algorithmic recommendation for your team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 5 Questions (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {SCORECARD_QUESTIONS.map((q, qIdx) => {
            const currentSelected = answers[q.id] ?? 0;
            return (
              <div key={q.id} className="p-4 rounded-xl bg-white border border-stone-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-amber-800 uppercase tracking-wider font-semibold">
                    Question 0{qIdx + 1} · {q.category}
                  </span>
                  <span className="text-[11px] text-stone-500 font-mono">
                    {currentSelected !== undefined ? 'Answered' : 'Pending'}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-stone-900">{q.question}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{q.context}</p>
                </div>

                <div className="space-y-2 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = currentSelected === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50/70 border-amber-500 shadow-xs'
                            : 'bg-stone-50/60 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? 'border-amber-600 bg-amber-600/20' : 'border-stone-300'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />}
                          </div>
                          <div>
                            <div className={`text-xs font-semibold ${isSelected ? 'text-stone-900' : 'text-stone-700'}`}>
                              {opt.label}
                            </div>
                            <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                              {opt.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Live Computed Recommendation (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-20 p-5 rounded-xl bg-white border border-stone-200 space-y-5 shadow-sm">
            
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <span className="text-xs font-semibold text-stone-800">Algorithmic Recommendation</span>
              <button
                onClick={handleCopyReport}
                className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Report'}</span>
              </button>
            </div>

            {/* Score Bar */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-stone-500 font-mono">Monorepo Fit Index</span>
                <span className="text-2xl font-extrabold font-mono text-stone-900 tabular-nums">
                  {verdict.score} <span className="text-xs font-normal text-stone-500">/ 100</span>
                </span>
              </div>
              <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    verdict.recommendation === 'adopt'
                      ? 'bg-emerald-600'
                      : verdict.recommendation === 'consider_adr'
                      ? 'bg-amber-600'
                      : 'bg-rose-600'
                  }`}
                  style={{ width: `${verdict.score}%` }}
                />
              </div>
            </div>

            {/* Verdict Box */}
            <div className="space-y-2 pt-2 border-t border-stone-200">
              <div className={`inline-block text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                verdict.recommendation === 'adopt'
                  ? 'text-emerald-900 bg-emerald-50 border-emerald-300'
                  : verdict.recommendation === 'consider_adr'
                  ? 'text-amber-900 bg-amber-50 border-amber-300'
                  : 'text-rose-900 bg-rose-50 border-rose-300'
              }`}>
                {verdict.title}
              </div>
              <p className="text-xs text-stone-800 leading-relaxed font-medium">
                {verdict.subtitle}
              </p>
              <p className="text-xs text-stone-600 leading-relaxed pt-1">
                {verdict.analysis}
              </p>
            </div>

            {/* Tailored Action Checklist */}
            <div className="space-y-2 pt-3 border-t border-stone-200">
              <div className="text-xs font-bold text-stone-900">Recommended Action Plan:</div>
              <ul className="space-y-2">
                {verdict.actionItems.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-stone-700 leading-relaxed">
                    <CheckSquare className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-stone-200 text-[11px] text-stone-500 leading-relaxed">
              Based on empirical findings from <code className="font-mono text-stone-600">arXiv:2602.11988</code> and real-world monorepo token benchmarks.
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
