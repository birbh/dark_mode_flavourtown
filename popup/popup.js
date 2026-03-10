

// browser compatibility
if (typeof chrome === "undefined" && typeof browser !== "undefined") {
    globalThis.chrome = browser;
}

const toggledark = document.getElementById("toggle");
const status = document.getElementById("status");

function updateStatus(enabled) {
    if (enabled) {
        status.textContent = "Enabled";
        status.classList.add("on");
    } else {
        status.textContent = "Disabled";
        status.classList.remove("on");
    }
}

chrome.storage.local.get({ darkModeEnabled: false }, ({ darkModeEnabled }) => {
    toggledark.checked = darkModeEnabled;
    updateStatus(darkModeEnabled);
});

toggledark.addEventListener("change", () => {
    const enabled = toggledark.checked;
    chrome.storage.local.set({ darkModeEnabled: enabled });
    updateStatus(enabled);

    // Apply instantly in the active tab without forcing a page reload.
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, { type: "set-dark-mode", enabled });
        }
    });
});