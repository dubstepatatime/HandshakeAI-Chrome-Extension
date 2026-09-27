import React, { useState, useEffect } from 'react';
import {
  Shield,
  Copy,
  Check,
  RotateCw,
  Eye,
  EyeOff,
  Settings as SettingsIcon,
  Sparkles,
  Key,
  FileText,
  AlertCircle,
  ExternalLink,
  Briefcase,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { MockJob, MASTER_RESUME_DEFAULT } from '../extensionSource';

interface ExtensionSimulatorProps {
  currentJob: MockJob;
  serverApiKeyAvailable?: boolean;
}

interface AnalysisResult {
  matchScore: number;
  scoreTier: string;
  matchSummary: string;
  transferableSkills: string[];
  skillGapsOrCerts: string[];
  coverLetter: string;
}

export const ExtensionSimulator: React.FC<ExtensionSimulatorProps> = ({
  currentJob,
  serverApiKeyAvailable = true,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
  const [userApiKey, setUserApiKey] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [masterResume, setMasterResume] = useState<string>(MASTER_RESUME_DEFAULT);
  const [preferredModel, setPreferredModel] = useState<string>('gemini-3.8-flash');
  const [tone, setTone] = useState<string>('Technical & Confident');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [editableCoverLetter, setEditableCoverLetter] = useState<string>('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2600);
  };

  // Run evaluation
  const runEvaluation = async () => {
    setIsLoading(true);
    setAnalysis(null);

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: currentJob.jobTitle,
          companyName: currentJob.companyName,
          aboutRole: currentJob.aboutRole,
          resumeText: masterResume,
          userApiKey: userApiKey.trim() || undefined,
          tone,
          model: preferredModel,
        }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Evaluation failed');
      }

      setAnalysis(resData.data);
      setEditableCoverLetter(resData.data.coverLetter || '');
      triggerToast('Evaluation completed with Gemini AI!');
    } catch (err: any) {
      console.warn('Evaluation failed:', err);
      // Fallback preview if network or key issue
      const fallback: AnalysisResult = {
        matchScore: 86,
        scoreTier: 'Strong Transition Potential',
        matchSummary: `Your Computer Science foundation in networking (TCP/IP), Linux command line, and Python automation translates directly into the defensive triage requirements at ${currentJob.companyName}.`,
        transferableSkills: [
          'TCP/IP & Network Protocol Analysis',
          'Linux Systems Administration',
          'Python Automation & Scripting',
          'Operating Systems & Memory Fundamentals',
        ],
        skillGapsOrCerts: [
          'CompTIA Security+ (In Progress)',
          'Hands-on SIEM Practice (Splunk / Elastic)',
        ],
        coverLetter: `Dear Hiring Team at ${currentJob.companyName},

I am writing to express my strong interest in the ${currentJob.jobTitle} position listed on Handshake. As a senior Computer Science student transitioning into cybersecurity, I combine a rigorous foundation in systems programming, networking architectures, and Linux internals with practical homelab experience in threat detection and security automation.

Throughout my Computer Science studies, I have focused heavily on how software systems operate under the hood—from packet flow across TCP/IP stacks to memory management and access controls. In my academic projects, I built an automated threat log parser in Python that monitors server logs for brute-force SSH attacks, as well as a multi-segmented virtual homelab utilizing Splunk to investigate simulated port scans and unauthorized access events.

What excites me most about ${currentJob.companyName} is the opportunity to apply these software engineering and systems principles to protect critical assets. My ability to read code, write custom triage scripts in Python and Bash, and rapidly digest technical documentation allows me to ramp up quickly in a fast-paced security operations environment.

I would welcome the opportunity to discuss how my technical acumen, defensive mindset, and passion for cybersecurity will add immediate value to your team. Thank you for your time and consideration.

Sincerely,
Alex Chen
Senior Computer Science Student
alex.chen.cs@university.edu`,
      };

      setAnalysis(fallback);
      setEditableCoverLetter(fallback.coverLetter);
      triggerToast('Displaying simulated evaluation result');
    } finally {
      setIsLoading(false);
    }
  };

  // Run on mount or when currentJob changes if in overview
  useEffect(() => {
    runEvaluation();
  }, [currentJob.id]);

  const handleCopy = async () => {
    if (!editableCoverLetter) return;
    try {
      await navigator.clipboard.writeText(editableCoverLetter);
      setCopied(true);
      triggerToast('Cover letter copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      triggerToast('Copied to clipboard!');
    }
  };

  // Radial score styling
  const score = analysis?.matchScore || 85;
  const isHigh = score >= 80;
  const isMed = score >= 60 && score < 80;

  return (
    <div className="w-[410px] h-[640px] flex flex-col bg-[#0a0e17] text-[#f3f4f6] rounded-xl border border-[#1e293b] shadow-2xl shadow-cyan-950/20 overflow-hidden relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg shadow-emerald-950/50 flex items-center gap-1.5 animate-bounce">
          <Check className="w-3.5 h-3.5" />
          {toastMessage}
        </div>
      )}

      {/* Extension Header */}
      <header className="flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-b from-[#111a2e] to-[#0a0e17] border-b border-[#1e293b] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center text-slate-950 shadow-sm shadow-cyan-500/30">
            <Shield className="w-4 h-4 fill-slate-950/20 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[13px] tracking-tight text-white">CyberCareer</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                MV3
              </span>
            </div>
            <div className="text-[10px] text-slate-400">Handshake &rarr; Cybersecurity</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Handshake Active</span>
        </div>
      </header>

      {/* Nav Tabs */}
      <nav className="flex bg-[#111827] border-b border-[#1e293b] px-2 gap-1 shrink-0">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 py-2 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'text-cyan-400 border-cyan-400'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Match & Cover Letter
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-1.5 py-2 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'text-cyan-400 border-cyan-400'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <SettingsIcon className="w-3.5 h-3.5" />
          Settings & Resume
        </button>
      </nav>

      {/* Main Tab Body */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 custom-scrollbar">
        {activeTab === 'overview' ? (
          <>
            {/* Scraped Job Banner */}
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-[#131d31] to-[#0e1626] border border-[#21304d]">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-white truncate leading-snug">
                    {currentJob.jobTitle}
                  </h3>
                  <div className="text-[11px] font-medium text-cyan-400">
                    {currentJob.companyName}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <span className="truncate">{currentJob.location}</span>
                  </div>
                </div>
                <button
                  onClick={runEvaluation}
                  disabled={isLoading}
                  title="Re-scrape and analyze"
                  className="px-2 py-1 rounded bg-[#1e293b] hover:bg-[#28374d] text-[10px] font-semibold text-slate-200 flex items-center gap-1 border border-slate-700 transition cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <RotateCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
                  Analyze
                </button>
              </div>
            </div>

            {/* Loading Skeleton */}
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-cyan-400 animate-spin flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                </div>
                <div className="text-xs font-bold text-white">Gemini Career Advisor Evaluating...</div>
                <div className="text-[11px] text-slate-400 max-w-[240px]">
                  Evaluating CS coursework, systems fundamentals & generating targeted cover letter.
                </div>
              </div>
            ) : analysis ? (
              <>
                {/* Match Score Radial Card */}
                <div className="grid grid-cols-[100px_1fr] gap-3 p-3 rounded-lg bg-[#0f172a] border border-[#1e293b] items-center">
                  <div className="flex flex-col items-center justify-center">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center relative"
                      style={{
                        background: `conic-gradient(${
                          isHigh ? '#10b981' : isMed ? '#06b6d4' : '#f59e0b'
                        } ${score}%, #1e293b 0)`,
                        boxShadow: `0 0 14px ${isHigh ? 'rgba(16,185,129,0.25)' : 'rgba(6,182,212,0.25)'}`,
                      }}
                    >
                      <div className="w-16 h-16 rounded-full bg-[#0f172a] flex flex-col items-center justify-center">
                        <span className="text-xl font-extrabold text-white leading-none">
                          {score}
                          <span className="text-[11px] text-slate-400 font-normal">%</span>
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                          MATCH
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                        isHigh
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : isMed
                          ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {analysis.scoreTier}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-3">
                      {analysis.matchSummary}
                    </p>
                  </div>
                </div>

                {/* Transferable Skills Chips */}
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-[#0b1120] border border-[#1e293b]">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 mb-1.5">
                      <Layers className="w-3 h-3" />
                      Transferable CS Strengths
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {analysis.transferableSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[10px] rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/25"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0b1120] border border-[#1e293b]">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-1.5">
                      <Sparkles className="w-3 h-3" />
                      Recommended Certifications & Focus
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {analysis.skillGapsOrCerts.map((cert, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[10px] rounded bg-amber-500/10 text-amber-300 border border-amber-500/25"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cover Letter Draft Box */}
                <div className="rounded-lg bg-[#111827] border border-[#1e293b] overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2 bg-[#162035] border-b border-[#1e293b]">
                    <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                      Tailored Cover Letter Draft
                    </div>

                    <button
                      onClick={handleCopy}
                      className="px-2 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[10px] flex items-center gap-1 transition cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-950" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy to Clipboard</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-2.5">
                    <textarea
                      value={editableCoverLetter}
                      onChange={(e) => setEditableCoverLetter(e.target.value)}
                      rows={7}
                      className="w-full bg-transparent border-0 text-[11px] leading-relaxed text-slate-200 resize-y outline-none font-sans"
                      placeholder="Cover letter draft..."
                    />
                  </div>
                </div>

                {/* Regeneration Options */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={runEvaluation}
                    disabled={isLoading}
                    className="flex-1 py-1.5 px-3 rounded bg-[#1e293b] hover:bg-[#2b3a52] text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RotateCw className="w-3 h-3" />
                    Regenerate Draft
                  </button>

                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="bg-[#0f172a] border border-[#1e293b] text-slate-200 text-[11px] rounded px-2 py-1.5 outline-none cursor-pointer"
                  >
                    <option value="Technical & Confident">Technical & Confident</option>
                    <option value="Passionate Junior">Passionate Junior</option>
                    <option value="Concise & Direct">Concise & Direct</option>
                  </select>
                </div>
              </>
            ) : null}
          </>
        ) : (
          /* SETTINGS TAB */
          <div className="space-y-3.5">
            {/* API Key */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span className="flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  Gemini API Key
                </span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
                >
                  Get Free Key <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={userApiKey}
                  onChange={(e) => setUserApiKey(e.target.value)}
                  placeholder={serverApiKeyAvailable ? 'Using Server Gemini Key (or enter custom key)' : 'AIzaSy...'}
                  className="w-full bg-[#0d131f] border border-[#1e293b] focus:border-cyan-500 rounded px-2.5 py-1.5 text-xs text-white outline-none pr-8 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                {serverApiKeyAvailable && !userApiKey
                  ? 'Active: Applet server key pre-configured. You can also paste your own.'
                  : 'Saved locally in chrome.storage.local for the extension.'}
              </p>
            </div>

            {/* Model Selector */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-200 block">Gemini Model</label>
              <select
                value={preferredModel}
                onChange={(e) => setPreferredModel(e.target.value)}
                className="w-full bg-[#0d131f] border border-[#1e293b] focus:border-cyan-500 rounded px-2.5 py-1.5 text-xs text-white outline-none cursor-pointer"
              >
                <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended & Active)</option>
              </select>
            </div>

            {/* Master Resume */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  Master Resume Text
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMasterResume(MASTER_RESUME_DEFAULT);
                    triggerToast('Loaded CS &rarr; Cyber transition template!');
                  }}
                  className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
                >
                  Load CS &rarr; Cyber Template
                </button>
              </div>
              <textarea
                value={masterResume}
                onChange={(e) => setMasterResume(e.target.value)}
                rows={9}
                className="w-full bg-[#0d131f] border border-[#1e293b] focus:border-cyan-500 rounded p-2 text-[10.5px] leading-relaxed text-slate-300 font-mono resize-none outline-none custom-scrollbar"
                placeholder="Paste your plain-text resume here..."
              />
              <div className="text-[10px] text-slate-400 text-right">
                {masterResume.length.toLocaleString()} characters
              </div>
            </div>

            {/* Save & Run */}
            <button
              onClick={() => {
                triggerToast('Settings updated! Running evaluation...');
                setActiveTab('overview');
                runEvaluation();
              }}
              className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Save Settings & Run Evaluation
            </button>
          </div>
        )}
      </div>

      {/* Extension Footer status */}
      <footer className="px-3 py-1.5 bg-[#0f172a] border-t border-[#1e293b] text-[10px] text-slate-400 flex items-center justify-between shrink-0">
        <span>Handshake Tab Scraper</span>
        <span className="text-cyan-400 font-mono">app.joinhandshake.com</span>
      </footer>
    </div>
  );
};
