import React from 'react';
import { 
  Sparkles, 
  Briefcase, 
  UserPlus, 
  SlidersHorizontal, 
  BarChart3, 
  Terminal, 
  Scale,
  ShieldAlert
} from 'lucide-react';
import type { JobDescription } from '../types';

interface HeaderProps {
  jobDescriptions: JobDescription[];
  activeJd: JobDescription;
  onSelectJd: (jd: JobDescription) => void;
  onOpenUploader: () => void;
  onOpenJdStudio: () => void;
  onOpenAnalytics: () => void;
  onOpenPythonModal: () => void;
  onOpenComparison: () => void;
  candidateCount: number;
  flaggedCount: number;
  selectedCompareCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  jobDescriptions,
  activeJd,
  onSelectJd,
  onOpenUploader,
  onOpenJdStudio,
  onOpenAnalytics,
  onOpenPythonModal,
  onOpenComparison,
  candidateCount,
  flaggedCount,
  selectedCompareCount
}) => {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & PS ID */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-cyan-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse-subtle" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold bg-gradient-to-r from-white via-slate-150 to-slate-400 bg-clip-text text-transparent tracking-tight">
                  TalentPulse AI
                </h1>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                AI Resume Matcher & Anomaly Detection Engine
              </p>
            </div>
          </div>

          {/* Mobile action toggle buttons */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onOpenUploader}
              className="p-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Job Selector & Preset Switcher */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl p-1.5 w-full md:w-auto">
          <Briefcase className="w-4 h-4 text-indigo-400 ml-2 shrink-0" />
          <select
            value={activeJd.id}
            onChange={(e) => {
              const selected = jobDescriptions.find(j => j.id === e.target.value);
              if (selected) onSelectJd(selected);
            }}
            className="bg-transparent text-sm font-medium text-slate-200 focus:outline-none cursor-pointer pr-2 w-full md:w-64"
          >
            {jobDescriptions.map(jd => (
              <option key={jd.id} value={jd.id} className="bg-slate-900 text-slate-200">
                {jd.title} ({jd.department})
              </option>
            ))}
          </select>
          <button
            onClick={onOpenJdStudio}
            className="px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition flex items-center gap-1 shrink-0"
            title="Configure Job Description & Weightings"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Edit JD</span>
          </button>
        </div>

        {/* Action Header Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end overflow-x-auto pb-1 md:pb-0">
          
          {/* Candidates Stats Badges */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400">Total: <strong className="text-white">{candidateCount}</strong></span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              Flagged: <strong>{flaggedCount}</strong>
            </span>
          </div>

          {/* Comparison trigger button */}
          <button
            onClick={onOpenComparison}
            disabled={selectedCompareCount < 2}
            className={`px-3 py-2 text-xs font-semibold rounded-xl border transition flex items-center gap-1.5 ${
              selectedCompareCount >= 2
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white border-cyan-500/40 shadow-lg shadow-cyan-500/20 hover:brightness-110'
                : 'bg-slate-900/80 text-slate-500 border-slate-800 cursor-not-allowed'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Compare ({selectedCompareCount})</span>
          </button>

          {/* Analytics Dashboard button */}
          <button
            onClick={onOpenAnalytics}
            className="px-3 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700/80 transition flex items-center gap-1.5"
          >
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Analytics</span>
          </button>

          {/* Python NLP Code button */}
          <button
            onClick={onOpenPythonModal}
            className="px-3 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700/80 transition flex items-center gap-1.5"
            title="Inspect Python NLP & Contradiction Scorer CLI"
          >
            <Terminal className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Python NLP Engine</span>
          </button>

          {/* Upload Resumes Primary Action */}
          <button
            onClick={onOpenUploader}
            className="px-3.5 py-2 text-xs font-bold bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white rounded-xl shadow-lg shadow-indigo-500/25 transition flex items-center gap-2 transform active:scale-95 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Upload Resumes</span>
          </button>

        </div>

      </div>
    </header>
  );
};
