// Configuration
const CONFIG = {
  requiredDomains: ["admin.elghazawy.com", "elghazawy.com"],
  checkInterval: 60, // minutes
  checkTimeout: 3000, // milliseconds
  toolIdentifier: "https://excel-data-explorer.netlify.app/" // Replace with your tool's URL pattern
};

// State
let domainsAvailable = false;
let activeSession = false;

// Check if a single domain is reachable
async function checkDomain(domain) {
  try {
    const url = `https://${domain}/health-check?t=${Date.now()}`;
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store'
    });
    return true;
  } catch (error) {
    console.log(`Domain ${domain} not reachable`, error);
    return false;
  }
}

// Check all required domains
async function checkRequiredDomains() {
  const checks = CONFIG.requiredDomains.map(domain => 
    Promise.race([
      checkDomain(domain),
      new Promise(resolve => setTimeout(() => resolve(false), CONFIG.checkTimeout))
    ])
  );
  
  const results = await Promise.all(checks);
  return results.every(Boolean);
}

// Update extension state
async function updateExtensionState() {
  const allAvailable = await checkRequiredDomains();
  
  domainsAvailable = allAvailable;
  
  chrome.action.setTitle({
    title: allAvailable 
      ? "Conditional Tab Manager - Active (Elghazawy domains available)"
      : "Conditional Tab Manager - Inactive"
  });
  
  chrome.action.setIcon({
    path: {
      "16": `icons/icon${allAvailable ? '-active' : ''}16.png`,
      "48": `icons/icon${allAvailable ? '-active' : ''}48.png`,
      "128": `icons/icon${allAvailable ? '-active' : ''}128.png`
    }
  });
  
  return allAvailable;
}

// Conditional tab cleanup
async function conditionalTabCleanup() {
  const shouldActivate = await updateExtensionState();
  
  if (!shouldActivate) {
    console.log("Required domains not all available - extension inactive");
    return;
  }

  console.log("All required domains available - activating tab management");
  activeSession = true;
  
  const tabs = await chrome.tabs.query({});
  const toolTab = tabs.find(tab => 
    tab.url && tab.url.includes(CONFIG.toolIdentifier)
  );
  
  for (const tab of tabs) {
    const isAllowed = CONFIG.requiredDomains.some(domain => 
      tab.url && new URL(tab.url).hostname.includes(domain)
    );
    
    if (!isAllowed) {
      // Keep the tool tab open if found
      if (toolTab && tab.id === toolTab.id) continue;
      
      try {
        await chrome.tabs.remove(tab.id);
      } catch (error) {
        console.error("Error closing tab:", error);
      }
    }
  }
}

// Initialize
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('domainCheck', { periodInMinutes: CONFIG.checkInterval });
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'domainCheck') {
    conditionalTabCleanup();
  }
});

// Manual trigger
chrome.action.onClicked.addListener(conditionalTabCleanup);

// Optional: Listen for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (activeSession && changeInfo.url) {
    const isAllowed = CONFIG.requiredDomains.some(domain => 
      changeInfo.url.includes(domain)
    );
    
    if (!isAllowed) {
      try {
        await chrome.tabs.remove(tabId);
      } catch (error) {
        console.error("Error closing newly opened tab:", error);
      }
    }
  }
});