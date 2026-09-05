const scriptUrlInput = document.getElementById('scriptUrl');
const secretInput = document.getElementById('secret');
const statusEl = document.getElementById('status');

function showStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = type || '';
}

document.addEventListener('DOMContentLoaded', async () => {
  const { scriptUrl, secret } = await chrome.storage.sync.get(['scriptUrl', 'secret']);
  scriptUrlInput.value = scriptUrl || '';
  secretInput.value = secret || '';
});

document.getElementById('saveBtn').addEventListener('click', async () => {
  // Strip a trailing slash so ".../exec/" and ".../exec" both store the same canonical URL.
  const scriptUrl = scriptUrlInput.value.trim().replace(/\/+$/, '');
  const secret = secretInput.value.trim();

  if (!scriptUrl) {
    showStatus('Please enter your Apps Script Web App URL.', 'error');
    return;
  }
  // Personal Google accounts deploy to /macros/s/<id>/exec, while Google Workspace (school or
  // work) accounts deploy to /a/macros/<domain>/s/<id>/exec. Both are valid web app URLs.
  const isAppsScriptUrl = /^https:\/\/script\.google\.com\/(a\/macros\/[^\/]+|macros)\/s\/[^\/]+\/exec$/.test(scriptUrl);
  const isLocalAppUrl = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/.+$/.test(scriptUrl);
  if (!isAppsScriptUrl && !isLocalAppUrl) {
    showStatus('That doesn\'t look like a Google Apps Script /exec URL or a local app URL (http://localhost:PORT/...).', 'error');
    return;
  }

  await chrome.storage.sync.set({ scriptUrl, secret });
  showStatus('Saved!', 'success');
});
