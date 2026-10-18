# ClearMind browser extension (Milestone 1)

A local-first Chrome/Chromium Manifest V3 prototype for Windows. It redirects a small starter set of adult domains to a ClearMind block page, detects a conservative set of explicit search phrases on supported search engines, and tracks clean-day scoring locally.

## Install in Chrome
1. Extract the ZIP to a folder you will keep, for example `C:\\Projects\\clearmind-extension`.
2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. Select **Load unpacked** and choose the extracted `clearmind-extension` folder (the folder containing `manifest.json`).
5. Click **Details** on the ClearMind card, scroll down, and toggle ON **"Allow in Incognito"**.
6. Pin ClearMind from the Extensions menu.

## Test the MVP
- Open the extension popup and confirm score/streak displays.
- Navigate to a domain listed in `rules/adult-domains.json`; it should redirect to the block page.
- Search a supported engine for a strong phrase such as `explicit videos`; the query should redirect to the block page.
- Search a legitimate phrase such as `sexual health textbook` or `pregnancy medical information`; it should not be blocked by the current phrase rules.

## Scoring behavior
- A day is processed as clean when the next local calendar day begins and no attempt was recorded for it.
- Clean completed day: +1 score and +1 current streak.
- First detected attempt on a day: −5 score, floored at 0, and resets current streak to 0.
- Additional attempts on the same day are counted but do not apply another score penalty.
- Best streak is retained.
- Search text is not saved; local storage retains dates, counts, aggregate score and event categories.

## Important limitations
- This is a prototype, not a tamper-proof parental-control tool. A user can disable/remove the extension or use another browser/profile.
- The adult-domain list is intentionally small and must be maintained/expanded. It is not an exhaustive list.
- Search phrase detection is heuristic, English-focused, and only runs on listed search engines. It may miss euphemisms, other languages, images, video content, and searches on unsupported engines. False positives are possible.
- The search guard runs at `document_start`, but content scripts cannot guarantee that zero pixels of the search page are rendered before redirecting.
- This extension does not inspect page images or block adult content in desktop applications.
- Chrome's declarative network request redirect behavior and extension install errors should be verified in the target browser version; inspect `chrome://extensions` for errors after loading.
- Daily clean points are awarded after a calendar day is completed, when the extension next processes the date change. If the extension isn't opened until later, completed days are processed then.

## Project structure
- `manifest.json` — extension config and permissions
- `rules/adult-domains.json` — starter domain redirect rules
- `search-guard.js` — privacy-preserving query phrase checks
- `tracker.js` — local scoring and streak engine
- `popup.*` — status dashboard
- `blocked.*` — block page

## Next milestone
1. Validate redirect rules on the installed Chrome version.
2. Add a settings page for enabling/disabling search phrase checks and managing user-approved allow/block lists.
3. Add tests for scoring, daylight-saving/time-zone changes, date rollover and false-positive examples.
4. Expand the domain list from a reputable, regularly updated source with a clear update policy.
