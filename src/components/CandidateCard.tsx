import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Briefcase, 
  MapPin, 
  GraduationCap, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  Download,
  Award,
  HelpCircle
} from 'lucide-react';
import type { CandidateResume, CandidateEvaluation } from '../types';

interface CandidateCardProps {
  candidate: CandidateResume;
  evaluation: CandidateEvaluation;
  rank: number;
  isSelectedForCompare: boolean;
  onToggleCompare: (id: string) => void;
  onViewDetails: (candidate: CandidateResume) => void;
  onOpenInterviewKit: (candidate: CandidateResume) => void;
  onSkillClick?: (skill: string) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  evaluation,
  rank,
  isSelectedForCompare,
  onToggleCompare,
  onViewDetails,
  onOpenInterviewKit,
  onSkillClick
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return { ring: '#10b981', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
    if (score >= 65) return { ring: '#06b6d4', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' };
    if (score >= 50) return { ring: '#f59e0b', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
    return { ring: '#f43f5e', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
  };

  const scoreMeta = getScoreColor(evaluation.overallScore);
  const strokeDashoffset = 125.6 - (125.6 * evaluation.overallScore) / 100;

  const handleExportJson = (e: React.MouseEvent) => {
    e.stopPropagation();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ candidate, evaluation }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Candidate_Evaluation_${candidate.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className={`glass-card rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between relative group ${
      isSelectedForCompare ? 'border-cyan-500/80 bg-slate-900/95 shadow-xl shadow-cyan-500/20 glow-border-cyan' : 'border-slate-800/80 bg-slate-900/60 hover:border-indigo-500/50'
    }`}>
      
      {/* Top Banner Header */}
      <div>
        
        <div className="flex items-start justify-between gap-3 mb-3">
          
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={isSelectedForCompare}
              onChange={() => onToggleCompare(candidate.id)}
              className="mt-1 rounded accent-cyan-500 w-4 h-4 cursor-pointer"
              title="Select to compare candidates side-by-side"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                
                {/* Rank Badge */}
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase font-mono flex items-center gap-1 ${
                  rank === 1 ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                }`}>
                  {rank === 1 && <Award className="w-3 h-3 text-slate-950 shrink-0" />}
                  Rank #{rank}
                </span>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                  {candidate.name}
                </h3>

                {/* Recommendation Badge */}
                {evaluation.hiringRecommendation === 'STRONG_HIRE' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                    🌟 Strong Hire
                  </span>
                )}
                {evaluation.hiringRecommendation === 'CONSIDER' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 text-[11px] font-bold">
                    🟢 Consider
                  </span>
                )}
                {evaluation.hiringRecommendation === 'NEEDS_VERIFICATION' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[11px] font-bold animate-pulse">
                    ⚠️ Verification Req
                  </span>
                )}
                {evaluation.hiringRecommendation === 'REJECT' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[11px] font-bold">
                    🔴 Low Match
                  </span>
                )}

              </div>
              
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1 text-slate-200 font-medium">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                  {candidate.experience[0]?.title || 'Professional'} ({evaluation.calculatedExperienceYears} yrs exp)
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {candidate.location}
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  {candidate.education[0]?.degree || 'Degree'}
                </span>
              </div>
            </div>
          </div>

          {/* SVG Smooth Radial Score Gauge */}
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="20" stroke="#1e293b" strokeWidth="3.5" fill="transparent" />
              <circle
                cx="22"
                cy="22"
                r="20"
                stroke={scoreMeta.ring}
                strokeWidth="3.5"
                strokeDasharray="125.6"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-extrabold font-mono text-white leading-none">
                {evaluation.overallScore}%
              </span>
              <span className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Match</span>
            </div>
          </div>

        </div>

        {/* Claim Integrity Warning Banner (INNOVATION REQUIREMENT) */}
        {evaluation.anomalies.length > 0 ? (
          <div className="mb-3.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-amber-200">Claim Integrity Risk: </span>
                <span className="text-amber-300/90">{evaluation.anomalies[0].title}</span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 font-bold shrink-0">
              Risk: {100 - evaluation.integrityScore}%
            </span>
          </div>
        ) : (
          <div className="mb-3.5 p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-medium text-emerald-300">100% Verified Claim Integrity & Timeline</span>
          </div>
        )}

        {/* Clickable Skill Match Pills */}
        <div className="mb-3">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-400 font-semibold">Matched Core Skills (Click to filter):</span>
            <span className="text-indigo-400 font-mono font-bold">
              {evaluation.matchedSkills.filter(s => s.status === 'MATCHED').length} / {evaluation.matchedSkills.length} Required
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-16 overflow-hidden">
            {evaluation.matchedSkills.map((sm, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSkillClick) onSkillClick(sm.skill);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer ${
                  sm.status === 'MATCHED'
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30'
                    : 'bg-slate-900 text-slate-500 border border-slate-800 line-through opacity-60'
                }`}
                title={`Filter candidates by ${sm.skill}`}
              >
                {sm.status === 'MATCHED' ? <CheckCircle2 className="w-3 h-3 text-indigo-400 shrink-0" /> : <XCircle className="w-3 h-3 text-slate-600 shrink-0" />}
                {sm.skill}
              </button>
            ))}
          </div>
        </div>

        {/* Executive Match Snippet */}
        <p className="text-xs text-slate-400 line-clamp-2 italic mb-4">
          "{evaluation.executiveSummary}"
        </p>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Interview Kit Button */}
          <button
            onClick={() => onOpenInterviewKit(candidate)}
            className="px-2.5 py-1 text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-lg border border-indigo-500/30 transition flex items-center gap-1"
            title="Generate AI Technical & Anomaly Probing Interview Kit"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Interview Kit</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Export JSON button */}
          <button
            onClick={handleExportJson}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition"
            title="Download Evaluation JSON Report"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* View Deep-Dive Button */}
          <button
            onClick={() => onViewDetails(candidate)}
            className="px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center gap-1 group-hover:brightness-110"
          >
            <span>Inspect Evidence</span>
            <ChevronRight className="w-3.5 h-3.5 text-cyan-200" />
          </button>
        </div>
      </div>

    </div>
  );
};
