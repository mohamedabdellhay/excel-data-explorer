// Configuration
const CONFIG = {
  toolUrlPattern: "excel-data-explorer.netlify.app", 
  allowedDomains: ["admin.elghazawy.com", "elghazawy.com"],
  newTabUrl: "chrome://newtab/" 
};

// Track if tool is active
let toolActive = false;

// Check if tool tab exists
async function checkToolActive() {
  const tabs = await chrome.tabs.query({});
  return tabs.some(tab => 
    tab.url && tab.url.includes(CONFIG.toolUrlPattern)
  );
}

// Check if URL is allowed
function isAllowed(url) {
  if (!url) return false;
  if (url === CONFIG.newTabUrl) return true; // Always allow new tabs
  
  try {
    const domain = new URL(url).hostname;
    return CONFIG.allowedDomains.some(allowed => 
      domain === allowed || domain.endsWith(`.${allowed}`)
    );
  } catch {
    return false;
  }
}

// Main cleanup function
async function manageTabs() {
  toolActive = await checkToolActive();
  
  if (!toolActive) {
    console.log("Tool not active - extension inactive");
    chrome.action.setTitle({
      title: "Focused Browsing - Inactive (Tool not detected)"
    });
    return;
  }

  console.log("Tool active - managing tabs");
  chrome.action.setTitle({
    title: "Focused Browsing - Active"
  });

  const tabs = await chrome.tabs.query({});
  const toolTab = tabs.find(tab => 
    tab.url && tab.url.includes(CONFIG.toolUrlPattern)
  );
  
  for (const tab of tabs) {
    if (!tab.url) continue;
    
    // Always keep these tabs:
    // 1. The tool tab
    // 2. New tabs
    // 3. Allowed domains
    if (tab.url.includes(CONFIG.toolUrlPattern) || 
        tab.url === CONFIG.newTabUrl || 
        isAllowed(tab.url)) {
      continue;
    }
    
    // Close other tabs
    try {
      await chrome.tabs.remove(tab.id);
    } catch (error) {
      console.error("Error closing tab:", error);
    }
  }
}

// Listen for tab changes
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    await manageTabs();
  }
});

// Listen for tab creation
chrome.tabs.onCreated.addListener(async (tab) => {
  await manageTabs();
});

// Listen for tab removal
chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  await manageTabs();
});

// Manual trigger
chrome.action.onClicked.addListener(manageTabs);

// Initial check
manageTabs();