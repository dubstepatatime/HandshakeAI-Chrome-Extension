/**
 * Handshake CyberCareer Advisor - Content Script
 * Runs on https://app.joinhandshake.com/* and https://*.joinhandshake.com/*
 * Extracts job title, company name, and "About the Role" text.
 */

(function () {
  'use strict';

  // Helper function to clean extracted text
  function cleanText(text) {
    if (!text) return '';
    return text
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\s*\n+/g, '\n\n')
      .trim();
  }

  // Scrapes job details from Handshake DOM
  function scrapeHandshakeJob() {
    const result = {
      jobTitle: '',
      companyName: '',
      aboutRole: '',
      location: '',
      jobUrl: window.location.href,
      scrapedAt: new Date().toISOString(),
      isHandshake: window.location.hostname.includes('joinhandshake.com')
    };

    try {
      // 1. Extract Job Title
      // Handshake uses data-hook="job-title" or dedicated h1 elements
      const titleSelectors = [
        '[data-hook="job-title"]',
        'h1[class*="job-title"]',
        'h1[class*="title"]',
        '[data-testid="job-details-title"]',
        '[data-hook="job-details-pane"] h1',
        '.style__job-title___1o-a9',
        '.style__job-title',
        'main h1',
        'h1'
      ];

      for (const sel of titleSelectors) {
        const el = document.querySelector(sel);
        if (el && el.textContent.trim()) {
          result.jobTitle = cleanText(el.textContent);
          break;
        }
      }

      // 2. Extract Company Name
      const employerSelectors = [
        '[data-hook="employer-name"]',
        '[data-hook="job-details-employer"]',
        'a[href*="/employers/"]',
        'a[href*="/employer/"]',
        '[class*="employer-name"]',
        '.style__employer-name___2_aR_',
        '.style__employer-name',
        '[data-testid="employer-name"]',
        '[aria-label="Employer"]'
      ];

      for (const sel of employerSelectors) {
        const el = document.querySelector(sel);
        if (el && el.textContent.trim()) {
          result.companyName = cleanText(el.textContent);
          break;
        }
      }

      // 3. Extract Location (if available)
      const locationSelectors = [
        '[data-hook="job-location"]',
        '[class*="location"]',
        '[data-testid="job-location"]',
        '[aria-label="Location"]'
      ];
      for (const sel of locationSelectors) {
        const el = document.querySelector(sel);
        if (el && el.textContent.trim()) {
          result.location = cleanText(el.textContent);
          break;
        }
      }

      // 4. Extract "About the Role" / Job Description
      // Strategy A: Find elements with data-hook or specific description classes
      const descSelectors = [
        '[data-hook="job-description"]',
        '[data-hook="truncated-text"]',
        '.style__description___1K4R5',
        '[class*="job-description"]',
        '[class*="description-body"]',
        '[data-testid="job-description"]',
        '#job-description'
      ];

      for (const sel of descSelectors) {
        const el = document.querySelector(sel);
        if (el && el.innerText.trim().length > 50) {
          result.aboutRole = cleanText(el.innerText);
          break;
        }
      }

      // Strategy B: If not found by selector, search by section headings
      if (!result.aboutRole || result.aboutRole.length < 50) {
        const headings = Array.from(document.querySelectorAll('h2, h3, h4, strong, [class*="heading"]'));
        const targetHeading = headings.find(h => {
          const t = (h.textContent || '').toLowerCase().trim();
          return t.includes('about the role') || t.includes('job description') || t.includes('role description') || t.includes('what you’ll do') || t.includes('what you will do');
        });

        if (targetHeading) {
          // Look for container or next siblings
          let parent = targetHeading.parentElement;
          if (parent) {
            // Find text below this heading
            const text = parent.innerText || '';
            if (text.length > 50) {
              result.aboutRole = cleanText(text);
            }
          }
        }
      }

      // Strategy C: Fallback to main content container if specific sections aren't identifiable
      if (!result.aboutRole || result.aboutRole.length < 50) {
        const mainPane = document.querySelector('[data-hook="job-details-pane"], [role="main"], main, .job-details');
        if (mainPane) {
          const text = mainPane.innerText || '';
          if (text.length > 80) {
            result.aboutRole = cleanText(text.slice(0, 4000));
          }
        }
      }

      // Final sanity checks & title fallback from document.title
      if (!result.jobTitle && document.title) {
        const parts = document.title.split('|')[0].split(' - ');
        if (parts[0]) result.jobTitle = parts[0].trim();
        if (parts[1] && !result.companyName) result.companyName = parts[1].trim();
      }

    } catch (err) {
      console.error('[CyberCareer Advisor] Error scraping Handshake page:', err);
    }

    return result;
  }

  // Listen for messages from popup.js
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'scrapeJob' || request.action === 'ping') {
      const scrapedData = scrapeHandshakeJob();
      
      const hasContent = !!(scrapedData.jobTitle || scrapedData.aboutRole);
      sendResponse({
        success: true,
        hasJobContent: hasContent,
        data: scrapedData
      });
    }
    return true; // Keep message channel open for async response
  });

  // Log confirmation on injection
  console.log('[CyberCareer Advisor] Content script active on Handshake');
})();
