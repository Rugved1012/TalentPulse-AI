import React, { useState } from 'react';
import { X, Sparkles, Printer, Copy, Check } from 'lucide-react';
import type { CandidateResume, CandidateEvaluation, JobDescription } from '../types';
import { generateInterviewKit } from '../utils/interviewGenerator';

interface InterviewKitModalProps {
  candidate: CandidateResume;
  evaluation: CandidateEvaluation;
  jd: JobDescription;
  onClose: () => void;
}

export const InterviewKitModal: React.FC<InterviewKitModalProps> = ({
  candidate,
  evaluation,
  jd,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const questions = generateInterviewKit(candidate, evaluation, jd);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const textContent = `AI INTERVIEW GUIDE FOR ${candidate.name.toUpperCase()}\nRole: ${jd.title}\nOverall Match Score: ${evaluation.overallScore}%\n\n` +
      questions.map((q, idx) => `${idx + 1}. [${q.category}] ${q.question}\nRationale: ${q.rationale}\nHint: ${q.expectedAnswerHint}\n`).join('\n');
    
    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn print:p-0 print:bg-white">
      <div className="glass-panel w-full max-w-4xl rounded-3xl border border-slate-700/80 bg-slate-900/95 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-full print:border-0 print:bg-white print:text-black">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between print:bg-white print:border-b-2 print:border-black">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 print:hidden">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white print:text-black">AI Interview & Probing Guide</h2>
              <p className="text-xs text-slate-400 print:text-gray-600">Tailored technical & anomaly probing questions for <strong className="text-white print:text-black">{candidate.name}</strong></p>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Guide' : 'Copy Text'}
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Export PDF
            </button>
            <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-white transition ml-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs text-slate-300 print:text-black print:overflow-visible">
          
          {/* Candidate Meta Header in Print */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 print:bg-gray-100 print:border-gray-300">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white print:text-black">{candidate.name} ({candidate.experience[0]?.title})</span>
              <span className="font-mono font-bold text-cyan-400 print:text-black">Score: {evaluation.overallScore}%</span>
            </div>
            <p className="text-slate-400 print:text-gray-700">Target Role: {jd.title} ({jd.department})</p>
          </div>

          {/* Question Cards */}
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border space-y-2.5 print:bg-white print:border-gray-300 ${
                  q.category === 'ANOMALY_PROBING'
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase font-mono ${
                    q.category === 'ANOMALY_PROBING' ? 'bg-amber-500 text-slate-950' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 print:bg-gray-200 print:text-black'
                  }`}>
                    {q.category.replace('_', ' ')}
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">Question #{idx + 1}</span>
                </div>

                <h3 className="text-sm font-bold text-white print:text-black leading-snug">
                  "{q.question}"
                </h3>

                <div className="text-[11px] text-slate-400 print:text-gray-700 pt-1 space-y-1">
                  <div>
                    <strong className="text-slate-300 print:text-black">Why Ask (Rationale): </strong>
                    <span>{q.rationale}</span>
                  </div>
                  <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80 text-emerald-300/90 print:bg-gray-50 print:border-gray-200 print:text-gray-800">
                    <strong className="text-emerald-400 print:text-black font-semibold">Interviewer Hint: </strong>
                    {q.expectedAnswerHint}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end print:hidden">
          <button onClick={onClose} className="px-5 py-2 font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700">
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
