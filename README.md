<div align="center">

<img src="icons/128.png" width="96" alt="Quick Job Saver icon">

# Quick Job Saver

**Save any job posting to your own Google Sheet in one click.**

[![Latest release](https://img.shields.io/github/v/release/willcoyne/job-saver-extension?label=download&color=2e7d32)](https://github.com/willcoyne/job-saver-extension/releases/latest/download/quick-job-saver.zip)
![Chrome](https://img.shields.io/badge/Chrome-Manifest%20V3-4285F4?logo=googlechrome&logoColor=white)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

### [⬇️ Download quick-job-saver.zip](https://github.com/willcoyne/job-saver-extension/releases/latest/download/quick-job-saver.zip)

</div>

---

## ✨ What it does

Open a job posting, click the extension, and it fills in **Company, Job Title, Location, and URL** for you. Add a status, interest level, and notes, then hit **Push to Sheet** — a new row lands in your tracker.

- 🎯 **Tuned for LinkedIn and Handshake**
- 🌐 **Works on Greenhouse, Lever, and most other job boards** by reading the page's structured job data
- 📊 **Your data stays yours** — it goes straight to a Google Sheet in your own Drive
- ✏️ **Everything is editable** before you save

---

## 🛠️ Setup (about 5 minutes)

Do these in order — step 4 needs the URL from step 2.

| Step | What you do | Time |
|:---:|---|:---:|
| **1** | Copy the Google Sheet template | 30 sec |
| **2** | Deploy the sheet's script as a web app | 2 min |
| **3** | Install the extension in Chrome | 1 min |
| **4** | Paste your web app URL into the extension | 30 sec |

### Step 1 — Copy the Google Sheet

👉 **[Click here to make a copy of the template](https://docs.google.com/spreadsheets/d/1mqDA8zvrfCSEj9f2D-gnchpdCaJJBz7vcmIIVju91FY/copy)**, then press **Make a copy**.

The script the extension talks to is already inside the copy — no code to paste.

### Step 2 — Deploy the script

1. In your new sheet, click **Extensions → Apps Script**.
2. Click **Deploy** (top right) → **New deployment**.
3. Click the ⚙️ gear next to "Select type" → **Web app**.
4. Set:
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`

   > ⚠️ **It must be "Anyone"** — not "Anyone with a Google account." The other option makes every save fail. Your URL is a long random string and the script can only add rows.

5. Click **Deploy** and allow access: **Review permissions** → your account → **Advanced** → **Go to _(project name)_ (unsafe)**. The "unsafe" warning shows for every personal script, including your own.
6. **Copy the Web app URL** (it ends in `/exec`) and keep it handy for step 4.

<details>
<summary>What the URL should look like / lost it?</summary>

- Personal Google account: `https://script.google.com/macros/s/AKfy.../exec`
- School or work account: `https://script.google.com/a/macros/your-school.edu/s/AKfy.../exec`

Lost it? Reopen Apps Script → **Deploy → Manage deployments**.

</details>

### Step 3 — Install the extension

1. **[Download quick-job-saver.zip](https://github.com/willcoyne/job-saver-extension/releases/latest/download/quick-job-saver.zip)**.
2. **Unzip it** — right-click → **Extract All** (Windows) or double-click (Mac). You'll get a folder called `quick-job-saver`.
3. **Move that folder somewhere permanent** (e.g. Documents). Chrome loads it from there every time — if you delete or move it later, the extension breaks.
4. In Chrome, go to **`chrome://extensions`** and switch on **Developer mode** (top right).
5. Click **Load unpacked** (top left) and pick the `quick-job-saver` folder.

✅ You should see **Quick Job Saver** in the list with no red error.

> ❗ **Don't use GitHub's green "Code → Download ZIP" button.** It nests the files an extra folder deep and Chrome will say `Manifest file is missing or unreadable`. Use the download link above.

<details>
<summary>Prefer the terminal? One-line install</summary>

**Windows (PowerShell):**

```powershell
cd $HOME; iwr https://github.com/willcoyne/job-saver-extension/releases/latest/download/quick-job-saver.zip -OutFile js.zip -UseBasicParsing; Expand-Archive js.zip -DestinationPath .\quick-job-saver -Force; Remove-Item js.zip; (Resolve-Path .\quick-job-saver).Path
```

**macOS / Linux:**

```bash
cd ~ && curl -sL https://github.com/willcoyne/job-saver-extension/releases/latest/download/quick-job-saver.zip -o js.zip && unzip -oq js.zip -d quick-job-saver && rm js.zip && cd quick-job-saver && pwd
```

It prints the folder path. In the **Load unpacked** picker, paste it into the **Folder:** box (Windows) or press **⌘⇧G** and paste (Mac).

</details>

<details>
<summary>Not sure you picked the right folder?</summary>

Open it first. You should see `manifest.json`, `popup.html`, and an `icons` folder right there. If you only see another folder with the same name, go inside it — that inner one is correct.

</details>

### Step 4 — Connect it to your sheet

1. Click the 🧩 puzzle icon in Chrome's toolbar and 📌 pin **Quick Job Saver**.
2. Click the extension icon → **Open Settings**.
3. Paste your `/exec` URL into **Destination URL** and click **Save Settings**.

✅ You'll see **Saved!** Leave **Shared Secret** blank unless you added your own secret check to the script.

---

## 🚀 Using it

1. Open a job posting.
2. Click the extension icon — the details fill in automatically. (Blank? Click **Re-scan Page**, or just type them in.)
3. Pick a **Status** and **Interest**, add **Notes**.
4. Click **Push to Sheet**.

The row appears in your sheet starting at row 13 (rows 1–12 are the dashboard and headers).

---

## 🩺 Troubleshooting

| Problem | Fix |
|---|---|
| `Manifest file is missing or unreadable` | You picked the wrong folder (usually from **Code → Download ZIP**). **Remove** the broken entry in `chrome://extensions`, then redo step 3 with the release ZIP. |
| `Could not load icon 'icons/16.png'` | Old download or the `icons` folder didn't extract. Re-download from step 3. |
| Extension disappears or greys out later | The folder was moved, renamed, or deleted. Put it back or reinstall. |
| `Save failed: Failed to fetch`, or mentions `<!DOCTYPE` / `not valid JSON` | **Who has access** isn't **Anyone**. Fix in **Deploy → Manage deployments → ✏️**, set **Anyone**, **Version: New version**, **Deploy**. |
| `Save failed:` something else | Make sure Settings has the `/exec` URL (not `/dev`). For details: right-click the popup → **Inspect** → **Console**. Note: opening the `/exec` URL in a tab always shows "Script function not found: doGet" — that's normal. |
| Settings says the URL doesn't look right | You copied the wrong link. It must start with `https://script.google.com/` and end in `/exec`. |
| Fields come up empty | Click **Re-scan Page** — some sites load slowly. You can always type the details in. |
| Nothing happens on `chrome://` pages or the Web Store | Expected — Chrome blocks extensions there. |

> **Edited the script (`Code.gs`)?** Changes don't go live until you **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**.

---

## 📝 License

[MIT](LICENSE)
