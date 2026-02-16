# Flavortown Dark Mode

Its browser extension that adds dark mode to flavortown.

## Whats This?

This extension does three things:
1. Makes "flavortown.hackclub.com "dark themed
2. Remembers your preference 

## Installation

### Firefox
1. Download or clone this repo
2. Open Firefox and go to `about:debugging`
3. Click "This Firefox" in the sidebar
4. Click "Load Temporary Add-on"
5. Navigate to the folder and select `manifest.json`
6. Done! (Note: temporary extensions disappear when you close Firefox)

### Chrome/Edge
1. Download or clone this repo
2. Open Chrome and go to `chrome://extensions`
3. Turn on "Developer mode" (top right)
4. Click "Load unpacked"
5. Select the folder containing `manifest.json`
6. You're good to go!

## How to Use

1. Go to flavortown.hackclub.com
2. Click the extension icon in your browser toolbar
3. Toggle "Dark Mode" on
4. Enjoy not being blinded

That's it. The extension only works on flavortown.hackclub.com — it won't mess with other sites.

## How It Works (For the Curious)

Content Script (`content/content.js`)
- Runs only on flavortown.hackclub.com
- Injects a dark theme CSS file when you toggle dark mode on
- Removes it when you toggle it off

Popup (`popup/popup.html` + `popup.js`)
- Simple checkbox toggle
- Saves your preference to browser storage
- No fancy stuff, just works

Background Script (`background.js`)
- Sends ONE ping per browser session when dark mode is active
- Includes the header `X-Flavortown-Ext-13173: true` (this is how Flavortown tracks usage)
- Won't spam — session gate prevents multiple pings

Storage
- Uses `chrome.storage.local` to remember if you have dark mode on
- Uses `chrome.storage.session` to prevent ping spam (resets when you restart the browser)

## Privacy

This extension:
- ✅ Only runs on flavortown.hackclub.com
- ✅ Stores your dark mode preference locally
- ✅ Sends exactly one usage ping per session (timestamp only)
- ❌ Does NOT track your browsing
- ❌ Does NOT collect personal data
- ❌ Does NOT phone home except for the usage ping

## Technical Details

Manifest V3 - Uses the modern extension standard
Browser Compatibility - Works in Firefox, Chrome, Edge, Brave
Permissions - Only needs `storage` + access to flavortown.hackclub.com
No Backend - No server required, just sends a ping to Flavortown's API

## File Structure

```
flavortown-dark-mode/
├── manifest.json          # Extension config
├── background.js          # Handles usage pings
├── content/
│   └── content.js        # Injects dark mode CSS
├── popup/
│   ├── popup.html        # Toggle UI
│   └── popup.js          # Toggle logic
├── styles/
│   └── dark-mode.css     # The actual dark theme
└── README.md             # You are here
```

## Development

Want to tweak the dark theme? Edit `styles/dark-mode.css`.
Want to change the ping behavior? Check `background.js`.
Want to modify the popup? Look at `popup/popup.html` and `popup.js`.

After making changes:
1. Go to your browser's extensions page
2. Click the reload button on this extension
3. Refresh flavortown.hackclub.com to see changes



## Contributing

Found a bug? Want to improve the dark theme? 
PRs welcome!

## License

Check the LICENSE file for details.


Made with late night coding 
