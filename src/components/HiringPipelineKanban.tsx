import React from 'react';
import { ShieldAlert, ShieldCheck, UserCheck, UserX, Calendar, Inbox } from 'lucide-react';
import type { CandidateResume, CandidateEvaluation } from '../types';

interface HiringPipelineKanbanProps {
  candidates: CandidateResume[];
  evaluationsMap: Map<string, CandidateEvaluation>;
  onUpdateStage: (candidateId: string, newStage: CandidateResume['pipelineStage']) => void;
  onViewDetails: (candidate: CandidateResume) => void;
}

export const HiringPipelineKanban: React.FC<HiringPipelineKanbanProps> = ({
  candidates,
  evaluationsMap,
  onUpdateStage,
  onViewDetails
}) => {
  const stages: { key: CandidateResume['pipelineStage']; label: string; icon: any; color: string }[] = [
    { key: 'INBOX', label: 'Inbox Pool', icon: Inbox, color: 'border-indigo-500/30 text-indigo-400' },
    { key: 'SHORTLISTED', label: 'Shortlisted Fit', icon: UserCheck, color: 'border-emerald-500/30 text-emerald-400' },
    { key: 'INTERVIEW', label: 'Interview Scheduled', icon: Calendar, color: 'border-cyan-500/30 text-cyan-400' },
    { key: 'REJECTED', label: 'Rejected / Risk Flagged', icon: UserX, color: 'border-rose-500/30 text-rose-400' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stages.map(stage => {
        const stageCandidates = candidates.filter(c => (c.pipelineStage || 'INBOX') === stage.key);
        const IconComponent = stage.icon;

        return (
          <div key={stage.key} className="glass-panel rounded-3xl p-4 border border-slate-800 flex flex-col space-y-3 bg-slate-900/40 min-h-[500px]">
            
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <IconComponent className={`w-4 h-4 ${stage.color}`} />
                <h3 className="font-bold text-xs text-white uppercase tracking-wider">{stage.label}</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[11px] font-bold">
                {stageCandidates.length}
              </span>
            </div>

            {/* Candidate Kanban Cards */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              {stageCandidates.length === 0 ? (
                <div className="p-6 text-center text-slate-600 text-xs border border-dashed border-slate-800 rounded-2xl">
                  No candidates in {stage.label}
                </div>
              ) : (
                stageCandidates.map(cand => {
                  const ev = evaluationsMap.get(cand.id);
                  if (!ev) return null;

                  return (
                    <div
                      key={cand.id}
                      onClick={() => onViewDetails(cand)}
                      className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-cyan-500/40 cursor-pointer space-y-3 transition group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-xs text-white group-hover:text-cyan-300 transition">
                            {cand.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {cand.experience[0]?.title || 'Applicant'}
                          </span>
                        </div>
                        <span className="text-sm font-black font-mono text-cyan-400">
                          {ev.overallScore}%
                        </span>
                      </div>

                      {/* Anomaly Badge */}
                      {ev.anomalies.length > 0 ? (
                        <div className="px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-300 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-amber-400" />
                          {ev.anomalies[0].title}
                        </div>
                      ) : (
                        <div className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-[10px] font-medium text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Verified Integrity
                        </div>
                      )}

                      {/* Stage Move Controls */}
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]" onClick={(e) => e.stopPropagation()}>
                        <span className="text-slate-500">Move stage:</span>
                        <select
                          value={cand.pipelineStage || 'INBOX'}
                          onChange={(e) => onUpdateStage(cand.id, e.target.value as any)}
                          className="bg-slate-950 text-slate-300 border border-slate-800 rounded px-1.5 py-0.5 focus:outline-none cursor-pointer"
                        >
                          <option value="INBOX">Inbox</option>
                          <option value="SHORTLISTED">Shortlisted</option>
                          <option value="INTERVIEW">Interview</option>
                          <option value="REJECTED">Reject</option>
                        </select>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
};
