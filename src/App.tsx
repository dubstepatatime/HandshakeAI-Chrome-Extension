import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import {
  Shield,
  Chrome,
  Download,
  Code,
  Briefcase,
  BookOpen,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Terminal,
  HelpCircle,
} from 'lucide-react';
import { MOCK_HANDSHAKE_JOBS, MockJob, EXTENSION_FILES } from './extensionSource';
import { ExtensionSimulator } from './components/ExtensionSimulator';
import { HandshakeJobViewer } from './components/HandshakeJobViewer';
import { CodebaseExplorer } from './components/CodebaseExplorer';
import { TransitionRoadmap } from './components/TransitionRoadmap';
import { InstallGuideModal } from './components/InstallGuideModal';

export default function App() {
  const [activeView, setActiveView] = useState<'simulator' | 'codebase' | 'roadmap'>('simulator');
  const [currentJob, setCurrentJob] = useState<MockJob>(MOCK_HANDSHAKE_JOBS[0]);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [serverStatus, setServerStatus] = useState<{ hasServerApiKey: boolean }>({ hasServerApiKey: true });

  useEffect(() => {
    // Check backend server status
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setServerStatus({ hasServerApiKey: !!data.hasServerApiKey });
      })
      .catch(() => {
        // Fallback default
        setServerStatus({ hasServerApiKey: true });
      });
  }, []);

  // One-click Download Extension as .ZIP using robust server packager or client JSZip
  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      // Try direct verified server-side download
      const res = await fetch('/api/extension/download-zip');
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'handshake-cybercareer-advisor.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
      }
    } catch (e) {
      console.warn('Server zip download failed, using client fallback:', e);
    }

    try {
      const zip = new JSZip();

      // Add all core extension files at root
      zip.file('manifest.json', EXTENSION_FILES['manifest.json'].code);
      zip.file('content.js', EXTENSION_FILES['content.js'].code);
      zip.file('popup.html', EXTENSION_FILES['popup.html'].code);
      zip.file('popup.js', EXTENSION_FILES['popup.js'].code);
      zip.file('popup.css', EXTENSION_FILES['popup.css'].code);

      // Also add in named subfolder for users who select parent directory
      const sub = zip.folder('handshake-cybercareer-advisor');
      if (sub) {
        sub.file('manifest.json', EXTENSION_FILES['manifest.json'].code);
        sub.file('content.js', EXTENSION_FILES['content.js'].code);
        sub.file('popup.html', EXTENSION_FILES['popup.html'].code);
        sub.file('popup.js', EXTENSION_FILES['popup.js'].code);
        sub.file('popup.css', EXTENSION_FILES['popup.css'].code);
      }

      // Add detailed README
      const readmeText = `# Handshake CyberCareer Advisor - Chrome Extension (Manifest V3)

Automate your cybersecurity job application process on Handshake (app.joinhandshake.com).
Built specifically for Computer Science students transitioning into defensive and offensive cybersecurity.

## Quick Installation (30 Seconds)
1. In Google Chrome, go to: chrome://extensions
2. Enable "Developer mode" (toggle in top-right corner).
3. Click "Load unpacked" (top-left).
4. Extract the zip file and select the folder containing manifest.json.
5. Pin the extension to your toolbar!
`;
      zip.file('README.md', readmeText);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'handshake-cybercareer-advisor.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create extension zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a11] text-[#f3f4f6] flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Application Navbar */}
      <header className="bg-[#0c121e] border-b border-[#1e293b] sticky top-0 z-40 px-4 lg:px-6 py-2.5 flex items-center justify-between flex-wrap gap-3">
        {/* Brand & Badge */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/25">
            <Shield className="w-5 h-5 fill-slate-950/20 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm tracking-tight text-white">
                Handshake CyberCareer Advisor
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-semibold">
                Manifest V3
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Automated Job Scraper & Gemini AI Career Advisor for CS &rarr; Cybersecurity Transitions
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-[#111827] p-1 rounded-xl border border-[#1e293b]">
          <button
            onClick={() => setActiveView('simulator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeView === 'simulator'
                ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </button>

          <button
            onClick={() => setActiveView('codebase')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeView === 'codebase'
                ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Codebase Viewer (MV3)</span>
          </button>

          <button
            onClick={() => setActiveView('roadmap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeView === 'roadmap'
                ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>CS &rarr; Cyber Strategy</span>
          </button>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsGuideOpen(true)}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Install in Chrome</span>
          </button>

          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isZipping ? 'Packaging...' : 'Download .zip'}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 p-4 lg:p-6 flex flex-col max-w-[1720px] mx-auto w-full">
        {activeView === 'simulator' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-start">
            {/* Left: Handshake Portal Simulation */}
            <HandshakeJobViewer currentJob={currentJob} onSelectJob={(job) => setCurrentJob(job)} />

            {/* Right: Chrome Extension Popup Emulation */}
            <div className="flex flex-col items-center justify-start sticky top-20">
              <div className="w-full flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                  <Chrome className="w-4 h-4 text-cyan-400" />
                  <span>Chrome Extension Popup (410px)</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">1:1 Manifest V3 Render</span>
              </div>

              <ExtensionSimulator
                currentJob={currentJob}
                serverApiKeyAvailable={serverStatus.hasServerApiKey}
              />
            </div>
          </div>
        )}

        {activeView === 'codebase' && (
          <CodebaseExplorer onDownloadZip={handleDownloadZip} isZipping={isZipping} />
        )}

        {activeView === 'roadmap' && <TransitionRoadmap />}
      </main>

      {/* Installation Guide Modal */}
      <InstallGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onDownloadZip={handleDownloadZip}
      />
    </div>
  );
}
