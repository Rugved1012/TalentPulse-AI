import React from 'react';
import { X, Scale, CheckCircle2, XCircle, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { CandidateResume, CandidateEvaluation, JobDescription } from '../types';

interface CandidateComparisonModalProps {
  candidates: CandidateResume[];
  evaluations: CandidateEvaluation[];
  jd: JobDescription;
  onClose: () => void;
}

export const CandidateComparisonModal: React.FC<CandidateComparisonModalProps> = ({
  candidates,
  evaluations,
  jd,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-6xl rounded-2xl border border-slate-700/80 bg-slate-900/95 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Side-by-Side Candidate Comparison</h2>
              <p className="text-xs text-slate-400">Comparing {candidates.length} candidates against role: <strong className="text-slate-200">{jd.title}</strong></p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Comparison Grid Table */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-300">
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60">
                  <th className="p-3 font-bold text-slate-400 w-48">Evaluation Metric</th>
                  {candidates.map(cand => {
                    const evalObj = evaluations.find(e => e.candidateId === cand.id);
                    return (
                      <th key={cand.id} className="p-3 font-bold text-white min-w-[220px]">
                        <div className="text-sm">{cand.name}</div>
                        <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                          {cand.experience[0]?.title || 'Professional'}
                        </div>
                        {evalObj && (
                          <div className="mt-2 text-2xl font-black font-mono text-cyan-400">
                            {evalObj.overallScore}% <span className="text-[10px] text-slate-500 font-normal">Overall</span>
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                
                {/* Hiring Recommendation */}
                <tr>
                  <td className="p-3 font-bold text-slate-300">Hiring Recommendation</td>
                  {candidates.map(cand => {
                    const evalObj = evaluations.find(e => e.candidateId === cand.id);
                    return (
                      <td key={cand.id} className="p-3 font-bold uppercase">
                        {evalObj?.hiringRecommendation === 'STRONG_HIRE' && <span className="text-emerald-400">🌟 Strong Hire</span>}
                        {evalObj?.hiringRecommendation === 'CONSIDER' && <span className="text-cyan-400">🟢 Consider</span>}
                        {evalObj?.hiringRecommendation === 'NEEDS_VERIFICATION' && <span className="text-amber-400">⚠️ Needs Verification</span>}
                        {evalObj?.hiringRecommendation === 'REJECT' && <span className="text-rose-400">🔴 Low Match</span>}
                      </td>
                    );
                  })}
                </tr>

                {/* Claim Integrity Status */}
                <tr>
                  <td className="p-3 font-bold text-slate-300">Claim Integrity & Risk</td>
                  {candidates.map(cand => {
                    const evalObj = evaluations.find(e => e.candidateId === cand.id);
                    return (
                      <td key={cand.id} className="p-3">
                        {evalObj && evalObj.anomalies.length > 0 ? (
                          <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
                            <div className="font-bold flex items-center gap-1">
                              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                              {evalObj.anomalies.length} Flag(s) Detected
                            </div>
                            <div className="text-[10px] mt-0.5 text-amber-200/80">{evalObj.anomalies[0].title}</div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-emerald-400 font-medium">
                            <ShieldCheck className="w-4 h-4" /> 100% Verified
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Score Breakdown Metrics */}
                <tr>
                  <td className="p-3 font-bold text-slate-300">Semantic Fit Score</td>
                  {candidates.map(cand => {
                    const evalObj = evaluations.find(e => e.candidateId === cand.id);
                    return <td key={cand.id} className="p-3 font-mono font-bold text-cyan-400">{evalObj?.semanticScore}%</td>;
                  })}
                </tr>

                <tr>
                  <td className="p-3 font-bold text-slate-300">Skill Coverage Score</td>
                  {candidates.map(cand => {
                    const evalObj = evaluations.find(e => e.candidateId === cand.id);
                    return <td key={cand.id} className="p-3 font-mono font-bold text-indigo-400">{evalObj?.skillScore}%</td>;
                  })}
                </tr>

                <tr>
                  <td className="p-3 font-bold text-slate-300">Work Experience (Yrs)</td>
                  {candidates.map(cand => {
                    const evalObj = evaluations.find(e => e.candidateId === cand.id);
                    return <td key={cand.id} className="p-3 font-mono font-bold text-white">{evalObj?.calculatedExperienceYears} years</td>;
                  })}
                </tr>

                {/* Required Skills Matrix Comparison */}
                <tr className="bg-slate-950/40">
                  <td colSpan={candidates.length + 1} className="p-3 font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                    Required Core Skills Coverage Matrix
                  </td>
                </tr>

                {jd.requiredSkills.map(skill => (
                  <tr key={skill}>
                    <td className="p-3 font-medium text-slate-300">{skill}</td>
                    {candidates.map(cand => {
                      const evalObj = evaluations.find(e => e.candidateId === cand.id);
                      const isMatched = evalObj?.matchedSkills.some(s => s.skill === skill && s.status === 'MATCHED');
                      return (
                        <td key={cand.id} className="p-3">
                          {isMatched ? (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Matched
                            </span>
                          ) : (
                            <span className="text-rose-400 font-semibold flex items-center gap-1 opacity-70">
                              <XCircle className="w-4 h-4" /> Missing
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}

              </tbody>
            </table>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
          <button onClick={onClose} className="px-5 py-2 font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700">
            Close Comparison
          </button>
        </div>

      </div>
    </div>
  );
};
