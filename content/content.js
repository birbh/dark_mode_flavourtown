// browser compatibility
if (typeof chrome === "undefined" && typeof browser !== "undefined") {
  globalThis.chrome = browser;
}

const STYLE_ID="dark-mode-flavourtown-style";

chrome.storage.local.get({darkModeEnabled:false},({darkModeEnabled})=>{
    if(darkModeEnabled) {
        applyDarkMode();
        // Send usage ping when dark mode is enabled on load
        chrome.runtime.sendMessage({ type: "usage-ping" });
    }
    else removeDarkMode();
});

chrome.storage.onChanged.addListener((changes,area)=>{
    if(area !=="local" || !changes.darkModeEnabled) return;
    if(changes.darkModeEnabled.newValue) {
        applyDarkMode();
        // Send usage ping when user toggles dark mode on
        chrome.runtime.sendMessage({ type: "usage-ping" });
    }
    else removeDarkMode();
});



function applyDarkMode(){
    if(document.getElementById(STYLE_ID)) return; 
    const link=document.createElement("link");
    link.id=STYLE_ID;
    link.rel="stylesheet";
    link.href=chrome.runtime.getURL('styles/dark-mode.css');
    document.head.appendChild(link);
}

function removeDarkMode(){
    const link=document.getElementById(STYLE_ID);
    if(link) 
        link.remove();
}

