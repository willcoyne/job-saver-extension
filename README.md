# Quick Job Saver 🚀

A Chrome extension that seamlessly scrapes job postings from LinkedIn and Handshake and logs them directly into a Google Sheets tracker.

## ✨ Features
- **One-Click Scraping:** Automatically pulls Job Title, Company, Location, and URL.
- **Google Sheets Integration:** Pushes data directly to your personal tracking spreadsheet.
- **Customizable:** Easily track application status, interest level, and personal notes.

## 🛠️ Installation & Setup Guide

### 1. Set Up Your Google Sheet
1. **Duplicate the Template:** Click [here](https://docs.google.com/spreadsheets/d/1mqDA8zvrfCSEj9f2D-gnchpdCaJJBz7vcmIIVju91FY/copy) to make a copy of the official tracker template. 
2. *Note:* This template already includes the necessary backend Apps Script (`code.gs`) pre-installed.

### 2. Deploy the Google Apps Script
1. In your new Google Sheet, click **Extensions > Apps Script** in the top menu.
2. Click the **Deploy** button in the top right corner and select **New deployment**.
3. Click the gear icon ⚙️ next to "Select type" and choose **Web app**.
4. Configure the deployment exactly as follows:
   - **Description:** Job Saver Backend (or anything you like)
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone
5. Click **Deploy**. *(Note: Google will ask you to authorize the script. Click "Review permissions", select your account, click "Advanced", and then click "Go to script" to bypass the safety warning).*
6. **Copy the Web app URL** (it ends in `/exec`). Keep this safe; you will need it in Step 4.

### 3. Install the Chrome Extension
Since this extension is loaded locally for now, follow these steps to add it to your browser:
1. Download this repository as a `.zip` (**Code > Download ZIP**) and extract it, or clone it with Git.
2. Open Google Chrome and type `chrome://extensions/` into the URL bar.
3. Toggle on **Developer mode** in the top right corner.
4. Click the **Load unpacked** button in the top left.
5. Select the folder that **directly contains `manifest.json`**.

> ⚠️ **Getting "Manifest file is missing or unreadable"?**
> You almost certainly picked the wrong folder. Extracting the ZIP usually creates a
> *nested* folder — `job-saver-extension-main\job-saver-extension-main\` — and only the
> **inner** one holds `manifest.json`. Open the folder you are about to select: if you can
> see `manifest.json`, `popup.html`, and the `icons` folder inside it, that is the right
> one. If you only see another folder with the same name, double-click into it first.

### 4. Configure the Extension
1. Pin the **Quick Job Saver** extension to your Chrome toolbar for easy access.
2. Click the extension icon. You will see a notice saying *"No Google Sheet connected yet"*.
3. Click **Open Settings** (or right-click the extension icon and select **Options**).
4. In the **Destination URL** field, paste the Google Apps Script Web App URL (`.../exec`) you copied in Step 2.
5. Click **Save Settings**.

## 🚀 Usage
1. Navigate to a job posting on LinkedIn or Handshake.
2. Click the extension icon to automatically extract the job details.
3. Add any quick notes, select your application status, and choose your interest level.
4. Click **Push to Sheet** to log the application directly into your tracker!

## 📝 License
MIT License
