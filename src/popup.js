// --- INIT VARIABLES ---
let tabId;
const inspectButton = document.getElementById('inspect');
const previewButton = document.getElementById('preview');
let clickedInspect = false;

// --- UTILITY ---

const promisify = function (thisArg, fnName) {
    const fn = thisArg[fnName];
    return function () {
        return new Promise((resolve, reject) => {
            fn.call(thisArg, ...arguments, function () {
                const lastError = chrome.runtime.lastError;
                if (lastError instanceof Object) {
                    return reject(lastError.message);
                }
                resolve(...arguments);
            });
        });
    };
};

const promisifyNoFail = function (thisArg, fnName, outFn = r => r) {
    const fn = thisArg[fnName];
    return function () {
        return new Promise(resolve => {
            fn.call(thisArg, ...arguments, function () {
                if (chrome.runtime.lastError instanceof Object) {
                    void chrome.runtime.lastError.message;
                }
                resolve(outFn(...arguments));
            });
        });
    };
};

const chromeApi = {
    tabs: {
        executeScript: promisifyNoFail(chrome.tabs, 'executeScript'),
        insertCSS: promisifyNoFail(chrome.tabs, 'insertCSS'),
        query: promisifyNoFail(chrome.tabs, 'query', tabs => Array.isArray(tabs) ? tabs : []),
        sendMessage: promisify(chrome.tabs, 'sendMessage'),
    },
    runtime: {
        sendMessage: promisify(chrome.runtime, 'sendMessage'),
    }
};





// --- METHODS ---

async function onOpen() {
    const tabs = await chromeApi.tabs.query({ active: true, currentWindow: true });
    tabId = tabs[0].id;
    inspectButton.style.backgroundColor = 'green';
}


async function onInspectClick(e) {
    e.preventDefault();
    console.log('-- inizio click --');
    clickedInspect = !clickedInspect

    await inject();

    const msg = clickedInspect ? 'enable' : 'disable';
    console.log('Invio messaggio', msg, tabId)
    //await sendMessage(msg, tabId);
    console.log('messaggio inviato')
    await chromeApi.tabs.sendMessage(tabId, { data: msg })

    inspectButton.style.backgroundColor = clickedInspect ? 'red' : 'green';
    console.log('--- fine click ---')
}

function onPreviewClick(e) {

}

function inject() {
    return new Promise((resolve, reject) => {
        // start listening
        chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
            if (message.loaded === false) {
                await executeScript({ file: 'content.js' });
                await insertCSS({ file: "content.css" });
            }
            resolve(true);
        });
        // ping content script
        executeScript({ code: "chrome.runtime.sendMessage({ loaded: typeof(contentScriptIsLoaded) !== 'undefined' });" });
    });
}


// --- PROMISIFY ---





function sendMessage(msg, tabId = null) {
    return new Promise((resolve, reject) => {
        if (tabId) {
            chrome.tabs.sendMessage(tabId, { data: msg }, data => chrome.runtime.lastError ? console.warn(chrome.runtime.lastError.error) : resolve(data));
        } else {
            chrome.runtime.sendMessage({ data: msg }, resolve);
        }
    });
}

function getCurrentTabId() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            resolve(tabs[0].id);
        });
    });
}

function executeScript(args) {
    return new Promise((resolve, reject) => {
        console.log('Inietto in tab:', tabId)
        chrome.tabs.executeScript(tabId, args, resolve);
    });
}

function insertCSS(args) {
    return new Promise((resolve, reject) => {
        chrome.tabs.insertCSS(tabId, args, resolve);
    });
}

// --- BIND EVENTs ---
window.onload = onOpen;
inspectButton.onclick = onInspectClick;
previewButton.onclick = onPreviewClick;