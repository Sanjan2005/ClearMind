# ClearMind — Adult Content Blocker & Clean Habit Tracker

> **A 100% client-side, privacy-first browser extension designed to help you build clean digital habits.**  
> ClearMind operates entirely within your browser — **zero search history stored, zero external analytics, and 100% free for use and open-source development.**

---

## 🌟 Key Features

- 🔒 **100% In-Browser & Privacy-Preserving**: Runs completely on the client side. No data is ever sent to external servers or cloud databases.
- 🚫 **Zero Search Query Storage**: Search terms are evaluated in real-time in memory and discarded immediately. ClearMind **never stores, logs, or tracks your search history or queries**.
- 🛡️ **Dual-Layer Protection**:
  - **Domain-Level Blocking**: Instantly blocks access to known adult websites using Chrome's native `declarativeNetRequest` engine.
  - **Search Query Guard**: Intercepts explicit queries on major search engines (Google, Bing, DuckDuckGo, Yahoo, Brave) before page results load.
- 🧠 **Context-Aware Classification**: Features built-in educational and medical exceptions (e.g., searches about anatomy, reproductive health, or medical textbooks are preserved).
- 📈 **Gamified Clean-Streak Scoring**:
  - **+1 Point & +1 Streak** for every clean day completed.
  - **-5 Point Penalty** and streak reset on the first relapse/block attempt of the day (score is floored at 0; no duplicate penalties on the same day).
  - Keeps track of your **Current Streak** and **All-Time Best Streak**.
- 🆓 **Free & Open Source**: Free to use, fork, inspect, and develop under an open permissive model.

---

## 🔒 Privacy & Data Policy (Guaranteed)

| Principle | How ClearMind Handles It |
| :--- | :--- |
| **Search Queries** | **Never saved.** Queries are checked dynamically via regex in temporary memory and immediately dropped. |
| **Browsing History** | **Never tracked or read.** The extension only acts on specific domain rules and search query parameters. |
| **Where Data Lives** | **Only in your local browser storage (`chrome.storage.local`).** Nothing ever leaves your machine. |
| **Network Requests** | **Zero outgoing telemetry or API calls.** ClearMind has no backend, no telemetry, and no third-party trackers. |
| **Saved Metrics** | Only minimal counters are saved: aggregate score, streak counters, and date keys (e.g. `YYYY-MM-DD`) with anonymous block event counts. |

---

## 🚀 Installation & Setup

ClearMind is built on Chrome **Manifest V3** and runs on Google Chrome, Brave, Microsoft Edge, Opera, and any Chromium-based browser.

### 1. Load Unpacked Extension
1. Clone or download this repository to a folder on your computer:
   ```bash
   git clone https://github.com/your-username/ClearMind-MVP.git
   ```
2. Open your Chromium browser and navigate to:
   ```text
   chrome://extensions
   ```
3. Enable **Developer mode** (toggle switch in the top-right corner).
4. Click **Load unpacked** in the top-left corner.
5. Select the `clearmind-extension` directory (the folder containing `manifest.json`).

### 2. Enable Incognito Protection (Recommended)
1. On the `chrome://extensions` page, click **Details** on the **ClearMind** card.
2. Scroll down and toggle **Allow in Incognito** to **ON**.
3. Pin the ClearMind icon to your browser toolbar for quick access to your streak stats.

---

## 🧪 Testing the Extension

- **Popup Dashboard**: Click the ClearMind toolbar icon to view your current score, active streak, best streak, and blocks recorded today.
- **Domain Blocking**: Visit a domain listed in `clearmind-extension/rules/adult-domains.json` — you will immediately be redirected to the ClearMind `blocked.html` screen.
- **Search Guard**: Try searching for explicit search terms on Google, DuckDuckGo, or Bing. You will be redirected to the block screen without the query ever being saved.
- **Medical / Educational Test**: Search for legitimate topics like `"sexual health textbook"` or `"biology reproductive anatomy"` — these are safely whitelisted and will not trigger a block.

---

## 🧮 How Scoring Works

The tracker processes clean days automatically as calendar days roll forward:

```
[ Yesterday was clean ]   --->  +1 Point  &  +1 to Current Streak
[ First block of today ]  --->  -5 Points &  Current Streak resets to 0 (Floored at 0)
[ Repeated blocks today ] --->  Count increments, but NO additional score penalty
```

*Note: All-time best streak is preserved even if your current streak resets.*

---

## 📁 Project Structure

```text
ClearMind-MVP/
└── clearmind-extension/
    ├── manifest.json            # Manifest V3 configuration & permission declarations
    ├── search-guard.js          # In-memory query evaluation (content script, run_at: document_start)
    ├── tracker.js               # Background service worker for local scoring and streak calculation
    ├── blocked.html / .css / .js # Motivational redirection page when a trigger is caught
    ├── popup.html / .css / .js   # Clean UI popup displaying streak, score, and stats
    └── rules/
        └── adult-domains.json   # DeclarativeNetRequest ruleset for instant domain redirection
```

---

## 🛠️ Development & Contributions

ClearMind is completely free for personal use and open for community development! Contributions, feature ideas, and domain list improvements are welcome.

### Potential Areas for Contribution:
- Expanding domain rules in `rules/adult-domains.json`.
- Refining heuristic regex filters in `search-guard.js` for additional languages and edge cases.
- Adding customizable blocklists and user preferences in an options page.
- Unit testing for edge cases in calendar date roll-forward and timezone changes.

### Contributing:
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

## ⚖️ License & Disclaimers

- **Free & Open Source**: Free for personal use, study, and open-source development.
- **Disclaimer**: ClearMind is a client-side accountability and habit-building assistant. It is designed to create friction and promote mindfulness, not as an enterprise-grade tamper-proof parental lock. Users retain ability to disable extensions via browser settings.
