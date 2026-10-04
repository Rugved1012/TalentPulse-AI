import React, { useState } from 'react';
import { X, Terminal, Copy, Check, Play, FileCode } from 'lucide-react';

interface PythonEngineModalProps {
  onClose: () => void;
}

export const PythonEngineModal: React.FC<PythonEngineModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  const command = 'python backend/engine.py --demo';

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-3xl rounded-2xl border border-slate-700/80 bg-slate-900/95 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Standalone Python NLP Engine</h2>
              <p className="text-xs text-slate-400">Inspect & run the Python NLP & anomaly scoring module locally</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-300">
          
          {/* CLI Run Banner */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Play className="w-4 h-4" /> Run Command in Terminal:
              </span>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 font-semibold transition flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Command'}
              </button>
            </div>
            <code className="block p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-cyan-300 text-sm">
              {command}
            </code>
          </div>

          {/* Engine Features Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Engine Capabilities</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-white text-xs block">1. Temporal Anachronism Engine</span>
                <p className="text-slate-400 text-[11px]">
                  Evaluates technology release dates (React in 2013, PyTorch in 2016, ChatGPT in 2022) to catch impossible claims (e.g. 15 yrs React exp).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-white text-xs block">2. Timeline Overlap Auditor</span>
                <p className="text-slate-400 text-[11px]">
                  Scans employment start/end dates for suspicious concurrent full-time roles and date inflation.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-white text-xs block">3. Unsubstantiated Skill Detector</span>
                <p className="text-slate-400 text-[11px]">
                  Verifies top listed skills against actual work experience bullet points to penalize keyword stuffing.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-white text-xs block">4. Multi-Dimensional NLP Matcher</span>
                <p className="text-slate-400 text-[11px]">
                  Computes TF-IDF vector similarity, required skill coverage, experience fit, and education level.
                </p>
              </div>
            </div>
          </div>

          {/* File location pointer */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Python script located at: <strong className="text-slate-200 font-mono">backend/engine.py</strong></span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700">
            Close Python Engine Guide
          </button>
        </div>

      </div>
    </div>
  );
};
