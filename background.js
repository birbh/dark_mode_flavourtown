// browser compatibility
if (typeof chrome === "undefined" && typeof browser !== "undefined") {
  globalThis.chrome = browser;
}

const PROJECT_ID = "13173";
const PING_URL = "https://flavortown.hackclub.com/api/v1";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== "usage-ping") return;
  
  // Check if we already sent a ping this session
  chrome.storage.session.get({ usagePinged: false }, ({ usagePinged }) => {
    if (usagePinged) {
      console.log("Usage already pinged this session, skipping.");
      return;
    }
    
    // Send the ping with custom header
    fetch(PING_URL, {
      method: "POST",
      headers: {
        [`X-Flavortown-Ext-${PROJECT_ID}`]: "true",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ timestamp: Date.now() })
    })
      .then(() => {
        console.log("Usage ping sent successfully");
        chrome.storage.session.set({ usagePinged: true });
      })
      .catch((err) => {
        console.error("Usage ping failed:", err);
      });
  });
});
