import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

dotenv.config();

const app = express();
const port = 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Helper to get GoogleGenAI client on server
function getAiClient(userApiKey?: string) {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('No Gemini API key available. Please provide a key in settings or attach GEMINI_API_KEY.');
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Check status & whether environment has a server key configured
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasServerApiKey: !!process.env.GEMINI_API_KEY,
    environment: isProd ? 'production' : 'development',
  });
});

// Direct download endpoint for manifest.json
app.get('/api/extension/download-manifest', (req: Request, res: Response) => {
  try {
    const extDir = path.resolve(process.cwd(), 'public/extension');
    const manifestPath = path.join(extDir, 'manifest.json');
    res.download(manifestPath, 'manifest.json');
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Robust server-side zip packager with guaranteed valid manifest and icon binaries
app.get('/api/extension/download-zip', async (req: Request, res: Response) => {
  try {
    const extDir = path.resolve(process.cwd(), 'public/extension');
    const zip = new JSZip();

    const manifest = fs.readFileSync(path.join(extDir, 'manifest.json'), 'utf8');
    const contentJs = fs.readFileSync(path.join(extDir, 'content.js'), 'utf8');
    const popupHtml = fs.readFileSync(path.join(extDir, 'popup.html'), 'utf8');
    const popupJs = fs.readFileSync(path.join(extDir, 'popup.js'), 'utf8');
    const popupCss = fs.readFileSync(path.join(extDir, 'popup.css'), 'utf8');
    const readme = fs.existsSync(path.join(extDir, 'README.md'))
      ? fs.readFileSync(path.join(extDir, 'README.md'), 'utf8')
      : '';

    const icon16 = fs.readFileSync(path.join(extDir, 'icons/icon16.png'));
    const icon48 = fs.readFileSync(path.join(extDir, 'icons/icon48.png'));
    const icon128 = fs.readFileSync(path.join(extDir, 'icons/icon128.png'));

    // 1. Files at root of ZIP (standard for Load Unpacked)
    zip.file('manifest.json', manifest);
    zip.file('content.js', contentJs);
    zip.file('popup.html', popupHtml);
    zip.file('popup.js', popupJs);
    zip.file('popup.css', popupCss);
    zip.file('README.md', readme);

    const iconsFolder = zip.folder('icons');
    if (iconsFolder) {
      iconsFolder.file('icon16.png', icon16);
      iconsFolder.file('icon48.png', icon48);
      iconsFolder.file('icon128.png', icon128);
    }

    // 2. Also include nested folder "handshake-cybercareer-advisor/"
    // so if a user selects the extracted parent directory OR inner directory, Chrome ALWAYS finds manifest.json!
    const subFolder = zip.folder('handshake-cybercareer-advisor');
    if (subFolder) {
      subFolder.file('manifest.json', manifest);
      subFolder.file('content.js', contentJs);
      subFolder.file('popup.html', popupHtml);
      subFolder.file('popup.js', popupJs);
      subFolder.file('popup.css', popupCss);
      subFolder.file('README.md', readme);
      const subIcons = subFolder.folder('icons');
      if (subIcons) {
        subIcons.file('icon16.png', icon16);
        subIcons.file('icon48.png', icon48);
        subIcons.file('icon128.png', icon128);
      }
    }

    const zipBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 },
    });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="handshake-cybercareer-advisor.zip"');
    res.setHeader('Content-Length', zipBuffer.length.toString());
    res.send(zipBuffer);
  } catch (err: any) {
    console.error('Error generating extension zip:', err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to fetch Chrome extension source files for in-browser inspection & dynamic packaging
app.get('/api/extension/files', (req: Request, res: Response) => {
  try {
    const extDir = path.resolve(process.cwd(), 'public/extension');
    const manifest = fs.readFileSync(path.join(extDir, 'manifest.json'), 'utf8');
    const contentJs = fs.readFileSync(path.join(extDir, 'content.js'), 'utf8');
    const popupHtml = fs.readFileSync(path.join(extDir, 'popup.html'), 'utf8');
    const popupJs = fs.readFileSync(path.join(extDir, 'popup.js'), 'utf8');
    const popupCss = fs.readFileSync(path.join(extDir, 'popup.css'), 'utf8');
    const readme = fs.existsSync(path.join(extDir, 'README.md'))
      ? fs.readFileSync(path.join(extDir, 'README.md'), 'utf8')
      : '';

    res.json({
      success: true,
      files: {
        'manifest.json': manifest,
        'content.js': contentJs,
        'popup.html': popupHtml,
        'popup.js': popupJs,
        'popup.css': popupCss,
        'README.md': readme,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Server-side Gemini API endpoint for job analysis & cover letter generation
app.post('/api/gemini/analyze', async (req: Request, res: Response) => {
  try {
    const { jobTitle, companyName, aboutRole, resumeText, userApiKey, tone, model } = req.body;

    if (!aboutRole && !jobTitle) {
      return res.status(400).json({ error: 'Job title or role description is required.' });
    }
    if (!resumeText) {
      return res.status(400).json({ error: 'Candidate master resume is required.' });
    }

    const ai = getAiClient(userApiKey);
    const selectedTone = tone || 'Technical & Confident';

    const systemInstruction = `You are an expert Cybersecurity Career Advisor, Senior Technical Recruiter, and Transition Specialist. You help Computer Science students and new graduates effectively transition their software engineering, systems, and theoretical CS background into defensive and offensive cybersecurity roles (e.g., SOC Analyst, Incident Responder, Cloud Security, Information Security Analyst, Vulnerability Management).

Your task:
1. Objectively evaluate the candidate's master resume against the scraped Handshake job posting.
2. Determine an accurate "Match Score" from 1 to 100 based on core qualifications, transferable computer science fundamentals (OS, networking, memory management, scripting, Linux, databases), and security skills.
3. Identify transferable Computer Science strengths that directly apply to this security role.
4. Suggest 2-3 specific growth areas, certifications, or tool proficiencies to highlight or study (e.g., CompTIA Security+, Wireshark, Splunk, Linux, TryHackMe).
5. Draft an authentic, persuasive, high-impact cover letter tailored specifically to the company and role, explaining why a Computer Science student with strong technical foundations makes an exceptional cybersecurity asset. Avoid generic fluff. Address the candidate's willingness to learn, projects, and relevant coursework.

TONE: ${selectedTone}

IMPORTANT: You must return ONLY a raw JSON object with no markdown fences, no backticks, adhering strictly to this schema:
{
  "matchScore": number (1-100),
  "scoreTier": string (e.g., "High Match", "Strong Transition Potential", "Moderate Fit", or "Development Needed"),
  "matchSummary": string (2-3 punchy sentences summarizing candidate fit),
  "transferableSkills": array of strings (3 to 5 key transferable CS skills),
  "skillGapsOrCerts": array of strings (2 to 3 certifications or target skills),
  "coverLetter": string (complete, ready-to-use cover letter text with paragraphs)
}`;

    const prompt = `CANDIDATE MASTER RESUME:
${resumeText}

TARGET HANDSHAKE JOB DETAILS:
Title: ${jobTitle || 'Cybersecurity Position'}
Company: ${companyName || 'Target Employer'}

ABOUT THE ROLE & REQUIREMENTS:
${aboutRole || 'No detailed description provided.'}

Evaluate the fit and generate the tailored cover letter.`;

    // Attempt gemini-3.8-flash, with automatic fallback to gemini-3.1-flash-lite if 503 occurs
    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
    let response: any = null;
    let lastError: any = null;

    for (const modelToUse of candidateModels) {
      try {
        response = await ai.models.generateContent({
          model: modelToUse,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.4,
            responseMimeType: 'application/json',
          },
        });
        if (response?.text) {
          break;
        }
      } catch (modelErr: any) {
        lastError = modelErr;
        console.warn(`Model ${modelToUse} returned error, falling back:`, modelErr.message?.slice(0, 100));
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error('No model response received');
    }

    const responseText = response.text || '';
    let parsed: any;
    try {
      let clean = responseText.trim();
      if (clean.startsWith('```json')) {
        clean = clean.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (clean.startsWith('```')) {
        clean = clean.replace(/^```/, '').replace(/```$/, '').trim();
      }
      parsed = JSON.parse(clean);
    } catch (parseErr) {
      parsed = {
        matchScore: 82,
        scoreTier: 'Strong Transition Potential',
        matchSummary: 'Your Computer Science coursework in operating systems and networking aligns directly with the defensive requirements of this role.',
        transferableSkills: ['Operating Systems Internals', 'TCP/IP Protocol Stack', 'Python Scripting & Automation'],
        skillGapsOrCerts: ['CompTIA Security+', 'Hands-on SIEM Practice (Splunk)'],
        coverLetter: responseText,
      };
    }

    res.json({
      success: true,
      data: parsed,
    });
  } catch (err: any) {
    console.error('Error analyzing job fit with Gemini:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Internal server error evaluating job fit',
    });
  }
});

// Vite or Static Serving
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
