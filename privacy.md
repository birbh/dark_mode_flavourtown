# Privacy Policy for Flavortown Dark Mode

Effective date: 2026-04-25

Flavortown Dark Mode is a browser extension that applies a dark theme on `https://flavortown.hackclub.com/*`.

## What data is processed

1. Local preference storage
- The extension stores a single setting in browser extension storage: whether dark mode is enabled (`darkModeEnabled`).
- Purpose: remember your toggle preference between sessions.

2. Anonymous usage ping
- When dark mode is enabled, the extension may send a basic usage ping to `https://flavortown.hackclub.com/api/v1`.
- Payload: a timestamp and a custom extension-identification header.
- Purpose: measure extension usage at an aggregate level.

## What is not collected
- No account passwords.
- No payment information.
- No browsing history outside the declared host.
- No reading or exfiltration of page form data for unrelated purposes.

## Data sharing
- Data is sent only to the Flavortown service endpoint listed above.
- No sale of personal data.

## Permissions usage
- `storage`: save dark mode preference.
- `tabs`: send toggle updates to the active tab for instant apply/remove.
- `declarativeNetRequest` and `declarativeNetRequestWithHostAccess`: apply a static request-header rule on Flavortown host only.
- Host permission `https://flavortown.hackclub.com/*`: limit operation strictly to Flavortown pages.

## Data retention
- Local preference remains until the user clears extension data or uninstalls the extension.
- Usage ping retention is governed by Flavortown backend retention policy.

## Contact
For privacy questions, contact the extension publisher through the Chrome Web Store support contact listed on the extension page.
