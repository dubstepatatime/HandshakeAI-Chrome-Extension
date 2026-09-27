# Handshake CyberCareer Advisor - Chrome Extension (Manifest V3)

An automated Chrome Extension designed for Computer Science students and new grads transitioning into Cybersecurity roles on Handshake (`app.joinhandshake.com`).

---

## 🚀 Features

- **Automated Handshake Scraping**: `content.js` automatically extracts the Job Title, Company Name, Location, and "About the Role" text when viewing job postings on Handshake.
- **AI Career Advisor Evaluation**: Evaluates fit using Google's Gemini models (`gemini-2.5-flash` / `gemini-3.8-flash`) with a system prompt customized for CS-to-Cybersecurity career transitions.
- **Match Score (1-100%)**: Visual radial gauge and tier badge (High Match, Strong Potential, etc.) showing alignment.
- **Transferable CS Skills Breakdown**: Highlights how your Computer Science foundation (Operating Systems, Networking protocols, Python/Bash scripting, memory safety, algorithms) translates to defensive or offensive security.
- **Identified Gaps & Recommended Certs**: Identifies certifications to prioritize (e.g., CompTIA Security+, Network+, TryHackMe labs, Splunk, Linux).
- **Tailored Cover Letter Draft**: Generates a high-impact, company-specific cover letter tailored to the exact requirements.
- **1-Click Copy to Clipboard**: Instant copy with feedback toast.
- **Local & Private**: Stored securely in `chrome.storage.local`.

---

## 🛠️ How to Install in Google Chrome (30 Seconds)

1. Open Google Chrome and navigate to `chrome://extensions` in the address bar.
2. Toggle on **"Developer mode"** in the top-right corner.
3. Click the **"Load unpacked"** button in the top-left corner.
4. Select this directory (`/extension` or the unzipped folder containing `manifest.json`).
5. Pin the extension to your Chrome toolbar for easy access!

---

## 🔑 Initial Setup

1. Click on the extension icon in your Chrome toolbar.
2. Switch to the **"Settings & Resume"** tab.
3. Paste your **Gemini API Key** (get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey)).
4. Paste your **Master Resume** text (or click *"Insert CS → Cyber Template"* for a battle-tested template).
5. Click **"Save Settings"**.

---

## 🎯 How to Use on Handshake

1. Go to [app.joinhandshake.com](https://app.joinhandshake.com) and sign in.
2. Search for entry-level cybersecurity roles, such as:
   - *Junior SOC Analyst*
   - *Cybersecurity Associate / Intern*
   - *Information Security Analyst*
   - *Incident Response Analyst*
   - *Cloud Security / DevSecOps Associate*
3. Click on any job posting to view its details.
4. Click the **CyberCareer AI** extension icon in your toolbar.
5. The extension automatically scrapes the page, evaluates your resume against the posting, and displays your match score along with a tailored cover letter draft!
6. Click **"Copy to Clipboard"** and paste it directly into your Handshake application.
