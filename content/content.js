// browser compatibility
if (typeof chrome === "undefined" && typeof browser !== "undefined") {
    globalThis.chrome = browser;
}

const STYLE_ID = "dark-mode-flavourtown-style";
const PREF_HINT_KEY = "flavortownDarkModeEnabled";
const INTRO_SEEN_KEY = "flavortownDarkModeIntroSeen";
const NO_PAGE_INTRO_CLASS = "dm-no-page-intro";
const ROUTE_ENTER_CLASS = "dm-route-enter";

let routeTransitionTimer = null;
let routeTransitionHooksReady = false;

if (isIntroSeen()) {
    document.documentElement.classList.add(NO_PAGE_INTRO_CLASS);
}

// Reference-style early apply using cached hint so the stylesheet is attached immediately.
if (getDarkHint()) {
    applyDarkMode();
}

initRouteTransitionHooks();

chrome.storage.local.get({ darkModeEnabled: false }, ({ darkModeEnabled }) => {
    if (darkModeEnabled) {
        applyDarkMode();
        setDarkHint(true);
        markIntroSeen();
        // Send usage ping when dark mode is enabled on load
        chrome.runtime.sendMessage({ type: "usage-ping" });
    } else {
        removeDarkMode();
        setDarkHint(false);
    }
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes.darkModeEnabled) return;

    if (changes.darkModeEnabled.newValue) {
        applyDarkMode();
        setDarkHint(true);
        markIntroSeen();
        // Send usage ping when user toggles dark mode on
        chrome.runtime.sendMessage({ type: "usage-ping" });
    } else {
        removeDarkMode();
        setDarkHint(false);
    }
});

// Instant toggle path from popup without forcing a page reload.
chrome.runtime.onMessage.addListener((msg) => {
    if (msg?.type !== "set-dark-mode") return;

    if (msg.enabled) {
        applyDarkMode();
        setDarkHint(true);
        markIntroSeen();
    } else {
        removeDarkMode();
        setDarkHint(false);
    }
});

function applyDarkMode() {
    if (document.getElementById(STYLE_ID)) return;

    const link = document.createElement("link");
    link.id = STYLE_ID;
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL("styles/dark-mode.css");
    // At document_start, <head> may not exist yet.
    (document.head || document.documentElement).appendChild(link);
}

function removeDarkMode() {
    const link = document.getElementById(STYLE_ID);
    if (link) link.remove();

    document.documentElement.classList.remove(ROUTE_ENTER_CLASS);
    if (routeTransitionTimer) {
        clearTimeout(routeTransitionTimer);
        routeTransitionTimer = null;
    }
}

function getDarkHint() {
    try {
        return localStorage.getItem(PREF_HINT_KEY) === "1";
    } catch {
        return false;
    }
}

function setDarkHint(enabled) {
    try {
        localStorage.setItem(PREF_HINT_KEY, enabled ? "1" : "0");
    } catch {
        // Ignore localStorage errors (privacy mode/blocked storage).
    }
}

function isIntroSeen() {
    try {
        return sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
    } catch {
        return false;
    }
}

function markIntroSeen() {
    try {
        sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
        // Ignore sessionStorage errors.
    }
    document.documentElement.classList.add(NO_PAGE_INTRO_CLASS);
}

function triggerRouteEnterTransition() {
    // Only run route transitions while dark mode stylesheet is active.
    if (!document.getElementById(STYLE_ID)) return;

    document.documentElement.classList.remove(ROUTE_ENTER_CLASS);
    // Force reflow so the animation can replay on repeated navigations.
    void document.documentElement.offsetWidth;
    document.documentElement.classList.add(ROUTE_ENTER_CLASS);

    if (routeTransitionTimer) clearTimeout(routeTransitionTimer);
    routeTransitionTimer = setTimeout(() => {
        document.documentElement.classList.remove(ROUTE_ENTER_CLASS);
        routeTransitionTimer = null;
    }, 460);
}

function initRouteTransitionHooks() {
    if (routeTransitionHooksReady) return;
    routeTransitionHooksReady = true;

    let lastUrl = location.href;

    const onUrlMaybeChanged = () => {
        if (location.href === lastUrl) return;
        lastUrl = location.href;
        triggerRouteEnterTransition();
    };

    const patchHistory = (methodName) => {
        const original = history[methodName];
        if (typeof original !== "function") return;
        history[methodName] = function (...args) {
            const result = original.apply(this, args);
            queueMicrotask(onUrlMaybeChanged);
            return result;
        };
    };

    patchHistory("pushState");
    patchHistory("replaceState");
    window.addEventListener("popstate", onUrlMaybeChanged);
    window.addEventListener("hashchange", onUrlMaybeChanged);

    // Fallback for frameworks that mutate location during view updates.
    const observer = new MutationObserver(() => onUrlMaybeChanged());
    observer.observe(document.documentElement, { childList: true, subtree: true });
}

