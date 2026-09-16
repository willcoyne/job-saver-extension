# Quick Job Saver 🚀

A Chrome extension that scrapes job postings and logs them straight into a Google Sheets tracker.

## ✨ Features
- **One-Click Scraping:** Pulls Job Title, Company, Location, and URL.
- **Works best on LinkedIn and Handshake**, with tuned selectors for each. Greenhouse, Lever, and most other job boards are covered by a generic fallback that reads the page's structured job data.
- **Google Sheets Integration:** Pushes data directly to your own tracking spreadsheet.
- **Customizable:** Track application status, interest level, and personal notes.

---

## 🛠️ Installation & Setup

Four steps, about five minutes. Do them in order — step 4 needs the URL you copy in step 2.

### 1. Copy the Google Sheet template

1. Click [**this link**](https://docs.google.com/spreadsheets/d/1mqDA8zvrfCSEj9f2D-gnchpdCaJJBz7vcmIIVju91FY/copy) and press **Make a copy**.
2. The copy lands in your own Google Drive. The backend script (`Code.gs`) is already inside it — you don't need to paste any code.

### 2. Deploy the Apps Script

This turns your copy of the sheet into an endpoint the extension can POST to.

1. In your new sheet, click **Extensions → Apps Script**. A new tab opens on the `Code.gs` file.
2. Click **Deploy** (top right) → **New deployment**.
3. Click the ⚙️ gear next to "Select type" and choose **Web app**.
4. Fill in exactly this:
   - **Description:** `Job Saver Backend` (anything works)
   - **Execute as:** **Me** (your email)
   - **Who has access:** **Anyone**

   ⚠️ **"Who has access" must be "Anyone."** "Anyone with a Google account" looks safer but makes the save fail — the extension posts without signing in. Your URL is a long random string, and the script only ever appends rows.
5. Click **Deploy**, then authorize when prompted: **Review permissions** → pick your account → **Advanced** → **Go to _(project name)_ (unsafe)**. That "unsafe" warning appears for every unpublished personal script, including your own.
6. Copy the **Web app URL**. It ends in `/exec` and looks like one of these:
   - Personal Google account: `https://script.google.com/macros/s/AKfy.../exec`
   - School or work (Workspace) account: `https://script.google.com/a/macros/your-school.edu/s/AKfy.../exec`

   **Paste it somewhere you can get to in step 4.** If you lose it, reopen Apps Script → **Deploy → Manage deployments**.

> **If you edit `Code.gs` later**, you must click **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**. The old code keeps running until you do.

### 3. Install the extension in Chrome

The extension isn't on the Chrome Web Store yet, so Chrome loads it from a folder on your computer. The one thing Chrome needs is a folder with `manifest.json` **directly inside it** — both options below give you exactly that.

> ⚠️ **Don't install from the green Code → Download ZIP button.** That archive puts everything one level deeper, and Windows' "Extract All" wraps it in a *second* folder of the same name — pick the outer one and Chrome reports `Manifest file is missing or unreadable`. Use Option A or B instead; neither has a wrapper folder.

#### Option A — download the packaged ZIP (recommended, no terminal)

1. Download **[quick-job-saver.zip](https://github.com/willcoyne/job-saver-extension/releases/latest/download/quick-job-saver.zip)**. This is the packaged build and it's always the current version.
2. Extract it — right-click → **Extract All** on Windows, double-click on macOS. You get one folder, `quick-job-saver`, with `manifest.json` sitting directly inside.
3. Open a new tab, go to `chrome://extensions/`, and turn on **Developer mode** (toggle, top right).
4. Click **Load unpacked** (top left) and select that `quick-job-saver` folder.

#### Option B — one command, prints the folder path for you

**Windows** — open **PowerShell** (Start menu → type `powershell`) and paste this whole line:

```powershell
cd $HOME; iwr https://github.com/willcoyne/job-saver-extension/releases/latest/download/quick-job-saver.zip -OutFile js.zip -UseBasicParsing; Expand-Archive js.zip -DestinationPath .\quick-job-saver -Force; Remove-Item js.zip; (Resolve-Path .\quick-job-saver).Path
```

**macOS / Linux** — open **Terminal** and paste:

```bash
cd ~ && curl -sL https://github.com/willcoyne/job-saver-extension/releases/latest/download/quick-job-saver.zip -o js.zip && unzip -oq js.zip -d quick-job-saver && rm js.zip && cd quick-job-saver && pwd
```

The last line it prints is the folder path — `C:\Users\you\quick-job-saver` on Windows, `/Users/you/quick-job-saver` on macOS. Copy it. Then:

1. Open a new tab and go to `chrome://extensions/`.
2. Turn on **Developer mode** (toggle, top right).
3. Click **Load unpacked** (top left).
4. In the folder picker, paste the path instead of clicking around: on Windows paste it into the **Folder:** box at the bottom and press Enter; on macOS press **⌘⇧G**, paste, press Enter. Then confirm with **Select Folder** / **Select**.

Either way, you should now see **Quick Job Saver 1.2** listed with no red error box.

> **Not sure you're on the right folder?** Open it before selecting. You must see `manifest.json`, `popup.html`, and an `icons` folder sitting right there. If you instead see a single folder with the same name as the one you're in, double-click into it — the inner one is correct.

### 4. Connect the extension to your sheet

1. Click the puzzle-piece 🧩 icon in Chrome's toolbar, find **Quick Job Saver**, and click the pin 📌 so it stays visible.
2. Click the extension icon. It shows **"No Google Sheet connected yet."**
3. Click **Open Settings**.
4. Paste your `/exec` URL from step 2 into **Destination URL**.
5. Leave **Shared Secret (optional)** blank unless you added your own secret check to `Code.gs`.
6. Click **Save Settings**. You should see **Saved!** — if you get a validation error instead, your URL isn't the `/exec` one (compare it against the two shapes shown in step 2).

---

## 🚀 Usage

1. Open a job posting on LinkedIn, Handshake, or most other job boards.
2. Click the extension icon. Company, Job Title, Location, and URL fill in automatically.
3. Anything blank or wrong, type over it — every field is editable except **Job URL**, which is locked to the link that was scraped. **Re-scan Page** retries if the page hadn't finished loading.
4. Set **Status** and **Interest**, add **Notes**, then click **Push to Sheet**.

The button reads **Saved!** and the popup closes. The row appears in your sheet starting at row 13 (rows 1–12 are the dashboard and headers).

---

## 🩺 Troubleshooting

| What you see | Fix |
|---|---|
| `Manifest file is missing or unreadable` | Wrong folder — you picked a wrapper, not the folder holding `manifest.json`. This is what installing from **Code → Download ZIP** does; use step 3 Option A instead. First click **Remove** on the failed `chrome://extensions/` entry — the reload arrow won't clear it. |
| `Could not load icon 'icons/16.png'` | Your download is from before v1.2, or the `icons` folder didn't extract. Re-download with step 3. |
| Extension greys out or vanishes later | You moved, renamed, or deleted the folder. Unpacked extensions load from that exact path every time Chrome starts — keep it where it is. |
| `Save failed: Failed to fetch`, or an error mentioning `<!DOCTYPE` / `not valid JSON` | Almost always **Who has access** — it has to be **Anyone**. On any other setting Google redirects the save to a sign-in page, and the extension gets HTML back instead of JSON. Fix it in **Deploy → Manage deployments → ✏️**, set **Who has access: Anyone**, **Version: New version**, **Deploy**. |
| `Save failed:` anything else | Right-click in the popup → **Inspect** → **Console** for the real error. Check first that Settings holds the `/exec` URL and not the `/dev` one (`/dev` only works while you're signed in) — and note that loading `/exec` in a normal browser tab is *not* a useful test: this script only implements `doPost`, so a plain visit always shows "Script function not found: doGet" even when the deployment is perfectly healthy. |
| Fields come up empty | Click **Re-scan Page** — slow job boards render after the popup opens. Otherwise type the details in; saving works either way. |
| Nothing happens on `chrome://` or the Web Store | Expected. Chrome blocks extensions from reading its own internal pages. |

---

## 📝 License
MIT License
