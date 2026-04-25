# Flavortown Dark Mode

Stop getting blinded at 2am. This extension slaps a clean, true-black dark theme onto [flavortown-hcb](https://flavortown.hackclub.com) so you can actually use it at night.


## Table of Contents

- [Chrome Web Store](#chrome-web-store)
- [Features](#features)
- [Screenshot](#screenshot)
- [Installation](#installation)
  - [Chrome / Edge / Brave](#chrome--edge--brave)
  - [Firefox](#firefox)
  - [Safari](#safari)
- [How to Use](#how-to-use)
- [Development](#development)


## Chrome Web Store

Install from CWS (recommended):

[Flavortown Dark Mode on Chrome Web Store](https://chromewebstore.google.com/detail/eopjdkbjpeiigmgahegmfmccjbgakmoj/preview?hl=en&authuser=0)


## Features

 True black dark theme — not some washed-out grey, actual dark. 
 Smooth animations
 Remembers your preference 

 ## screenshot
 

## Installation

### Chrome / Edge / Brave

**Load Unpacked**

1. Download the zip from releases
2. Open your browser and go to `chrome://extensions` (or `edge://extensions` / `brave://extensions`)
3. Enable Developer mode 
4. Click Load unpacked
5. Select the folder containing `manifest.json`
6. Done — the extension icon should appear in toolbar

### Firefox

**Load Temporarily**

> temporary add-ons in Firefox are removed when you close the browser. For a permanent install you'd need to sign the extension.

1. Download the zip from releases
2. Open Firefox and go to `about:debugging`
3. Click **This Firefox** in the sidebar
4. Click **Load Temporary Add-on**
5. Navigate to the folder and select `manifest.json`
6. You're good to go — until you restart Firefox

### Safari

1. Download the zip from releases
2. Unzip the folder
3. Open Safari and do CMD + ,
4. Navigate to Settings and check the checkbox saying Show features for web developers
5. Go to the Developer tab
6. Check the Allow unsigned extensions checkbox at the bottom
7. Click Add temporary extension
8. Select the folder you downloaded and unzipped earlier

## How to Use

1. Go to [flavortown.hackclub.com](https://flavortown.hackclub.com)
2. Click the extension icon in your browser toolbar
3. Toggle dark mode on
4. That's  it

The extension only activates on Flavortown ..


## Development

Want to mess with the theme? Everything visual lives in `styles/dark-mode.css`. The palette is defined as CSS variables at the top of the file — change those and the whole theme updates.

```css
--ctp-base: #0d0d0d        /* page background */
--ctp-surface0: #181818    /* cards, inputs */
--ctp-surface1: #222222    /* raised surfaces */
--ctp-text: #e6e6e6        /* primary text */
--ctp-mauve: #d0d0d0       /* accent (silver) */
```

After making changes:
1. Go to your browser's extensions page
2. Hit the reload 
3. Refresh Flavortown to see your changes




Made with caffeine and late night coding
