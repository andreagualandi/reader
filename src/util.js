export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getCurrentTabId() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            resolve(tabs[0].id);
        });
    });
}

export function executeScript(tabId, args) {
    return new Promise((resolve, reject) => chrome.tabs.executeScript(tabId, args, resolve));
}

export function insertCSS(tabId, args) {
    return new Promise((resolve, reject) => chrome.tabs.insertCSS(tabId, args, resolve));
}

export function sendMessage(msg, tabId = null) {
    return new Promise((resolve, reject) => {
        if (tabId) {
            chrome.tabs.sendMessage(tabId, msg, (data) => {
                const lastError = chrome.runtime.lastError;
                lastError instanceof Object ? reject(lastError.message) : resolve(data);
            });
        } else {
            chrome.runtime.sendMessage(msg, (data) => {
                const lastError = chrome.runtime.lastError;
                lastError instanceof Object ? reject(lastError.message) : resolve(data);
            });
        }
    });
}