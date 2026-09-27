/**
 * Handshake CyberCareer Advisor - Popup Logic (Manifest V3)
 * Handles Handshake scraping, chrome.storage.local, and Gemini API evaluation.
 */

// Default high-yield CS -> Cybersecurity Master Resume template
const SAMPLE_CS_CYBER_RESUME = `ALEX CHEN
Computer Science B.S. Candidate (Senior) | Transitioning into Cybersecurity
GPA: 3.82 | Expected Graduation: May 2026
Email: alex.chen.cs@university.edu | GitHub: github.com/alexchen-sec | LinkedIn: linkedin.com/in/alexchen-cyber

TECHNICAL SKILLS & PROFICIENCIES
• Cybersecurity & Systems: Network Security, TCP/IP Suite, OSI Model, Threat Analysis, Vulnerability Scanning, Linux/Unix Internals, Memory Management, Access Control (RBAC/ABAC), Cryptography (AES, RSA, TLS/SSL)
• Security Tools & Labs: Wireshark, Nmap, Metasploit (lab use), Burp Suite Community, Splunk (Fundamentals 1 completed), Suricata, Docker, VirtualBox, Kali Linux
• Programming & Scripting: Python (Socket programming, log parsers, Scapy), Bash/Shell scripting, C/C++, SQL, Git
• Certifications: Currently studying for CompTIA Security+ (SY0-701, scheduled target: Nov 2026), Google Cybersecurity Professional Certificate

ACADEMIC COURSEWORK
Computer Networks, Operating Systems, Computer & Network Security, Data Structures & Algorithms, Database Systems, Computer Architecture, Discrete Mathematics.

CYBERSECURITY & CS PROJECTS
1. Automated Threat Log Parser & Alerting Tool (Python, Regex, Syslog)
• Developed an automated log analysis script monitoring auth.log and Apache server logs for brute-force SSH attempts and SQL injection patterns.
• Extracted and enriched suspicious IP addresses, triggering automated Discord/email alerts for incidents exceeding baseline thresholds.

2. Virtual SOC Homelab & Traffic Analysis (VirtualBox, Kali, Ubuntu, Splunk)
• Configured a segmented virtual network environment simulating a corporate LAN with vulnerable endpoints and a centralized Splunk SIEM forwarder.
• Analyzed simulated port scans and SYN flood attacks using Wireshark and tcpdump, documenting detection signatures and artifact timelines.

3. Secure Multi-threaded Chat Client (C++, OpenSSL)
• Built an end-to-end encrypted messaging server utilizing TLS/OpenSSL sockets with Diffie-Hellman key exchange and SHA-256 integrity verification.

EXPERIENCE & LEADERSHIP
Undergraduate Teaching Assistant - Intro to Computer Systems
• Mentored 45+ students on Linux command-line utilities, memory safety, C pointer arithmetic, and buffer overflow concepts.
Active Member, University Collegiate Cyber Defense Club (CCDC)
• Participated in blue-team defense competitions, hardening Linux server services and configuring firewall rules (iptables/UFW).`;

// Sample Handshake Job for testing when not on Handshake
const SAMPLE_HANDSHAKE_JOB = {
  jobTitle: 'Junior SOC Analyst (Security Operations Center)',
  companyName: 'Sentinel Threat Defense',
  location: 'Hybrid • Austin, TX / Remote',
  aboutRole: `About the Role:
Sentinel Threat Defense is seeking an ambitious Junior SOC Analyst to join our 24/7 Security Operations team. This role is ideal for a Computer Science or STEM graduate looking to launch their career in defensive cybersecurity.

What You Will Do:
- Monitor and triage security alerts across our SIEM (Splunk/Elastic), endpoint detection (EDR), and IDS/IPS sensors.
- Investigate suspicious network activity, phishing reports, and abnormal login events.
- Perform packet captures and deep-dive analysis using Wireshark and tcpdump.
- Write Python or Bash automation scripts to streamline threat intelligence ingestion and ticket enrichment.
- Document incident tickets, escalate high-severity incidents to Tier 2/3 analysts, and draft post-incident summaries.

Qualifications & Requirements:
- Bachelor's degree in Computer Science, Cybersecurity, Information Systems, or equivalent technical discipline.
- Solid understanding of TCP/IP networking protocols, DNS, DHCP, HTTP/S, and standard port mappings.
- Comfort with Linux and Windows operating system internals and command-line interfaces.
- Scripting proficiency in Python or Bash for parsing data and automating repetitive tasks.
- Eagerness to learn cybersecurity frameworks (MITRE ATT&CK, NIST CSF). CompTIA Security+, Network+, or CySA+ is a strong plus.`
};

document.addEventListener('DOMContentLoaded', async () => {
  // DOM Elements
  const tabOverviewBtn = document.getElementById('tabOverviewBtn');
  const tabSettingsBtn = document.getElementById('tabSettingsBtn');
  const tabOverview = document.getElementById('tabOverview');
  const tabSettings = document.getElementById('tabSettings');

  const statusBadge = document.getElementById('statusBadge');
  const statusText = document.getElementById('statusText');
  const setupBanner = document.getElementById('setupBanner');
  const openSettingsLink = document.getElementById('openSettingsLink');
  const nonHandshakeNotice = document.getElementById('nonHandshakeNotice');
  const loadSampleJobBtn = document.getElementById('loadSampleJobBtn');

  const displayJobTitle = document.getElementById('displayJobTitle');
  const displayCompanyName = document.getElementById('displayCompanyName');
  const displayJobLocation = document.getElementById('displayJobLocation');
  const rescrapeBtn = document.getElementById('rescrapeBtn');

  const loadingView = document.getElementById('loadingView');
  const resultsView = document.getElementById('resultsView');

  const scoreNumber = document.getElementById('scoreNumber');
  const scoreCircle = document.getElementById('scoreCircle');
  const scoreTierBadge = document.getElementById('scoreTierBadge');
  const scoreSummary = document.getElementById('scoreSummary');
  const transferableSkillsList = document.getElementById('transferableSkillsList');
  const skillGapsList = document.getElementById('skillGapsList');

  const coverLetterText = document.getElementById('coverLetterText');
  const copyLetterBtn = document.getElementById('copyLetterBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  const copyIcon = document.getElementById('copyIcon');
  const regenerateBtn = document.getElementById('regenerateBtn');
  const toneSelect = document.getElementById('toneSelect');

  // Settings DOM
  const apiKeyInput = document.getElementById('apiKeyInput');
  const toggleKeyVisibility = document.getElementById('toggleKeyVisibility');
  const modelSelect = document.getElementById('modelSelect');
  const resumeInput = document.getElementById('resumeInput');
  const resumeCharCount = document.getElementById('resumeCharCount');
  const loadTemplateResumeBtn = document.getElementById('loadTemplateResumeBtn');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const toast = document.getElementById('toast');

  let currentJobData = null;
  let activeTabUrl = '';

  // Show Toast
  function showToast(msg, isError = false) {
    toast.textContent = msg;
    toast.className = isError ? 'toast error show' : 'toast show';
    setTimeout(() => {
      toast.className = 'toast';
    }, 2800);
  }

  // Tab Switching
  function switchTab(target) {
    if (target === 'settings') {
      tabOverviewBtn.classList.remove('active');
      tabSettingsBtn.classList.add('active');
      tabOverview.classList.remove('active');
      tabSettings.classList.add('active');
    } else {
      tabSettingsBtn.classList.remove('active');
      tabOverviewBtn.classList.add('active');
      tabSettings.classList.remove('active');
      tabOverview.classList.add('active');
    }
  }

  tabOverviewBtn.addEventListener('click', () => switchTab('overview'));
  tabSettingsBtn.addEventListener('click', () => switchTab('settings'));
  if (openSettingsLink) {
    openSettingsLink.addEventListener('click', () => switchTab('settings'));
  }

  // Toggle API Key visibility
  toggleKeyVisibility.addEventListener('click', () => {
    const isPass = apiKeyInput.type === 'password';
    apiKeyInput.type = isPass ? 'text' : 'password';
  });

  // Resume character count updater
  resumeInput.addEventListener('input', () => {
    resumeCharCount.textContent = `${resumeInput.value.length.toLocaleString()} characters`;
  });

  // Pre-fill master resume template
  loadTemplateResumeBtn.addEventListener('click', () => {
    resumeInput.value = SAMPLE_CS_CYBER_RESUME;
    resumeCharCount.textContent = `${resumeInput.value.length.toLocaleString()} characters`;
    showToast('Loaded CS -> Cyber master resume template!');
  });

  // Load Settings from chrome.storage.local
  async function loadSettings() {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['geminiApiKey', 'masterResume', 'preferredModel'], (result) => {
          if (result.geminiApiKey) apiKeyInput.value = result.geminiApiKey;
          if (result.masterResume) {
            resumeInput.value = result.masterResume;
            resumeCharCount.textContent = `${result.masterResume.length.toLocaleString()} characters`;
          }
          if (result.preferredModel) modelSelect.value = result.preferredModel;
          resolve(result);
        });
      } else {
        // Fallback for local testing / simulator
        const savedKey = localStorage.getItem('geminiApiKey') || '';
        const savedResume = localStorage.getItem('masterResume') || '';
        const savedModel = localStorage.getItem('preferredModel') || 'gemini-3.8-flash';
        apiKeyInput.value = savedKey;
        resumeInput.value = savedResume;
        resumeCharCount.textContent = `${savedResume.length.toLocaleString()} characters`;
        modelSelect.value = savedModel;
        resolve({ geminiApiKey: savedKey, masterResume: savedResume, preferredModel: savedModel });
      }
    });
  }

  // Save Settings to chrome.storage.local
  saveSettingsBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    const masterResume = resumeInput.value.trim();
    const preferredModel = modelSelect.value;

    if (!apiKey) {
      showToast('Please provide your Gemini API Key', true);
      apiKeyInput.focus();
      return;
    }
    if (!masterResume) {
      showToast('Please provide your Master Resume', true);
      resumeInput.focus();
      return;
    }

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ geminiApiKey: apiKey, masterResume, preferredModel }, () => {
        showToast('Settings saved successfully!');
        setupBanner.style.display = 'none';
        switchTab('overview');
        // If we have job data, immediately trigger analysis
        if (currentJobData) {
          runGeminiEvaluation(currentJobData, apiKey, masterResume, preferredModel);
        }
      });
    } else {
      localStorage.setItem('geminiApiKey', apiKey);
      localStorage.setItem('masterResume', masterResume);
      localStorage.setItem('preferredModel', preferredModel);
      showToast('Settings saved successfully!');
      setupBanner.style.display = 'none';
      switchTab('overview');
      if (currentJobData) {
        runGeminiEvaluation(currentJobData, apiKey, masterResume, preferredModel);
      }
    }
  });

  // Query Active Tab & Request Scrape
  async function inspectActiveTab() {
    if (typeof chrome === 'undefined' || !chrome.tabs || !chrome.tabs.query) {
      // Running outside Chrome extension environment (e.g. preview)
      displayJobTitle.textContent = SAMPLE_HANDSHAKE_JOB.jobTitle;
      displayCompanyName.textContent = SAMPLE_HANDSHAKE_JOB.companyName;
      displayJobLocation.textContent = SAMPLE_HANDSHAKE_JOB.location;
      currentJobData = SAMPLE_HANDSHAKE_JOB;
      statusBadge.className = 'status-badge active';
      statusText.textContent = 'Simulated Active';
      checkSettingsAndRun();
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
      if (!tab) {
        statusText.textContent = 'No Tab';
        return;
      }

      activeTabUrl = tab.url || '';
      const isHandshake = activeTabUrl.includes('joinhandshake.com');

      if (isHandshake) {
        statusBadge.className = 'status-badge active';
        statusText.textContent = 'Handshake Tab';
        nonHandshakeNotice.style.display = 'none';
      } else {
        statusBadge.className = 'status-badge inactive';
        statusText.textContent = 'External Tab';
        nonHandshakeNotice.style.display = 'flex';
      }

      // Try communicating with content.js
      try {
        chrome.tabs.sendMessage(tab.id, { action: 'scrapeJob' }, (response) => {
          if (chrome.runtime.lastError || !response || !response.success) {
            // Content script may not be loaded yet; inject programmatically
            if (chrome.scripting && tab.id) {
              chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js']
              }, () => {
                // Retry after injection
                setTimeout(() => {
                  chrome.tabs.sendMessage(tab.id, { action: 'scrapeJob' }, (res2) => {
                    handleScrapeResponse(res2, isHandshake);
                  });
                }, 150);
              });
            } else {
              handleScrapeResponse(null, isHandshake);
            }
          } else {
            handleScrapeResponse(response, isHandshake);
          }
        });
      } catch (err) {
        console.warn('Scraping error:', err);
        handleScrapeResponse(null, isHandshake);
      }
    });
  }

  function handleScrapeResponse(response, isHandshake) {
    if (response && response.success && response.data && (response.data.jobTitle || response.data.aboutRole)) {
      currentJobData = response.data;
      displayJobTitle.textContent = currentJobData.jobTitle || 'Job Title Extracted';
      displayCompanyName.textContent = currentJobData.companyName || 'Employer on Handshake';
      displayJobLocation.textContent = currentJobData.location || 'Location Extracted from Page';
      checkSettingsAndRun();
    } else {
      if (isHandshake) {
        displayJobTitle.textContent = 'Handshake Page Detected';
        displayCompanyName.textContent = 'Click on a specific job posting to analyze';
        displayJobLocation.textContent = 'Awaiting job description details';
      } else {
        displayJobTitle.textContent = 'Not on Handshake';
        displayCompanyName.textContent = 'Open app.joinhandshake.com or test sample';
        displayJobLocation.textContent = 'External page';
      }
    }
  }

  // Load sample job button for instant demo
  loadSampleJobBtn.addEventListener('click', () => {
    currentJobData = SAMPLE_HANDSHAKE_JOB;
    displayJobTitle.textContent = SAMPLE_HANDSHAKE_JOB.jobTitle;
    displayCompanyName.textContent = SAMPLE_HANDSHAKE_JOB.companyName;
    displayJobLocation.textContent = SAMPLE_HANDSHAKE_JOB.location;
    nonHandshakeNotice.style.display = 'none';
    showToast('Loaded Junior SOC Analyst posting!');
    checkSettingsAndRun();
  });

  rescrapeBtn.addEventListener('click', () => {
    inspectActiveTab();
    showToast('Re-scanning page elements...');
  });

  // Check if API key & resume are ready, then run analysis
  async function checkSettingsAndRun() {
    const settings = await loadSettings();
    if (!settings.geminiApiKey || !settings.masterResume) {
      setupBanner.style.display = 'flex';
      resultsView.style.display = 'none';
      loadingView.style.display = 'none';
      return;
    }

    setupBanner.style.display = 'none';
    if (currentJobData && currentJobData.aboutRole) {
      runGeminiEvaluation(
        currentJobData,
        settings.geminiApiKey,
        settings.masterResume,
        settings.preferredModel || 'gemini-3.8-flash'
      );
    }
  }

  // Call Gemini API to evaluate job fit and draft cover letter
  async function runGeminiEvaluation(job, apiKey, resume, model = 'gemini-3.8-flash') {
    loadingView.style.display = 'flex';
    resultsView.style.display = 'none';

    const selectedTone = toneSelect.value || 'balanced';

    // System prompt instructing Gemini to act as a career advisor for CS -> Cyber transitions
    const systemPrompt = `You are an expert Cybersecurity Career Advisor, Senior Technical Recruiter, and Transition Specialist. You help Computer Science students and new graduates effectively transition their software engineering, systems, and theoretical CS background into defensive and offensive cybersecurity roles (e.g., SOC Analyst, Incident Responder, Cloud Security, Information Security Analyst, Vulnerability Management).

Your task:
1. Objectively evaluate the candidate's master resume against the scraped Handshake job posting.
2. Determine an accurate "Match Score" from 1 to 100 based on core qualifications, transferable computer science fundamentals (OS, networking, memory management, scripting, Linux, databases), and security skills.
3. Identify transferable Computer Science strengths that directly apply to this security role.
4. Suggest 2-3 specific growth areas, certifications, or tool proficiencies to highlight or study (e.g., CompTIA Security+, Wireshark, Splunk, Linux, TryHackMe).
5. Draft an authentic, persuasive, high-impact cover letter tailored specifically to the company and role, explaining why a Computer Science student with strong technical foundations makes an exceptional cybersecurity asset. Avoid generic fluff. Address the candidate's willingness to learn, projects, and relevant coursework.

TONE REQUIREMENT: ${selectedTone}

IMPORTANT: You must return ONLY a raw JSON object with no markdown fences, no backticks, adhering strictly to this schema:
{
  "matchScore": number (1-100),
  "scoreTier": string (e.g., "High Match", "Strong Transition Potential", "Moderate Fit", or "Development Needed"),
  "matchSummary": string (2-3 punchy sentences summarizing the candidate's fit),
  "transferableSkills": array of strings (3 to 5 key transferable CS skills),
  "skillGapsOrCerts": array of strings (2 to 3 certifications or target skills),
  "coverLetter": string (complete, ready-to-use cover letter text with paragraphs)
}`;

    const userPrompt = `CANDIDATE MASTER RESUME:
${resume}

TARGET HANDSHAKE JOB DETAILS:
Title: ${job.jobTitle || 'Cybersecurity Position'}
Company: ${job.companyName || 'Target Employer'}
Location: ${job.location || 'Not specified'}

ABOUT THE ROLE & REQUIREMENTS:
${job.aboutRole || 'No detailed description provided.'}

Evaluate the fit and generate the tailored cover letter.`;

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

      const requestBody = {
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: 'application/json'
        }
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData.error?.message || `HTTP ${response.status} ${response.statusText}`;
        throw new Error(errMsg);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error('Received empty response from Gemini API.');
      }

      // Parse JSON (clean any accidental markdown fences if returned)
      let cleanedJson = rawText.trim();
      if (cleanedJson.startsWith('```json')) {
        cleanedJson = cleanedJson.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (cleanedJson.startsWith('```')) {
        cleanedJson = cleanedJson.replace(/^```/, '').replace(/```$/, '').trim();
      }

      const result = JSON.parse(cleanedJson);
      renderResults(result);

    } catch (err) {
      console.error('[CyberCareer Advisor] Evaluation failed:', err);
      loadingView.style.display = 'none';
      showToast(`Error: ${err.message}`, true);

      // Offer actionable guidance
      if (err.message.includes('API_KEY_INVALID') || err.message.includes('403') || err.message.includes('400')) {
        setupBanner.style.display = 'flex';
        setupBanner.innerHTML = `<div><strong>API Key Error:</strong> The provided Gemini key is invalid. Please check your key in <span id="reopenSettings" class="banner-link">Settings</span>.</div>`;
        document.getElementById('reopenSettings')?.addEventListener('click', () => switchTab('settings'));
      }
    }
  }

  // Render evaluation results onto the UI
  function renderResults(data) {
    loadingView.style.display = 'none';
    resultsView.style.display = 'flex';

    // 1. Match score & radial conic gradient
    const score = Math.max(1, Math.min(100, Math.round(data.matchScore || 75)));
    scoreNumber.textContent = score;
    scoreCircle.style.setProperty('--score-pct', score);

    // Color gradient based on score tier
    if (score >= 80) {
      scoreCircle.style.background = `conic-gradient(var(--emerald-primary) ${score}%, #1e293b 0)`;
      scoreCircle.style.boxShadow = '0 0 16px var(--emerald-glow)';
      scoreTierBadge.style.background = 'rgba(16, 185, 129, 0.2)';
      scoreTierBadge.style.color = '#34d399';
      scoreTierBadge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
    } else if (score >= 60) {
      scoreCircle.style.background = `conic-gradient(var(--cyan-primary) ${score}%, #1e293b 0)`;
      scoreCircle.style.boxShadow = '0 0 16px var(--cyan-glow)';
      scoreTierBadge.style.background = 'rgba(6, 182, 212, 0.2)';
      scoreTierBadge.style.color = '#38bdf8';
      scoreTierBadge.style.borderColor = 'rgba(6, 182, 212, 0.4)';
    } else {
      scoreCircle.style.background = `conic-gradient(var(--amber-primary) ${score}%, #1e293b 0)`;
      scoreCircle.style.boxShadow = '0 0 16px rgba(245, 158, 11, 0.25)';
      scoreTierBadge.style.background = 'rgba(245, 158, 11, 0.2)';
      scoreTierBadge.style.color = '#fbbf24';
      scoreTierBadge.style.borderColor = 'rgba(245, 158, 11, 0.4)';
    }

    scoreTierBadge.textContent = data.scoreTier || `${score}% Match`;
    scoreSummary.textContent = data.matchSummary || 'Your profile demonstrates strong foundational overlap with this position.';

    // 2. Transferable skills tags
    transferableSkillsList.innerHTML = '';
    (data.transferableSkills || ['Operating Systems', 'Networking', 'Python Scripting']).forEach((skill) => {
      const span = document.createElement('span');
      span.className = 'tag match';
      span.textContent = skill;
      transferableSkillsList.appendChild(span);
    });

    // 3. Recommended skills / certs tags
    skillGapsList.innerHTML = '';
    (data.skillGapsOrCerts || ['CompTIA Security+', 'SIEM Concepts']).forEach((cert) => {
      const span = document.createElement('span');
      span.className = 'tag recommend';
      span.textContent = cert;
      skillGapsList.appendChild(span);
    });

    // 4. Cover Letter
    coverLetterText.value = data.coverLetter || '';
  }

  // Copy to clipboard
  copyLetterBtn.addEventListener('click', async () => {
    const text = coverLetterText.value;
    if (!text) {
      showToast('No cover letter to copy', true);
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      copyBtnText.textContent = 'Copied!';
      copyLetterBtn.style.background = '#10b981';
      showToast('Cover letter copied to clipboard!');
      setTimeout(() => {
        copyBtnText.textContent = 'Copy to Clipboard';
        copyLetterBtn.style.background = '';
      }, 2200);
    } catch (err) {
      coverLetterText.select();
      document.execCommand('copy');
      showToast('Copied to clipboard!');
    }
  });

  // Re-generate on demand
  regenerateBtn.addEventListener('click', async () => {
    const settings = await loadSettings();
    if (!settings.geminiApiKey || !settings.masterResume) {
      switchTab('settings');
      showToast('Please set your API key and resume first', true);
      return;
    }
    if (currentJobData) {
      runGeminiEvaluation(currentJobData, settings.geminiApiKey, settings.masterResume, settings.preferredModel);
      showToast('Regenerating evaluation and cover letter...');
    }
  });

  // Initialize
  await loadSettings();
  inspectActiveTab();
});
