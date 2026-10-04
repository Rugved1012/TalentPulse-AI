import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Briefcase, 
  Sparkles, 
  FileText, 
  BarChart2
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts';
import type { CandidateResume, CandidateEvaluation, JobDescription } from '../types';

interface CandidateDetailModalProps {
  candidate: CandidateResume;
  evaluation: CandidateEvaluation;
  jd: JobDescription;
  onClose: () => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  evaluation,
  jd,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'EXPLAIN' | 'ANOMALIES' | 'TIMELINE' | 'RAW'>('EXPLAIN');
  const [selectedSkillEvidence, setSelectedSkillEvidence] = useState<string | null>(null);

  const radarData = [
    { metric: 'Semantic Fit', score: evaluation.semanticScore },
    { metric: 'Skill Match', score: evaluation.skillScore },
    { metric: 'Experience', score: evaluation.experienceScore },
    { metric: 'Education', score: evaluation.educationScore },
    { metric: 'Claim Integrity', score: evaluation.integrityScore }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-5xl rounded-2xl border border-slate-700/80 bg-slate-900/95 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-cyan-500 to-teal-400 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center">
                <span className="text-lg font-black font-mono text-white">{evaluation.overallScore}%</span>
                <span className="text-[9px] font-bold text-cyan-400 uppercase">Match</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white">{candidate.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold">
                  {candidate.location}
                </span>
                {evaluation.anomalies.length > 0 ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1 animate-pulse">
                    <ShieldAlert className="w-3.5 h-3.5" /> {evaluation.anomalies.length} Anomaly Flag(s)
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Claim Integrity
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Evaluating against <strong className="text-slate-200">{jd.title}</strong> ({jd.department})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('EXPLAIN')}
            className={`pb-3 text-xs font-bold px-4 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'EXPLAIN' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-4 h-4" /> Explainable Match Breakdown
          </button>
          <button
            onClick={() => setActiveTab('ANOMALIES')}
            className={`pb-3 text-xs font-bold px-4 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'ANOMALIES' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            Claim Integrity & Anomaly Audit ({evaluation.anomalies.length})
          </button>
          <button
            onClick={() => setActiveTab('TIMELINE')}
            className={`pb-3 text-xs font-bold px-4 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'TIMELINE' ? 'border-indigo-400 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-4 h-4" /> Work History & Education
          </button>
          <button
            onClick={() => setActiveTab('RAW')}
            className={`pb-3 text-xs font-bold px-4 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'RAW' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" /> Full Resume Text
          </button>
        </div>

        {/* Body Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-300">
          
          {activeTab === 'EXPLAIN' && (
            <div className="space-y-6">
              
              {/* Executive Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">AI Match Executive Explanation</h3>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {evaluation.executiveSummary}
                </p>
                <div className="pt-2 text-xs text-slate-400">
                  <strong className="text-slate-300">Hiring Recommendation: </strong>
                  <span className="font-bold text-white uppercase">{evaluation.hiringRecommendation}</span> - {evaluation.recommendationReason}
                </div>
              </div>

              {/* Radar Chart & Score Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                
                {/* Recharts Spider Radar Chart */}
                <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 flex flex-col items-center">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">5-Dimensional Match Profile</h4>
                  <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="metric" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <Radar name="Candidate Score" dataKey="score" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.35} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Score Breakdown Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[11px] text-slate-400 font-semibold block">Semantic Fit</span>
                    <span className="text-2xl font-bold font-mono text-cyan-400">{evaluation.semanticScore}%</span>
                    <p className="text-[10px] text-slate-500 mt-1">Similarity of past responsibilities vs JD</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[11px] text-slate-400 font-semibold block">Skill Coverage</span>
                    <span className="text-2xl font-bold font-mono text-indigo-400">{evaluation.skillScore}%</span>
                    <p className="text-[10px] text-slate-500 mt-1">Weighted required & preferred skill match</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[11px] text-slate-400 font-semibold block">Experience Alignment</span>
                    <span className="text-2xl font-bold font-mono text-emerald-400">{evaluation.experienceScore}%</span>
                    <p className="text-[10px] text-slate-500 mt-1">{evaluation.calculatedExperienceYears} years vs target {jd.experienceMinYears}-{jd.experienceMaxYears} yrs</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[11px] text-slate-400 font-semibold block">Claim Integrity</span>
                    <span className={`text-2xl font-bold font-mono ${evaluation.integrityScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {evaluation.integrityScore}%
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">{evaluation.anomalies.length} temporal/claim flag(s)</p>
                  </div>
                </div>

              </div>

              {/* Skill Match & Proof Evidence Explorer */}
              <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Required Skills Verification Matrix</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {evaluation.matchedSkills.map((sm, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedSkillEvidence(selectedSkillEvidence === sm.skill ? null : sm.skill)}
                      className={`p-3 rounded-xl border cursor-pointer transition ${
                        sm.status === 'MATCHED'
                          ? 'bg-indigo-500/10 border-indigo-500/30 hover:border-indigo-400'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs flex items-center gap-1.5 text-white">
                          {sm.status === 'MATCHED' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                          {sm.skill}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          sm.status === 'MATCHED' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {sm.status === 'MATCHED' ? `${sm.proficiencyConfidence}% Confidence` : 'Missing'}
                        </span>
                      </div>

                      {/* Evidence snippets */}
                      {sm.evidenceSnippets.length > 0 && (
                        <div className="mt-2 text-[11px] text-slate-400 space-y-1">
                          {sm.evidenceSnippets.slice(0, 2).map((snippet, sIdx) => (
                            <p key={sIdx} className="italic text-slate-300 bg-slate-950 p-1.5 rounded border border-slate-800">
                              "{snippet}"
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Anomaly & Contradiction Audit Tab (INNOVATION HIGHLIGHT) */}
          {activeTab === 'ANOMALIES' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-400" />
                    Claim Contradiction & Anomaly Detection Report
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Identifies impossible technology experience claims, timeline overlaps, and unsubstantiated keywords.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black font-mono text-amber-400">{evaluation.integrityScore}%</span>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Integrity Score</span>
                </div>
              </div>

              {evaluation.anomalies.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/30 border border-slate-800 rounded-2xl space-y-2">
                  <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">No Contradictions or Anachronisms Detected</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    The candidate's claimed skills, technology timelines, work experience dates, and education history are all temporally consistent and backed by evidence.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {evaluation.anomalies.map((anomaly, aIdx) => (
                    <div key={aIdx} className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          anomaly.severity === 'CRITICAL' ? 'bg-red-500 text-white' : 'bg-amber-500 text-slate-950'
                        }`}>
                          {anomaly.severity} RISK
                        </span>
                        <span className="text-xs font-mono text-slate-400">Flag ID: {anomaly.id}</span>
                      </div>

                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        {anomaly.title}
                      </h4>

                      <p className="text-xs text-amber-200/90 leading-relaxed">
                        {anomaly.description}
                      </p>

                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                        <div>
                          <strong className="text-slate-400">Candidate Claim: </strong>
                          <span className="text-amber-300 font-mono">{anomaly.claim}</span>
                        </div>
                        <div>
                          <strong className="text-slate-400">Source Evidence: </strong>
                          <span className="text-slate-300 italic">{anomaly.evidence}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'TIMELINE' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Employment History Timeline</h3>
              <div className="relative border-l-2 border-slate-800 ml-4 space-y-6 pl-6">
                {candidate.experience.map((exp, eIdx) => (
                  <div key={eIdx} className="relative group">
                    <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-500 border-4 border-slate-950" />
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h4 className="text-base font-bold text-white">{exp.title}</h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-indigo-400">
                          {exp.startDate} - {exp.endDate}
                        </span>
                      </div>
                      <div className="text-xs text-indigo-300 font-semibold">{exp.company}</div>
                      
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 pt-1">
                        {exp.description.map((bullet, bIdx) => (
                          <li key={bIdx} className="leading-relaxed">{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Education */}
              <h3 className="text-sm font-bold text-white uppercase tracking-wider pt-4">Education Credentials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {candidate.education.map((edu, eduIdx) => (
                  <div key={eduIdx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-white text-sm">{edu.degree}</h4>
                      <span className="text-xs font-mono text-amber-400 font-bold">{edu.graduationYear}</span>
                    </div>
                    <p className="text-xs text-slate-300">{edu.field}</p>
                    <p className="text-xs text-slate-500">{edu.institution}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw Text Tab */}
          {activeTab === 'RAW' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Raw Ingested Resume Text</h3>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                {candidate.rawText}
              </pre>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Candidate ID: <span className="font-mono text-slate-200">{candidate.id}</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition"
          >
            Close Deep-Dive
          </button>
        </div>

      </div>
    </div>
  );
};
