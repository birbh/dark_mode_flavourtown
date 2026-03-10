// browser compatibility
if (typeof chrome === "undefined" && typeof browser !== "undefined") {
  globalThis.chrome = browser;
}

const STYLE_ID="dark-mode-flavourtown-style";
const BOOTSTRAP_ID = "dark-mode-flavourtown-bootstrap";
const PREF_HINT_KEY = "flavortownDarkModeEnabled";
const PRELOAD_CLASS = "dm-preload";
const ROUTE_ENTER_CLASS = "dm-route-enter";

let routeTransitionTimer = null;
let routeTransitionHooksReady = false;

// Paint dark immediately to avoid white flash before async storage resolves.
applyBootstrapDark();
initRouteTransitionHooks();

chrome.storage.local.get({darkModeEnabled:false},({darkModeEnabled})=>{
    if(darkModeEnabled) {
        applyDarkMode();
        setDarkHint(true);
        // Send usage ping when dark mode is enabled on load
        chrome.runtime.sendMessage({ type: "usage-ping" });
    }
    else {
        removeDarkMode();
        setDarkHint(false);
    }
});

chrome.storage.onChanged.addListener((changes,area)=>{
    if(area !=="local" || !changes.darkModeEnabled) return;
    if(changes.darkModeEnabled.newValue) {
        applyDarkMode();
        setDarkHint(true);
        // Send usage ping when user toggles dark mode on
        chrome.runtime.sendMessage({ type: "usage-ping" });
    }
    else {
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
        } else {
            removeDarkMode();
            setDarkHint(false);
        }
});



function applyDarkMode(){
    document.documentElement.classList.add(PRELOAD_CLASS);
    if(document.getElementById(STYLE_ID)) return; 
    const link=document.createElement("link");
    link.id=STYLE_ID;
    link.rel="stylesheet";
    link.href=chrome.runtime.getURL('styles/dark-mode.css');
        link.addEventListener("load", () => {
            removeBootstrapDark();
            // Keep preload class for one paint so styles settle without re-animation.
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    document.documentElement.classList.remove(PRELOAD_CLASS);
                });
            });
        }, { once: true });
    // At document_start, <head> may not exist yet.
    (document.head || document.documentElement).appendChild(link);
}

function removeDarkMode(){
    const link=document.getElementById(STYLE_ID);
    if(link) 
        link.remove();
        removeBootstrapDark();
    document.documentElement.classList.remove(PRELOAD_CLASS);
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

function applyBootstrapDark() {
    if (document.getElementById(BOOTSTRAP_ID)) return;
    const style = document.createElement("style");
    style.id = BOOTSTRAP_ID;
    style.textContent = `
        html, body, #__next, main, section, article, aside, nav, header, footer, [class*="page"], [class*="layout"], [class*="container"] {
            background: #0d0d0d !important;
            color: #e6e6e6 !important;
        }

        /* Avoid bright flashes on common card/surface containers during hydration */
        div, form {
            background-color: #0d0d0d;
            border-color: #222222;
        }
    `;
    (document.head || document.documentElement).appendChild(style);
}

function removeBootstrapDark() {
    const style = document.getElementById(BOOTSTRAP_ID);
    if (style) style.remove();
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

