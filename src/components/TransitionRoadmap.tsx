import React from 'react';
import {
  ShieldAlert,
  Server,
  Network,
  Cpu,
  Terminal,
  Award,
  BookOpen,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const TransitionRoadmap: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-[#0b0f19] border border-[#1e293b] rounded-xl p-6 space-y-6 custom-scrollbar text-slate-200">
      {/* Header */}
      <div className="border-b border-[#1e293b] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          CS Student Career Strategy
        </div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          How to Transition from Computer Science to Cybersecurity
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          As a Computer Science student, you already have the rarest and most valued asset in cybersecurity: an engineering understanding of how computers, operating systems, and networks actually work. Here is how to position your background to stand out on Handshake.
        </p>
      </div>

      {/* Coursework Mapping Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          1. Translating CS Coursework into Cybersecurity Strengths
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1e293b] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-white">
              <Network className="w-4 h-4 text-emerald-400" />
              Computer Networks &rarr; Network Security & Triage
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              <strong>Your CS edge:</strong> You know TCP handshakes, OSI layers, DNS resolution, and subnetting from code.
            </p>
            <p className="text-cyan-300/90 text-[11px]">
              <strong>On Handshake:</strong> Emphasize packet analysis with Wireshark, identifying anomalous traffic, and inspecting TLS/SSL connections.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1e293b] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-white">
              <Server className="w-4 h-4 text-sky-400" />
              Operating Systems &rarr; Incident Response & EDR
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              <strong>Your CS edge:</strong> You understand process lifecycle, system calls, memory management, and file systems.
            </p>
            <p className="text-cyan-300/90 text-[11px]">
              <strong>On Handshake:</strong> Frame this as an asset for inspecting suspicious processes, privilege escalation, and memory forensics.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1e293b] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-white">
              <Terminal className="w-4 h-4 text-amber-400" />
              Algorithms & Programming &rarr; Security Automation (SOAR)
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              <strong>Your CS edge:</strong> You write clean Python, Bash, and SQL scripts. Most cyber analysts don't code proficiently.
            </p>
            <p className="text-cyan-300/90 text-[11px]">
              <strong>On Handshake:</strong> Highlight scripts that automate log parsing, query APIs, or enrich threat feeds in your cover letters.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1e293b] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-white">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Software Engineering &rarr; AppSec & DevSecOps
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              <strong>Your CS edge:</strong> You build web apps with databases, REST APIs, authentication, and Docker.
            </p>
            <p className="text-cyan-300/90 text-[11px]">
              <strong>On Handshake:</strong> Highlight OWASP Top 10 mitigation, secure coding practices, and container scanning in CI/CD pipelines.
            </p>
          </div>
        </div>
      </div>

      {/* Certifications Matrix */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-cyan-400" />
          2. Recommended Certifications for CS Seniors & New Grads
        </h3>

        <div className="overflow-x-auto rounded-xl border border-[#1e293b] bg-[#111827]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f172a] text-slate-400 font-semibold border-b border-[#1e293b]">
              <tr>
                <th className="p-3">Certification</th>
                <th className="p-3">Primary Focus</th>
                <th className="p-3">CS Student Advantage</th>
                <th className="p-3">Ideal Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b] text-slate-300">
              <tr>
                <td className="p-3 font-bold text-white">CompTIA Security+ (SY0-701)</td>
                <td className="p-3">Security baselines, threats, governance, cryptography</td>
                <td className="p-3 text-cyan-300">Fast study (~3-4 weeks) thanks to CS overlap</td>
                <td className="p-3">SOC Analyst, InfoSec Specialist</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">Blue Team Level 1 (BTL1)</td>
                <td className="p-3">Practical SIEM (Splunk), Phishing triage, Network analysis</td>
                <td className="p-3 text-cyan-300">Hands-on lab exam mirrors real SOC duties</td>
                <td className="p-3">Tier 1 SOC Analyst, DFIR</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">AWS Certified Cloud Practitioner / Sec Specialty</td>
                <td className="p-3">Cloud architecture, IAM least-privilege, KMS encryption</td>
                <td className="p-3 text-cyan-300">Leverages CS cloud & systems exposure</td>
                <td className="p-3">Cloud Security, DevSecOps</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* High-Impact Homelabs to Add to Your Resume */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          3. Top 3 Homelab Projects that Win Interviews
        </h3>

        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-lg bg-[#0f172a] border border-[#1e293b] flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Splunk Homelab with Simulated Attacks:</strong> Spin up Ubuntu and Windows VMs in VirtualBox, install a Splunk Universal Forwarder, execute simulated port scans/brute force with Nmap or Hydra, and write Splunk search queries (SPL) to create alert dashboards.
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[#0f172a] border border-[#1e293b] flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Automated Python Threat Intelligence Tool:</strong> Build a CLI script that takes an IP address, queries VirusTotal and AbuseIPDB APIs, cross-references with local firewall logs, and outputs a formatted incident summary.
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[#0f172a] border border-[#1e293b] flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">TryHackMe SOC Level 1 Path:</strong> Complete the dedicated SOC Level 1 learning path on TryHackMe, post badges on LinkedIn, and list specific room names (e.g. Wireshark 101, Splunk Basics, Snort) under your projects.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
