// browser compatibility
if (typeof chrome === "undefined" && typeof browser !== "undefined") {
  globalThis.chrome = browser;
}

const toggledark=document.getElementById("toggle");

chrome.storage.local.get({darkModeEnabled:false},({darkModeEnabled})=>{
    toggledark.checked=darkModeEnabled;  

});
toggledark.addEventListener("change",()=>(
  chrome.storage.local.set({darkModeEnabled:toggledark.checked})

));