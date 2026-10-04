import React from 'react';
import { X, BarChart3, ShieldAlert, Users, Award, TrendingUp } from 'lucide-react';
import type { CandidateEvaluation, CandidateResume, JobDescription } from '../types';

interface AnalyticsDashboardProps {
  candidates: CandidateResume[];
  evaluations: CandidateEvaluation[];
  jd: JobDescription;
  onClose: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  evaluations,
  jd,
  onClose
}) => {
  const totalCount = evaluations.length;
  const avgScore = totalCount > 0 ? Math.round(evaluations.reduce((sum, e) => sum + e.overallScore, 0) / totalCount) : 0;
  const flaggedCount = evaluations.filter(e => e.anomalies.length > 0).length;

  // Recommendations Count
  const strongHireCount = evaluations.filter(e => e.hiringRecommendation === 'STRONG_HIRE').length;
  const considerCount = evaluations.filter(e => e.hiringRecommendation === 'CONSIDER').length;
  const verificationReqCount = evaluations.filter(e => e.hiringRecommendation === 'NEEDS_VERIFICATION').length;
  const rejectCount = evaluations.filter(e => e.hiringRecommendation === 'REJECT').length;

  // Missing Skills Leaderboard
  const missingSkillFrequency: Record<string, number> = {};
  evaluations.forEach(e => {
    e.missingSkills.forEach(skill => {
      missingSkillFrequency[skill] = (missingSkillFrequency[skill] || 0) + 1;
    });
  });

  const sortedMissingSkills = Object.entries(missingSkillFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-4xl rounded-2xl border border-slate-700/80 bg-slate-900/95 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Talent Pool & Match Analytics</h2>
              <p className="text-xs text-slate-400">Recruiter intelligence metrics for <strong className="text-slate-200">{jd.title}</strong></p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-300">
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-400" /> Total Applicants
              </span>
              <span className="text-2xl font-black font-mono text-white block">{totalCount}</span>
              <span className="text-[10px] text-slate-500">Resumes ingested</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-cyan-400" /> Average Match
              </span>
              <span className="text-2xl font-black font-mono text-cyan-400 block">{avgScore}%</span>
              <span className="text-[10px] text-slate-500">Across 4 dimensions</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" /> Anomaly Flagged
              </span>
              <span className="text-2xl font-black font-mono text-amber-400 block">{flaggedCount}</span>
              <span className="text-[10px] text-slate-500">{(totalCount > 0 ? (flaggedCount / totalCount) * 100 : 0).toFixed(0)}% of applicants</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-400" /> Top Strong Hires
              </span>
              <span className="text-2xl font-black font-mono text-emerald-400 block">{strongHireCount}</span>
              <span className="text-[10px] text-slate-500">Score &gt;= 82% verified</span>
            </div>
          </div>

          {/* Hiring Recommendations Distribution */}
          <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Candidate Qualification Distribution</h3>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-400 font-semibold">Strong Hire (Score &gt;= 82% & Verified)</span>
                  <span className="font-mono text-white font-bold">{strongHireCount} ({totalCount > 0 ? Math.round((strongHireCount / totalCount) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${totalCount > 0 ? (strongHireCount / totalCount) * 100 : 0}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cyan-400 font-semibold">Consider (Score 65% - 81%)</span>
                  <span className="font-mono text-white font-bold">{considerCount} ({totalCount > 0 ? Math.round((considerCount / totalCount) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full transition-all" style={{ width: `${totalCount > 0 ? (considerCount / totalCount) * 100 : 0}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-amber-400 font-semibold">Needs Verification (Anomalies Flagged)</span>
                  <span className="font-mono text-white font-bold">{verificationReqCount} ({totalCount > 0 ? Math.round((verificationReqCount / totalCount) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${totalCount > 0 ? (verificationReqCount / totalCount) * 100 : 0}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-rose-400 font-semibold">Low Match / Reject (&lt;65% Score)</span>
                  <span className="font-mono text-white font-bold">{rejectCount} ({totalCount > 0 ? Math.round((rejectCount / totalCount) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: `${totalCount > 0 ? (rejectCount / totalCount) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Missing Skills Shortage Analysis */}
          <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Most Common Missing Core Skills</h3>
            <p className="text-[11px] text-slate-400">Identifies skill shortages in the current applicant pool for {jd.title}</p>

            <div className="space-y-2 pt-1">
              {sortedMissingSkills.length === 0 ? (
                <p className="text-emerald-400 text-xs">All applicants match required skills!</p>
              ) : (
                sortedMissingSkills.map(([skill, count]) => (
                  <div key={skill} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-semibold text-xs text-white">{skill}</span>
                    <span className="font-mono text-xs font-bold text-rose-400">
                      Missing in {count} applicant(s) ({((count / totalCount) * 100).toFixed(0)}%)
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700">
            Close Analytics
          </button>
        </div>

      </div>
    </div>
  );
};
