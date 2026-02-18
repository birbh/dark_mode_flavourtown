

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
    chrome.storage.local.set({ darkModeEnabled: toggledark.checked });
    updateStatus(toggledark.checked);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) chrome.tabs.reload(tabs[0].id);
    });
});