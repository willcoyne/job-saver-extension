let currentConfig = { scriptUrl: '', secret: '' };

function showStatus(message, type) {
  const el = document.getElementById('statusMsg');
  el.textContent = message;
  el.className = type || '';
}

async function runScrape() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  try {
    const injectionResults = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: scrapeJobDetails,
    });

    if (injectionResults && injectionResults[0] && injectionResults[0].result) {
      const scrapedData = injectionResults[0].result;

      document.getElementById('company').value = scrapedData.company || "";
      document.getElementById('title').value = scrapedData.title || "";
      document.getElementById('location').value = scrapedData.location || "";
      document.getElementById('url').value = scrapedData.url || "";

      if (!scrapedData.title && !scrapedData.company) {
        showStatus('Could not find job details on this page — fill them in manually, or try Re-scan.', 'info');
      } else {
        showStatus('', '');
      }
    } else {
      showStatus('No data returned from this page. Fill in fields manually.', 'info');
    }
  } catch (error) {
    console.error("Error running content script:", error);
    showStatus("Can't read this page (it may be a restricted or internal browser page).", 'error');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const { scriptUrl, secret } = await chrome.storage.sync.get(['scriptUrl', 'secret']);
  currentConfig = { scriptUrl: scriptUrl || '', secret: secret || '' };

  if (!currentConfig.scriptUrl) {
    document.getElementById('setupNotice').style.display = 'block';
  }

  document.getElementById('settingsLink').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
  document.getElementById('openSettingsBtn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  document.getElementById('rescanBtn').addEventListener('click', runScrape);

  await runScrape();

  document.getElementById('saveBtn').addEventListener('click', async () => {
    if (!currentConfig.scriptUrl) {
      showStatus('Set your Google Sheet URL in Settings first.', 'error');
      chrome.runtime.openOptionsPage();
      return;
    }

    const saveBtn = document.getElementById('saveBtn');
    saveBtn.innerText = "Saving...";
    saveBtn.disabled = true;
    showStatus('', '');

    const jobData = {
      company: document.getElementById('company').value,
      title: document.getElementById('title').value,
      location: document.getElementById('location').value,
      url: document.getElementById('url').value,
      status: document.getElementById('status').value,
      interest: document.getElementById('interest').value,
      notes: document.getElementById('notes').value
    };
    if (currentConfig.secret) {
      jobData.secret = currentConfig.secret;
    }

    try {
      const response = await fetch(currentConfig.scriptUrl, {
        method: 'POST',
        // Trick Chrome to skip the CORS preflight check
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(jobData)
      });

      if (!response.ok) {
        throw new Error(`Sheet responded with HTTP ${response.status}`);
      }

      const result = await response.json();
      if (result.result === "success" || result.row) {
        saveBtn.innerText = "Saved!";
        saveBtn.style.backgroundColor = "#1b5e20";
        setTimeout(() => window.close(), 1500);
      } else {
        throw new Error(result.error || 'Unknown error from Apps Script');
      }
    } catch (error) {
      console.error("Error saving to sheet:", error);
      showStatus(`Save failed: ${error.message}`, 'error');
      saveBtn.innerText = "Error - Try Again";
      saveBtn.disabled = false;
    }
  });
});

// --- THE SCRAPING ENGINE ---
async function scrapeJobDetails() {
  function extract() {
    const url = window.location.href;
    const hostname = window.location.hostname;
    // Exact-domain or subdomain match only, so e.g. "linkedin.com.evil.example" can't spoof "linkedin.com".
    const isHost = (domain) => hostname === domain || hostname.endsWith('.' + domain);
    let data = { title: "", company: "", location: "", url: url.split('?')[0] };

    try {
      if (isHost("joinhandshake.com")) {
        // 1. HANDSHAKE LOGIC
        const rightPane = document.querySelector('[data-hook="right-content"]') || document.body;

        const titleNode = rightPane.querySelector('h1');
        data.title = titleNode ? titleNode.innerText.trim() : "";

        const companyNode = rightPane.querySelector('a[href*="/employers/"], a[href*="/e/"]');
        if (companyNode) {
            data.company = companyNode.getAttribute('aria-label') || companyNode.innerText.trim();
            data.company = data.company.replace(/, opens in a new tab/i, '').trim();
        }

        const textNodes = Array.from(rightPane.querySelectorAll('div, span, p'));
        const locationNode = textNodes.find(el =>
          el.innerText && (el.innerText.includes('Remote, based in') || el.innerText.match(/^[A-Z][a-zA-Z\s]+, [A-Z]{2}$/))
        );
        if (locationNode) {
          data.location = locationNode.innerText.replace(/Remote.*?based in /i, '').split('\n')[0].trim();
        }

        const handshakeIdMatch = url.match(/\/job-search\/(\d+)/) || url.match(/\/jobs\/(\d+)/);
        if (handshakeIdMatch) {
            data.url = `https://${window.location.hostname}/jobs/${handshakeIdMatch[1]}`;
        }

      } else if (isHost("linkedin.com")) {
        // 2. LINKEDIN LOGIC
        const urlParams = new URLSearchParams(window.location.search);
        const jobId = urlParams.get('currentJobId');
        if (jobId) {
            data.url = `https://www.linkedin.com/jobs/view/${jobId}`;
        }

        const container = document.querySelector('.jobs-search__job-details--container, .job-view-layout, main') || document.body;

        const titleNode = container.querySelector('h1, h2.t-24, .job-details-jobs-unified-top-card__job-title');
        data.title = titleNode ? titleNode.innerText.trim() : "";

        const companyNode = container.querySelector('.job-details-jobs-unified-top-card__company-name a, a[href*="/company/"]');
        data.company = companyNode ? companyNode.innerText.trim() : "";

        const locationMatch = container.innerText.match(/([A-Z][a-zA-Z\s]+,\s*[A-Z]{2})/);
        if (locationMatch) {
            data.location = locationMatch[0].trim();
        } else {
            const descrBlock = container.querySelector('.job-details-jobs-unified-top-card__primary-description');
            if (descrBlock && descrBlock.innerText.includes('·')) {
               data.location = descrBlock.innerText.split('·')[1].trim();
            }
        }

      } else {
        // 3. GENERIC ATS FALLBACK
        let foundJsonLd = false;
        const jsonScripts = document.querySelectorAll('script[type="application/ld+json"]');

        for (let script of jsonScripts) {
            try {
                const json = JSON.parse(script.innerText);
                const jobData = Array.isArray(json) ? json.find(j => j['@type'] === 'JobPosting') : (json['@type'] === 'JobPosting' ? json : null);

                if (jobData) {
                    data.title = jobData.title || "";
                    if (jobData.hiringOrganization && jobData.hiringOrganization.name) {
                        data.company = jobData.hiringOrganization.name;
                    }
                    if (jobData.jobLocation && jobData.jobLocation.address) {
                        const addr = jobData.jobLocation.address;
                        data.location = `${addr.addressLocality || ''}, ${addr.addressRegion || ''}`.replace(/^,\s*|,\s*$/g, '').trim();
                    }
                    foundJsonLd = true;
                    break;
                }
            } catch (e) {}
        }

        if (!foundJsonLd) {
            const h1Node = document.querySelector('h1');
            data.title = h1Node ? h1Node.innerText.trim() : document.title.split(/[-|]/)[0].trim();

            // Company: try obvious class/id names first, then a logo's alt text (e.g. <img alt="Acme Logo">),
            // then "<title> ... at Company" (common on Greenhouse/similar ATS pages), then og:site_name as a last resort.
            const compNode = document.querySelector('[class*="company" i], [id*="company" i], [class*="employer" i]');
            data.company = (compNode && compNode.innerText.trim()) ? compNode.innerText.trim() : "";

            if (!data.company) {
              const logoNode = document.querySelector('img[alt*="logo" i]');
              if (logoNode && logoNode.alt) {
                data.company = logoNode.alt.replace(/logo/i, '').trim();
              }
            }
            if (!data.company) {
              const titleMatch = document.title.match(/\bat\s+(.+)$/i);
              if (titleMatch) data.company = titleMatch[1].trim();
            }
            if (!data.company) {
              const siteNameNode = document.querySelector('meta[property="og:site_name"]');
              if (siteNameNode && siteNameNode.content) data.company = siteNameNode.content.trim();
            }

            // Location: class/id heuristics first, then og:description when it's short enough to plausibly
            // just be a location (e.g. "Remote, United States") rather than a full job-description paragraph.
            const locNode = document.querySelector('[class*="location" i], [id*="location" i]');
            data.location = (locNode && locNode.innerText.trim()) ? locNode.innerText.trim() : "";

            if (!data.location) {
              const ogDescNode = document.querySelector('meta[property="og:description"]');
              const ogDesc = ogDescNode ? ogDescNode.content.trim() : "";
              if (ogDesc && ogDesc.length <= 60 && !ogDesc.includes('.')) {
                data.location = ogDesc;
              }
            }
        }
      }
    } catch (error) {
      console.error("Scraping error:", error);
    }

    return data;
  }

  // Some ATS pages (esp. client-rendered SPAs) haven't finished rendering the job
  // details yet at the moment the popup opens. Retry briefly instead of giving up.
  let data = extract();
  let tries = 0;
  while (!data.title && tries < 5) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    data = extract();
    tries++;
  }

  return data;
}
